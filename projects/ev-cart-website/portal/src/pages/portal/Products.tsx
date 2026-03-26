import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Upload, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import apiClient from '../../services/api'
import type { UploadProps } from 'antd'

const { TextArea } = Input

const ProductList: React.FC = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/products', {
        params: { page, limit: 20 }
      })
      setData(response.data.data)
      setTotal(response.data.total)
    } catch (error) {
      message.error('加载失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const handleCreate = async (values: any) => {
    try {
      if (editingId) {
        await apiClient.put(`/products/${editingId}`, values)
        message.success('更新成功')
      } else {
        await apiClient.post('/products', values)
        message.success('创建成功')
      }
      setModalVisible(false)
      setEditingId(null)
      form.resetFields()
      fetchData()
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败')
    }
  }

  const handleEdit = (record: any) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/products/${id}`)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const uploadProps: UploadProps = {
    action: 'http://localhost:3001/api/v1/upload',
    listType: 'picture-card',
    maxCount: 5,
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: '座位数',
      dataIndex: 'passengerCapacity',
      key: 'passengerCapacity',
      render: (seats: number) => `${seats}座`,
    },
    {
      title: '续航',
      dataIndex: 'rangeKm',
      key: 'rangeKm',
      render: (range: number) => `${range}km`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'gray'}>
          {status === 'active' ? '在售' : '停产'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />}>详情</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">产品管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setEditingId(null)
            form.resetFields()
            setModalVisible(true)
          }}
        >
          新建产品
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: 20,
            total: total,
            onChange: (p) => setPage(p),
          }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑产品' : '新建产品'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingId(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="name" label="产品名称" rules={[{ required: true }]}>
              <Input placeholder="请输入产品名称" />
            </Form.Item>
            <Form.Item name="model" label="型号" rules={[{ required: true }]}>
              <Input placeholder="请输入型号" />
            </Form.Item>
            <Form.Item name="category" label="类别" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="观光车">观光车</Select.Option>
                <Select.Option value="巡逻车">巡逻车</Select.Option>
                <Select.Option value="货车">货车</Select.Option>
                <Select.Option value="巴士">巴士</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="passengerCapacity" label="座位数" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入座位数" />
            </Form.Item>
            <Form.Item name="rangeKm" label="续航里程 (km)">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入续航里程" />
            </Form.Item>
            <Form.Item name="maxSpeed" label="最高时速 (km/h)">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入最高时速" />
            </Form.Item>
            <Form.Item name="batteryType" label="电池类型">
              <Input placeholder="请输入电池类型" />
            </Form.Item>
            <Form.Item name="chargeTime" label="充电时间">
              <Input placeholder="请输入充电时间" />
            </Form.Item>
            <Form.Item name="motorPower" label="电机功率">
              <Input placeholder="请输入电机功率" />
            </Form.Item>
            <Form.Item name="priceRange" label="价格区间">
              <Input placeholder="请输入价格区间" />
            </Form.Item>
            <Form.Item name="status" label="状态" initialValue="active">
              <Select>
                <Select.Option value="active">在售</Select.Option>
                <Select.Option value="discontinued">停产</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="features" label="产品特色">
            <TextArea rows={3} placeholder="请输入产品特色，多个特色用逗号分隔" />
          </Form.Item>
          <Form.Item label="产品图片">
            <Upload {...uploadProps}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductList
