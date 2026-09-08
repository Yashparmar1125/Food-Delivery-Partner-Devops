import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BackofficeSidebar } from '@/components/navigation/BackofficeSidebar';
import { Shield, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const BackofficeLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[240px] flex-shrink-0">
        <BackofficeSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 max-w-xs bg-slate-900 flex flex-col h-full z-10 shadow-2xl">
            <div className="p-3 flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setIsMobileMenuOpen(false)}>
              <BackofficeSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-1.5 text-slate-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-sm">PartnerOps Back-Office</span>
          </div>
          <button onClick={() => logout('/backoffice/login')} className="text-xs text-red-400 font-semibold">
            Logout
          </button>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
