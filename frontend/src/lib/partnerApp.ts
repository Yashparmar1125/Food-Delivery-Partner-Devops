import api from './api';
import { PartnerMe, DeliveryOrder, PartnerRegistrationData, AuthUser } from '@/types';

export const partnerAppApi = {
  register: (data: PartnerRegistrationData): Promise<AuthUser> => {
    return api.post('/api/v1/auth/partner/register', data);
  },

  getProfile: async (): Promise<PartnerMe> => {
    return api.get('/api/v1/partner/me');
  },

  updateDuty: async (online: boolean): Promise<PartnerMe> => {
    return api.patch('/api/v1/partner/me/duty', { online });
  },

  reapply: async (data: Partial<PartnerRegistrationData>): Promise<PartnerMe> => {
    return api.put('/api/v1/partner/me/reapply', data);
  },

  getAvailableOrders: async (): Promise<DeliveryOrder[]> => {
    return api.get('/api/v1/partner/orders/available');
  },

  completeOrder: async (orderId: string, payout: number = 75): Promise<PartnerMe> => {
    return api.post(`/api/v1/partner/orders/${orderId}/complete`, null, {
      params: { payout },
    });
  },
};
