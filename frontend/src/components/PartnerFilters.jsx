import React from 'react';
import { Search, X, LayoutGrid, List, Plus, Filter, Bike, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All Couriers' },
  { key: 'ACTIVE', label: 'Active', badgeColor: 'bg-emerald-500' },
  { key: 'VERIFICATION', label: 'Verification', badgeColor: 'bg-amber-500' },
  { key: 'PENDING', label: 'Pending', badgeColor: 'bg-blue-500' },
  { key: 'SUSPENDED', label: 'Suspended', badgeColor: 'bg-rose-500' },
  { key: 'DEACTIVATED', label: 'Deactivated', badgeColor: 'bg-slate-500' },
];

const VEHICLE_FILTERS = [
  { key: 'ALL', label: 'All Vehicles', icon: '⚡' },
  { key: 'MOTORCYCLE', label: 'Motorcycle', icon: '🛵' },
  { key: 'SCOOTER', label: 'Scooter', icon: '🛵' },
  { key: 'BICYCLE', label: 'Bicycle', icon: '🚲' },
  { key: 'CAR', label: 'Car', icon: '🚗' },
  { key: 'VAN', label: 'Van', icon: '🚐' },
];

export const PartnerFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  vehicleFilter,
  onVehicleChange,
  viewMode,
  onViewModeChange,
  onOpenOnboardModal,
  totalResults,
}) => {
  const { canCreatePartner } = useAuth();

  return (
    <div className="glass-panel p-4 rounded-2xl mb-6 space-y-4">
      
      {/* Top Row: Search Input + View Switcher + Onboard Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by courier name, phone (+91), license, vehicle number..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-swiggy-orange focus:ring-1 focus:ring-swiggy-orange transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid Card View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-swiggy-orange shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Dense Table View"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-swiggy-orange shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Action: Onboard New Courier CTA */}
          <button
            onClick={onOpenOnboardModal}
            disabled={!canCreatePartner}
            title={!canCreatePartner ? 'Viewer role is read-only. Switch to Admin or Ops Manager.' : 'Onboard delivery partner'}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-200 shadow-lg ${
              canCreatePartner
                ? 'bg-gradient-to-r from-zomato-red via-swiggy-orange to-amber-500 text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Courier</span>
          </button>
        </div>

      </div>

      {/* Bottom Row: Status Tabs & Vehicle Chips */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((tab) => {
            const isSelected = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onStatusChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  isSelected
                    ? 'bg-swiggy-orange text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-800/60'
                }`}
              >
                {tab.badgeColor && (
                  <span className={`w-1.5 h-1.5 rounded-full ${tab.badgeColor}`} />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vehicle Filter Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
          <span className="text-[11px] font-medium text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Vehicle:
          </span>
          {VEHICLE_FILTERS.map((vf) => {
            const isSelected = vehicleFilter === vf.key;
            return (
              <button
                key={vf.key}
                onClick={() => onVehicleChange(vf.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-orange-400 border border-orange-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className="mr-1">{vf.icon}</span>
                {vf.label}
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
