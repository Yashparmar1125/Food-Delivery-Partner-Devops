import api from './api';
import { Partner, PartnerRequest, PaginatedResponse, PartnerStatus, StatusHistory } from '@/types';

export const partnersApi = {
  getAll: (page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Promise<PaginatedResponse<Partner>> => {
    return api.get('/api/v1/partners', { params: { page, size, sort } });
  },
  
  getById: (id: string): Promise<Partner> => {
    return api.get(`/api/v1/partners/${id}`);
  },
  
  create: (data: PartnerRequest): Promise<Partner> => {
    return api.post('/api/v1/partners', data);
  },
  
  update: (id: string, data: Partial<PartnerRequest>): Promise<Partner> => {
    return api.put(`/api/v1/partners/${id}`, data);
  },
  
  remove: (id: string): Promise<void> => {
    return api.delete(`/api/v1/partners/${id}`);
  },
  
  search: (params: { name?: string; phone?: string; status?: string; vehicleType?: string; page?: number; size?: number; sort?: string }): Promise<PaginatedResponse<Partner>> => {
    return api.get('/api/v1/partners/search', { params });
  },
  
  updateStatus: (id: string, targetStatus: PartnerStatus, reason: string): Promise<Partner> => {
    return api.patch(`/api/v1/partners/${id}/status`, { targetStatus, reason });
  },
  
  getStatusHistory: (id: string): Promise<StatusHistory[]> => {
    return api.get(`/api/v1/partners/${id}/history`);
  },
};
