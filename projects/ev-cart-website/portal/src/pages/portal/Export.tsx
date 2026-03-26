import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col, Descriptions } from 'antd'
import { PlusOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons'

const Export: React.FC = () => {
  const [orders, setOrders] = useState([])
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'processing',
    production: 'processing',
    shipped: 'success',
    completed: 'success',
    cancelled: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待确认',
    approved: '已确认',
    production: '生产中',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }

  const fetchOrders = async () => {
    const response = await fetch('/api/v1/export/orders')
    const data = await response.json()
    setOrders(data.data || [])
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/export/statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchOrders()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/export/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchOrders()
  }

  const columns = [
    { title: '外贸单号', dataIndex: 'exportCode', width: 150 },
    { title: '客户', dataIndex: 'customerName', width: 150 },
    { title: '国家', dataIndex: 'country', width: 100 },
    { title: '币种', dataIndex: 'currency', width: 60 },
    { title: '订单金额', dataIndex: 'totalAmount', width: 120, render: (a: number, r: any) => `${a} ${r.currency}` },
    { title: '订单日期', dataIndex: 'orderDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag> },
    { title: '海关状态', dataIndex: 'customsStatus', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
          <Button type="link" size="small" icon={<FileTextOutlined />}>单据</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="外贸订单" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="待确认" value={statistics.pending || 0} suffix="个" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="订单总额" value={statistics.totalAmount || 0} prefix="$" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={statistics.completed || 0} suffix="个" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="🌍 外贸管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建外贸单</Button>}
      >
        <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建外贸订单" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="customerName" label="客户名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="country" label="国家" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="currency" label="币种" initialValue="USD">
            <Select><Select.Option value="USD">美元</Select.Option><Select.Option value="EUR">欧元</Select.Option><Select.Option value="GBP">英镑</Select.Option></Select>
          </Form.Item>
          <Form.Item name="totalAmount" label="订单金额" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} prefix="$" /></Form.Item>
          <Form.Item name="portOfLoading" label="装运港"><Input /></Form.Item>
          <Form.Item name="portOfDischarge" label="目的港"><Input /></Form.Item>
          <Form.Item name="paymentTerms" label="付款条款"><Input.TextArea rows={2} placeholder="如：T/T 30% deposit, balance before shipment" /></Form.Item>
          <Form.Item name="notes" label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Export
