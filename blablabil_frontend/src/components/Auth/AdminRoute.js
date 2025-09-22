import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

// PUBLIC_INTERFACE
const AdminRoute = ({ children }) => {
  /**
   * Admin route component that requires admin privileges
   */
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner text="Checking authorization..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (!user?.isAdmin) {
    return (
      <div className="unauthorized-page">
        <div className="container">
          <div className="unauthorized-content">
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <a href="/" className="btn btn-primary">
              Go Home
            </a>
          </div>
        </div>

        <style jsx>{`
          .unauthorized-page {
            min-height: 60vh;
            display: flex;
            align-items: center;
            text-align: center;
          }

          .unauthorized-content {
            max-width: 400px;
            margin: 0 auto;
          }

          .unauthorized-content h1 {
            font-size: var(--font-size-2xl);
            font-weight: 600;
            color: var(--error);
            margin-bottom: var(--spacing-lg);
          }

          .unauthorized-content p {
            color: var(--text-secondary);
            margin-bottom: var(--spacing-xl);
          }
        `}</style>
      </div>
    );
  }

  // Render children if admin
  return children;
};

export default AdminRoute;
