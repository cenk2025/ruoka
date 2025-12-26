import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import { FoodIcon, RecipeIcon, NutritionIcon, WarningIcon, InfoIcon } from './Icons';
import { Strings } from '../localization/strings';

interface AnalysisResultProps {
    result: AnalysisResultType;
    strings: Strings;
}

const CardHeader: React.FC<{ title: string; icon: React.ReactNode; colorClass: string }> = ({ title, icon, colorClass }) => (
    <div className={`flex items-center gap-3 mb-4 ${colorClass} bg-opacity-10 p-3 rounded-xl w-fit`}>
        {icon}
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
);

const InfoCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-3xl shadow-soft p-6 md:p-8 transition-transform hover:scale-[1.01] duration-300 ${className}`}>
        {children}
    </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, strings }) => {
    if (!result.isFood) {
        return (
            <div className="mt-8 animate-fade-in">
                <InfoCard className="border-l-8 border-red-400">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-full text-red-500 flex-shrink-0">
                            <WarningIcon />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{strings.resultTitle}</h3>
                            <p className="text-gray-600 leading-relaxed">{result.reason || strings.reasonNotFood}</p>
                        </div>
                    </div>
                </InfoCard>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-6 animate-slide-up">
            {/* Dish Title */}
            <div className="text-center py-4">
                <span className="inline-block px-4 py-1 rounded-full bg-app-primary/10 text-app-primary text-sm font-bold mb-2 tracking-wider uppercase">
                    {strings.resultTitle}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-app-dark leading-tight">
                    {result.dishName}
                </h2>
            </div>

            {/* Ingredients */}
            {result.ingredients && (
                <InfoCard>
                    <CardHeader title={strings.ingredientsTitle} icon={<FoodIcon />} colorClass="text-emerald-600 bg-emerald-50" />
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.ingredients.map((item, index) => (
                            <li key={index} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                <span className="text-gray-700 font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </InfoCard>
            )}

            {/* Nutrition */}
            {result.nutrition && (
                <InfoCard>
                    <CardHeader title={strings.nutritionTitle} icon={<NutritionIcon />} colorClass="text-orange-500 bg-orange-50" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
                            <span className="text-3xl font-bold text-orange-600 mb-1">{result.nutrition.calories}</span>
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{strings.nutritionCalories}</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                            <span className="text-xl font-bold text-blue-600 mb-1">{result.nutrition.protein}</span>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{strings.nutritionProtein}</span>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex flex-col items-center text-center">
                            <span className="text-xl font-bold text-yellow-600 mb-1">{result.nutrition.carbohydrates}</span>
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">{strings.nutritionCarbs}</span>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col items-center text-center">
                            <span className="text-xl font-bold text-red-600 mb-1">{result.nutrition.fat}</span>
                            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{strings.nutritionFat}</span>
                        </div>
                    </div>
                </InfoCard>
            )}

            {/* Allergens */}
            <InfoCard>
                <CardHeader title={strings.allergensTitle} icon={<WarningIcon />} colorClass="text-red-500 bg-red-50" />
                {result.allergens && result.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {result.allergens.map((allergen, index) => (
                            <span
                                key={index}
                                className="px-4 py-2 rounded-full bg-red-50 text-red-700 border-2 border-red-200 font-semibold text-sm flex items-center gap-2 hover:bg-red-100 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {allergen}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-700 font-medium">{strings.allergensNone}</span>
                    </div>
                )}
            </InfoCard>

            {/* Recipe */}
            {result.recipe && (
                <InfoCard>
                    <CardHeader title={strings.recipeTitle} icon={<RecipeIcon />} colorClass="text-app-primary bg-indigo-50" />

                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            {result.recipe.difficulty}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {result.recipe.cookTime}
                        </span>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                        {result.recipe.steps.map((step, index) => (
                            <div key={index} className="relative pl-10 group">
                                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-app-primary font-bold text-sm ring-4 ring-white group-hover:bg-app-primary group-hover:text-white transition-colors">
                                    {index + 1}
                                </span>
                                <p className="text-gray-700 leading-relaxed py-1">{step}</p>
                            </div>
                        ))}
                    </div>
                </InfoCard>
            )}

            {result.uncertainty && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                    <div className="text-blue-400 mt-0.5">
                        <InfoIcon />
                    </div>
                    <p className="text-sm text-blue-800/80 italic leading-relaxed">{result.uncertainty}</p>
                </div>
            )}
        </div>
    );
};

export default AnalysisResult;