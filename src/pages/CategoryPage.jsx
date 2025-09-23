import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Row, Col, Card, Select, Input, Pagination, Spin, Empty, Button } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { frontendAPI } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import '../styles/CategoryPage.css';

const { Option } = Select;
const { Search } = Input;

const CategoryPage = () => {
  const { type } = useParams(); // pooja, service, collections
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize] = useState(12);

  useEffect(() => {
    fetchData();
  }, [type]);

  useEffect(() => {
    applyFilters();
  }, [items, selectedCategory, searchTerm, priceRange, sortBy]);

  useEffect(() => {
    updateURL();
  }, [selectedCategory, searchTerm, priceRange, sortBy, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let response, categoriesResponse;
      
      // Fetch items and categories in parallel
      const promises = [];
      
      switch (type) {
        case 'pooja':
          promises.push(frontendAPI.getPoojas());
          break;
        case 'service':
          promises.push(frontendAPI.getServices());
          break;
        case 'collections':
          promises.push(frontendAPI.getCollections());
          break;
        default:
          throw new Error('Invalid category type');
      }
      
      promises.push(frontendAPI.getCategoriesByType(type));
      
      const [itemsResponse, categoriesRes] = await Promise.all(promises);
      
      const data = itemsResponse.data.data || [];
      setItems(data);
      
      // Set categories from the dedicated endpoint
      const categoryData = categoriesRes.data.data || [];
      setCategories(categoryData.map(cat => cat.name));
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to extracting categories from items
      const uniqueCategories = [...new Set(items.map(item => item.category?.name || item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => 
        (item.category?.name || item.category) === selectedCategory
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter (for services and collections)
    if (priceRange && (type === 'service' || type === 'collections')) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(item => {
        const price = item.price || 0;
        if (max) {
          return price >= min && price <= max;
        }
        return price >= min;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (priceRange) params.set('priceRange', priceRange);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setPriceRange('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const getPageTitle = () => {
    switch (type) {
      case 'pooja': return 'Book a Pooja';
      case 'service': return 'Our Services';
      case 'collections': return 'Pooja Collections';
      default: return 'Categories';
    }
  };

  const getItemUrl = (item) => {
    switch (type) {
      case 'pooja': return `/pooja/${item.slug}`;
      case 'service': return `/service/${item.slug}`;
      case 'collections': return `/collection/${item.slug}`;
      default: return '#';
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  if (loading) {
    return <LoadingSpinner overlay={true} message={`Loading ${type}...`} />;
  }

  return (
    <div className="category-page">
      {/* Header */}
      <div className="category-header">
        <h1 className="category-title">
          {getPageTitle()}
        </h1>
        <p className="category-description">
          {type === 'pooja' && 'Discover and book authentic poojas performed by experienced pandits'}
          {type === 'service' && 'Professional spiritual services for all your religious needs'}
          {type === 'collections' && 'Premium pooja items and spiritual collections'}
        </p>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              allowClear
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Col>

          {(type === 'service' || type === 'collections') && (
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Price Range"
                value={priceRange}
                onChange={setPriceRange}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="0-500">₹0 - ₹500</Option>
                <Option value="500-1000">₹500 - ₹1,000</Option>
                <Option value="1000-2500">₹1,000 - ₹2,500</Option>
                <Option value="2500-5000">₹2,500 - ₹5,000</Option>
                <Option value="5000">₹5,000+</Option>
              </Select>
            </Col>
          )}

          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Sort By"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
            >
              <Option value="newest">Newest First</Option>
              <Option value="oldest">Oldest First</Option>
              <Option value="name">Name A-Z</Option>
              {(type === 'service' || type === 'collections') && (
                <>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                </>
              )}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Button 
              onClick={clearFilters}
              icon={<FilterOutlined />}
              style={{ width: '100%' }}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </div>

      {/* Results Count */}
      <div className="results-count">
        Showing {paginatedItems.length} of {filteredItems.length} results
      </div>

      {/* Items Grid */}
      {paginatedItems.length === 0 ? (
        <div className="empty-state">
          <Empty description="No items found matching your criteria" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {paginatedItems.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <Card
                hoverable
                className="item-card"
                cover={
                  <img
                    alt={item.title}
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${item.image}`}
                  />
                }
                onClick={() => window.location.href = getItemUrl(item)}
              >
                <Card.Meta
                  title={
                    <div className="item-title">
                      {item.title}
                    </div>
                  }
                  description={
                    <div>
                      <p className="item-description">
                        {item.description}
                      </p>
                      
                      <div className="item-meta">
                        <span className="item-category">
                          {item.category?.name || item.category}
                        </span>
                        
                        {item.price && (
                          <span className="item-price">
                            ₹{item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      {filteredItems.length > pageSize && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={filteredItems.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      )}
    </div>
  );
};

export default CategoryPage;