import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Tag, Modal, Form, Input, InputNumber, Select, DatePicker, Upload, message, Statistic, Row, Col } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/es/upload/interface'

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<any>({})
  const [createVisible, setCreateVisible] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const categoryColors: Record<string, string> = {
    office: 'default',
    travel: 'processing',
    entertainment: 'warning',
    utility: 'success',
    other: 'default',
  }

  const statusColors: Record<string, string> = {
    pending: 'warning',
    approved: 'processing',
    reimbursed: 'success',
    rejected: 'error',
  }

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/finance/expenses')
      const data = await response.json()
      setExpenses(data.data || [])
    } catch (error) {
      message.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    const response = await fetch('/api/v1/finance/expenses-statistics')
    const data = await response.json()
    setStatistics(data)
  }

  useEffect(() => {
    fetchExpenses()
    fetchStatistics()
  }, [])

  const handleCreate = async (values: any) => {
    await fetch('/api/v1/finance/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    message.success('创建成功')
    setCreateVisible(false)
    fetchExpenses()
  }

  const columns = [
    { title: '报销单号', dataIndex: 'expenseCode', width: 150 },
    { title: '申请人', dataIndex: 'applicantName', width: 100 },
    { title: '部门', dataIndex: 'department', width: 100 },
    { title: '费用类型', dataIndex: 'category', width: 100, render: (c: string) => <Tag color={categoryColors[c]}>{c}</Tag> },
    { title: '金额', dataIndex: 'amount', width: 120, render: (a: number) => `¥${a.toLocaleString()}` },
    { title: '申请日期', dataIndex: 'applyDate', width: 120, render: (d: string) => new Date(d).toLocaleDateString() },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={statusColors[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">审批</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card><Statistic title="报销总额" value={statistics.totalAmount || 0} precision={2} prefix="¥" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="待审批" value={statistics.pending || 0} suffix="笔" valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已批准" value={statistics.approved || 0} suffix="笔" valueStyle={{ color: '#1890ff' }} /></Card></Col>
        <Col span={6}><Card><Statistic title="已报销" value={statistics.reimbursed || 0} suffix="笔" valueStyle={{ color: '#52c41a' }} /></Card></Col>
      </Row>

      <Card
        title="💸 费用报销管理"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>创建报销单</Button>}
      >
        <Table columns={columns} dataSource={expenses} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
      </Card>

      <Modal title="创建报销单" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="category" label="费用类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="office">办公用品</Select.Option>
              <Select.Option value="travel">差旅费</Select.Option>
              <Select.Option value="entertainment">业务招待</Select.Option>
              <Select.Option value="utility">水电费</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="报销金额" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} prefix="¥" /></Form.Item>
          <Form.Item name="description" label="费用说明" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="附件上传">
            <Upload fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Expenses
