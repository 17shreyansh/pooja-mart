import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, Row, Col, Switch, Space, Select, App, InputNumber } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { poojasAPI, servicesAPI, poojaCollectionAPI, citiesAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const PoojaEditor = () => {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [showcaseFileList, setShowcaseFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [collections, setCollections] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchCollections();
    fetchCities();
    if (id) fetchPooja();
  }, [id]);



  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAllAdmin();
      console.log('Services fetched:', response.data.data);
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      message.error('Failed to fetch services');
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await poojaCollectionAPI.getAllAdmin();
      console.log('Collections fetched:', response.data.data);
      setCollections(response.data.data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      message.error('Failed to fetch collections');
    }
  };

  const fetchCities = async () => {
    try {
      const response = await citiesAPI.getAllAdmin();
      console.log('Cities fetched:', response.data.data);
      setCities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      message.error('Failed to fetch cities');
    }
  };

  const fetchPooja = async () => {
    try {
      const response = await poojasAPI.getById(id);
      const pooja = response.data.data;
      if (pooja) {
        // Set existing images
        if (pooja.image) {
          setFileList([{
            uid: '-1',
            name: 'image.jpg',
            status: 'done',
            url: `${API_BASE_URL}${pooja.image}`
          }]);
        }
        
        if (pooja.showcaseImages && pooja.showcaseImages.length > 0) {
          setShowcaseFileList(pooja.showcaseImages.map((img, index) => ({
            uid: `-${index + 2}`,
            name: `showcase-${index + 1}.jpg`,
            status: 'done',
            url: `${API_BASE_URL}${img}`
          })));
        }
        
        form.setFieldsValue({
          ...pooja,
          service: pooja.service?._id || pooja.service,
          cities: pooja.cities?.map(city => city._id || city) || [],
          packages: pooja.packages?.map(pkg => ({
            ...pkg,
            collections: pkg.collections?.map(col => col._id || col) || []
          })) || []
        });
      }
    } catch (error) {
      message.error('Failed to fetch pooja');
      console.error('Error fetching pooja:', error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('service', values.service);
    formData.append('packages', JSON.stringify(values.packages || []));
    formData.append('faqs', JSON.stringify(values.faqs || []));
    formData.append('cities', JSON.stringify(values.cities || []));
    
    // Handle existing images
    if (id && fileList.length > 0 && !fileList[0].originFileObj) {
      // Keep existing image if no new image uploaded
      formData.append('keepExistingImage', 'true');
    }
    
    if (id && showcaseFileList.length > 0) {
      const existingShowcaseImages = showcaseFileList
        .filter(file => !file.originFileObj)
        .map(file => file.url.split('/uploads/')[1]);
      if (existingShowcaseImages.length > 0) {
        formData.append('keepExistingShowcaseImages', JSON.stringify(existingShowcaseImages));
      }
    }
    formData.append('isActive', values.isActive || true);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }
    
    showcaseFileList.forEach((file, index) => {
      if (file.originFileObj) {
        formData.append('showcaseImages', file.originFileObj);
      }
    });

    try {
      if (id) {
        await poojasAPI.update(id, formData);
        message.success('Pooja updated successfully');
      } else {
        await poojasAPI.create(formData);
        message.success('Pooja created successfully');
      }
      navigate('/admin/poojas');
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
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/poojas')} />
            {id ? 'Edit Pooja' : 'Create New Pooja'}
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input placeholder="Enter pooja title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="service" label="Service Category" rules={[{ required: true }]}>
                <Select placeholder="Select a service category">
                  {services.map(service => (
                    <Select.Option key={service._id} value={service._id}>
                      {service.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="cities" label="Available Cities">
                <Select 
                  mode="multiple" 
                  placeholder="Select cities where this pooja is available"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {cities.map(city => (
                    <Select.Option key={city._id} value={city._id}>
                      {city.name}, {city.state}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Detailed description of the pooja" />
          </Form.Item>

          <Card title="Packages" style={{ marginBottom: 16 }}>
            <Form.List name="packages">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card key={key} size="small" style={{ marginBottom: 16 }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="Package Name"
                            rules={[{ required: true }]}
                          >
                            <Input placeholder="Enter package name" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'price']}
                            label="Price (₹)"
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={0} placeholder="Enter price" style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, 'duration']}
                            label="Duration"
                          >
                            <Input placeholder="e.g., 2 hours" />
                          </Form.Item>
                        </Col>
                        <Col span={20}>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            label="Description"
                            rules={[{ required: true }]}
                          >
                            <Input.TextArea rows={2} placeholder="Package description" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button
                            type="dashed"
                            onClick={() => remove(name)}
                            danger
                            icon={<DeleteOutlined />}
                            style={{ marginTop: 30, width: '100%' }}
                          >
                            Remove
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'includes']}
                            label="What's Included"
                          >
                            <Select
                              mode="tags"
                              placeholder="Add items included in this package"
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, 'collections']}
                            label="Shop Collections"
                          >
                            <Select
                              mode="multiple"
                              placeholder="Select shop collections for this package"
                              options={collections.map(c => ({ label: c.title, value: c._id }))}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                  >
                    Add Package
                  </Button>
                </>
              )}
            </Form.List>
          </Card>



          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="image" label="Main Image">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Upload Main Image</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="showcaseImages" label="Showcase Images">
                <Upload
                  beforeUpload={() => false}
                  multiple
                  fileList={showcaseFileList}
                  onChange={({ fileList }) => setShowcaseFileList(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Upload Showcase Images</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="isActive" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
          </Row>

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
                    icon={<UploadOutlined />}
                    style={{ width: '100%' }}
                  >
                    Add FAQ
                  </Button>
                </>
              )}
            </Form.List>
          </Card>
          
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Update Pooja' : 'Create Pooja'}
            </Button>
            <Button onClick={() => navigate('/admin/poojas')}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default PoojaEditor;