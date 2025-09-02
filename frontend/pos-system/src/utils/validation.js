/**
 * Validation utility functions
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validates required field
 * @param {*} value - Value to check
 * @returns {boolean} - True if value exists
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validates minimum length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if meets minimum length
 */
export const minLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validates maximum length
 * @param {string} value - String to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} - True if within maximum length
 */
export const maxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

/**
 * Validates numeric value
 * @param {*} value - Value to validate
 * @returns {boolean} - True if numeric
 */
export const isNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Validates positive number
 * @param {number} value - Number to validate
 * @returns {boolean} - True if positive
 */
export const isPositive = (value) => {
  return isNumeric(value) && parseFloat(value) > 0;
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Creates a validation schema object
 * @param {Object} rules - Validation rules
 * @returns {Function} - Validation function
 */
export const createValidationSchema = (rules) => {
  return (values) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field];
      const value = values[field];
      
      fieldRules.forEach(rule => {
        if (rule.required && !isRequired(value)) {
          errors[field] = rule.message || `${field} is required`;
        } else if (rule.minLength && !minLength(value, rule.minLength)) {
          errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
        } else if (rule.maxLength && !maxLength(value, rule.maxLength)) {
          errors[field] = rule.message || `${field} must be no more than ${rule.maxLength} characters`;
        } else if (rule.email && !isValidEmail(value)) {
          errors[field] = rule.message || `${field} must be a valid email`;
        } else if (rule.phone && !isValidPhone(value)) {
          errors[field] = rule.message || `${field} must be a valid phone number`;
        } else if (rule.numeric && !isNumeric(value)) {
          errors[field] = rule.message || `${field} must be a number`;
        } else if (rule.positive && !isPositive(value)) {
          errors[field] = rule.message || `${field} must be a positive number`;
        } else if (rule.url && !isValidUrl(value)) {
          errors[field] = rule.message || `${field} must be a valid URL`;
        } else if (rule.custom && !rule.custom(value, values)) {
          errors[field] = rule.message || `${field} is invalid`;
        }
      });
    });
    
    return errors;
  };
};
