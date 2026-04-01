/**
 * 系统监控仪表盘页面
 * 系统健康状态、性能指标、服务监控、告警管理、日志查看
 */
import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Modal,
  Descriptions,
  Tabs,
  Statistic,
  message,
  Tooltip,
  Select,
  DatePicker,
  Input,
  Popconfirm,
  Badge,
  List,
  Collapse,
  Progress,
  Timeline,
  Alert,
  Spin,
  Empty,
  Segmented,
  Switch,
  Form,
  InputNumber,
  Radio,
  Divider,
  Timeline as AntTimeline,
} from 'antd'
import {
  DashboardOutlined,
  SettingOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  HistoryOutlined,
  LinkOutlined,
  FileTextOutlined,
  CodeOutlined,
  FieldStringOutlined,
  TagsOutlined,
  GlobalOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
  StarOutlined,
  AlertOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  RocketOutlined,
  ToolOutlined,
  PlayCircleOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  LockOutlined,
  UnlockOutlined,
  BookOutlined,
  ApiOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  PauseCircleOutlined,
  StopOutlined,
  BugOutlined,
  MonitorOutlined,
  HeartOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { Panel } = Collapse

// 服务状态枚举
enum ServiceStatus {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  DOWN = 'DOWN',
  UNKNOWN = 'UNKNOWN',
}

// 告警级别枚举
enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

// 告警状态枚举
enum AlertStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  SILENCED = 'SILENCED',
}

// 服务类型枚举
enum ServiceType {
  APPLICATION = 'APPLICATION',
  DATABASE = 'DATABASE',
  CACHE = 'CACHE',
  MESSAGE_QUEUE = 'MESSAGE_QUEUE',
  FILE_STORAGE = 'FILE_STORAGE',
  EMAIL_SERVICE = 'EMAIL_SERVICE',
  AUTH_SERVICE = 'AUTH_SERVICE',
  API_GATEWAY = 'API_GATEWAY',
  LOG_SERVICE = 'LOG_SERVICE',
  MONITORING = 'MONITORING',
}

