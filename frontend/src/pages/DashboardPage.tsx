import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dashboardApi } from '@/lib/dashboard';
import { partnersApi } from '@/lib/partners';
import { DashboardSummary, PartnerStatus } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, UserCheck, Clock, UserX, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: dashboardApi.getSummary,
  });

  const { data: queueData, isLoading: queueLoading } = useQuery({
    queryKey: ['verificationQueuePreview'],
    queryFn: () => partnersApi.search({ status: 'PENDING', page: 0, size: 5 }),
  });

  if (isError) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <PageHeader title="Dashboard" description="Fleet operations overview" />
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Failed to load dashboard data</h3>
              <p className="text-red-600 text-sm mt-1">There was a problem connecting to the server.</p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-white text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = data;
  
  const pieData = summary ? [
    { name: 'Active', value: summary.activePartners, color: '#10B981' },
    { name: 'Pending/Verif', value: summary.pendingPartners + summary.verificationPartners, color: '#F59E0B' },
    { name: 'Suspended/Deact', value: summary.suspendedPartners + summary.deactivatedPartners, color: '#EF4444' },
    { name: 'Rejected', value: summary.rejectedPartners, color: '#6B7280' },
  ] : [];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader title="Dashboard" description="Fleet operations overview" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Fleet"
          value={summary?.totalPartners ?? (isLoading ? '...' : 0)}
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard
          title="Active Partners"
          value={summary?.activePartners ?? (isLoading ? '...' : 0)}
          subtitle={summary ? `${summary.activeFleetPercentage.toFixed(1)}% of total` : undefined}
          icon={<UserCheck className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="In Verification"
          value={summary ? summary.pendingPartners + summary.verificationPartners : (isLoading ? '...' : 0)}
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Inactive"
          value={summary ? summary.suspendedPartners + summary.deactivatedPartners : (isLoading ? '...' : 0)}
          icon={<UserX className="w-5 h-5 text-red-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="lg:col-span-1 shadow-sm border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            {isLoading ? (
              <div className="w-48 h-48 rounded-full border-8 border-gray-100 border-t-gray-200 animate-spin" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} Partners`, 'Count']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Verification Queue Preview */}
        <Card className="lg:col-span-2 shadow-sm border-gray-200 flex flex-col">
          <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-gray-100">
            <CardTitle className="text-base">Verification Queue Preview</CardTitle>
            <Link to="/verification" className="text-sm text-[#E8590C] hover:text-[#d6510a] font-medium">
              View All
            </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {queueLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : queueData?.content && queueData.content.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {queueData.content.map(partner => (
                  <div key={partner.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-medium text-sm">
                        {partner.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{partner.fullName}</p>
                        <p className="text-xs text-gray-500">{partner.city} • {partner.vehicleType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={partner.currentStatus as PartnerStatus} />
                      <Link
                        to={`/backoffice/verification/${partner.id}`}
                        className="text-xs font-medium text-[#E8590C] hover:text-[#d6510a] bg-orange-50 px-3 py-1.5 rounded-md"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-green-50 p-3 rounded-full mb-3">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">All caught up!</p>
                <p className="text-xs text-gray-500 mt-1">No partners in the verification queue.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  loading = false,
  accent = 'blue'
}: { 
  title: string; 
  value?: number | string; 
  subtitle?: string; 
  icon: React.ReactNode; 
  loading?: boolean;
  accent?: 'blue' | 'green' | 'amber' | 'red';
}) {
  const accentColors = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50',
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className={`p-2 rounded-lg ${accentColors[accent]}`}>
            {icon}
          </div>
        </div>
        <div>
          {loading ? (
            <Skeleton className="h-8 w-16 mb-1" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900">{value?.toLocaleString() || 0}</h3>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
