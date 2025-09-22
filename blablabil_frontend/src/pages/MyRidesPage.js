import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { tripAPI, bookingAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// PUBLIC_INTERFACE
const MyRidesPage = () => {
  /**
   * Page showing user's rides as both passenger and driver
   */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('passenger');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // PUBLIC_INTERFACE
  const loadUserRides = useCallback(async () => {
    /**
     * Load user's trips and bookings
     */
    setLoading(true);
    try {
      if (activeTab === 'driver') {
        const response = await tripAPI.getUserTrips(user.id, 'driver');
        setTrips(response.trips || []);
      } else {
        const response = await bookingAPI.getUserBookings(user.id);
        setBookings(response.bookings || []);
      }
    } catch (error) {
      showError(error.response?.data?.message || t('error.generic'));
    } finally {
      setLoading(false);
    }
  }, [activeTab, user.id, showError, t]);

  useEffect(() => {
    loadUserRides();
  }, [loadUserRides]);

  // PUBLIC_INTERFACE
  const handleCancelBooking = async (bookingId) => {
    /**
     * Cancel a passenger booking
     */
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.cancelBooking(bookingId);
        showSuccess('Booking cancelled successfully');
        loadUserRides();
      } catch (error) {
        showError(error.response?.data?.message || t('error.generic'));
      }
    }
  };

  // PUBLIC_INTERFACE
  const handleCancelTrip = async (tripId) => {
    /**
     * Cancel a driver trip
     */
    if (window.confirm('Are you sure you want to cancel this trip?')) {
      try {
        await tripAPI.cancelTrip(tripId);
        showSuccess('Trip cancelled successfully');
        loadUserRides();
      } catch (error) {
        showError(error.response?.data?.message || t('error.generic'));
      }
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

  // PUBLIC_INTERFACE
  const getStatusColor = (status) => {
    /**
     * Get color class for booking/trip status
     */
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'text-success';
      case 'cancelled':
        return 'text-error';
      case 'completed':
        return 'text-secondary';
      default:
        return 'text-primary';
    }
  };

  // PUBLIC_INTERFACE
  const filterRides = (rides) => {
    /**
     * Filter rides based on status
     */
    const now = new Date();
    return rides.filter(ride => {
      const rideDate = new Date(ride.trip?.date || ride.date);
      
      switch (statusFilter) {
        case 'upcoming':
          return rideDate >= now && ride.status !== 'cancelled';
        case 'completed':
          return rideDate < now || ride.status === 'completed';
        case 'cancelled':
          return ride.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const currentRides = activeTab === 'driver' ? trips : bookings;
  const filteredRides = filterRides(currentRides);

  return (
    <div className="my-rides-page">
      <div className="container">
        <h1 className="title">{t('myRides.title')}</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'passenger' ? 'active' : ''}`}
            onClick={() => setActiveTab('passenger')}
          >
            {t('myRides.asPassenger')}
          </button>
          <button
            className={`tab-button ${activeTab === 'driver' ? 'active' : ''}`}
            onClick={() => setActiveTab('driver')}
          >
            {t('myRides.asDriver')}
          </button>
        </div>

        {/* Status Filter */}
        <div className="status-filter">
          <button
            className={`filter-button ${statusFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setStatusFilter('upcoming')}
          >
            {t('myRides.upcoming')}
          </button>
          <button
            className={`filter-button ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            {t('myRides.completed')}
          </button>
          <button
            className={`filter-button ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            {t('myRides.cancelled')}
          </button>
        </div>

        {/* Rides List */}
        <div className="rides-container">
          {loading && <LoadingSpinner text={t('common.loading')} />}
          
          {!loading && filteredRides.length === 0 && (
            <div className="no-rides">
              <h3>{t('myRides.noRides')}</h3>
              <p>You don't have any {statusFilter} {activeTab} rides.</p>
              <div className="no-rides-actions">
                {activeTab === 'passenger' ? (
                  <button 
                    onClick={() => navigate('/search')}
                    className="btn btn-primary"
                  >
                    {t('nav.search')}
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/offer')}
                    className="btn btn-primary"
                  >
                    {t('nav.offer')}
                  </button>
                )}
              </div>
            </div>
          )}

          {!loading && filteredRides.length > 0 && (
            <div className="rides-list">
              {filteredRides.map(ride => {
                const trip = ride.trip || ride;
                const isDriver = activeTab === 'driver';
                
                return (
                  <div key={ride.id} className="ride-card">
                    <div className="ride-header">
                      <div className="ride-route">
                        <span className="ride-location">{trip.fromCity}</span>
                        <span className="ride-arrow">→</span>
                        <span className="ride-location">{trip.toCity}</span>
                      </div>
                      <div className={`ride-status ${getStatusColor(ride.status)}`}>
                        {ride.status}
                      </div>
                    </div>

                    <div className="ride-details">
                      <div className="detail-section">
                        <div className="detail-item">
                          <span className="detail-label">{t('common.date')}</span>
                          <span className="detail-value">{formatDate(trip.date)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">{t('common.time')}</span>
                          <span className="detail-value">{formatTime(trip.departureTime)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">{t('common.price')}</span>
                          <span className="detail-value">
                            {isDriver ? `${trip.pricePerSeat} NOK/seat` : `${ride.totalAmount || trip.pricePerSeat} NOK`}
                          </span>
                        </div>
                        {!isDriver && (
                          <div className="detail-item">
                            <span className="detail-label">{t('common.seats')}</span>
                            <span className="detail-value">{ride.seats}</span>
                          </div>
                        )}
                        {isDriver && (
                          <div className="detail-item">
                            <span className="detail-label">Bookings</span>
                            <span className="detail-value">{trip.bookingCount || 0}</span>
                          </div>
                        )}
                      </div>

                      <div className="contact-section">
                        <div className="contact-info">
                          <span className="contact-label">
                            {isDriver ? 'Passengers:' : 'Driver:'}
                          </span>
                          {isDriver ? (
                            <div className="passengers-list">
                              {trip.passengers?.length > 0 ? (
                                trip.passengers.map(passenger => (
                                  <span key={passenger.id} className="passenger-name">
                                    {passenger.firstName}
                                  </span>
                                ))
                              ) : (
                                <span className="text-secondary">No bookings yet</span>
                              )}
                            </div>
                          ) : (
                            <span className="driver-name">
                              {trip.driver?.firstName} {trip.driver?.lastName?.charAt(0)}.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ride-actions">
                      <button
                        onClick={() => navigate(`/trip/${trip.id}`)}
                        className="btn btn-outline btn-small"
                      >
                        View Details
                      </button>
                      
                      {statusFilter === 'upcoming' && (
                        <>
                          {isDriver ? (
                            <>
                              <button
                                onClick={() => navigate(`/offer/edit/${trip.id}`)}
                                className="btn btn-secondary btn-small"
                              >
                                {t('common.edit')}
                              </button>
                              <button
                                onClick={() => handleCancelTrip(trip.id)}
                                className="btn btn-outline btn-small"
                              >
                                {t('myRides.cancelRide')}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleCancelBooking(ride.id)}
                              className="btn btn-outline btn-small"
                            >
                              {t('myRides.cancelBooking')}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .tab-navigation {
          display: flex;
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xs);
          margin-bottom: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
        }

        .tab-button {
          flex: 1;
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          background: none;
          color: var(--text-secondary);
          font-weight: 500;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-button.active {
          background: var(--primary);
          color: white;
        }

        .status-filter {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
        }

        .filter-button {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-button.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .rides-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .ride-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          transition: all 0.3s ease;
        }

        .ride-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .ride-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .ride-route {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .ride-location {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
        }

        .ride-arrow {
          color: var(--text-light);
          font-size: var(--font-size-lg);
        }

        .ride-status {
          font-size: var(--font-size-sm);
          font-weight: 600;
          text-transform: uppercase;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          background: var(--background);
        }

        .ride-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .detail-value {
          font-weight: 500;
          color: var(--text);
        }

        .contact-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .contact-label {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          font-weight: 500;
        }

        .passengers-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .passenger-name,
        .driver-name {
          color: var(--text);
          font-weight: 500;
        }

        .ride-actions {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .no-rides {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        .no-rides h3 {
          color: var(--text);
          margin-bottom: var(--spacing-md);
        }

        .no-rides-actions {
          margin-top: var(--spacing-xl);
        }

        @media (max-width: 768px) {
          .tab-navigation {
            flex-direction: column;
          }

          .status-filter {
            flex-wrap: wrap;
          }

          .ride-details {
            grid-template-columns: 1fr;
          }

          .ride-actions {
            justify-content: center;
          }

          .ride-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MyRidesPage;
