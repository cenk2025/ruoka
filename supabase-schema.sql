-- Supabase Database Schema for Food Analyzer

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create food_analyses table
CREATE TABLE IF NOT EXISTS food_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_food_analyses_user_id ON food_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_food_analyses_created_at ON food_analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE food_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only view their own analyses
CREATE POLICY "Users can view own analyses"
    ON food_analyses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
    ON food_analyses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update own analyses"
    ON food_analyses
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
    ON food_analyses
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create storage bucket for food images
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for food-images bucket
CREATE POLICY "Users can upload their own images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'food-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own images"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'food-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own images"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'food-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Public access for images (since we're using public URLs)
CREATE POLICY "Public can view images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'food-images');
