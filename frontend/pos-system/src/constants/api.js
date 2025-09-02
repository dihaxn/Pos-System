export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  OUTLET: {
    ORDERS: '/outlet/orders',
    INVENTORY: '/outlet/inventory',
    RETURNS: '/outlet/returns',
  },
  FACTORY: {
    ORDERS: '/factory/orders',
    INVENTORY: '/factory/inventory',
  },
  OWNER: {
    USERS: '/owner/users',
    REPORTS: '/owner/reports',
    APPROVALS: '/owner/approvals',
  },
};
