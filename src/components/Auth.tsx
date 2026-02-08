import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Volleyball, Mail, Lock, Loader2 } from 'lucide-react';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Check your email for the confirmation link!' });
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stonehill-purple p-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-stonehill-gold rounded-full blur-[120px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-stonehill-gold rounded-full blur-[100px] opacity-10"></div>

            <div className="glass w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10 border border-white/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-stonehill-gold p-3 rounded-full mb-4 shadow-lg">
                        <Volleyball className="w-8 h-8 text-stonehill-purple" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Skyhawk Practice</h1>
                    <p className="text-blue-100/70 text-sm mt-1">Volleyball Management System</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-stonehill-gold transition-all"
                                placeholder="coach@stonehill.edu"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-stonehill-gold transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-stonehill-gold hover:bg-stonehill-gold/90 text-stonehill-purple font-bold py-3 rounded-lg shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-blue-200 hover:text-white text-sm transition-colors"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};
