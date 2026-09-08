import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, FileText, Settings, LogOut, ExternalLink, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const BackofficeSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/backoffice/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/backoffice/verification', icon: ShieldCheck, label: 'KYC Verification' },
    { to: '/backoffice/partners', icon: Users, label: 'Fleet Directory' },
    { to: '/backoffice/audit', icon: FileText, label: 'Audit Logs' },
    { to: '/backoffice/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-full h-full bg-slate-900 border-r border-slate-800 flex flex-col font-sans text-slate-200">
      {/* Backoffice Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight block">PartnerOps</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Back-Office Fleet Hub</span>
          </div>
        </div>
      </div>

      {/* Switch to Delivery Partner App Link */}
      <div className="p-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg text-xs font-semibold text-emerald-400 border border-slate-700 transition-colors"
        >
          <span>Open Rider App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-2 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'text-white bg-blue-600 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-slate-800 p-4 flex-shrink-0 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.username || 'Operator'}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.roles?.map((r) => r.replace('ROLE_', '')).join(', ')}
            </p>
          </div>
        </div>

        <button
          onClick={() => logout('/backoffice/login')}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors border border-red-900/30"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
