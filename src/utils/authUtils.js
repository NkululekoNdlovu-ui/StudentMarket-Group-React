// Utility functions for authentication and token management

export const clearAuthData = () => {
  console.log("🗑️ clearAuthData called - clearing all auth data");
  console.log("📊 Before clearing - Token exists:", !!localStorage.getItem('token'));
  console.log("📊 Before clearing - Role:", localStorage.getItem('role'));
  
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userData');
  localStorage.removeItem('studentId');
  localStorage.removeItem('adminId');
  localStorage.removeItem('superAdminId');
  
  // Clear session storage as well
  sessionStorage.clear();
  
  console.log("🗑️ clearAuthData completed - all data cleared");
};

export const isValidToken = (token) => {
  console.log("isValidToken - validating token:", token ? `${token.substring(0, 20)}...` : "No token");
  
  if (!token || typeof token !== 'string') {
    console.log("isValidToken - token is null or not string");
    return false;
  }
  
  // Basic JWT format check (should have 3 parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.warn('Invalid JWT token format: expected 3 parts, got', parts.length);
    return false;
  }
  
  try {
    // Check if token is expired (basic check without verification)
    const payload = JSON.parse(atob(parts[1]));
    console.log("isValidToken - parsed payload:", payload);
    
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      console.warn('JWT token is expired');
      return false;
    }
    
    // More flexible claim checking - just check if it has the basic structure
    if (!payload.sub && !payload.email) {
      console.warn('JWT token missing subject/email');
      return false;
    }
    
    if (!payload.role) {
      console.warn('JWT token missing role');
      return false;
    }
    
    console.log("isValidToken - token is valid");
    
  } catch (error) {
    console.warn('Error parsing JWT token:', error);
    return false;
  }
  
  return true;
};

export const getValidToken = () => {
  const token = localStorage.getItem('token');
  
  console.log("getValidToken - checking token:", token ? `${token.substring(0, 20)}...` : "No token");
  
  if (!isValidToken(token)) {
    console.warn('Invalid token found in localStorage, clearing auth data');
    clearAuthData();
    return null;
  }
  
  console.log("getValidToken - token is valid");
  return token;
};

export const setAuthData = (token, role, userData) => {
  console.log("setAuthData called with:", { 
    token: token ? `${token.substring(0, 20)}...` : "No token",
    role,
    userData 
  });
  
  // Store the data first, then validate
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('userData', JSON.stringify(userData));
  
  console.log("setAuthData - data stored in localStorage");
  
  // Validate token after storage (for debugging)
  if (!isValidToken(token)) {
    console.warn('Token validation failed during setAuthData, but data was still stored');
    // Don't throw error during login - let the app work and debug separately
  }
  
  // Store individual IDs for backward compatibility
  if (userData.studentId) {
    localStorage.setItem('studentId', userData.studentId);
  }
  if (userData.administratorId) {
    localStorage.setItem('adminId', userData.administratorId);
  }
  if (userData.superAdminId) {
    localStorage.setItem('superAdminId', userData.superAdminId);
  }
};

// Additional security utilities
export const isTokenNearExpiry = (token, thresholdMinutes = 15) => {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    
    return timeUntilExpiry < (thresholdMinutes * 60);
  } catch (error) {
    console.warn('Error checking token expiry:', error);
    return true; // Assume near expiry if we can't determine
  }
};

export const getUserRoleFromToken = (token) => {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload.role;
  } catch (error) {
    console.warn('Error extracting role from token:', error);
    return null;
  }
};

export const validateUserAction = (requiredRole, currentUserRole) => {
  const roleHierarchy = {
    'STUDENT': 1,
    'ADMIN': 2,
    'SUPER_ADMIN': 3
  };
  
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  const currentLevel = roleHierarchy[currentUserRole] || 0;
  
  return currentLevel >= requiredLevel;
};

// Security validation for sensitive operations
export const validateSensitiveOperation = (operation, userRole, token) => {
  // Check if token is still valid
  if (!isValidToken(token)) {
    throw new Error('Invalid or expired token for sensitive operation');
  }
  
  // Check if token is too old for sensitive operations (1 hour threshold)
  const tokenAge = getTokenAge(token);
  if (tokenAge > 3600000) { // 1 hour in milliseconds
    throw new Error('Token too old for sensitive operation. Please re-authenticate.');
  }
  
  // Validate role permissions for specific operations
  const operationPermissions = {
    'CREATE_PRODUCT': ['STUDENT'],
    'DELETE_PRODUCT': ['ADMIN', 'SUPER_ADMIN'],
    'UPDATE_PRODUCT': ['STUDENT'],
    'MAKE_PURCHASE': ['STUDENT'],
    'DELETE_USER': ['ADMIN', 'SUPER_ADMIN'],
    'VIEW_ALL_USERS': ['ADMIN', 'SUPER_ADMIN']
  };
  
  const allowedRoles = operationPermissions[operation];
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    throw new Error(`Insufficient permissions for operation: ${operation}`);
  }
  
  return true;
};

const getTokenAge = (token) => {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    const issuedAt = payload.iat * 1000; // Convert to milliseconds
    return Date.now() - issuedAt;
  } catch (error) {
    console.warn('Error calculating token age:', error);
    return Infinity; // Assume very old if we can't determine
  }
};