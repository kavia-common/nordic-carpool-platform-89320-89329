import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state
const initialState = {
  notifications: [],
};

// Actions
const NOTIFICATION_ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
};

// Reducer
function notificationReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
    case NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
}

// Create context
const NotificationContext = createContext();

// PUBLIC_INTERFACE
export const useNotification = () => {
  /**
   * Hook to access notification context
   */
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
export const NotificationProvider = ({ children }) => {
  /**
   * Notification provider component
   */
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // PUBLIC_INTERFACE
  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    /**
     * Show a notification
     */
    const id = Date.now().toString();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      timestamp: new Date(),
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: notification,
    });

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        dispatch({
          type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
          payload: id,
        });
      }, duration);
    }

    return id;
  }, []);

  // PUBLIC_INTERFACE
  const removeNotification = useCallback((id) => {
    /**
     * Remove a specific notification
     */
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: id,
    });
  }, []);

  // PUBLIC_INTERFACE
  const clearNotifications = useCallback(() => {
    /**
     * Clear all notifications
     */
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS });
  }, []);

  // PUBLIC_INTERFACE
  const showSuccess = useCallback((message, duration) => {
    /**
     * Show success notification
     */
    return showNotification(message, 'success', duration);
  }, [showNotification]);

  // PUBLIC_INTERFACE
  const showError = useCallback((message, duration) => {
    /**
     * Show error notification
     */
    return showNotification(message, 'error', duration);
  }, [showNotification]);

  // PUBLIC_INTERFACE
  const showWarning = useCallback((message, duration) => {
    /**
     * Show warning notification
     */
    return showNotification(message, 'warning', duration);
  }, [showNotification]);

  // PUBLIC_INTERFACE
  const showInfo = useCallback((message, duration) => {
    /**
     * Show info notification
     */
    return showNotification(message, 'info', duration);
  }, [showNotification]);

  const value = {
    notifications: state.notifications,
    showNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
