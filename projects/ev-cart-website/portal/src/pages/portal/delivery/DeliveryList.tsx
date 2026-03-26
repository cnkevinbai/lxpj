import React, { useState, useEffect } from 'react'
import { Table, Card, Button, Tag, Space, Modal, Form, Input, Select, message } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { getDeliveryList, createDelivery, getDeliveryDetail, deliveryNotify } from './service'

interface Delivery {
  id: string
  delivery_no: string
  order_id: string
  customer_name: string
  status: string
  total_amount: number
  created_at: string
}

const DeliveryList: React.FC = () => {
  const [data, setData] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadDeliveries()
  }, [])

  const loadDeliveries = async () => {
    setLoading(true)
    try {
      const result = await getDeliveryList()
      setData(result.data || result)
    } catch (error) {
      console.error('加载发货单失败', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values: any) => {
    try {
      await createDelivery(values)
      message.success('创建发货单成功')
      setModalVisible(false)
      form.resetFields()
      loadDeliveries()
    } catch (error) {
      message.error('创建发货单失败')
    }
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      draft: 'default',
      sent: 'blue',
      delivered: 'green',
      completed: 'green',
    }
    return colorMap[status] || 'default'
  }

  const columns = [
    { title: '发货单号', dataIndex: 'delivery_no', key: 'delivery_no' },
    { title: '销售订单', dataIndex: 'order_id', key: 'order_id' },
    { title: '客户名称', dataIndex: 'customer_name', key: 'customer_name' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { 
      title: '金额', 
      dataIndex: 'total_amount', 
      key: 'total_amount',
      render: (val: number) => <span>¥{val.toLocaleString()}</span>
    },
    { title: '创建日期', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Delivery) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      )
    }
  ]

  return (
    <div className="p-4">
      <Card 
        title="发货单管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            创建发货单
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
        title="创建发货单"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="order_id"
            label="销售订单号"
            rules={[{ required: true, message: '请输入销售订单号' }]}
          >
            <Input placeholder="请输入销售订单号" />
          </Form.Item>

          <Form.Item
            name="customer_id"
            label="客户 ID"
            rules={[{ required: true, message: '请输入客户 ID' }]}
          >
            <Input placeholder="请输入客户 ID" />
          </Form.Item>

          <Form.Item
            name="delivery_address"
            label="收货地址"
            rules={[{ required: true, message: '请输入收货地址' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入收货地址" />
          </Form.Item>

          <Form.Item
            name="logistics_company"
            label="物流公司"
          >
            <Input placeholder="请输入物流公司" />
          </Form.Item>

          <Form.Item
            name="logistics_no"
            label="物流单号"
          >
            <Input placeholder="请输入物流单号" />
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

export default DeliveryList