export default function SystemMonitorDashboard() {
  const [loading, setLoading] = useState(false)
  const [overview, setOverview] = useState<any>({
    overallStatus: 'HEALTHY',
    servicesHealthy: 8,
    servicesWarning: 2,
    servicesCritical: 0,
    servicesDown: 0,
    activeAlerts: 3,
    criticalAlerts: 0,
    uptime: 864000,
    cpuUsage: 45.2,
    memoryUsage: 62.8,
    diskUsage: 55.6,
    networkIn: 50.2,
    networkOut: 25.8,
    apiCallsTotal: 3500,
    apiCallsSuccess: 3480,
    apiCallsFailed: 20,
    activeJobs: 1,
    pendingJobs: 1,
    failedJobs: 1,
  })
  const [services, setServices] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [databases, setDatabases] = useState<any[]>([])
  const [apiEndpoints, setApiEndpoints] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [metrics, setMetrics] = useState<any[]>([])
  const [userActivity, setUserActivity] = useState<any>({})
  const [activeTab, setActiveTab] = useState('overview')
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    // 模拟数据
    setOverview({
      overallStatus: 'HEALTHY',
      servicesHealthy: 8,
      servicesWarning: 2,
      servicesCritical: 0,
      servicesDown: 0,
      activeAlerts: 3,
      criticalAlerts: 0,
      uptime: 864000,
      cpuUsage: 45.2,
      memoryUsage: 62.8,
      diskUsage: 55.6,
      networkIn: 50.2,
      networkOut: 25.8,
      apiCallsTotal: 3500,
      apiCallsSuccess: 3480,
      apiCallsFailed: 20,
      activeJobs: 1,
      pendingJobs: 1,
      failedJobs: 1,
    })
    setServices([
      { id: 'SVC-APP-001', name: 'Application Server', type: ServiceType.APPLICATION, host: 'localhost:3000', status: ServiceStatus.HEALTHY, version: '1.0.0', uptime: 864000 },
      { id: 'SVC-APP-002', name: 'Portal Server', type: ServiceType.APPLICATION, host: 'localhost:5173', status: ServiceStatus.HEALTHY, version: '1.0.0', uptime: 864000 },
      { id: 'SVC-DB-001', name: 'PostgreSQL Database', type: ServiceType.DATABASE, host: 'localhost:5432', status: ServiceStatus.HEALTHY, version: '15.0', uptime: 864000 },
      { id: 'SVC-CACHE-001', name: 'Redis Cache', type: ServiceType.CACHE, host: 'localhost:6379', status: ServiceStatus.HEALTHY, version: '7.0', uptime: 864000 },
      { id: 'SVC-MQ-001', name: 'Kafka Message Queue', type: ServiceType.MESSAGE_QUEUE, host: 'localhost:9092', status: ServiceStatus.HEALTHY, version: '3.0', uptime: 864000 },
      { id: 'SVC-STORAGE-001', name: 'MinIO Storage', type: ServiceType.FILE_STORAGE, host: 'localhost:9000', status: ServiceStatus.HEALTHY, version: 'latest', uptime: 864000 },
      { id: 'SVC-EMAIL-001', name: 'Email Service', type: ServiceType.EMAIL_SERVICE, host: 'smtp.example.com:587', status: ServiceStatus.HEALTHY, uptime: 432000 },
      { id: 'SVC-AUTH-001', name: 'Auth Service', type: ServiceType.AUTH_SERVICE, host: 'localhost:3001', status: ServiceStatus.HEALTHY, version: '1.0.0', uptime: 864000 },
      { id: 'SVC-GATEWAY-001', name: 'API Gateway', type: ServiceType.API_GATEWAY, host: 'localhost:8080', status: ServiceStatus.WARNING, version: '1.0.0', uptime: 864000 },
      { id: 'SVC-LOG-001', name: 'Log Service', type: ServiceType.LOG_SERVICE, host: 'localhost:9200', status: ServiceStatus.HEALTHY, version: '8.0', uptime: 432000 },
    ])
    setAlerts([
      { id: 'ALERT-001', name: 'CPU使用率过高', level: AlertLevel.WARNING, status: AlertStatus.ACTIVE, message: 'CPU使用率达到85%', source: 'ApplicationServer', createdAt: new Date('2026-03-31T15:00:00') },
      { id: 'ALERT-002', name: '磁盘空间不足', level: AlertLevel.WARNING, status: AlertStatus.ACTIVE, message: '磁盘使用率达到92%', source: 'DiskMonitor', createdAt: new Date('2026-03-31T15:00:00') },
      { id: 'ALERT-003', name: 'API响应时间过长', level: AlertLevel.INFO, status: AlertStatus.ACKNOWLEDGED, message: 'API平均响应时间达到1200ms', source: 'ApiMonitor', createdAt: new Date('2026-03-31T14:30:00'), acknowledgedBy: 'admin' },
    ])
    setJobs([
      { id: 'JOB-001', name: '数据同步任务', type: 'CRON', status: 'SUCCESS', lastRunAt: new Date('2026-03-31T15:00:00'), nextRunAt: new Date('2026-03-31T16:00:00'), duration: 1250, progress: 100 },
      { id: 'JOB-002', name: '报表生成任务', type: 'SCHEDULED', status: 'SUCCESS', lastRunAt: new Date('2026-03-31T14:30:00'), nextRunAt: new Date('2026-03-31T15:30:00'), duration: 3500, progress: 100 },
      { id: 'JOB-003', name: '日志清理任务', type: 'RECURRING', status: 'SUCCESS', lastRunAt: new Date('2026-03-31T15:00:00'), nextRunAt: new Date('2026-03-31T15:10:00'), duration: 500, progress: 100 },
      { id: 'JOB-004', name: '缓存刷新任务', type: 'CRON', status: 'RUNNING', lastRunAt: new Date('2026-03-31T15:20:00'), nextRunAt: new Date('2026-03-31T15:30:00'), progress: 65 },
      { id: 'JOB-005', name: '邮件发送任务', type: 'ONE_TIME', status: 'PENDING', nextRunAt: new Date('2026-03-31T16:00:00'), progress: 0 },
      { id: 'JOB-006', name: '数据备份任务', type: 'SCHEDULED', status: 'FAILED', lastRunAt: new Date('2026-03-31T14:00:00'), error: '存储空间不足', progress: 0 },
    ])
    setDatabases([
      { id: 'DB-001', name: '主数据库', type: 'POSTGRES', host: 'localhost:5432', database: 'daoda_platform', status: ServiceStatus.HEALTHY, connections: 25, maxConnections: 100, activeQueries: 12, responseTime: 5 },
      { id: 'DB-002', name: 'Redis缓存', type: 'REDIS', host: 'localhost:6379', database: '0', status: ServiceStatus.HEALTHY, connections: 15, maxConnections: 50, activeQueries: 5, responseTime: 2 },
      { id: 'DB-003', name: 'ClickHouse分析库', type: 'CLICKHOUSE', host: 'localhost:8123', database: 'analytics', status: ServiceStatus.HEALTHY, connections: 5, maxConnections: 20, activeQueries: 2, responseTime: 15 },
      { id: 'DB-004', name: 'Elasticsearch日志库', type: 'ELASTICSEARCH', host: 'localhost:9200', database: 'logs', status: ServiceStatus.HEALTHY, connections: 3, maxConnections: 10, activeQueries: 1, responseTime: 10 },
    ])
    setApiEndpoints([
      { path: '/auth/login', method: 'POST', status: ServiceStatus.HEALTHY, avgResponseTime: 100, calls: 500, errors: 20, successRate: 96 },
      { path: '/customers', method: 'GET', status: ServiceStatus.HEALTHY, avgResponseTime: 45, calls: 1250, errors: 20, successRate: 98.4 },
      { path: '/customers/{id}', method: 'GET', status: ServiceStatus.HEALTHY, avgResponseTime: 30, calls: 800, errors: 5, successRate: 99.4 },
      { path: '/products', method: 'GET', status: ServiceStatus.HEALTHY, avgResponseTime: 35, calls: 600, errors: 2, successRate: 99.7 },
      { path: '/invoices', method: 'GET', status: ServiceStatus.HEALTHY, avgResponseTime: 40, calls: 400, errors: 5, successRate: 98.8 },
      { path: '/tickets', method: 'GET', status: ServiceStatus.HEALTHY, avgResponseTime: 50, calls: 350, errors: 5, successRate: 98.6 },
      { path: '/system/health', method: 'GET', status: ServiceStatus.HEALTHY, avgResponseTime: 5, calls: 1000, errors: 0, successRate: 100 },
    ])
    setLogs([
      { id: 'LOG-001', level: 'INFO', message: '系统启动完成', source: 'ApplicationServer', timestamp: new Date('2026-03-31T15:00:00') },
      { id: 'LOG-002', level: 'INFO', message: '数据库连接成功', source: 'DatabaseService', timestamp: new Date('2026-03-31T15:00:05') },
      { id: 'LOG-003', level: 'INFO', message: '用户登录成功', source: 'AuthService', timestamp: new Date('2026-03-31T15:05:00') },
      { id: 'LOG-004', level: 'WARN', message: '缓存命中率偏低', source: 'CacheService', timestamp: new Date('2026-03-31T15:10:00') },
      { id: 'LOG-005', level: 'ERROR', message: '数据备份失败', source: 'BackupService', timestamp: new Date('2026-03-31T14:00:00') },
      { id: 'LOG-006', level: 'INFO', message: 'API调用统计完成', source: 'MonitorService', timestamp: new Date('2026-03-31T15:15:00') },
    ])
    setMetrics([
      { id: 'MET-CPU-001', type: 'CPU', name: 'CPU使用率', value: 45.2, unit: '%', trend: 'STABLE', changePercent: 2.1 },
      { id: 'MET-MEM-001', type: 'MEMORY', name: '内存使用率', value: 62.8, unit: '%', trend: 'UP', changePercent: 3.5 },
      { id: 'MET-DISK-001', type: 'DISK', name: '磁盘使用率', value: 55.6, unit: '%', trend: 'UP', changePercent: 1.2 },
      { id: 'MET-NET-001', type: 'NETWORK', name: '入站流量', value: 50.2, unit: 'Mbps', trend: 'UP', changePercent: 8.5 },
      { id: 'MET-API-001', type: 'API', name: 'API调用量', value: 3500, unit: 'calls', trend: 'UP', changePercent: 12.5 },
      { id: 'MET-API-002', type: 'API', name: 'API平均响应', value: 48, unit: 'ms', trend: 'DOWN', changePercent: -5.2 },
    ])
    setUserActivity({
      onlineUsers: 85,
      totalUsers: 1250,
      activeSessions: 125,
      newUsersToday: 15,
      newUsersThisWeek: 85,
      newUsersThisMonth: 350,
      avgSessionDuration: 25,
      peakConcurrency: 150,
      deviceStats: { desktop: 60, mobile: 35, tablet: 5 },
    })
    setLoading(false)
  }

  const getStatusTag = (status: ServiceStatus) => {
    const config: Record<ServiceStatus, { color: string; icon: any; text: string }> = {
      [ServiceStatus.HEALTHY]: { color: 'green', icon: <CheckCircleOutlined />, text: '健康' },
      [ServiceStatus.WARNING]: { color: 'orange', icon: <WarningOutlined />, text: '警告' },
      [ServiceStatus.CRITICAL]: { color: 'red', icon: <CloseCircleOutlined />, text: '严重' },
      [ServiceStatus.DOWN]: { color: 'default', icon: <StopOutlined />, text: '不可用' },
      [ServiceStatus.UNKNOWN]: { color: 'default', icon: <ExclamationCircleOutlined />, text: '未知' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getAlertLevelTag = (level: AlertLevel) => {
    const config: Record<AlertLevel, { color: string; icon: any }> = {
      [AlertLevel.INFO]: { color: 'blue', icon: <InfoCircleOutlined /> },
      [AlertLevel.WARNING]: { color: 'orange', icon: <WarningOutlined /> },
      [AlertLevel.ERROR]: { color: 'red', icon: <CloseCircleOutlined /> },
      [AlertLevel.CRITICAL]: { color: 'magenta', icon: <ExclamationCircleOutlined /> },
    }
    const c = config[level]
    return <Tag color={c.color} icon={c.icon}>{level}</Tag>
  }

  const getAlertStatusTag = (status: AlertStatus) => {
    const config: Record<AlertStatus, { color: string }> = {
      [AlertStatus.ACTIVE]: { color: 'red' },
      [AlertStatus.RESOLVED]: { color: 'green' },
      [AlertStatus.ACKNOWLEDGED]: { color: 'blue' },
      [AlertStatus.SILENCED]: { color: 'default' },
    }
    const c = config[status]
    return <Tag color={c.color}>{status}</Tag>
  }

  const getJobStatusTag = (status: string) => {
    const config: Record<string, { color: string; icon: any }> = {
      RUNNING: { color: 'processing', icon: <SyncOutlined spin /> },
      SUCCESS: { color: 'success', icon: <CheckCircleOutlined /> },
      FAILED: { color: 'error', icon: <CloseCircleOutlined /> },
      PENDING: { color: 'default', icon: <ClockCircleOutlined /> },
      CANCELLED: { color: 'warning', icon: <StopOutlined /> },
    }
    const c = config[status] || { color: 'default', icon: null }
    return <Tag color={c.color} icon={c.icon}>{status}</Tag>
  }

  const getLogLevelTag = (level: string) => {
    const config: Record<string, { color: string }> = {
      INFO: { color: 'blue' },
      WARN: { color: 'orange' },
      ERROR: { color: 'red' },
      DEBUG: { color: 'default' },
      FATAL: { color: 'magenta' },
    }
    const c = config[level] || { color: 'default' }
    return <Tag color={c.color}>{level}</Tag>
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'UP') return <span style={{ color: 'red' }}>↑</span>
    if (trend === 'DOWN') return <span style={{ color: 'green' }}>↓</span>
    return <span style={{ color: 'gray' }}>→</span>
  }

  const handleViewDetail = (item: any, type: string) => {
    setSelectedItem(item)
    setSelectedType(type)
    setDetailModalVisible(true)
  }

  const handleRestartService = (id: string) => {
    message.success('服务重启中...')
  }

  const handleAcknowledgeAlert = (id: string) => {
    message.success('告警已确认')
  }

  const handleResolveAlert = (id: string) => {
    message.success('告警已解决')
  }

  const handleCancelJob = (id: string) => {
    message.success('任务已取消')
  }

  const handleRetryJob = (id: string) => {
    message.success('任务重试中...')
  }

  const handleRefresh = () => {
    fetchData()
    message.success('数据已刷新')
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}天 ${hours}小时`
  }

  const serviceColumns: ColumnsType<any> = [
    { title: '服务名称', dataIndex: 'name', width: 180 },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '地址', dataIndex: 'host', width: 150 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: ServiceStatus) => getStatusTag(s) },
    { title: '版本', dataIndex: 'version', width: 80 },
    { title: '运行时间', dataIndex: 'uptime', width: 100, render: (u: number) => formatUptime(u) },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'service')}>详情</Button>
        <Popconfirm title="确认重启服务？" onConfirm={() => handleRestartService(record.id)}>
          <Button type="link" size="small" icon={<ReloadOutlined />}>重启</Button>
        </Popconfirm>
      </Space>
    )},
  ]

  const alertColumns: ColumnsType<any> = [
    { title: '告警名称', dataIndex: 'name', width: 150 },
    { title: '级别', dataIndex: 'level', width: 80, render: (l: AlertLevel) => getAlertLevelTag(l) },
    { title: '状态', dataIndex: 'status', width: 100, render: (s: AlertStatus) => getAlertStatusTag(s) },
    { title: '消息', dataIndex: 'message', width: 200, ellipsis: true },
    { title: '来源', dataIndex: 'source', width: 120 },
    { title: '时间', dataIndex: 'createdAt', width: 150, render: (t: Date) => dayjs(t).format('MM-DD HH:mm:ss') },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        {record.status === 'ACTIVE' && (
          <>
            <Button type="link" size="small" onClick={() => handleAcknowledgeAlert(record.id)}>确认</Button>
            <Button type="link" size="small" onClick={() => handleResolveAlert(record.id)}>解决</Button>
          </>
        )}
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'alert')}>详情</Button>
      </Space>
    )},
  ]

  const jobColumns: ColumnsType<any> = [
    { title: '任务名称', dataIndex: 'name', width: 150 },
    { title: '类型', dataIndex: 'type', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => getJobStatusTag(s) },
    { title: '上次执行', dataIndex: 'lastRunAt', width: 150, render: (t: Date) => t ? dayjs(t).format('MM-DD HH:mm:ss') : '-' },
    { title: '下次执行', dataIndex: 'nextRunAt', width: 150, render: (t: Date) => t ? dayjs(t).format('MM-DD HH:mm:ss') : '-' },
    { title: '耗时', dataIndex: 'duration', width: 80, render: (d: number) => d ? `${d}ms` : '-' },
    { title: '进度', dataIndex: 'progress', width: 100, render: (p: number) => <Progress percent={p} size="small" /> },
    { title: '操作', key: 'action', width: 120, render: (_, record) => (
      <Space>
        {record.status === 'FAILED' && <Button type="link" size="small" onClick={() => handleRetryJob(record.id)}>重试</Button>}
        {record.status === 'PENDING' && <Button type="link" size="small" danger onClick={() => handleCancelJob(record.id)}>取消</Button>}
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'job')}>详情</Button>
      </Space>
    )},
  ]

  const databaseColumns: ColumnsType<any> = [
    { title: '名称', dataIndex: 'name', width: 120 },
    { title: '类型', dataIndex: 'type', width: 100 },
    { title: '地址', dataIndex: 'host', width: 150 },
    { title: '数据库', dataIndex: 'database', width: 120 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: ServiceStatus) => getStatusTag(s) },
    { title: '连接数', dataIndex: 'connections', width: 80, render: (c: number, r: any) => `${c}/${r.maxConnections}` },
    { title: '活跃查询', dataIndex: 'activeQueries', width: 80 },
    { title: '响应时间', dataIndex: 'responseTime', width: 80, render: (t: number) => `${t}ms` },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'database')}>详情</Button>
    )},
  ]

  const apiColumns: ColumnsType<any> = [
    { title: '端点', dataIndex: 'path', width: 200 },
    { title: '方法', dataIndex: 'method', width: 60 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: ServiceStatus) => getStatusTag(s) },
    { title: '平均响应', dataIndex: 'avgResponseTime', width: 80, render: (t: number) => `${t}ms` },
    { title: '调用次数', dataIndex: 'calls', width: 80 },
    { title: '错误数', dataIndex: 'errors', width: 60 },
    { title: '成功率', dataIndex: 'successRate', width: 80, render: (r: number) => <Tag color={r >= 99 ? 'green' : r >= 95 ? 'orange' : 'red'}>{r}%</Tag> },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'api')}>详情</Button>
    )},
  ]

  const logColumns: ColumnsType<any> = [
    { title: '级别', dataIndex: 'level', width: 60, render: (l: string) => getLogLevelTag(l) },
    { title: '消息', dataIndex: 'message', width: 300, ellipsis: true },
    { title: '来源', dataIndex: 'source', width: 120 },
    { title: '时间', dataIndex: 'timestamp', width: 150, render: (t: Date) => dayjs(t).format('MM-DD HH:mm:ss') },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record, 'log')}>详情</Button>
    )},
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <DashboardOutlined style={{ marginRight: 8 }} />
            系统监控仪表盘
          </Title>
          <Text type="secondary">系统健康状态、性能指标、服务监控、告警管理、日志查看</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<SyncOutlined />} onClick={handleRefresh}>刷新</Button>
          <Button icon={<SettingOutlined />}>设置</Button>
        </div>
      </div>

      {/* 系统概览 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="系统概览" key="overview">
          {/* 状态卡片 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card stat-card">
                <Statistic title={<Text type="secondary">整体状态</Text>} value={overview.overallStatus === 'HEALTHY' ? '健康' : overview.overallStatus} prefix={<HeartOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card stat-card">
                <Statistic title={<Text type="secondary">健康服务</Text>} value={overview.servicesHealthy} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card stat-card">
                <Statistic title={<Text type="secondary">警告服务</Text>} value={overview.servicesWarning} prefix={<WarningOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card stat-card">
                <Statistic title={<Text type="secondary">活跃告警</Text>} value={overview.activeAlerts} prefix={<AlertOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
              </Card>
            </Col>
          </Row>

          {/* 资源使用 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="CPU使用率" value={overview.cpuUsage} suffix="%" />
                <Progress percent={overview.cpuUsage} size="small" status={overview.cpuUsage > 80 ? 'exception' : 'active'} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="内存使用率" value={overview.memoryUsage} suffix="%" />
                <Progress percent={overview.memoryUsage} size="small" status={overview.memoryUsage > 85 ? 'exception' : 'active'} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="磁盘使用率" value={overview.diskUsage} suffix="%" />
                <Progress percent={overview.diskUsage} size="small" status={overview.diskUsage > 90 ? 'exception' : 'active'} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="网络入站" value={overview.networkIn} suffix="Mbps" />
                <Progress percent={overview.networkIn} size="small" />
              </Card>
            </Col>
          </Row>

          {/* API调用 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="API总调用" value={overview.apiCallsTotal} prefix={<ApiOutlined style={{ color: '#1890ff' }} />} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="成功调用" value={overview.apiCallsSuccess} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="失败调用" value={overview.apiCallsFailed} prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="系统运行时间" value={formatUptime(overview.uptime)} prefix={<ClockCircleOutlined />} valueStyle={{ fontSize: 16 }} />
              </Card>
            </Col>
          </Row>

          {/* 用户活动 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="在线用户" value={userActivity.onlineUsers || 85} prefix={<UserOutlined style={{ color: '#722ed1' }} />} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="活跃会话" value={userActivity.activeSessions || 125} prefix={<DesktopOutlined style={{ color: '#13c2c2' }} />} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="今日新增用户" value={userActivity.newUsersToday || 15} prefix={<UserOutlined />} />
              </Card>
            </Col>
            <Col xs={12} sm={6} lg={3}>
              <Card className="daoda-card">
                <Statistic title="平均会话时长" value={userActivity.avgSessionDuration || 25} suffix="分钟" />
              </Card>
            </Col>
          </Row>

          {/* 指标趋势 */}
          <Card className="daoda-card" title="核心指标" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              {metrics.map(m => (
                <Col xs={12} sm={8} lg={6} key={m.id}>
                  <Card size="small">
                    <Statistic title={m.name} value={m.value} suffix={m.unit} />
                    <Text type="secondary">{getTrendIcon(m.trend)} {m.changePercent > 0 ? '+' : ''}{m.changePercent}%</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="服务监控" key="services">
          <Card className="daoda-card">
            <Table columns={serviceColumns} dataSource={services} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="告警管理" key="alerts">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="级别" style={{ width: 100 }} allowClear>
                <Option value="INFO">INFO</Option>
                <Option value="WARNING">WARNING</Option>
                <Option value="ERROR">ERROR</Option>
                <Option value="CRITICAL">CRITICAL</Option>
              </Select>
              <Select placeholder="状态" style={{ width: 100 }} allowClear>
                <Option value="ACTIVE">活跃</Option>
                <Option value="ACKNOWLEDGED">已确认</Option>
                <Option value="RESOLVED">已解决</Option>
              </Select>
              <Button icon={<PlusOutlined />}>创建告警</Button>
            </Space>
            <Table columns={alertColumns} dataSource={alerts} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="任务监控" key="jobs">
          <Card className="daoda-card">
            <Table columns={jobColumns} dataSource={jobs} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="数据库监控" key="databases">
          <Card className="daoda-card">
            <Table columns={databaseColumns} dataSource={databases} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="API监控" key="api">
          <Card className="daoda-card">
            <Table columns={apiColumns} dataSource={apiEndpoints} rowKey="path" loading={loading} pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="日志查看" key="logs">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="级别" style={{ width: 100 }} allowClear>
                <Option value="INFO">INFO</Option>
                <Option value="WARN">WARN</Option>
                <Option value="ERROR">ERROR</Option>
                <Option value="DEBUG">DEBUG</Option>
              </Select>
              <Input.Search placeholder="搜索日志内容" style={{ width: 200 }} />
              <Button icon={<DownloadOutlined />}>导出日志</Button>
            </Space>
            <Table columns={logColumns} dataSource={logs} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
          </Card>
        </TabPane>
      </Tabs>

      {/* 详情弹窗 */}
      <Modal
        title={selectedType === 'service' ? '服务详情' : selectedType === 'alert' ? '告警详情' : selectedType === 'job' ? '任务详情' : selectedType === 'database' ? '数据库详情' : selectedType === 'api' ? 'API详情' : '日志详情'}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={<Button onClick={() => setDetailModalVisible(false)}>关闭</Button>}
        width={700}
      >
        {selectedItem && (
          <Descriptions bordered column={2}>
            {Object.entries(selectedItem).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}