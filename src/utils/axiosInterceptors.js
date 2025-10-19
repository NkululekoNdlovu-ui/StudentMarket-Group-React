import axios from 'axios';
import { getValidToken, clearAuthData } from '../utils/authUtils';

// Create axios interceptor to handle authentication
const setupAxiosInterceptors = (logout) => {
  // Request interceptor to add token to all requests
  axios.interceptors.request.use(
    (config) => {
      const token = getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add additional security headers for sensitive operations
      const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase());
      if (isStateChanging) {
        const isSensitiveEndpoint = config.url?.includes('/create') || 
                                  config.url?.includes('/delete') || 
                                  config.url?.includes('/update') ||
                                  config.url?.includes('/checkout');

        if (isSensitiveEndpoint) {
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          config.headers['Content-Security-Policy'] = "default-src 'self'";
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle authentication errors and security violations
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.message || error.response?.data?.error;

      console.error('API Error:', {
        status,
        message: errorMessage,
        url: error.config?.url,
        method: error.config?.method
      });

      if (status === 401) {
        console.log('Authentication failed, clearing auth data and redirecting to login');
        clearAuthData();
        if (logout) {
          logout();
        }
        // Redirect to login page
        window.location.href = '/login';
      } else if (status === 403) {
        console.log('Access forbidden:', errorMessage);
        // Show user-friendly error message
        if (errorMessage?.includes('Token too old')) {
          clearAuthData();
          if (logout) {
            logout();
          }
          alert('Your session has expired for security reasons. Please log in again.');
          window.location.href = '/login';
        } else {
          alert('You do not have permission to perform this action: ' + (errorMessage || 'Access denied'));
        }
      } else if (status === 429) {
        // Rate limiting
        alert('Too many requests. Please try again later.');
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;