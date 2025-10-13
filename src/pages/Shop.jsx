import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Input, Select, Empty, Pagination } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { frontendAPI } from '../utils/api';
import PoojaCard from '../components/common/PoojaCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import featuredBG from '../assets/featuredBG.png';
import bottomStrip from '../assets/bottom-strip.png';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#shop-fonts')) {
  const style = document.createElement('style');
  style.id = 'shop-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const { Option } = Select;

const Shop = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const price = searchParams.get('priceRange') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    
    setSelectedCategory(category);
    setSearchTerm(search);
    setSortBy(sort);
    setPriceRange(price);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    fetchItems();
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (priceRange) params.set('priceRange', priceRange);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [selectedCategory, searchTerm, sortBy, priceRange, currentPage, setSearchParams]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      console.log('Fetching collections with params:', params);
      let response;
      let itemData = [];
      let categoriesData = [];
      
      try {
        // Try to fetch collections first
        response = await frontendAPI.getCollections(params);
        console.log('Collections API Response:', response.data);
        itemData = response.data.data || response.data || [];
        categoriesData = response.data.services || response.data.categories || [];
      } catch (collectionError) {
        console.log('Collections not available, trying poojas:', collectionError.message);
        // Fallback to poojas if collections fail
        try {
          response = await frontendAPI.getPoojas(params);
          console.log('Poojas API Response:', response.data);
          itemData = response.data.data || response.data || [];
          categoriesData = response.data.categories || [];
        } catch (poojaError) {
          console.error('Both collections and poojas failed:', poojaError.message);
          throw poojaError;
        }
      }
      
      // Apply price filter
      if (priceRange && itemData.length > 0) {
        const [min, max] = priceRange.split('-').map(Number);
        itemData = itemData.filter(item => {
          const price = item.price || 0;
          if (max) {
            return price >= min && price <= max;
          }
          return price >= min;
        });
      }
      
      // Sort data
      if (itemData.length > 0) {
        itemData.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return (a.price || 0) - (b.price || 0);
            case 'price-high':
              return (b.price || 0) - (a.price || 0);
            case 'name':
              return (a.title || '').localeCompare(b.title || '');
            case 'oldest':
              return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            default: // newest
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          }
        });
      }
      
      setItems(itemData);
      setCategories(categoriesData);
      console.log('Final items set:', itemData.length, 'items');
      console.log('Categories data:', categoriesData);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
    setPriceRange('');
    setCurrentPage(1);
  };

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div style={{ 
        padding: '120px 20px', 
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <LoadingSpinner 
          size="large" 
          message="Loading Shop Items..." 
          showMessage={true}
        />
      </div>
    );
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
            Shop Pooja Collections
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#691B19',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            Discover authentic pooja items, samagri, and divine essentials for your spiritual journey.
          </p>
          
          {/* Search and Filter Bar */}
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Input
              placeholder="Search pooja items..."
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
                minWidth: '200px'
              }}
              size="large"
            />
            <Select
              placeholder="Price Range"
              value={priceRange}
              onChange={setPriceRange}
              style={{
                width: '150px',
                borderRadius: '25px'
              }}
              size="large"
              allowClear
            >
              <Option value="0-500">₹0 - ₹500</Option>
              <Option value="500-1000">₹500 - ₹1,000</Option>
              <Option value="1000-2500">₹1,000 - ₹2,500</Option>
              <Option value="2500-5000">₹2,500 - ₹5,000</Option>
              <Option value="5000">₹5,000+</Option>
            </Select>
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
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
            </Select>
            {(searchTerm || selectedCategory || sortBy !== 'newest' || priceRange) && (
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
                Clear
              </Button>
            )}
          </div>
        </div>
        <img
          src={bottomStrip}
          alt="Decorative Strip"
          style={{ width: '100%', height: 'auto', display: 'block', position: 'absolute', bottom: 0, left: 0 }}
        />
      </section>

      {/* Categories Section */}
      <section style={{ padding: '30px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
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
              All Categories
            </Button>
            {categories.map((category) => {
              const categoryId = typeof category === 'string' ? category : category._id;
              const categoryName = typeof category === 'string' ? category : category.name;
              return (
                <Button 
                  key={categoryId}
                  onClick={() => setSelectedCategory(categoryId)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: '1px solid #691B19',
                    background: selectedCategory === categoryId ? '#691B19' : 'white',
                    color: selectedCategory === categoryId ? 'white' : '#691B19',
                    fontSize: '14px'
                  }}
                >
                  {String(categoryName)}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section style={{ 
        background: '#fff', 
        padding: '60px 20px',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#6B1E1E',
              fontFamily: 'Bastoni',
              margin: 0
            }}>
              All Products ({items.length})
            </h2>
          </div>
          
          <Row gutter={[8, 12]} justify="center">
            {paginatedItems.map((item) => (
              <Col key={item._id} xs={12} sm={12} md={6} lg={6} xl={6}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 4px' }}>
                  <PoojaCard
                    image={item.image ? `${import.meta.env.VITE_API_BASE_URL}${item.image}` : '/src/assets/fp2.jpg'}
                    title={item.title}
                    description={item.description}
                    slug={item.slug}
                    type="collection"
                  />
                </div>
              </Col>
            ))}
          </Row>
          
          {items.length === 0 && (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 120 }}
              description={
                <span style={{ fontFamily: 'Poppins, sans-serif', color: '#666', fontSize: '16px' }}>
                  {searchTerm || selectedCategory || priceRange ? 'No items found matching your criteria.' : 'No items available at the moment.'}
                </span>
              }
              style={{ padding: '60px 20px' }}
            >
              {(searchTerm || selectedCategory || priceRange) && (
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
          {items.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <Pagination
                current={currentPage}
                total={items.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => 
                  `${range[0]}-${range[1]} of ${total} items`
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

export default Shop;