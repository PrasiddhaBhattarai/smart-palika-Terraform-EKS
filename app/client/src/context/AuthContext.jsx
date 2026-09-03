import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

 const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Try to get user data from localStorage first
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } else {
          // If not in localStorage, try to fetch from API
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            // If API fails, try to decode the token
            try {
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              const userInfo = {
                id: tokenPayload.id,
                name: tokenPayload.name,
                email: tokenPayload.email,
                role: tokenPayload.role,
                ward_id: tokenPayload.ward_id
              };
              setUser(userInfo);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(userInfo));
            } catch (decodeError) {
              console.error('Failed to decode token:', decodeError);
              localStorage.removeItem('authToken');
            }
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };
// Add to your src/context/AuthContext.js file
const updateProfileImage = async (imageFile) => {
  try {
    setLoading(true);
    const response = await authService.updateProfileImage(imageFile);
    
    if (response.success) {
      setUser(response.user);
      toast.success('Profile image updated successfully!');
      return { success: true, user: response.user };
    }
  } catch (error) {
    const message = error.message || 'Failed to update profile image';
    toast.error(message);
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

const removeProfileImage = async () => {
  try {
    setLoading(true);
    const response = await authService.removeProfileImage();
    
    if (response.success) {
      setUser(response.user);
      toast.success('Profile image removed successfully!');
      return { success: true, user: response.user };
    }
  } catch (error) {
    const message = error.message || 'Failed to remove profile image';
    toast.error(message);
    return { success: false, message };
  } finally {
    setLoading(false);
  }
};

  const login = async (email, password) => {
     try {
    setLoading(true);
    const response = await authService.login(email, password);
    
    if (response.success) {
      // Make sure we're storing ALL user data including ward_id
      const userData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        ward_id: response.user.ward_id // Ensure this is included
      };
      
      setUser(userData);
      console.log('Logged in user data:', userData);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData)); // Store complete user data
      toast.success('Login successful!', { duration: 2000 });
     return { success: true, user: userData };

    }
  } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        toast.success('Verification code sent to your email!');
        return { success: true, email: userData.email };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email, code) => {
    try {
      setLoading(true);
      const response = await authService.verifyEmail(email, code);
      
      if (response.success) {
        toast.success('Email verified successfully! You can now login.');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      toast.success('Logged out successfully');
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      const response = await authService.requestPasswordReset(email);
      
      if (response.success) {
        toast.success('Reset code sent to your email!');
        return { success: true, email };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset request failed.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    try {
      setLoading(true);
      const response = await authService.resetPassword(email, code, newPassword);
      
      if (response.success) {
        toast.success('Password reset successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      const response = await authService.changePassword(oldPassword, newPassword);
      
      if (response.success) {
        toast.success('Password changed successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    logout,
    requestPasswordReset,
    resetPassword,
    changePassword,
      updateProfileImage, // Add this
  removeProfileImage, // Add this
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};