import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Mobile Header (Only visible on mobile) */}
      <div className="lg:hidden absolute top-0 left-0 right-0 p-6 flex justify-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#E8590C] flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-gray-900">PartnerOps</span>
        </div>
      </div>

      {/* Left Branding Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-[#E8590C] to-[#C84A0A] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-[#E8590C] font-bold text-2xl">P</span>
            </div>
            <span className="text-4xl font-bold tracking-tight">PartnerOps</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Food Delivery Partner Portal</h1>
          <p className="text-lg text-white/90">
            Manage your fleet, approve new partners, and monitor operational performance from a single centralized dashboard.
          </p>
        </div>
      </div>

      {/* Right Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 mt-16 lg:mt-0 relative z-20">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
