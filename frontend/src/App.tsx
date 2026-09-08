import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const PartnersListPage = React.lazy(() => import('@/pages/partners/PartnersListPage'));
const AddPartnerPage = React.lazy(() => import('@/pages/partners/AddPartnerPage'));
const PartnerDetailPage = React.lazy(() => import('@/pages/partners/PartnerDetailPage'));
const EditPartnerPage = React.lazy(() => import('@/pages/partners/EditPartnerPage'));
const VerificationQueuePage = React.lazy(() => import('@/pages/verification/VerificationQueuePage'));
const VerificationReviewPage = React.lazy(() => import('@/pages/verification/VerificationReviewPage'));
const AuditLogPage = React.lazy(() => import('@/pages/AuditLogPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const ForbiddenPage = React.lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50 text-gray-500 font-medium">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-[#E8590C]/20 border-t-[#E8590C] rounded-full animate-spin"></div>
      <p className="text-sm">Loading PartnerOps...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Partners */}
            <Route path="/partners" element={<PartnersListPage />} />
            <Route path="/partners/:id" element={<PartnerDetailPage />} />
            
            {/* Ops & Admin Only Partner Routes */}
            <Route element={<RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_OPS_MANAGER']} />}>
              <Route path="/partners/new" element={<AddPartnerPage />} />
              <Route path="/partners/:id/edit" element={<EditPartnerPage />} />
              <Route path="/verification/:id" element={<VerificationReviewPage />} />
            </Route>

            {/* Verification Queue & Logs */}
            <Route path="/verification" element={<VerificationQueuePage />} />
            <Route path="/audit" element={<AuditLogPage />} />

            {/* Profile & Settings */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_OPS_MANAGER']} />}>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
