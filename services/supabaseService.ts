import { supabase } from '../supabaseConfig';
import { AnalysisResult } from '../types';

export interface SupabaseUser {
    id: string;
    email: string;
    user_metadata: {
        name?: string;
        avatar_url?: string;
        full_name?: string;
    };
}

// Sign up with email and password
export const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    });

    if (error) throw error;
    return data;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
};

// Reset password
export const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return data;
};

// Sign out
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Get current user
export const getCurrentUser = async (): Promise<SupabaseUser | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user as SupabaseUser | null;
};

// Listen to auth changes
export const onAuthStateChange = (callback: (user: SupabaseUser | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user as SupabaseUser | null);
    });
};

// Save food analysis to database
export const saveFoodAnalysis = async (
    userId: string,
    imageUrl: string,
    analysisData: AnalysisResult
) => {
    const { data, error } = await supabase
        .from('food_analyses')
        .insert([
            {
                user_id: userId,
                image_url: imageUrl,
                analysis_data: analysisData,
            }
        ])
        .select();

    if (error) throw error;
    return data;
};

// Upload image to Supabase Storage
export const uploadFoodImage = async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
        .from('food-images')
        .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('food-images')
        .getPublicUrl(fileName);

    return publicUrl;
};

// ============================================
// HEALTH TESTS FUNCTIONS
// ============================================

export interface HealthTestData {
    test_type: string;
    test_data: any;
    result_value: number;
    result_category: string;
}

// Save health test result
export const saveHealthTest = async (
    userId: string,
    testData: HealthTestData
) => {
    const { data, error } = await supabase
        .from('health_tests')
        .insert([
            {
                user_id: userId,
                ...testData
            }
        ])
        .select();

    if (error) throw error;
    return data;
};

// Get user's health tests
export const getUserHealthTests = async (userId: string) => {
    const { data, error } = await supabase
        .from('health_tests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Get health tests by type
export const getHealthTestsByType = async (userId: string, testType: string) => {
    const { data, error } = await supabase
        .from('health_tests')
        .select('*')
        .eq('user_id', userId)
        .eq('test_type', testType)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Delete health test
export const deleteHealthTest = async (testId: string) => {
    const { error } = await supabase
        .from('health_tests')
        .delete()
        .eq('id', testId);

    if (error) throw error;
};

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

export interface UserProfile {
    id: string;
    full_name?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    height_cm?: number;
    weight_kg?: number;
    activity_level?: string;
    goal?: string;
}

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
};

// Create or update user profile
export const upsertUserProfile = async (profile: UserProfile) => {
    const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile)
        .select();

    if (error) throw error;
    return data;
};

