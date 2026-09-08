import React, { useState } from 'react';
import { X, Bike, Car, Shield, Check, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { partnerApi } from '../api/client';

const VEHICLE_OPTIONS = [
  { type: 'MOTORCYCLE', label: 'Motorcycle', icon: '🛵', desc: 'Standard 2-wheeler courier' },
  { type: 'SCOOTER', label: 'Scooter', icon: '🛵', desc: 'Automatic 2-wheeler delivery' },
  { type: 'BICYCLE', label: 'Bicycle', icon: '🚲', desc: 'Zero-emission green fleet' },
  { type: 'CAR', label: 'Car', icon: '🚗', desc: 'Small parcels & bulk food' },
  { type: 'VAN', label: 'Van', icon: '🚐', desc: 'Catering & large logistics' },
];

export const OnboardingModal = ({ isOpen, onClose, onSuccess, onError }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    city: 'Mumbai',
    vehicleType: 'MOTORCYCLE',
    vehicleRegistrationNumber: '',
    licenseNumber: '',
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Phone number must contain 10-15 digits';
    }
    if (!formData.city.trim()) newErrors.city = 'Operating city is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.vehicleType) newErrors.vehicleType = 'Please select a vehicle type';
    if (formData.vehicleType !== 'BICYCLE' && !formData.vehicleRegistrationNumber.trim()) {
      newErrors.vehicleRegistrationNumber = 'Vehicle plate number is required for motorized vehicles';
    }
    if (formData.vehicleType !== 'BICYCLE' && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Driving License number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim().replace(/\s+/g, ''),
        city: formData.city.trim(),
        vehicleType: formData.vehicleType,
        vehicleRegistrationNumber: formData.vehicleRegistrationNumber.trim() || 'N/A',
        licenseNumber: formData.licenseNumber.trim() || 'N/A',
      };

      const created = await partnerApi.create(payload);
      onSuccess(created);
      onClose();
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        city: 'Mumbai',
        vehicleType: 'MOTORCYCLE',
        vehicleRegistrationNumber: '',
        licenseNumber: '',
      });
      setStep(1);
    } catch (err) {
      onError(err.message || 'Failed to onboard partner. Duplicate email or phone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden bg-slate-900/95 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-zomato-red to-swiggy-orange flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Courier Onboarding Studio</h2>
              <p className="text-xs text-slate-400">Step {step} of 3 • New Partner Registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 w-full -z-0" />
            
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center z-10 bg-slate-900 px-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? 'bg-gradient-to-r from-zomato-red to-swiggy-orange text-white shadow-md shadow-orange-500/30 ring-4 ring-orange-500/10'
                      : step > s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">
                  {s === 1 ? 'Profile' : s === 2 ? 'Vehicle' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-3.5 animate-slide-up">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Courier Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                    errors.fullName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-swiggy-orange focus:ring-swiggy-orange'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="courier@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-swiggy-orange focus:ring-swiggy-orange'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone Number (10-15 digits) *
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.phoneNumber ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-swiggy-orange focus:ring-swiggy-orange'
                    }`}
                  />
                  {errors.phoneNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operating Hub / City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-swiggy-orange"
                >
                  <option value="Mumbai">Mumbai (Central & Suburban)</option>
                  <option value="Bangalore">Bangalore (Koramangala, Indiranagar, HSR)</option>
                  <option value="Delhi-NCR">Delhi-NCR (South Delhi, Gurgaon, Noida)</option>
                  <option value="Hyderabad">Hyderabad (Hitec City, Gachibowli)</option>
                  <option value="Pune">Pune (Kothrud, Baner, Viman Nagar)</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle & License */}
          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Vehicle Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VEHICLE_OPTIONS.map((opt) => (
                    <div
                      key={opt.type}
                      onClick={() => setFormData({ ...formData, vehicleType: opt.type })}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        formData.vehicleType === opt.type
                          ? 'bg-swiggy-orange/15 border-swiggy-orange text-white shadow-sm'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-none">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 mt-1 truncate">{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vehicle Number Plate {formData.vehicleType !== 'BICYCLE' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="MH-02-AB-1234"
                    value={formData.vehicleRegistrationNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleRegistrationNumber: e.target.value.toUpperCase() })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:ring-1 ${
                      errors.vehicleRegistrationNumber ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-swiggy-orange focus:ring-swiggy-orange'
                    }`}
                  />
                  {errors.vehicleRegistrationNumber && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.vehicleRegistrationNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Driving License Number {formData.vehicleType !== 'BICYCLE' ? '*' : '(Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="DL-0420110012345"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-xs text-white placeholder-slate-500 uppercase font-mono focus:outline-none focus:ring-1 ${
                      errors.licenseNumber ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-700 focus:border-swiggy-orange focus:ring-swiggy-orange'
                    }`}
                  />
                  {errors.licenseNumber && (
                    <p className="text-[11px] text-rose-400 mt-1">{errors.licenseNumber}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Verification & Review */}
          {step === 3 && (
            <div className="space-y-4 animate-slide-up">
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2.5 text-xs">
                <h4 className="font-bold text-white text-sm border-b border-slate-700 pb-2">
                  Registration Summary Preview
                </h4>
                <div className="flex justify-between">
                  <span className="text-slate-400">Full Name:</span>
                  <span className="font-semibold text-white">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-semibold text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-white font-mono">{formData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Operating City:</span>
                  <span className="font-semibold text-white">{formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle Type:</span>
                  <span className="font-semibold text-swiggy-orange">{formData.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Plate:</span>
                  <span className="font-mono text-amber-300 font-semibold">{formData.vehicleRegistrationNumber || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <p>
                  Upon submission, courier profile will be placed into <span className="font-bold text-white">PENDING</span> status. An Operations Manager or Admin must transition the partner to <span className="font-bold text-white">VERIFICATION</span> before activation.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 pt-3 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-zomato-red to-swiggy-orange text-white shadow-md shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Confirm Onboarding <Check className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
