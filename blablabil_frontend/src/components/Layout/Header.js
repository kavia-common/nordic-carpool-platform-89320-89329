import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

// PUBLIC_INTERFACE
const Header = () => {
  /**
   * Main header component with navigation and user menu
   */
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // PUBLIC_INTERFACE
  const handleLanguageToggle = () => {
    /**
     * Toggle between Norwegian and English
     */
    const newLang = i18n.language === 'en' ? 'no' : 'en';
    i18n.changeLanguage(newLang);
  };

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    /**
     * Handle user logout
     */
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  // PUBLIC_INTERFACE
  const isActivePath = (path) => {
    /**
     * Check if current path is active
     */
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            BlablaBil
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar d-none d-md-block">
            <ul className="navbar-nav">
              <li>
                <Link 
                  to="/" 
                  className={`nav-link ${isActivePath('/') ? 'active' : ''}`}
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/search" 
                  className={`nav-link ${isActivePath('/search') ? 'active' : ''}`}
                >
                  {t('nav.search')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/offer" 
                  className={`nav-link ${isActivePath('/offer') ? 'active' : ''}`}
                >
                  {t('nav.offer')}
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link 
                    to="/my-rides" 
                    className={`nav-link ${isActivePath('/my-rides') ? 'active' : ''}`}
                  >
                    {t('nav.myRides')}
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  to="/support" 
                  className={`nav-link ${isActivePath('/support') ? 'active' : ''}`}
                >
                  {t('nav.support')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Language Toggle */}
            <button 
              onClick={handleLanguageToggle}
              className="language-toggle"
              aria-label={t('common.language')}
            >
              {i18n.language === 'en' ? 'NO' : 'EN'}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="dropdown">
                  <button className="btn btn-outline dropdown-toggle">
                    {user?.firstName || user?.name || t('nav.profile')}
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      {t('nav.profile')}
                    </Link>
                    <Link to="/my-rides" className="dropdown-item">
                      {t('nav.myRides')}
                    </Link>
                    {user?.isAdmin && (
                      <Link to="/admin" className="dropdown-item">
                        {t('nav.admin')}
                      </Link>
                    )}
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item">
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  {t('nav.signup')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle d-md-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mobile-nav d-md-none">
            <div className="mobile-nav-content">
              <Link 
                to="/" 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                to="/search" 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.search')}
              </Link>
              <Link 
                to="/offer" 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.offer')}
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/my-rides" 
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.myRides')}
                </Link>
              )}
              <Link 
                to="/support" 
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.support')}
              </Link>

              {/* Mobile Auth */}
              {!isAuthenticated ? (
                <div className="mobile-auth">
                  <Link 
                    to="/login" 
                    className="btn btn-outline btn-large"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn btn-primary btn-large"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              ) : (
                <div className="mobile-user-menu">
                  <Link 
                    to="/profile" 
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  {user?.isAdmin && (
                    <Link 
                      to="/admin" 
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="mobile-nav-link text-left"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>

      <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-toggle::after {
          content: '▼';
          margin-left: 0.5rem;
          font-size: 0.8rem;
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          z-index: 1000;
          padding: var(--spacing-sm) 0;
        }

        .dropdown:hover .dropdown-menu {
          display: block;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          color: var(--text);
          text-decoration: none;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: var(--background);
        }

        .dropdown-divider {
          margin: var(--spacing-sm) 0;
          border: none;
          border-top: 1px solid var(--border);
        }

        .mobile-menu-toggle {
          display: flex;
          flex-direction: column;
          gap: 3px;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
        }

        .mobile-menu-toggle span {
          width: 20px;
          height: 2px;
          background: var(--text);
          transition: all 0.3s ease;
        }

        .mobile-nav {
          border-top: 1px solid var(--border);
          padding: var(--spacing-md) 0;
        }

        .mobile-nav-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .mobile-nav-link {
          padding: var(--spacing-sm) 0;
          color: var(--text);
          text-decoration: none;
          border-bottom: 1px solid var(--border-light);
        }

        .mobile-nav-link:hover {
          color: var(--primary);
        }

        .mobile-auth {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
        }

        .mobile-user-menu {
          border-top: 1px solid var(--border);
          padding-top: var(--spacing-md);
          margin-top: var(--spacing-md);
        }

        .auth-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }

        @media (max-width: 768px) {
          .auth-buttons .btn {
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
