import axios from 'axios';
import jwtDecode from 'jwt-decode';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for token refresh to avoid interceptor loops
const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track if token refresh is in progress
let isRefreshing = false;
// Queue of requests waiting for token refresh
let refreshSubscribers = [];

// Helper function to subscribe to token refresh
const subscribeToTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Helper function to notify subscribers that token refresh is complete
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Helper function to get access token
const getAccessToken = () => localStorage.getItem('token');

// Helper function to get refresh token
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Helper function to set tokens
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Helper function to clear tokens
const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Helper function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await refreshApi.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    
    return access_token;
  } catch (error) {
    clearTokens();
    window.location.href = '/login';
    throw error;
  }
};

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    
    // If token exists but is expired, try to refresh it
    if (token && isTokenExpired(token) && !config.url.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          token = await refreshToken();
          isRefreshing = false;
          onTokenRefreshed(token);
        } catch (error) {
          isRefreshing = false;
          return Promise.reject(error);
        }
      } else {
        // If refresh is already in progress, wait for it to complete
        return new Promise((resolve) => {
          subscribeToTokenRefresh((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          });
        });
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (
      error.response && 
      error.response.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const token = await refreshToken();
          isRefreshing = false;
          onTokenRefreshed(token);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // If refresh is already in progress, wait for it to complete
        return new Promise((resolve) => {
          subscribeToTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }
    }
    
    // Handle other errors
    if (error.response && error.response.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden:', error.response.data);
    } else if (error.response && error.response.status === 404) {
      // Not found
      console.error('Resource not found:', error.response.data);
    } else if (error.response && error.response.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export { 
  api as default, 
  getAccessToken, 
  getRefreshToken, 
  setTokens, 
  clearTokens, 
  isTokenExpired 
};
