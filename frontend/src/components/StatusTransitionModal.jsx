import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { partnerApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { STATUS_CONFIG } from './PartnerCard';

export const PERMISSIBLE_TRANSITIONS = {
  PENDING: ['VERIFICATION', 'REJECTED'],
  VERIFICATION: ['ACTIVE', 'REJECTED'],
  ACTIVE: ['SUSPENDED', 'DEACTIVATED'],
  SUSPENDED: ['ACTIVE', 'DEACTIVATED'],
  REJECTED: [],
  DEACTIVATED: [],
};

export const StatusTransitionModal = ({
  isOpen,
  onClose,
  partner,
  onSuccess,
  onError,
}) => {
  const { user } = useAuth();
  const [targetStatus, setTargetStatus] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !partner) return null;

  const currentStatus = partner.currentStatus || 'PENDING';
  const allowedTargets = PERMISSIBLE_TRANSITIONS[currentStatus] || [];
  const currentCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetStatus) {
      setError('Please choose a valid target status.');
      return;
    }
    if (!reason.trim()) {
      setError('A valid business reason is mandatory for compliance auditing.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const updated = await partnerApi.updateStatus(partner.id, targetStatus, reason.trim());
      onSuccess(updated);
      onClose();
      setTargetStatus('');
      setReason('');
    } catch (err) {
      setError(err.message || 'Failed to transition state. Check permissions or valid transitions.');
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-swiggy-orange to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Partner Lifecycle FSM</h2>
              <p className="text-xs text-slate-400">Deterministic State Transition Workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Target Partner Overview */}
          <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Target Courier</p>
              <h3 className="text-sm font-bold text-white">{partner.fullName}</h3>
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">{partner.phoneNumber}</p>
            </div>
            
            {/* Current State Pill */}
            <div className="text-right">
              <p className="text-[11px] text-slate-400 mb-1">Current State</p>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 ${currentCfg.bg} ${currentCfg.text} ${currentCfg.border}`}>
                <span className={`w-2 h-2 rounded-full ${currentCfg.dot}`} />
                {currentCfg.label}
              </div>
            </div>
          </div>

          {/* Transition Stepper Representation */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Select Permitted Target Transition *
            </label>

            {allowedTargets.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
                This partner is in terminal state <span className="font-bold text-white">{currentStatus}</span> and cannot transition further.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {allowedTargets.map((target) => {
                  const cfg = STATUS_CONFIG[target] || STATUS_CONFIG.ACTIVE;
                  const isSelected = targetStatus === target;
                  return (
                    <div
                      key={target}
                      onClick={() => setTargetStatus(target)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? `${cfg.bg} ${cfg.border} ring-2 ring-swiggy-orange shadow-md`
                          : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                        <span className="text-xs font-bold text-white">{cfg.label}</span>
                      </div>
                      <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-swiggy-orange' : 'text-slate-600'}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mandatory Business Reason */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Transition Reason / Operational Note *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Verified Aadhaar, vehicle registration RC, and clean background check."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-swiggy-orange focus:ring-1 focus:ring-swiggy-orange"
            />
            <p className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Audit trail will record actor: <strong className="text-slate-300 font-mono">{user?.username || 'admin'}</strong></span>
              <span>Required by ISO 27001 / FSM</span>
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || allowedTargets.length === 0}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-swiggy-orange to-amber-500 text-white shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Transitioning...
                </>
              ) : (
                <>
                  Confirm Transition <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
