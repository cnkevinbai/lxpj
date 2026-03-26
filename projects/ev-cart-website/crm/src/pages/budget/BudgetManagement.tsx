import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Progress, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, InputNumber } from 'antd'
import { PlusOutlined, RiseOutlined, FallOutlined, DollarOutlined } from '@ant-design/icons'
import { Line, Column } from '@ant-design/plots'

const { Option } = Select

interface Budget {
  id: string
  department: string
  category: string
  amount: number
  used: number
  remaining: number
  usageRate: number
  status: string
  quarter: string
}

const BudgetManagement: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      department: '销售部',
      category: '营销费用',
      amount: 5000000,
      used: 3200000,
      remaining: 1800000,
      usageRate: 64,
      status: 'normal',
      quarter: 'Q1',
    },
    {
      id: '2',
      department: '生产部',
      category: '生产成本',
      amount: 8000000,
      used: 6800000,
      remaining: 1200000,
      usageRate: 85,
      status: 'warning',
      quarter: 'Q1',
    },
    {
      id: '3',
      department: '研发部',
      category: '研发费用',
      amount: 3000000,
      used: 1500000,
      remaining: 1500000,
      usageRate: 50,
      status: 'normal',
      quarter: 'Q1',
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    normal: 'success',
    warning: 'warning',
    exceeded: 'error',
  }

  const statusLabels: Record<string, string> = {
    normal: '正常',
    warning: '预警',
    exceeded: '超支',
  }

  const handleCreate = async (values: any) => {
    message.success('创建预算成功')
    setModalVisible(false)
    form.resetFields()
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalUsed = budgets.reduce((sum, b) => sum + b.used, 0)
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0)
  const avgUsage = budgets.reduce((sum, b) => sum + b.usageRate, 0) / budgets.length

  const columns = [
    {
      title: '部门',
      dataIndex: 'department',
      width: 120,
    },
    {
      title: '预算类别',
      dataIndex: 'category',
      width: 120,
    },
    {
      title: '预算金额',
      dataIndex: 'amount',
      width: 130,
      render: (amount: number) => <span style={{ fontWeight: 600 }}>¥{(amount / 10000).toFixed(0)}万</span>,
    },
    {
      title: '已使用',
      dataIndex: 'used',
      width: 130,
      render: (used: number) => <span style={{ color: '#faad14' }}>¥{(used / 10000).toFixed(0)}万</span>,
    },
    {
      title: '剩余',
      dataIndex: 'remaining',
      width: 130,
      render: (remaining: number) => <span style={{ color: remaining > 0 ? '#52c41a' : '#ff4d4f' }}>¥{(remaining / 10000).toFixed(0)}万</span>,
    },
    {
      title: '使用率',
      dataIndex: 'usageRate',
      width: 150,
      render: (rate: number) => (
        <Progress
          percent={rate}
          strokeColor={rate > 80 ? '#ff4d4f' : rate > 60 ? '#faad14' : '#52c41a'}
          size="small"
          format={() => `${rate}%`}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>,
    },
    {
      title: '季度',
      dataIndex: 'quarter',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Budget) => (
        <Space size="small">
          <Button type="link" size="small">调整</Button>
          <Button type="link" size="small">明细</Button>
        </Space>
      ),
    },
  ]

  const trendData = [
    { month: '1 月', budget: 500, actual: 480 },
    { month: '2 月', budget: 520, actual: 510 },
    { month: '3 月', budget: 550, actual: 530 },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>💰 预算管理</h1>
        <p style={{ color: '#666' }}>全面预算管控与成本分析</p>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预算"
              value={totalBudget}
              precision={0}
              prefix={<DollarOutlined />}
              suffix="万"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已使用"
              value={totalUsed}
              precision={0}
              prefix={<RiseOutlined />}
              suffix="万"
              valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="剩余"
              value={totalRemaining}
              precision={0}
              prefix={<FallOutlined />}
              suffix="万"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均使用率"
              value={avgUsage}
              precision={1}
              suffix="%"
              valueStyle={{ color: avgUsage > 80 ? '#ff4d4f' : '#faad14', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="📋 预算执行表"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                新建预算
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={budgets}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📈 预算执行趋势">
            <Line
              data={trendData.flatMap(item => [
                { month: item.month, type: '预算', value: item.budget },
                { month: item.month, type: '实际', value: item.actual },
              ])}
              xField="month"
              yField="value"
              seriesField="type"
              smooth
              height={300}
            />
          </Card>

          <Card title="⚠️ 预警信息" style={{ marginTop: 16 }}>
            {budgets.filter(b => b.usageRate > 80).map((budget, index) => (
              <div
                key={budget.id}
                style={{
                  padding: '12px',
                  marginBottom: index < budgets.filter(b => b.usageRate > 80).length - 1 ? 8 : 0,
                  background: '#fff1f0',
                  border: '1px solid #ffa39e',
                  borderRadius: 4,
                }}
              >
                <div style={{ fontWeight: 600, color: '#ff4d4f', marginBottom: 4 }}>
                  {budget.department} - {budget.category}
                </div>
                <div style={{ fontSize: 13, color: '#666' }}>
                  使用率 {budget.usageRate}%，剩余 ¥{(budget.remaining / 10000).toFixed(0)}万
                </div>
                <Progress
                  percent={budget.usageRate}
                  strokeColor="#ff4d4f"
                  size="small"
                  style={{ marginTop: 8 }}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Modal
        title="新建预算"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="department" label="部门" rules={[{ required: true }]}>
              <Select>
                <Option value="销售部">销售部</Option>
                <Option value="生产部">生产部</Option>
                <Option value="研发部">研发部</Option>
                <Option value="行政部">行政部</Option>
              </Select>
            </Form.Item>

            <Form.Item name="category" label="预算类别" rules={[{ required: true }]}>
              <Select>
                <Option value="营销费用">营销费用</Option>
                <Option value="生产成本">生产成本</Option>
                <Option value="研发费用">研发费用</Option>
                <Option value="管理费用">管理费用</Option>
              </Select>
            </Form.Item>

            <Form.Item name="amount" label="预算金额" rules={[{ required: true }]}>
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item name="quarter" label="季度" rules={[{ required: true }]}>
              <Select>
                <Option value="Q1">Q1</Option>
                <Option value="Q2">Q2</Option>
                <Option value="Q3">Q3</Option>
                <Option value="Q4">Q4</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default BudgetManagement
