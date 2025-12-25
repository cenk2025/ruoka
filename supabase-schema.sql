-- Supabase Database Schema for Food Analyzer with Health Tests

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FOOD ANALYSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS food_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_food_analyses_user_id ON food_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_food_analyses_created_at ON food_analyses(created_at DESC);

-- ============================================
-- HEALTH TESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS health_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'bmi', 'bmr', 'tdee', 'ideal_weight', 'body_fat'
    test_data JSONB NOT NULL, -- Stores all test inputs and results
    result_value DECIMAL(10, 2), -- Main result value for easy querying
    result_category VARCHAR(50), -- e.g., 'Normal', 'Overweight', 'Underweight'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_health_tests_user_id ON health_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_health_tests_type ON health_tests(test_type);
CREATE INDEX IF NOT EXISTS idx_health_tests_created_at ON health_tests(created_at DESC);

-- ============================================
-- USER PROFILES TABLE (Extended user info)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    age INTEGER,
    gender VARCHAR(20), -- 'male', 'female', 'other'
    height_cm DECIMAL(5, 2),
    weight_kg DECIMAL(5, 2),
    activity_level VARCHAR(20), -- 'sedentary', 'light', 'moderate', 'active', 'very_active'
    goal VARCHAR(50), -- 'lose_weight', 'maintain', 'gain_muscle', 'improve_health'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE food_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Food Analyses Policies
CREATE POLICY "Users can view own analyses"
    ON food_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
    ON food_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
    ON food_analyses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
    ON food_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- Health Tests Policies
CREATE POLICY "Users can view own health tests"
    ON health_tests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health tests"
    ON health_tests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health tests"
    ON health_tests FOR DELETE
    USING (auth.uid() = user_id);

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- STORAGE BUCKET FOR FOOD IMAGES
-- ============================================

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for food-images bucket
CREATE POLICY "Users can upload their own images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'food-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own images"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'food-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'food-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Public access for images (since we're using public URLs)
CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'food-images');

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for food_analyses
DROP TRIGGER IF EXISTS update_food_analyses_updated_at ON food_analyses;
CREATE TRIGGER update_food_analyses_updated_at
    BEFORE UPDATE ON food_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE VIEWS FOR ANALYTICS
-- ============================================

-- View for user health summary
CREATE OR REPLACE VIEW user_health_summary AS
SELECT 
    up.id as user_id,
    up.full_name,
    up.age,
    up.gender,
    up.height_cm,
    up.weight_kg,
    up.activity_level,
    up.goal,
    COUNT(DISTINCT fa.id) as total_food_analyses,
    COUNT(DISTINCT ht.id) as total_health_tests,
    MAX(ht.created_at) as last_health_test_date
FROM user_profiles up
LEFT JOIN food_analyses fa ON up.id = fa.user_id
LEFT JOIN health_tests ht ON up.id = ht.user_id
GROUP BY up.id, up.full_name, up.age, up.gender, up.height_cm, up.weight_kg, up.activity_level, up.goal;
