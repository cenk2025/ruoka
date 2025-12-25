import React, { useState } from 'react';
import { signIn, signUp } from '../services/supabaseService';

interface AuthFormProps {
    onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
                onSuccess();
            } else {
                await signUp(email, password, fullName);
                setSuccessMessage('Kayıt başarılı! Lütfen e-postanızı kontrol edin ve hesabınızı doğrulayın.');
                // Clear form
                setEmail('');
                setPassword('');
                setFullName('');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-app-dark mb-2">
                        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                    </h2>
                    <p className="text-gray-600">
                        {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ad Soyad
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                                placeholder="Adınız Soyadınız"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                            placeholder="ornek@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                        {!isLogin && (
                            <p className="text-xs text-gray-500 mt-1">En az 6 karakter</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-app-primary to-app-secondary text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Yükleniyor...</span>
                            </div>
                        ) : (
                            isLogin ? 'Giriş Yap' : 'Kayıt Ol'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                            setSuccessMessage(null);
                        }}
                        className="text-app-primary hover:text-app-secondary font-medium transition-colors"
                    >
                        {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
