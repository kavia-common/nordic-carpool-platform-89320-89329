import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tripAPI, bookingAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// PUBLIC_INTERFACE
const BookingPage = () => {
  /**
   * Booking page for passengers to book trips
   */
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    seats: 1,
    paymentMethod: 'vipps',
    passengerNotes: '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || ''
  });

  // PUBLIC_INTERFACE
  const loadTripDetails = useCallback(async () => {
    /**
     * Load trip details for booking
     */
    try {
      const response = await tripAPI.getTripById(tripId);
      setTrip(response.trip);
    } catch (err) {
      setError(err.response?.data?.message || t('error.generic'));
    } finally {
      setLoading(false);
    }
  }, [tripId, t]);

  useEffect(() => {
    loadTripDetails();
  }, [loadTripDetails]);

  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    /**
     * Handle booking form input changes
     */
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // PUBLIC_INTERFACE
  const calculateTotal = () => {
    /**
     * Calculate total booking cost
     */
    const tripCost = trip.pricePerSeat * bookingData.seats;
    const bookingFee = Math.round(tripCost * 0.05); // 5% booking fee
    return {
      tripCost,
      bookingFee,
      total: tripCost + bookingFee
    };
  };

  // PUBLIC_INTERFACE
  const handleBookingSubmit = async (e) => {
    /**
     * Submit booking request
     */
    e.preventDefault();
    setBookingLoading(true);

    try {
      const booking = {
        tripId: trip.id,
        passengerId: user.id,
        seats: bookingData.seats,
        paymentMethod: bookingData.paymentMethod,
        notes: bookingData.passengerNotes,
        contactPhone: bookingData.contactPhone,
        contactEmail: bookingData.contactEmail,
        totalAmount: calculateTotal().total
      };

      await bookingAPI.createBooking(booking);
      
      showSuccess(t('booking.success'));
      navigate('/my-rides');
    } catch (error) {
      showError(error.response?.data?.message || t('error.generic'));
    } finally {
      setBookingLoading(false);
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

  if (error || !trip) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error || t('error.notFound')}
        </div>
      </div>
    );
  }

  const pricing = calculateTotal();

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <button 
            onClick={() => navigate(`/trip/${tripId}`)}
            className="btn btn-outline"
          >
            ← {t('common.back')}
          </button>
          <h1 className="title">{t('booking.title')}</h1>
        </div>

        <div className="booking-content">
          {/* Trip Summary */}
          <div className="trip-summary">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Trip Summary</h3>
              </div>
              <div className="card-content">
                <div className="trip-route">
                  <span className="trip-location">{trip.fromCity}</span>
                  <span className="trip-arrow">→</span>
                  <span className="trip-location">{trip.toCity}</span>
                </div>
                
                <div className="trip-details">
                  <div className="detail-row">
                    <span className="detail-label">{t('common.date')}</span>
                    <span className="detail-value">{formatDate(trip.date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Departure</span>
                    <span className="detail-value">{formatTime(trip.departureTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t('trip.duration')}</span>
                    <span className="detail-value">{trip.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t('common.driver')}</span>
                    <span className="detail-value">{trip.driver?.firstName}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-form-section">
            <form onSubmit={handleBookingSubmit} className="booking-form">
              {/* Passenger Details */}
              <div className="form-section">
                <h3 className="section-title">{t('booking.passengerDetails')}</h3>
                
                <div className="form-group">
                  <label className="form-label">Number of seats</label>
                  <select
                    className="form-select"
                    value={bookingData.seats}
                    onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                    required
                  >
                    {Array.from({ length: Math.min(trip.availableSeats, 4) }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes for driver (optional)</label>
                  <textarea
                    className="form-textarea"
                    value={bookingData.passengerNotes}
                    onChange={(e) => handleInputChange('passengerNotes', e.target.value)}
                    placeholder="Any special requests or information for the driver..."
                  ></textarea>
                </div>
              </div>

              {/* Contact Information */}
              <div className="form-section">
                <h3 className="section-title">{t('booking.contactInfo')}</h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">{t('common.phone')}</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={bookingData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">{t('common.email')}</label>
                      <input
                        type="email"
                        className="form-input"
                        value={bookingData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3 className="section-title">{t('booking.payment')}</h3>
                
                <div className="payment-methods">
                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vipps"
                      checked={bookingData.paymentMethod === 'vipps'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <div className="payment-option">
                      <div className="payment-icon">📱</div>
                      <div className="payment-info">
                        <span className="payment-name">{t('booking.vipps')}</span>
                        <span className="payment-description">Pay securely with Vipps</span>
                      </div>
                    </div>
                  </label>

                  <label className="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={bookingData.paymentMethod === 'cash'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                    <div className="payment-option">
                      <div className="payment-icon">💰</div>
                      <div className="payment-info">
                        <span className="payment-name">{t('booking.cash')}</span>
                        <span className="payment-description">Pay driver directly in cash</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <h3 className="section-title">Price Breakdown</h3>
                
                <div className="price-item">
                  <span>Trip cost ({bookingData.seats} seat{bookingData.seats > 1 ? 's' : ''})</span>
                  <span>{pricing.tripCost} NOK</span>
                </div>
                <div className="price-item">
                  <span>{t('booking.bookingFee')}</span>
                  <span>{pricing.bookingFee} NOK</span>
                </div>
                <div className="price-item total">
                  <span>{t('booking.total')}</span>
                  <span>{pricing.total} NOK</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={bookingLoading || trip.availableSeats < bookingData.seats}
              >
                {bookingLoading ? t('common.loading') : t('booking.confirmBooking')}
              </button>

              <div className="booking-terms">
                <small className="text-secondary">
                  By booking this ride, you agree to our Terms of Service and Privacy Policy.
                  Free cancellation up to 24 hours before departure.
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .booking-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .booking-content {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: var(--spacing-xl);
        }

        .trip-summary {
          position: sticky;
          top: var(--spacing-xl);
          height: fit-content;
        }

        .trip-route {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .trip-location {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
        }

        .trip-arrow {
          color: var(--text-light);
          font-size: var(--font-size-lg);
        }

        .trip-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          color: var(--text-secondary);
        }

        .detail-value {
          font-weight: 500;
          color: var(--text);
        }

        .booking-form {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-md);
        }

        .form-section {
          margin-bottom: var(--spacing-2xl);
          padding-bottom: var(--spacing-xl);
          border-bottom: 1px solid var(--border-light);
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-lg);
        }

        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .payment-method {
          cursor: pointer;
        }

        .payment-method input[type="radio"] {
          display: none;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border: 2px solid var(--border);
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }

        .payment-method input[type="radio"]:checked + .payment-option {
          border-color: var(--primary);
          background: rgba(107, 114, 128, 0.05);
        }

        .payment-icon {
          font-size: var(--font-size-xl);
        }

        .payment-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .payment-name {
          font-weight: 600;
          color: var(--text);
        }

        .payment-description {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .price-breakdown {
          background: var(--background);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-xl);
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) 0;
        }

        .price-item:not(:last-child) {
          border-bottom: 1px solid var(--border-light);
        }

        .price-item.total {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-md);
          border-top: 2px solid var(--border);
        }

        .booking-terms {
          text-align: center;
          margin-top: var(--spacing-lg);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .booking-content {
            grid-template-columns: 1fr;
          }

          .trip-summary {
            position: static;
            order: 2;
          }

          .booking-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
