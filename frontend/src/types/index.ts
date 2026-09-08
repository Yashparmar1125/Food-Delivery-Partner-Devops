export type PartnerStatus = 'PENDING' | 'VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED' | 'DEACTIVATED';

export type VehicleType = 'BICYCLE' | 'MOTORCYCLE' | 'SCOOTER' | 'CAR' | 'VAN';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_OPS_MANAGER' | 'ROLE_VIEWER' | 'ROLE_SUPPORT' | 'ROLE_PARTNER';

export interface PartnerMe {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  vehicleType: VehicleType;
  vehicleRegistrationNumber?: string;
  licenseNumber?: string;
  aadhaarNumber?: string;
  upiId?: string;
  currentStatus: PartnerStatus;
  isOnline: boolean;
  totalEarnings: number;
  completedDeliveries: number;
  createdAt: string | null;
  rejectionReason?: string | null;
}

export interface DeliveryOrder {
  orderId: string;
  restaurantName: string;
  restaurantAddress: string;
  customerName: string;
  customerAddress: string;
  estimatedPayout: number;
  distanceKm: number;
  status: string;
  itemCount: number;
}

export interface PartnerRegistrationData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  vehicleType: VehicleType;
  vehicleRegistrationNumber?: string;
  licenseNumber?: string;
  aadhaarNumber?: string;
  upiId?: string;
}

export interface Partner {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleType: VehicleType;
  vehicleRegistrationNumber?: string;
  licenseNumber?: string;
  city: string;
  currentStatus: PartnerStatus;
  active: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PartnerRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleType: VehicleType;
  vehicleRegistrationNumber?: string;
  licenseNumber?: string;
  city: string;
}

export interface DashboardSummary {
  totalPartners: number;
  activePartners: number;
  pendingPartners: number;
  verificationPartners: number;
  suspendedPartners: number;
  rejectedPartners: number;
  deactivatedPartners: number;
  activeFleetPercentage: number;
}

export interface StatusHistory {
  id: string;
  previousStatus: string | null;
  newStatus: string;
  reason: string;
  changedBy: string;
  changedAt: string | null;
}

export interface AuthUser {
  token: string;
  username: string;
  email: string;
  roles: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const VALID_TRANSITIONS: Record<PartnerStatus, PartnerStatus[]> = {
  PENDING: ['VERIFICATION', 'REJECTED'],
  VERIFICATION: ['ACTIVE', 'REJECTED'],
  ACTIVE: ['SUSPENDED', 'DEACTIVATED'],
  SUSPENDED: ['ACTIVE', 'DEACTIVATED'],
  REJECTED: [],
  DEACTIVATED: [],
};

export const STATUS_LABELS: Record<PartnerStatus, { label: string; colorClass: string }> = {
  PENDING: { label: 'Pending', colorClass: 'bg-amber-100 text-amber-800 border border-amber-200' },
  VERIFICATION: { label: 'Verification', colorClass: 'bg-blue-100 text-blue-800 border border-blue-200' },
  ACTIVE: { label: 'Active', colorClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  SUSPENDED: { label: 'Suspended', colorClass: 'bg-orange-100 text-orange-800 border border-orange-200' },
  REJECTED: { label: 'Rejected', colorClass: 'bg-red-100 text-red-800 border border-red-200' },
  DEACTIVATED: { label: 'Deactivated', colorClass: 'bg-gray-100 text-gray-800 border border-gray-200' },
};
