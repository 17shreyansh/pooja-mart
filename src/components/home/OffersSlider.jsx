import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import './OffersSlider.css';

const OffersSlider = () => {
  const [offers, setOffers] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (offers.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % offers.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [offers.length]);

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/offers/slider`);
      const data = await response.json();
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  if (loading || offers.length === 0) return null;

  return (
    <div className="offers-slider">
      <div className="slider-container">
        {Array.isArray(offers) && offers.map((offer, index) => (
          <div
            key={offer._id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-content">
              <div className="slide-image">
                <img src={`${API_BASE_URL}${offer.image}`} alt={offer.title} />
                {offer.discountPercentage && (
                  <div className="discount-badge">
                    {offer.discountPercentage}% OFF
                  </div>
                )}
              </div>
              <div className="slide-text">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                {offer.offerCode && (
                  <div className="offer-code">
                    Code: <span>{offer.offerCode}</span>
                  </div>
                )}
                <a href={offer.buttonLink} className="offer-btn">
                  {offer.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
        
        {offers.length > 1 && (
          <>
            <button className="slider-btn prev" onClick={prevSlide}>
              &#8249;
            </button>
            <button className="slider-btn next" onClick={nextSlide}>
              &#8250;
            </button>
            
            <div className="slider-dots">
              {Array.isArray(offers) && offers.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OffersSlider;