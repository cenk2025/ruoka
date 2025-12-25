import React, { useState } from 'react';

export interface HealthTestResult {
    test_type: string;
    test_data: any;
    result_value: number;
    result_category: string;
}

interface HealthTestsProps {
    onTestComplete: (result: HealthTestResult) => void;
    strings: any;
}

const HealthTests: React.FC<HealthTestsProps> = ({ onTestComplete, strings }) => {
    const [activeTest, setActiveTest] = useState<string | null>(null);

    // BMI Calculator State
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [activityLevel, setActivityLevel] = useState('moderate');

    const calculateBMI = () => {
        const heightM = parseFloat(height) / 100;
        const weightKg = parseFloat(weight);
        const bmi = weightKg / (heightM * heightM);

        let category = '';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';

        const result: HealthTestResult = {
            test_type: 'bmi',
            test_data: { height: parseFloat(height), weight: weightKg },
            result_value: parseFloat(bmi.toFixed(2)),
            result_category: category
        };

        onTestComplete(result);
        resetForm();
    };

    const calculateBMR = () => {
        const weightKg = parseFloat(weight);
        const heightCm = parseFloat(height);
        const ageYears = parseInt(age);

        // Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
        }

        const result: HealthTestResult = {
            test_type: 'bmr',
            test_data: { height: heightCm, weight: weightKg, age: ageYears, gender },
            result_value: parseFloat(bmr.toFixed(0)),
            result_category: 'Calculated'
        };

        onTestComplete(result);
        resetForm();
    };

    const calculateTDEE = () => {
        const weightKg = parseFloat(weight);
        const heightCm = parseFloat(height);
        const ageYears = parseInt(age);

        // Calculate BMR first
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
        }

        // Activity multipliers
        const multipliers: { [key: string]: number } = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        const tdee = bmr * multipliers[activityLevel];

        const result: HealthTestResult = {
            test_type: 'tdee',
            test_data: { height: heightCm, weight: weightKg, age: ageYears, gender, activity_level: activityLevel },
            result_value: parseFloat(tdee.toFixed(0)),
            result_category: activityLevel
        };

        onTestComplete(result);
        resetForm();
    };

    const calculateIdealWeight = () => {
        const heightCm = parseFloat(height);

        // Robinson Formula
        let idealWeight;
        if (gender === 'male') {
            idealWeight = 52 + 1.9 * ((heightCm / 2.54 - 60));
        } else {
            idealWeight = 49 + 1.7 * ((heightCm / 2.54 - 60));
        }

        const result: HealthTestResult = {
            test_type: 'ideal_weight',
            test_data: { height: heightCm, gender },
            result_value: parseFloat(idealWeight.toFixed(1)),
            result_category: 'Ideal'
        };

        onTestComplete(result);
        resetForm();
    };

    const resetForm = () => {
        setHeight('');
        setWeight('');
        setAge('');
        setActiveTest(null);
    };

    const tests = [
        {
            id: 'bmi',
            title: 'BMI Hesaplayıcı',
            titleEn: 'BMI Calculator',
            description: 'Vücut Kitle İndeksinizi hesaplayın',
            descriptionEn: 'Calculate your Body Mass Index',
            icon: '⚖️',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'bmr',
            title: 'BMR Hesaplayıcı',
            titleEn: 'BMR Calculator',
            description: 'Bazal Metabolizma Hızınızı öğrenin',
            descriptionEn: 'Learn your Basal Metabolic Rate',
            icon: '🔥',
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'tdee',
            title: 'TDEE Hesaplayıcı',
            titleEn: 'TDEE Calculator',
            description: 'Günlük kalori ihtiyacınızı hesaplayın',
            descriptionEn: 'Calculate your daily calorie needs',
            icon: '📊',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'ideal_weight',
            title: 'İdeal Kilo',
            titleEn: 'Ideal Weight',
            description: 'İdeal kilonuzu öğrenin',
            descriptionEn: 'Find your ideal weight',
            icon: '🎯',
            color: 'from-green-500 to-teal-500'
        }
    ];

    const renderTestForm = () => {
        if (!activeTest) return null;

        const needsHeight = ['bmi', 'bmr', 'tdee', 'ideal_weight'].includes(activeTest);
        const needsWeight = ['bmi', 'bmr', 'tdee'].includes(activeTest);
        const needsAge = ['bmr', 'tdee'].includes(activeTest);
        const needsGender = ['bmr', 'tdee', 'ideal_weight'].includes(activeTest);
        const needsActivity = ['tdee'].includes(activeTest);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (activeTest === 'bmi') calculateBMI();
            else if (activeTest === 'bmr') calculateBMR();
            else if (activeTest === 'tdee') calculateTDEE();
            else if (activeTest === 'ideal_weight') calculateIdealWeight();
        };

        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-app-dark">
                        {tests.find(t => t.id === activeTest)?.title}
                    </h3>
                    <button
                        onClick={() => setActiveTest(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {needsHeight && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Boy (cm)
                            </label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                                placeholder="170"
                                required
                                min="100"
                                max="250"
                            />
                        </div>
                    )}

                    {needsWeight && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kilo (kg)
                            </label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                                placeholder="70"
                                required
                                min="30"
                                max="300"
                            />
                        </div>
                    )}

                    {needsAge && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Yaş
                            </label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                                placeholder="30"
                                required
                                min="10"
                                max="120"
                            />
                        </div>
                    )}

                    {needsGender && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cinsiyet
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        value="male"
                                        checked={gender === 'male'}
                                        onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                                        className="mr-2"
                                    />
                                    <span>Erkek</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        value="female"
                                        checked={gender === 'female'}
                                        onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                                        className="mr-2"
                                    />
                                    <span>Kadın</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {needsActivity && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Aktivite Seviyesi
                            </label>
                            <select
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                            >
                                <option value="sedentary">Hareketsiz (Ofis işi)</option>
                                <option value="light">Hafif Aktif (Haftada 1-3 gün egzersiz)</option>
                                <option value="moderate">Orta Aktif (Haftada 3-5 gün egzersiz)</option>
                                <option value="active">Aktif (Haftada 6-7 gün egzersiz)</option>
                                <option value="very_active">Çok Aktif (Günde 2 kez egzersiz)</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-app-primary to-app-secondary text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
                    >
                        Hesapla
                    </button>
                </form>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-app-dark mb-2">Sağlık Testleri</h2>
                <p className="text-gray-600">Sağlığınızı takip edin ve hedeflerinize ulaşın</p>
            </div>

            {!activeTest ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tests.map((test) => (
                        <button
                            key={test.id}
                            onClick={() => setActiveTest(test.id)}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 text-left"
                        >
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${test.color} flex items-center justify-center text-3xl mb-4`}>
                                {test.icon}
                            </div>
                            <h3 className="text-xl font-bold text-app-dark mb-2">{test.title}</h3>
                            <p className="text-gray-600">{test.description}</p>
                        </button>
                    ))}
                </div>
            ) : (
                renderTestForm()
            )}
        </div>
    );
};

export default HealthTests;
