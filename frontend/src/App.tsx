import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Delivery Partner App Pages
const PartnerLoginPage = React.lazy(() => import('@/pages/partner/PartnerLoginPage'));
const PartnerOnboardingPage = React.lazy(() => import('@/pages/partner/PartnerOnboardingPage'));
const PartnerDashboardPage = React.lazy(() => import('@/pages/partner/PartnerDashboardPage'));
const PartnerOrdersPage = React.lazy(() => import('@/pages/partner/PartnerOrdersPage'));
const PartnerEarningsPage = React.lazy(() => import('@/pages/partner/PartnerEarningsPage'));
const PartnerProfilePage = React.lazy(() => import('@/pages/partner/PartnerProfilePage'));

// Back-Office Operations Pages
const BackofficeLoginPage = React.lazy(() => import('@/pages/backoffice/BackofficeLoginPage'));
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

// Layouts & Guards
import { PartnerLayout } from '@/layouts/PartnerLayout';
import { BackofficeLayout } from '@/layouts/BackofficeLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-slate-500 font-medium">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-xs">Loading Partner Platform...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ============================================================ */}
        {/* 1. PUBLIC ROUTES                                             */}
        {/* ============================================================ */}
        {/* Delivery Partner Public Routes */}
        <Route path="/login" element={<PartnerLoginPage />} />
        <Route path="/onboard" element={<PartnerOnboardingPage />} />

        {/* Back-Office Public Login Route */}
        <Route path="/backoffice/login" element={<BackofficeLoginPage />} />

        <Route path="/403" element={<ForbiddenPage />} />

        {/* ============================================================ */}
        {/* 2. DELIVERY PARTNER APP ROUTES (At root '/')                */}
        {/* ============================================================ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRoles={['ROLE_PARTNER']} />}>
            <Route element={<PartnerLayout />}>
              <Route path="/" element={<PartnerDashboardPage />} />
              <Route path="/orders" element={<PartnerOrdersPage />} />
              <Route path="/earnings" element={<PartnerEarningsPage />} />
              <Route path="/profile" element={<PartnerProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* ============================================================ */}
        {/* 3. BACK-OFFICE OPERATIONS ROUTES (Under '/backoffice')       */}
        {/* ============================================================ */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_OPS_MANAGER', 'ROLE_SUPPORT']} />}>
            <Route path="/backoffice" element={<BackofficeLayout />}>
              <Route index element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="partners" element={<PartnersListPage />} />
              <Route path="partners/:id" element={<PartnerDetailPage />} />

              {/* Ops & Admin Only Verification Review & Modifications */}
              <Route element={<RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_OPS_MANAGER']} />}>
                <Route path="partners/new" element={<AddPartnerPage />} />
                <Route path="partners/:id/edit" element={<EditPartnerPage />} />
                <Route path="verification/:id" element={<VerificationReviewPage />} />
              </Route>

              <Route path="verification" element={<VerificationQueuePage />} />
              <Route path="audit" element={<AuditLogPage />} />

              <Route element={<RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_OPS_MANAGER']} />}>
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* ============================================================ */}
        {/* 4. BACKWARDS COMPATIBILITY REDIRECTS FOR OPERATORS           */}
        {/* ============================================================ */}
        <Route path="/dashboard" element={<Navigate to="/backoffice/dashboard" replace />} />
        <Route path="/partners" element={<Navigate to="/backoffice/partners" replace />} />
        <Route path="/verification" element={<Navigate to="/backoffice/verification" replace />} />
        <Route path="/audit" element={<Navigate to="/backoffice/audit" replace />} />
        <Route path="/settings" element={<Navigate to="/backoffice/settings" replace />} />

        {/* Catch-all Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
