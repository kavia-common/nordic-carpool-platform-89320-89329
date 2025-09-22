import React from 'react';

// PUBLIC_INTERFACE
const LoadingSpinner = ({ size = 'medium', text = '' }) => {
  /**
   * Reusable loading spinner component
   */
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <div 
          className={`loading ${sizeClasses[size] || sizeClasses.medium}`}
          style={{ 
            margin: '0 auto',
            marginBottom: text ? '1rem' : '0'
          }}
        ></div>
        {text && <p className="text-secondary">{text}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
