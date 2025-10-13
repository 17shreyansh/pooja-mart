import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, message } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';

const Pages = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultPages = [
    { slug: 'return-refund-policy', title: 'Return and Refund Policy' },
    { slug: 'terms-conditions', title: 'Terms and Conditions' },
    { slug: 'privacy-policy', title: 'Privacy Policy' },
    { slug: 'shipping-policy', title: 'Shipping Policy' },
    { slug: 'faqs', title: 'Frequently Asked Questions' }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.get('/pages/admin/all');
      const existingPages = response.data.data;
      
      // Create missing default pages
      const existingSlugs = existingPages.map(p => p.slug);
      const missingPages = defaultPages.filter(p => !existingSlugs.includes(p.slug));
      
      const allPages = [...existingPages];
      for (const page of missingPages) {
        allPages.push({
          ...page,
          content: `<h1>${page.title}</h1><p>Content will be updated soon.</p>`,
          isActive: true,
          _id: `temp-${page.slug}`
        });
      }
      
      setPages(allPages);
    } catch (error) {
      message.error('Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    navigate(`/admin/pages/edit/${page.slug}`);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <code>{slug}</code>
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <span style={{ color: isActive ? '#52c41a' : '#ff4d4f' }}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => window.open(`/policy/${record.slug}`, '_blank')}
          >
            View
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Page Management - Policies & Legal Documents">
        <Table
          columns={columns}
          dataSource={pages}
          loading={loading}
          rowKey={(record) => record._id || record.slug}
          pagination={false}
        />
      </Card>


    </div>
  );
};

export default Pages;