import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { Server, Globe, Shield, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <PageHeader title="Settings" description="System configuration and application preferences" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-[#E8590C]" /> System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">Backend API URL</span>
              <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">API Version</span>
              <span className="text-sm font-medium text-gray-900">v1</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">Current Role</span>
              <span className="text-xs font-medium bg-[#E8590C]/10 text-[#E8590C] px-2 py-1 rounded-full">
                {user?.roles?.[0] || 'Unknown'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#E8590C]" /> App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Theme</p>
                <p className="text-xs text-gray-500">Application color scheme</p>
              </div>
              <span className="text-sm bg-white border border-gray-200 px-3 py-1 rounded shadow-sm">Light Only</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Receive alerts on status changes</p>
              </div>
              <div className="w-10 h-5 bg-[#E8590C] rounded-full relative shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E8590C]" /> About Application
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#E8590C] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg text-white">
              <Smartphone className="w-12 h-12" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-900">Partner Portal PWA</h2>
              <p className="text-gray-500 mt-1">Fleet Operations Management System</p>
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <div className="bg-gray-100 px-3 py-1.5 rounded-md">
                  <span className="text-gray-500 mr-2">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="bg-gray-100 px-3 py-1.5 rounded-md">
                  <span className="text-gray-500 mr-2">Environment</span>
                  <span className="font-medium">Production</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">&copy; {new Date().getFullYear()} Delivery Partner App. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
