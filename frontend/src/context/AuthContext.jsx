import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  admin: {
    username: 'admin',
    password: 'Admin@123',
    roleLabel: 'Super Admin',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  ops_manager: {
    username: 'ops_manager',
    password: 'Ops@123',
    roleLabel: 'Operations Manager',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  viewer: {
    username: 'viewer',
    password: 'Viewer@123',
    roleLabel: 'Fleet Viewer',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('partner_portal_jwt') || null);
  const [loading, setLoading] = useState(true);
  const [activeDemoRole, setActiveDemoRole] = useState(localStorage.getItem('partner_portal_role_key') || 'admin');

  // Perform login
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(username, password);
      // response contains { token, username, email, roles, type }
      setToken(response.token);
      setUser(response);
      localStorage.setItem('partner_portal_jwt', response.token);
      localStorage.setItem('partner_portal_user', JSON.stringify(response));
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('partner_portal_jwt');
    localStorage.removeItem('partner_portal_user');
    localStorage.removeItem('partner_portal_role_key');
  }, []);

  // 1-Click Demo Persona Switcher
  const switchDemoRole = useCallback(async (roleKey) => {
    const credentials = DEMO_USERS[roleKey];
    if (!credentials) return;

    setLoading(true);
    try {
      const response = await authApi.login(credentials.username, credentials.password);
      setToken(response.token);
      setUser(response);
      setActiveDemoRole(roleKey);
      localStorage.setItem('partner_portal_jwt', response.token);
      localStorage.setItem('partner_portal_user', JSON.stringify(response));
      localStorage.setItem('partner_portal_role_key', roleKey);
      return response;
    } catch (err) {
      console.warn('Auto-login for demo role failed, falling back to mock state:', err);
      // Fallback in case backend DB is down
      const mockUser = {
        username: credentials.username,
        email: `${credentials.username}@partnerportal.com`,
        roles: [roleKey === 'admin' ? 'ROLE_ADMIN' : roleKey === 'ops_manager' ? 'ROLE_OPS_MANAGER' : 'ROLE_VIEWER'],
        token: 'mock-token',
      };
      setUser(mockUser);
      setActiveDemoRole(roleKey);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('partner_portal_user');
    const savedToken = localStorage.getItem('partner_portal_jwt');

    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
        setLoading(false);
      } catch {
        // Corrupted session, auto-login as admin
        switchDemoRole('admin');
      }
    } else {
      // Auto initialize default admin account for seamless user experience
      switchDemoRole('admin');
    }
  }, [switchDemoRole]);

  // Role permissions checking helpers
  const hasRole = useCallback((roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(roleName);
  }, [user]);

  const canCreatePartner = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER') || hasRole('ROLE_SUPPORT');
  const canUpdateStatus = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');
  const canDeletePartner = hasRole('ROLE_ADMIN');
  const canEditPartner = hasRole('ROLE_ADMIN') || hasRole('ROLE_OPS_MANAGER');

  const value = {
    user,
    token,
    loading,
    activeDemoRole,
    login,
    logout,
    switchDemoRole,
    hasRole,
    canCreatePartner,
    canUpdateStatus,
    canDeletePartner,
    canEditPartner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
