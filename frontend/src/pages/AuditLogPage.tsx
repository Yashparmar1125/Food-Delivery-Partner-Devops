import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { partnersApi } from '@/lib/partners';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PartnerStatus } from '@/types';
import { History, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogPage() {
  // Simplification: We just fetch recent partners and link to their history
  // In a real app, there would be a dedicated global audit log endpoint
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recentPartnersAudit'],
    queryFn: () => partnersApi.search({ page: 0, size: 20 }),
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Audit Log" description="Track partner status changes and operational history" />

      <Card className="border-gray-200 shadow-sm p-4 bg-orange-50/50 border-[#E8590C]/20 mb-6">
        <div className="flex gap-3 items-start">
          <History className="w-5 h-5 text-[#E8590C] mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Global Audit Log</h3>
            <p className="text-sm text-gray-600 mt-1">
              Select a partner below to view their complete status transition history. 
              A comprehensive global event timeline is planned for a future update.
            </p>
          </div>
        </div>
      </Card>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Failed to load partners</div>
        ) : data?.content.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No partner activity found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Partner Name</th>
                  <th className="px-6 py-4 font-medium">Current Status</th>
                  <th className="px-6 py-4 font-medium">Registered Date</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.content?.map((partner: any) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {partner.fullName}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={partner.currentStatus as PartnerStatus} />
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {format(new Date(partner.createdAt), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/partners/${partner.id}`}>
                        <Button variant="secondary" size="sm" className="text-xs">
                          <History className="w-3 h-3 mr-1.5" /> View History
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
