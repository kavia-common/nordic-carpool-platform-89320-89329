import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

// PUBLIC_INTERFACE
const LoginPage = () => {
  /**
   * Login page component
   */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Get return URL from location state
  const returnTo = location.state?.returnTo || '/';

  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    /**
     * Handle form input changes
     */
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) {
      clearError();
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    /**
     * Handle login form submission
     */
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.phone, formData.password);
      
      if (result.success) {
        showSuccess('Login successful!');
        navigate(returnTo);
      } else {
        showError(result.error || 'Login failed');
      }
    } catch (err) {
      showError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">{t('auth.login')}</h1>
              <p className="auth-subtitle">Welcome back to BlablaBil</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">{t('common.phone')}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+47 123 45 678"
                  required
                />
                <small className="form-hint">
                  {t('auth.loginWithPhone')}
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('auth.login')}
              </button>

              <div className="auth-links">
                <Link to="/forgot-password" className="auth-link">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </form>

            <div className="auth-footer">
              <p>
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/signup" className="auth-link">
                  {t('auth.signup')}
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <h2>Join the BlablaBil Community</h2>
            <ul className="auth-benefits">
              <li>🚗 Find affordable rides across Norway</li>
              <li>👥 Meet like-minded travelers</li>
              <li>🌱 Reduce your carbon footprint</li>
              <li>💰 Save money on travel costs</li>
              <li>🛡️ Safe and verified community</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: var(--gradient-bg);
          padding: var(--spacing-xl) 0;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-2xl);
          max-width: 1000px;
          margin: 0 auto;
          align-items: center;
        }

        .auth-card {
          background: var(--surface);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-lg);
        }

        .auth-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .auth-title {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--spacing-sm);
        }

        .auth-subtitle {
          color: var(--text-secondary);
          font-size: var(--font-size-lg);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .form-hint {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-top: var(--spacing-xs);
        }

        .auth-links {
          text-align: center;
        }

        .auth-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .auth-link:hover {
          color: var(--text);
        }

        .auth-footer {
          text-align: center;
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .auth-info {
          padding: var(--spacing-xl);
        }

        .auth-info h2 {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xl);
        }

        .auth-benefits {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .auth-benefits li {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md) 0;
          color: var(--text-secondary);
          font-size: var(--font-size-lg);
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
            gap: var(--spacing-xl);
          }

          .auth-info {
            order: -1;
            text-align: center;
          }

          .auth-title {
            font-size: var(--font-size-2xl);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
