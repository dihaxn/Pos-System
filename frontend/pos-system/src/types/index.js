// Common type definitions for the project
// Using JSDoc for type safety in JavaScript

/**
 * @typedef {Object} User
 * @property {string} id - User unique identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} role - User's role (owner, factory, outlet)
 * @property {string} [avatar] - User's profile picture URL
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Product unique identifier
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {number} quantity - Available quantity
 * @property {string} [description] - Product description
 * @property {string} [image] - Product image URL
 * @property {string} [category] - Product category
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Order unique identifier
 * @property {string} customerId - Customer identifier
 * @property {Array<OrderItem>} items - Order items
 * @property {number} total - Order total amount
 * @property {string} status - Order status
 * @property {Date} createdAt - Order creation date
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} productId - Product identifier
 * @property {number} quantity - Item quantity
 * @property {number} price - Item price
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - API call success status
 * @property {*} data - Response data
 * @property {string} [message] - Response message
 * @property {string} [error] - Error message if any
 */

/**
 * @typedef {Object} Theme
 * @property {'light' | 'dark'} mode - Current theme mode
 * @property {Object} colors - Theme color palette
 */

/**
 * @typedef {Object} LoadingState
 * @property {boolean} isLoading - Loading status
 * @property {string} [message] - Loading message
 */

/**
 * @typedef {Object} ErrorState
 * @property {boolean} hasError - Error status
 * @property {string} [message] - Error message
 * @property {string} [code] - Error code
 */

export const ROLES = {
  OWNER: 'owner',
  FACTORY: 'factory',
  OUTLET: 'outlet'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};
