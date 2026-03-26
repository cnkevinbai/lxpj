import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'

const Payables: React.FC = () => {
  const [payables, setPayables] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    partial: 'processing',
    paid: 'success',
    overdue: 'error',
  }

  const statusLabels: Record<string, string> = {
    pending: '待付款',
    partial: '部分付款',
    paid: '已付款',
    overdue: '已逾期',
  }

  const fetchPayables = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/finance/payables')
      const data = await response.json()
      setPayables(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/finance/payables-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchPayables()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/finance/payables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchPayables()
  }

  const columns = [
    { title: '应付单号', dataIndex: 'payableCode', width: 150 },
    { title: '供应商', dataIndex: 'supplierName', width: 200 },
    { title: '采购单号', dataIndex: 'purchaseOrderCode', width: 120 },
    { title: '应付金额', dataIndex: 'amount', width: 120, render: (a: number) => `¥${a.toLocaleString()}` },
    { title: '已付金额', dataIndex: 'paidAmount', width: 120, render: (a: number) => `¥${a?.toLocaleString()}` },
    { title: '未付金额', key: 'balance', width: 120, render: (_: any, r: any) => <span style={{ color: '#ff4d4f' }}>¥${(r.amount - (r.paidAmount || 0)).toLocaleString()}</span> },
    { title: '到期日期', dataIndex: 'dueDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
          <Button type="link" size="small">付款</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="应付总额" value={statistics.totalAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="待付款" value={statistics.pending || 0} suffix="笔" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已付款" value={statistics.paidAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已逾期" value={statistics.overdue || 0} suffix="笔" valueStyle={{ color: '#ff4d4f' }} /></Card></Col>
      </Row>

      <Card
        title="💰 应付账款管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建应付单</Button>}
      >
        <Table columns={columns} dataSource={payables} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建应付单" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="supplierName" label="供应商" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="purchaseOrderCode" label="采购单号"><Input /></Form.Item>
          <Form.Item name="amount" label="应付金额" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} prefix="¥" /></Form.Item>
          <Form.Item name="dueDate" label="到期日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="paymentTerms" label="付款条款"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Payables
