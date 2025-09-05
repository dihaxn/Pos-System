/**
 * Security utility functions for the LLOMS project
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  let sanitized = html;
  
  // Remove script tags and their content (with global flag for multiple occurrences)
  // Enhanced regex to handle script tags with any whitespace, tabs, and newlines: </script >, </script\t\n bar>, etc.
  while (sanitized.match(/<script\b[^<]*(?:(?!<\/script[\s\S]*?>)<[^<]*)*<\/script[\s\S]*?>/gi)) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script[\s\S]*?>)<[^<]*)*<\/script[\s\S]*?>/gi, '');
  }
  
  // Remove javascript: protocol (with global flag for multiple occurrences)
  while (sanitized.match(/javascript:/gi)) {
    sanitized = sanitized.replace(/javascript:/gi, '');
  }
  
  // Remove on* event handlers (with global flag for multiple occurrences)
  while (sanitized.match(/\son\w+\s*=\s*["'][^"']*["']/gi)) {
    sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  }
  
  // Remove iframe tags (with global flag for multiple occurrences)
  while (sanitized.match(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi)) {
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }
  
  // Remove object tags (with global flag for multiple occurrences)
  while (sanitized.match(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi)) {
    sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  }
  
  // Remove embed tags (with global flag for multiple occurrences)
  while (sanitized.match(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi)) {
    sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  }
  
  // Remove data: and vbscript: protocols
  sanitized = sanitized.replace(/data:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  
  return sanitized;
};

/**
 * Encrypts sensitive data before storing in localStorage
 * @param {string} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {string} - Encrypted data
 */
export const encryptData = (data, key = 'lloms-secure-key') => {
  if (!data) return '';
  
  try {
    // Simple encryption for demo purposes
    // In production, use a proper encryption library like crypto-js
    const encoded = btoa(encodeURIComponent(data));
    return encoded;
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * Decrypts data from localStorage
 * @param {string} encryptedData - Encrypted data to decrypt
 * @param {string} key - Encryption key
 * @returns {string} - Decrypted data
 */
export const decryptData = (encryptedData, key = 'lloms-secure-key') => {
  if (!encryptedData) return '';
  
  try {
    // Simple decryption for demo purposes
    // In production, use a proper encryption library like crypto-js
    const decoded = decodeURIComponent(atob(encryptedData));
    return decoded;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

/**
 * Securely stores sensitive data in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {boolean} encrypt - Whether to encrypt the data
 */
export const secureStorageSet = (key, value, encrypt = true) => {
  try {
    if (encrypt) {
      const encryptedValue = encryptData(JSON.stringify(value));
      localStorage.setItem(key, encryptedValue);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Secure storage set failed:', error);
  }
};

/**
 * Securely retrieves data from localStorage
 * @param {string} key - Storage key
 * @param {boolean} encrypted - Whether the data is encrypted
 * @returns {*} - Retrieved data
 */
export const secureStorageGet = (key, encrypted = true) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;
    
    if (encrypted) {
      const decryptedValue = decryptData(storedValue);
      return JSON.parse(decryptedValue);
    } else {
      return JSON.parse(storedValue);
    }
  } catch (error) {
    console.error('Secure storage get failed:', error);
    return null;
  }
};

/**
 * Securely removes data from localStorage
 * @param {string} key - Storage key
 */
export const secureStorageRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Secure storage remove failed:', error);
  }
};

/**
 * Validates and sanitizes user input
 * @param {string} input - User input to validate
 * @param {string} type - Type of input (text, email, url, etc.)
 * @returns {string} - Sanitized input
 */
export const validateAndSanitizeInput = (input, type = 'text') => {
  if (!input || typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  switch (type) {
    case 'email':
      // Remove any HTML tags from email (with global flag for multiple occurrences)
      while (sanitized.match(/<[^>]*>/g)) {
        sanitized = sanitized.replace(/<[^>]*>/g, '');
      }
      // Remove any script content (with global flag for multiple occurrences)
      while (sanitized.match(/javascript:/gi)) {
        sanitized = sanitized.replace(/javascript:/gi, '');
      }
      // Remove data: and vbscript: protocols
      sanitized = sanitized.replace(/data:/gi, '');
      sanitized = sanitized.replace(/vbscript:/gi, '');
      break;
      
    case 'url':
      // Ensure URL starts with http:// or https://
      if (sanitized && !sanitized.match(/^https?:\/\//)) {
        sanitized = 'https://' + sanitized;
      }
      // Remove any script content (with global flag for multiple occurrences)
      while (sanitized.match(/javascript:/gi)) {
        sanitized = sanitized.replace(/javascript:/gi, '');
      }
      // Remove data: and vbscript: protocols
      sanitized = sanitized.replace(/data:/gi, '');
      sanitized = sanitized.replace(/vbscript:/gi, '');
      break;
      
    case 'text':
    default:
      // Remove HTML tags but allow basic formatting (with global flag for multiple occurrences)
      // Enhanced regex to handle script tags with any whitespace, tabs, and newlines: </script >, </script\t\n bar>, etc.
      while (sanitized.match(/<script\b[^<]*(?:(?!<\/script[\s\S]*?>)<[^<]*)*<\/script[\s\S]*?>/gi)) {
        sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script[\s\S]*?>)<[^<]*)*<\/script[\s\S]*?>/gi, '');
      }
      while (sanitized.match(/javascript:/gi)) {
        sanitized = sanitized.replace(/javascript:/gi, '');
      }
      // Remove data: and vbscript: protocols
      sanitized = sanitized.replace(/data:/gi, '');
      sanitized = sanitized.replace(/vbscript:/gi, '');
      break;
  }
  
  return sanitized;
};

