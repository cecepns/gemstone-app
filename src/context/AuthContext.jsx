// ANCHOR: AuthContext - Global authentication state management for admin login
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { verifyAdminToken } from '../utils/api';

import { AuthContext } from './AuthContext';

// AuthProvider component to wrap the app and provide authentication state
export const AuthProvider = ({ children }) => {
  // State management
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = Boolean(token);

  /**
   * Initialize auth state from localStorage on app startup
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedToken = localStorage.getItem('adminToken');
        const savedAdmin = localStorage.getItem('adminData');

        if (savedToken && savedAdmin) {
          setToken(savedToken);
          setAdmin(JSON.parse(savedAdmin));
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function - save token and admin data
   * @param {string} authToken - JWT token from login response
   * @param {Object} adminData - Admin user data from login response
   */
  const login = useCallback((authToken, adminData = null) => {
    try {
      // Set state
      setToken(authToken);
      setAdmin(adminData);

      // Save to localStorage
      localStorage.setItem('adminToken', authToken);
      if (adminData) {
        localStorage.setItem('adminData', JSON.stringify(adminData));
      }

      console.log('Admin logged in successfully');
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to save login data');
    }
  }, []);

  /**
   * Logout function - clear token and admin data
   */
  const logout = useCallback(() => {
    try {
      // Clear state
      setToken(null);
      setAdmin(null);

      // Clear localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');

      console.log('Admin logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);

  /**
   * Update admin data without affecting token
   * @param {Object} newAdminData - Updated admin data
   */
  const updateAdmin = useCallback((newAdminData) => {
    try {
      setAdmin(newAdminData);
      localStorage.setItem('adminData', JSON.stringify(newAdminData));
    } catch (error) {
      console.error('Error updating admin data:', error);
    }
  }, []);

  /**
   * Check if token is expired (basic check)
   * @returns {boolean} - true if token appears to be expired
   */
  const isTokenExpired = useCallback(() => {
    if (!token) {
      return true;
    }

    try {
      // Decode JWT payload (basic check without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }, [token]);

  /**
   * Get authorization header for API requests
   * @returns {Object} - Authorization header object
   */
  const getAuthHeader = useCallback(() => {
    if (!token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${token}`,
    };
  }, [token]);

  /**
   * Verify token with backend (optional method for token validation)
   * @returns {Promise<boolean>} - true if token is valid
   */
  const verifyToken = useCallback(async() => {
    if (!token) {
      return false;
    }

    try {
      const result = await verifyAdminToken(token);

      // Update admin data if received from verification
      if (result.data && result.data.admin) {
        updateAdmin(result.data.admin);
      }
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      // Token is invalid, logout user
      logout();
      return false;
    }
  }, [token, logout, updateAdmin]);

  // Context value object
  const value = useMemo(() => ({
    // State
    token,
    admin,
    isAuthenticated,
    isLoading,

    // Methods
    login,
    logout,
    updateAdmin,
    isTokenExpired,
    getAuthHeader,
    verifyToken,
  }), [
    token,
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateAdmin,
    isTokenExpired,
    getAuthHeader,
    verifyToken,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
