import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PartnerMe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { User, Phone, Mail, MapPin, Bike, ShieldCheck, LogOut, CreditCard } from 'lucide-react';

interface OutletContextType {
  partner: PartnerMe | null;
}

export default function PartnerProfilePage() {
  const { partner } = useOutletContext<OutletContextType>();
  const { logout } = useAuth();

  if (!partner) return null;

  return (
    <div className="space-y-5 font-sans max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Rider Profile</h1>
        <p className="text-xs text-slate-500">Your account identity, transit vehicle, and payout credentials</p>
      </div>

      {/* Profile Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
            {partner.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{partner.fullName}</h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {partner.currentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Username: <strong>{partner.username}</strong></p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {partner.city}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {partner.phoneNumber}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle & Compliance Credentials */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="py-3 px-5 bg-slate-50 border-b border-slate-200/80">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bike className="w-4 h-4 text-emerald-600" />
            <span>Vehicle & License Credentials</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Vehicle Type</span>
            <span className="text-slate-900 font-bold text-sm">{partner.vehicleType}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Vehicle Registration Plate (RC)</span>
            <span className="text-slate-900 font-bold text-sm">{partner.vehicleRegistrationNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Driving License Number</span>
            <span className="text-slate-900 font-bold text-sm">{partner.licenseNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">National Aadhaar ID</span>
            <span className="text-slate-900 font-bold text-sm">{partner.aadhaarNumber || 'Verified'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payout Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="py-3 px-5 bg-slate-50 border-b border-slate-200/80">
          <CardTitle className="text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Banking & Payout Credentials</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block">Payout UPI ID</span>
            <span className="text-slate-900 font-bold text-sm">{partner.upiId || 'rajesh@okhdfcbank'}</span>
          </div>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200 text-xs">
            Direct Deposit Active
          </span>
        </CardContent>
      </Card>

      {/* Sign Out Button */}
      <div className="pt-2">
        <Button
          variant="secondary"
          onClick={() => logout('/login')}
          className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-bold text-xs h-10"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out of Partner Account
        </Button>
      </div>
    </div>
  );
}
