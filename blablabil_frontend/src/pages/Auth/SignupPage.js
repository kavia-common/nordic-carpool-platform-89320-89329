import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

// PUBLIC_INTERFACE
const SignupPage = () => {
  /**
   * Signup page component
   */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    /**
     * Handle form input changes
     */
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    if (error) {
      clearError();
    }
  };

  // PUBLIC_INTERFACE
  const validateForm = () => {
    /**
     * Validate signup form
     */
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    /**
     * Handle signup form submission
     */
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      };

      const result = await register(userData);
      
      if (result.success) {
        showSuccess('Account created successfully! Welcome to BlablaBil.');
        navigate('/profile'); // Redirect to complete profile
      } else {
        showError(result.error || 'Registration failed');
      }
    } catch (err) {
      showError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">{t('auth.signup')}</h1>
              <p className="auth-subtitle">Join the BlablaBil community</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('profile.firstName')}</label>
                  <input
                    type="text"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                  {errors.firstName && (
                    <span className="form-error">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">{t('profile.lastName')}</label>
                  <input
                    type="text"
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                  {errors.lastName && (
                    <span className="form-error">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('common.email')}</label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">{t('common.phone')}</label>
                <input
                  type="tel"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+47 123 45 678"
                  required
                />
                {errors.phone && (
                  <span className="form-error">{errors.phone}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  {errors.password && (
                    <span className="form-error">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">{t('auth.confirmPassword')}</label>
                  <input
                    type="password"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  {errors.confirmPassword && (
                    <span className="form-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  {t('auth.agreeTerms')}
                </label>
                {errors.agreeTerms && (
                  <span className="form-error">{errors.agreeTerms}</span>
                )}
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
                {loading ? t('common.loading') : t('auth.signup')}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login" className="auth-link">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-info">
            <h2>Start Your Journey Today</h2>
            <div className="signup-benefits">
              <div className="benefit">
                <div className="benefit-icon">🚗</div>
                <div className="benefit-content">
                  <h3>Find Rides</h3>
                  <p>Search and book rides across Norway with verified drivers</p>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">💰</div>
                <div className="benefit-content">
                  <h3>Save Money</h3>
                  <p>Split travel costs and save up to 70% on your journeys</p>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">🌱</div>
                <div className="benefit-content">
                  <h3>Go Green</h3>
                  <p>Reduce carbon emissions by sharing rides with others</p>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">👥</div>
                <div className="benefit-content">
                  <h3>Meet People</h3>
                  <p>Connect with fellow travelers and make new friends</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .signup-page {
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
          max-width: 1200px;
          margin: 0 auto;
          align-items: start;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .form-input.error {
          border-color: var(--error);
        }

        .form-error {
          color: var(--error);
          font-size: var(--font-size-sm);
          margin-top: var(--spacing-xs);
          display: block;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          color: var(--text);
          line-height: 1.5;
        }

        .checkbox-label input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border);
          border-radius: var(--radius-sm);
          position: relative;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkmark {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
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

        .signup-benefits {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }

        .benefit {
          display: flex;
          gap: var(--spacing-md);
          align-items: flex-start;
        }

        .benefit-icon {
          font-size: var(--font-size-2xl);
          flex-shrink: 0;
        }

        .benefit-content h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .benefit-content p {
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
            gap: var(--spacing-xl);
          }

          .auth-info {
            order: -1;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .auth-title {
            font-size: var(--font-size-2xl);
          }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
