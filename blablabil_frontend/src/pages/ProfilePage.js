import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// PUBLIC_INTERFACE
const ProfilePage = () => {
  /**
   * User profile page for viewing and editing profile information
   */
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    preferences: {
      smoking: false,
      pets: false,
      music: true,
      chatty: true
    }
  });
  const [verification, setVerification] = useState({
    phoneVerified: false,
    emailVerified: false,
    licenseVerified: false
  });

  // PUBLIC_INTERFACE
  const loadProfile = useCallback(async () => {
    /**
     * Load user profile data
     */
    setLoading(true);
    try {
      const [profileResponse, verificationResponse] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getVerificationStatus()
      ]);
      
      setProfileData(profileResponse.user);
      setVerification(verificationResponse.verification);
    } catch (error) {
      showError(error.response?.data?.message || t('error.generic'));
    } finally {
      setLoading(false);
    }
  }, [showError, t]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    /**
     * Handle form input changes
     */
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // PUBLIC_INTERFACE
  const handleSaveProfile = async (e) => {
    /**
     * Save profile changes
     */
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await userAPI.updateProfile(profileData);
      updateUser(response.user);
      showSuccess(t('profile.saveChanges') + ' successful');
    } catch (error) {
      showError(error.response?.data?.message || t('error.generic'));
    } finally {
      setSaving(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleProfilePictureUpload = async (e) => {
    /**
     * Handle profile picture upload
     */
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await userAPI.uploadProfilePicture(file);
      updateUser({ profilePicture: response.profilePicture });
      showSuccess('Profile picture updated successfully');
    } catch (error) {
      showError(error.response?.data?.message || t('error.generic'));
    }
  };

  // PUBLIC_INTERFACE
  const handleLicenseUpload = async (e) => {
    /**
     * Handle driver license upload for verification
     */
    const file = e.target.files[0];
    if (!file) return;

    try {
      await userAPI.uploadLicense(file);
      showSuccess('License uploaded for verification');
      loadProfile(); // Reload to get updated verification status
    } catch (error) {
      showError(error.response?.data?.message || t('error.generic'));
    }
  };

  if (loading && !profileData.firstName) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="title">{t('profile.title')}</h1>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
            )}
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: 'none' }}
              />
              <span className="upload-icon">📷</span>
            </label>
          </div>
          
          <div className="profile-info">
            <h2 className="profile-name">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="profile-email">{user?.email}</p>
            <div className="verification-badges">
              {verification.phoneVerified && (
                <span className="badge verified">📱 Phone Verified</span>
              )}
              {verification.emailVerified && (
                <span className="badge verified">✉️ Email Verified</span>
              )}
              {verification.licenseVerified && (
                <span className="badge verified">🚗 License Verified</span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            {t('profile.personalInfo')}
          </button>
          <button
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            {t('profile.contactInfo')}
          </button>
          <button
            className={`tab-button ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            {t('profile.verification')}
          </button>
          <button
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            {t('profile.preferences')}
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="profile-form">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="form-section">
              <h3 className="section-title">{t('profile.personalInfo')}</h3>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('profile.firstName')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('profile.lastName')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('profile.dateOfBirth')}</label>
                    <input
                      type="date"
                      className="form-input"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('profile.gender')}</label>
                    <select
                      className="form-select"
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.bio')}</label>
                <textarea
                  className="form-textarea"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell other users about yourself..."
                ></textarea>
              </div>
            </div>
          )}

          {/* Contact Information Tab */}
          {activeTab === 'contact' && (
            <div className="form-section">
              <h3 className="section-title">{t('profile.contactInfo')}</h3>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('common.email')}</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    {!verification.emailVerified && (
                      <small className="text-secondary">Email not verified</small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">{t('common.phone')}</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                    {!verification.phoneVerified && (
                      <small className="text-secondary">Phone not verified</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="form-section">
              <h3 className="section-title">{t('profile.verification')}</h3>
              
              <div className="verification-section">
                <div className="verification-item">
                  <div className="verification-info">
                    <h4>{t('profile.phoneVerified')}</h4>
                    <p>Verify your phone number to build trust with other users</p>
                  </div>
                  <div className="verification-status">
                    {verification.phoneVerified ? (
                      <span className="badge verified">✓ Verified</span>
                    ) : (
                      <button type="button" className="btn btn-outline btn-small">
                        Verify Phone
                      </button>
                    )}
                  </div>
                </div>

                <div className="verification-item">
                  <div className="verification-info">
                    <h4>{t('profile.emailVerified')}</h4>
                    <p>Verify your email address for important notifications</p>
                  </div>
                  <div className="verification-status">
                    {verification.emailVerified ? (
                      <span className="badge verified">✓ Verified</span>
                    ) : (
                      <button type="button" className="btn btn-outline btn-small">
                        Verify Email
                      </button>
                    )}
                  </div>
                </div>

                <div className="verification-item">
                  <div className="verification-info">
                    <h4>{t('profile.licenseVerified')}</h4>
                    <p>Upload your driver's license to offer rides</p>
                  </div>
                  <div className="verification-status">
                    {verification.licenseVerified ? (
                      <span className="badge verified">✓ Verified</span>
                    ) : (
                      <label className="btn btn-outline btn-small">
                        Upload License
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleLicenseUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="form-section">
              <h3 className="section-title">{t('profile.preferences')}</h3>
              
              <div className="preferences-grid">
                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={profileData.preferences?.smoking || false}
                      onChange={(e) => handleInputChange('preferences.smoking', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I'm okay with smoking in the car
                  </label>
                </div>

                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={profileData.preferences?.pets || false}
                      onChange={(e) => handleInputChange('preferences.pets', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I'm okay with pets in the car
                  </label>
                </div>

                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={profileData.preferences?.music || true}
                      onChange={(e) => handleInputChange('preferences.music', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I enjoy music during rides
                  </label>
                </div>

                <div className="preference-item">
                  <label className="preference-label">
                    <input
                      type="checkbox"
                      checked={profileData.preferences?.chatty || true}
                      onChange={(e) => handleInputChange('preferences.chatty', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I enjoy chatting during rides
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={saving}
            >
              {saving ? t('common.loading') : t('profile.saveChanges')}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .profile-header {
          display: flex;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-2xl);
          padding: var(--spacing-xl);
          background: var(--surface);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .profile-avatar {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .profile-avatar img {
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
          font-size: var(--font-size-3xl);
          font-weight: 600;
        }

        .avatar-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 40px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-md);
        }

        .upload-icon {
          color: white;
          font-size: var(--font-size-lg);
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .profile-email {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-md);
        }

        .verification-badges {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .badge {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 500;
        }

        .badge.verified {
          background: var(--success);
          color: white;
        }

        .tab-navigation {
          display: flex;
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xs);
          margin-bottom: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
        }

        .tab-button {
          flex: 1;
          min-width: max-content;
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          background: none;
          color: var(--text-secondary);
          font-weight: 500;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .tab-button.active {
          background: var(--primary);
          color: white;
        }

        .profile-form {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-lg);
        }

        .verification-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .verification-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }

        .verification-info h4 {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .verification-info p {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }

        .preferences-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-lg);
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

        .form-actions {
          margin-top: var(--spacing-xl);
          padding-top: var(--spacing-xl);
          border-top: 1px solid var(--border);
          text-align: center;
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .tab-navigation {
            flex-wrap: wrap;
          }

          .preferences-grid {
            grid-template-columns: 1fr;
          }

          .verification-item {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
