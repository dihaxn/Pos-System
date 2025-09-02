/**
 * Security configuration for the LLOMS project
 */

export const SECURITY_CONFIG = {
  // Authentication settings
  AUTH: {
    // JWT token settings
    JWT: {
      EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
      STORAGE_KEY: 'lloms_auth_token',
      REFRESH_KEY: 'lloms_refresh_token'
    },
    
    // Password requirements
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBERS: true,
      REQUIRE_SPECIAL_CHARS: true,
      MAX_ATTEMPTS: 5,
      LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
    },
    
    // Session management
    SESSION: {
      TIMEOUT: 30 * 60 * 1000, // 30 minutes of inactivity
      EXTEND_ON_ACTIVITY: true,
      MAX_SESSIONS: 3
    }
  },

  // Input validation settings
  VALIDATION: {
    // Rate limiting for form submissions
    RATE_LIMIT: {
      MAX_ATTEMPTS: 10,
      WINDOW_MS: 60 * 1000, // 1 minute
      BLOCK_DURATION: 5 * 60 * 1000 // 5 minutes
    },
    
    // File upload security
    FILE_UPLOAD: {
      MAX_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      SCAN_FOR_VIRUSES: true,
      SANITIZE_FILENAMES: true
    },
    
    // Input sanitization
    SANITIZATION: {
      ALLOW_HTML: false,
      ALLOW_SCRIPTS: false,
      ALLOW_IFRAMES: false,
      MAX_LENGTH: 1000
    }
  },

  // API security settings
  API: {
    // Rate limiting
    RATE_LIMIT: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100,
      MESSAGE: 'Too many requests, please try again later'
    },
    
    // CORS settings
    CORS: {
      ALLOWED_ORIGINS: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://yourdomain.com'
      ],
      ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
      EXPOSE_HEADERS: ['X-Total-Count'],
      CREDENTIALS: true
    },
    
    // Request validation
    REQUEST: {
      MAX_BODY_SIZE: '10mb',
      TIMEOUT: 30000, // 30 seconds
      VALIDATE_SCHEMA: true
    }
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'"],
    IMG_SRC: ["'self'", "data:", "https:"],
    FONT_SRC: ["'self'", "https:"],
    CONNECT_SRC: ["'self'", "https:"],
    FRAME_SRC: ["'none'"],
    OBJECT_SRC: ["'none'"],
    BASE_URI: ["'self'"],
    FORM_ACTION: ["'self'"]
  },

  // Security headers
  HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },

  // Logging and monitoring
  MONITORING: {
    // Security event logging
    LOG_SECURITY_EVENTS: true,
    LOG_LEVEL: 'info', // info, warning, error
    LOG_TO_CONSOLE: true,
    LOG_TO_FILE: false,
    LOG_TO_SERVICE: false,
    
    // Performance monitoring
    MONITOR_PERFORMANCE: true,
    MONITOR_MEMORY: true,
    MONITOR_NETWORK: true,
    
    // Error tracking
    TRACK_ERRORS: true,
    SEND_ERROR_REPORTS: false,
    ERROR_SAMPLE_RATE: 0.1 // 10% of errors
  },

  // Environment-specific settings
  ENVIRONMENT: {
    DEVELOPMENT: {
      LOG_LEVEL: 'debug',
      ENABLE_DEBUG_MODE: true,
      RELAX_SECURITY: false,
      MOCK_AUTH: true
    },
    STAGING: {
      LOG_LEVEL: 'info',
      ENABLE_DEBUG_MODE: false,
      RELAX_SECURITY: false,
      MOCK_AUTH: false
    },
    PRODUCTION: {
      LOG_LEVEL: 'warn',
      ENABLE_DEBUG_MODE: false,
      RELAX_SECURITY: false,
      MOCK_AUTH: false
    }
  }
};

/**
 * Get security configuration for current environment
 * @returns {Object} - Security configuration for current environment
 */
export const getSecurityConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const baseConfig = { ...SECURITY_CONFIG };
  
  // Override with environment-specific settings
  if (SECURITY_CONFIG.ENVIRONMENT[env.toUpperCase()]) {
    Object.assign(baseConfig, SECURITY_CONFIG.ENVIRONMENT[env.toUpperCase()]);
  }
  
  return baseConfig;
};

/**
 * Check if security features are enabled
 * @param {string} feature - Security feature to check
 * @returns {boolean} - True if feature is enabled
 */
export const isSecurityFeatureEnabled = (feature) => {
  const config = getSecurityConfig();
  
  switch (feature) {
    case 'logging':
      return config.MONITORING.LOG_SECURITY_EVENTS;
    case 'performance':
      return config.MONITORING.MONITOR_PERFORMANCE;
    case 'debug':
      return config.ENVIRONMENT[process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT']?.ENABLE_DEBUG_MODE;
    default:
      return false;
  }
};

/**
 * Get security headers for the application
 * @returns {Object} - Security headers
 */
export const getSecurityHeaders = () => {
  const config = getSecurityConfig();
  return config.HEADERS;
};

/**
 * Get CSP policy string
 * @returns {string} - Content Security Policy string
 */
export const getCSPPolicy = () => {
  const config = getSecurityConfig();
  const csp = config.CSP;
  
  return Object.entries(csp)
    .map(([key, values]) => {
      if (Array.isArray(values)) {
        return `${key} ${values.join(' ')}`;
      }
      return `${key} ${values}`;
    })
    .join('; ');
};
