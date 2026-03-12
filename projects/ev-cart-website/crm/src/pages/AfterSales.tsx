import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const AfterSales: React.FC = () => {
  const [requests, setRequests] = useState([])
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()

  const priorityColors: Record<string, string> = {
    low: 'default',
    normal: 'processing',
    high: 'warning',
    urgent: 'error',
  }

  const statusColors: Record<string, string> = {
    pending: 'warning',
    processing: 'processing',
    resolved: 'success',
    closed: 'default',
  }

  const fetchRequests = async () => {
    const response = await fetch('/api/v1/service/requests')
    const data = await response.json()
    setRequests(data.data || [])
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/service/statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchRequests()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/service/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchRequests()
  }

  const columns = [
    { title: '请求编号', dataIndex: 'requestCode', width: 150 },
    { title: '客户名称', dataIndex: 'customerName', width: 120 },
    { title: '请求类型', dataIndex: 'requestType', width: 100 },
    { title: '问题描述', dataIndex: 'issueDescription', width: 300, ellipsis: true },
    { title: '优先级', dataIndex: 'priority', width: 80, render: (p: string) => <Tag color={priorityColors[p]}>{p}</Tag> },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', width: 150, render: (d: string) => new Date(d).toLocaleString() },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="总请求数" value={statistics.total || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="待处理" value={statistics.pending || 0} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="处理中" value={statistics.processing || 0} valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已解决" value={statistics.resolved || 0} valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="🔧 售后服务管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建服务请求</Button>}
      >
        <Table columns={columns} dataSource={requests} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建服务请求" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="customerName" label="客户名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="customerPhone" label="联系电话"><Input /></Form.Item>
          <Form.Item name="requestType" label="请求类型" rules={[{ required: true }]}>
            <Select><Select.Option value="维修">维修</Select.Option><Select.Option value="咨询">咨询</Select.Option><Select.Option value="投诉">投诉</Select.Option><Select.Option value="建议">建议</Select.Option></Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级" initialValue="normal">
            <Select><Select.Option value="low">低</Select.Option><Select.Option value="normal">普通</Select.Option><Select.Option value="high">高</Select.Option><Select.Option value="urgent">紧急</Select.Option></Select>
          </Form.Item>
          <Form.Item name="issueDescription" label="问题描述" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AfterSales
