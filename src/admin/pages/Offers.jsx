import React, { useState, useEffect } from 'react';
import { offersAPI } from '../utils/api';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    discountPercentage: '',
    offerCode: '',
    startDate: '',
    endDate: '',
    isActive: true,
    showInSlider: true,
    showInPopup: false,
    priority: 0,
    buttonText: 'Book Now',
    buttonLink: '/services'
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offersAPI.getAllAdmin();
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        submitData.append('image', formData[key]);
      } else if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });

    try {
      if (editingOffer) {
        await offersAPI.update(editingOffer._id, submitData);
      } else {
        await offersAPI.create(submitData);
      }
      
      fetchOffers();
      resetForm();
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('Error saving offer');
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      image: null,
      discountPercentage: offer.discountPercentage || '',
      offerCode: offer.offerCode || '',
      startDate: offer.startDate ? offer.startDate.split('T')[0] : '',
      endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
      isActive: offer.isActive,
      showInSlider: offer.showInSlider,
      showInPopup: offer.showInPopup,
      priority: offer.priority || 0,
      buttonText: offer.buttonText || 'Book Now',
      buttonLink: offer.buttonLink || '/services'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await offersAPI.delete(id);
        fetchOffers();
      } catch (error) {
        console.error('Error deleting offer:', error);
        alert('Error deleting offer');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: null,
      discountPercentage: '',
      offerCode: '',
      startDate: '',
      endDate: '',
      isActive: true,
      showInSlider: true,
      showInPopup: false,
      priority: 0,
      buttonText: 'Book Now',
      buttonLink: '/services'
    });
    setEditingOffer(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  if (loading) return <div className="loading">Loading offers...</div>;

  return (
    <div className="offers-management">
      <div className="page-header">
        <h1>Festive Offers Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Offer
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="offer-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Image *</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    required={!editingOffer}
                  />
                </div>

                <div className="form-group">
                  <label>Discount %</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Offer Code</label>
                  <input
                    type="text"
                    name="offerCode"
                    value={formData.offerCode}
                    onChange={handleInputChange}
                    placeholder="e.g., DIWALI2024"
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="showInSlider"
                    checked={formData.showInSlider}
                    onChange={handleInputChange}
                  />
                  Show in Slider
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="showInPopup"
                    checked={formData.showInPopup}
                    onChange={handleInputChange}
                  />
                  Show in Popup
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOffer ? 'Update' : 'Create'} Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="offers-list">
        {offers.length === 0 ? (
          <p>No offers found. Create your first offer!</p>
        ) : (
          <div className="offers-grid">
            {offers.map(offer => (
              <div key={offer._id} className="offer-card">
                <div className="offer-image">
                  <img src={`http://localhost:5000${offer.image}`} alt={offer.title} />
                  {offer.discountPercentage && (
                    <div className="discount-badge">{offer.discountPercentage}% OFF</div>
                  )}
                </div>
                
                <div className="offer-content">
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  
                  {offer.offerCode && (
                    <div className="offer-code">Code: {offer.offerCode}</div>
                  )}
                  
                  <div className="offer-dates">
                    {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                  </div>
                  
                  <div className="offer-status">
                    <span className={`status ${offer.isActive ? 'active' : 'inactive'}`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {offer.showInSlider && <span className="badge">Slider</span>}
                    {offer.showInPopup && <span className="badge">Popup</span>}
                  </div>
                  
                  <div className="offer-actions">
                    <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(offer)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(offer._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;