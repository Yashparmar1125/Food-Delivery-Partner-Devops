import React from 'react';
import { Users, Bike, Clock, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

export const DashboardStats = ({ summary, loading, onFilterStatus }) => {
  const total = summary?.totalPartners ?? 0;
  const active = summary?.activePartners ?? 0;
  const pending = (summary?.pendingPartners ?? 0) + (summary?.verificationPartners ?? 0);
  const suspended = (summary?.suspendedPartners ?? 0) + (summary?.deactivatedPartners ?? 0);
  const activeRate = summary?.activeFleetPercentage
    ? summary.activeFleetPercentage.toFixed(1)
    : total > 0
    ? ((active / total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Total Fleet Card */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('ALL')}
        className="glass-panel p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-slate-700 transition-all duration-200"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/0 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Fleet Size
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {loading ? '...' : total}
          </span>
          <span className="text-xs text-slate-400">Registered Couriers</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-blue-400">
            <TrendingUp className="w-3.5 h-3.5" /> All Registered
          </span>
          <span className="text-[11px] text-slate-500">PostgreSQL DB</span>
        </div>
      </div>

      {/* 2. Active on Duty Card (Swiggy / Zomato Signature Pulse) */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('ACTIVE')}
        className="glass-panel p-5 rounded-2xl relative overflow-hidden group cursor-pointer border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/20 hover:border-emerald-500/50 transition-all duration-200"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Active On Duty
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Bike className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-emerald-400 font-mono">
            {loading ? '...' : active}
          </span>
          <span className="text-xs text-emerald-300/80">Couriers Dispatched</span>
        </div>
        
        {/* Fleet Capacity Progress Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-[11px] mb-1">
            <span className="text-slate-400">Fleet Utilization</span>
            <span className="font-bold text-emerald-400">{activeRate}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(parseFloat(activeRate), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Verification Queue Card (Amber Warning) */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('VERIFICATION')}
        className="glass-panel p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-amber-500/40 transition-all duration-200"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider">
            Verification Queue
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-amber-300 font-mono">
            {loading ? '...' : pending}
          </span>
          <span className="text-xs text-slate-400">Pending Background Check</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-amber-400/80">
            {summary?.pendingPartners ?? 0} New | {summary?.verificationPartners ?? 0} In Review
          </span>
          <span className="text-[11px] text-slate-500">Needs Review</span>
        </div>
      </div>

      {/* 4. Suspended / Inactive Card */}
      <div 
        onClick={() => onFilterStatus && onFilterStatus('SUSPENDED')}
        className="glass-panel p-5 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-slate-700 transition-all duration-200"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Off-Road / Suspended
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-200 font-mono">
            {loading ? '...' : suspended}
          </span>
          <span className="text-xs text-slate-400">Couriers Inactive</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{summary?.suspendedPartners ?? 0} Suspended</span>
          <span className="text-slate-500">{summary?.deactivatedPartners ?? 0} Deactivated</span>
        </div>
      </div>

    </div>
  );
};
