// src/services/users.js
import {api} from './api';

export const userService = {
  // Get multiple users by IDs
  getUsersByIds: async (userIds) => {
    try {
      // You'll need to create this endpoint on your server
      const response = await api.post('/users/batch', { userIds });
      return response.data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Get single user by ID (fallback)
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
};