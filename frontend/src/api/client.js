import axios from 'axios';

// Base Axios instance
const apiClient = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('partner_portal_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle API response wrappers & normalize errors
apiClient.interceptors.response.use(
  (response) => {
    // If Spring Boot wraps response in ApiResponse<T>, unwrap data if present
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    let errorMessage = 'An unexpected server error occurred. Please try again.';
    
    if (error.response) {
      const data = error.response.data;
      if (data?.message) {
        errorMessage = data.message;
      } else if (data?.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.join(', ');
      } else if (data?.error) {
        errorMessage = data.error;
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid credentials or expired session. Please log in again.';
      } else if (error.response.status === 403) {
        errorMessage = 'Access denied. You do not have sufficient permissions for this action.';
      } else if (error.response.status === 404) {
        errorMessage = 'Requested resource not found.';
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to the backend server. Please verify backend is running.';
    }

    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    customError.raw = error;
    return Promise.reject(customError);
  }
);

// Authentication APIs
export const authApi = {
  login: async (username, password) => {
    const data = await apiClient.post('/api/v1/auth/login', { username, password });
    return data;
  },
  register: async (userData) => {
    return apiClient.post('/api/v1/auth/register', userData);
  },
};

// Dashboard & Fleet Metrics APIs
export const dashboardApi = {
  getSummary: async () => {
    return apiClient.get('/api/v1/dashboard/summary');
  },
};

// Delivery Partner CRUD, Search & FSM Workflow APIs
export const partnerApi = {
  getAll: async (page = 0, size = 10, sort = 'createdAt,desc') => {
    return apiClient.get('/api/v1/partners', {
      params: { page, size, sort },
    });
  },

  search: async ({ name, phone, status, vehicleType, page = 0, size = 10, sort = 'createdAt,desc' }) => {
    const params = { page, size, sort };
    if (name?.trim()) params.name = name.trim();
    if (phone?.trim()) params.phone = phone.trim();
    if (status && status !== 'ALL') params.status = status;
    if (vehicleType && vehicleType !== 'ALL') params.vehicleType = vehicleType;

    return apiClient.get('/api/v1/partners/search', { params });
  },

  getById: async (id) => {
    return apiClient.get(`/api/v1/partners/${id}`);
  },

  create: async (partnerData) => {
    return apiClient.post('/api/v1/partners', partnerData);
  },

  update: async (id, partnerData) => {
    return apiClient.put(`/api/v1/partners/${id}`, partnerData);
  },

  delete: async (id) => {
    return apiClient.delete(`/api/v1/partners/${id}`);
  },

  updateStatus: async (id, targetStatus, reason) => {
    return apiClient.patch(`/api/v1/partners/${id}/status`, {
      targetStatus,
      reason,
    });
  },

  getStatusHistory: async (id) => {
    return apiClient.get(`/api/v1/partners/${id}/history`);
  },
};

// System Health & Actuator APIs
export const healthApi = {
  getHealth: async () => {
    return apiClient.get('/api/v1/health');
  },
  getActuatorHealth: async () => {
    return apiClient.get('/actuator/health');
  },
};

export default apiClient;
