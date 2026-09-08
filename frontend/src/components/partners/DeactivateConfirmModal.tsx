import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { partnersApi } from '@/lib/partners';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Partner } from '@/types';

interface DeactivateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Partner;
}

export default function DeactivateConfirmModal({ isOpen, onClose, partner }: DeactivateConfirmModalProps) {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => partnersApi.remove(partner.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      success('Partner permanently removed');
      onClose();
      navigate('/partners');
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to remove partner');
      onClose();
    }
  });

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() => mutation.mutate()}
      title="Delete Partner Record"
      message={`Are you absolutely sure you want to permanently delete the record for ${partner.fullName}? This action cannot be undone and will remove all history associated with this partner.`}
      confirmLabel={mutation.isPending ? "Deleting..." : "Yes, Delete Record"}
      cancelLabel="Cancel"
      variant="destructive"
      isLoading={mutation.isPending}
    />
  );
}
