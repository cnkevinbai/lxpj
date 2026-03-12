import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col, Progress } from 'antd'
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons'

const ProductionPlan: React.FC = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'processing',
    processing: 'processing',
    completed: 'success',
    cancelled: 'error',
  }

  const priorityColors: Record<string, string> = {
    low: 'default',
    normal: 'processing',
    high: 'warning',
    urgent: 'error',
  }

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/production/plans')
      const data = await response.json()
      setPlans(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/production/plans-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchPlans()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/production/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchPlans()
  }

  const columns = [
    { title: '计划号', dataIndex: 'planCode', width: 150 },
    { title: '产品', dataIndex: 'productName', width: 200 },
    { title: '计划数量', dataIndex: 'plannedQuantity', width: 100 },
    { title: '已完成', dataIndex: 'completedQuantity', width: 100 },
    { title: '进度', key: 'progress', width: 150, render: (_: any, r: any) => <Progress percent={r.plannedQuantity > 0 ? (r.completedQuantity / r.plannedQuantity) * 100 : 0} size="small" /> },
    { title: '优先级', dataIndex: 'priority', width: 80, render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag> },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '开始日期', dataIndex: 'startDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '结束日期', dataIndex: 'endDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<CalendarOutlined />}>排程</Button>
          <Button type="link" size="small">详情</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="生产计划" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="待排产" value={statistics.pending || 0} suffix="个" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="生产中" value={statistics.processing || 0} suffix="个" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={statistics.completed || 0} suffix="个" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="📅 生产计划管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建计划</Button>}
      >
        <Table columns={columns} dataSource={plans} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建生产计划" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="productName" label="产品名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="plannedQuantity" label="计划数量" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="priority" label="优先级" initialValue="normal">
            <Select><Select.Option value="low">低</Select.Option><Select.Option value="normal">普通</Select.Option><Select.Option value="high">高</Select.Option><Select.Option value="urgent">紧急</Select.Option></Select>
          </Form.Item>
          <Form.Item name="startDate" label="开始日期" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="endDate" label="结束日期"><DatePicker style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductionPlan
