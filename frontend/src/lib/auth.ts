import api from './api';
import { AuthUser } from '@/types';

export const authApi = {
  login: async (username: string, password: string): Promise<AuthUser> => {
    return api.post('/api/v1/auth/login', { username, password });
  },
};
