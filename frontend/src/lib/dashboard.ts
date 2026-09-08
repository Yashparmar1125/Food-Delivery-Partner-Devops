import api from './api';
import { DashboardSummary } from '@/types';

export const dashboardApi = {
  getSummary: (): Promise<DashboardSummary> => {
    return api.get('/api/v1/dashboard/summary');
  },
};
