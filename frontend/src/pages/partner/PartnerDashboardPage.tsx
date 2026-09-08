import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { partnerAppApi } from '@/lib/partnerApp';
import { PartnerMe } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Power,
  Package,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileText,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Bike
} from 'lucide-react';

interface OutletContextType {
  partner: PartnerMe | null;
  refreshProfile: () => Promise<void>;
}

export default function PartnerDashboardPage() {
  const navigate = useNavigate();
  const { partner: contextPartner, refreshProfile } = useOutletContext<OutletContextType>();
  const [partner, setPartner] = useState<PartnerMe | null>(contextPartner);
  const [isLoading, setIsLoading] = useState(!contextPartner);
  const [isUpdatingDuty, setIsUpdatingDuty] = useState(false);

  // Re-submit state for rejected accounts
  const [isReapplying, setIsReapplying] = useState(false);
  const [reapplyForm, setReapplyForm] = useState({
    licenseNumber: '',
    vehicleRegistrationNumber: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (contextPartner) {
      setPartner(contextPartner);
      setReapplyForm({
        licenseNumber: contextPartner.licenseNumber || '',
        vehicleRegistrationNumber: contextPartner.vehicleRegistrationNumber || '',
        phoneNumber: contextPartner.phoneNumber || '',
      });
    } else {
      loadProfile();
    }
  }, [contextPartner]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await partnerAppApi.getProfile();
      setPartner(data);
      setReapplyForm({
        licenseNumber: data.licenseNumber || '',
        vehicleRegistrationNumber: data.vehicleRegistrationNumber || '',
        phoneNumber: data.phoneNumber || '',
      });
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDuty = async () => {
    if (!partner || isUpdatingDuty) return;
    try {
      setIsUpdatingDuty(true);
      const updated = await partnerAppApi.updateDuty(!partner.isOnline);
      setPartner(updated);
      await refreshProfile();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not update duty status');
    } finally {
      setIsUpdatingDuty(false);
    }
  };

  const handleReapplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;
    try {
      setIsLoading(true);
      const updated = await partnerAppApi.reapply({
        fullName: partner.fullName,
        email: partner.email,
        phoneNumber: reapplyForm.phoneNumber,
        city: partner.city,
        vehicleType: partner.vehicleType,
        vehicleRegistrationNumber: reapplyForm.vehicleRegistrationNumber,
        licenseNumber: reapplyForm.licenseNumber,
      });
      setPartner(updated);
      setIsReapplying(false);
      await refreshProfile();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to re-submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 mt-3 font-medium">Loading Rider Profile...</p>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">No Delivery Partner Record</h2>
        <p className="text-xs text-slate-500 mt-1">Please complete onboarding to activate your rider account.</p>
        <Button onClick={() => navigate('/onboard')} className="mt-4 bg-emerald-600 text-white">
          Start Onboarding
        </Button>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: KYC PENDING REVIEW TRACKER
  // ==========================================
  if (partner.currentStatus === 'PENDING' || partner.currentStatus === 'VERIFICATION') {
    return (
      <div className="space-y-6">
        {/* Status Alert Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-amber-900">Application Under Verification</h2>
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
                  Status: PENDING
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Thank you for applying, <strong>{partner.fullName}</strong>! Our Back-Office Operations team is currently verifying your driving license and vehicle registration. Reviews are completed within <strong>2 to 4 hours</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Progress Checklist */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Onboarding Progress Checklist</span>
              <button
                onClick={loadProfile}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Check Status
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 block">Rider Account & Credentials Created</span>
                <span className="text-[11px] text-slate-500">Username: {partner.username} • City: {partner.city}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">DONE</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-slate-800 block">Transit Documents Review (License & RC)</span>
                <span className="text-[11px] text-slate-500">
                  RC: {partner.vehicleRegistrationNumber || 'N/A'} • License: {partner.licenseNumber || 'N/A'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">IN PROGRESS</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-bold shrink-0">
                3
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-slate-500 block">Fleet Dispatch Certification</span>
                <span className="text-[11px] text-slate-400">Duty toggle unlocks once approved by Back-Office</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">WAITING</span>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Profile Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Submitted Vehicle & Identity Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">Vehicle Type</span>
              <span className="font-bold text-slate-800">{partner.vehicleType}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Registration Plate</span>
              <span className="font-bold text-slate-800">{partner.vehicleRegistrationNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">License Number</span>
              <span className="font-bold text-slate-800">{partner.licenseNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Registered Phone</span>
              <span className="font-bold text-slate-800">{partner.phoneNumber}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: REJECTED APPLICATION RESOLUTION
  // ==========================================
  if (partner.currentStatus === 'REJECTED') {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-sm shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-red-900">Application Needs Attention</h2>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                The operations reviewer marked your application as rejected. Reason provided:
              </p>
              <div className="mt-2 p-3 bg-white/80 border border-red-200 rounded-lg text-xs font-semibold text-red-900">
                "{partner.rejectionReason || 'Document mismatch or illegible vehicle registration plate.'}"
              </div>
              <div className="mt-3">
                <Button
                  onClick={() => setIsReapplying(!isReapplying)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  {isReapplying ? 'Cancel Re-application' : 'Update & Re-Submit Documents'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {isReapplying && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Re-Submit Corrected Documents</CardTitle>
              <CardDescription>Correct any inaccurate numbers and re-submit for review</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReapplySubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="licenseNumber">Driving License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={reapplyForm.licenseNumber}
                    onChange={(e) => setReapplyForm({ ...reapplyForm, licenseNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="vehicleRegistrationNumber">Vehicle Registration Number</Label>
                  <Input
                    id="vehicleRegistrationNumber"
                    value={reapplyForm.vehicleRegistrationNumber}
                    onChange={(e) => setReapplyForm({ ...reapplyForm, vehicleRegistrationNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phoneNumber">Contact Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={reapplyForm.phoneNumber}
                    onChange={(e) => setReapplyForm({ ...reapplyForm, phoneNumber: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  {isLoading ? 'Submitting...' : 'Re-Submit for Back-Office Verification'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: ACTIVE RIDER COCKPIT
  // ==========================================
  return (
    <div className="space-y-5">
      {/* Interactive Online/Offline Duty Card */}
      <div
        className={`rounded-2xl p-5 shadow-sm border transition-all ${
          partner.isOnline
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white border-emerald-500'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${partner.isOnline ? 'bg-emerald-300 animate-ping' : 'bg-slate-400'}`}></span>
              <span className="text-xs uppercase font-extrabold tracking-wider">
                {partner.isOnline ? 'YOU ARE ONLINE • READY FOR DISPATCH' : 'YOU ARE OFFLINE'}
              </span>
            </div>
            <h2 className="text-xl font-black mt-1">{partner.fullName}</h2>
            <p className={`text-xs mt-0.5 ${partner.isOnline ? 'text-emerald-100' : 'text-slate-500'}`}>
              Zone: {partner.city} • {partner.vehicleType}
            </p>
          </div>

          <button
            onClick={handleToggleDuty}
            disabled={isUpdatingDuty}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all ${
              partner.isOnline
                ? 'bg-white text-emerald-800 hover:bg-emerald-50'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{partner.isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Today's Earnings</span>
          </div>
          <div className="text-xl font-black text-slate-900">₹{partner.totalEarnings.toFixed(2)}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+ Direct deposit to UPI</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Deliveries</span>
          </div>
          <div className="text-xl font-black text-slate-900">{partner.completedDeliveries}</div>
          <span className="text-[10px] text-slate-400">Completed today</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Acceptance</span>
          </div>
          <div className="text-xl font-black text-slate-900">98%</div>
          <span className="text-[10px] text-purple-600 font-semibold">Tier 1 Rating</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Online Hours</span>
          </div>
          <div className="text-xl font-black text-slate-900">{partner.isOnline ? '3.5h' : '0.0h'}</div>
          <span className="text-[10px] text-slate-400">Shift duration</span>
        </div>
      </div>

      {/* Quick Dispatch Feed Banner */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200/80 py-3 px-5">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Available Delivery Dispatches</span>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/orders')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
            >
              View Orders Feed <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {partner.isOnline ? (
            <div className="flex items-center justify-between bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Active Orders Available in Your Radius</h4>
                  <p className="text-[11px] text-emerald-800">Orders ready for pickup at nearby partner restaurants.</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/orders')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
              >
                Accept Order
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 text-xs">
              <Power className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-700">You are currently offline</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Toggle duty switch to Online to start receiving delivery requests.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
