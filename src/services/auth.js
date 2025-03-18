import api, { setTokens, clearTokens, isTokenExpired, getAccessToken } from './api';
import jwtDecode from 'jwt-decode';

// Authentication service functions
const AuthService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      username: email,
      password: password,
    });
    
    const { access_token, refresh_token } = response.data;
    if (access_token && refresh_token) {
      setTokens(access_token, refresh_token);
    }
    
    return response.data;
  },

  // Register new user
  register: async (email, password, full_name) => {
    const response = await api.post('/auth/register', {
      email: email,
      password: password,
      full_name: full_name,
      is_active: true,
      is_superuser: false,
      email_verified: false
    });
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      // Call the logout endpoint (optional, as JWT is stateless)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens regardless of API call success
      clearTokens();
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/password-reset-request', {
      email: email,
    });
    
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/password-reset', {
      token: token,
      new_password: newPassword,
    });
    
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', {
      token: token,
    });
    
    return response.data;
  },

  // Request email verification resend
  requestEmailVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', {
      email: email,
    });
    
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    
    return response.data;
  },

  // Get current user info from token
  getCurrentUser: () => {
    const token = getAccessToken();
    if (token && !isTokenExpired(token)) {
      try {
        const decoded = jwtDecode(token);
        return {
          id: decoded.sub,
          exp: decoded.exp,
          ...decoded
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  },

  // Check if user is logged in with valid token
  isAuthenticated: () => {
    const token = getAccessToken();
    return token && !isTokenExpired(token);
  },
};

export default AuthService;
