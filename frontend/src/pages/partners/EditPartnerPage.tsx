import React, { useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft, User, Car } from 'lucide-react';
import { PartnerRequest } from '@/types';

const partnerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  vehicleType: z.enum(['BICYCLE', 'MOTORCYCLE', 'SCOOTER', 'CAR', 'VAN']),
  vehicleRegistrationNumber: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

export default function EditPartnerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['partner', id],
    queryFn: () => partnersApi.getById(id!),
    enabled: !!id,
  });

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (data) {
      reset({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        city: data.city,
        vehicleType: data.vehicleType as any,
        vehicleRegistrationNumber: data.vehicleRegistrationNumber || '',
        licenseNumber: data.licenseNumber || '',
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (updateData: PartnerRequest) => partnersApi.update(id!, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', id] });
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      success('Partner updated successfully');
      navigate(`/partners/${id}`);
    },
    onError: (err: any) => {
      showError(err.message || 'Failed to update partner');
    }
  });

  const onSubmit = (formData: PartnerFormValues) => {
    mutation.mutate(formData as PartnerRequest);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Partner not found</h2>
        <Button onClick={() => navigate('/partners')} className="mt-4">Back to List</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link to="/partners" className="hover:text-gray-900 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Partners
        </Link>
        <span className="mx-1">/</span>
        <Link to={`/partners/${id}`} className="hover:text-gray-900">
          {data.fullName}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      <PageHeader title="Edit Partner" description={`Updating details for ${data.fullName}`} />

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
                  <Input id="fullName" {...register('fullName')} error={errors.fullName?.message} />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" required>Email Address</Label>
                  <Input id="email" type="email" {...register('email')} error={errors.email?.message} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" required>Phone Number</Label>
                  <Input id="phoneNumber" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
                  {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" required>City</Label>
                  <Input id="city" {...register('city')} error={errors.city?.message} />
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
                  <Input id="vehicleRegistrationNumber" {...register('vehicleRegistrationNumber')} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="licenseNumber">Driver License Number</Label>
                  <Input id="licenseNumber" {...register('licenseNumber')} className="max-w-md" />
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
                {mutation.isPending ? 'Updating...' : 'Update Partner'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
