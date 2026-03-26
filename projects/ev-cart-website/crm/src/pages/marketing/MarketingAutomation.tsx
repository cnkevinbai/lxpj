import React, { useState } from 'react'
import { Card, Row, Col, Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message, Statistic, Progress, Avatar } from 'antd'
import { PlusOutlined, CampaignOutlined, EyeOutlined, LikeOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Pie, Column } from '@ant-design/plots'

const { Option } = Select
const { TextArea } = Input

interface Campaign {
  id: string
  name: string
  type: string
  channel: string
  budget: number
  spent: number
  leads: number
  conversion: number
  status: string
  startDate: string
  endDate: string
}

const MarketingAutomation: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: '春季新品发布会',
      type: '产品推广',
      channel: '线上',
      budget: 500000,
      spent: 380000,
      leads: 285,
      conversion: 42,
      status: 'active',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
    },
    {
      id: '2',
      name: '行业展会推广',
      type: '品牌宣传',
      channel: '线下',
      budget: 300000,
      spent: 280000,
      leads: 156,
      conversion: 28,
      status: 'active',
      startDate: '2026-03-15',
      endDate: '2026-03-20',
    },
    {
      id: '3',
      name: '社交媒体营销',
      type: '线索获取',
      channel: '社交媒体',
      budget: 150000,
      spent: 120000,
      leads: 420,
      conversion: 65,
      status: 'active',
      startDate: '2026-03-01',
      endDate: '2026-04-30',
    },
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const statusColors: Record<string, string> = {
    active: 'success',
    planned: 'blue',
    paused: 'warning',
    completed: 'default',
  }

  const channelColors: Record<string, string> = {
    '线上': 'blue',
    '线下': 'green',
    '社交媒体': 'purple',
    '邮件': 'orange',
  }

  const handleCreate = async (values: any) => {
    message.success('创建营销活动成功')
    setModalVisible(false)
    form.resetFields()
  }

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0)
  const avgConversion = campaigns.reduce((sum, c) => sum + c.conversion, 0) / campaigns.length

  const channelData = [
    { type: '线上', value: campaigns.filter(c => c.channel === '线上').length },
    { type: '线下', value: campaigns.filter(c => c.channel === '线下').length },
    { type: '社交媒体', value: campaigns.filter(c => c.channel === '社交媒体').length },
  ]

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      width: 200,
      render: (name: string) => <span style={{ fontWeight: 600, color: '#1890ff' }}>{name}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      width: 100,
      render: (channel: string) => <Tag color={channelColors[channel]}>{channel}</Tag>,
    },
    {
      title: '预算/花费',
      key: 'budget',
      width: 150,
      render: (_: any, record: Campaign) => (
        <div>
          <div>¥{(record.budget / 10000).toFixed(0)}万</div>
          <div style={{ color: '#999', fontSize: '12px' }}>已花 ¥{(record.spent / 10000).toFixed(0)}万</div>
        </div>
      ),
    },
    {
      title: '预算使用率',
      key: 'usage',
      width: 150,
      render: (_: any, record: Campaign) => (
        <Progress
          percent={Math.round((record.spent / record.budget) * 100)}
          strokeColor={record.spent / record.budget > 0.9 ? '#ff4d4f' : '#1890ff'}
          size="small"
        />
      ),
    },
    {
      title: '获取线索',
      dataIndex: 'leads',
      width: 100,
      render: (leads: number) => <span style={{ color: '#722ed1', fontWeight: 600 }}>{leads}</span>,
    },
    {
      title: '转化率',
      dataIndex: 'conversion',
      width: 100,
      render: (conv: number) => <span style={{ color: '#52c41a' }}>{conv}%</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status: string) => <Tag color={statusColors[status]}>{status === 'active' ? '进行中' : status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Campaign) => (
        <Space size="small">
          <Button type="link" size="small">数据</Button>
          <Button type="link" size="small">编辑</Button>
          {record.status === 'active' ? <Button type="link" size="small" danger>暂停</Button> : <Button type="link" size="small">启动</Button>}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>📢 营销自动化管理</h1>
        <p style={{ color: '#666' }}>全渠道营销活动管理与效果分析</p>
      </div>

      {/* 核心指标 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预算"
              value={totalBudget}
              precision={0}
              prefix="¥"
              suffix="万"
              valueStyle={{ color: '#1890ff', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已花费"
              value={totalSpent}
              precision={0}
              prefix="¥"
              suffix="万"
              valueStyle={{ color: '#faad14', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="获取线索"
              value={totalLeads}
              suffix="个"
              valueStyle={{ color: '#722ed1', fontSize: 24, fontWeight: 700 }}
              prefix={<CampaignOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均转化率"
              value={avgConversion}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card
            title="营销活动列表"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                新建活动
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={campaigns}
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
          <Card title="📊 渠道分布">
            <Pie
              appendPadding={10}
              data={channelData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
              height={300}
            />
          </Card>

          <Card title="🎯 活动效果" style={{ marginTop: 16 }}>
            {campaigns.map((campaign, index) => (
              <div key={campaign.id} style={{ marginBottom: index < campaigns.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong>{campaign.name}</strong>
                  <span style={{ color: '#52c41a' }}>{campaign.conversion}%</span>
                </div>
                <Progress
                  percent={campaign.conversion}
                  strokeColor={campaign.conversion > 50 ? '#52c41a' : campaign.conversion > 30 ? '#faad14' : '#ff4d4f'}
                  size="small"
                  format={() => `${campaign.leads} 线索`}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Modal
        title="新建营销活动"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="name" label="活动名称" rules={[{ required: true, message: '请输入活动名称' }]}>
              <Input placeholder="请输入活动名称" />
            </Form.Item>

            <Form.Item name="type" label="活动类型" rules={[{ required: true, message: '请选择活动类型' }]}>
              <Select>
                <Option value="产品推广">产品推广</Option>
                <Option value="品牌宣传">品牌宣传</Option>
                <Option value="线索获取">线索获取</Option>
                <Option value="客户留存">客户留存</Option>
              </Select>
            </Form.Item>

            <Form.Item name="channel" label="营销渠道" rules={[{ required: true, message: '请选择渠道' }]}>
              <Select>
                <Option value="线上">线上</Option>
                <Option value="线下">线下</Option>
                <Option value="社交媒体">社交媒体</Option>
                <Option value="邮件">邮件</Option>
              </Select>
            </Form.Item>

            <Form.Item name="budget" label="预算" rules={[{ required: true, message: '请输入预算' }]}>
              <Input.Number
                style={{ width: '100%' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                parser={(value) => Number(String(value || 0).replace(/¥\s?|(,*)/g, ''))}
                min={0}
              />
            </Form.Item>

            <Form.Item name="startDate" label="开始日期" rules={[{ required: true, message: '请选择开始日期' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="endDate" label="结束日期" rules={[{ required: true, message: '请选择结束日期' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <Form.Item name="description" label="活动描述">
            <TextArea rows={4} placeholder="请描述活动内容和目标" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MarketingAutomation
