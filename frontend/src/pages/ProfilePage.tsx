import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <PageHeader title="My Profile" />

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#E8590C] to-amber-500 h-32"></div>
        <CardContent className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center bg-gray-100 text-gray-700 text-4xl font-bold shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left pb-2">
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                {user.roles?.map(role => (
                  <span key={role} className="bg-orange-100 text-[#E8590C] px-3 py-1 rounded-full text-xs font-semibold border border-orange-200">
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-4">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Username</p>
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Permissions</p>
                  <p className="text-sm font-medium text-gray-900">{user.roles?.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
