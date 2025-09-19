import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Button, Modal, Form, Input, Switch, Space, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { adminAPI } from '../utils/api';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [form] = Form.useForm();
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const defaultPages = [
    { slug: 'return-refund-policy', title: 'Return and Refund Policy' },
    { slug: 'terms-conditions', title: 'Terms and Conditions' },
    { slug: 'privacy-policy', title: 'Privacy Policy' },
    { slug: 'shipping-policy', title: 'Shipping Policy' }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.get('/pages');
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
    setEditingPage(page);
    form.setFieldsValue({
      title: page.title,
      isActive: page.isActive
    });
    setIsModalVisible(true);
    
    // Set content after modal opens
    setTimeout(() => {
      if (quillInstance.current) {
        quillInstance.current.root.innerHTML = page.content || '';
      }
    }, 100);
  };

  const handleSubmit = async (values) => {
    try {
      const content = quillInstance.current ? quillInstance.current.root.innerHTML : '';
      const data = {
        slug: editingPage.slug,
        title: values.title,
        content: content,
        isActive: values.isActive
      };
      
      await adminAPI.post('/pages', data);
      message.success('Page updated successfully');
      setIsModalVisible(false);
      fetchPages();
    } catch (error) {
      message.error('Failed to update page');
    }
  };

  useEffect(() => {
    if (isModalVisible && quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ]
        }
      });
    }
    
    if (!isModalVisible && quillInstance.current) {
      quillInstance.current = null;
    }
  }, [isModalVisible]);

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
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Page Management">
        <Table
          columns={columns}
          dataSource={pages}
          loading={loading}
          rowKey={(record) => record._id || record.slug}
          pagination={false}
        />
      </Card>

      <Modal
        title="Edit Page"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="title"
            label="Page Title"
            rules={[{ required: true, message: 'Please enter page title' }]}
          >
            <Input placeholder="Enter page title" />
          </Form.Item>

          <Form.Item
            label="Content"
          >
            <div 
              ref={quillRef}
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Page
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pages;