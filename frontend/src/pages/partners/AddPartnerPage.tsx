import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { partnersApi } from '@/lib/partners';
import { useToast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, User, Car } from 'lucide-react';
import { PartnerRequest } from '@/types';

const partnerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'SCOOTER', 'CAR', 'VAN']),
  vehicleRegistrationNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

export default function AddPartnerPage() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    mode: 'onTouched',
    defaultValues: {
      vehicleType: 'MOTORCYCLE',
    }
  });

  const mutation = useMutation({
    mutationFn: (data: PartnerRequest) => partnersApi.create(data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      success('Partner added successfully');
      navigate(`/partners/${response.data.id}`);
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to create partner');
    }
  });

  const onSubmit = (data: PartnerFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/partners" className="hover:text-gray-900 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Partners
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900 font-medium">New</span>
      </div>

      <PageHeader title="Onboard New Partner" description="Enter partner details to begin verification process" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-[#E8590C]" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" required>Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" {...register('fullName')} error={errors.fullName?.message} />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" required>Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" {...register('email')} error={errors.email?.message} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" required>Phone Number</Label>
                  <Input id="phoneNumber" placeholder="+1234567890" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
                  {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" required>City</Label>
                  <Input id="city" placeholder="e.g. New York" {...register('city')} error={errors.city?.message} />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-[#E8590C]" /> Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType" required>Vehicle Type</Label>
                  <select
                    id="vehicleType"
                    className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8590C] focus:border-transparent"
                    {...register('vehicleType')}
                  >
                    <option value="BICYCLE">Bicycle</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                    <option value="SCOOTER">Scooter</option>
                    <option value="CAR">Car</option>
                    <option value="VAN">Van</option>
                  </select>
                  {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleRegistrationNumber">Registration Number</Label>
                  <Input id="vehicleRegistrationNumber" placeholder="e.g. ABC-1234" {...register('vehicleRegistrationNumber')} />
                  <p className="text-xs text-gray-500 mt-1">Not required for bicycles</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="licenseNumber">Driver License Number</Label>
                  <Input id="licenseNumber" placeholder="License ID" {...register('licenseNumber')} className="max-w-md" />
                  <p className="text-xs text-gray-500 mt-1">Required for motorized vehicles</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-end gap-3 py-4">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="bg-white">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#E8590C] hover:bg-[#d6510a]" 
                disabled={mutation.isPending || !isValid}
              >
                {mutation.isPending ? 'Creating...' : 'Create Partner'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
