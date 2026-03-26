import React, { useState } from 'react'
import { Card, Row, Col, Table, Statistic, Tag, Space, Button, Modal, Form, Input, Select, DatePicker, message, InputNumber, Progress, Descriptions } from 'antd'
import { PlusOutlined, DollarOutlined, RiseOutlined, FallOutlined, WalletOutlined } from '@ant-design/icons'
import { Line, Column } from '@ant-design/plots'

const { Option } = Select

interface FundFlow {
  id: string
  type: string
  category: string
  amount: number
  direction: string
  date: string
  counterparty: string
  status: string
  remark: string
}

const FundsManagement: React.FC = () => {
  const [fundFlows, setFundFlows] = useState<FundFlow[]>([
    {
      id: '1',
      type: '销售收入',
      category: '经营活动',
      amount: 1580000,
      direction: 'in',
      date: '2026-03-13',
      counterparty: '某某物流公司',
      status: 'completed',
      remark: '智能换电柜货款',
    },
    {
      id: '2',
      type: '采购支出',
      category: '经营活动',
      amount: 680000,
      direction: 'out',
      date: '2026-03-13',
      counterparty: '某某供应商',
      status: 'pending',
      remark: '原材料采购',
    },
    {
      id: '3',
      type: '工资发放',
      category: '经营活动',
      amount: 450000,
      direction: 'out',
      date: '2026-03-10',
      counterparty: '员工工资',
      status: 'completed',
      remark: '3 月份工资',
    },
    {
      id: '4',
      type: '银行贷款',
      category: '筹资活动',
      amount: 2000000,
      direction: 'in',
      date: '2026-03-05',
      counterparty: '工商银行',
      status: 'completed',
      remark: '流动资金贷款',
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const directionColors: Record<string, string> = {
    in: 'success',
    out: 'error',
  }

  const directionLabels: Record<string, string> = {
    in: '收入',
    out: '支出',
  }

  const statusColors: Record<string, string> = {
    completed: 'success',
    pending: 'warning',
    failed: 'error',
  }

  const handleCreate = async (values: any) => {
    message.success('登记资金流水成功')
    setModalVisible(false)
    form.resetFields()
  }

  // 统计数据
  const totalIn = fundFlows.filter(f => f.direction === 'in').reduce((sum, f) => sum + f.amount, 0)
  const totalOut = fundFlows.filter(f => f.direction === 'out').reduce((sum, f) => sum + f.amount, 0)
  const netFlow = totalIn - totalOut

  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '类别',
      dataIndex: 'category',
      width: 120,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 140,
      render: (amount: number, record: any) => (
        <span style={{ color: record.direction === 'in' ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
          {record.direction === 'in' ? '+' : '-'}¥{(amount / 10000).toFixed(1)}万
        </span>
      ),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      width: 90,
      render: (direction: string) => (
        <Tag color={directionColors[direction]}>{directionLabels[direction]}</Tag>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 110,
    },
    {
      title: '交易对手',
      dataIndex: 'counterparty',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => <Tag color={statusColors[status]}>{status === 'completed' ? '已完成' : status === 'pending' ? '处理中' : '失败'}</Tag>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small">详情</Button>
          {record.status === 'pending' && <Button type="link" size="small">审核</Button>}
        </Space>
      ),
    },
  ]

  const trendData = [
    { month: '1 月', income: 580, expense: 420 },
    { month: '2 月', income: 620, expense: 450 },
    { month: '3 月', income: 680, expense: 480 },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>💰 资金管理</h1>
        <p style={{ color: '#666' }}>资金流水与流动性管理</p>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总收入"
              value={totalIn}
              precision={0}
              prefix="¥"
              suffix="万"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总支出"
              value={totalOut}
              precision={0}
              prefix="¥"
              suffix="万"
              valueStyle={{ color: '#ff4d4f', fontSize: 24, fontWeight: 700 }}
              prefix={<FallOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="净流量"
              value={netFlow}
              precision={0}
              prefix="¥"
              suffix="万"
              valueStyle={{ color: netFlow >= 0 ? '#52c41a' : '#ff4d4f', fontSize: 24, fontWeight: 700 }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="资金笔数"
              value={fundFlows.length}
              suffix="笔"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="📋 资金流水"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                登记流水
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={fundFlows}
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
          <Card title="📈 资金趋势">
            <Column
              data={trendData.flatMap(item => [
                { month: item.month, type: '收入', value: item.income },
                { month: item.month, type: '支出', value: item.expense },
              ])}
              xField="month"
              yField="value"
              seriesField="type"
              isGroup
              height={300}
            />
          </Card>

          <Card title="💵 资金构成" style={{ marginTop: 16 }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="经营活动流入">¥{(fundFlows.filter(f => f.category === '经营活动' && f.direction === 'in').reduce((sum, f) => sum + f.amount, 0) / 10000).toFixed(0)}万</Descriptions.Item>
              <Descriptions.Item label="经营活动流出">¥{(fundFlows.filter(f => f.category === '经营活动' && f.direction === 'out').reduce((sum, f) => sum + f.amount, 0) / 10000).toFixed(0)}万</Descriptions.Item>
              <Descriptions.Item label="筹资活动流入">¥{(fundFlows.filter(f => f.category === '筹资活动' && f.direction === 'in').reduce((sum, f) => sum + f.amount, 0) / 10000).toFixed(0)}万</Descriptions.Item>
              <Descriptions.Item label="投资活动流入">¥0 万</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Modal
        title="登记资金流水"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="type" label="流水类型" rules={[{ required: true }]}>
              <Select>
                <Option value="销售收入">销售收入</Option>
                <Option value="采购支出">采购支出</Option>
                <Option value="工资发放">工资发放</Option>
                <Option value="费用报销">费用报销</Option>
                <Option value="银行贷款">银行贷款</Option>
                <Option value="还款">还款</Option>
              </Select>
            </Form.Item>

            <Form.Item name="category" label="活动类别" rules={[{ required: true }]}>
              <Select>
                <Option value="经营活动">经营活动</Option>
                <Option value="投资活动">投资活动</Option>
                <Option value="筹资活动">筹资活动</Option>
              </Select>
            </Form.Item>

            <Form.Item name="direction" label="资金方向" rules={[{ required: true }]}>
              <Select>
                <Option value="in">收入</Option>
                <Option value="out">支出</Option>
              </Select>
            </Form.Item>

            <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
              <InputNumber
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item name="date" label="日期" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="counterparty" label="交易对手" rules={[{ required: true }]}>
              <Input placeholder="请输入交易对手" />
            </Form.Item>
          </div>

          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FundsManagement
