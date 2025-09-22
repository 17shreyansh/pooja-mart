import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, Row, Col, Switch, InputNumber, Space, Divider, App, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { poojaCollectionAPI, adminAPI } from '../utils/api';

const CollectionEditor = () => {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) fetchCollection();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchCollection = async () => {
    try {
      const response = await poojaCollectionAPI.getById(id);
      if (response.data.data) {
        const collection = response.data.data;
        form.setFieldsValue({
          ...collection,

          attributes: collection.attributes || []
        });
      }
    } catch (error) {
      message.error('Failed to fetch collection');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('price', values.price);
    formData.append('stock', values.stock);

    formData.append('attributes', JSON.stringify(values.attributes || []));
    formData.append('faqs', JSON.stringify(values.faqs || []));
    formData.append('isActive', values.isActive || true);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (id) {
        await poojaCollectionAPI.update(id, formData);
        message.success('Collection updated successfully');
      } else {
        await poojaCollectionAPI.create(formData);
        message.success('Collection created successfully');
      }
      navigate('/admin/collections');
    } catch (error) {
      message.error('Operation failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/collections')} />
            {id ? 'Edit Collection' : 'Create New Collection'}
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="title" label="Collection Title" rules={[{ required: true }]}>
                <Input placeholder="Enter collection title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select placeholder="Select a category">
                  {categories.map(category => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Detailed description of the collection" />
          </Form.Item>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="price" label="Price (₹)" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter price"
                  min={0}
                  formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/₹\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="stock" label="Stock Quantity" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter stock quantity"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch 
                  checkedChildren="Active" 
                  unCheckedChildren="Inactive"
                  style={{ marginTop: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="image" label="Collection Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>



          <Divider>Attributes</Divider>
          
          <Form.List name="attributes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Attribute name (e.g., Weight)" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Attribute value (e.g., 2.5 kg)" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button
                        type="dashed"
                        onClick={() => remove(name)}
                        icon={<MinusCircleOutlined />}
                        danger
                      />
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                >
                  Add Attribute
                </Button>
              </>
            )}
          </Form.List>

          <Card title="FAQs" style={{ marginBottom: 16 }}>
            <Form.List name="faqs">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: 16 }}>
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            {...restField}
                            name={[name, 'question']}
                            label="Question"
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Enter FAQ question" />
                          </Form.Item>
                        </Col>
                        <Col span={20}>
                          <Form.Item
                            {...restField}
                            name={[name, 'answer']}
                            label="Answer"
                            rules={[{ required: true }]}
                          >
                            <Input.TextArea rows={3} placeholder="Enter FAQ answer" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, 'order']}
                            label="Order"
                          >
                            <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
                          </Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => remove(name)}
                            danger
                            style={{ marginTop: 8, width: '100%' }}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add({ order: fields.length })}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                  >
                    Add FAQ
                  </Button>
                </>
              )}
            </Form.List>
          </Card>

          <Divider />
          
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              {id ? 'Update Collection' : 'Create Collection'}
            </Button>
            <Button onClick={() => navigate('/admin/collections')} size="large">
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default CollectionEditor;