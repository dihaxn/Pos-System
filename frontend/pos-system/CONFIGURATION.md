# Configuration Guide

This project now uses a centralized configuration system for all API URLs and environment-specific values.

## Environment Configuration

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8089/api/v1
VITE_RETURN_API_URL=http://localhost:8088/api/v1/return
VITE_OUTLET_API_URL=http://localhost:8088/api/v1/outlet
VITE_FACTORY_ORDER_API_URL=http://localhost:8088/api/v1/fac-order
VITE_CUSTOMER_ORDER_API_URL=http://localhost:8088/api/v1/cus-order
VITE_NOTIFICATION_API_URL=http://localhost:8087/api/v1/notifications

# WebSocket Configuration
VITE_WS_URL=http://localhost:8087/ws

# Development Server
VITE_DEV_SERVER_PORT=5173

# Environment
NODE_ENV=development
```

### 2. Configuration File

The main configuration is centralized in `src/config/environment.js`. This file:

- Reads environment variables with fallback values
- Provides a consistent interface for all configuration values
- Includes predefined API endpoints for common operations

### 3. Usage in Components

Instead of hardcoding URLs, import and use the configuration:

```javascript
import config from "../../config/environment.js";

// Use API URLs
const response = await axios.get(
  `${config.RETURN_API_URL}${config.ENDPOINTS.RETURN.ALL_NOT_PENDING}`
);

// Use WebSocket URL
const socket = new SockJS(config.WS_URL);
```

## API Service Structure

### Shared API Service

- **File**: `src/features/shared/services/api.js`
- **Purpose**: Centralized axios instance with common configuration
- **Base URL**: Configurable via `VITE_API_BASE_URL`

### Feature-Specific Services

Each feature has its own service files that import the configuration:

- **Return Service**: `src/features/outlet/services/outlet_service/returnController.js`
- **Outlet Service**: `src/features/outlet/services/outlet_service/outletController.js`
- **Factory Order Service**: `src/features/outlet/services/outlet_service/factoryOrderController.js`
- **Customer Order Service**: `src/features/outlet/services/outlet_service/cusOrderController.js`
- **Notification Service**: `src/features/owner/services/reporting_service/notificationController.js`

## Benefits

1. **Centralized Configuration**: All URLs and settings in one place
2. **Environment Flexibility**: Easy to switch between development, staging, and production
3. **Maintainability**: No more hardcoded URLs scattered throughout the codebase
4. **Consistency**: Standardized API endpoint structure
5. **Security**: Sensitive configuration can be kept out of version control

## Migration Notes

All hardcoded URLs have been replaced with configuration references:

- `http://localhost:8088/api/v1/return` → `config.RETURN_API_URL`
- `http://localhost:8088/api/v1/outlet` → `config.OUTLET_API_URL`
- `http://localhost:8087/ws` → `config.WS_URL`

## Production Deployment

For production, set the appropriate environment variables:

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_RETURN_API_URL=https://api.yourdomain.com/api/v1/return
# ... etc
```

The configuration system will automatically use these values when available.
