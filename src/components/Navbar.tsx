import React from 'react';
import { LogOut, User } from 'lucide-react';
import { supabase } from '../services/supabase';
import logo from '../assets/logo.svg';

export const Navbar: React.FC = () => {
    const handleSignOut = () => supabase.auth.signOut();

    return (
        <nav className="bg-stonehill-purple text-white shadow-lg border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Skyhawks Logo" className="w-8 h-8 drop-shadow-md" />
                        <span className="text-xl font-bold tracking-tight">Skyhawk Practice</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/5">
                            <User className="w-4 h-4 text-stonehill-gold" />
                            <span className="text-sm font-medium">Coach</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-200 hover:text-white"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
