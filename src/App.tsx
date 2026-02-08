import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PracticeBuilder } from './components/PracticeBuilder';
import { LayoutDashboard, Hammer, Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder'>('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stonehill-purple flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-stonehill-gold" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      {/* Sub-navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === 'dashboard' ? 'text-stonehill-purple' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Drill Library
              {activeTab === 'dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-stonehill-purple rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`py-4 text-sm font-bold flex items-center gap-2 transition-all relative ${activeTab === 'builder' ? 'text-stonehill-purple' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <Hammer className="w-4 h-4" />
              Practice Builder
              {activeTab === 'builder' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-stonehill-purple rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'dashboard' ? <Dashboard /> : <PracticeBuilder />}
      </main>

      {/* Footer Branding */}
      <footer className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
        <div className="flex items-center gap-2 opacity-50 grayscale">
          <img src="https://stonehillskyhawks.com/images/logos/site/site.png" alt="Stonehill Logo" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
          <span className="font-bold tracking-widest text-[10px] uppercase">Stonehill College Athletics</span>
        </div>
        <p className="text-[10px]">© {new Date().getFullYear()} Volleyball Practice Manager • Premium Edition</p>
      </footer>
    </div>
  );
}

export default App;
