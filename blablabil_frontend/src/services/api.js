import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export const authAPI = {
  /**
   * Login with phone number and password
   */
  login: async (phone, password) => {
    const response = await api.post('/auth/login', { phone, password });
    return response.data;
  },
  
  /**
   * Register new user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  /**
   * Send phone verification code
   */
  sendVerificationCode: async (phone) => {
    const response = await api.post('/auth/verify-phone', { phone });
    return response.data;
  },
  
  /**
   * Verify phone number with code
   */
  verifyPhone: async (phone, code) => {
    const response = await api.post('/auth/verify-phone/confirm', { phone, code });
    return response.data;
  },
  
  /**
   * Request password reset
   */
  resetPassword: async (phone) => {
    const response = await api.post('/auth/reset-password', { phone });
    return response.data;
  },
  
  /**
   * Refresh auth token
   */
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
  
  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// PUBLIC_INTERFACE
export const userAPI = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  
  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.post('/users/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  /**
   * Get user verification status
   */
  getVerificationStatus: async () => {
    const response = await api.get('/users/verification');
    return response.data;
  },
  
  /**
   * Upload driver license for verification
   */
  uploadLicense: async (licenseFile) => {
    const formData = new FormData();
    formData.append('license', licenseFile);
    const response = await api.post('/users/verify-license', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

// PUBLIC_INTERFACE
export const tripAPI = {
  /**
   * Search for trips
   */
  searchTrips: async (searchParams) => {
    const response = await api.get('/trips/search', { params: searchParams });
    return response.data;
  },
  
  /**
   * Get trip details by ID
   */
  getTripById: async (tripId) => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },
  
  /**
   * Create new trip
   */
  createTrip: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },
  
  /**
   * Update existing trip
   */
  updateTrip: async (tripId, tripData) => {
    const response = await api.put(`/trips/${tripId}`, tripData);
    return response.data;
  },
  
  /**
   * Cancel trip
   */
  cancelTrip: async (tripId) => {
    const response = await api.delete(`/trips/${tripId}`);
    return response.data;
  },
  
  /**
   * Get user's trips
   */
  getUserTrips: async (userId, role = 'all') => {
    const response = await api.get(`/trips/user/${userId}`, { params: { role } });
    return response.data;
  }
};

// PUBLIC_INTERFACE
export const bookingAPI = {
  /**
   * Create new booking
   */
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  
  /**
   * Get booking details
   */
  getBookingById: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },
  
  /**
   * Cancel booking
   */
  cancelBooking: async (bookingId) => {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },
  
  /**
   * Get user's bookings
   */
  getUserBookings: async (userId) => {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  },
  
  /**
   * Confirm booking payment
   */
  confirmPayment: async (bookingId, paymentData) => {
    const response = await api.post(`/bookings/${bookingId}/payment`, paymentData);
    return response.data;
  }
};

// PUBLIC_INTERFACE
export const paymentAPI = {
  /**
   * Process Vipps payment
   */
  processVippsPayment: async (paymentData) => {
    const response = await api.post('/payments/vipps', paymentData);
    return response.data;
  },
  
  /**
   * Get payment history
   */
  getPaymentHistory: async (userId) => {
    const response = await api.get(`/payments/history/${userId}`);
    return response.data;
  },
  
  /**
   * Request refund
   */
  requestRefund: async (paymentId, reason) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason });
    return response.data;
  }
};

// PUBLIC_INTERFACE
export const supportAPI = {
  /**
   * Create support ticket
   */
  createTicket: async (ticketData) => {
    const response = await api.post('/support/tickets', ticketData);
    return response.data;
  },
  
  /**
   * Get user's support tickets
   */
  getUserTickets: async (userId) => {
    const response = await api.get(`/support/tickets/user/${userId}`);
    return response.data;
  },
  
  /**
   * Get ticket by ID
   */
  getTicketById: async (ticketId) => {
    const response = await api.get(`/support/tickets/${ticketId}`);
    return response.data;
  },
  
  /**
   * Add message to ticket
   */
  addTicketMessage: async (ticketId, message) => {
    const response = await api.post(`/support/tickets/${ticketId}/messages`, { message });
    return response.data;
  },
  
  /**
   * Get FAQ items
   */
  getFAQ: async () => {
    const response = await api.get('/support/faq');
    return response.data;
  }
};

// PUBLIC_INTERFACE
export const adminAPI = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  /**
   * Get all users with pagination
   */
  getUsers: async (page = 1, limit = 20, filters = {}) => {
    const response = await api.get('/admin/users', { params: { page, limit, ...filters } });
    return response.data;
  },
  
  /**
   * Get all trips with pagination
   */
  getTrips: async (page = 1, limit = 20, filters = {}) => {
    const response = await api.get('/admin/trips', { params: { page, limit, ...filters } });
    return response.data;
  },
  
  /**
   * Get all bookings with pagination
   */
  getBookings: async (page = 1, limit = 20, filters = {}) => {
    const response = await api.get('/admin/bookings', { params: { page, limit, ...filters } });
    return response.data;
  },
  
  /**
   * Update user status
   */
  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  },
  
  /**
   * Get support tickets for admin
   */
  getSupportTickets: async (page = 1, limit = 20, filters = {}) => {
    const response = await api.get('/admin/support/tickets', { params: { page, limit, ...filters } });
    return response.data;
  }
};

// PUBLIC_INTERFACE
export const notificationAPI = {
  /**
   * Get user notifications
   */
  getNotifications: async (userId) => {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
  },
  
  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (userId) => {
    const response = await api.put(`/notifications/${userId}/read-all`);
    return response.data;
  }
};

export default api;
