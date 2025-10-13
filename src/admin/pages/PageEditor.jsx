import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, Input, Switch, Space, message, Breadcrumb } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { adminAPI } from '../utils/api';

const PageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const policyTitles = {
    'return-refund-policy': 'Return and Refund Policy',
    'terms-conditions': 'Terms and Conditions',
    'privacy-policy': 'Privacy Policy',
    'shipping-policy': 'Shipping Policy',
    'faqs': 'Frequently Asked Questions'
  };

  useEffect(() => {
    if (slug) {
      fetchPage();
    }
    initQuill();
    
    return () => {
      if (quillInstance.current) {
        quillInstance.current = null;
      }
    };
  }, [slug]);

  const initQuill = () => {
    setTimeout(() => {
      if (quillRef.current && !quillInstance.current) {
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
    }, 100);
  };

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.get('/pages/admin/all');
      const page = response.data.data.find(p => p.slug === slug);
      
      if (page) {
        form.setFieldsValue({
          title: page.title,
          isActive: page.isActive
        });
        
        setTimeout(() => {
          if (quillInstance.current) {
            quillInstance.current.root.innerHTML = page.content || '';
          }
        }, 200);
      } else {
        form.setFieldsValue({
          title: policyTitles[slug] || '',
          isActive: true
        });
      }
    } catch (error) {
      message.error('Failed to fetch page');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      const content = quillInstance.current ? quillInstance.current.root.innerHTML : '';
      
      await adminAPI.post('/pages', {
        slug,
        title: values.title,
        content,
        isActive: values.isActive
      });
      
      message.success('Page saved successfully');
      navigate('/admin/pages');
    } catch (error) {
      message.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: '24px' }}>
        <Breadcrumb.Item>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/admin/pages')}
            style={{ padding: 0 }}
          >
            Pages
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit Page</Breadcrumb.Item>
      </Breadcrumb>

      <Card 
        title={`Edit: ${policyTitles[slug] || slug}`}
        loading={loading}
        extra={
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => window.open(`/policy/${slug}`, '_blank')}
            >
              Preview
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={() => form.submit()}
              style={{ background: '#5c1f1f', borderColor: '#5c1f1f' }}
            >
              Save Page
            </Button>
          </Space>
        }
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
            <Input size="large" placeholder="Enter page title" />
          </Form.Item>

          <Form.Item label="Content">
            <div 
              ref={quillRef}
              style={{ 
                height: '400px', 
                marginBottom: '50px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PageEditor;