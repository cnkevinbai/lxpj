/**
 * SLA服务级别管理页面
 * 服务级别定义、响应时间、解决时间管理
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
  Input,
  InputNumber,
  Select,
  message,
  Progress,
  Descriptions,
  Tabs,
  Divider,
  Badge,
  Alert,
  Tooltip,
} from 'antd'
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  FireOutlined,
  SyncOutlined,
  HourglassOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs

// SLA级别
enum SLALevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

// SLA状态
enum SLAStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

interface SLADefinition {
  id: string
  name: string
  code: string
  level: SLALevel
  status: SLAStatus
  description?: string
  responseTimeMinutes: number
  resolutionTimeHours: number
  workHoursStart: string
  workHoursEnd: string
  notifyBeforeMinutes: number
  escalationLevels: number
  totalTickets?: number
  metTickets?: number
  breachedTickets?: number
  complianceRate?: number
}

interface SLARecord {
  id: string
  ticketId: string
  slaName: string
  slaLevel: SLALevel
  createdAt: Date
  responseDueAt: Date
  resolutionDueAt: Date
  responseMet?: boolean
  resolutionMet?: boolean
  responseTimeMinutes?: number
  resolutionTimeMinutes?: number
}

export default function SLAManagement() {
  const [slaDefinitions, setSlaDefinitions] = useState<SLADefinition[]>([])
  const [slaRecords, setSlaRecords] = useState<SLARecord[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [stats, setStats] = useState({
    totalSLAs: 4,
    activeSLAs: 4,
    avgResponseTime: 45,
    avgResolutionTime: 480,
    avgCompliance: 85,
    breachedToday: 2,
    breachedThisWeek: 5,
    breachedThisMonth: 12,
  })
  const [form] = Form.useForm()

  useEffect(() => {
    fetchSLADefinitions()
    fetchStats()
  }, [])

  const fetchSLADefinitions = async () => {
    setLoading(true)
    const mockData: SLADefinition[] = [
      {
        id: 'SLA-001',
        name: '严重故障SLA',
        code: 'SLA-CRIT',
        level: SLALevel.CRITICAL,
        status: SLAStatus.ACTIVE,
        description: '系统崩溃、核心功能不可用',
        responseTimeMinutes: 15,
        resolutionTimeHours: 4,
        workHoursStart: '00:00',
        workHoursEnd: '23:59',
        notifyBeforeMinutes: 5,
        escalationLevels: 3,
        totalTickets: 25,
        metTickets: 22,
        breachedTickets: 3,
        complianceRate: 88,
      },
      {
        id: 'SLA-002',
        name: '高优先级SLA',
        code: 'SLA-HIGH',
        level: SLALevel.HIGH,
        status: SLAStatus.ACTIVE,
        description: '重要功能受损、影响业务',
        responseTimeMinutes: 30,
        resolutionTimeHours: 8,
        workHoursStart: '08:00',
        workHoursEnd: '20:00',
        notifyBeforeMinutes: 10,
        escalationLevels: 2,
        totalTickets: 50,
        metTickets: 45,
        breachedTickets: 5,
        complianceRate: 90,
      },
      {
        id: 'SLA-003',
        name: '中等优先级SLA',
        code: 'SLA-MED',
        level: SLALevel.MEDIUM,
        status: SLAStatus.ACTIVE,
        description: '功能异常但不影响核心业务',
        responseTimeMinutes: 60,
        resolutionTimeHours: 24,
        workHoursStart: '09:00',
        workHoursEnd: '18:00',
        notifyBeforeMinutes: 15,
        escalationLevels: 1,
        totalTickets: 120,
        metTickets: 105,
        breachedTickets: 15,
        complianceRate: 87.5,
      },
      {
        id: 'SLA-004',
        name: '低优先级SLA',
        code: 'SLA-LOW',
        level: SLALevel.LOW,
        status: SLAStatus.ACTIVE,
        description: '咨询、建议、小问题',
        responseTimeMinutes: 240,
        resolutionTimeHours: 72,
        workHoursStart: '09:00',
        workHoursEnd: '18:00',
        notifyBeforeMinutes: 30,
        escalationLevels: 0,
        totalTickets: 200,
        metTickets: 180,
        breachedTickets: 20,
        complianceRate: 90,
      },
    ]
    setSlaDefinitions(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      totalSLAs: 4,
      activeSLAs: 4,
      avgResponseTime: 45,
      avgResolutionTime: 480,
      avgCompliance: 85,
      breachedToday: 2,
      breachedThisWeek: 5,
      breachedThisMonth: 12,
    })
  }

  const getLevelTag = (level: SLALevel) => {
    const config: Record<SLALevel, { color: string; icon: any; text: string }> = {
      CRITICAL: { color: 'error', icon: <ThunderboltOutlined />, text: '严重' },
      HIGH: { color: 'warning', icon: <FireOutlined />, text: '高' },
      MEDIUM: { color: 'processing', icon: <ClockCircleOutlined />, text: '中' },
      LOW: { color: 'default', icon: <HourglassOutlined />, text: '低' },
    }
    const c = config[level]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getStatusTag = (status: SLAStatus) => {
    const config: Record<SLAStatus, { color: string; text: string }> = {
      ACTIVE: { color: 'success', text: '已启用' },
      INACTIVE: { color: 'default', text: '已停用' },
      DRAFT: { color: 'warning', text: '草稿' },
    }
    const c = config[status]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const columns: ColumnsType<SLADefinition> = [
    {
      title: 'SLA名称',
      dataIndex: 'name',
      width: 150,
      render: (text: string, record) => (
        <Space>
          <Text strong>{text}</Text>
          <Text type="secondary">({record.code})</Text>
        </Space>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'level',
      width: 80,
      render: (level: SLALevel) => getLevelTag(level),
    },
    {
      title: '响应时间',
      dataIndex: 'responseTimeMinutes',
      width: 100,
      render: (minutes: number) => (
        <Text>
          {minutes < 60 ? `${minutes}分钟` : `${Math.round(minutes / 60)}小时`}
        </Text>
      ),
    },
    {
      title: '解决时间',
      dataIndex: 'resolutionTimeHours',
      width: 100,
      render: (hours: number) => (
        <Text>
          {hours < 24 ? `${hours}小时` : `${Math.round(hours / 24)}天`}
        </Text>
      ),
    },
    {
      title: '工作时间',
      width: 120,
      render: (_, record) => (
        <Text>{record.workHoursStart} - {record.workHoursEnd}</Text>
      ),
    },
    {
      title: '达标率',
      dataIndex: 'complianceRate',
      width: 120,
      render: (rate?: number) => (
        <Progress
          percent={rate || 0}
          size="small"
          strokeColor={(rate || 0) >= 90 ? '#52c41a' : (rate || 0) >= 80 ? '#faad14' : '#ff4d4f'}
          format={() => `${rate}%`}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: '工单数',
      dataIndex: 'totalTickets',
      width: 80,
      render: (total: number, record: any) => (
        <Space>
          <Text>{total || 0}</Text>
          <Badge count={record.breachedTickets || 0} style={{ backgroundColor: '#ff4d4f' }} title="违约数" />
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: SLAStatus) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<SettingOutlined />}>配置</Button>
          <Button type="link" size="small" danger={record.status === SLAStatus.ACTIVE}>
            {record.status === SLAStatus.ACTIVE ? '停用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ]

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      message.success('创建成功')
      setModalVisible(false)
      fetchSLADefinitions()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            SLA服务级别管理
          </Title>
          <Text type="secondary">服务级别定义、响应时间、解决时间管理</Text>
        </div>
        <div className="page-header-actions">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalVisible(true) }}>
            新建SLA
          </Button>
        </div>
      </div>

      {/* 警告提示 */}
      {stats.breachedToday > 0 && (
        <Alert
          message={`今日有 ${stats.breachedToday} 个工单SLA违约，请及时处理`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">SLA总数</Text>}
              value={stats.totalSLAs}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均响应</Text>}
              value={stats.avgResponseTime}
              suffix="分钟"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">平均解决</Text>}
              value={stats.avgResolutionTime}
              suffix="分钟"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">达标率</Text>}
              value={stats.avgCompliance}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">本周违约</Text>}
              value={stats.breachedThisWeek}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">本月违约</Text>}
              value={stats.breachedThisMonth}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* SLA定义列表 */}
      <Tabs defaultActiveKey="definitions">
        <TabPane tab="SLA定义" key="definitions">
          <Card className="daoda-card">
            <Table
              columns={columns}
              dataSource={slaDefinitions}
              rowKey="id"
              loading={loading}
              pagination={false}
            />
          </Card>
        </TabPane>
        <TabPane tab="违约记录" key="breaches">
          <Card className="daoda-card">
            <Table
              columns={[
                { title: '工单ID', dataIndex: 'ticketId', width: 120 },
                { title: 'SLA', dataIndex: 'slaName', width: 150 },
                { title: '优先级', dataIndex: 'slaLevel', width: 80, render: getLevelTag },
                { title: '创建时间', dataIndex: 'createdAt', width: 120 },
                { title: '响应截止', dataIndex: 'responseDueAt', width: 120 },
                { title: '解决截止', dataIndex: 'resolutionDueAt', width: 120 },
                {
                  title: '响应状态',
                  width: 80,
                  render: (_, record) => (
                    record.responseMet
                      ? <Tag color="success" icon={<CheckCircleOutlined />}>达标</Tag>
                      : <Tag color="error" icon={<CloseCircleOutlined />}>违约</Tag>
                  ),
                },
                {
                  title: '解决状态',
                  width: 80,
                  render: (_, record) => (
                    record.resolutionMet
                      ? <Tag color="success" icon={<CheckCircleOutlined />}>达标</Tag>
                      : <Tag color="error" icon={<CloseCircleOutlined />}>违约</Tag>
                  ),
                },
              ]}
              dataSource={slaRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 新建SLA弹窗 */}
      <Modal
        title="新建SLA定义"
        open={modalVisible}
        onOk={handleCreate}
        onCancel={() => setModalVisible(false)}
        width={600}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="SLA名称" rules={[{ required: true }]}>
                <Input placeholder="请输入SLA名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="SLA编码" rules={[{ required: true }]}>
                <Input placeholder="请输入SLA编码" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="level" label="优先级" rules={[{ required: true }]}>
                <Select placeholder="请选择优先级">
                  <Option value={SLALevel.CRITICAL}>严重</Option>
                  <Option value={SLALevel.HIGH}>高</Option>
                  <Option value={SLALevel.MEDIUM}>中</Option>
                  <Option value={SLALevel.LOW}>低</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description" label="描述">
                <Input placeholder="请输入描述" />
              </Form.Item>
            </Col>
          </Row>
          <Divider>时间设置</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="responseTimeMinutes" label="响应时间(分钟)" rules={[{ required: true }]}>
                <InputNumber min={1} max={480} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="resolutionTimeHours" label="解决时间(小时)" rules={[{ required: true }]}>
                <InputNumber min={1} max={168} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="workHoursStart" label="工作时间开始" rules={[{ required: true }]}>
                <Input placeholder="如: 09:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="workHoursEnd" label="工作时间结束" rules={[{ required: true }]}>
                <Input placeholder="如: 18:00" />
              </Form.Item>
            </Col>
          </Row>
          <Divider>通知与升级</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="notifyBeforeMinutes" label="提前通知(分钟)">
                <InputNumber min={0} max={60} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="escalationLevels" label="升级层级数">
                <InputNumber min={0} max={5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}