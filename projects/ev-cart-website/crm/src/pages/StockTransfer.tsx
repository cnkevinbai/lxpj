import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message, Statistic, Row, Col, Descriptions } from 'antd'
import { PlusOutlined, SwapOutlined } from '@ant-design/icons'

const StockTransfer: React.FC = () => {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'processing',
    completed: 'success',
    cancelled: 'error',
  }

  const fetchTransfers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/inventory/transfers')
      const data = await response.json()
      setTransfers(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/inventory/transfers-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchTransfers()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/inventory/transfers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchTransfers()
  }

  const columns = [
    { title: '调拨单号', dataIndex: 'transferCode', width: 150 },
    { title: '调出仓库', dataIndex: 'fromWarehouseName', width: 150 },
    { title: '调入仓库', dataIndex: 'toWarehouseName', width: 150 },
    { title: 'item 总数', dataIndex: 'totalItems', width: 80 },
    { title: '创建日期', dataIndex: 'createdAt', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small" icon={<SwapOutlined />}>调拨</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="调拨单总数" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="待审批" value={statistics.pending || 0} suffix="个" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={statistics.completed || 0} suffix="个" valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="调拨 item 数" value={statistics.totalItems || 0} suffix="个" valueStyle={{ color: '#1890ff' }} /></Card></Col>
      </Row>

      <Card
        title="🔄 库存调拨管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建调拨单</Button>}
      >
        <Table columns={columns} dataSource={transfers} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建调拨单" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="fromWarehouseName" label="调出仓库" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="toWarehouseName" label="调入仓库" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="notes" label="调拨原因"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StockTransfer
