import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
const HomePage = () => {
  /**
   * Home page component with hero section and features
   */
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title">{t('home.title')}</h1>
            <p className="hero-subtitle">{t('home.subtitle')}</p>
            <p className="hero-description">{t('home.description')}</p>
            
            <div className="hero-actions">
              <Link to="/search" className="btn btn-primary btn-large">
                {t('home.searchRides')}
              </Link>
              <Link to="/offer" className="btn btn-outline btn-large">
                {t('home.offerRide')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="container">
          <h2 className="title">{t('home.howItWorks')}</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-icon">🔍</div>
                <h3 className="step-title">{t('home.step1.title')}</h3>
                <p className="step-description">{t('home.step1.description')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-icon">📅</div>
                <h3 className="step-title">{t('home.step2.title')}</h3>
                <p className="step-description">{t('home.step2.description')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-card text-center">
                <div className="step-icon">🚗</div>
                <h3 className="step-title">{t('home.step3.title')}</h3>
                <p className="step-description">{t('home.step3.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section benefits-section">
        <div className="container">
          <h2 className="title">{t('home.benefits.title')}</h2>
          <div className="row">
            <div className="col-md-3">
              <div className="benefit-card text-center">
                <div className="benefit-icon">💰</div>
                <h3 className="benefit-title">{t('home.benefits.cost')}</h3>
                <p className="benefit-description">{t('home.benefits.cost.desc')}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="benefit-card text-center">
                <div className="benefit-icon">🌱</div>
                <h3 className="benefit-title">{t('home.benefits.environment')}</h3>
                <p className="benefit-description">{t('home.benefits.environment.desc')}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="benefit-card text-center">
                <div className="benefit-icon">👥</div>
                <h3 className="benefit-title">{t('home.benefits.social')}</h3>
                <p className="benefit-description">{t('home.benefits.social.desc')}</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="benefit-card text-center">
                <div className="benefit-icon">🛡️</div>
                <h3 className="benefit-title">{t('home.benefits.safe')}</h3>
                <p className="benefit-description">{t('home.benefits.safe.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content text-center">
            <h2 className="cta-title">Ready to start your journey?</h2>
            <p className="cta-description">Join thousands of travelers using BlablaBil</p>
            <Link to="/signup" className="btn btn-primary btn-large">
              {t('nav.signup')}
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          background: var(--gradient-bg);
          padding: var(--spacing-2xl) 0;
          text-align: center;
        }

        .hero-title {
          font-size: var(--font-size-4xl);
          font-weight: 700;
          color: var(--text);
          margin-bottom: var(--spacing-md);
        }

        .hero-subtitle {
          font-size: var(--font-size-xl);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-lg);
        }

        .hero-description {
          font-size: var(--font-size-lg);
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .step-card,
        .benefit-card {
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-lg);
        }

        .step-icon,
        .benefit-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-md);
        }

        .step-title,
        .benefit-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-sm);
        }

        .step-description,
        .benefit-description {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .benefits-section {
          background: var(--surface);
        }

        .cta-section {
          background: var(--primary);
          color: white;
        }

        .cta-title {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          margin-bottom: var(--spacing-md);
          color: white;
        }

        .cta-description {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-xl);
          color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: var(--font-size-3xl);
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .hero-actions .btn {
            width: 100%;
            max-width: 300px;
          }

          .cta-title {
            font-size: var(--font-size-2xl);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
