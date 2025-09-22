import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

// PUBLIC_INTERFACE
const ProtectedRoute = ({ children }) => {
  /**
   * Protected route component that requires authentication
   */
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ returnTo: location.pathname + location.search }}
        replace 
      />
    );
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
