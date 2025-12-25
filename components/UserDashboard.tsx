import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseConfig';
import { AnalysisResult as AnalysisResultType } from '../types';

interface UserDashboardProps {
    userId: string;
    userName: string;
    userEmail: string;
    onClose: () => void;
    strings: any;
}

interface SavedAnalysis {
    id: string;
    created_at: string;
    image_url: string;
    analysis_data: AnalysisResultType;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId, userName, userEmail, onClose, strings }) => {
    const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSavedAnalyses();
    }, [userId]);

    const loadSavedAnalyses = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('food_analyses')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSavedAnalyses(data || []);
        } catch (err) {
            console.error('Error loading analyses:', err);
            setError('Analyysien lataus epäonnistui');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAnalysis = async (id: string) => {
        if (!confirm('Haluatko varmasti poistaa tämän analyysin?')) return;

        try {
            const { error } = await supabase
                .from('food_analyses')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSavedAnalyses(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Error deleting analysis:', err);
            alert('Poisto epäonnistui');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-app-primary to-app-secondary p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Käyttäjän Dashboard</h2>
                            <p className="text-white/90">{userName}</p>
                            <p className="text-sm text-white/70">{userEmail}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            aria-label="Sulje"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-xl font-bold mb-4 text-app-dark">Tallennetut Analyysit</h3>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-12 h-12 border-4 border-app-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    ) : savedAnalyses.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg font-medium">Ei tallennettuja analyysejä</p>
                            <p className="text-sm mt-2">Analyysisi näkyvät täällä automaattisesti</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedAnalyses.map((analysis) => (
                                <div key={analysis.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    {analysis.image_url && (
                                        <img
                                            src={analysis.image_url}
                                            alt="Food"
                                            className="w-full h-40 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <div className="text-sm text-gray-500 mb-2">
                                            {new Date(analysis.created_at).toLocaleDateString('fi-FI', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <h4 className="font-bold text-app-dark mb-2 line-clamp-2">
                                            {analysis.analysis_data.foodName || 'Ruoka-analyysi'}
                                        </h4>
                                        <div className="flex gap-2 text-xs mb-3">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                {analysis.analysis_data.calories || 0} kcal
                                            </span>
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                Proteiini: {analysis.analysis_data.protein || 0}g
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteAnalysis(analysis.id)}
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                                        >
                                            Poista
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
