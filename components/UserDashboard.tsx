import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseConfig';
import { getUserHealthTests, deleteHealthTest } from '../services/supabaseService';
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

interface HealthTest {
    id: string;
    test_type: string;
    test_data: any;
    result_value: number;
    result_category: string;
    created_at: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId, userName, userEmail, onClose, strings }) => {
    const [activeTab, setActiveTab] = useState<'analyses' | 'health'>('analyses');
    const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
    const [healthTests, setHealthTests] = useState<HealthTest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [userId, activeTab]);

    const loadData = async () => {
        try {
            setIsLoading(true);

            if (activeTab === 'analyses') {
                const { data, error } = await supabase
                    .from('food_analyses')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setSavedAnalyses(data || []);
            } else {
                const tests = await getUserHealthTests(userId);
                setHealthTests(tests || []);
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Tietojen lataus epäonnistui');
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

    const deleteTest = async (id: string) => {
        if (!confirm('Haluatko varmasti poistaa tämän testin?')) return;

        try {
            await deleteHealthTest(id);
            setHealthTests(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting test:', err);
            alert('Poisto epäonnistui');
        }
    };

    const getTestIcon = (type: string) => {
        const icons: { [key: string]: string } = {
            bmi: '⚖️',
            bmr: '🔥',
            tdee: '📊',
            ideal_weight: '🎯',
            body_fat: '💪'
        };
        return icons[type] || '📋';
    };

    const getTestTitle = (type: string) => {
        const titles: { [key: string]: string } = {
            bmi: 'BMI (Painoindeksi)',
            bmr: 'BMR (Perusaineenvaihdunta)',
            tdee: 'TDEE (Päivittäinen kalorintarve)',
            ideal_weight: 'Ihannepaino',
            body_fat: 'Kehon rasvaprosentti'
        };
        return titles[type] || type;
    };

    const getCategoryColor = (type: string, category: string) => {
        if (type === 'bmi') {
            if (category === 'Normal') return 'bg-green-100 text-green-700';
            if (category === 'Underweight') return 'bg-yellow-100 text-yellow-700';
            if (category === 'Overweight') return 'bg-orange-100 text-orange-700';
            if (category === 'Obese') return 'bg-red-100 text-red-700';
        }
        return 'bg-blue-100 text-blue-700';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
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

                    {/* Tabs */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setActiveTab('analyses')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'analyses'
                                ? 'bg-white text-app-primary'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            🍽️ Ruoka-analyysit
                        </button>
                        <button
                            onClick={() => setActiveTab('health')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'health'
                                ? 'bg-white text-app-primary'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            💪 Terveystestit
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="w-12 h-12 border-4 border-app-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    ) : activeTab === 'analyses' ? (
                        // Food Analyses Tab
                        savedAnalyses.length === 0 ? (
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
                                            <div className="flex gap-2 text-xs mb-3 flex-wrap">
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                    {analysis.analysis_data.calories || 0} kcal
                                                </span>
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    P: {analysis.analysis_data.protein || 0}g
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
                        )
                    ) : (
                        // Health Tests Tab
                        healthTests.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-lg font-medium">Ei vielä terveystestejä</p>
                                <p className="text-sm mt-2">Testituloksesi näkyvät täällä</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {healthTests.map((test) => (
                                    <div key={test.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-4xl">{getTestIcon(test.test_type)}</div>
                                            <button
                                                onClick={() => deleteTest(test.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        <h4 className="font-bold text-app-dark mb-2">{getTestTitle(test.test_type)}</h4>

                                        <div className="mb-3">
                                            <div className="text-3xl font-bold text-app-primary mb-1">
                                                {test.result_value}
                                                {test.test_type === 'bmi' && ''}
                                                {test.test_type === 'bmr' && ' kcal'}
                                                {test.test_type === 'tdee' && ' kcal'}
                                                {test.test_type === 'ideal_weight' && ' kg'}
                                            </div>
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(test.test_type, test.result_category)}`}>
                                                {test.result_category}
                                            </span>
                                        </div>

                                        <div className="text-sm text-gray-500 border-t pt-3">
                                            {new Date(test.created_at).toLocaleDateString('fi-FI', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
