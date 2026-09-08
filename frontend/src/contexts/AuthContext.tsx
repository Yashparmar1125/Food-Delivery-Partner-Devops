import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser } from '@/types';
import { authApi } from '@/lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPartner: boolean;
  isStaff: boolean;
  login: (username: string, password: string, customRedirect?: string) => Promise<void>;
  setAuthSession: (authUser: AuthUser, redirectPath?: string) => void;
  logout: (redirectTo?: string) => void;
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

  const setAuthSession = useCallback((authUser: AuthUser, redirectPath?: string) => {
    localStorage.setItem('pp_token', authUser.token);
    localStorage.setItem('pp_user', JSON.stringify(authUser));
    setUser(authUser);

    if (redirectPath) {
      navigate(redirectPath);
    } else if (authUser.roles.includes('ROLE_PARTNER')) {
      navigate('/');
    } else {
      navigate('/backoffice/dashboard');
    }
  }, [navigate]);

  const login = async (username: string, password: string, customRedirect?: string) => {
    const authUser = await authApi.login(username, password);
    setAuthSession(authUser, customRedirect);
  };

  const logout = useCallback((redirectTo?: string) => {
    const isCurrentlyPartner = user?.roles.includes('ROLE_PARTNER');
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
    setUser(null);

    if (redirectTo) {
      navigate(redirectTo);
    } else if (isCurrentlyPartner) {
      navigate('/login');
    } else {
      navigate('/backoffice/login');
    }
  }, [navigate, user]);

  const hasRole = (role: string) => {
    return user?.roles.includes(role) ?? false;
  };

  const isPartner = hasRole('ROLE_PARTNER');
  const isStaff = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER') || hasRole('ROLE_SUPPORT');
  const canCreate = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');
  const canEdit = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');
  const canDelete = hasRole('ROLE_ADMIN');
  const canUpdateStatus = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isPartner,
    isStaff,
    login,
    setAuthSession,
    logout,
    hasRole,
    canCreate,
    canEdit,
    canDelete,
    canUpdateStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
