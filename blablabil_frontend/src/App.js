import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import './i18n';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TripDetailsPage from './pages/TripDetailsPage';
import OfferRidePage from './pages/OfferRidePage';
import BookingPage from './pages/BookingPage';
import MyRidesPage from './pages/MyRidesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SupportPage from './pages/SupportPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';

// PUBLIC_INTERFACE
function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set default language based on browser locale
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'no' || browserLang === 'nb' || browserLang === 'nn') {
      i18n.changeLanguage('no');
    } else {
      i18n.changeLanguage('en');
    }
  }, [i18n]);

  return (
    <div className="App">
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<LoadingSpinner />}>
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/trip/:id" element={<TripDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/offer" element={
                    <ProtectedRoute>
                      <OfferRidePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/booking/:tripId" element={
                    <ProtectedRoute>
                      <BookingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-rides" element={
                    <ProtectedRoute>
                      <MyRidesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </Suspense>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
