import api from './api';

// User service functions
const UserService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  // Change password (part of user update)
  changePassword: async (password) => {
    const response = await api.put('/users/me', {
      password: password,
    });
    return response.data;
  },

  // Admin functions - only accessible to superusers

  // Get all users (admin only)
  getAllUsers: async (skip = 0, limit = 100) => {
    const response = await api.get('/users/', {
      params: { skip, limit }
    });
    return response.data;
  },

  // Get user by ID (admin only)
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    const response = await api.post('/users/', {
      email: userData.email,
      password: userData.password,
      full_name: userData.fullName,
      is_active: userData.isActive,
      is_superuser: userData.isSuperuser,
      email_verified: userData.emailVerified,
    });
    return response.data;
  },

  // Update user by ID (admin only)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user by ID (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default UserService;
