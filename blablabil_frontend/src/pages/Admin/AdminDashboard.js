import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// PUBLIC_INTERFACE
const AdminDashboard = () => {
  /**
   * Admin dashboard main component
   */
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  // PUBLIC_INTERFACE
  const loadDashboardStats = async () => {
    /**
     * Load admin dashboard statistics
     */
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.stats || {});
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Use mock data for demo
      setStats({
        totalUsers: 1247,
        activeTrips: 89,
        monthlyBookings: 456,
        revenue: 15680
      });
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const getActiveTab = () => {
    /**
     * Get active tab based on current route
     */
    const path = location.pathname.split('/')[2];
    return path || 'overview';
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <div className="admin-dashboard">
      <div className="container-fluid">
        <div className="admin-header">
          <h1 className="admin-title">{t('admin.title')}</h1>
          <p className="admin-subtitle">Welcome back, {user?.firstName}</p>
        </div>

        <div className="admin-layout">
          {/* Sidebar Navigation */}
          <div className="admin-sidebar">
            <nav className="admin-nav">
              <Link 
                to="/admin" 
                className={`nav-item ${getActiveTab() === 'overview' ? 'active' : ''}`}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-label">Overview</span>
              </Link>
              <Link 
                to="/admin/users" 
                className={`nav-item ${getActiveTab() === 'users' ? 'active' : ''}`}
              >
                <span className="nav-icon">👥</span>
                <span className="nav-label">{t('admin.users')}</span>
              </Link>
              <Link 
                to="/admin/trips" 
                className={`nav-item ${getActiveTab() === 'trips' ? 'active' : ''}`}
              >
                <span className="nav-icon">🚗</span>
                <span className="nav-label">{t('admin.trips')}</span>
              </Link>
              <Link 
                to="/admin/bookings" 
                className={`nav-item ${getActiveTab() === 'bookings' ? 'active' : ''}`}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-label">{t('admin.bookings')}</span>
              </Link>
              <Link 
                to="/admin/payments" 
                className={`nav-item ${getActiveTab() === 'payments' ? 'active' : ''}`}
              >
                <span className="nav-icon">💳</span>
                <span className="nav-label">{t('admin.payments')}</span>
              </Link>
              <Link 
                to="/admin/support" 
                className={`nav-item ${getActiveTab() === 'support' ? 'active' : ''}`}
              >
                <span className="nav-icon">🎧</span>
                <span className="nav-label">{t('admin.support')}</span>
              </Link>
              <Link 
                to="/admin/analytics" 
                className={`nav-item ${getActiveTab() === 'analytics' ? 'active' : ''}`}
              >
                <span className="nav-icon">📈</span>
                <span className="nav-label">{t('admin.analytics')}</span>
              </Link>
              <Link 
                to="/admin/settings" 
                className={`nav-item ${getActiveTab() === 'settings' ? 'active' : ''}`}
              >
                <span className="nav-icon">⚙️</span>
                <span className="nav-label">{t('admin.settings')}</span>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="admin-content">
            <Routes>
              <Route path="/" element={<AdminOverview stats={stats} />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/trips" element={<AdminTrips />} />
              <Route path="/bookings" element={<AdminBookings />} />
              <Route path="/payments" element={<AdminPayments />} />
              <Route path="/support" element={<AdminSupport />} />
              <Route path="/analytics" element={<AdminAnalytics />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-header {
          margin-bottom: var(--spacing-xl);
        }

        .admin-title {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .admin-subtitle {
          color: var(--text-secondary);
          font-size: var(--font-size-lg);
        }

        .admin-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: var(--spacing-xl);
          min-height: calc(100vh - 200px);
        }

        .admin-sidebar {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          height: fit-content;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: var(--spacing-xl);
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .nav-item:hover {
          background: var(--background);
          color: var(--text);
        }

        .nav-item.active {
          background: var(--primary);
          color: white;
        }

        .nav-icon {
          font-size: var(--font-size-lg);
          flex-shrink: 0;
        }

        .nav-label {
          font-size: var(--font-size-base);
        }

        .admin-content {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 768px) {
          .admin-layout {
            grid-template-columns: 1fr;
          }

          .admin-sidebar {
            position: static;
            order: 2;
          }

          .admin-nav {
            flex-direction: row;
            overflow-x: auto;
            gap: var(--spacing-sm);
          }

          .nav-item {
            flex-shrink: 0;
            flex-direction: column;
            gap: var(--spacing-xs);
            padding: var(--spacing-sm);
            min-width: 80px;
            text-align: center;
          }

          .nav-label {
            font-size: var(--font-size-xs);
          }
        }
      `}</style>
    </div>
  );
};

// Admin Overview Component
const AdminOverview = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="admin-overview">
      <h2 className="page-title">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalUsers?.toLocaleString() || '0'}</h3>
            <p className="stat-label">{t('admin.totalUsers')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.activeTrips?.toLocaleString() || '0'}</h3>
            <p className="stat-label">{t('admin.activeTrips')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.monthlyBookings?.toLocaleString() || '0'}</h3>
            <p className="stat-label">{t('admin.monthlyBookings')}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.revenue?.toLocaleString() || '0'} NOK</h3>
            <p className="stat-label">{t('admin.revenue')}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/admin/users" className="action-card">
            <span className="action-icon">👥</span>
            <span className="action-label">Manage Users</span>
          </Link>
          <Link to="/admin/trips" className="action-card">
            <span className="action-icon">🚗</span>
            <span className="action-label">View Trips</span>
          </Link>
          <Link to="/admin/support" className="action-card">
            <span className="action-icon">🎧</span>
            <span className="action-label">Support Tickets</span>
          </Link>
          <Link to="/admin/analytics" className="action-card">
            <span className="action-icon">📈</span>
            <span className="action-label">View Analytics</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .page-title {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xl);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .stat-card {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--background);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          align-items: center;
        }

        .stat-icon {
          font-size: var(--font-size-3xl);
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .stat-label {
          color: var(--text-secondary);
          font-weight: 500;
          margin: 0;
        }

        .quick-actions h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-lg);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-xl);
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: var(--text);
          transition: all 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .action-icon {
          font-size: var(--font-size-2xl);
        }

        .action-label {
          font-weight: 500;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

// Placeholder components for other admin sections
const AdminUsers = () => (
  <div>
    <h2>User Management</h2>
    <p>User management interface will be implemented here.</p>
  </div>
);

const AdminTrips = () => (
  <div>
    <h2>Trip Management</h2>
    <p>Trip management interface will be implemented here.</p>
  </div>
);

const AdminBookings = () => (
  <div>
    <h2>Booking Management</h2>
    <p>Booking management interface will be implemented here.</p>
  </div>
);

const AdminPayments = () => (
  <div>
    <h2>Payment Management</h2>
    <p>Payment management interface will be implemented here.</p>
  </div>
);

const AdminSupport = () => (
  <div>
    <h2>Support Management</h2>
    <p>Support ticket management interface will be implemented here.</p>
  </div>
);

const AdminAnalytics = () => (
  <div>
    <h2>Analytics</h2>
    <p>Analytics and reporting interface will be implemented here.</p>
  </div>
);

const AdminSettings = () => (
  <div>
    <h2>System Settings</h2>
    <p>System settings interface will be implemented here.</p>
  </div>
);

export default AdminDashboard;
