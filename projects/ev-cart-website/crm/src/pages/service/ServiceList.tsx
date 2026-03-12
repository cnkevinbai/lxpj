import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, Select, message, Descriptions } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { serviceApi } from '@/services/service'

interface ServiceRequest {
  id: string
  request_no: string
  customer_name: string
  product_name: string
  issue_type: string
  status: string
  created_at: string
}

const { TextArea } = Input

const ServiceList: React.FC = () => {
  const [data, setData] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const result = await serviceApi.getList()
      setData(result)
    } catch (error) {
      console.error('加载服务请求失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: any) => {
    try {
      await serviceApi.create(values)
      message.success('创建服务请求成功')
      setModalVisible(false)
      form.resetFields()
      loadServices()
    } catch (error) {
      message.error('创建服务请求失败')
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'orange',
      processing: 'blue',
      completed: 'green',
      closed: 'default',
    }
    return colorMap[status] || 'default'
  }

  const columns = [
    { title: '服务单号', dataIndex: 'request_no', key: 'request_no' },
    { title: '客户名称', dataIndex: 'customer_name', key: 'customer_name' },
    { title: '产品名称', dataIndex: 'product_name', key: 'product_name' },
    { 
      title: '问题类型', 
      dataIndex: 'issue_type', 
      key: 'issue_type',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          repair: '维修',
          maintenance: '保养',
          complaint: '投诉',
          consultation: '咨询',
        }
        return typeMap[type] || type
      }
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { title: '创建日期', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ServiceRequest) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      )
    }
  ]

  return (
    <div className="p-4">
      <Card 
        title="售后服务管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            创建服务请求
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      </Card>

      <Modal
        title="创建服务请求"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="customer_id"
            label="客户 ID"
            rules={[{ required: true, message: '请输入客户 ID' }]}
          >
            <Input placeholder="请输入客户 ID" />
          </Form.Item>

          <Form.Item
            name="customer_name"
            label="客户名称"
            rules={[{ required: true, message: '请输入客户名称' }]}
          >
            <Input placeholder="请输入客户名称" />
          </Form.Item>

          <Form.Item
            name="product_id"
            label="产品 ID"
            rules={[{ required: true, message: '请输入产品 ID' }]}
          >
            <Input placeholder="请输入产品 ID" />
          </Form.Item>

          <Form.Item
            name="product_name"
            label="产品名称"
            rules={[{ required: true, message: '请输入产品名称' }]}
          >
            <Input placeholder="请输入产品名称" />
          </Form.Item>

          <Form.Item
            name="issue_type"
            label="问题类型"
            rules={[{ required: true, message: '请选择问题类型' }]}
          >
            <Select placeholder="请选择问题类型">
              <Select.Option value="repair">维修</Select.Option>
              <Select.Option value="maintenance">保养</Select.Option>
              <Select.Option value="complaint">投诉</Select.Option>
              <Select.Option value="consultation">咨询</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="问题描述"
            rules={[{ required: true, message: '请输入问题描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述问题" />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-2">
              <Button type="primary" htmlType="submit">创建</Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ServiceList
