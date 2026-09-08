import React from 'react';
import { PartnerStatus } from '@/types';

export interface StatusBadgeProps {
  status: PartnerStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config: Record<PartnerStatus, { bg: string; text: string; dot: string; label: string }> = {
    PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Pending' },
    VERIFICATION: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: 'In Verification' },
    ACTIVE: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active' },
    SUSPENDED: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Suspended' },
    REJECTED: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Rejected' },
    DEACTIVATED: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500', label: 'Deactivated' },
  };

  const { bg, text, dot, label } = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`} />
      {label}
    </span>
  );
};
