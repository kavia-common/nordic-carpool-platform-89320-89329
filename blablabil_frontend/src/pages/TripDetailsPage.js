import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tripAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// PUBLIC_INTERFACE
const TripDetailsPage = () => {
  /**
   * Trip details page showing full trip information
   */
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  const loadTripDetails = useCallback(async () => {
    /**
     * Load trip details from API
     */
    try {
      const response = await tripAPI.getTripById(id);
      setTrip(response.trip);
    } catch (err) {
      setError(err.response?.data?.message || t('error.generic'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    loadTripDetails();
  }, [loadTripDetails]);

  // PUBLIC_INTERFACE
  const handleBookRide = () => {
    /**
     * Handle book ride button click
     */
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: `/booking/${id}` } });
    } else {
      navigate(`/booking/${id}`);
    }
  };

  // PUBLIC_INTERFACE
  const formatTime = (timeString) => {
    /**
     * Format time string for display
     */
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // PUBLIC_INTERFACE
  const formatDate = (dateString) => {
    /**
     * Format date string for display
     */
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {t('error.notFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="trip-details-page">
      <div className="container">
        <div className="trip-header">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-outline"
          >
            ← {t('common.back')}
          </button>
        </div>

        <div className="trip-content">
          <div className="trip-main">
            {/* Route Information */}
            <div className="card">
              <div className="card-header">
                <div className="route-header">
                  <div className="route-cities">
                    <span className="city-name">{trip.fromCity}</span>
                    <span className="route-arrow">→</span>
                    <span className="city-name">{trip.toCity}</span>
                  </div>
                  <div className="trip-date-time">
                    <span className="trip-date">{formatDate(trip.date)}</span>
                    <span className="trip-time">{formatTime(trip.departureTime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <div className="trip-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">{t('trip.duration')}</span>
                    <span className="detail-value">{trip.duration}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">{t('common.seats')}</span>
                    <span className="detail-value">{trip.availableSeats} {t('trip.seats.available')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">{t('common.price')}</span>
                    <span className="detail-value price">{trip.pricePerSeat} NOK</span>
                  </div>
                  {trip.stops && trip.stops.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">{t('trip.stops')}</span>
                      <span className="detail-value">{trip.stops.join(', ')}</span>
                    </div>
                  )}
                </div>

                {trip.description && (
                  <div className="trip-description">
                    <h4>{t('common.description')}</h4>
                    <p>{trip.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Driver Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{t('common.driver')}</h3>
              </div>
              <div className="card-content">
                <div className="driver-info">
                  <div className="driver-avatar">
                    {trip.driver?.profilePicture ? (
                      <img src={trip.driver.profilePicture} alt={trip.driver.firstName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {trip.driver?.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="driver-details">
                    <h4 className="driver-name">{trip.driver?.firstName} {trip.driver?.lastName?.charAt(0)}.</h4>
                    <div className="driver-rating">
                      ⭐ {trip.driver?.rating?.toFixed(1) || 'New'} 
                      {trip.driver?.reviewCount && (
                        <span className="review-count">({trip.driver.reviewCount} reviews)</span>
                      )}
                    </div>
                    <div className="driver-stats">
                      <span>Member since {new Date(trip.driver?.createdAt).getFullYear()}</span>
                      <span>{trip.driver?.tripCount || 0} trips</span>
                    </div>
                    {trip.driver?.bio && (
                      <p className="driver-bio">{trip.driver.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            {trip.vehicle && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">{t('trip.car')}</h3>
                </div>
                <div className="card-content">
                  <div className="vehicle-info">
                    <div className="vehicle-details">
                      <span className="vehicle-make-model">
                        {trip.vehicle.make} {trip.vehicle.model}
                      </span>
                      <span className="vehicle-color">{trip.vehicle.color}</span>
                      {trip.vehicle.licensePlate && (
                        <span className="vehicle-plate">{trip.vehicle.licensePlate}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Travel Preferences */}
            {trip.preferences && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">{t('trip.preferences')}</h3>
                </div>
                <div className="card-content">
                  <div className="preferences-grid">
                    <div className="preference-item">
                      <span className="preference-label">{t('trip.smoking')}</span>
                      <span className={`preference-value ${trip.preferences.smoking ? 'allowed' : 'not-allowed'}`}>
                        {trip.preferences.smoking ? t('trip.allowed') : t('trip.notAllowed')}
                      </span>
                    </div>
                    <div className="preference-item">
                      <span className="preference-label">{t('trip.pets')}</span>
                      <span className={`preference-value ${trip.preferences.pets ? 'allowed' : 'not-allowed'}`}>
                        {trip.preferences.pets ? t('trip.allowed') : t('trip.notAllowed')}
                      </span>
                    </div>
                    <div className="preference-item">
                      <span className="preference-label">{t('trip.music')}</span>
                      <span className={`preference-value ${trip.preferences.music ? 'allowed' : 'not-allowed'}`}>
                        {trip.preferences.music ? t('trip.allowed') : t('trip.notAllowed')}
                      </span>
                    </div>
                    <div className="preference-item">
                      <span className="preference-label">{t('trip.chatty')}</span>
                      <span className="preference-value">
                        {trip.preferences.chatty ? t('trip.sociable') : t('trip.quiet')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="booking-price">
                <span className="price-amount">{trip.pricePerSeat} NOK</span>
                <span className="price-label">per person</span>
              </div>
              
              <div className="booking-info">
                <div className="info-item">
                  <span>{formatDate(trip.date)}</span>
                  <span>{formatTime(trip.departureTime)}</span>
                </div>
                <div className="info-item">
                  <span>{trip.availableSeats} {t('trip.seats.available')}</span>
                </div>
              </div>

              <button 
                onClick={handleBookRide}
                className="btn btn-primary btn-large"
                disabled={trip.availableSeats === 0}
              >
                {trip.availableSeats === 0 ? 'Fully Booked' : t('trip.book')}
              </button>

              <div className="booking-note">
                <small className="text-secondary">
                  Free cancellation up to 24 hours before departure
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .trip-header {
          margin-bottom: var(--spacing-xl);
        }

        .trip-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: var(--spacing-xl);
        }

        .route-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .route-cities {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .city-name {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text);
        }

        .route-arrow {
          font-size: var(--font-size-lg);
          color: var(--text-light);
        }

        .trip-date-time {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--spacing-xs);
        }

        .trip-date {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .trip-time {
          font-weight: 600;
          font-size: var(--font-size-lg);
          color: var(--text);
        }

        .trip-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .detail-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .detail-value {
          font-weight: 600;
          color: var(--text);
        }

        .detail-value.price {
          color: var(--success);
          font-size: var(--font-size-lg);
        }

        .trip-description {
          border-top: 1px solid var(--border-light);
          padding-top: var(--spacing-lg);
        }

        .driver-info {
          display: flex;
          gap: var(--spacing-lg);
        }

        .driver-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .driver-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xl);
          font-weight: 600;
        }

        .driver-details {
          flex: 1;
        }

        .driver-name {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .driver-rating {
          margin-bottom: var(--spacing-sm);
        }

        .review-count {
          color: var(--text-secondary);
          margin-left: var(--spacing-xs);
        }

        .driver-stats {
          display: flex;
          gap: var(--spacing-md);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-sm);
        }

        .driver-bio {
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .vehicle-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .vehicle-make-model {
          font-weight: 600;
          font-size: var(--font-size-lg);
          color: var(--text);
        }

        .vehicle-color,
        .vehicle-plate {
          color: var(--text-secondary);
        }

        .preferences-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg);
        }

        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preference-label {
          color: var(--text-secondary);
        }

        .preference-value {
          font-weight: 500;
        }

        .preference-value.allowed {
          color: var(--success);
        }

        .preference-value.not-allowed {
          color: var(--error);
        }

        .booking-sidebar {
          position: sticky;
          top: var(--spacing-xl);
          height: fit-content;
        }

        .booking-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-md);
        }

        .booking-price {
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }

        .price-amount {
          display: block;
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--success);
        }

        .price-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .booking-info {
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-xs) 0;
        }

        .info-item:not(:last-child) {
          border-bottom: 1px solid var(--border-light);
          margin-bottom: var(--spacing-xs);
          padding-bottom: var(--spacing-xs);
        }

        .booking-note {
          text-align: center;
          margin-top: var(--spacing-md);
        }

        @media (max-width: 768px) {
          .trip-content {
            grid-template-columns: 1fr;
          }

          .route-header {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .trip-details-grid {
            grid-template-columns: 1fr;
          }

          .preferences-grid {
            grid-template-columns: 1fr;
          }

          .driver-info {
            flex-direction: column;
            text-align: center;
          }

          .booking-sidebar {
            position: static;
          }
        }
      `}</style>
    </div>
  );
};

export default TripDetailsPage;
