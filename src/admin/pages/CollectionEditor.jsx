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
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
    if (id) fetchCollection();
  }, [id]);

  const fetchServices = async () => {
    try {
      const response = await adminAPI.get('/services');
      setServices(response.data.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
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
      message.error('Failed to fetch shop item');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('service', values.service);
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
        message.success('Shop item updated successfully');
      } else {
        await poojaCollectionAPI.create(formData);
        message.success('Shop item created successfully');
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
            {id ? 'Edit Shop Item' : 'Create New Shop Item'}
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="title" label="Item Title" rules={[{ required: true }]}>
                <Input placeholder="Enter item title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="service" label="Service" rules={[{ required: true }]}>
                <Select placeholder="Select a service">
                  {services.map(service => (
                    <Select.Option key={service._id} value={service._id}>
                      {service.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Detailed description of the item" />
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

          <Form.Item name="image" label="Item Image">
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
              {id ? 'Update Shop Item' : 'Create Shop Item'}
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