/**
 * 销售业绩分析页面
 * 销售团队绩效追踪与分析
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Progress,
  Descriptions,
  DatePicker,
  Tabs,
  Divider,
  Avatar,
  Badge,
  Tooltip,
} from 'antd'
import {
  TrophyOutlined,
  TeamOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  CrownOutlined,
  FireOutlined,
  TagOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface SalespersonPerformance {
  ranking?: number
  userId: string
  userName: string
  metrics: {
    revenue: number
    orderCount: number
    customerCount: number
    winRate: number
    conversionRate: number
    avgOrderValue: number
  }
  target?: number
  completionRate?: number
}

export default function SalesPerformance() {
  const [performances, setPerformances] = useState<SalespersonPerformance[]>([])
  const [loading, setLoading] = useState(false)
  const [targetModalVisible, setTargetModalVisible] = useState(false)
  const [compareModalVisible, setCompareModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [form] = Form.useForm()
  const [selectedPeriod, setSelectedPeriod] = useState(dayjs().format('YYYY-MM'))
  const [stats, setStats] = useState({
    totalRevenue: 0,
    avgRevenue: 0,
    avgWinRate: 0,
    avgCompletionRate: 0,
    aboveTarget: 0,
    belowTarget: 0,
  })

  useEffect(() => {
    fetchPerformances()
    fetchStats()
  }, [selectedPeriod])

  const fetchPerformances = async () => {
    setLoading(true)
    // 模拟数据
    const mockData: SalespersonPerformance[] = [
      { ranking: 1, userId: 'u1', userName: '张三', metrics: { revenue: 120000, orderCount: 25, customerCount: 8, winRate: 85, conversionRate: 35, avgOrderValue: 4800 }, target: 100000, completionRate: 120 },
      { ranking: 2, userId: 'u2', userName: '李四', metrics: { revenue: 95000, orderCount: 20, customerCount: 6, winRate: 78, conversionRate: 28, avgOrderValue: 4750 }, target: 100000, completionRate: 95 },
      { ranking: 3, userId: 'u3', userName: '王五', metrics: { revenue: 85000, orderCount: 18, customerCount: 5, winRate: 72, conversionRate: 25, avgOrderValue: 4722 }, target: 100000, completionRate: 85 },
      { ranking: 4, userId: 'u4', userName: '赵六', metrics: { revenue: 60000, orderCount: 12, customerCount: 4, winRate: 65, conversionRate: 20, avgOrderValue: 5000 }, target: 100000, completionRate: 60 },
      { ranking: 5, userId: 'u5', userName: '钱七', metrics: { revenue: 45000, orderCount: 8, customerCount: 3, winRate: 55, conversionRate: 15, avgOrderValue: 5625 }, target: 100000, completionRate: 45 },
    ]
    setPerformances(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      totalRevenue: 405000,
      avgRevenue: 81000,
      avgWinRate: 71,
      avgCompletionRate: 81,
      aboveTarget: 1,
      belowTarget: 4,
    })
  }

  const handleSetTarget = (userId: string) => {
    setSelectedUser(userId)
    form.resetFields()
    form.setFieldsValue({ target: 100000 })
    setTargetModalVisible(true)
  }

  const handleSubmitTarget = async () => {
    try {
      const values = await form.validateFields()
      console.log('Submit:', values)
      message.success('目标设置成功')
      setTargetModalVisible(false)
      fetchPerformances()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const getRankingMedal = (ranking?: number) => {
    if (ranking === 1) return <CrownOutlined style={{ color: '#faad14', fontSize: 20 }} />
    if (ranking === 2) return <TrophyOutlined style={{ color: '#52c41a', fontSize: 18 }} />
    if (ranking === 3) return <TrophyOutlined style={{ color: '#1890ff', fontSize: 16 }} />
    return <Text>{ranking}</Text>
  }

  const getCompletionTag = (rate?: number) => {
    if (!rate) return <Tag>无目标</Tag>
    if (rate >= 100) return <Tag color="success" icon={<ArrowUpOutlined />}>达标 {rate}%</Tag>
    if (rate >= 80) return <Tag color="warning" icon={<MinusOutlined />}>接近 {rate}%</Tag>
    return <Tag color="error" icon={<ArrowDownOutlined />}>未达标 {rate}%</Tag>
  }

  const columns: ColumnsType<SalespersonPerformance> = [
    {
      title: '排名',
      dataIndex: 'ranking',
      width: 60,
      render: (ranking?: number) => getRankingMedal(ranking),
    },
    {
      title: '销售人员',
      dataIndex: 'userName',
      width: 120,
      render: (text: string, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.ranking === 1 ? '#faad14' : '#6600ff' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '销售收入',
      dataIndex: 'metrics',
      width: 120,
      render: (metrics: any) => (
        <Text strong style={{ color: '#6600ff', fontSize: 14 }}>
          ¥{metrics.revenue.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '订单数',
      dataIndex: 'metrics',
      width: 80,
      render: (metrics: any) => <Badge count={metrics.orderCount} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: '客户数',
      dataIndex: 'metrics',
      width: 80,
      render: (metrics: any) => <Text>{metrics.customerCount}</Text>,
    },
    {
      title: '赢单率',
      dataIndex: 'metrics',
      width: 100,
      render: (metrics: any) => (
        <Progress
          percent={metrics.winRate}
          size="small"
          strokeColor={metrics.winRate >= 70 ? '#52c41a' : '#faad14'}
          format={() => `${metrics.winRate}%`}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: '转化率',
      dataIndex: 'metrics',
      width: 100,
      render: (metrics: any) => (
        <Progress
          percent={metrics.conversionRate}
          size="small"
          strokeColor="#1890ff"
          format={() => `${metrics.conversionRate}%`}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: '目标完成',
      dataIndex: 'completionRate',
      width: 100,
      render: (rate?: number) => getCompletionTag(rate),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => handleSetTarget(record.userId)}>
          设置目标
        </Button>
      ),
    },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <TrophyOutlined style={{ marginRight: 8 }} />
            销售业绩分析
          </Title>
          <Text type="secondary">销售团队绩效追踪与分析</Text>
        </div>
        <div className="page-header-actions">
          <DatePicker
            picker="month"
            value={dayjs(selectedPeriod)}
            onChange={(date) => setSelectedPeriod(date?.format('YYYY-MM') || dayjs().format('YYYY-MM'))}
            style={{ marginRight: 8 }}
          />
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">团队总收入</Text>}
              value={stats.totalRevenue}
              prefix={<TeamOutlined style={{ color: '#6600ff' }} />}
              suffix="元"
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">人均收入</Text>}
              value={stats.avgRevenue}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均赢单率</Text>}
              value={stats.avgWinRate}
              suffix="%"
              prefix={<TagOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">达标人数</Text>}
              value={stats.aboveTarget}
              suffix={`/ ${stats.aboveTarget + stats.belowTarget}`}
              prefix={<FireOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Top Performers */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {performances.slice(0, 3).map((perf, idx) => (
            <Col span={8} key={perf.userId}>
              <div style={{ textAlign: 'center' }}>
                {idx === 0 && <CrownOutlined style={{ fontSize: 32, color: '#faad14' }} />}
                {idx === 1 && <TrophyOutlined style={{ fontSize: 28, color: '#52c41a' }} />}
                {idx === 2 && <TrophyOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                <div style={{ marginTop: 8 }}>
                  <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: idx === 0 ? '#faad14' : idx === 1 ? '#52c41a' : '#1890ff' }} />
                </div>
                <Title level={5} style={{ marginTop: 8 }}>{perf.userName}</Title>
                <Text strong style={{ color: '#6600ff', fontSize: 18 }}>¥{perf.metrics.revenue.toLocaleString()}</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color={idx === 0 ? 'gold' : idx === 1 ? 'green' : 'blue'}>
                    赢单率 {perf.metrics.winRate}%
                  </Tag>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 业绩排行榜 */}
      <Card className="daoda-card">
        <Table
          columns={columns}
          dataSource={performances}
          rowKey="userId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 人`,
          }}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <Text strong>团队汇总</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text strong style={{ color: '#6600ff' }}>¥{stats.totalRevenue.toLocaleString()}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text>{performances.reduce((sum, p) => sum + p.metrics.orderCount, 0)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text>{performances.reduce((sum, p) => sum + p.metrics.customerCount, 0)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text>{stats.avgWinRate}%</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={3}>
                  <Text type="secondary">平均完成率 {stats.avgCompletionRate}%</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>

      {/* 设置目标弹窗 */}
      <Modal
        title="设置销售目标"
        open={targetModalVisible}
        onOk={handleSubmitTarget}
        onCancel={() => setTargetModalVisible(false)}
        width={400}
        okText="设置"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="target" label="目标金额" rules={[{ required: true, message: '请输入目标金额' }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/¥\s?|(,*)/g, '') as any}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}