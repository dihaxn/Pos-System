// Services Index
// Export all service modules for easy importing

// API Client
export { default as apiClient } from './api/apiClient';

// Auth Services
export * from '../features/auth/services/auth';

// Product Services
export * from '../features/shared/services/product-service';
export * from '../features/shared/services/stockController';

// Outlet Services
export * from '../features/outlet/services/outlet_service';

// Owner Services
export * from '../features/owner/services/reporting_service';
export * from '../features/owner/services/user_service';
