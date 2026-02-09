import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PracticeBuilder } from './components/PracticeBuilder';
import { DrillDetailsPage } from './components/DrillDetailsPage';
import { LayoutDashboard, Hammer, Loader2 } from 'lucide-react';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  useEffect(() => {
    console.log('[App] Current path:', location.pathname);
  }, [location.pathname]);

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

  // Hide sub-nav on detail pages
  const isDetailPage = location.pathname.startsWith('/drill/');

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Navbar />

      {/* Sub-navigation */}
      {!isDetailPage && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `py-4 text-sm font-bold flex items-center gap-2 transition-all relative ${isActive ? 'text-stonehill-purple' : 'text-gray-400 hover:text-gray-600'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Drill Library
                {location.pathname === '/' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-stonehill-purple rounded-t-full"></div>
                )}
              </NavLink>
              <NavLink
                to="/builder"
                className={({ isActive }) =>
                  `py-4 text-sm font-bold flex items-center gap-2 transition-all relative ${isActive ? 'text-stonehill-purple' : 'text-gray-400 hover:text-gray-600'
                  }`
                }
              >
                <Hammer className="w-4 h-4" />
                Practice Builder
                {location.pathname === '/builder' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-stonehill-purple rounded-t-full"></div>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-[50vh]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/builder" element={<PracticeBuilder />} />
          <Route path="/drill/:id" element={<DrillDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
