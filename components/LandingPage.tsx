import React, { useState } from 'react';
import AuthForm from './AuthForm';
import { Strings } from '../localization/strings';

interface LandingPageProps {
    strings: Strings;
    language: 'fi' | 'en';
    onLanguageToggle: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ strings, language, onLanguageToggle }) => {
    const [showCookieConsent, setShowCookieConsent] = useState(() => {
        return typeof window !== 'undefined' && !localStorage.getItem('cookie_consent');
    });

    const handleAcceptCookies = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShowCookieConsent(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
            {/* Header */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl text-white shadow-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h1 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            {strings.headerTitle}
                        </h1>
                    </div>

                    <button
                        onClick={onLanguageToggle}
                        className="flex items-center justify-center w-10 h-10 text-sm font-bold text-gray-600 hover:text-indigo-600 bg-gray-100 hover:bg-white hover:shadow-md transition-all rounded-full"
                        aria-label={strings.ariaChangeLanguage}
                    >
                        {language.toUpperCase()}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Info */}
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4">
                            ✨ {language === 'fi' ? 'AI-Pohjainen Ruoka-analyysi' : 'AI-Powered Food Analysis'}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            {language === 'fi' ? 'Analysoi ruokasi hetkessä' : 'Analyze your food instantly'}
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            {strings.welcomeMessage}
                        </p>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{language === 'fi' ? 'Ravintoarvot' : 'Nutrition Facts'}</h3>
                                    <p className="text-sm text-gray-600">{language === 'fi' ? 'Saat tarkat arviot kalorimäärästä ja ravintoarvoista' : 'Get accurate estimates of calories and nutritional values'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{strings.allergensTitle}</h3>
                                    <p className="text-sm text-gray-600">{language === 'fi' ? 'Tunnista mahdolliset allergeenit turvallisesti' : 'Identify potential allergens safely'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{strings.recipeTitle}</h3>
                                    <p className="text-sm text-gray-600">{language === 'fi' ? 'Saat valmistusohjeet ja reseptin' : 'Get cooking instructions and recipes'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Auth Form */}
                    <div className="flex justify-center">
                        <AuthForm onSuccess={() => { }} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Disclaimer */}
                        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="font-bold text-yellow-200 mb-1">{strings.footerDisclaimerTitle}</p>
                                    <p className="text-sm text-yellow-100/90 leading-relaxed">
                                        {strings.footerDisclaimerText}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-6">
                            <a href="#" className="hover:text-white transition-colors">{strings.footerLinkAbout}</a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="hover:text-white transition-colors">{strings.footerLinkPrivacy}</a>
                            <span className="text-gray-600">•</span>
                            <a href="#" className="hover:text-white transition-colors">{strings.footerLinkTerms}</a>
                        </div>

                        {/* Copyright & Branding */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-500">
                                {strings.footerCopyrightText.replace('{year}', new Date().getFullYear().toString())}
                            </p>
                            <p className="text-xs text-gray-600">
                                Powered by{' '}
                                <a
                                    href="https://vooniq.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                                >
                                    Voon IQ
                                </a>
                                {' '}— AI & Technology Solutions
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Cookie Consent */}
            {showCookieConsent && (
                <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 md:p-6 shadow-2xl z-50 animate-slide-up">
                    <div className="container mx-auto max-w-4xl">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    <span className="font-bold text-gray-900">🍪 {language === 'fi' ? 'Evästeet' : 'Cookies'}:</span>{' '}
                                    {strings.cookieConsentText}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {language === 'fi'
                                        ? 'Käytämme vain välttämättömiä evästeitä. Emme jaa tietojasi kolmansille osapuolille.'
                                        : 'We only use essential cookies. We do not share your data with third parties.'}
                                </p>
                            </div>
                            <button
                                onClick={handleAcceptCookies}
                                className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg whitespace-nowrap"
                            >
                                {strings.cookieAcceptButton}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
