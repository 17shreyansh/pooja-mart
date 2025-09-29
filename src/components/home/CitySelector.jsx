import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { citiesAPI } from '../../utils/api';

const CitySelector = ({ selectedCity, onCityChange }) => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCities();
    if (!selectedCity) {
      setIsModalVisible(true);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [searchTerm, cities]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await citiesAPI.getAll();
      setCities(response.data.data);
      setFilteredCities(response.data.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
    setLoading(false);
  };

  const handleCitySelect = (city) => {
    onCityChange(city);
    setIsModalVisible(false);
    setSearchTerm('');
  };

  return (
    <>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid #d9d9d9',
          backgroundColor: '#fff'
        }} 
        onClick={() => setIsModalVisible(true)}
      >
        <EnvironmentOutlined style={{ color: '#701a1a' }} />
        <span style={{ color: '#333', fontSize: '14px' }}>
          {selectedCity ? selectedCity.name : 'Select City'}
        </span>
      </div>

      <Modal
        title={
          <div style={{ textAlign: 'center', color: '#701a1a', fontSize: '20px', fontWeight: '600' }}>
            Select Your City
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={600}
        styles={{
          body: { padding: '20px' }
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Choose your city to see available poojas in your area
        </div>
        
        <Input
          placeholder="Search for your city..."
          prefix={<SearchOutlined style={{ color: '#701a1a' }} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            marginBottom: '20px',
            borderRadius: '8px',
            border: '2px solid #f0f0f0'
          }}
          size="large"
        />

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '12px',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '10px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              Loading cities...
            </div>
          ) : filteredCities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1', color: '#999' }}>
              No cities found
            </div>
          ) : (
            filteredCities.map(city => (
              <div
                key={city._id}
                onClick={() => handleCitySelect(city)}
                style={{
                  padding: '16px',
                  border: selectedCity?._id === city._id ? '2px solid #701a1a' : '2px solid #f0f0f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: selectedCity?._id === city._id ? '#fff5f5' : '#fff',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedCity?._id !== city._id) {
                    e.target.style.borderColor = '#701a1a';
                    e.target.style.backgroundColor = '#fff9f9';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCity?._id !== city._id) {
                    e.target.style.borderColor = '#f0f0f0';
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ 
                  fontWeight: '600', 
                  color: '#701a1a', 
                  fontSize: '16px',
                  marginBottom: '4px'
                }}>
                  {city.name}
                </div>
                <div style={{ 
                  color: '#666', 
                  fontSize: '12px'
                }}>
                  {city.state}
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </>
  );
};

export default CitySelector;