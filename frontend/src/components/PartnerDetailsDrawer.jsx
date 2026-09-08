import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Bike, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  History, 
  ArrowRight,
  Loader2,
  FileCheck
} from 'lucide-react';
import { partnerApi } from '../api/client';
import { STATUS_CONFIG, VEHICLE_ICONS } from './PartnerCard';

export const PartnerDetailsDrawer = ({
  isOpen,
  onClose,
  partner,
  onOpenStatusModal,
}) => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'history'

  useEffect(() => {
    if (isOpen && partner?.id) {
      let isMounted = true;
      setLoadingHistory(true);
      partnerApi
        .getStatusHistory(partner.id)
        .then((data) => {
          if (isMounted) setHistory(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error('Error fetching partner history:', err);
          if (isMounted) setHistory([]);
        })
        .finally(() => {
          if (isMounted) setLoadingHistory(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, partner]);

  if (!isOpen || !partner) return null;

  const statusCfg = STATUS_CONFIG[partner.currentStatus] || STATUS_CONFIG.PENDING;
  const vehicleIcon = VEHICLE_ICONS[partner.vehicleType] || '🛵';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-base text-swiggy-orange">
                {partner.fullName?.substring(0, 2).toUpperCase() || 'DP'}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-white truncate">{partner.fullName}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                    {statusCfg.label}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">#{partner.id.substring(0, 8)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'profile'
                  ? 'border-swiggy-orange text-swiggy-orange bg-slate-800/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Courier Profile
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'history'
                  ? 'border-swiggy-orange text-swiggy-orange bg-slate-800/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Status Audit Trail ({history.length})
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-slide-up">
                
                {/* Contact Section */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Contact & Territory
                  </h3>
                  <div className="space-y-2 bg-slate-800/50 border border-slate-800 rounded-2xl p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> Phone:
                      </span>
                      <span className="font-mono font-semibold text-white">{partner.phoneNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-500" /> Email:
                      </span>
                      <span className="text-slate-200 truncate max-w-[180px]">{partner.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" /> City Hub:
                      </span>
                      <span className="font-semibold text-white">{partner.city || 'National'}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Licensing */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Vehicle & Documents
                  </h3>
                  <div className="space-y-2 bg-slate-800/50 border border-slate-800 rounded-2xl p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Bike className="w-3.5 h-3.5 text-slate-500" /> Vehicle Category:
                      </span>
                      <span className="font-semibold text-swiggy-orange flex items-center gap-1.5">
                        <span>{vehicleIcon}</span>
                        <span className="capitalize">{partner.vehicleType?.toLowerCase()}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">License Plate Number:</span>
                      <span className="font-mono font-bold text-amber-300">{partner.vehicleRegistrationNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Driving License ID:</span>
                      <span className="font-mono text-slate-300">{partner.licenseNumber || 'PENDING'}</span>
                    </div>
                  </div>
                </div>

                {/* System & Audit Metadata */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    System Identifiers
                  </h3>
                  <div className="space-y-2 bg-slate-800/50 border border-slate-800 rounded-2xl p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Partner UUID:</span>
                      <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px]" title={partner.id}>
                        {partner.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> Registered At:
                      </span>
                      <span className="text-slate-300">
                        {partner.createdAt ? new Date(partner.createdAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Soft-Delete Active Status:</span>
                      <span className={`font-semibold ${partner.active ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {partner.active ? 'TRUE (Active Profile)' : 'FALSE (Archived)'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Chronological Status History Timeline */}
            {activeTab === 'history' && (
              <div className="space-y-4 animate-slide-up">
                {loadingHistory ? (
                  <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-swiggy-orange" />
                    <span className="text-xs">Loading audit records from database...</span>
                  </div>
                ) : history.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
                    <FileCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs">No status transitions recorded yet</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {history.map((record, index) => {
                      const prevCfg = STATUS_CONFIG[record.previousStatus] || STATUS_CONFIG.PENDING;
                      const nextCfg = STATUS_CONFIG[record.newStatus] || STATUS_CONFIG.ACTIVE;

                      return (
                        <div key={record.id || index} className="relative group">
                          {/* Timeline Dot */}
                          <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-swiggy-orange ring-4 ring-slate-900" />

                          <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                            {/* Transition Badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prevCfg.bg} ${prevCfg.text}`}>
                                {record.previousStatus}
                              </span>
                              <ArrowRight className="w-3 h-3 text-slate-500" />
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${nextCfg.bg} ${nextCfg.text}`}>
                                {record.newStatus}
                              </span>
                            </div>

                            {/* Reason */}
                            <p className="text-xs text-slate-200 font-medium">
                              "{record.reason || 'No reason provided'}"
                            </p>

                            {/* Actor & Timestamp */}
                            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                              <span>Actor: <strong className="text-slate-300 font-mono">{record.changedBy || 'SYSTEM'}</strong></span>
                              <span>{record.createdAt ? new Date(record.createdAt).toLocaleString() : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/90">
            <button
              onClick={() => {
                onClose();
                onOpenStatusModal(partner);
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-swiggy-orange to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Transition State Machine Status</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
