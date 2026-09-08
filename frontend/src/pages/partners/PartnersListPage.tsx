import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { partnersApi } from '@/lib/partners';
import { useAuth } from '@/hooks/useAuth';
import { PartnerStatus, VehicleType } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Verification', value: 'VERIFICATION' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Deactivated', value: 'DEACTIVATED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function PartnersListPage() {
  const { hasRole, canCreate } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '0', 10);
  const status = searchParams.get('status') || '';
  const vehicleType = searchParams.get('vehicleType') || '';
  const search = searchParams.get('q') || '';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['partners', page, status, vehicleType, search],
    queryFn: () => partnersApi.search({
      name: search || undefined,
      status: status as PartnerStatus || undefined,
      vehicleType: vehicleType as VehicleType || undefined,
      page,
      size: 10,
    }),
  });

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFilters('q', formData.get('search') as string);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Partners" description="Manage your delivery fleet" />
        {(canCreate || hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER')) && (
          <Link to="/partners/new">
            <Button className="bg-[#E8590C] hover:bg-[#d6510a]">
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              name="search"
              placeholder="Search by name, phone, or email..."
              defaultValue={search}
              className="pl-9 w-full"
            />
          </form>
          <div className="flex gap-2 items-center">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              className="h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8590C]"
              value={vehicleType}
              onChange={(e) => updateFilters('vehicleType', e.target.value)}
            >
              <option value="">All Vehicles</option>
              <option value="BICYCLE">Bicycle</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="SCOOTER">Scooter</option>
              <option value="CAR">Car</option>
              <option value="VAN">Van</option>
            </select>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => updateFilters('status', f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                status === f.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-red-800">Failed to load partners</h3>
          <p className="text-red-600 text-sm mt-1 mb-4">There was an error fetching the data.</p>
          <Button onClick={() => refetch()} variant="secondary" className="bg-white">Try Again</Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.content.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No partners found</h3>
          <p className="text-gray-500 mt-1 max-w-sm mx-auto">
            We couldn't find any partners matching your current filters. Try adjusting your search criteria.
          </p>
          {(search || status || vehicleType) && (
            <Button
              variant="secondary"
              onClick={() => setSearchParams({})}
              className="mt-6"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Partner</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Contact</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Vehicle</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.content.map((partner: any) => (
                  <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#E8590C] flex items-center justify-center font-bold">
                          {partner.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{partner.fullName}</div>
                          <div className="text-xs text-gray-500">{partner.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-gray-900">{partner.phoneNumber}</div>
                      <div className="text-gray-500 text-xs">{partner.email}</div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-gray-600">
                      {partner.vehicleType.charAt(0) + partner.vehicleType.slice(1).toLowerCase()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={partner.currentStatus as PartnerStatus} />
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-gray-600">
                      {format(new Date(partner.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/partners/${partner.id}`}>
                        <Button variant="secondary" size="sm" className="text-sm font-medium">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  onClick={() => updateFilters('page', String(page - 1))}
                  disabled={page === 0}
                  variant="secondary"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => updateFilters('page', String(page + 1))}
                  disabled={page >= data.totalPages - 1}
                  variant="secondary"
                  size="sm"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{page * 10 + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min((page + 1) * 10, data.totalElements)}
                    </span>{' '}
                    of <span className="font-medium">{data.totalElements}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => updateFilters('page', String(page - 1))}
                      disabled={page === 0}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0">
                      Page {page + 1} of {data.totalPages}
                    </span>
                    <button
                      onClick={() => updateFilters('page', String(page + 1))}
                      disabled={page >= data.totalPages - 1}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
