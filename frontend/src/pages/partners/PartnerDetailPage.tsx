import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { partnersApi } from '@/lib/partners';
import { useAuth } from '@/hooks/useAuth';
import { PartnerStatus } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { MapPin, Mail, Phone, Car, FileText, ChevronRight, Edit, AlertTriangle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import StatusChangeModal from '@/components/partners/StatusChangeModal';
import DeactivateConfirmModal from '@/components/partners/DeactivateConfirmModal';

export default function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const { data: partnerData, isLoading: partnerLoading, isError: partnerError } = useQuery({
    queryKey: ['partner', id],
    queryFn: () => partnersApi.getById(id!),
    enabled: !!id,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['partnerHistory', id],
    queryFn: () => partnersApi.getStatusHistory(id!),
    enabled: activeTab === 'history' && !!id,
  });

  if (partnerError) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Partner not found</h2>
        <p className="text-gray-500">The partner you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/partners')} className="mt-4">Back to Partners</Button>
      </div>
    );
  }

  const partner = partnerData;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/partners" className="hover:text-gray-900 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Partners
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Details</span>
      </div>

      {partnerLoading || !partner ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card>
            <CardContent className="p-6 flex gap-6 items-center">
              <Skeleton className="h-20 w-20 rounded-full shrink-0" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <PageHeader title={partner.fullName} />
            <div className="flex flex-wrap gap-2">
              {hasRole('ROLE_OPS_MANAGER') && (
                <>
                  <Link to={`/partners/${partner.id}/edit`}>
                    <Button variant="secondary" className="bg-white">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => setIsStatusModalOpen(true)}
                    className="bg-gray-900 hover:bg-gray-800 text-white"
                  >
                    Change Status
                  </Button>
                </>
              )}
              {hasRole('ROLE_ADMIN') && (
                <Button 
                  variant="secondary"
                  onClick={() => setIsDeactivateModalOpen(true)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              )}
            </div>
          </div>

          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 h-24"></div>
            <CardContent className="p-6 relative pt-0">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center bg-gradient-to-br from-[#E8590C] to-amber-500 text-white text-3xl font-bold shrink-0">
                  {partner.fullName.charAt(0)}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{partner.fullName}</h2>
                    <StatusBadge status={partner.currentStatus as PartnerStatus} />
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-400" /> {partner.city}</span>
                    <span className="flex items-center"><Mail className="w-4 h-4 mr-1.5 text-gray-400" /> {partner.email}</span>
                    <span className="flex items-center"><Phone className="w-4 h-4 mr-1.5 text-gray-400" /> {partner.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 flex gap-6 mt-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'profile' ? 'border-[#E8590C] text-[#E8590C]' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Details
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'history' ? 'border-[#E8590C] text-[#E8590C]' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Status History
                </button>
              </div>

              <div className="pt-6">
                {activeTab === 'profile' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h3>
                      <div className="space-y-4">
                        <InfoItem label="Full Name" value={partner.fullName} />
                        <InfoItem label="Email Address" value={partner.email} />
                        <InfoItem label="Phone Number" value={partner.phoneNumber} />
                        <InfoItem label="City" value={partner.city} />
                        <InfoItem label="Joined Date" value={partner.createdAt ? format(new Date(partner.createdAt), 'MMMM d, yyyy') : 'N/A'} />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Vehicle Information</h3>
                      <div className="space-y-4">
                        <InfoItem 
                          label="Vehicle Type" 
                          value={partner.vehicleType} 
                          icon={<Car className="w-4 h-4 text-gray-400" />} 
                        />
                        <InfoItem 
                          label="Registration Number" 
                          value={partner.vehicleRegistrationNumber || 'N/A'} 
                          icon={<FileText className="w-4 h-4 text-gray-400" />}
                        />
                        <InfoItem 
                          label="License Number" 
                          value={partner.licenseNumber || 'N/A'} 
                          icon={<FileText className="w-4 h-4 text-gray-400" />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    {historyLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))}
                      </div>
                    ) : historyData?.length ? (
                      <div className="relative border-l-2 border-gray-100 ml-3 md:ml-4 pl-6 md:pl-8 py-2 space-y-8">
                        {historyData.map((record: any) => (
                          <div key={record.id} className="relative">
                            <div className="absolute -left-[35px] md:-left-[41px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#E8590C]" />
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  {record.previousStatus && (
                                    <>
                                      <StatusBadge status={record.previousStatus as PartnerStatus} />
                                      <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </>
                                  )}
                                  <StatusBadge status={record.newStatus as PartnerStatus} />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(record.changedAt), 'MMM d, yyyy h:mm a')}
                                </span>
                              </div>
                              {record.reason && (
                                <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded border border-gray-100">
                                  "{record.reason}"
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                Changed by <span className="font-medium text-gray-700">{record.changedBy}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No history available for this partner.</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <StatusChangeModal 
            isOpen={isStatusModalOpen} 
            onClose={() => setIsStatusModalOpen(false)} 
            partner={partner} 
          />
          
          <DeactivateConfirmModal 
            isOpen={isDeactivateModalOpen} 
            onClose={() => setIsDeactivateModalOpen(false)} 
            partner={partner} 
          />
        </>
      )}
    </div>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="mt-0.5">{icon}</div>}
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