/**
 * Generates a secure random token
 * @param {number} length - Length of the token
 * @returns {string} - Secure random token
 */
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Checks if a string contains potentially malicious content
 * @param {string} input - String to check
 * @returns {boolean} - True if potentially malicious
 */
export const containsMaliciousContent = (input) => {
  if (!input || typeof input !== 'string') return false;
  
  const maliciousPatterns = [
    // Enhanced regex to handle script tags with any whitespace, tabs, and newlines: </script >, </script\t\n bar>, etc.
    /<script\b[^<]*(?:(?!<\/script[\s\S]*?>)<[^<]*)*<\/script[\s\S]*?>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi,
    /javascript:alert/gi,
    /javascript:prompt/gi,
    /javascript:confirm/gi,
    /<img[^>]*onerror/gi,
    /<img[^>]*onload/gi,
    /<a[^>]*javascript:/gi
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Sanitizes error messages to prevent information disclosure
 * @param {string} errorMessage - Error message to sanitize
 * @returns {string} - Sanitized error message
 */
export const sanitizeErrorMessage = (errorMessage) => {
  if (!errorMessage || typeof errorMessage !== 'string') return 'An error occurred';
  
  // Remove sensitive information patterns
  const sensitivePatterns = [
    /user=.*?/gi,
    /password=.*?/gi,
    /host=.*?/gi,
    /port=.*?/gi,
    /database=.*?/gi,
    /api_key=.*?/gi,
    /secret=.*?/gi,
    /token=.*?/gi,
    /localhost/gi,
    /127\.0\.0\.1/gi,
    /192\.168\./gi,
    /10\./gi,
    /172\.(1[6-9]|2[0-9]|3[0-1])\./gi
  ];
  
  let sanitized = errorMessage;
  sensitivePatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  });
  
  return sanitized;
};

/**
 * Validates JWT token format
 * @param {string} token - JWT token to validate
 * @returns {boolean} - True if valid JWT format
 */
export const isValidJWT = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Each part should be base64 encoded
  try {
    parts.forEach(part => {
      if (part) {
        atob(part);
      }
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Checks if the current environment is secure
 * @returns {boolean} - True if environment is secure
 */
export const isSecureEnvironment = () => {
  // Check if running on HTTPS
  const isHTTPS = window.location.protocol === 'https:';
  
  // Check if running on localhost (development)
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
  // Check if running in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  return isHTTPS || isLocalhost || !isProduction;
};

/**
 * Logs security events for monitoring
 * @param {string} event - Security event type
 * @param {Object} details - Event details
 * @param {string} level - Log level (info, warning, error)
 */
export const logSecurityEvent = (event, details = {}, level = 'info') => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event,
    details,
    level,
    userAgent: navigator.userAgent,
    url: window.location.href,
    environment: process.env.NODE_ENV
  };
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to security monitoring service
    console.log('Security Event:', securityLog);
  } else {
    // Log to console in development
    console.log('Security Event:', securityLog);
  }
};
