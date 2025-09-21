import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import './OffersPopup.css';

const OffersPopup = () => {
  const [offer, setOffer] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopupOffer();
  }, []);

  useEffect(() => {
    if (offer) {
      // Check if popup was already shown today
      const lastShown = localStorage.getItem('offerPopupLastShown');
      const today = new Date().toDateString();
      
      if (lastShown !== today) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000); // Show popup after 3 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, [offer]);

  const fetchPopupOffer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers/popup`);
      const data = await response.json();
      if (data.success && data.offer) {
        setOffer(data.offer);
      }
    } catch (error) {
      console.error('Error fetching popup offer:', error);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setIsVisible(false);
    // Remember that popup was shown today
    localStorage.setItem('offerPopupLastShown', new Date().toDateString());
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  if (loading || !offer || !isVisible) return null;

  return (
    <div className="offers-popup-overlay" onClick={handleBackdropClick}>
      <div className="offers-popup">
        <button className="popup-close" onClick={closePopup}>
          &times;
        </button>
        
        <div className="popup-content">
          <div className="popup-image">
            <img src={`${API_BASE_URL}${offer.image}`} alt={offer.title} />
            {offer.discountPercentage && (
              <div className="popup-discount-badge">
                {offer.discountPercentage}% OFF
              </div>
            )}
          </div>
          
          <div className="popup-text">
            <h2>{offer.title}</h2>
            <p>{offer.description}</p>
            
            {offer.offerCode && (
              <div className="popup-offer-code">
                <span>Use Code:</span>
                <strong>{offer.offerCode}</strong>
              </div>
            )}
            
            <div className="popup-actions">
              <a href={offer.buttonLink} className="popup-btn primary" onClick={closePopup}>
                {offer.buttonText}
              </a>
              <button className="popup-btn secondary" onClick={closePopup}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPopup;