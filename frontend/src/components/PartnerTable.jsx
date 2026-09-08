import React from 'react';
import { STATUS_CONFIG, VEHICLE_ICONS } from './PartnerCard';
import { FileText, ArrowRightCircle, Trash2, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PartnerTable = ({
  partners,
  onOpenDetails,
  onOpenStatusModal,
  onDeletePartner,
}) => {
  const { canUpdateStatus, canDeletePartner } = useAuth();

  if (!partners || partners.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
        <p className="text-base font-semibold text-slate-300">No couriers match your search criteria</p>
        <p className="text-xs text-slate-500 mt-1">Try resetting filters or onboard a new partner</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold text-[11px]">
              <th className="py-3.5 px-4">Courier Name</th>
              <th className="py-3.5 px-4">Contact & City</th>
              <th className="py-3.5 px-4">Vehicle & Plate</th>
              <th className="py-3.5 px-4">License ID</th>
              <th className="py-3.5 px-4">Lifecycle Status</th>
              <th className="py-3.5 px-4">Joined</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {partners.map((partner) => {
              const statusCfg = STATUS_CONFIG[partner.currentStatus] || STATUS_CONFIG.PENDING;
              const vehicleIcon = VEHICLE_ICONS[partner.vehicleType] || '🛵';
              const initials = partner.fullName
                ? partner.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                : 'DP';

              return (
                <tr 
                  key={partner.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Courier Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-swiggy-orange flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-100 group-hover:text-swiggy-orange transition-colors truncate">
                          {partner.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {partner.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact & City */}
                  <td className="py-3 px-4 text-slate-300">
                    <div className="font-mono text-slate-200">{partner.phoneNumber}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {partner.city || 'N/A'}
                    </div>
                  </td>

                  {/* Vehicle */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <span>{vehicleIcon}</span>
                      <span className="capitalize">{partner.vehicleType?.toLowerCase() || 'Motorcycle'}</span>
                    </div>
                    <div className="font-mono text-[10px] text-amber-400 font-semibold mt-0.5">
                      {partner.vehicleRegistrationNumber || 'N/A'}
                    </div>
                  </td>

                  {/* License */}
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {partner.licenseNumber || 'PENDING'}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                      <span className="relative flex h-1.5 w-1.5">
                        {statusCfg.ping && (
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusCfg.dot}`} />
                        )}
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusCfg.dot}`} />
                      </span>
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : 'Recent'}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenDetails(partner)}
                        title="View profile & status history"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        onClick={() => onOpenStatusModal(partner)}
                        disabled={!canUpdateStatus || partner.currentStatus === 'DEACTIVATED' || partner.currentStatus === 'REJECTED'}
                        title="Transition lifecycle status"
                        className={`p-1.5 rounded-lg transition-colors ${
                          canUpdateStatus && partner.currentStatus !== 'DEACTIVATED' && partner.currentStatus !== 'REJECTED'
                            ? 'bg-swiggy-orange hover:bg-swiggy-dark text-white'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <ArrowRightCircle className="w-3.5 h-3.5" />
                      </button>

                      {canDeletePartner && (
                        <button
                          onClick={() => onDeletePartner(partner)}
                          title="Deactivate partner"
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
