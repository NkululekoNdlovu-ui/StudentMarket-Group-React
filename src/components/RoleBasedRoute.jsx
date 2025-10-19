import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has any of the allowed roles
  const hasPermission = allowedRoles.some(role => hasRole(role));

  if (!hasPermission) {
    // Redirect based on user's actual role
    const userRole = user?.role?.toUpperCase();
    
    if (userRole === 'SUPER_ADMIN') {
      return <Navigate to="/superadmin-dashboard" replace />;
    } else if (userRole === 'ADMIN') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (userRole === 'STUDENT') {
      return <Navigate to="/home" replace />;
    }
    
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoute;
