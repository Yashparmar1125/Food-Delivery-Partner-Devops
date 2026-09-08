import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Bike, 
  Car, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  MoreVertical,
  ArrowRightCircle,
  FileText,
  Trash2,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const STATUS_CONFIG = {
  ACTIVE: {
    label: 'Active',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    ping: true,
  },
  VERIFICATION: {
    label: 'Verification',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    ping: false,
  },
  PENDING: {
    label: 'Pending',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    ping: false,
  },
  SUSPENDED: {
    label: 'Suspended',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-400',
    ping: false,
  },
  DEACTIVATED: {
    label: 'Deactivated',
    bg: 'bg-slate-700/30',
    text: 'text-slate-400',
    border: 'border-slate-700',
    dot: 'bg-slate-500',
    ping: false,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-rose-900/20',
    text: 'text-rose-500',
    border: 'border-rose-800/40',
    dot: 'bg-rose-500',
    ping: false,
  },
};

export const VEHICLE_ICONS = {
  MOTORCYCLE: '🛵',
  SCOOTER: '🛵',
  BICYCLE: '🚲',
  CAR: '🚗',
  VAN: '🚐',
};

export const PartnerCard = ({
  partner,
  onOpenDetails,
  onOpenStatusModal,
  onDeletePartner,
}) => {
  const { canUpdateStatus, canDeletePartner } = useAuth();
  const statusCfg = STATUS_CONFIG[partner.currentStatus] || STATUS_CONFIG.PENDING;
  const vehicleIcon = VEHICLE_ICONS[partner.vehicleType] || '🛵';

  // Get initials for avatar
  const initials = partner.fullName
    ? partner.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'DP';

  return (
    <div className="glass-panel rounded-2xl p-5 relative group hover:border-slate-700 transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header: Avatar, Name, Status Pill */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center font-bold text-sm text-swiggy-orange shadow-inner flex-shrink-0">
              {initials}
            </div>

            {/* Name & City */}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate group-hover:text-swiggy-orange transition-colors">
                {partner.fullName}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span className="truncate">{partner.city || 'National'}</span>
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 flex-shrink-0 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
            <span className="relative flex h-1.5 w-1.5">
              {statusCfg.ping && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusCfg.dot}`} />
              )}
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusCfg.dot}`} />
            </span>
            <span>{statusCfg.label}</span>
          </div>
        </div>

        {/* Vehicle & Plate Pill */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-sm">{vehicleIcon}</span>
            <span className="font-semibold capitalize text-slate-200">
              {partner.vehicleType ? partner.vehicleType.toLowerCase() : 'Motorcycle'}
            </span>
          </div>
          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
            {partner.vehicleRegistrationNumber || 'N/A'}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <a href={`tel:${partner.phoneNumber}`} className="hover:text-slate-200 transition-colors">
              {partner.phoneNumber}
            </a>
          </div>
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="truncate text-slate-400">{partner.email}</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetails(partner)}
          className="flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Audit Log</span>
        </button>

        <button
          onClick={() => onOpenStatusModal(partner)}
          disabled={!canUpdateStatus || partner.currentStatus === 'DEACTIVATED' || partner.currentStatus === 'REJECTED'}
          className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            canUpdateStatus && partner.currentStatus !== 'DEACTIVATED' && partner.currentStatus !== 'REJECTED'
              ? 'bg-gradient-to-r from-swiggy-orange to-amber-500 text-white hover:brightness-110 shadow-sm shadow-orange-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
          }`}
          title={!canUpdateStatus ? 'Requires Admin or Ops Manager role' : 'Transition FSM Status'}
        >
          <ArrowRightCircle className="w-3.5 h-3.5" />
          <span>State</span>
        </button>

        {canDeletePartner && (
          <button
            onClick={() => onDeletePartner(partner)}
            title="Deactivate partner (Soft-delete)"
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
