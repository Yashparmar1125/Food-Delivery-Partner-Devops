import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '@/types';
import { authApi } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canUpdateStatus: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('pp_token');
      const storedUser = localStorage.getItem('pp_user');
      
      if (token) {
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse stored user', e);
            parseTokenFallback(token);
          }
        } else {
          parseTokenFallback(token);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const parseTokenFallback = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        token,
        username: payload.sub || 'user',
        email: payload.email || '',
        roles: payload.roles || ['ROLE_VIEWER'],
      });
    } catch (e) {
      console.error('Failed to parse token payload', e);
      localStorage.removeItem('pp_token');
    }
  };

  const login = async (username: string, password: string) => {
    const authUser = await authApi.login(username, password);
    localStorage.setItem('pp_token', authUser.token);
    localStorage.setItem('pp_user', JSON.stringify(authUser));
    setUser(authUser);
    navigate('/dashboard');
  };

  const logout = useCallback(() => {
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const hasRole = (role: string) => {
    return user?.roles.includes(role) ?? false;
  };

  const canCreate = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');
  const canEdit = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');
  const canDelete = hasRole('ROLE_ADMIN');
  const canUpdateStatus = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    canCreate,
    canEdit,
    canDelete,
    canUpdateStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
