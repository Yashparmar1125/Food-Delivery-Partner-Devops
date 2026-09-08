import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { healthApi } from '../api/client';
import { 
  Bike, 
  Activity, 
  Shield, 
  FileCode2, 
  ExternalLink, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown,
  User,
  Zap
} from 'lucide-react';

export const Navbar = ({ onOpenDevOpsModal, onOpenOnboardModal }) => {
  const { user, activeDemoRole, switchDemoRole, logout } = useAuth();
  const [backendHealth, setBackendHealth] = useState({ status: 'CHECKING', db: 'CHECKING' });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Poll backend health indicator
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const response = await healthApi.getActuatorHealth();
        if (isMounted) {
          setBackendHealth({
            status: response.status === 'UP' ? 'UP' : 'DEGRADED',
            db: response.components?.db?.status || 'UP',
          });
        }
      } catch (err) {
        if (isMounted) {
          setBackendHealth({ status: 'OFFLINE', db: 'DOWN' });
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo: Swiggy Orange + Zomato Red Theme */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-zomato-red via-swiggy-orange to-amber-500 shadow-lg shadow-orange-500/20 text-white">
              <Bike className="w-6 h-6" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  PARTNER<span className="text-swiggy-orange">PORTAL</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md bg-gradient-to-r from-zomato-red/20 to-swiggy-orange/20 text-orange-300 border border-orange-500/30 uppercase">
                  Fleet Ops
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Onboarding, Dispatch & Lifecycle FSM
              </p>
            </div>
          </div>

          {/* Center: Live 1-Click Demo Persona Switcher */}
          <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
            <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-swiggy-orange" />
              Persona:
            </span>
            <div className="flex items-center gap-1">
              {Object.entries(DEMO_USERS).map(([key, config]) => {
                const isActive = activeDemoRole === key;
                return (
                  <button
                    key={key}
                    onClick={() => switchDemoRole(key)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-zomato-red to-swiggy-orange text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {config.roleLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Controls: Health Pill, Swagger Link, User Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* Live Actuator Health Heartbeat Badge */}
            <button
              onClick={onOpenDevOpsModal}
              title="Click to inspect Spring Boot Actuator health and telemetry"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-xs"
            >
              <span className="relative flex h-2.5 w-2.5">
                {backendHealth.status === 'UP' ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                )}
              </span>
              <span className="font-mono text-[11px] text-slate-300 hidden sm:inline">
                {backendHealth.status === 'UP' ? 'Core: Online' : 'Core: Offline'}
              </span>
            </button>

            {/* Swagger UI Deep-Link */}
            <a
              href="/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              title="Open OpenAPI 3.0 / Swagger UI"
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Swagger Docs</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* User Profile / Active Role Avatar */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-swiggy-orange to-zomato-red flex items-center justify-center text-white font-bold text-xs">
                  {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-none">
                    {user?.username || 'admin'}
                  </div>
                  <div className="text-[10px] text-swiggy-orange font-medium mt-0.5 leading-none">
                    {user?.roles?.[0]?.replace('ROLE_', '') || 'ADMIN'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Profile Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white">{user?.username}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@partnerportal.com'}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {user?.roles?.map((role) => (
                        <span
                          key={role}
                          className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-swiggy-orange/20 text-swiggy-orange border border-swiggy-orange/30"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Role Switcher within dropdown */}
                  <div className="md:hidden py-2 border-b border-slate-800 px-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Switch Persona
                    </p>
                    <div className="flex flex-col gap-1">
                      {Object.entries(DEMO_USERS).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => {
                            switchDemoRole(key);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 text-xs rounded-lg ${
                            activeDemoRole === key
                              ? 'bg-swiggy-orange text-white font-semibold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {config.roleLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={onOpenDevOpsModal}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      System Health Radar
                    </button>
                    <a
                      href="/swagger-ui.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                      OpenAPI Swagger Docs
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
