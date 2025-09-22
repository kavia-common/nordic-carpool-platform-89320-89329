import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
const NotFoundPage = () => {
  /**
   * 404 Not Found page component
   */
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-illustration">
            <div className="error-code">404</div>
            <div className="error-icon">🚗💨</div>
          </div>
          
          <div className="not-found-text">
            <h1 className="error-title">{t('error.notFound')}</h1>
            <p className="error-description">
              Sorry, the page you're looking for seems to have taken a detour. 
              Let's get you back on the right route!
            </p>
          </div>

          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-large">
              Go Home
            </Link>
            <Link to="/search" className="btn btn-outline btn-large">
              Search Rides
            </Link>
          </div>

          <div className="helpful-links">
            <h3>Popular Pages</h3>
            <div className="links-grid">
              <Link to="/" className="helpful-link">
                <span className="link-icon">🏠</span>
                <span className="link-text">Home</span>
              </Link>
              <Link to="/search" className="helpful-link">
                <span className="link-icon">🔍</span>
                <span className="link-text">Search Rides</span>
              </Link>
              <Link to="/offer" className="helpful-link">
                <span className="link-icon">➕</span>
                <span className="link-text">Offer Ride</span>
              </Link>
              <Link to="/support" className="helpful-link">
                <span className="link-icon">💬</span>
                <span className="link-text">Support</span>
              </Link>
              <Link to="/faq" className="helpful-link">
                <span className="link-icon">❓</span>
                <span className="link-text">FAQ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          min-height: 80vh;
          display: flex;
          align-items: center;
          background: var(--gradient-bg);
          padding: var(--spacing-2xl) 0;
        }

        .not-found-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .not-found-illustration {
          margin-bottom: var(--spacing-2xl);
        }

        .error-code {
          font-size: 8rem;
          font-weight: 900;
          color: var(--primary);
          line-height: 1;
          margin-bottom: var(--spacing-md);
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-lg);
        }

        .not-found-text {
          margin-bottom: var(--spacing-2xl);
        }

        .error-title {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--spacing-lg);
        }

        .error-description {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--spacing-xl);
        }

        .not-found-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          margin-bottom: var(--spacing-2xl);
          flex-wrap: wrap;
        }

        .helpful-links {
          background: var(--surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .helpful-links h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-lg);
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--spacing-md);
        }

        .helpful-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--text);
          transition: all 0.3s ease;
        }

        .helpful-link:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
          color: var(--primary);
        }

        .link-icon {
          font-size: var(--font-size-xl);
        }

        .link-text {
          font-weight: 500;
          font-size: var(--font-size-sm);
        }

        @media (max-width: 768px) {
          .error-code {
            font-size: 6rem;
          }

          .error-title {
            font-size: var(--font-size-2xl);
          }

          .not-found-actions {
            flex-direction: column;
            align-items: center;
          }

          .not-found-actions .btn {
            width: 100%;
            max-width: 300px;
          }

          .links-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
