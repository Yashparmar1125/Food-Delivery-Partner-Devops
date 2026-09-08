import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { partnerAppApi } from '@/lib/partnerApp';
import { VehicleType, PartnerRegistrationData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Bike, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Car, AlertCircle, Sparkles } from 'lucide-react';

export default function PartnerOnboardingPage() {
  const { setAuthSession } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PartnerRegistrationData>({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    city: 'Mumbai',
    vehicleType: 'MOTORCYCLE',
    vehicleRegistrationNumber: '',
    licenseNumber: '',
    aadhaarNumber: '',
    upiId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleSelect = (type: VehicleType) => {
    setFormData({ ...formData, vehicleType: type });
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.fullName || !formData.phoneNumber || !formData.email || !formData.password || !formData.username) {
        setError('Please fill in all personal account fields.');
        return;
      }
      if (formData.phoneNumber.length < 10) {
        setError('Phone number must contain at least 10 digits.');
        return;
      }
    } else if (step === 2) {
      if (formData.vehicleType !== 'BICYCLE' && !formData.vehicleRegistrationNumber) {
        setError('Please enter your vehicle registration number.');
        return;
      }
    } else if (step === 3) {
      if (formData.vehicleType !== 'BICYCLE' && !formData.licenseNumber) {
        setError('Please enter your valid driving license number.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const authUser = await partnerAppApi.register(formData);
      setAuthSession(authUser, '/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit onboarding application');
    } finally {
      setIsLoading(false);
    }
  };

  const vehicleOptions: { type: VehicleType; label: string; desc: string; icon: string }[] = [
    { type: 'MOTORCYCLE', label: 'Motorcycle', desc: 'Standard bike for quick deliveries', icon: '🏍️' },
    { type: 'SCOOTER', label: 'Scooter / EV', desc: 'Scooter or electric two-wheeler', icon: '🛵' },
    { type: 'BICYCLE', label: 'Bicycle', desc: 'Eco-friendly short radius deliveries', icon: '🚲' },
    { type: 'CAR', label: 'Car / Sedan', desc: 'Higher volume catering deliveries', icon: '🚗' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 px-3 sm:py-10 sm:px-6 lg:px-8 font-sans">
      <div className="w-full sm:mx-auto sm:max-w-xl">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-4 sm:mb-6 text-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-2.5 shadow-md">
            <Bike className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Become a Delivery Partner</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Start earning with flexible hours and weekly payouts</p>
        </div>

        {/* Step Progress Indicators */}
        <div className="mb-6 flex items-center justify-between relative px-4">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0"></div>
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          {[
            { s: 1, label: 'Profile' },
            { s: 2, label: 'Vehicle' },
            { s: 3, label: 'KYC & Bank' },
            { s: 4, label: 'Submit' },
          ].map((item) => (
            <div key={item.s} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  step >= item.s
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {step > item.s ? <CheckCircle2 className="w-4 h-4" /> : item.s}
              </div>
              <span className={`text-[11px] font-medium mt-1 ${step >= item.s ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Onboarding Wizard Card */}
        <Card className="border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Personal & Account Details'}
              {step === 2 && 'Vehicle Information'}
              {step === 3 && 'Identity Verification & Payouts'}
              {step === 4 && 'Review & Submit Application'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Set up your rider account credentials and service city'}
              {step === 2 && 'Select the vehicle you will use for deliveries'}
              {step === 3 && 'Enter driving credentials and UPI ID for weekly direct deposits'}
              {step === 4 && 'Verify your details before sending to Back-Office verification'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Personal & Account */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">Delivery City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="e.g. Mumbai, Pune, Bangalore"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber">Phone Number (10 Digits)</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="e.g. 9876543210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Choose Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="e.g. rahul_rider"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Vehicle Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <Label>Select Vehicle Type</Label>
                <div className="grid grid-cols-2 gap-3">
                  {vehicleOptions.map((opt) => (
                    <div
                      key={opt.type}
                      onClick={() => handleVehicleSelect(opt.type)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.vehicleType === opt.type
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-bold text-slate-800 text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-500 leading-snug">{opt.desc}</div>
                    </div>
                  ))}
                </div>

                {formData.vehicleType !== 'BICYCLE' && (
                  <div className="space-y-1.5 pt-2">
                    <Label htmlFor="vehicleRegistrationNumber">Vehicle Registration Number (RC)</Label>
                    <Input
                      id="vehicleRegistrationNumber"
                      name="vehicleRegistrationNumber"
                      placeholder="e.g. MH02AB1234"
                      value={formData.vehicleRegistrationNumber}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-slate-500">As printed on your vehicle registration certificate</p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Identity & Bank */}
            {step === 3 && (
              <div className="space-y-4">
                {formData.vehicleType !== 'BICYCLE' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="licenseNumber">Driving License Number</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      placeholder="e.g. DL-1420110012345"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="aadhaarNumber">Aadhaar / National ID Number</Label>
                  <Input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    placeholder="e.g. 1234-5678-9012"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-slate-500">Used for automated background KYC compliance</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="upiId">UPI ID for Payouts</Label>
                  <Input
                    id="upiId"
                    name="upiId"
                    placeholder="e.g. rahul@okhdfcbank or 9876543210@upi"
                    value={formData.upiId}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-slate-500">Delivery fees and tip earnings will be credited here</p>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Full Name</span>
                    <span className="font-semibold text-slate-800">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Phone Number</span>
                    <span className="font-semibold text-slate-800">{formData.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">City</span>
                    <span className="font-semibold text-slate-800">{formData.city}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Vehicle Type</span>
                    <span className="font-semibold text-slate-800">{formData.vehicleType}</span>
                  </div>
                  {formData.vehicleRegistrationNumber && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Vehicle RC</span>
                      <span className="font-semibold text-slate-800">{formData.vehicleRegistrationNumber}</span>
                    </div>
                  )}
                  {formData.licenseNumber && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Driving License</span>
                      <span className="font-semibold text-slate-800">{formData.licenseNumber}</span>
                    </div>
                  )}
                  {formData.upiId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payout UPI</span>
                      <span className="font-semibold text-slate-800">{formData.upiId}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>By submitting, you certify that submitted driving documents are authentic.</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-6 gap-3">
              {step > 1 ? (
                <Button type="button" variant="secondary" onClick={handleBack} disabled={isLoading} className="h-11 px-4 text-xs font-bold active:scale-95">
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
              ) : (
                <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 font-medium py-2">
                  Already a rider? <strong className="text-emerald-700">Sign In</strong>
                </Link>
              )}

              {step < 4 ? (
                <Button type="button" onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-5 text-xs font-bold active:scale-95">
                  Next Step <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6 font-bold text-xs active:scale-95 shadow-md"
                >
                  {isLoading ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
