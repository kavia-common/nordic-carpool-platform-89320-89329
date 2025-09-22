import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
const Footer = () => {
  /**
   * Main footer component with links and information
   */
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="row">
            {/* Brand Section */}
            <div className="col-md-4">
              <div className="footer-brand">
                <h3 className="logo">BlablaBil</h3>
                <p className="text-secondary">
                  {t('home.subtitle')}
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-md-2">
              <h4 className="footer-title">{t('nav.home')}</h4>
              <ul className="footer-links">
                <li><Link to="/">{t('nav.home')}</Link></li>
                <li><Link to="/search">{t('nav.search')}</Link></li>
                <li><Link to="/offer">{t('nav.offer')}</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="col-md-2">
              <h4 className="footer-title">{t('nav.support')}</h4>
              <ul className="footer-links">
                <li><Link to="/support">{t('support.contact')}</Link></li>
                <li><Link to="/faq">{t('support.faq')}</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-md-4">
              <h4 className="footer-title">Contact</h4>
              <div className="contact-info">
                <p>Email: support@blablabil.no</p>
                <p>Phone: +47 123 45 678</p>
                <p>Norway</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="text-secondary mb-0">
                  © {currentYear} BlablaBil. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-md-right">
                <div className="social-links">
                  <a href="https://facebook.com/blablabil" aria-label="Facebook" target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href="https://instagram.com/blablabil" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://twitter.com/blablabil" aria-label="Twitter" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: var(--spacing-2xl) 0 var(--spacing-lg) 0;
          margin-top: auto;
        }

        .footer-brand {
          margin-bottom: var(--spacing-lg);
        }

        .footer-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-md);
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: var(--spacing-sm);
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--primary);
        }

        .contact-info p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .footer-bottom {
          border-top: 1px solid var(--border);
          padding-top: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }

        .social-links {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
        }

        .social-links a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .social-links a:hover {
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .social-links {
            justify-content: flex-start;
            margin-top: var(--spacing-md);
          }
          
          .text-md-right {
            text-align: left !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
