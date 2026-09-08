import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileHeader } from '@/components/navigation/MobileHeader';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MobileDrawer } from '@/components/navigation/MobileDrawer';

export const AppLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[248px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header - Hidden on Desktop */}
        <div className="lg:hidden flex-shrink-0">
          <MobileHeader onMenuClick={() => setIsDrawerOpen(true)} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="w-full max-w-7xl mx-auto p-4 md:p-6 pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile/Tablet Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Mobile Bottom Navigation - Hidden on Desktop and Tablet */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};
