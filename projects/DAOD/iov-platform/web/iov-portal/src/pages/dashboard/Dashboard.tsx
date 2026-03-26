/**
 * 监控大屏
 */
import { Row, Col, Card, Statistic, Table, Tag, Progress, Typography } from 'antd'
import {
  LaptopOutlined,
  CarOutlined,
  AlertOutlined,
  DatabaseOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/services/dashboard'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography

// 终端数据类型
interface TerminalRecord {
  key: string
  terminalId: string
  vehicleNo: string
  status: 'online' | 'offline' | 'sleep'
  lastSeen: string
  location: string
  signal: string
}

// 表格列定义
const columns: ColumnsType<TerminalRecord> = [
  {
    title: '终端号',
    dataIndex: 'terminalId',
    key: 'terminalId',
    width: 140,
  },
  {
    title: '车牌号',
    dataIndex: 'vehicleNo',
    key: 'vehicleNo',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        online: 'success',
        offline: 'error',
        sleep: 'warning',
      }
      const textMap: Record<string, string> = {
        online: '在线',
        offline: '离线',
        sleep: '休眠',
      }
      return <Tag color={colorMap[status]}>{textMap[status]}</Tag>
    },
  },
  {
    title: '最后通信',
    dataIndex: 'lastSeen',
    key: 'lastSeen',
    width: 120,
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
    ellipsis: true,
  },
  {
    title: '信号',
    dataIndex: 'signal',
    key: 'signal',
    width: 80,
    render: (signal: string) => {
      const percent = signal === '优秀' ? 100 : signal === '良好' ? 70 : 40
      const status = percent > 70 ? 'success' : percent > 40 ? 'normal' : 'exception'
      return <Progress percent={percent} size="small" status={status} showInfo={false} />
    },
  },
]

// 模拟数据
const mockTerminals: TerminalRecord[] = [
  { key: '1', terminalId: '13800001111', vehicleNo: '川A12345', status: 'online', lastSeen: '10:05:32', location: '成都市高新区', signal: '优秀' },
  { key: '2', terminalId: '13800002222', vehicleNo: '川B67890', status: 'online', lastSeen: '10:04:18', location: '眉山市东坡区', signal: '良好' },
  { key: '3', terminalId: '13800003333', vehicleNo: '川C11111', status: 'offline', lastSeen: '09:30:00', location: '乐山市市中区', signal: '-' },
  { key: '4', terminalId: '13800004444', vehicleNo: '川D22222', status: 'sleep', lastSeen: '09:45:12', location: '雅安市雨城区', signal: '一般' },
  { key: '5', terminalId: '13800005555', vehicleNo: '川E33333', status: 'online', lastSeen: '10:06:01', location: '成都市武侯区', signal: '优秀' },
]

export default function Dashboard() {
  // 获取统计数据
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // 30秒刷新
  })
  
  // 默认统计数据
  const defaultStats = {
    onlineTerminals: 1234,
    todayAccess: 56,
    alarmCount: 3,
    messageTotal: 89432,
    onlineChange: 12,
    accessChange: 8,
  }
  
  const dashboardStats = stats || defaultStats
  
  return (
    <div className="dashboard-page">
      {/* 统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card daoda-card" hoverable>
            <Statistic
              title="在线终端"
              value={dashboardStats.onlineTerminals}
              prefix={<LaptopOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  <RiseOutlined /> {dashboardStats.onlineChange}%
                </span>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card daoda-card" hoverable>
            <Statistic
              title="今日接入"
              value={dashboardStats.todayAccess}
              prefix={<CarOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <span style={{ fontSize: 14, color: '#52c41a' }}>
                  +{dashboardStats.accessChange}
                </span>
              }
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card daoda-card" hoverable>
            <Statistic
              title="告警数量"
              value={dashboardStats.alarmCount}
              prefix={<AlertOutlined style={{ color: dashboardStats.alarmCount > 0 ? '#ff4d4f' : '#52c41a' }} />}
              valueStyle={{ color: dashboardStats.alarmCount > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card daoda-card" hoverable>
            <Statistic
              title="消息总量"
              value={dashboardStats.messageTotal}
              prefix={<DatabaseOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 实时地图预览 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            className="daoda-card" 
            title={
              <Title level={5} style={{ margin: 0 }}>
                🗺️ 终端实时位置
              </Title>
            }
            extra={<a href="/map">查看全屏地图</a>}
          >
            <div style={{ height: 300, background: '#f0f2f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">地图组件加载中...</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            className="daoda-card"
            title={
              <Title level={5} style={{ margin: 0 }}>
                📊 终端状态分布
              </Title>
            }
          >
            <div style={{ padding: '20px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <Text>在线终端</Text>
                <Progress percent={85} strokeColor="#52c41a" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text>休眠终端</Text>
                <Progress percent={10} strokeColor="#faad14" />
              </div>
              <div>
                <Text>离线终端</Text>
                <Progress percent={5} strokeColor="#ff4d4f" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* 最新接入终端 */}
      <Card 
        className="daoda-card" 
        title={
          <Title level={5} style={{ margin: 0 }}>
            📋 最新接入终端
          </Title>
        }
        style={{ marginTop: 24 }}
      >
        <Table 
          columns={columns} 
          dataSource={mockTerminals}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}