import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { partnersApi } from '@/lib/partners';
import { dashboardApi } from '@/lib/dashboard';
import { PartnerStatus } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function VerificationQueuePage() {
  const { data: summaryData } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardApi.getSummary,
  });

  const { data: queueData, isLoading, isError, refetch } = useQuery({
    queryKey: ['verificationQueueFull'],
    queryFn: async () => {
      // Get both pending and verification statuses. We fetch page 0 with larger size for the queue view.
      const pending = await partnersApi.search({ status: 'PENDING', page: 0, size: 20 });
      const verification = await partnersApi.search({ status: 'VERIFICATION', page: 0, size: 20 });
      
      return {
        pending: pending.content,
        verification: verification.content,
      };
    },
  });

  const allQueueItems = queueData ? [...queueData.verification, ...queueData.pending] : [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Verification Queue" description="Review and approve new partner applications" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Pending Review</p>
              <h3 className="text-2xl font-bold text-amber-900">{summaryData?.pendingPartners || 0}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">In Verification</p>
              <h3 className="text-2xl font-bold text-blue-900">{summaryData?.verificationPartners || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        {isError ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-red-800">Failed to load queue</h3>
            <Button onClick={() => refetch()} variant="secondary" className="mt-4 bg-white">Try Again</Button>
          </div>
        ) : isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-gray-100 pb-4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : allQueueItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-2">There are no partners waiting for verification right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Applicant Name</th>
                  <th className="px-6 py-4 font-medium">Location & Vehicle</th>
                  <th className="px-6 py-4 font-medium">Applied On</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allQueueItems.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{partner.fullName}</div>
                      <div className="text-xs text-gray-500">{partner.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{partner.city}</div>
                      <div className="text-xs text-gray-500">{partner.vehicleType}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {partner.createdAt ? format(new Date(partner.createdAt), 'MMM d, yyyy h:mm a') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={partner.currentStatus as PartnerStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/backoffice/verification/${partner.id}`}>
                        <Button className="bg-[#E8590C] hover:bg-[#d6510a] text-sm">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
