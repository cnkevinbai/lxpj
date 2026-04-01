/**
 * 客户公海池页面
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Typography,
  Statistic,
  Row,
  Col,
  Input,
  Select,
  Tooltip,
  Badge,
  Empty,
} from 'antd'
import {
  TeamOutlined,
  UserAddOutlined,
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

const { Text, Title } = Typography
const { Option } = Select

interface PoolCustomer {
  id: string
  name: string
  level: 'A' | 'B' | 'C'
  industry: string
  contact: string
  phone: string
  province: string
  city: string
  lastFollowUp?: string
  inPoolDays: number
  createdAt: string
}

export default function CustomerPool() {
  const [customers, setCustomers] = useState<PoolCustomer[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>({ total: 0, byLevel: [], byIndustry: [] })
  const [filterLevel, setFilterLevel] = useState<string>()

  useEffect(() => {
    fetchPoolCustomers()
    fetchStats()
  }, [])

  const fetchPoolCustomers = async () => {
    setLoading(true)
    // 模拟数据
    const mockData: PoolCustomer[] = [
      { id: '1', name: '北京某景区管理有限公司', level: 'A', industry: '景区', contact: '王经理', phone: '138****1234', province: '北京', city: '北京', lastFollowUp: '2026-02-15', inPoolDays: 45, createdAt: '2025-12-01' },
      { id: '2', name: '上海某高尔夫俱乐部', level: 'B', industry: '高尔夫', contact: '李总', phone: '139****5678', province: '上海', city: '上海', lastFollowUp: '2026-03-10', inPoolDays: 21, createdAt: '2026-01-15' },
      { id: '3', name: '广州某游乐园', level: 'C', industry: '游乐场', contact: '张经理', phone: '137****9012', province: '广东', city: '广州', inPoolDays: 7, createdAt: '2026-03-24' },
    ]
    setCustomers(mockData)
    setLoading(false)
  }

  const fetchStats = async () => {
    setStats({
      total: 3,
      byLevel: [
        { level: 'A', count: 1 },
        { level: 'B', count: 1 },
        { level: 'C', count: 1 },
      ] as any,
      byIndustry: [],
    })
  }

  const handleClaim = (id: string) => {
    Modal.confirm({
      title: '确认领取',
      content: '确定要领取这个客户吗？领取后该客户将分配给您负责。',
      onOk: () => {
        message.success('领取成功')
        fetchPoolCustomers()
      },
    })
  }

  const columns: ColumnsType<PoolCustomer> = [
    {
      title: '客户名称',
      dataIndex: 'name',
      width: 200,
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.province} {record.city}</Text>
        </Space>
      ),
    },
    {
      title: '等级',
      dataIndex: 'level',
      width: 80,
      render: (level: string) => {
        const colors: Record<string, string> = { A: 'gold', B: 'blue', C: 'default' }
        return <Tag color={colors[level]}>{level}级</Tag>
      },
    },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 100,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      width: 100,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '进入公海',
      dataIndex: 'inPoolDays',
      width: 100,
      render: (days: number) => (
        <Tooltip title="在公海池天数">
          <Tag color={days > 30 ? 'red' : days > 14 ? 'orange' : 'green'}>
            {days}天
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: '最后跟进',
      dataIndex: 'lastFollowUp',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('MM-DD') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="primary" size="small" icon={<UserAddOutlined />} onClick={() => handleClaim(record.id)}>
          领取
        </Button>
      ),
    },
  ]

  const filteredData = filterLevel
    ? customers.filter(c => c.level === filterLevel)
    : customers

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <TeamOutlined style={{ marginRight: 8 }} />
            客户公海池
          </Title>
          <Text type="secondary">销售资源回收再分配</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<SettingOutlined />}>回收规则</Button>
          <Button icon={<ReloadOutlined />} onClick={fetchPoolCustomers}>刷新</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">公海客户</Text>}
              value={stats.total}
              suffix="个"
              prefix={<TeamOutlined style={{ color: '#6600ff' }} />}
              valueStyle={{ color: '#6600ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">A级客户</Text>}
              value={stats.byLevel.find((l: any) => l.level === 'A')?.count || 0}
              suffix="个"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">B级客户</Text>}
              value={stats.byLevel.find((l: any) => l.level === 'B')?.count || 0}
              suffix="个"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="daoda-card stat-card">
            <Statistic
              title={<Text type="secondary">C级客户</Text>}
              value={stats.byLevel.find((l: any) => l.level === 'C')?.count || 0}
              suffix="个"
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card className="daoda-card" style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索客户名称"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            allowClear
          />
          <Select
            placeholder="客户等级"
            style={{ width: 120 }}
            allowClear
            value={filterLevel}
            onChange={setFilterLevel}
          >
            <Option value="A">A级</Option>
            <Option value="B">B级</Option>
            <Option value="C">C级</Option>
          </Select>
        </Space>
      </Card>

      {/* 客户列表 */}
      <Card className="daoda-card">
        {filteredData.length === 0 ? (
          <Empty description="公海池暂无客户" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        )}
      </Card>
    </div>
  )
}