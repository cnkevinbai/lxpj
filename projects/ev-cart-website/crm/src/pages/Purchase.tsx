import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'

const Purchase: React.FC = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'processing',
    partial: 'processing',
    completed: 'success',
    cancelled: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待审批',
    approved: '已审批',
    partial: '部分入库',
    completed: '已完成',
    cancelled: '已取消',
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/purchase/orders')
      const data = await response.json()
      setOrders(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/purchase/statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchOrders()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    try {
      await fetch('/api/v1/purchase/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      message.success('创建成功')
      setCreateVisible(false)
      fetchOrders()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const columns = [
    { title: '采购单号', dataIndex: 'poCode', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', width: 200 },
    { title: '采购日期', dataIndex: 'orderDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '预计交付', dataIndex: 'expectedDeliveryDate', width: 120, render: (d: string) => d ? new Date(d).toLocaleDateString() : '-' },
    { title: '采购金额', dataIndex: 'totalAmount', width: 120, render: (a: number) => `¥${a.toLocaleString()}` },
    { title: '已付金额', dataIndex: 'paidAmount', width: 120, render: (a: number) => `¥${a?.toLocaleString()}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag> },
    { title: '采购员', dataIndex: 'purchaserName', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
          <Button type="link" size="small">入库</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="采购订单" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="待审批" value={statistics.pending || 0} suffix="个" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="采购总额" value={statistics.totalAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已付款" value={statistics.paidAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="📦 采购管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建采购单</Button>}
      >
        <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建采购单" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="supplierName" label="供应商" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="expectedDeliveryDate" label="预计交付日期"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="totalAmount" label="采购金额" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} prefix="¥" /></Form.Item>
          <Form.Item name="shippingAddress" label="收货地址"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="notes" label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Purchase
