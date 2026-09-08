import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-orange-50 p-6 rounded-full mb-6">
        <ShieldAlert className="w-16 h-16 text-[#E8590C]" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        You don't have permission to view this page. If you believe this is a mistake, please contact your system administrator.
      </p>
      <Link to="/dashboard">
        <Button className="bg-[#E8590C] hover:bg-[#d6510a]">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
