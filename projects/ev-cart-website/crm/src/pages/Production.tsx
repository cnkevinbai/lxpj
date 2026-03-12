import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, message, Statistic, Row, Col, Progress } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'

const Production: React.FC = () => {
  const [orders, setOrders] = useState([])
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    pending: 'warning',
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

  const fetchOrders = async () => {
    const response = await fetch('/api/v1/production/orders')
    const data = await response.json()
    setOrders(data.data || [])
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/production/statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchOrders()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/production/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchOrders()
  }

  const columns = [
    { title: '工单号', dataIndex: 'moCode', width: 150 },
    { title: '产品', dataIndex: 'productName', width: 200 },
    { title: '计划数量', dataIndex: 'plannedQuantity', width: 100 },
    { title: '完成数量', dataIndex: 'completedQuantity', width: 100 },
    { 
      title: '进度', 
      key: 'progress', 
      width: 150,
      render: (_: any, record: any) => (
        <Progress 
          percent={record.plannedQuantity > 0 ? (record.completedQuantity / record.plannedQuantity) * 100 : 0} 
          size="small"
          strokeColor={record.completedQuantity >= record.plannedQuantity ? '#52c41a' : '#1890ff'}
        />
      )
    },
    { title: '优先级', dataIndex: 'priority', width: 80, render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag> },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '生产线', dataIndex: 'productionLine', width: 120 },
    { title: '负责人', dataIndex: 'supervisor', width: 100 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />}>详情</Button>
          <Button type="link" size="small">报工</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="生产工单" value={statistics.total || 0} suffix="个" /></Card></Col>
        <Col span={6}><Card><Statistic title="待生产" value={statistics.pending || 0} suffix="个" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="生产中" value={statistics.processing || 0} suffix="个" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已完成" value={statistics.completed || 0} suffix="个" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="🏭 生产管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建工单</Button>}
      >
        <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建生产工单" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="productName" label="产品名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="productCode" label="产品编码"><Input /></Form.Item>
          <Form.Item name="plannedQuantity" label="计划数量" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="priority" label="优先级" initialValue="normal">
            <Select><Select.Option value="low">低</Select.Option><Select.Option value="normal">普通</Select.Option><Select.Option value="high">高</Select.Option><Select.Option value="urgent">紧急</Select.Option></Select>
          </Form.Item>
          <Form.Item name="productionLine" label="生产线"><Input /></Form.Item>
          <Form.Item name="supervisor" label="负责人"><Input /></Form.Item>
          <Form.Item name="notes" label="备注"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Production
