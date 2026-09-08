import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partnersApi } from '@/lib/partners';
import { useToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, Check, X, AlertTriangle } from 'lucide-react';

export default function VerificationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['partner', id],
    queryFn: () => partnersApi.getById(id!),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, reason }: { status: string, reason?: string }) => 
      partnersApi.updateStatus(id!, status as any, reason || ''),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['partner', id] });
      queryClient.invalidateQueries({ queryKey: ['verificationQueueFull'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      
      const isApproved = variables.status === 'ACTIVE' || variables.status === 'VERIFICATION';
      toastSuccess(isApproved ? 'Partner advanced successfully' : 'Partner rejected');
      
      if (variables.status === 'ACTIVE' || variables.status === 'REJECTED') {
        navigate('/verification');
      }
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to update status');
    }
  });

  const handleApprove = () => {
    if (!data) return;
    const targetStatus = data.currentStatus === 'PENDING' ? 'VERIFICATION' : 'ACTIVE';
    statusMutation.mutate({ 
      status: targetStatus, 
      reason: `Approved and moved to ${targetStatus}` 
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toastError('Please provide a reason for rejection');
      return;
    }
    statusMutation.mutate({ status: 'REJECTED', reason: rejectReason });
  };

  if (isLoading) {
    return <div className="p-6 max-w-3xl mx-auto"><Skeleton className="h-64 w-full" /></div>;
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Partner not found</h2>
        <Button onClick={() => navigate('/verification')} className="mt-4">Back to Queue</Button>
      </div>
    );
  }

  const partner = data;
  const isPending = partner.currentStatus === 'PENDING';
  const isVerification = partner.currentStatus === 'VERIFICATION';
  
  // Progress steps
  const steps = [
    { id: 'PENDING', label: 'Application Submitted', active: true, done: true },
    { id: 'VERIFICATION', label: 'Under Verification', active: isVerification || partner.currentStatus === 'ACTIVE', done: isVerification || partner.currentStatus === 'ACTIVE' },
    { id: 'ACTIVE', label: 'Active', active: partner.currentStatus === 'ACTIVE', done: partner.currentStatus === 'ACTIVE' }
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/verification" className="hover:text-gray-900 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Verification Queue
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900 font-medium">Review Application</span>
      </div>

      <PageHeader title="Review Partner Application" description={`Reviewing ${partner.fullName}`} />

      {/* Progress Stepper */}
      <div className="py-6 px-4 md:px-8 bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 z-0 rounded-full transition-all duration-500"
            style={{ width: isPending ? '0%' : isVerification ? '50%' : '100%' }}
          ></div>
          
          {steps.map((step, idx) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                step.done ? 'bg-green-500 border-green-500 text-white' : 
                step.active ? 'border-green-500 text-green-500 bg-white' : 
                'border-gray-300 text-gray-400 bg-white'
              }`}>
                {step.done ? <Check className="w-4 h-4" /> : <span>{idx + 1}</span>}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Applicant Information</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{partner.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-900">{partner.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">{partner.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium text-gray-900">{partner.city}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="font-medium text-gray-900">{partner.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration</p>
                  <p className="font-medium text-gray-900">{partner.vehicleRegistrationNumber || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-medium text-gray-900">{partner.licenseNumber || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-green-200">
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Approve Application</h3>
              <p className="text-sm text-gray-600 mb-4">
                {isPending 
                  ? "Mark as 'Under Verification' to begin background checks." 
                  : "All checks passed. Mark as 'Active' to complete onboarding."}
              </p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={handleApprove}
                disabled={statusMutation.isPending}
              >
                <Check className="w-4 h-4 mr-2" />
                {isPending ? 'Start Verification' : 'Approve & Activate'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Reject Application</h3>
              
              {!showRejectForm ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Reject this application if details are invalid or background checks failed.
                  </p>
                  <Button 
                    variant="secondary"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50" 
                    onClick={() => setShowRejectForm(true)}
                  >
                    <X className="w-4 h-4 mr-2" /> Reject Application
                  </Button>
                </>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="text-sm text-gray-700 font-medium mb-1 block">Reason for Rejection *</label>
                    <textarea 
                      className="w-full text-sm border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 min-h-[80px]"
                      placeholder="Explain why this application is rejected..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1 text-xs" 
                      onClick={() => setShowRejectForm(false)}
                      disabled={statusMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-xs" 
                      onClick={handleReject}
                      disabled={statusMutation.isPending}
                    >
                      Confirm Reject
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
