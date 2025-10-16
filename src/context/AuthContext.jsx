import React, { createContext, useState, useContext, useEffect } from 'react';
import { getValidToken, clearAuthData, setAuthData } from '../utils/authUtils';
import setupAxiosInterceptors from '../utils/axiosInterceptors';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    console.log("🚀 AuthContext useEffect - initializing auth state");
    
    // Set up axios interceptors
    setupAxiosInterceptors(logout);

    // Check if user is logged in on mount
    const storedToken = getValidToken();
    const storedRole = localStorage.getItem('role');
    const storedUserData = localStorage.getItem('userData');

    console.log("🔍 AuthContext init - stored data:", {
      token: storedToken ? `${storedToken.substring(0, 20)}...` : "No token",
      role: storedRole,
      userData: storedUserData ? JSON.parse(storedUserData) : "No data"
    });

    if (storedToken && storedRole && storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setToken(storedToken);
        setUser({
          role: storedRole,
          data: userData
        });
        console.log("✅ AuthContext init - user restored from storage");
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        clearAuthData();
      }
    } else if (storedToken === null && (storedRole || storedUserData)) {
      // Token was invalid, clear all auth data
      console.log("🗑️ AuthContext init - clearing invalid auth data");
      clearAuthData();
    }
    setLoading(false);
    console.log("🏁 AuthContext init - completed");
  }, []);

  const login = (token, role, userData) => {
    console.log("AuthContext login - storing:", { token: token ? `${token.substring(0, 20)}...` : "No token", role, userData });
    
    try {
      setAuthData(token, role, userData);
      setToken(token);
      setUser({ role, data: userData });
      
      console.log("AuthContext login - localStorage after store:", {
        token: localStorage.getItem('token') ? `${localStorage.getItem('token').substring(0, 20)}...` : "No token",
        role: localStorage.getItem('role'),
        userData: localStorage.getItem('userData')
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const isAuthenticated = () => {
    const result = !!token;
    console.log("AuthContext isAuthenticated check:", { 
      hasToken: !!token, 
      tokenValue: token ? `${token.substring(0, 20)}...` : "No token",
      user: user,
      result: result
    });
    return result;
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const userRole = user.role.toUpperCase();
    const required = requiredRole.toUpperCase();
    
    // Super admin has access to everything
    if (userRole === 'SUPER_ADMIN') return true;
    
    // Admin has access to admin and student pages
    if (userRole === 'ADMIN' && (required === 'ADMIN' || required === 'STUDENT')) return true;
    
    // Student only has access to student pages
    if (userRole === 'STUDENT' && required === 'STUDENT') return true;
    
    return false;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
