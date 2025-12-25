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
                setSuccessMessage('Rekisteröinti onnistui! Voit nyt kirjautua sisään.');
                // Clear form
                setEmail('');
                setPassword('');
                setFullName('');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.message || 'Tapahtui virhe');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-app-dark mb-2">
                        {isLogin ? 'Kirjaudu sisään' : 'Rekisteröidy'}
                    </h2>
                    <p className="text-gray-600">
                        {isLogin ? 'Kirjaudu tilillesi' : 'Luo uusi tili'}
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
                                Koko nimi
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                                placeholder="Nimesi"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sähköposti
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-app-primary focus:border-transparent"
                            placeholder="esimerkki@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Salasana
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
                            <p className="text-xs text-gray-500 mt-1">Vähintään 6 merkkiä</p>
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
                                <span>Ladataan...</span>
                            </div>
                        ) : (
                            isLogin ? 'Kirjaudu sisään' : 'Rekisteröidy'
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
                        {isLogin ? 'Ei tiliä? Rekisteröidy' : 'Onko sinulla jo tili? Kirjaudu sisään'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
