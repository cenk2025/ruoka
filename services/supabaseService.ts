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

// Sign in with Google
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        }
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
