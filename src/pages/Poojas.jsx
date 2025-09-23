import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Empty, Input, Select, Pagination } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { frontendAPI } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PoojaCard from '../components/common/PoojaCard';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';
import image01 from '../assets/image01.png';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#poojas-fonts')) {
  const style = document.createElement('style');
  style.id = 'poojas-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}



const { Option } = Select;

const Poojas = () => {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;
    
    setSelectedCategory(category);
    setSearchTerm(search);
    setSortBy(sort);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    fetchPoojas();
  }, [searchTerm, selectedCategory]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [selectedCategory, searchTerm, sortBy, currentPage, setSearchParams]);

  const fetchPoojas = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await frontendAPI.getPoojas(params);
      let poojaData = response.data.data || [];
      
      // Sort data
      poojaData.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.title.localeCompare(b.title);
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt);
          default: // newest
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
      
      setPoojas(poojaData);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching poojas:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPoojas = poojas.slice(startIndex, endIndex);

  if (loading) {
    return <LoadingSpinner overlay={true} message="Loading poojas..." />;
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        style={{
          backgroundImage: `url(${featuredBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '120px 20px 60px',
          textAlign: 'center',
          fontFamily: 'Poppins, sans-serif',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '600',
            color: '#6B1E1E',
            marginBottom: '20px',
            fontFamily: 'Bastoni'
          }}>
            Book a Pooja
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#691B19',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Experience divine blessings with our authentic pooja services performed by experienced pandits.
          </p>
          
          {/* Search and Filter Bar */}
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <Input
              placeholder="Search poojas..."
              prefix={<SearchOutlined style={{ color: '#691B19' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '25px',
                padding: '8px 20px',
                background: '#fff',
                border: '2px solid #691B19',
                fontFamily: 'Poppins, sans-serif',
                flex: '1',
                minWidth: '250px'
              }}
              size="large"
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{
                width: '150px',
                borderRadius: '25px'
              }}
              size="large"
            >
              <Option value="newest">Newest First</Option>
              <Option value="oldest">Oldest First</Option>
              <Option value="name">Name A-Z</Option>
            </Select>
            {(searchTerm || selectedCategory || sortBy !== 'newest') && (
              <Button 
                onClick={clearFilters}
                style={{
                  borderRadius: '25px',
                  border: '2px solid #691B19',
                  color: '#691B19',
                  background: '#fff'
                }}
                size="large"
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          {/* Decorative Image */}
          <img
            src={image01}
            alt="Pooja Services"
            style={{ 
              maxWidth: '300px', 
              width: '100%', 
              height: 'auto',
              margin: '20px auto'
            }}
          />
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Poojas Grid Section */}
      <section style={{ 
        background: '#fff', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Categories Section */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                onClick={() => setSelectedCategory('')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: '1px solid #691B19',
                  background: selectedCategory === '' ? '#691B19' : 'white',
                  color: selectedCategory === '' ? 'white' : '#691B19',
                  fontSize: '14px'
                }}
              >
                All Poojas
              </Button>
              {categories.map((category) => (
                <Button 
                  key={category._id || category} 
                  onClick={() => setSelectedCategory(category._id || category)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: '1px solid #691B19',
                    background: selectedCategory === (category._id || category) ? '#691B19' : 'white',
                    color: selectedCategory === (category._id || category) ? 'white' : '#691B19',
                    fontSize: '14px'
                  }}
                >
                  {category.name || category}
                </Button>
              ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#6B1E1E',
              fontFamily: 'Bastoni',
              margin: 0
            }}>
              Available Poojas ({poojas.length})
            </h2>
          </div>
          
          <Row gutter={[8, 12]} justify="center">
            {paginatedPoojas.map((pooja) => (
              <Col key={pooja._id} xs={12} sm={12} md={6} lg={6} xl={6}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 4px' }}>
                  <PoojaCard
                    image={pooja.image ? `${import.meta.env.VITE_API_BASE_URL}${pooja.image}` : '/src/assets/fp1.jpg'}
                    title={pooja.title}
                    description={pooja.description}
                    slug={pooja.slug}
                    type="pooja"
                  />
                </div>
              </Col>
            ))}
          </Row>
          {poojas.length === 0 && (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 120 }}
              description={
                <span style={{ fontFamily: 'Poppins, sans-serif', color: '#666', fontSize: '16px' }}>
                  {searchTerm || selectedCategory ? 'No poojas found matching your criteria.' : 'No poojas available at the moment.'}
                </span>
              }
              style={{ padding: '60px 20px' }}
            >
              {(searchTerm || selectedCategory) && (
                <Button 
                  type="primary" 
                  style={{
                    background: '#691B19',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </Empty>
          )}
          
          {/* Pagination */}
          {poojas.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <Pagination
                current={currentPage}
                total={poojas.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} of ${total} poojas`
                }
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
            </div>
          )}
        </div>
      </section>

    </>
  );
};

export default Poojas;