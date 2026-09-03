import { api, handleLoginResponse } from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return handleLoginResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData) {
    console.log("USER DATA:", userData);
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },


  async verifyEmail(email, code) {
    try {
      const response = await api.post('/auth/register-verify', { email, code });
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const response = await api.post('/auth/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },

  async resetPassword(email, code, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        code,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  },
// Add to your src/services/auth.js file
async updateProfileImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post('/auth/update-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      // Update local storage with new user data
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
    
    return response.data;
  } catch (error) {
    console.error('Profile image update error:', error);
    const message = error.response?.data?.message || 'Failed to update profile image';
    throw new Error(message);
  }
},

async removeProfileImage() {
  try {
    const response = await api.delete('/auth/remove-profile-image');
    
    if (response.data.success) {
      // Update local storage with new user data
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
    
    return response.data;
  } catch (error) {
    console.error('Profile image removal error:', error);
    const message = error.response?.data?.message || 'Failed to remove profile image';
    throw new Error(message);
  }
},
  async getCurrentUser() {
    try {
      // Check if we have user data in localStorage first
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
      
      // If not, try to fetch from API if we have a token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Try to get user info from the token or a user endpoint
      // This might need adjustment based on your API
      try {
        const response = await api.get('/auth/user');
        if (response.data.success && response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return response.data.user;
        }
      } catch (error) {
        console.warn('Could not fetch user details from API, using token data');
      }
      
      // Fallback: try to decode the token to get basic user info
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userInfo = {
          id: tokenPayload.id,
          name: tokenPayload.name,
          email: tokenPayload.email,
          role: tokenPayload.role,
          ward_id: tokenPayload.ward_id
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        return userInfo;
      } catch (decodeError) {
        console.error('Failed to decode token:', decodeError);
        throw new Error('Failed to get user information');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },
};