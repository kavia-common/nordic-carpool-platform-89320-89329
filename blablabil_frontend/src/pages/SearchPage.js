import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { tripAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// PUBLIC_INTERFACE
const SearchPage = () => {
  /**
   * Search page for finding rides
   */
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  });
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    departureTime: '',
    sortBy: 'time'
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  const searchTrips = useCallback(async (params) => {
    /**
     * Search for trips with given parameters
     */
    setLoading(true);
    setError(null);
    
    try {
      const response = await tripAPI.searchTrips({
        ...params,
        ...filters
      });
      setTrips(response.trips || []);
    } catch (err) {
      setError(err.response?.data?.message || t('error.generic'));
    } finally {
      setLoading(false);
    }
  }, [filters, t]);

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const newSearchParams = {
      from: urlParams.get('from') || '',
      to: urlParams.get('to') || '',
      date: urlParams.get('date') || '',
      passengers: parseInt(urlParams.get('passengers')) || 1
    };
    setSearchParams(newSearchParams);
    
    // Auto-search if we have search parameters
    if (newSearchParams.from && newSearchParams.to && newSearchParams.date) {
      searchTrips(newSearchParams);
    }
  }, [location.search, searchTrips]);

  // PUBLIC_INTERFACE
  const handleSearchSubmit = (e) => {
    /**
     * Handle search form submission
     */
    e.preventDefault();
    searchTrips(searchParams);
    
    // Update URL with search parameters
    const urlParams = new URLSearchParams(searchParams);
    navigate(`/search?${urlParams.toString()}`);
  };



  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    /**
     * Handle search input changes
     */
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // PUBLIC_INTERFACE
  const handleFilterChange = (field, value) => {
    /**
     * Handle filter changes
     */
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <div className="search-page">
      <div className="container">
        <h1 className="title">{t('search.title')}</h1>

        {/* Search Form */}
        <div className="search-form">
          <form onSubmit={handleSearchSubmit}>
            <div className="search-row">
              <div className="form-group">
                <label className="form-label">{t('common.from')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('search.from.placeholder')}
                  value={searchParams.from}
                  onChange={(e) => handleInputChange('from', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('common.to')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('search.to.placeholder')}
                  value={searchParams.to}
                  onChange={(e) => handleInputChange('to', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('common.date')}</label>
                <input
                  type="date"
                  className="form-input"
                  value={searchParams.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">{t('common.passengers')}</label>
                <select
                  className="form-select"
                  value={searchParams.passengers}
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              
              <button type="submit" className="btn btn-primary btn-large">
                {t('search.searchButton')}
              </button>
            </div>
          </form>
        </div>

        <div className="search-content">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <h3 className="filters-title">{t('search.filters')}</h3>
            
            <div className="filter-group">
              <label className="form-label">{t('search.priceRange')}</label>
              <div className="price-range">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label className="form-label">{t('search.departureTime')}</label>
              <select
                className="form-select"
                value={filters.departureTime}
                onChange={(e) => handleFilterChange('departureTime', e.target.value)}
              >
                <option value="">{t('common.any')}</option>
                <option value="morning">{t('search.morning')}</option>
                <option value="afternoon">{t('search.afternoon')}</option>
                <option value="evening">{t('search.evening')}</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="form-label">{t('search.sortBy')}</label>
              <select
                className="form-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="time">{t('search.sortTime')}</option>
                <option value="price">{t('search.sortPrice')}</option>
                <option value="duration">{t('search.sortDuration')}</option>
              </select>
            </div>
            
            <button 
              onClick={() => searchTrips(searchParams)}
              className="btn btn-outline btn-large"
            >
              {t('common.apply')}
            </button>
          </div>

          {/* Search Results */}
          <div className="search-results">
            {loading && <LoadingSpinner text={t('common.loading')} />}
            
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            
            {!loading && !error && trips.length === 0 && searchParams.from && (
              <div className="no-results">
                <h3>{t('search.noResults')}</h3>
                <p>{t('search.noResults.description')}</p>
              </div>
            )}
            
            {!loading && trips.length > 0 && (
              <div className="trips-list">
                {trips.map(trip => (
                  <div key={trip.id} className="trip-card" onClick={() => navigate(`/trip/${trip.id}`)}>
                    <div className="trip-route">
                      <span className="trip-location">{trip.fromCity}</span>
                      <span className="trip-arrow">→</span>
                      <span className="trip-location">{trip.toCity}</span>
                    </div>
                    
                    <div className="trip-details">
                      <div className="trip-time">
                        <span className="trip-date">{formatDate(trip.date)}</span>
                        <span className="trip-departure-time">{formatTime(trip.departureTime)}</span>
                      </div>
                      
                      <div className="trip-info">
                        <span className="trip-duration">{trip.duration}</span>
                        <span className="trip-seats">{trip.availableSeats} {t('trip.seats.available')}</span>
                      </div>
                      
                      <div className="trip-price">
                        {trip.pricePerSeat} NOK
                      </div>
                    </div>
                    
                    <div className="trip-driver">
                      <span className="driver-name">{trip.driver?.firstName}</span>
                      <span className="driver-rating">⭐ {trip.driver?.rating?.toFixed(1) || 'New'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .search-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: var(--spacing-xl);
          margin-top: var(--spacing-xl);
        }

        .filters-sidebar {
          background: var(--surface);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          height: fit-content;
        }

        .filters-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          color: var(--text);
        }

        .filter-group {
          margin-bottom: var(--spacing-lg);
        }

        .price-range {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-sm);
        }

        .trips-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .trip-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .trip-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
          border-color: var(--primary);
        }

        .trip-route {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .trip-location {
          font-weight: 600;
          color: var(--text);
          font-size: var(--font-size-lg);
        }

        .trip-arrow {
          color: var(--text-light);
          font-size: var(--font-size-lg);
        }

        .trip-details {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          align-items: center;
        }

        .trip-time {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .trip-date {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .trip-departure-time {
          font-weight: 600;
          color: var(--text);
        }

        .trip-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .trip-price {
          text-align: right;
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--success);
        }

        .trip-driver {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border-light);
        }

        .driver-name {
          font-weight: 500;
          color: var(--text);
        }

        .driver-rating {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .no-results {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .search-content {
            grid-template-columns: 1fr;
          }

          .filters-sidebar {
            order: 2;
          }

          .trip-details {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .trip-price {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
