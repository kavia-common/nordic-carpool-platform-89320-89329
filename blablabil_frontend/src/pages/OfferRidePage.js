import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tripAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

// PUBLIC_INTERFACE
const OfferRidePage = () => {
  /**
   * Page for drivers to offer new rides
   */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    fromCity: '',
    toCity: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    pricePerSeat: '',
    totalSeats: 4,
    availableSeats: 4,
    description: '',
    stops: [],
    vehicle: {
      make: '',
      model: '',
      color: '',
      licensePlate: ''
    },
    preferences: {
      smoking: false,
      pets: false,
      music: true,
      chatty: true
    }
  });

  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    /**
     * Handle form input changes
     */
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setTripData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setTripData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // PUBLIC_INTERFACE
  const handleNextStep = () => {
    /**
     * Move to next step in form
     */
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // PUBLIC_INTERFACE
  const handlePrevStep = () => {
    /**
     * Move to previous step in form
     */
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    /**
     * Submit the trip offer
     */
    e.preventDefault();
    setLoading(true);

    try {
      const response = await tripAPI.createTrip({
        ...tripData,
        driverId: user.id
      });
      
      showSuccess(t('offer.success'));
      navigate(`/trip/${response.trip.id}`);
    } catch (error) {
      showError(error.response?.data?.message || t('error.generic'));
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const validateStep = (step) => {
    /**
     * Validate current step before proceeding
     */
    switch (step) {
      case 1:
        return tripData.fromCity && tripData.toCity && tripData.date && tripData.departureTime;
      case 2:
        return tripData.pricePerSeat && tripData.totalSeats;
      case 3:
        return tripData.vehicle.make && tripData.vehicle.model;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="offer-ride-page">
      <div className="container">
        <h1 className="title">{t('offer.title')}</h1>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">{t('offer.route')}</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">{t('offer.pricing')}</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">{t('offer.vehicle')}</span>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">{t('offer.preferences')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="offer-form">
          {/* Step 1: Route & Schedule */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2 className="step-title">{t('offer.route')} & {t('offer.schedule')}</h2>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('common.from')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tripData.fromCity}
                      onChange={(e) => handleInputChange('fromCity', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('common.to')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tripData.toCity}
                      onChange={(e) => handleInputChange('toCity', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">{t('common.date')}</label>
                    <input
                      type="date"
                      className="form-input"
                      value={tripData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">Departure {t('common.time')}</label>
                    <input
                      type="time"
                      className="form-input"
                      value={tripData.departureTime}
                      onChange={(e) => handleInputChange('departureTime', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">Arrival {t('common.time')} (Optional)</label>
                    <input
                      type="time"
                      className="form-input"
                      value={tripData.arrivalTime}
                      onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('offer.additionalInfo')}</label>
                <textarea
                  className="form-textarea"
                  value={tripData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Any additional information about the trip..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Seats */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2 className="step-title">{t('offer.pricing')} & {t('common.seats')}</h2>
              
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">{t('offer.pricePerSeat')} (NOK)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={tripData.pricePerSeat}
                      onChange={(e) => handleInputChange('pricePerSeat', e.target.value)}
                      min="0"
                      step="1"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">{t('offer.totalSeats')}</label>
                    <select
                      className="form-select"
                      value={tripData.totalSeats}
                      onChange={(e) => handleInputChange('totalSeats', parseInt(e.target.value))}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="form-label">{t('offer.availableSeats')}</label>
                    <select
                      className="form-select"
                      value={tripData.availableSeats}
                      onChange={(e) => handleInputChange('availableSeats', parseInt(e.target.value))}
                    >
                      {Array.from({ length: tripData.totalSeats }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pricing-info">
                <p className="text-secondary">
                  Recommended price range: {Math.round(tripData.pricePerSeat * 0.8)} - {Math.round(tripData.pricePerSeat * 1.2)} NOK
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Information */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2 className="step-title">{t('offer.vehicle')}</h2>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('offer.carMake')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tripData.vehicle.make}
                      onChange={(e) => handleInputChange('vehicle.make', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('offer.carModel')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tripData.vehicle.model}
                      onChange={(e) => handleInputChange('vehicle.model', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('offer.carColor')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tripData.vehicle.color}
                      onChange={(e) => handleInputChange('vehicle.color', e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('offer.licensePlate')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={tripData.vehicle.licensePlate}
                      onChange={(e) => handleInputChange('vehicle.licensePlate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Travel Preferences */}
          {currentStep === 4 && (
            <div className="form-step">
              <h2 className="step-title">{t('offer.preferences')}</h2>
              
              <div className="preferences-grid">
                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={tripData.preferences.smoking}
                      onChange={(e) => handleInputChange('preferences.smoking', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    {t('trip.smoking')} {t('trip.allowed')}
                  </label>
                </div>

                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={tripData.preferences.pets}
                      onChange={(e) => handleInputChange('preferences.pets', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    {t('trip.pets')} {t('trip.allowed')}
                  </label>
                </div>

                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={tripData.preferences.music}
                      onChange={(e) => handleInputChange('preferences.music', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    {t('trip.music')} {t('trip.allowed')}
                  </label>
                </div>

                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={tripData.preferences.chatty}
                      onChange={(e) => handleInputChange('preferences.chatty', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    {t('trip.sociable')} driver
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional preferences or rules</label>
                <textarea
                  className="form-textarea"
                  placeholder="Any additional rules or preferences for passengers..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn btn-outline"
              >
                {t('common.previous')}
              </button>
            )}
            
            <div className="nav-spacer"></div>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn btn-primary"
                disabled={!validateStep(currentStep)}
              >
                {t('common.next')}
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success btn-large"
                disabled={loading || !validateStep(currentStep)}
              >
                {loading ? t('common.loading') : t('offer.publishRide')}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        .progress-steps {
          display: flex;
          justify-content: center;
          margin-bottom: var(--spacing-2xl);
          gap: var(--spacing-xl);
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .step.active {
          opacity: 1;
        }

        .step.completed {
          opacity: 1;
          color: var(--success);
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--border);
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: var(--primary);
          color: white;
        }

        .step.completed .step-number {
          background: var(--success);
          color: white;
        }

        .step-label {
          font-size: var(--font-size-sm);
          text-align: center;
        }

        .offer-form {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-md);
        }

        .form-step {
          min-height: 400px;
        }

        .step-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xl);
          text-align: center;
        }

        .pricing-info {
          background: var(--background);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-top: var(--spacing-lg);
        }

        .preferences-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .preference-item {
          display: flex;
          align-items: center;
        }

        .preference-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          font-weight: 500;
          color: var(--text);
        }

        .preference-label input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border);
          border-radius: var(--radius-sm);
          position: relative;
          transition: all 0.2s ease;
        }

        .preference-label input[type="checkbox"]:checked + .checkmark {
          background: var(--primary);
          border-color: var(--primary);
        }

        .preference-label input[type="checkbox"]:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .form-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--spacing-2xl);
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--border);
        }

        .nav-spacer {
          flex: 1;
        }

        @media (max-width: 768px) {
          .progress-steps {
            gap: var(--spacing-md);
          }

          .step-label {
            display: none;
          }

          .preferences-grid {
            grid-template-columns: 1fr;
          }

          .form-navigation {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .nav-spacer {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default OfferRidePage;
