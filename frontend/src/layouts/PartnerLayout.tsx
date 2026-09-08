import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { partnerAppApi } from '@/lib/partnerApp';
import { PartnerMe } from '@/types';
import { Bike, Home, Package, DollarSign, User, LogOut, Power } from 'lucide-react';

export const PartnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [partner, setPartner] = useState<PartnerMe | null>(null);
  const [isUpdatingDuty, setIsUpdatingDuty] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await partnerAppApi.getProfile();
      setPartner(data);
    } catch (err) {
      console.error('Failed to load partner profile in layout', err);
    }
  };

  const toggleDuty = async () => {
    if (!partner || partner.currentStatus !== 'ACTIVE' || isUpdatingDuty) return;
    try {
      setIsUpdatingDuty(true);
      const updated = await partnerAppApi.updateDuty(!partner.isOnline);
      setPartner(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update duty status');
    } finally {
      setIsUpdatingDuty(false);
    }
  };

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/orders', icon: Package, label: 'Deliveries' },
    { to: '/earnings', icon: DollarSign, label: 'Earnings' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-sm">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg leading-tight block">PartnerApp</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Rider Fleet</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online/Offline Toggle if active */}
            {partner?.currentStatus === 'ACTIVE' && (
              <button
                onClick={toggleDuty}
                disabled={isUpdatingDuty}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  partner.isOnline
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{partner.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>
            )}

            {/* Logout button */}
            <button
              onClick={() => logout('/login')}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 md:p-6 pb-28 md:pb-8">
        <Outlet context={{ partner, refreshProfile: fetchProfile }} />
      </main>

      {/* Mobile-First Sticky Bottom Nav with Safe-Area Inset */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pt-1.5 pb-safe px-3 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[48px] py-1 px-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  isActive
                    ? 'text-emerald-700 font-bold bg-emerald-50/80'
                    : 'text-slate-500 hover:text-slate-900 active:bg-slate-100'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[11px] leading-tight">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
