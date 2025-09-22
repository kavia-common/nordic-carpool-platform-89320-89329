import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// PUBLIC_INTERFACE
const FAQPage = () => {
  /**
   * Dedicated FAQ page component
   */
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // PUBLIC_INTERFACE
  const getFAQData = () => {
    /**
     * Get comprehensive FAQ data
     */
    return [
      {
        id: 1,
        category: 'booking',
        question: t('faq.howToBook'),
        answer: t('faq.howToBook.answer')
      },
      {
        id: 2,
        category: 'driving',
        question: t('faq.howToOffer'),
        answer: t('faq.howToOffer.answer')
      },
      {
        id: 3,
        category: 'payment',
        question: t('faq.payment'),
        answer: t('faq.payment.answer')
      },
      {
        id: 4,
        category: 'booking',
        question: t('faq.cancellation'),
        answer: t('faq.cancellation.answer')
      },
      {
        id: 5,
        category: 'safety',
        question: t('faq.safety'),
        answer: t('faq.safety.answer')
      },
      {
        id: 6,
        category: 'booking',
        question: 'How do I find the driver/passenger contact details?',
        answer: 'Contact details are shared automatically after booking confirmation. You can find them in your booking confirmation email and in the "My Rides" section.'
      },
      {
        id: 7,
        category: 'payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept Vipps for online payments and cash payments directly to the driver. Payment via bank card is coming soon.'
      },
      {
        id: 8,
        category: 'safety',
        question: 'What should I do if I feel unsafe during a ride?',
        answer: 'If you feel unsafe, ask the driver to stop in a safe public place and exit the vehicle. Contact emergency services (112) if needed, and report the incident to us immediately.'
      },
      {
        id: 9,
        category: 'driving',
        question: 'What documents do I need to offer rides?',
        answer: 'You need a valid Norwegian driver\'s license and vehicle registration. We verify these documents to ensure passenger safety.'
      },
      {
        id: 10,
        category: 'general',
        question: 'Is BlablaBil available throughout Norway?',
        answer: 'Yes, BlablaBil operates throughout Norway. You can find and offer rides between any cities and towns in the country.'
      },
      {
        id: 11,
        category: 'booking',
        question: 'Can I bring luggage on the ride?',
        answer: 'Yes, but please mention your luggage in the booking notes. Large items should be discussed with the driver beforehand.'
      },
      {
        id: 12,
        category: 'payment',
        question: 'How do refunds work?',
        answer: 'If you cancel more than 24 hours before departure, you get a full refund. Cancellations within 24 hours may incur a small fee.'
      }
    ];
  };

  // PUBLIC_INTERFACE
  const getCategories = () => {
    /**
     * Get FAQ categories
     */
    return [
      { id: 'all', name: 'All Questions', icon: '❓' },
      { id: 'booking', name: 'Booking & Rides', icon: '🎫' },
      { id: 'driving', name: 'Offering Rides', icon: '🚗' },
      { id: 'payment', name: 'Payment', icon: '💳' },
      { id: 'safety', name: 'Safety', icon: '🛡️' },
      { id: 'general', name: 'General', icon: '📋' }
    ];
  };

  // PUBLIC_INTERFACE
  const filteredFAQs = () => {
    /**
     * Filter FAQs based on search term and category
     */
    const faqs = getFAQData();
    
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="faq-page">
      <div className="container">
        {/* Header */}
        <div className="faq-header">
          <h1 className="title">Frequently Asked Questions</h1>
          <p className="subtitle">Find answers to common questions about BlablaBil</p>
        </div>

        {/* Search */}
        <div className="faq-search">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Categories */}
        <div className="faq-categories">
          {getCategories().map(category => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="faq-content">
          {filteredFAQs().length === 0 ? (
            <div className="no-results">
              <h3>No questions found</h3>
              <p>Try adjusting your search term or browse different categories.</p>
            </div>
          ) : (
            <div className="faq-list">
              {filteredFAQs().map(faq => (
                <FAQItem key={faq.id} item={faq} />
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="faq-support">
          <h3>Still need help?</h3>
          <p>Can't find what you're looking for? Our support team is here to help.</p>
          <a href="/support" className="btn btn-primary">
            Contact Support
          </a>
        </div>
      </div>

      <style jsx>{`
        .faq-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: var(--font-size-lg);
          margin-top: var(--spacing-md);
        }

        .faq-search {
          margin-bottom: var(--spacing-xl);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .search-input {
          position: relative;
        }

        .search-input input {
          padding-right: 50px;
        }

        .search-icon {
          position: absolute;
          right: var(--spacing-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          font-size: var(--font-size-lg);
        }

        .faq-categories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          justify-content: center;
          margin-bottom: var(--spacing-2xl);
        }

        .category-button {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .category-button:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .category-button.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .category-icon {
          font-size: var(--font-size-base);
        }

        .category-name {
          font-size: var(--font-size-sm);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .no-results {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--text-secondary);
        }

        .no-results h3 {
          color: var(--text);
          margin-bottom: var(--spacing-md);
        }

        .faq-support {
          background: var(--surface);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-sm);
        }

        .faq-support h3 {
          font-size: var(--font-size-xl);
          font-weight: 600;
          color: var(--text);
          margin-bottom: var(--spacing-md);
        }

        .faq-support p {
          color: var(--text-secondary);
          margin-bottom: var(--spacing-xl);
        }

        @media (max-width: 768px) {
          .faq-categories {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: var(--spacing-sm);
          }

          .category-button {
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  );
};

// FAQ Item Component (reused from SupportPage)
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
          transition: box-shadow 0.3s ease;
        }

        .faq-item:hover {
          box-shadow: var(--shadow-md);
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
          font-size: var(--font-size-sm);
        }

        .faq-toggle.open {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
          border-top: 1px solid var(--border-light);
          background: var(--background);
          animation: slideDown 0.3s ease;
        }

        .faq-answer p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: var(--spacing-md) 0 0 0;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQPage;
