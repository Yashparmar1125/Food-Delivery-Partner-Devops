import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { PartnerFilters } from './components/PartnerFilters';
import { PartnerCard } from './components/PartnerCard';
import { PartnerTable } from './components/PartnerTable';
import { OnboardingModal } from './components/OnboardingModal';
import { StatusTransitionModal } from './components/StatusTransitionModal';
import { PartnerDetailsDrawer } from './components/PartnerDetailsDrawer';
import { DevOpsHealthModal } from './components/DevOpsHealthModal';
import { Toast } from './components/Toast';
import { partnerApi, dashboardApi } from './api/client';
import { useAuth } from './context/AuthContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Bike, 
  Sparkles, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

export function App() {
  const { user } = useAuth();

  // State: Dashboard Summary
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // State: Partners List & Pagination
  const [partners, setPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // State: Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // State: Modals & Drawers
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [devopsModalOpen, setDevopsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

  // State: Toasts
  const [toasts, setToasts] = useState([]);

  // Toast Trigger Helper
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Dashboard Summary
  const fetchDashboardSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error loading dashboard summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  // Fetch Partners List with Dynamic Search & Filters
  const fetchPartners = useCallback(async () => {
    setLoadingPartners(true);
    try {
      let pageData;
      if (searchTerm.trim() || statusFilter !== 'ALL' || vehicleFilter !== 'ALL') {
        pageData = await partnerApi.search({
          name: searchTerm,
          status: statusFilter,
          vehicleType: vehicleFilter,
          page,
          size: pageSize,
          sort: 'createdAt,desc',
        });
      } else {
        pageData = await partnerApi.getAll(page, pageSize, 'createdAt,desc');
      }

      if (pageData && pageData.content) {
        setPartners(pageData.content);
        setTotalPages(pageData.totalPages || 1);
        setTotalElements(pageData.totalElements || 0);
      } else if (Array.isArray(pageData)) {
        setPartners(pageData);
        setTotalPages(1);
        setTotalElements(pageData.length);
      } else {
        setPartners([]);
        setTotalPages(1);
        setTotalElements(0);
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
      addToast({
        type: 'error',
        title: 'Query Error',
        message: err.message || 'Failed to load partners from database.',
      });
      setPartners([]);
    } finally {
      setLoadingPartners(false);
    }
  }, [searchTerm, statusFilter, vehicleFilter, page, pageSize, addToast]);

  // Initial load and periodic refresh
  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  // Reset page when search or filters change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setPage(0);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  const handleVehicleFilterChange = (vehicle) => {
    setVehicleFilter(vehicle);
    setPage(0);
  };

  // Onboard Success
  const handleOnboardSuccess = (created) => {
    addToast({
      type: 'success',
      title: 'Partner Onboarded',
      message: `Successfully onboarded ${created.fullName} in PENDING state.`,
    });
    fetchDashboardSummary();
    fetchPartners();
  };

  // Status Transition Success
  const handleStatusSuccess = (updated) => {
    addToast({
      type: 'success',
      title: 'Lifecycle State Updated',
      message: `${updated.fullName} is now in ${updated.currentStatus} status.`,
    });
    fetchDashboardSummary();
    fetchPartners();
  };

  // Soft-Delete / Deactivation
  const handleDeletePartner = async (partner) => {
    if (!window.confirm(`Are you sure you want to deactivate ${partner.fullName}?`)) {
      return;
    }

    try {
      await partnerApi.delete(partner.id);
      addToast({
        type: 'success',
        title: 'Partner Deactivated',
        message: `${partner.fullName} has been soft-deleted and marked inactive.`,
      });
      fetchDashboardSummary();
      fetchPartners();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Deactivation Failed',
        message: err.message || 'Failed to deactivate delivery partner.',
      });
    }
  };

  // Open Handlers
  const handleOpenStatusModal = (partner) => {
    setSelectedPartner(partner);
    setStatusModalOpen(true);
  };

  const handleOpenDetails = (partner) => {
    setSelectedPartner(partner);
    setDetailsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-swiggy-orange selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        onOpenDevOpsModal={() => setDevopsModalOpen(true)}
        onOpenOnboardModal={() => setOnboardModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Swiggy / Zomato Hero Operations Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-zomato-red/15 via-swiggy-orange/15 to-amber-500/0 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-zomato-red/20 to-swiggy-orange/20 border border-orange-500/30 text-orange-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-swiggy-orange" />
                Fleet Operations & Onboarding Hub
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Food Delivery Partner Portal
              </h1>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Centralized management for courier onboarding, document validation, dynamic fleet search, deterministic finite state machine (FSM) workflows, and continuous compliance audit trails.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  fetchDashboardSummary();
                  fetchPartners();
                  addToast({ type: 'info', message: 'Refreshed fleet data from PostgreSQL database.' });
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Radar</span>
              </button>
              
              <button
                onClick={() => setOnboardModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-zomato-red via-swiggy-orange to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Bike className="w-4 h-4" />
                <span>+ Onboard New Partner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Dashboard KPI Cards */}
        <DashboardStats
          summary={summary}
          loading={loadingSummary}
          onFilterStatus={handleStatusFilterChange}
        />

        {/* Search, Filter & View Controls */}
        <PartnerFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusFilterChange}
          vehicleFilter={vehicleFilter}
          onVehicleChange={handleVehicleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenOnboardModal={() => setOnboardModalOpen(true)}
          totalResults={totalElements}
        />

        {/* Partners Display: Grid vs Table */}
        {loadingPartners ? (
          <div className="glass-panel rounded-2xl p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-swiggy-orange animate-spin" />
            <p className="text-sm font-semibold text-slate-200">Querying PostgreSQL fleet records...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="glass-panel rounded-2xl p-16 text-center text-slate-400 border border-slate-800">
            <Bike className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">No Delivery Partners Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No couriers matched the current search query and filters. Try adjusting your search or onboard a new courier.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setVehicleFilter('ALL');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-swiggy-orange hover:bg-slate-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {partners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                onOpenDetails={handleOpenDetails}
                onOpenStatusModal={handleOpenStatusModal}
                onDeletePartner={handleDeletePartner}
              />
            ))}
          </div>
        ) : (
          <PartnerTable
            partners={partners}
            onOpenDetails={handleOpenDetails}
            onOpenStatusModal={handleOpenStatusModal}
            onDeletePartner={handleDeletePartner}
          />
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
            <div>
              Showing <span className="text-white font-semibold">{page * pageSize + 1}</span> to{' '}
              <span className="text-white font-semibold">
                {Math.min((page + 1) * pageSize, totalElements)}
              </span>{' '}
              of <span className="text-white font-semibold">{totalElements}</span> Couriers
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                Page {page + 1} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#070A12]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Food Delivery Partner Portal • 15-Week Capstone Engineering & DevOps</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Spring Boot 3.2.5</span>
            <span>•</span>
            <span>PostgreSQL 16</span>
            <span>•</span>
            <span>Docker</span>
            <span>•</span>
            <span>Ansible</span>
            <span>•</span>
            <span>Selenium E2E</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <OnboardingModal
        isOpen={onboardModalOpen}
        onClose={() => setOnboardModalOpen(false)}
        onSuccess={handleOnboardSuccess}
        onError={(msg) => addToast({ type: 'error', title: 'Onboarding Failed', message: msg })}
      />

      <StatusTransitionModal
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onSuccess={handleStatusSuccess}
        onError={(msg) => addToast({ type: 'error', title: 'Transition Rejected', message: msg })}
      />

      <PartnerDetailsDrawer
        isOpen={detailsDrawerOpen}
        onClose={() => {
          setDetailsDrawerOpen(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        onOpenStatusModal={handleOpenStatusModal}
      />

      <DevOpsHealthModal
        isOpen={devopsModalOpen}
        onClose={() => setDevopsModalOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
