import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons'

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const typeColors: Record<string, string> = {
    sales: 'processing',
    purchase: 'warning',
  }

  const statusColors: Record<string, string> = {
    draft: 'default',
    issued: 'processing',
    paid: 'success',
    cancelled: 'error',
  }

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/finance/invoices')
      const data = await response.json()
      setInvoices(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/finance/invoices-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchInvoices()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/finance/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchInvoices()
  }

  const columns = [
    { title: '发票代码', dataIndex: 'invoiceCode', width: 150 },
    { title: '发票号码', dataIndex: 'invoiceNumber', width: 120 },
    { title: '类型', dataIndex: 'type', width: 80, render: (t: string) => <Tag color={typeColors[t]}>{t === 'sales' ? '销售' : '采购'}</Tag> },
    { title: '客户/供应商', dataIndex: 'customerName', width: 150 },
    { title: '金额', dataIndex: 'amount', width: 120, render: (a: number) => `¥${a.toLocaleString()}` },
    { title: '税额', dataIndex: 'taxAmount', width: 100, render: (t: number) => `¥${t?.toLocaleString()}` },
    { title: '含税金额', key: 'total', width: 120, render: (_: any, r: any) => `¥${(r.amount + (r.taxAmount || 0)).toLocaleString()}` },
    { title: '开票日期', dataIndex: 'issueDate', width: 120, render: (d: string) => d ? new Date(d).toLocaleDateString() : '-' },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<FileTextOutlined />}>查看</Button>
          <Button type="link" size="small">开具</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="发票总数" value={statistics.total || 0} suffix="张" /></Card></Col>
        <Col span={6}><Card><Statistic title="待开具" value={statistics.draft || 0} suffix="张" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已开具" value={statistics.issued || 0} suffix="张" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="发票总额" value={statistics.totalAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#722ed1' }} /></Card></Col>
      </Row>

      <Card
        title="🧾 发票管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建发票</Button>}
      >
        <Table columns={columns} dataSource={invoices} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建发票" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="type" label="发票类型" rules={[{ required: true }]} initialValue="sales">
            <Select><Select.Option value="sales">销售发票</Select.Option><Select.Option value="purchase">采购发票</Select.Option></Select>
          </Form.Item>
          <Form.Item name="customerName" label="客户/供应商" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} prefix="¥" /></Form.Item>
          <Form.Item name="taxRate" label="税率" initialValue={13}><InputNumber style={{ width: '100%' }} suffix="%" /></Form.Item>
          <Form.Item name="issueDate" label="开票日期"><DatePicker style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Invoices
