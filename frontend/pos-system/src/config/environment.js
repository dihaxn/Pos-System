// Environment Configuration
// This file centralizes all API URLs and configuration values
// In production, these values should come from environment variables

const config = {
  // API Base URLs - All through BFF
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  RETURN_API_URL: import.meta.env.VITE_RETURN_API_URL || "http://localhost:3000/api/returns",
  OUTLET_API_URL: import.meta.env.VITE_OUTLET_API_URL || "http://localhost:3000/api/outlets",
  FACTORY_ORDER_API_URL: import.meta.env.VITE_FACTORY_ORDER_API_URL || "http://localhost:3000/api/factory-orders",
  CUSTOMER_ORDER_API_URL: import.meta.env.VITE_CUSTOMER_ORDER_API_URL || "http://localhost:3000/api/customer-orders",
  NOTIFICATION_API_URL: import.meta.env.VITE_NOTIFICATION_API_URL || "http://localhost:3000/api/notifications",
  
  // WebSocket Configuration
  WS_URL: import.meta.env.VITE_WS_URL || "http://localhost:8087/ws",
  
  // Development Server
  DEV_SERVER_PORT: import.meta.env.VITE_DEV_SERVER_PORT || 5173,
  
  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || "development",
  
  // API Endpoints
  ENDPOINTS: {
    RETURN: {
      ALL_NOT_PENDING: "/all-not-pending",
      ALL_BY_STATUS: "/all-by-status",
      ALL_BY_OUTLET_ID: "/all-by-outletId",
      UPDATE_STATUS: "/",
      OUTLET_URL: "/url",
    },
    OUTLET: {
      GET_BY_ID: "/get-outlet-by-id",
      SAVE: "/",
      URL: "/url",
    },
    FACTORY_ORDER: {
      GET_BY_STATUS: "/by-status",
      GET_BY_ID: "/by-id",
      GET_ITEMS: "/items",
      UPDATE_STATUS: "/status",
    },
    CUSTOMER_ORDER: {
      GET_BY_OUTLET: "/by-outlet",
      GET_ITEMS: "/items",
    },
    NOTIFICATIONS: {
      SAVE: "/",
    }
  }
};

export default config;
