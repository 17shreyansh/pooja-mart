import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Upload, 
  Switch, 
  message, 
  Popconfirm, 
  Tag, 
  Image,
  Card,
  Space,
  InputNumber
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { offersAPI } from '../utils/api';
import { API_BASE_URL } from '../../config/api';

const { TextArea } = Input;


const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await offersAPI.getAllAdmin();
      setOffers(response.data.offers);
    } catch (error) {
      message.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    
    Object.keys(values).forEach(key => {
      if (key !== 'image') {
        formData.append(key, values[key]);
      }
    });

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      if (editingOffer) {
        await offersAPI.update(editingOffer._id, formData);
        message.success('Offer updated successfully');
      } else {
        await offersAPI.create(formData);
        message.success('Offer created successfully');
      }
      
      fetchOffers();
      handleCancel();
    } catch (error) {
      message.error('Failed to save offer');
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    form.setFieldsValue({
      title: offer.title,
      description: offer.description,
      offerType: offer.offerType,
      discountPercentage: offer.discountPercentage,
      buttonText: offer.buttonText,
      isActive: offer.isActive
    });
    
    if (offer.image) {
      setFileList([{
        uid: '-1',
        name: 'current-image',
        status: 'done',
        url: `${API_BASE_URL}${offer.image}`
      }]);
    }
    
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await offersAPI.delete(id);
      message.success('Offer deleted successfully');
      fetchOffers();
    } catch (error) {
      message.error('Failed to delete offer');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingOffer(null);
    form.resetFields();
    setFileList([]);
  };

  const uploadProps = {
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList }) => setFileList(fileList),
    maxCount: 1,
    accept: 'image/*'
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image) => (
        <Image
          width={60}
          height={60}
          src={`${API_BASE_URL}${image}`}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'offerType',
      key: 'offerType',
      render: (type) => {
        const colors = { pooja: 'blue', collection: 'green' };
        const labels = { pooja: 'Pooja', collection: 'Shop Item' };
        return <Tag color={colors[type]}>{labels[type]}</Tag>;
      },
    },
    {
      title: 'Discount',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: (discount) => discount ? `${discount}%` : '-',
    },
    {
      title: 'Button Text',
      dataIndex: 'buttonText',
      key: 'buttonText',
      render: (text) => text || '-',
    },

    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete offer"
            description="Are you sure you want to delete this offer?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Festive Offers Management</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add New Offer
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={offers}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingOffer ? 'Edit Offer' : 'Add New Offer'}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true, offerType: 'pooja' }}
        >
          <Form.Item
            name="title"
            label="Offer Title"
            rules={[{ required: true, message: 'Please enter offer title' }]}
          >
            <Input placeholder="Enter offer title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter offer description" />
          </Form.Item>

          <Form.Item
            name="offerType"
            label="Offer Type"
            rules={[{ required: true, message: 'Please select offer type' }]}
          >
            <Select 
              placeholder="Select offer type"
              options={[
                { value: 'pooja', label: 'Pooja' },
                { value: 'collection', label: 'Shop Item' }
              ]}
            />
          </Form.Item>

          <Form.Item
            name="discountPercentage"
            label="Discount Percentage"
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="Enter discount percentage"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="buttonText"
            label="Button Text"
          >
            <Input placeholder="e.g., View Offer, Book Now" />
          </Form.Item>

          <Form.Item
            label="Upload Image"
            rules={[{ required: !editingOffer, message: 'Please upload an image' }]}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
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
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingOffer ? 'Update' : 'Create'} Offer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Offers;