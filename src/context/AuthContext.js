import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth';
import { isTokenExpired, getAccessToken } from '../services/api';

// Create the authentication context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount and token changes
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Check if there's a valid token
        const token = getAccessToken();
        
        if (token && !isTokenExpired(token)) {
          // Get user info from token
          const user = AuthService.getCurrentUser();
          setCurrentUser(user);
        } else if (token && isTokenExpired(token)) {
          // Try to refresh the token if it's expired
          try {
            await AuthService.refreshToken();
            const user = AuthService.getCurrentUser();
            setCurrentUser(user);
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            setCurrentUser(null);
            AuthService.logout();
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.login(email, password);
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password, full_name) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.register(email, password, full_name);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return AuthService.isAuthenticated();
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.requestPasswordReset(email);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.resetPassword(token, newPassword);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email with token
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.verifyEmail(token);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Email verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
