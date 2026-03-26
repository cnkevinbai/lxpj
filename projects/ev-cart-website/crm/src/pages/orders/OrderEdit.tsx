import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, InputNumber, Select, DatePicker, Button, Card, message, Space, Divider, Row, Col, Spin, Alert, Table } from 'antd'
import { SaveOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

interface Order {
  id: string
  orderCode: string
  customerId: string
  customerName: string
  orderDate: string
  deliveryDate: string
  totalAmount: number
  status: string
  paymentStatus: string
  shippingAddress: string
  salesRepName: string
  items: OrderItem[]
  notes: string
}

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
}

const OrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    setFetchLoading(true)
    try {
      // TODO: 调用 API
      const mockData: Order = {
        id: id || '1',
        orderCode: 'ORD20260310001',
        customerId: 'C001',
        customerName: '某某公司',
        orderDate: '2026-03-10',
        deliveryDate: '2026-03-20',
        totalAmount: 45000,
        status: 'processing',
        paymentStatus: 'partial',
        shippingAddress: '北京市朝阳区 xxx 路 xxx 号',
        salesRepName: '张三',
        notes: '请尽快发货',
        items: [
          { id: '1', productId: 'P001', productName: '智能换电柜 V3', quantity: 2, unitPrice: 15000, discount: 5, taxRate: 13 },
          { id: '2', productId: 'P002', productName: '锂电池 48V', quantity: 10, unitPrice: 1200, discount: 0, taxRate: 13 },
        ],
      }
      
      setOrder(mockData)
      setItems(mockData.items)
      form.setFieldsValue({
        ...mockData,
        orderDate: mockData.orderDate,
        deliveryDate: mockData.deliveryDate,
      })
    } catch (error) {
      message.error('加载订单信息失败')
    } finally {
      setFetchLoading(false)
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/v1/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, items }),
      })

      if (response.ok) {
        message.success('更新订单成功')
        navigate('/orders')
      } else {
        const error = await response.json()
        message.error(error.message || '更新失败')
      }
    } catch (error) {
      message.error('更新失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productId: '', productName: '', quantity: 1, unitPrice: 0, discount: 0, taxRate: 13 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  if (fetchLoading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" tip="加载中..." /></div>
  }

  if (!order) {
    return (
      <Alert
        message="订单不存在"
        description="该订单可能已被删除"
        type="error"
        showIcon
        action={<Button size="small" onClick={() => navigate('/orders')}>返回订单列表</Button>}
      />
    )
  }

  const itemColumns = [
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      render: (_: any, record: any, index: number) => (
        <Input
          value={record.productName}
          onChange={(e) => updateItem(index, 'productName', e.target.value)}
          placeholder="选择产品"
        />
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 100,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateItem(index, 'quantity', value || 1)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 120,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          min={0}
          value={record.unitPrice}
          onChange={(value) => updateItem(index, 'unitPrice', value || 0)}
          formatter={(v) => `¥${Number(v).toLocaleString()}`}
          parser={(v) => Number(v?.replace(/¥\s?|(,*)/g, ''))}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '折扣%',
      dataIndex: 'discount',
      width: 80,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          min={0}
          max={100}
          value={record.discount}
          onChange={(value) => updateItem(index, 'discount', value || 0)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => removeItem(index)} />
      ),
    },
  ]

  return (
    <div>
      <Card
        title="编辑订单"
        extra={
          <Space>
            <Button icon={<CloseOutlined />} onClick={() => navigate('/orders')}>
              取消
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={loading}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Divider orientation="left">订单信息</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="orderCode"
                label="订单编号"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="订单状态"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="pending">待处理</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salesRepName"
                label="销售代表"
              >
                <Input placeholder="请输入销售代表" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="orderDate"
                label="订单日期"
                rules={[{ required: true, message: '请选择订单日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deliveryDate"
                label="交付日期"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="shippingAddress"
                label="收货地址"
                rules={[{ required: true, message: '请输入收货地址' }]}
              >
                <TextArea rows={2} placeholder="请输入详细收货地址" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">订单商品</Divider>

          <Table
            columns={itemColumns}
            dataSource={items}
            rowKey="id"
            pagination={false}
            size="small"
            footer={() => (
              <Button type="dashed" onClick={addItem} icon={<PlusOutlined />} block>
                添加商品
              </Button>
            )}
          />

          <Divider orientation="left">备注信息</Divider>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="notes" label="订单备注">
                <TextArea rows={3} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default OrderEdit
