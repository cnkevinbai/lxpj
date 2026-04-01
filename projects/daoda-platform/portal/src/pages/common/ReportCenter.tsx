/**
 * 报表中心页面
 * 报表模板、报表实例、报表订阅、仪表盘、KPI指标
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
  Progress,
  Switch,
  Grid,
  Dropdown,
  Menu,
  Divider,
  Badge,
} from 'antd'
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DownloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ScheduleOutlined,
  BellOutlined,
  MailOutlined,
  SyncOutlined,
  SettingOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  MinusOutlined,
  AreaChartOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { useBreakpoint } = Grid

// 报表类型枚举
enum ReportType {
  CRM_SUMMARY = 'CRM_SUMMARY',
  CRM_CUSTOMER = 'CRM_CUSTOMER',
  CRM_SALES = 'CRM_SALES',
  ERP_SUMMARY = 'ERP_SUMMARY',
  ERP_INVENTORY = 'ERP_INVENTORY',
  FINANCE_SUMMARY = 'FINANCE_SUMMARY',
  FINANCE_PROFIT = 'FINANCE_PROFIT',
  HR_SUMMARY = 'HR_SUMMARY',
  SERVICE_SUMMARY = 'SERVICE_SUMMARY',
  CMS_SUMMARY = 'CMS_SUMMARY',
  WORKFLOW_SUMMARY = 'WORKFLOW_SUMMARY',
  SYSTEM_SUMMARY = 'SYSTEM_SUMMARY',
  CUSTOM = 'CUSTOM',
}

// 报表周期枚举
enum ReportPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

// 报表状态枚举
enum ReportStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SCHEDULED = 'SCHEDULED',
}

export default function ReportCenter() {
  const screens = useBreakpoint()
  const [templates, setTemplates] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [dashboards, setDashboards] = useState<any[]>([])
  const [kpis, setKpis] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any | null>(null)
  const [stats, setStats] = useState({
    templateCount: 10,
    reportCount: 5,
    subscriptionCount: 3,
    dashboardCount: 2,
    kpiCount: 25,
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedDashboard, setSelectedDashboard] = useState<any | null>(null)

  useEffect(() => {
    fetchTemplates()
    fetchReports()
    fetchSubscriptions()
    fetchDashboards()
    fetchKpis()
    fetchStats()
  }, [])

  const fetchTemplates = async () => {
    const mockTemplates = [
      { id: 'TPL-CRM-001', name: 'CRM业务汇总报表', reportType: ReportType.CRM_SUMMARY, category: 'CRM', description: 'CRM模块核心业务指标汇总', isSystem: true, charts: 5, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-CRM-002', name: '销售业绩报表', reportType: ReportType.CRM_SALES, category: 'CRM', description: '销售人员业绩统计分析', isSystem: true, charts: 5, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-ERP-001', name: 'ERP业务汇总报表', reportType: ReportType.ERP_SUMMARY, category: 'ERP', description: 'ERP模块核心业务指标汇总', isSystem: true, charts: 6, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-FIN-001', name: '财务汇总报表', reportType: ReportType.FINANCE_SUMMARY, category: 'Finance', description: '财务模块核心指标汇总', isSystem: true, charts: 7, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-HR-001', name: 'HR人力资源报表', reportType: ReportType.HR_SUMMARY, category: 'HR', description: 'HR模块核心指标汇总', isSystem: true, charts: 7, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-SVC-001', name: '售后服务报表', reportType: ReportType.SERVICE_SUMMARY, category: 'Service', description: '服务模块核心指标汇总', isSystem: true, charts: 7, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-CMS-001', name: 'CMS内容运营报表', reportType: ReportType.CMS_SUMMARY, category: 'CMS', description: 'CMS模块核心指标汇总', isSystem: true, charts: 7, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-WF-001', name: '流程执行报表', reportType: ReportType.WORKFLOW_SUMMARY, category: 'Workflow', description: 'Workflow模块核心指标汇总', isSystem: true, charts: 7, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-SYS-001', name: '系统运营报表', reportType: ReportType.SYSTEM_SUMMARY, category: 'System', description: '系统核心指标汇总', isSystem: true, charts: 7, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'TPL-CUSTOM-001', name: '自定义销售分析', reportType: ReportType.CUSTOM, category: 'Custom', description: '自定义报表模板', isSystem: false, charts: 3, defaultPeriod: ReportPeriod.MONTHLY, createdBy: 'U-001', createdAt: new Date('2026-03-15') },
    ]
    setTemplates(mockTemplates)
  }

  const fetchReports = async () => {
    setLoading(true)
    const mockReports = [
      { id: 'RPT-001', templateId: 'TPL-CRM-001', name: 'CRM业务汇总报表-2026年3月', reportType: ReportType.CRM_SUMMARY, period: ReportPeriod.MONTHLY, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31'), status: ReportStatus.COMPLETED, data: { customers: 156, sales: 580000, conversionRate: 18.5 }, summary: '本月CRM业务整体良好', generatedBy: 'system', generatedAt: new Date('2026-03-31 06:00'), createdAt: new Date('2026-03-31 06:00'), downloadUrl: '/reports/RPT-001.pdf' },
      { id: 'RPT-002', templateId: 'TPL-FIN-001', name: '财务汇总报表-2026年3月', reportType: ReportType.FINANCE_SUMMARY, period: ReportPeriod.MONTHLY, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31'), status: ReportStatus.COMPLETED, data: { income: 680000, expense: 320000, profit: 360000 }, summary: '本月财务状况良好，净利润36万元', generatedBy: 'system', generatedAt: new Date('2026-03-31 06:00'), createdAt: new Date('2026-03-31 06:00'), downloadUrl: '/reports/RPT-002.pdf' },
      { id: 'RPT-003', templateId: 'TPL-ERP-001', name: 'ERP业务汇总报表-2026年3月', reportType: ReportType.ERP_SUMMARY, period: ReportPeriod.MONTHLY, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31'), status: ReportStatus.COMPLETED, data: { inventoryValue: 1200000, turnoverRate: 4.2 }, summary: '库存周转率4.2次/月', generatedBy: 'system', generatedAt: new Date('2026-03-31 06:00'), createdAt: new Date('2026-03-31 06:00'), downloadUrl: '/reports/RPT-003.pdf' },
      { id: 'RPT-004', templateId: 'TPL-SVC-001', name: '售后服务报表-2026年3月', reportType: ReportType.SERVICE_SUMMARY, period: ReportPeriod.MONTHLY, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31'), status: ReportStatus.COMPLETED, data: { tickets: 68, completionRate: 94.5, satisfaction: 4.8 }, summary: '工单完成率94.5%，满意度4.8分', generatedBy: 'system', generatedAt: new Date('2026-03-31 06:00'), createdAt: new Date('2026-03-31 06:00'), downloadUrl: '/reports/RPT-004.pdf' },
      { id: 'RPT-005', templateId: 'TPL-SYS-001', name: '系统运营报表-2026年3月', reportType: ReportType.SYSTEM_SUMMARY, period: ReportPeriod.MONTHLY, startDate: new Date('2026-03-01'), endDate: new Date('2026-03-31'), status: ReportStatus.COMPLETED, data: { users: 125, activeUsers: 98, apiCalls: 52000 }, summary: '系统运行稳定', generatedBy: 'system', generatedAt: new Date('2026-03-31 06:00'), createdAt: new Date('2026-03-31 06:00'), downloadUrl: '/reports/RPT-005.pdf' },
    ]
    setReports(mockReports)
    setLoading(false)
  }

  const fetchSubscriptions = async () => {
    const mockSubs = [
      { id: 'SUB-001', templateId: 'TPL-CRM-001', name: 'CRM日报订阅', period: ReportPeriod.DAILY, recipients: ['sales@daoda.com', 'manager@daoda.com'], channels: ['EMAIL', 'DINGTALK'], scheduleTime: '08:00', enabled: true, createdBy: 'U-001', createdAt: new Date('2026-01-01'), lastSentAt: new Date('2026-03-30 08:00'), nextSentAt: new Date('2026-03-31 08:00') },
      { id: 'SUB-002', templateId: 'TPL-FIN-001', name: '财务周报订阅', period: ReportPeriod.WEEKLY, recipients: ['finance@daoda.com', 'ceo@daoda.com'], channels: ['EMAIL'], scheduleTime: '09:00', enabled: true, createdBy: 'U-002', createdAt: new Date('2026-01-01'), lastSentAt: new Date('2026-03-24 09:00'), nextSentAt: new Date('2026-03-31 09:00') },
      { id: 'SUB-003', templateId: 'TPL-ERP-001', name: 'ERP月报订阅', period: ReportPeriod.MONTHLY, recipients: ['operation@daoda.com'], channels: ['EMAIL', 'FEISHU'], scheduleTime: '10:00', enabled: true, createdBy: 'U-003', createdAt: new Date('2026-01-01'), lastSentAt: new Date('2026-02-28 10:00'), nextSentAt: new Date('2026-03-31 10:00') },
    ]
    setSubscriptions(mockSubs)
  }

  const fetchDashboards = async () => {
    const mockDashboards = [
      { id: 'DB-001', name: '企业运营总览', description: '全模块核心指标一览', isDefault: true, widgets: 11, createdBy: 'system', createdAt: new Date('2026-01-01') },
      { id: 'DB-002', name: '销售业绩仪表盘', description: 'CRM销售核心指标', isDefault: false, widgets: 7, createdBy: 'system', createdAt: new Date('2026-01-01') },
    ]
    setDashboards(mockDashboards)
    setSelectedDashboard(mockDashboards[0])
  }

  const fetchKpis = async () => {
    const mockKpis = [
      { id: 'KPI-CRM-001', name: '活跃客户数', module: 'CRM', value: 156, target: 200, unit: '家', trend: 'UP', trendValue: 12, status: 'WARNING' },
      { id: 'KPI-CRM-002', name: '本月销售额', module: 'CRM', value: 580000, target: 600000, unit: '元', trend: 'UP', trendValue: 8.5, status: 'WARNING' },
      { id: 'KPI-CRM-003', name: '线索转化率', module: 'CRM', value: 18.5, target: 20, unit: '%', trend: 'UP', trendValue: 2.3, status: 'WARNING' },
      { id: 'KPI-ERP-001', name: '库存周转率', module: 'ERP', value: 4.2, target: 5, unit: '次/月', trend: 'UP', trendValue: 0.3, status: 'WARNING' },
      { id: 'KPI-ERP-002', name: '库存总值', module: 'ERP', value: 1200000, unit: '元', trend: 'STABLE', trendValue: 0, status: 'GOOD' },
      { id: 'KPI-FIN-001', name: '本月收入', module: 'Finance', value: 680000, target: 700000, unit: '元', trend: 'UP', trendValue: 5.2, status: 'WARNING' },
      { id: 'KPI-FIN-002', name: '净利润', module: 'Finance', value: 360000, target: 300000, unit: '元', trend: 'UP', trendValue: 12, status: 'GOOD' },
      { id: 'KPI-FIN-003', name: '利润率', module: 'Finance', value: 52.9, target: 45, unit: '%', trend: 'UP', trendValue: 5.2, status: 'GOOD' },
      { id: 'KPI-HR-001', name: '员工总数', module: 'HR', value: 125, unit: '人', trend: 'UP', trendValue: 3, status: 'GOOD' },
      { id: 'KPI-HR-002', name: '考勤达标率', module: 'HR', value: 96.5, target: 95, unit: '%', trend: 'UP', trendValue: 1.5, status: 'GOOD' },
      { id: 'KPI-SVC-001', name: '工单完成率', module: 'Service', value: 94.5, target: 95, unit: '%', trend: 'UP', trendValue: 2, status: 'WARNING' },
      { id: 'KPI-SVC-002', name: '客户满意度', module: 'Service', value: 4.8, target: 4.5, unit: '分', trend: 'UP', trendValue: 0.2, status: 'GOOD' },
      { id: 'KPI-CMS-001', name: '本月访问量', module: 'CMS', value: 125000, unit: 'PV', trend: 'UP', trendValue: 18, status: 'GOOD' },
      { id: 'KPI-WF-001', name: '流程完成率', module: 'Workflow', value: 98.5, target: 95, unit: '%', trend: 'UP', trendValue: 1.5, status: 'GOOD' },
      { id: 'KPI-SYS-001', name: '用户总数', module: 'System', value: 125, unit: '人', trend: 'UP', trendValue: 5, status: 'GOOD' },
    ]
    setKpis(mockKpis)
  }

  const fetchStats = async () => {
    setStats({ templateCount: 10, reportCount: 5, subscriptionCount: 3, dashboardCount: 2, kpiCount: 25 })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      CRM: '#1890ff',
      ERP: '#722ed1',
      Finance: '#52c41a',
      HR: '#fa8c16',
      Service: '#13c2c2',
      CMS: '#eb2f96',
      Workflow: '#faad14',
      System: '#595959',
      Custom: '#f5222d',
    }
    return colors[category] || '#1890ff'
  }

  const getStatusTag = (status: ReportStatus) => {
    const config: Record<ReportStatus, { color: string; icon: any; text: string }> = {
      DRAFT: { color: 'default', icon: <FileTextOutlined />, text: '草稿' },
      GENERATING: { color: 'processing', icon: <SyncOutlined spin />, text: '生成中' },
      COMPLETED: { color: 'success', icon: <CheckCircleOutlined />, text: '已完成' },
      FAILED: { color: 'error', icon: <CloseCircleOutlined />, text: '失败' },
      SCHEDULED: { color: 'warning', icon: <ScheduleOutlined />, text: '已计划' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getPeriodTag = (period: ReportPeriod) => {
    const config: Record<ReportPeriod, { color: string; text: string }> = {
      DAILY: { color: 'blue', text: '日报' },
      WEEKLY: { color: 'cyan', text: '周报' },
      MONTHLY: { color: 'green', text: '月报' },
      QUARTERLY: { color: 'purple', text: '季报' },
      YEARLY: { color: 'gold', text: '年报' },
    }
    const c = config[period]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'UP') return <CaretUpOutlined style={{ color: '#52c41a' }} />
    if (trend === 'DOWN') return <CaretDownOutlined style={{ color: '#ff4d4f' }} />
    return <MinusOutlined style={{ color: '#8c8c8c' }} />
  }

  const getKpiColor = (status: string) => {
    if (status === 'GOOD') return '#52c41a'
    if (status === 'WARNING') return '#faad14'
    return '#ff4d4f'
  }

  const handleGenerateReport = (templateId: string) => message.info('开始生成报表...')
  const handleDownload = (id: string) => message.success('下载链接已生成')
  const handleDelete = (id: string) => message.success('已删除')
  const handleToggleSubscription = (id: string, enabled: boolean) => message.success(enabled ? '订阅已启用' : '订阅已禁用')
  const handleRefreshKpis = () => {
    message.info('刷新KPI数据...')
    setKpis(kpis.map(kpi => ({
      ...kpi,
      value: kpi.value + Math.floor(Math.random() * 10 - 5),
      updatedAt: new Date(),
    })))
    message.success('KPI数据已刷新')
  }

  const templateColumns: ColumnsType<any> = [
    { title: '模板ID', dataIndex: 'id', width: 100 },
    { title: '名称', dataIndex: 'name', width: 180, ellipsis: true },
    { title: '类型', dataIndex: 'category', width: 80, render: (cat: string) => <Tag color={getCategoryColor(cat)}>{cat}</Tag> },
    { title: '报表类型', dataIndex: 'reportType', width: 120, ellipsis: true },
    { title: '图表数', dataIndex: 'charts', width: 60 },
    { title: '默认周期', dataIndex: 'defaultPeriod', width: 80, render: (p: ReportPeriod) => getPeriodTag(p) },
    { title: '系统模板', dataIndex: 'isSystem', width: 80, render: (sys: boolean) => sys ? <Tag color="blue">系统</Tag> : <Tag color="default">自定义</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD') },
    { title: '操作', key: 'action', width: 120, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<CalendarOutlined />} onClick={() => handleGenerateReport(record.id)}>生成</Button>
        {!record.isSystem && <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>}
        {!record.isSystem && <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger />
        </Popconfirm>}
      </Space>
    )},
  ]

  const reportColumns: ColumnsType<any> = [
    { title: '报表ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', width: 200, ellipsis: true },
    { title: '类型', dataIndex: 'reportType', width: 100, render: (type: ReportType) => <Tag>{type}</Tag> },
    { title: '周期', dataIndex: 'period', width: 80, render: (p: ReportPeriod) => getPeriodTag(p) },
    { title: '时间范围', width: 150, render: (_, record) => `${dayjs(record.startDate).format('MM-DD')} ~ ${dayjs(record.endDate).format('MM-DD')}` },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: ReportStatus) => getStatusTag(status) },
    { title: '生成时间', dataIndex: 'generatedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <Space>
        {record.status === ReportStatus.COMPLETED && (
          <Button type="link" size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(record.id)}>下载</Button>
        )}
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedReport(record); setDetailModalVisible(true) }}>详情</Button>
        <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </Space>
    )},
  ]

  const subscriptionColumns: ColumnsType<any> = [
    { title: '订阅ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '周期', dataIndex: 'period', width: 80, render: (p: ReportPeriod) => getPeriodTag(p) },
    { title: '发送时间', dataIndex: 'scheduleTime', width: 80 },
    { title: '渠道', dataIndex: 'channels', width: 120, render: (channels: string[]) => channels.map(c => <Tag key={c} color={c === 'EMAIL' ? 'blue' : c === 'DINGTALK' ? 'cyan' : 'purple'}>{c}</Tag>) },
    { title: '上次发送', dataIndex: 'lastSentAt', width: 100, render: (time: Date) => time ? dayjs(time).format('MM-DD HH:mm') : '-' },
    { title: '下次发送', dataIndex: 'nextSentAt', width: 100, render: (time: Date) => time ? dayjs(time).format('MM-DD HH:mm') : '-' },
    { title: '状态', dataIndex: 'enabled', width: 80, render: (enabled: boolean) => <Switch checked={enabled} onChange={(val) => handleToggleSubscription('', val)} /> },
    { title: '操作', key: 'action', width: 80, render: () => <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button> },
  ]

  const dashboardColumns: ColumnsType<any> = [
    { title: '仪表盘ID', dataIndex: 'id', width: 80 },
    { title: '名称', dataIndex: 'name', width: 150 },
    { title: '描述', dataIndex: 'description', width: 200, ellipsis: true },
    { title: '组件数', dataIndex: 'widgets', width: 60 },
    { title: '默认', dataIndex: 'isDefault', width: 60, render: (def: boolean) => def ? <Tag color="blue">默认</Tag> : '-' },
    { title: '创建时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD') },
    { title: '操作', key: 'action', width: 120, render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setSelectedDashboard(record)}>查看</Button>
        {!record.isDefault && <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>}
        {!record.isDefault && <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" size="small" icon={<DeleteOutlined />} danger />
        </Popconfirm>}
      </Space>
    )},
  ]

  // 模拟仪表盘KPI卡片渲染
  const renderKpiCard = (kpi: any) => {
    const progress = kpi.target ? Math.round(kpi.value / kpi.target * 100) : null
    return (
      <Card className="daoda-card" style={{ height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>{kpi.module}</Text>
            <Title level={4} style={{ margin: 0, marginTop: 4, color: getKpiColor(kpi.status) }}>
              {kpi.value.toLocaleString()} {kpi.unit}
            </Title>
          </div>
          <div>
            {getTrendIcon(kpi.trend)}
            <Text style={{ fontSize: 12, marginLeft: 4, color: kpi.trend === 'UP' ? '#52c41a' : kpi.trend === 'DOWN' ? '#ff4d4f' : '#8c8c8c' }}>
              {kpi.trendValue}%
            </Text>
          </div>
        </div>
        {progress && (
          <Progress percent={Math.min(progress, 100)} strokeColor={getKpiColor(kpi.status)} showInfo={false} style={{ marginTop: 12 }} />
        )}
        <Text style={{ fontSize: 12 }}>{kpi.name}</Text>
        {kpi.target && <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>目标: {kpi.target}</Text>}
      </Card>
    )
  }

  // 模拟图表渲染
  const renderMockChart = (type: string, title: string) => {
    return (
      <Card className="daoda-card" title={title} style={{ height: '100%' }}>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 4 }}>
          {type === 'LINE' && <LineChartOutlined style={{ fontSize: 48, color: '#1890ff' }} />}
          {type === 'BAR' && <BarChartOutlined style={{ fontSize: 48, color: '#722ed1' }} />}
          {type === 'PIE' && <PieChartOutlined style={{ fontSize: 48, color: '#52c41a' }} />}
          {type === 'AREA' && <AreaChartOutlined style={{ fontSize: 48, color: '#13c2c2' }} />}
          {type === 'GAUGE' && <DashboardOutlined style={{ fontSize: 48, color: '#faad14' }} />}
          <Text type="secondary" style={{ marginLeft: 12 }}>图表数据区域</Text>
        </div>
      </Card>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <BarChartOutlined style={{ marginRight: 8 }} />
            报表中心
          </Title>
          <Text type="secondary">报表模板、报表实例、报表订阅、仪表盘、KPI指标</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<PlusOutlined />} style={{ marginRight: 8 }}>新建模板</Button>
          <Button icon={<PlusOutlined />} style={{ marginRight: 8 }}>新建仪表盘</Button>
          <Button icon={<CalendarOutlined />}>生成报表</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">报表模板</Text>} value={stats.templateCount} prefix={<FileTextOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">已生成报表</Text>} value={stats.reportCount} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">报表订阅</Text>} value={stats.subscriptionCount} prefix={<BellOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">仪表盘</Text>} value={stats.dashboardCount} prefix={<DashboardOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">KPI指标</Text>} value={stats.kpiCount} prefix={<AreaChartOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">本月报表</Text>} value={5} suffix="份" prefix={<BarChartOutlined style={{ color: '#eb2f96' }} />} valueStyle={{ color: '#eb2f96' }} />
          </Card>
        </Col>
      </Row>

      {/* 报表列表 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="仪表盘" key="dashboard">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select value={selectedDashboard?.id} style={{ width: 200 }} onChange={(val) => setSelectedDashboard(dashboards.find(d => d.id === val))}>
                {dashboards.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}
              </Select>
              <Button icon={<SettingOutlined />}>配置</Button>
              <Button icon={<SyncOutlined />} onClick={handleRefreshKpis}>刷新数据</Button>
            </Space>

            {/* KPI指标展示 */}
            <Row gutter={[16, 16]}>
              {kpis.slice(0, 6).map(kpi => (
                <Col xs={24} sm={12} lg={8} xl={4} key={kpi.id}>
                  {renderKpiCard(kpi)}
                </Col>
              ))}
            </Row>

            <Divider />

            {/* 图表展示 */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} lg={12}>
                {renderMockChart('AREA', '本月业绩趋势')}
              </Col>
              <Col xs={24} lg={6}>
                {renderMockChart('GAUGE', '库存周转率')}
              </Col>
              <Col xs={24} lg={6}>
                {renderMockChart('GAUGE', '利润率')}
              </Col>
              <Col xs={24} lg={8}>
                {renderMockChart('PIE', '工单状态分布')}
              </Col>
              <Col xs={24} lg={8}>
                {renderMockChart('BAR', '员工部门分布')}
              </Col>
              <Col xs={24} lg={8}>
                {renderMockChart('LINE', '内容发布趋势')}
              </Col>
            </Row>
          </Card>
        </TabPane>
        <TabPane tab="报表模板" key="templates">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="分类" style={{ width: 120 }} allowClear>
                <Option value="CRM">CRM</Option>
                <Option value="ERP">ERP</Option>
                <Option value="Finance">Finance</Option>
                <Option value="HR">HR</Option>
                <Option value="Service">Service</Option>
                <Option value="CMS">CMS</Option>
                <Option value="Workflow">Workflow</Option>
                <Option value="System">System</Option>
              </Select>
              <Input.Search placeholder="搜索模板" style={{ width: 200 }} />
              <Button icon={<PlusOutlined />}>新建模板</Button>
            </Space>
            <Table columns={templateColumns} dataSource={templates} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
        <TabPane tab="报表实例" key="reports">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="报表类型" style={{ width: 120 }} allowClear>
                <Option value="CRM_SUMMARY">CRM汇总</Option>
                <Option value="ERP_SUMMARY">ERP汇总</Option>
                <Option value="FINANCE_SUMMARY">财务汇总</Option>
                <Option value="HR_SUMMARY">HR汇总</Option>
                <Option value="SERVICE_SUMMARY">服务汇总</Option>
              </Select>
              <Select placeholder="状态" style={{ width: 120 }} allowClear>
                <Option value="COMPLETED">已完成</Option>
                <Option value="GENERATING">生成中</Option>
                <Option value="FAILED">失败</Option>
              </Select>
              <RangePicker />
              <Button icon={<CalendarOutlined />}>生成报表</Button>
            </Space>
            <Table columns={reportColumns} dataSource={reports} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
          </Card>
        </TabPane>
        <TabPane tab="报表订阅" key="subscriptions">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="订阅周期" style={{ width: 120 }} allowClear>
                <Option value="DAILY">日报</Option>
                <Option value="WEEKLY">周报</Option>
                <Option value="MONTHLY">月报</Option>
              </Select>
              <Button icon={<BellOutlined />}>新建订阅</Button>
            </Space>
            <Table columns={subscriptionColumns} dataSource={subscriptions} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
        <TabPane tab="仪表盘管理" key="dashboards">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<PlusOutlined />}>新建仪表盘</Button>
            </Space>
            <Table columns={dashboardColumns} dataSource={dashboards} rowKey="id" pagination={false} />
          </Card>
        </TabPane>
      </Tabs>

      {/* 报表详情弹窗 */}
      <Modal title="报表详情" open={detailModalVisible} onCancel={() => setDetailModalVisible(false)} footer={null} width={700}>
        {selectedReport && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="报表ID">{selectedReport.id}</Descriptions.Item>
            <Descriptions.Item label="名称">{selectedReport.name}</Descriptions.Item>
            <Descriptions.Item label="报表类型">{selectedReport.reportType}</Descriptions.Item>
            <Descriptions.Item label="周期">{getPeriodTag(selectedReport.period)}</Descriptions.Item>
            <Descriptions.Item label="开始日期">{dayjs(selectedReport.startDate).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="结束日期">{dayjs(selectedReport.endDate).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(selectedReport.status)}</Descriptions.Item>
            <Descriptions.Item label="生成时间">{dayjs(selectedReport.generatedAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="摘要" span={2}>{selectedReport.summary}</Descriptions.Item>
            <Descriptions.Item label="数据" span={2}>
              <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>{JSON.stringify(selectedReport.data, null, 2)}</pre>
            </Descriptions.Item>
            {selectedReport.downloadUrl && (
              <Descriptions.Item label="下载链接" span={2}>
                <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(selectedReport.id)}>
                  {selectedReport.downloadUrl}
                </Button>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}