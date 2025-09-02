import axios from 'axios';

/**
 * Enhanced API client with interceptors and error handling
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

        // Log request in development
        if (import.meta.env.DEV) {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            data: config.data,
            headers: config.headers,
          });
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Calculate response time
        const responseTime = new Date() - response.config.metadata.startTime;
        
        // Log response in development
        if (import.meta.env.DEV) {
          console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            responseTime: `${responseTime}ms`,
            data: response.data,
          });
        }

        return response;
      },
      (error) => {
        // Calculate response time for errors
        const responseTime = error.config?.metadata?.startTime 
          ? new Date() - error.config.metadata.startTime 
          : 0;

        // Enhanced error logging
        const errorInfo = {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          responseTime: `${responseTime}ms`,
          data: error.response?.data,
        };

        console.error('API Error:', errorInfo);

        // Handle specific error cases
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        } else if (error.response?.status === 403) {
          this.handleForbidden();
        } else if (error.response?.status >= 500) {
          this.handleServerError(error);
        }

        return Promise.reject(this.enhanceError(error));
      }
    );
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  /**
   * Handle unauthorized access
   */
  handleUnauthorized() {
    // Clear auth token
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }

    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Handle forbidden access
   */
  handleForbidden() {
    console.warn('Access forbidden - insufficient permissions');
    // You could show a toast notification here
  }

  /**
   * Handle server errors
   */
  handleServerError(error) {
    console.error('Server error occurred:', error);
    // You could show a toast notification here
  }

  /**
   * Enhance error with additional context
   */
  enhanceError(error) {
    const enhancedError = {
      ...error,
      isNetworkError: !error.response,
      isServerError: error.response?.status >= 500,
      isClientError: error.response?.status >= 400 && error.response?.status < 500,
      isAuthError: error.response?.status === 401,
      isForbiddenError: error.response?.status === 403,
      isNotFoundError: error.response?.status === 404,
      timestamp: new Date().toISOString(),
    };

    return enhancedError;
  }

  /**
   * Make a GET request
   */
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.enhanceError(error);
    }
  }

  /**
   * Make a POST request
   */
  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.enhanceError(error);
    }
  }

  /**
   * Make a PUT request
   */
  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.enhanceError(error);
    }
  }

  /**
   * Make a PATCH request
   */
  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.enhanceError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.enhanceError(error);
    }
  }

  /**
   * Upload file
   */
  async upload(url, file, onProgress = null, config = {}) {
    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    };

    try {
      const response = await this.client.post(url, formData, uploadConfig);
      return response.data;
    } catch (error) {
      throw this.enhanceError(error);
    }
  }

  /**
   * Download file
   */
  async download(url, filename = 'download', config = {}) {
    const downloadConfig = {
      ...config,
      responseType: 'blob',
    };

    try {
      const response = await this.client.get(url, downloadConfig);
      
      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return response.data;
    } catch (error) {
      throw this.enhanceError(error);
    }
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;
