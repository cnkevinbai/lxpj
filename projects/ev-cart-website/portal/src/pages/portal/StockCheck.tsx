import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col, Progress } from 'antd'
import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

const StockCheck: React.FC = () => {
  const [checks, setChecks] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    processing: 'processing',
    completed: 'success',
    cancelled: 'error',
  }

  const fetchChecks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/inventory/checks')
      const data = await response.json()
      setChecks(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/inventory/checks-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchChecks()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/inventory/checks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchChecks()
  }

  const columns = [
    { title: '盘点单号', dataIndex: 'checkCode', width: 150 },
    { title: '仓库', dataIndex: 'warehouseName', width: 150 },
    { title: '盘点日期', dataIndex: 'checkDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '总item 数', dataIndex: 'totalItems', width: 100 },
    { title: '已盘点', dataIndex: 'checkedItems', width: 100 },
    { title: '差异数', dataIndex: 'discrepancyItems', width: 100 },
    { title: '进度', key: 'progress', width: 150, render: (_: any, r: any) => <Progress percent={r.totalItems > 0 ? (r.checkedItems / r.totalItems) * 100 : 0} size="small" /> },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">盘点</Button>
          <Button type="link" size="small" icon={<CheckOutlined />}>完成</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="盘点单总数" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="待盘点" value={statistics.pending || 0} suffix="个" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="盘点中" value={statistics.processing || 0} suffix="个" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={statistics.completed || 0} suffix="个" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="📋 库存盘点管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建盘点单</Button>}
      >
        <Table columns={columns} dataSource={checks} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建盘点单" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="warehouseName" label="仓库" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="checkDate" label="盘点日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="notes" label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StockCheck
