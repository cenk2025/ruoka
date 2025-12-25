
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult as AnalysisResultType } from './types';
import { analyzeFoodImage } from './services/geminiService';
import {
  signOut,
  onAuthStateChange,
  saveFoodAnalysis,
  uploadFoodImage,
  SupabaseUser,
  saveHealthTest
} from './services/supabaseService';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import LoadingSpinner from './components/LoadingSpinner';
import WelcomeScreen from './components/WelcomeScreen';
import Modal from './components/Modal';
import UserDashboard from './components/UserDashboard';
import HealthTests, { HealthTestResult } from './components/HealthTests';
import AuthForm from './components/AuthForm';
import { HeaderIcon, TwitterIcon, GithubIcon, LinkedInIcon, LogoutIcon, UserIcon } from './components/Icons';
import { locales } from './localization/strings';

type Language = 'fi' | 'en';
type ModalType = 'about' | 'terms' | 'privacy' | 'dashboard' | null;

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [language, setLanguage] = useState<Language>('fi');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Supabase Auth State
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const strings = locales[language];

  // Initialize Supabase Auth
  useEffect(() => {
    console.log("Food Analyzer running at origin:", window.location.origin);

    // Subscribe to auth changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user);
      setIsAuthLoading(false);

      // Open dashboard automatically when user logs in
      if (user && !activeModal) {
        setActiveModal('dashboard');
      }
    });

    // Check cookie consent
    if (typeof window !== 'undefined' && !localStorage.getItem('cookie_consent')) {
      setShowCookieConsent(true);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowCookieConsent(false);
  };

  const handleLanguageToggle = () => {
    setLanguage(prevLang => prevLang === 'fi' ? 'en' : 'fi');
  }

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setActiveModal(null);
    } catch (err) {
      console.error("Logout Error", err);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setAnalysis(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageDataUrl) {
      setError(strings.errorSelectImage);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const base64Data = imageDataUrl.split(',')[1];
      if (!imageFile) throw new Error(strings.errorMissingFileInfo);

      const result = await analyzeFoodImage(base64Data, imageFile.type, language);
      setAnalysis(result);

      // Save to Supabase if user is logged in
      if (user && imageFile) {
        try {
          const imageUrl = await uploadFoodImage(imageFile, user.id);
          await saveFoodAnalysis(user.id, imageUrl, result);
          console.log("Analysis saved to database");
        } catch (saveErr) {
          console.error("Failed to save analysis:", saveErr);
          // Don't show error to user, analysis still worked
        }
      }

    } catch (err) {
      console.error(err);
      setError(strings.errorAnalysisFailed);
    } finally {
      setIsLoading(false);
    }
  }, [imageDataUrl, imageFile, language, strings, user]);

  const handleReset = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  const handleHealthTestComplete = async (result: HealthTestResult) => {
    if (!user) {
      alert('Ole hyvä ja kirjaudu sisään ensin');
      return;
    }

    try {
      await saveHealthTest(user.id, result);
      alert('Testitulos tallennettu! Voit nähdä sen Dashboard-sivulla.');
    } catch (err) {
      console.error('Failed to save health test:', err);
      alert('Testituloksen tallennus epäonnistui');
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case 'about':
        return (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>{strings.aboutContent1}</p>
            <p>{strings.aboutContent2}</p>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <h4 className="font-bold text-app-dark">{strings.termsSection1Title}</h4>
            <p>{strings.termsSection1Content}</p>
            <h4 className="font-bold mt-4 text-app-dark">{strings.termsSection2Title}</h4>
            <p>{strings.termsSection2Content}</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <h4 className="font-bold text-app-dark">{strings.privacySection1Title}</h4>
            <p>{strings.privacySection1Content}</p>
            <h4 className="font-bold mt-4 text-app-dark">{strings.privacySection2Title}</h4>
            <p>{strings.privacySection2Content}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case 'about': return strings.aboutTitle;
      case 'terms': return strings.termsTitle;
      case 'privacy': return strings.privacyTitle;
      default: return '';
    }
  }

  // If not logged in, show auth form
  if (!user && !isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <AuthForm onSuccess={() => { }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-app-dark font-sans flex flex-col">
      {/* Background Gradient decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl mix-blend-multiply filter"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl mix-blend-multiply filter"></div>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div
            onClick={handleReset}
            className="inline-flex items-center gap-3 cursor-pointer group"
            aria-label={strings.ariaBackToHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleReset()}
          >
            <div className="bg-gradient-to-br from-app-primary to-app-secondary p-2 rounded-xl text-white shadow-lg group-hover:shadow-glow transition-all">
              <HeaderIcon />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-app-primary to-app-secondary tracking-tight">
              {strings.headerTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {user && (
              <div className="flex items-center gap-3">
                {/* Dashboard Button */}
                <button
                  onClick={() => setActiveModal('dashboard')}
                  className="flex items-center gap-2 text-xs md:text-sm font-bold text-white bg-gradient-to-r from-app-primary to-app-secondary hover:shadow-lg transition-all px-4 py-2 rounded-full active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden md:inline">Dashboard</span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 pl-2 pr-4 py-1.5 rounded-full shadow-sm">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-app-primary">
                    <UserIcon />
                  </div>
                  <div className="hidden md:block text-sm font-bold text-gray-700 truncate max-w-[120px]">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Kirjaudu ulos"
                  >
                    <LogoutIcon />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleLanguageToggle}
              className="flex items-center justify-center w-10 h-10 text-sm font-bold text-gray-600 hover:text-app-primary bg-gray-100 hover:bg-white hover:shadow-md transition-all rounded-full"
              aria-label={strings.ariaChangeLanguage}
            >
              {language.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:px-6 md:py-10 flex-grow relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {!imageDataUrl && <WelcomeScreen strings={strings} userName={user?.user_metadata?.full_name || undefined} />}

          {/* Food Analysis Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-app-dark mb-6">🍽️ Ruoka-analyysi</h2>
            <ImageUploader
              onImageChange={handleImageChange}
              onAnalyze={handleAnalyzeClick}
              onReset={handleReset}
              imageDataUrl={imageDataUrl}
              isLoading={isLoading}
              strings={strings}
            />

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl shadow-sm animate-slide-up mt-4" role="alert">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">{strings.errorTitle}</span>
                </div>
                <span className="block">{error}</span>
              </div>
            )}

            {isLoading && <LoadingSpinner />}

            {analysis && <AnalysisResult result={analysis} strings={strings} />}
          </div>

          {/* Health Tests Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <HealthTests onTestComplete={handleHealthTestComplete} strings={strings} />
          </div>
        </div>
      </main>

      <footer className="bg-app-dark text-white relative z-10 mt-12">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{strings.headerTitle}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {strings.footerDescription}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">{strings.footerLinksTitle}</h3>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => setActiveModal('about')} className="text-slate-400 hover:text-app-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-app-primary"></span>{strings.footerLinkAbout}</button></li>
                <li><button onClick={() => setActiveModal('terms')} className="text-slate-400 hover:text-app-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-app-primary"></span>{strings.footerLinkTerms}</button></li>
                <li><button onClick={() => setActiveModal('privacy')} className="text-slate-400 hover:text-app-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-app-primary"></span>{strings.footerLinkPrivacy}</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">{strings.footerFollowTitle}</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-app-primary hover:text-white transition-all shadow-lg" aria-label="Twitter"><TwitterIcon /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-app-primary hover:text-white transition-all shadow-lg" aria-label="GitHub"><GithubIcon /></a>
                <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-app-primary hover:text-white transition-all shadow-lg" aria-label="LinkedIn"><LinkedInIcon /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-xs">
            <p className="font-bold mb-2 uppercase tracking-wider">{strings.footerDisclaimerTitle}</p>
            <p className="max-w-2xl mx-auto mb-6">
              {strings.footerDisclaimerText}
            </p>
            <p>{strings.footerCopyrightText.replace('{year}', new Date().getFullYear().toString())}</p>
          </div>
        </div>
      </footer>

      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-6 shadow-2xl z-50 animate-slide-up">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 text-center md:text-left">
              {strings.cookieConsentText}
            </p>
            <button
              onClick={handleAcceptCookies}
              className="w-full md:w-auto bg-app-dark text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-colors shadow-lg"
            >
              {strings.cookieAcceptButton}
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Modal */}
      {activeModal === 'dashboard' && user && (
        <UserDashboard
          userId={user.id}
          userName={user.user_metadata?.full_name || user.email || 'User'}
          userEmail={user.email || ''}
          onClose={() => setActiveModal(null)}
          strings={strings}
        />
      )}

      {/* Other Modals */}
      <Modal isOpen={activeModal !== null && activeModal !== 'dashboard'} onClose={() => setActiveModal(null)} title={getModalTitle()}>
        {renderModalContent()}
      </Modal>
    </div>
  );
}

export default App;
