import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supportAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// PUBLIC_INTERFACE
const SupportPage = () => {
  /**
   * Support page with FAQ and contact form
   */
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [activeTab, setActiveTab] = useState('faq');
  const [faqItems, setFaqItems] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });

  // PUBLIC_INTERFACE
  const loadFAQ = useCallback(async () => {
    /**
     * Load FAQ items
     */
    try {
      const response = await supportAPI.getFAQ();
      setFaqItems(response.faq || []);
    } catch (error) {
      // Use default FAQ if API fails
      setFaqItems(getDefaultFAQ());
    }
  }, [t]);

  // PUBLIC_INTERFACE
  const loadUserTickets = useCallback(async () => {
    /**
     * Load user's support tickets
     */
    if (!user?.id) return;
    
    try {
      const response = await supportAPI.getUserTickets(user.id);
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFAQ();
    if (isAuthenticated) {
      loadUserTickets();
    }
  }, [isAuthenticated, loadFAQ, loadUserTickets]);

  // PUBLIC_INTERFACE
  const getDefaultFAQ = () => {
    /**
     * Get default FAQ items if API is not available
     */
    return [
      {
        id: 1,
        question: t('faq.howToBook'),
        answer: t('faq.howToBook.answer')
      },
      {
        id: 2,
        question: t('faq.howToOffer'),
        answer: t('faq.howToOffer.answer')
      },
      {
        id: 3,
        question: t('faq.payment'),
        answer: t('faq.payment.answer')
      },
      {
        id: 4,
        question: t('faq.cancellation'),
        answer: t('faq.cancellation.answer')
      },
      {
        id: 5,
        question: t('faq.safety'),
        answer: t('faq.safety.answer')
      }
    ];
  };

  // PUBLIC_INTERFACE
  const handleInputChange = (field, value) => {
    /**
     * Handle ticket form input changes
     */
    setTicketForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // PUBLIC_INTERFACE
  const handleSubmitTicket = async (e) => {
    /**
     * Submit support ticket
     */
    e.preventDefault();
    
    if (!isAuthenticated) {
      showError('Please login to submit a support ticket');
      return;
    }

    setSubmitting(true);

    try {
      const ticketData = {
        ...ticketForm,
        userId: user.id,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`
      };

      await supportAPI.createTicket(ticketData);
      
      showSuccess('Support ticket submitted successfully!');
      setTicketForm({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: ''
      });
      
      loadUserTickets(); // Reload tickets
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-page">
      <div className="container">
        <h1 className="title">{t('support.title')}</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            {t('support.faq')}
          </button>
          <button
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            {t('support.contact')}
          </button>
          {isAuthenticated && (
            <button
              className={`tab-button ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              {t('support.ticketHistory')}
            </button>
          )}
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="faq-section">
            <h2 className="section-title">{t('support.faq')}</h2>
            <div className="faq-list">
              {faqItems.map(item => (
                <FAQItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="contact-section">
            <div className="contact-grid">
              <div className="contact-form-section">
                <h2 className="section-title">{t('support.createTicket')}</h2>
                
                {!isAuthenticated && (
                  <div className="alert alert-info">
                    Please <a href="/login">login</a> to submit a support ticket.
                  </div>
                )}

                <form onSubmit={handleSubmitTicket} className="contact-form">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">{t('support.category')}</label>
                        <select
                          className="form-select"
                          value={ticketForm.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          required
                        >
                          <option value="general">General Inquiry</option>
                          <option value="booking">Booking Issues</option>
                          <option value="payment">Payment Problems</option>
                          <option value="technical">Technical Support</option>
                          <option value="safety">Safety Concerns</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">{t('support.priority')}</label>
                        <select
                          className="form-select"
                          value={ticketForm.priority}
                          onChange={(e) => handleInputChange('priority', e.target.value)}
                          required
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('support.subject')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={ticketForm.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('support.message')}</label>
                    <textarea
                      className="form-textarea"
                      value={ticketForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows="6"
                      placeholder="Please describe your issue in detail..."
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-large"
                    disabled={submitting || !isAuthenticated}
                  >
                    {submitting ? t('common.loading') : t('support.submitTicket')}
                  </button>
                </form>
              </div>

              <div className="contact-info-section">
                <h3>Other Ways to Reach Us</h3>
                
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <p>support@blablabil.no</p>
                    <small>We'll respond within 24 hours</small>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <h4>Phone</h4>
                    <p>+47 123 45 678</p>
                    <small>Mon-Fri, 9:00-17:00 CET</small>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">💬</div>
                  <div className="contact-details">
                    <h4>Live Chat</h4>
                    <p>Available on our website</p>
                    <small>Mon-Fri, 9:00-17:00 CET</small>
                  </div>
                </div>

                <div className="emergency-notice">
                  <h4>🚨 Emergency?</h4>
                  <p>For urgent safety issues during a trip, call <strong>112</strong> (emergency services) or <strong>+47 123 45 678</strong> (our emergency line).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && isAuthenticated && (
          <div className="tickets-section">
            <h2 className="section-title">{t('support.ticketHistory')}</h2>
            
            {tickets.length === 0 && (
              <div className="no-tickets">
                <p>You don't have any support tickets yet.</p>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="btn btn-primary"
                >
                  {t('support.createTicket')}
                </button>
              </div>
            )}

            {tickets.length > 0 && (
              <div className="tickets-list">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-header">
                      <h3 className="ticket-subject">{ticket.subject}</h3>
                      <span className={`ticket-status ${ticket.status}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="ticket-meta">
                      <span>Category: {ticket.category}</span>
                      <span>Priority: {ticket.priority}</span>
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="ticket-preview">
                      {ticket.message.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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

        .section-title {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xl);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-2xl);
        }

        .contact-form {
          background: var(--surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        .contact-info-section {
          background: var(--surface);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          height: fit-content;
        }

        .contact-info-section h3 {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xl);
        }

        .contact-method {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .contact-icon {
          font-size: var(--font-size-xl);
          flex-shrink: 0;
        }

        .contact-details h4 {
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .contact-details p {
          color: var(--text);
          margin-bottom: var(--spacing-xs);
        }

        .contact-details small {
          color: var(--text-secondary);
        }

        .emergency-notice {
          background: #FEF3C7;
          border: 1px solid #F59E0B;
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          margin-top: var(--spacing-xl);
        }

        .emergency-notice h4 {
          color: #92400E;
          margin-bottom: var(--spacing-sm);
        }

        .emergency-notice p {
          color: #92400E;
          margin: 0;
          line-height: 1.5;
        }

        .tickets-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .ticket-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          transition: all 0.3s ease;
        }

        .ticket-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .ticket-subject {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }

        .ticket-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-xs);
          font-weight: 600;
          text-transform: uppercase;
        }

        .ticket-status.open {
          background: #DBEAFE;
          color: #1E40AF;
        }

        .ticket-status.pending {
          background: #FEF3C7;
          color: #92400E;
        }

        .ticket-status.resolved {
          background: #D1FAE5;
          color: #065F46;
        }

        .ticket-status.closed {
          background: #F3F4F6;
          color: #374151;
        }

        .ticket-meta {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-md);
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
        }

        .ticket-preview {
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .no-tickets {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-info-section {
            order: -1;
          }

          .ticket-header {
            flex-direction: column;
            gap: var(--spacing-sm);
            align-items: flex-start;
          }

          .ticket-meta {
            flex-direction: column;
            gap: var(--spacing-xs);
          }
        }
      `}</style>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.question}</span>
        <span className={`faq-toggle ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{item.answer}</p>
        </div>
      )}

      <style jsx>{`
        .faq-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          padding: var(--spacing-lg);
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--text);
          transition: background-color 0.2s ease;
        }

        .faq-question:hover {
          background: var(--background);
        }

        .faq-toggle {
          transition: transform 0.3s ease;
          color: var(--text-secondary);
        }

        .faq-toggle.open {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
          border-top: 1px solid var(--border-light);
          background: var(--background);
        }

        .faq-answer p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: var(--spacing-md) 0 0 0;
        }
      `}</style>
    </div>
  );
};

export default SupportPage;
