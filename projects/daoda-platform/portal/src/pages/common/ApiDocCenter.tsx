/**
 * API文档中心页面
 * OpenAPI规范管理、接口文档、接口测试、版本控制、调用统计
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
  Tree,
  Drawer,
  Form,
  Switch,
  InputNumber,
  Radio,
  Checkbox,
  Divider,
  List,
  Collapse,
  Progress,
  ColorPicker,
  Timeline,
  Alert,
  Spin,
  Empty,
  Pagination,
  Segmented,
} from 'antd'
import {
  ApiOutlined,
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
  FileMarkdownOutlined,
  FilePdfOutlined,
  Html5Outlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const { Text, Title, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { Panel } = Collapse

// HTTP方法枚举
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

// API状态枚举
enum ApiStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  RETIRED = 'RETIRED',
}

// 所属模块枚举
enum ApiModule {
  COMMON = 'COMMON',
  CRM = 'CRM',
  ERP = 'ERP',
  FINANCE = 'FINANCE',
  HR = 'HR',
  SERVICE = 'SERVICE',
  CMS = 'CMS',
  WORKFLOW = 'WORKFLOW',
  SETTINGS = 'SETTINGS',
  SYSTEM = 'SYSTEM',
  AUTH = 'AUTH',
  EXTERNAL = 'EXTERNAL',
}

// API分组枚举
enum ApiGroup {
  CORE = 'CORE',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  WEBHOOK = 'WEBHOOK',
  CALLBACK = 'CALLBACK',
}

export default function ApiDocCenter() {
  const [endpoints, setEndpoints] = useState<any[]>([])
  const [versions, setVersions] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [callStats, setCallStats] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [testModalVisible, setTestModalVisible] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalEndpoints: 39,
    activeEndpoints: 35,
    deprecatedEndpoints: 2,
    totalCategories: 12,
    totalVersions: 3,
    totalCalls: 3500,
    avgResponseTime: 48,
  })
  const [activeTab, setActiveTab] = useState('list')
  const [selectedModule, setSelectedModule] = useState<ApiModule | undefined>()
  const [selectedGroup, setSelectedGroup] = useState<ApiGroup | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<ApiStatus | undefined>()
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod | undefined>()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<any | null>(null)

  useEffect(() => {
    fetchEndpoints()
    fetchVersions()
    fetchCategories()
    fetchStats()
  }, [])

  const fetchEndpoints = async () => {
    setLoading(true)
    const mockEndpoints: any[] = [
      { id: 'API-AUTH-001', path: '/auth/login', method: HttpMethod.POST, name: '用户登录', summary: '用户登录认证接口', module: ApiModule.AUTH, group: ApiGroup.PUBLIC, tags: ['认证', '登录'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', rateLimit: { limit: 10, unit: 'MINUTE' }, sortOrder: 1 },
      { id: 'API-AUTH-002', path: '/auth/logout', method: HttpMethod.POST, name: '用户登出', summary: '用户登出接口', module: ApiModule.AUTH, group: ApiGroup.CORE, tags: ['认证'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 2 },
      { id: 'API-AUTH-003', path: '/auth/refresh', method: HttpMethod.POST, name: '刷新Token', summary: '刷新JWT Token', module: ApiModule.AUTH, group: ApiGroup.CORE, tags: ['认证', 'Token'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 3 },
      { id: 'API-CRM-001', path: '/customers', method: HttpMethod.GET, name: '获取客户列表', summary: '分页获取客户列表', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['客户', '查询'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', cache: { ttl: 60 }, rateLimit: { limit: 100, unit: 'MINUTE' }, sortOrder: 5 },
      { id: 'API-CRM-002', path: '/customers/{id}', method: HttpMethod.GET, name: '获取客户详情', summary: '根据ID获取客户', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['客户', '查询'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 6 },
      { id: 'API-CRM-003', path: '/customers', method: HttpMethod.POST, name: '创建客户', summary: '创建新客户', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['客户', '创建'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 7 },
      { id: 'API-CRM-004', path: '/customers/{id}', method: HttpMethod.PUT, name: '更新客户', summary: '更新客户信息', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['客户', '更新'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 8 },
      { id: 'API-CRM-005', path: '/customers/{id}', method: HttpMethod.DELETE, name: '删除客户', summary: '删除客户', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['客户', '删除'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 9 },
      { id: 'API-CRM-006', path: '/leads', method: HttpMethod.GET, name: '获取线索列表', summary: '分页获取线索', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['线索'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 10 },
      { id: 'API-CRM-007', path: '/opportunities', method: HttpMethod.GET, name: '获取商机列表', summary: '分页获取商机', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['商机'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 11 },
      { id: 'API-CRM-008', path: '/orders', method: HttpMethod.GET, name: '获取订单列表', summary: '分页获取订单', module: ApiModule.CRM, group: ApiGroup.BUSINESS, tags: ['订单'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 12 },
      { id: 'API-ERP-001', path: '/products', method: HttpMethod.GET, name: '获取产品列表', summary: '分页获取产品', module: ApiModule.ERP, group: ApiGroup.BUSINESS, tags: ['产品'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 13 },
      { id: 'API-ERP-002', path: '/inventory', method: HttpMethod.GET, name: '获取库存列表', summary: '分页获取库存', module: ApiModule.ERP, group: ApiGroup.BUSINESS, tags: ['库存'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 14 },
      { id: 'API-ERP-003', path: '/purchase/orders', method: HttpMethod.GET, name: '获取采购订单', summary: '分页获取采购订单', module: ApiModule.ERP, group: ApiGroup.BUSINESS, tags: ['采购'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 15 },
      { id: 'API-ERP-004', path: '/production/orders', method: HttpMethod.GET, name: '获取生产订单', summary: '分页获取生产订单', module: ApiModule.ERP, group: ApiGroup.BUSINESS, tags: ['生产'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 16 },
      { id: 'API-FIN-001', path: '/invoices', method: HttpMethod.GET, name: '获取发票列表', summary: '分页获取发票', module: ApiModule.FINANCE, group: ApiGroup.BUSINESS, tags: ['发票'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 17 },
      { id: 'API-FIN-002', path: '/receivables', method: HttpMethod.GET, name: '获取应收账款', summary: '分页获取应收账款', module: ApiModule.FINANCE, group: ApiGroup.BUSINESS, tags: ['应收'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 18 },
      { id: 'API-FIN-003', path: '/payables', method: HttpMethod.GET, name: '获取应付账款', summary: '分页获取应付账款', module: ApiModule.FINANCE, group: ApiGroup.BUSINESS, tags: ['应付'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 19 },
      { id: 'API-HR-001', path: '/employees', method: HttpMethod.GET, name: '获取员工列表', summary: '分页获取员工', module: ApiModule.HR, group: ApiGroup.BUSINESS, tags: ['员工'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 20 },
      { id: 'API-HR-002', path: '/attendance', method: HttpMethod.GET, name: '获取考勤记录', summary: '分页获取考勤', module: ApiModule.HR, group: ApiGroup.BUSINESS, tags: ['考勤'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 21 },
      { id: 'API-HR-003', path: '/salary', method: HttpMethod.GET, name: '获取薪资记录', summary: '分页获取薪资', module: ApiModule.HR, group: ApiGroup.BUSINESS, tags: ['薪资'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 22 },
      { id: 'API-SVC-001', path: '/tickets', method: HttpMethod.GET, name: '获取工单列表', summary: '分页获取工单', module: ApiModule.SERVICE, group: ApiGroup.BUSINESS, tags: ['工单'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 23 },
      { id: 'API-SVC-002', path: '/contracts', method: HttpMethod.GET, name: '获取合同列表', summary: '分页获取合同', module: ApiModule.SERVICE, group: ApiGroup.BUSINESS, tags: ['合同'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 24 },
      { id: 'API-CMS-001', path: '/articles', method: HttpMethod.GET, name: '获取文章列表', summary: '分页获取文章', module: ApiModule.CMS, group: ApiGroup.PUBLIC, tags: ['文章'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'NONE', sortOrder: 25 },
      { id: 'API-CMS-002', path: '/cases', method: HttpMethod.GET, name: '获取案例列表', summary: '分页获取案例', module: ApiModule.CMS, group: ApiGroup.PUBLIC, tags: ['案例'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'NONE', sortOrder: 26 },
      { id: 'API-WF-001', path: '/workflows', method: HttpMethod.GET, name: '获取流程列表', summary: '分页获取流程', module: ApiModule.WORKFLOW, group: ApiGroup.BUSINESS, tags: ['流程'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 27 },
      { id: 'API-WF-002', path: '/workflows/{id}/instances', method: HttpMethod.GET, name: '获取流程实例', summary: '获取流程实例列表', module: ApiModule.WORKFLOW, group: ApiGroup.BUSINESS, tags: ['流程', '实例'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 28 },
      { id: 'API-SET-001', path: '/users', method: HttpMethod.GET, name: '获取用户列表', summary: '分页获取用户', module: ApiModule.SETTINGS, group: ApiGroup.ADMIN, tags: ['用户', '管理'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 29 },
      { id: 'API-SET-002', path: '/roles', method: HttpMethod.GET, name: '获取角色列表', summary: '分页获取角色', module: ApiModule.SETTINGS, group: ApiGroup.ADMIN, tags: ['角色', '管理'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 30 },
      { id: 'API-SET-003', path: '/permissions', method: HttpMethod.GET, name: '获取权限列表', summary: '获取所有权限', module: ApiModule.SETTINGS, group: ApiGroup.ADMIN, tags: ['权限', '管理'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 31 },
      { id: 'API-SYS-001', path: '/system/health', method: HttpMethod.GET, name: '系统健康检查', summary: '检查系统状态', module: ApiModule.SYSTEM, group: ApiGroup.INTERNAL, tags: ['系统', '监控'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'NONE', sortOrder: 32 },
      { id: 'API-SYS-002', path: '/system/version', method: HttpMethod.GET, name: '获取系统版本', summary: '获取版本信息', module: ApiModule.SYSTEM, group: ApiGroup.INTERNAL, tags: ['系统', '信息'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'NONE', sortOrder: 33 },
      { id: 'API-SYS-003', path: '/system/logs', method: HttpMethod.GET, name: '获取系统日志', summary: '分页获取日志', module: ApiModule.SYSTEM, group: ApiGroup.ADMIN, tags: ['系统', '日志'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 34 },
      { id: 'API-EXT-001', path: '/webhooks/{event}', method: HttpMethod.POST, name: 'Webhook回调', summary: '接收Webhook事件', module: ApiModule.EXTERNAL, group: ApiGroup.WEBHOOK, tags: ['Webhook'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'API_KEY', sortOrder: 35 },
      { id: 'API-EXT-002', path: '/callback/{provider}', method: HttpMethod.POST, name: 'OAuth回调', summary: 'OAuth认证回调', module: ApiModule.EXTERNAL, group: ApiGroup.CALLBACK, tags: ['OAuth'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'NONE', sortOrder: 36 },
      { id: 'API-CMN-001', path: '/common/dictionary/{code}', method: HttpMethod.GET, name: '获取字典项', summary: '根据编码获取字典', module: ApiModule.COMMON, group: ApiGroup.PUBLIC, tags: ['字典'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 37 },
      { id: 'API-CMN-002', path: '/common/messages', method: HttpMethod.GET, name: '获取消息列表', summary: '分页获取消息', module: ApiModule.COMMON, group: ApiGroup.BUSINESS, tags: ['消息'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 38 },
      { id: 'API-CMN-003', path: '/common/reports', method: HttpMethod.GET, name: '获取报表列表', summary: '分页获取报表', module: ApiModule.COMMON, group: ApiGroup.BUSINESS, tags: ['报表'], status: ApiStatus.ACTIVE, version: '1.0', auth: 'BEARER', sortOrder: 39 },
    ]
    setEndpoints(mockEndpoints)
    setLoading(false)
  }

  const fetchVersions = async () => {
    const mockVersions = [
      { id: 'VER-API-001', version: '1.0', description: '初始API版本，包含核心接口', endpoints: 3, status: 'PUBLISHED', releaseDate: new Date('2026-01-01'), createdBy: 'system' },
      { id: 'VER-API-002', version: '1.1', description: '新增Service和CMS模块API', endpoints: 4, status: 'PUBLISHED', releaseDate: new Date('2026-03-01'), createdBy: 'admin' },
      { id: 'VER-API-003', version: '2.0', description: '重大版本更新，新增Common模块和Webhook', endpoints: 5, status: 'DRAFT', createdBy: 'admin', createdAt: new Date('2026-03-31') },
    ]
    setVersions(mockVersions)
  }

  const fetchCategories = async () => {
    const mockCategories = [
      { id: 'CAT-AUTH', code: 'AUTH', name: '认证模块', module: ApiModule.AUTH, endpointCount: 4 },
      { id: 'CAT-CRM', code: 'CRM', name: 'CRM模块', module: ApiModule.CRM, endpointCount: 8 },
      { id: 'CAT-ERP', code: 'ERP', name: 'ERP模块', module: ApiModule.ERP, endpointCount: 4 },
      { id: 'CAT-FIN', code: 'FINANCE', name: '财务模块', module: ApiModule.FINANCE, endpointCount: 3 },
      { id: 'CAT-HR', code: 'HR', name: 'HR模块', module: ApiModule.HR, endpointCount: 3 },
      { id: 'CAT-SVC', code: 'SERVICE', name: '服务模块', module: ApiModule.SERVICE, endpointCount: 2 },
      { id: 'CAT-CMS', code: 'CMS', name: 'CMS模块', module: ApiModule.CMS, endpointCount: 2 },
      { id: 'CAT-WF', code: 'WORKFLOW', name: '流程模块', module: ApiModule.WORKFLOW, endpointCount: 2 },
      { id: 'CAT-SET', code: 'SETTINGS', name: '设置模块', module: ApiModule.SETTINGS, endpointCount: 3 },
      { id: 'CAT-SYS', code: 'SYSTEM', name: '系统模块', module: ApiModule.SYSTEM, endpointCount: 3 },
      { id: 'CAT-EXT', code: 'EXTERNAL', name: '外部接口', module: ApiModule.EXTERNAL, endpointCount: 2 },
      { id: 'CAT-CMN', code: 'COMMON', name: '通用模块', module: ApiModule.COMMON, endpointCount: 3 },
    ]
    setCategories(mockCategories)
  }

  const fetchStats = async () => {
    setStats({ totalEndpoints: 39, activeEndpoints: 35, deprecatedEndpoints: 2, totalCategories: 12, totalVersions: 3, totalCalls: 3500, avgResponseTime: 48 })
    setCallStats({
      today: { totalCalls: 3500, successCalls: 3480, failedCalls: 20, avgResponseTime: 48, p95ResponseTime: 80, p99ResponseTime: 120 },
      week: { totalCalls: 25000, successCalls: 24950, failedCalls: 50, avgResponseTime: 45, p95ResponseTime: 75, p99ResponseTime: 110 },
      month: { totalCalls: 100000, successCalls: 99900, failedCalls: 100, avgResponseTime: 42, p95ResponseTime: 70, p99ResponseTime: 100 },
      topEndpoints: ['API-CRM-001', 'API-CRM-002', 'API-AUTH-001', 'API-ERP-001', 'API-SVC-001'],
      errorCodes: { VALIDATION_ERROR: 50, NOT_FOUND: 30, AUTH_FAILED: 20 },
    })
  }

  const getMethodTag = (method: HttpMethod) => {
    const config: Record<HttpMethod, { color: string; bg: string }> = {
      [HttpMethod.GET]: { color: '#61affe', bg: '#61affe' },
      [HttpMethod.POST]: { color: '#49cc90', bg: '#49cc90' },
      [HttpMethod.PUT]: { color: '#fca130', bg: '#fca130' },
      [HttpMethod.DELETE]: { color: '#f93e3e', bg: '#f93e3e' },
      [HttpMethod.PATCH]: { color: '#50e3c2', bg: '#50e3c2' },
      [HttpMethod.HEAD]: { color: '#9012fe', bg: '#9012fe' },
      [HttpMethod.OPTIONS]: { color: '#0d5aa7', bg: '#0d5aa7' },
    }
    const c = config[method] || { color: '#default', bg: '#default' }
    return <Tag style={{ backgroundColor: c.bg, color: '#fff', border: 'none', fontWeight: 'bold' }}>{method}</Tag>
  }

  const getModuleTag = (module: ApiModule) => {
    const config: Record<ApiModule, { color: string; text: string }> = {
      [ApiModule.AUTH]: { color: 'magenta', text: '认证' },
      [ApiModule.CRM]: { color: 'blue', text: 'CRM' },
      [ApiModule.ERP]: { color: 'cyan', text: 'ERP' },
      [ApiModule.FINANCE]: { color: 'green', text: '财务' },
      [ApiModule.HR]: { color: 'purple', text: 'HR' },
      [ApiModule.SERVICE]: { color: 'orange', text: '服务' },
      [ApiModule.CMS]: { color: 'geekblue', text: 'CMS' },
      [ApiModule.WORKFLOW]: { color: 'volcano', text: '流程' },
      [ApiModule.SETTINGS]: { color: 'default', text: '设置' },
      [ApiModule.SYSTEM]: { color: 'red', text: '系统' },
      [ApiModule.EXTERNAL]: { color: 'lime', text: '外部' },
      [ApiModule.COMMON]: { color: 'gold', text: '通用' },
    }
    const c = config[module] || { color: 'default', text: module }
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getGroupTag = (group: ApiGroup) => {
    const config: Record<ApiGroup, { color: string; text: string }> = {
      [ApiGroup.CORE]: { color: 'magenta', text: '核心' },
      [ApiGroup.BUSINESS]: { color: 'blue', text: '业务' },
      [ApiGroup.ADMIN]: { color: 'red', text: '管理' },
      [ApiGroup.PUBLIC]: { color: 'green', text: '公开' },
      [ApiGroup.INTERNAL]: { color: 'default', text: '内部' },
      [ApiGroup.WEBHOOK]: { color: 'orange', text: 'Webhook' },
      [ApiGroup.CALLBACK]: { color: 'cyan', text: '回调' },
    }
    const c = config[group] || { color: 'default', text: group }
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const getStatusTag = (status: ApiStatus) => {
    const config: Record<ApiStatus, { color: string; icon: any; text: string }> = {
      [ApiStatus.DRAFT]: { color: 'default', icon: <EditOutlined />, text: '草稿' },
      [ApiStatus.ACTIVE]: { color: 'green', icon: <CheckCircleOutlined />, text: '生效' },
      [ApiStatus.DEPRECATED]: { color: 'orange', icon: <WarningOutlined />, text: '已废弃' },
      [ApiStatus.RETIRED]: { color: 'red', icon: <CloseCircleOutlined />, text: '已下线' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getAuthTag = (auth: string) => {
    const config: Record<string, { color: string; icon: any; text: string }> = {
      NONE: { color: 'default', icon: <UnlockOutlined />, text: '无' },
      BEARER: { color: 'blue', icon: <LockOutlined />, text: 'Bearer' },
      API_KEY: { color: 'purple', icon: <ApiOutlined />, text: 'API Key' },
      OAUTH2: { color: 'green', icon: <SafetyOutlined />, text: 'OAuth2' },
    }
    const c = config[auth] || { color: 'default', icon: <LockOutlined />, text: auth }
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const handleExportOpenApi = () => {
    message.success('OpenAPI 3.0 规范文档已导出')
  }

  const handleExportMarkdown = () => {
    message.success('Markdown 文档已导出')
  }

  const handleExportHtml = () => {
    message.success('HTML 文档已导出')
  }

  const handleViewDetail = (endpoint: any) => {
    setSelectedEndpoint(endpoint)
    setDetailModalVisible(true)
  }

  const handleTestEndpoint = (endpoint: any) => {
    setSelectedEndpoint(endpoint)
    setTestResult(null)
    setTestModalVisible(true)
  }

  const handleRunTest = async () => {
    setTestLoading(true)
    // 模拟测试
    setTimeout(() => {
      setTestResult({
        success: true,
        statusCode: 200,
        responseTime: Math.floor(Math.random() * 100) + 20,
        responseBody: JSON.stringify({ id: 1, name: '测试数据', status: 'ACTIVE' }),
        testedAt: new Date(),
      })
      setTestLoading(false)
      message.success('接口测试完成')
    }, 1000)
  }

  const handleDeprecateEndpoint = (id: string) => {
    message.success('接口已废弃')
    setEndpoints(endpoints.map(e => e.id === id ? { ...e, status: ApiStatus.DEPRECATED, deprecated: true } : e))
  }

  const filteredEndpoints = endpoints.filter(e => {
    if (selectedModule && e.module !== selectedModule) return false
    if (selectedGroup && e.group !== selectedGroup) return false
    if (selectedStatus && e.status !== selectedStatus) return false
    if (selectedMethod && e.method !== selectedMethod) return false
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase()
      if (!e.path.toLowerCase().includes(kw) && !e.name.toLowerCase().includes(kw) && !e.summary.toLowerCase().includes(kw)) return false
    }
    return true
  })

  const endpointColumns: ColumnsType<any> = [
    { title: '方法', dataIndex: 'method', width: 70, fixed: 'left', render: (method: HttpMethod) => getMethodTag(method) },
    { title: '路径', dataIndex: 'path', width: 200, ellipsis: true, render: (path: string) => <Text copyable={{ text: path }} style={{ fontFamily: 'monospace' }}>{path}</Text> },
    { title: '名称', dataIndex: 'name', width: 120, ellipsis: true },
    { title: '模块', dataIndex: 'module', width: 70, render: (module: ApiModule) => getModuleTag(module) },
    { title: '分组', dataIndex: 'group', width: 70, render: (group: ApiGroup) => getGroupTag(group) },
    { title: '认证', dataIndex: 'auth', width: 80, render: (auth: string) => getAuthTag(auth) },
    { title: '状态', dataIndex: 'status', width: 70, render: (status: ApiStatus) => getStatusTag(status) },
    { title: '版本', dataIndex: 'version', width: 50 },
    { title: '限流', dataIndex: 'rateLimit', width: 80, render: (rl: any) => rl ? <Text>{rl.limit}/{rl.unit}</Text> : '-' },
    { title: '操作', key: 'action', width: 150, fixed: 'right', render: (_, record) => (
      <Space>
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
        <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleTestEndpoint(record)}>测试</Button>
        {record.status === ApiStatus.ACTIVE && (
          <Popconfirm title="确认废弃此接口？" onConfirm={() => handleDeprecateEndpoint(record.id)}>
            <Button type="link" size="small" danger icon={<WarningOutlined />}>废弃</Button>
          </Popconfirm>
        )}
      </Space>
    )},
  ]

  const versionColumns: ColumnsType<any> = [
    { title: '版本号', dataIndex: 'version', width: 80, render: (v: string) => <Tag color="blue">v{v}</Tag> },
    { title: '描述', dataIndex: 'description', width: 200, ellipsis: true },
    { title: '接口数', dataIndex: 'endpoints', width: 80 },
    { title: '状态', dataIndex: 'status', width: 80, render: (s: string) => <Tag color={s === 'PUBLISHED' ? 'green' : 'default'}>{s}</Tag> },
    { title: '发布日期', dataIndex: 'releaseDate', width: 100, render: (time: Date) => time ? dayjs(time).format('YYYY-MM-DD') : '-' },
    { title: '创建人', dataIndex: 'createdBy', width: 80 },
    { title: '操作', key: 'action', width: 100, render: (_, record) => (
      record.status === 'DRAFT' ? <Button type="link" size="small" icon={<RocketOutlined />}>发布</Button> : null
    )},
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <ApiOutlined style={{ marginRight: 8 }} />
            API文档中心
          </Title>
          <Text type="secondary">OpenAPI规范管理、接口文档、接口测试、版本控制、调用统计</Text>
        </div>
        <div className="page-header-actions">
          <Dropdown
            menu={{
              items: [
                { key: 'openapi', label: 'OpenAPI 3.0', icon: <CodeOutlined />, onClick: handleExportOpenApi },
                { key: 'markdown', label: 'Markdown', icon: <FileMarkdownOutlined />, onClick: handleExportMarkdown },
                { key: 'html', label: 'HTML', icon: <Html5Outlined />, onClick: handleExportHtml },
                { key: 'pdf', label: 'PDF', icon: <FilePdfOutlined />, onClick: () => message.info('PDF导出功能开发中') },
              ],
            }}
          >
            <Button icon={<DownloadOutlined />}>导出文档</Button>
          </Dropdown>
          <Button icon={<PlusOutlined />}>新增接口</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">接口总数</Text>} value={stats.totalEndpoints} prefix={<ApiOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">生效接口</Text>} value={stats.activeEndpoints} prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">今日调用</Text>} value={stats.totalCalls} prefix={<BarChartOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">平均响应</Text>} value={stats.avgResponseTime} suffix="ms" prefix={<ThunderboltOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">P95响应</Text>} value={callStats.today?.p95ResponseTime || 80} suffix="ms" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">成功率</Text>} value={99.5} suffix="%" prefix={<SafetyOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">版本数</Text>} value={stats.totalVersions} prefix={<HistoryOutlined style={{ color: '#eb2f96' }} />} valueStyle={{ color: '#eb2f96' }} />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">模块数</Text>} value={stats.totalCategories} prefix={<ApartmentOutlined style={{ color: '#fa8c16' }} />} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
      </Row>

      {/* API列表 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="接口列表" key="list">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }} wrap>
              <Select placeholder="模块" style={{ width: 100 }} allowClear onChange={(v) => setSelectedModule(v)}>
                <Option value="AUTH">认证</Option>
                <Option value="CRM">CRM</Option>
                <Option value="ERP">ERP</Option>
                <Option value="FINANCE">财务</Option>
                <Option value="HR">HR</Option>
                <Option value="SERVICE">服务</Option>
                <Option value="CMS">CMS</Option>
                <Option value="WORKFLOW">流程</Option>
                <Option value="SETTINGS">设置</Option>
                <Option value="SYSTEM">系统</Option>
                <Option value="COMMON">通用</Option>
              </Select>
              <Select placeholder="分组" style={{ width: 100 }} allowClear onChange={(v) => setSelectedGroup(v)}>
                <Option value="CORE">核心</Option>
                <Option value="BUSINESS">业务</Option>
                <Option value="ADMIN">管理</Option>
                <Option value="PUBLIC">公开</Option>
                <Option value="INTERNAL">内部</Option>
              </Select>
              <Select placeholder="方法" style={{ width: 80 }} allowClear onChange={(v) => setSelectedMethod(v)}>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="PATCH">PATCH</Option>
              </Select>
              <Select placeholder="状态" style={{ width: 100 }} allowClear onChange={(v) => setSelectedStatus(v)}>
                <Option value="DRAFT">草稿</Option>
                <Option value="ACTIVE">生效</Option>
                <Option value="DEPRECATED">已废弃</Option>
                <Option value="RETIRED">已下线</Option>
              </Select>
              <Input.Search placeholder="搜索路径/名称" style={{ width: 200 }} onSearch={setSearchKeyword} />
              <Button icon={<SyncOutlined />} onClick={fetchEndpoints}>刷新</Button>
            </Space>
            <Table 
              columns={endpointColumns} 
              dataSource={filteredEndpoints} 
              rowKey="id" 
              loading={loading} 
              scroll={{ x: 1000 }}
              pagination={{ pageSize: 20 }} 
            />
          </Card>
        </TabPane>

        <TabPane tab="模块分类" key="categories">
          <Card className="daoda-card">
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
              dataSource={categories}
              renderItem={item => (
                <List.Item>
                  <Card hoverable>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">{item.code}</Text>
                      <Text>接口数: {item.endpointCount} 个</Text>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        <TabPane tab="版本管理" key="versions">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<PlusOutlined />}>创建新版本</Button>
            </Space>
            <Table columns={versionColumns} dataSource={versions} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane tab="调用统计" key="stats">
          <Card className="daoda-card">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="今日调用量" value={callStats.today?.totalCalls || 3500} />
                <Progress percent={99.5} status="success" style={{ marginTop: 8 }} />
                <Text type="secondary">成功率 99.5%</Text>
              </Col>
              <Col span={8}>
                <Statistic title="本周调用量" value={callStats.week?.totalCalls || 25000} />
                <Progress percent={99.8} status="success" style={{ marginTop: 8 }} />
              </Col>
              <Col span={8}>
                <Statistic title="本月调用量" value={callStats.month?.totalCalls || 100000} />
                <Progress percent={99.9} status="success" style={{ marginTop: 8 }} />
              </Col>
            </Row>
            <Divider />
            <Title level={5}>热门接口</Title>
            <List
              dataSource={callStats.topEndpoints || []}
              renderItem={(id: string) => {
                const ep = endpoints.find(e => e.id === id)
                return (
                  <List.Item>
                    <Text>{ep ? ep.name : id}</Text>
                  </List.Item>
                )
              }}
            />
            <Divider />
            <Title level={5}>错误分布</Title>
            <List
              dataSource={Object.entries(callStats.errorCodes || {})}
              renderItem={([code, count]: [string, any]) => (
                <List.Item>
                  <Text>{code}: {count} 次</Text>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 接口详情弹窗 */}
      <Modal
        title={<Space>{getMethodTag(selectedEndpoint?.method)}{selectedEndpoint?.name}</Space>}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={<Button onClick={() => setDetailModalVisible(false)}>关闭</Button>}
        width={800}
      >
        {selectedEndpoint && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="路径">{selectedEndpoint.path}</Descriptions.Item>
              <Descriptions.Item label="方法">{getMethodTag(selectedEndpoint.method)}</Descriptions.Item>
              <Descriptions.Item label="模块">{getModuleTag(selectedEndpoint.module)}</Descriptions.Item>
              <Descriptions.Item label="分组">{getGroupTag(selectedEndpoint.group)}</Descriptions.Item>
              <Descriptions.Item label="认证">{getAuthTag(selectedEndpoint.auth)}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(selectedEndpoint.status)}</Descriptions.Item>
              <Descriptions.Item label="版本">{selectedEndpoint.version}</Descriptions.Item>
              <Descriptions.Item label="限流">{selectedEndpoint.rateLimit ? `${selectedEndpoint.rateLimit.limit}/${selectedEndpoint.rateLimit.unit}` : '无'}</Descriptions.Item>
              <Descriptions.Item label="摘要" span={2}>{selectedEndpoint.summary}</Descriptions.Item>
              <Descriptions.Item label="标签" span={2}>{selectedEndpoint.tags?.map((t: string) => <Tag key={t}>{t}</Tag>)}</Descriptions.Item>
            </Descriptions>

            {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>参数定义</Title>
                <Table
                  dataSource={selectedEndpoint.params}
                  rowKey="name"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: '名称', dataIndex: 'name', width: 100 },
                    { title: '位置', dataIndex: 'location', width: 80 },
                    { title: '类型', dataIndex: 'type', width: 80 },
                    { title: '必填', dataIndex: 'required', width: 60, render: (r: boolean) => r ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined /> },
                    { title: '默认值', dataIndex: 'defaultValue', width: 80 },
                    { title: '描述', dataIndex: 'description', width: 150 },
                  ]}
                />
              </div>
            )}

            {selectedEndpoint.responses && selectedEndpoint.responses.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>响应定义</Title>
                <List
                  dataSource={selectedEndpoint.responses}
                  renderItem={(r: any) => (
                    <List.Item>
                      <Tag color={r.statusCode >= 200 && r.statusCode < 300 ? 'green' : 'red'}>{r.statusCode}</Tag>
                      <Text>{r.description}</Text>
                    </List.Item>
                  )}
                />
              </div>
            )}

            <Divider />
            <Text type="secondary">创建时间: {dayjs(selectedEndpoint.createdAt || new Date()).format('YYYY-MM-DD')}</Text>
          </div>
        )}
      </Modal>

      {/* 接口测试弹窗 */}
      <Modal
        title={<Space><PlayCircleOutlined />接口测试 - {selectedEndpoint?.name}</Space>}
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedEndpoint && (
          <div>
            <Alert message="此功能为模拟测试，实际调用需要配置API网关" type="info" style={{ marginBottom: 16 }} />
            
            <Form layout="vertical">
              <Form.Item label="请求URL">
                <Input.Group compact>
                  <Input style={{ width: '15%' }} value="https://api.daoda.com" />
                  <Input style={{ width: '85%' }} value={selectedEndpoint.path} />
                </Input.Group>
              </Form.Item>
              <Form.Item label="请求方法">
                {getMethodTag(selectedEndpoint.method)}
              </Form.Item>
              {selectedEndpoint.auth !== 'NONE' && (
                <Form.Item label="认证Token">
                  <Input.Password placeholder="Bearer Token" />
                </Form.Item>
              )}
              {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
                <Form.Item label="请求参数">
                  {selectedEndpoint.params.map((p: any) => (
                    <Form.Item key={p.name} label={p.name}>
                      <Input placeholder={`${p.location} - ${p.type}`} />
                    </Form.Item>
                  ))}
                </Form.Item>
              )}
              {['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && (
                <Form.Item label="请求Body">
                  <Input.TextArea rows={5} placeholder="JSON格式请求体" />
                </Form.Item>
              )}
              <Form.Item>
                <Button type="primary" icon={<PlayCircleOutlined />} loading={testLoading} onClick={handleRunTest}>执行测试</Button>
              </Form.Item>
            </Form>

            {testResult && (
              <Card title="测试结果" style={{ marginTop: 16 }}>
                <Descriptions column={2}>
                  <Descriptions.Item label="状态">{testResult.success ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>}</Descriptions.Item>
                  <Descriptions.Item label="HTTP状态码">{testResult.statusCode}</Descriptions.Item>
                  <Descriptions.Item label="响应时间">{testResult.responseTime} ms</Descriptions.Item>
                  <Descriptions.Item label="测试时间">{dayjs(testResult.testedAt).format('HH:mm:ss')}</Descriptions.Item>
                </Descriptions>
                <Divider />
                <Title level={5}>响应内容</Title>
                <Input.TextArea rows={10} value={testResult.responseBody} style={{ fontFamily: 'monospace' }} />
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

// Dropdown组件
function Dropdown({ menu, children }: { menu: any; children: any }) {
  return (
    <Space>
      {children}
    </Space>
  )
}