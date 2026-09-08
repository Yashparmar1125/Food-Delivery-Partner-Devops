import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { partnersApi } from '@/lib/partners';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Partner, VALID_TRANSITIONS, STATUS_LABELS } from '@/types';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner;
}

export default function StatusChangeModal({ isOpen, onClose, partner }: StatusChangeModalProps) {
  const [targetStatus, setTargetStatus] = useState<string>('');
  const [reason, setReason] = useState('');
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTargetStatus('');
      setReason('');
    }
  }, [isOpen]);

  const validTransitions = VALID_TRANSITIONS[partner.currentStatus] || [];

  const mutation = useMutation({
    mutationFn: () => partnersApi.updateStatus(partner.id, targetStatus as any, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', String(partner.id)] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      success(`Status successfully changed to ${STATUS_LABELS[targetStatus as keyof typeof STATUS_LABELS].label}`);
      onClose();
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to change status');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStatus) {
      showError('Please select a target status');
      return;
    }
    if (!reason.trim()) {
      showError('Please provide a reason');
      return;
    }
    mutation.mutate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Partner Status"
    >
      <div className="mb-4 text-sm text-gray-600">
        Current status: <span className="font-semibold text-gray-900">{STATUS_LABELS[partner.currentStatus as keyof typeof STATUS_LABELS].label}</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {validTransitions.length === 0 ? (
          <div className="p-4 bg-amber-50 text-amber-800 rounded-md text-sm">
            This partner's current status is terminal. No further status changes can be made.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label required>New Status</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {validTransitions.map((status) => (
                  <label 
                    key={status}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      targetStatus === status 
                        ? 'border-[#E8590C] bg-orange-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={targetStatus === status}
                      onChange={(e) => setTargetStatus(e.target.value)}
                      className="w-4 h-4 text-[#E8590C] border-gray-300 focus:ring-[#E8590C]"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {STATUS_LABELS[status as keyof typeof STATUS_LABELS].label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="reason" required>Reason for change</Label>
              <textarea
                id="reason"
                className="w-full text-sm border-gray-300 rounded-md focus:ring-[#E8590C] focus:border-[#E8590C] min-h-[80px]"
                placeholder="Briefly explain why you are changing the status..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-[#E8590C] hover:bg-[#d6510a]" 
            disabled={mutation.isPending || validTransitions.length === 0 || !targetStatus || !reason.trim()}
          >
            {mutation.isPending ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
