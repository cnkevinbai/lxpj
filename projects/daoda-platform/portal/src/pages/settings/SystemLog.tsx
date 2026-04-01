/**
 * 系统日志审计页面
 * 操作日志、登录日志、访问日志、审计报表
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
  Badge,
  Tabs,
  Statistic,
  message,
  Tooltip,
  Select,
  DatePicker,
  Input,
  Popconfirm,
  Progress,
} from 'antd'
import {
  AuditOutlined,
  LoginOutlined,
  EyeOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  SettingOutlined,
  SafetyOutlined,
  DesktopOutlined,
  CalendarOutlined,
  ClearOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
const { Text, Title } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

// 日志类型枚举
enum LogType {
  OPERATION = 'OPERATION',
  LOGIN = 'LOGIN',
  ACCESS = 'ACCESS',
  AUDIT = 'AUDIT',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
  SYSTEM = 'SYSTEM',
}

// 日志状态枚举
enum LogStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  WARNING = 'WARNING',
}

// 登录结果枚举
enum LoginResult {
  SUCCESS = 'SUCCESS',
  FAILED_PASSWORD = 'FAILED_PASSWORD',
  FAILED_CAPTCHA = 'FAILED_CAPTCHA',
  FAILED_OTP = 'FAILED_OTP',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

export default function SystemLog() {
  const [logs, setLogs] = useState<any[]>([])
  const [loginLogs, setLoginLogs] = useState<any[]>([])
  const [accessLogs, setAccessLogs] = useState<any[]>([])
  const [auditReports, setAuditReports] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any | null>(null)
  const [stats, setStats] = useState({
    totalLogs: 15,
    operationLogs: 5,
    loginLogs: 3,
    accessLogs: 2,
    errorLogs: 1,
    securityLogs: 1,
    successRate: 93,
    uniqueUsers: 25,
    uniqueIpAddresses: 15,
  })
  const [activeTab, setActiveTab] = useState('operations')

  useEffect(() => {
    fetchLogs()
    fetchLoginLogs()
    fetchAccessLogs()
    fetchAuditReports()
    fetchStats()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    const mockLogs = [
      { id: 'LOG-001', logType: LogType.OPERATION, operationType: 'CREATE', module: 'CRM', action: '创建客户', description: '创建新客户：眉山市交通局', userId: 'U-001', userName: '张三', userRole: '销售经理', ipAddress: '192.168.1.100', requestUrl: '/api/customers', requestMethod: 'POST', resourceId: 'C-001', resourceName: '眉山市交通局', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 09:00') },
      { id: 'LOG-002', logType: LogType.OPERATION, operationType: 'UPDATE', module: 'CRM', action: '更新客户', description: '更新客户信息：眉山市交通局', userId: 'U-001', userName: '张三', userRole: '销售经理', ipAddress: '192.168.1.100', requestUrl: '/api/customers/C-001', requestMethod: 'PUT', resourceId: 'C-001', resourceName: '眉山市交通局', beforeData: '{"status":"潜在"}', afterData: '{"status":"意向"}', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 09:30') },
      { id: 'LOG-003', logType: LogType.OPERATION, operationType: 'DELETE', module: 'CRM', action: '删除线索', description: '删除无效线索', userId: 'U-002', userName: '李四', userRole: '销售主管', ipAddress: '192.168.1.101', requestUrl: '/api/leads/L-001', requestMethod: 'DELETE', resourceId: 'L-001', resourceName: '无效线索', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 10:00') },
      { id: 'LOG-004', logType: LogType.OPERATION, operationType: 'APPROVE', module: 'Workflow', action: '审批通过', description: '审批采购申请单', userId: 'U-003', userName: '王五', userRole: '总经理', ipAddress: '192.168.1.102', requestUrl: '/api/workflow/approve', requestMethod: 'POST', resourceId: 'WF-001', resourceName: '采购申请单', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 10:30') },
      { id: 'LOG-005', logType: LogType.OPERATION, operationType: 'EXPORT', module: 'ERP', action: '导出报表', description: '导出库存报表', userId: 'U-004', userName: '赵六', userRole: '仓库管理员', ipAddress: '192.168.1.103', requestUrl: '/api/inventory/export', requestMethod: 'GET', resourceId: 'RPT-001', resourceName: '库存报表', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 11:00') },
      { id: 'LOG-006', logType: LogType.LOGIN, operationType: 'LOGIN', module: 'Auth', action: '用户登录', description: '用户登录成功', userId: 'U-001', userName: '张三', userRole: '销售经理', ipAddress: '192.168.1.100', userAgent: 'Chrome/120.0', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 08:00') },
      { id: 'LOG-007', logType: LogType.LOGIN, operationType: 'LOGIN', module: 'Auth', action: '用户登录失败', description: '密码错误，登录失败', userId: 'U-005', userName: '钱七', ipAddress: '192.168.1.104', status: LogStatus.FAILED, errorMessage: '密码错误', createdAt: new Date('2026-03-31 08:05') },
      { id: 'LOG-008', logType: LogType.ACCESS, module: 'CMS', action: '访问页面', description: '访问新闻管理页面', userId: 'U-006', userName: '周八', userRole: '内容编辑', ipAddress: '192.168.1.105', requestUrl: '/cms/news', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 09:15') },
      { id: 'LOG-009', logType: LogType.ERROR, module: 'API', action: 'API错误', description: 'API请求失败', userId: 'U-001', userName: '张三', ipAddress: '192.168.1.100', requestUrl: '/api/customers/export', requestMethod: 'GET', responseStatus: 500, errorMessage: '服务器内部错误', status: LogStatus.FAILED, createdAt: new Date('2026-03-31 11:30') },
      { id: 'LOG-010', logType: LogType.SECURITY, module: 'Security', action: '权限验证失败', description: '尝试访问未授权资源', userId: 'U-002', userName: '李四', ipAddress: '192.168.1.101', requestUrl: '/admin/settings', responseStatus: 403, errorMessage: '权限不足', status: LogStatus.WARNING, createdAt: new Date('2026-03-31 12:00') },
      { id: 'LOG-011', logType: LogType.SYSTEM, module: 'System', action: '系统备份', description: '自动备份完成', ipAddress: '127.0.0.1', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 03:00') },
      { id: 'LOG-012', logType: LogType.OPERATION, operationType: 'UPDATE', module: 'Settings', action: '修改系统配置', description: '修改邮件通知配置', userId: 'U-003', userName: '王五', userRole: '系统管理员', ipAddress: '192.168.1.102', requestUrl: '/api/settings/email', requestMethod: 'PUT', beforeData: '{"enabled":false}', afterData: '{"enabled":true}', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 13:00') },
      { id: 'LOG-013', logType: LogType.OPERATION, operationType: 'CHANGE_PASSWORD', module: 'Auth', action: '修改密码', description: '用户修改密码', userId: 'U-001', userName: '张三', ipAddress: '192.168.1.100', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 13:30') },
      { id: 'LOG-014', logType: LogType.LOGIN, operationType: 'LOGOUT', module: 'Auth', action: '用户登出', description: '用户主动登出', userId: 'U-002', userName: '李四', ipAddress: '192.168.1.101', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 14:00') },
      { id: 'LOG-015', logType: LogType.AUDIT, module: 'Audit', action: '审计检查', description: '敏感数据访问审计', userId: 'U-003', userName: '王五', ipAddress: '192.168.1.102', resourceId: 'DATA-001', resourceName: '财务数据', status: LogStatus.SUCCESS, createdAt: new Date('2026-03-31 14:30') },
    ]
    setLogs(mockLogs)
    setLoading(false)
  }

  const fetchLoginLogs = async () => {
    const mockLoginLogs = [
      { id: 'LL-001', userId: 'U-001', userName: '张三', loginType: 'WEB', ipAddress: '192.168.1.100', location: '四川眉山', device: 'Desktop', browser: 'Chrome 120', os: 'Windows 10', result: LoginResult.SUCCESS, sessionId: 'S-001', loginTime: new Date('2026-03-31 08:00'), createdAt: new Date('2026-03-31 08:00') },
      { id: 'LL-002', userName: '钱七', loginType: 'WEB', ipAddress: '192.168.1.104', location: '四川成都', device: 'Desktop', browser: 'Firefox 115', os: 'Windows 11', result: LoginResult.FAILED_PASSWORD, failureReason: '密码错误', createdAt: new Date('2026-03-31 08:05') },
      { id: 'LL-003', userId: 'U-002', userName: '李四', loginType: 'WEB', ipAddress: '192.168.1.101', location: '四川眉山', device: 'Desktop', browser: 'Edge 120', os: 'Windows 10', result: LoginResult.SUCCESS, sessionId: 'S-002', loginTime: new Date('2026-03-31 08:10'), logoutTime: new Date('2026-03-31 14:00'), duration: 5.9, createdAt: new Date('2026-03-31 08:10') },
      { id: 'LL-004', userId: 'U-003', userName: '王五', loginType: 'APP', ipAddress: '192.168.1.102', location: '四川眉山', device: 'Mobile', browser: 'Chrome Mobile', os: 'Android 12', result: LoginResult.SUCCESS, sessionId: 'S-003', loginTime: new Date('2026-03-31 08:15'), createdAt: new Date('2026-03-31 08:15') },
      { id: 'LL-005', userName: 'test_user', loginType: 'WEB', ipAddress: '10.0.0.1', result: LoginResult.ACCOUNT_LOCKED, failureReason: '账户已锁定', createdAt: new Date('2026-03-31 08:20') },
    ]
    setLoginLogs(mockLoginLogs)
  }

  const fetchAccessLogs = async () => {
    const mockAccessLogs = [
      { id: 'AL-001', userId: 'U-001', userName: '张三', resourceType: 'PAGE', resourcePath: '/crm/customers', resourceName: '客户管理页面', action: 'VIEW', ipAddress: '192.168.1.100', accessTime: new Date('2026-03-31 09:00'), duration: 300, createdAt: new Date('2026-03-31 09:00') },
      { id: 'AL-002', userId: 'U-004', userName: '赵六', resourceType: 'FILE', resourcePath: '/files/report.xlsx', resourceName: '库存报表.xlsx', action: 'DOWNLOAD', ipAddress: '192.168.1.103', accessTime: new Date('2026-03-31 11:00'), dataSize: 1024, createdAt: new Date('2026-03-31 11:00') },
      { id: 'AL-003', userId: 'U-006', userName: '周八', resourceType: 'PAGE', resourcePath: '/cms/news', resourceName: '新闻管理页面', action: 'EDIT', ipAddress: '192.168.1.105', accessTime: new Date('2026-03-31 09:15'), duration: 600, createdAt: new Date('2026-03-31 09:15') },
    ]
    setAccessLogs(mockAccessLogs)
  }

  const fetchAuditReports = async () => {
    const mockReports = [
      { id: 'AR-001', reportType: 'DAILY', startDate: new Date('2026-03-30'), endDate: new Date('2026-03-31'), totalLogs: 150, operationLogs: 80, loginLogs: 30, accessLogs: 20, errorLogs: 5, securityLogs: 3, uniqueUsers: 25, uniqueIpAddresses: 15, errorRate: 3.3, avgResponseTime: 150, peakHour: 10, generatedAt: new Date('2026-03-31 06:00') },
      { id: 'AR-002', reportType: 'WEEKLY', startDate: new Date('2026-03-24'), endDate: new Date('2026-03-31'), totalLogs: 850, operationLogs: 450, loginLogs: 150, accessLogs: 100, errorLogs: 25, securityLogs: 15, uniqueUsers: 35, uniqueIpAddresses: 20, errorRate: 2.9, avgResponseTime: 145, peakHour: 9, generatedAt: new Date('2026-03-31 07:00') },
    ]
    setAuditReports(mockReports)
  }

  const fetchStats = async () => {
    setStats({ totalLogs: 15, operationLogs: 5, loginLogs: 3, accessLogs: 2, errorLogs: 1, securityLogs: 1, successRate: 93, uniqueUsers: 25, uniqueIpAddresses: 15 })
  }

  const getStatusTag = (status: LogStatus) => {
    const config: Record<LogStatus, { color: string; icon: any; text: string }> = {
      SUCCESS: { color: 'success', icon: <CheckCircleOutlined />, text: '成功' },
      FAILED: { color: 'error', icon: <CloseCircleOutlined />, text: '失败' },
      PENDING: { color: 'default', icon: <ClockCircleOutlined />, text: '待处理' },
      WARNING: { color: 'warning', icon: <WarningOutlined />, text: '警告' },
    }
    const c = config[status]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getLogTypeTag = (type: LogType) => {
    const config: Record<LogType, { color: string; icon: any; text: string }> = {
      OPERATION: { color: 'blue', icon: <SettingOutlined />, text: '操作' },
      LOGIN: { color: 'green', icon: <LoginOutlined />, text: '登录' },
      ACCESS: { color: 'purple', icon: <EyeOutlined />, text: '访问' },
      AUDIT: { color: 'cyan', icon: <AuditOutlined />, text: '审计' },
      ERROR: { color: 'error', icon: <ExclamationCircleOutlined />, text: '错误' },
      SECURITY: { color: 'magenta', icon: <SafetyOutlined />, text: '安全' },
      SYSTEM: { color: 'gold', icon: <DesktopOutlined />, text: '系统' },
    }
    const c = config[type]
    return <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
  }

  const getLoginResultTag = (result: LoginResult) => {
    const config: Record<LoginResult, { color: string; text: string }> = {
      SUCCESS: { color: 'success', text: '成功' },
      FAILED_PASSWORD: { color: 'error', text: '密码错误' },
      FAILED_CAPTCHA: { color: 'warning', text: '验证码错误' },
      FAILED_OTP: { color: 'warning', text: 'OTP错误' },
      ACCOUNT_LOCKED: { color: 'error', text: '账户锁定' },
      ACCOUNT_DISABLED: { color: 'error', text: '账户禁用' },
      SESSION_EXPIRED: { color: 'default', text: '会话过期' },
    }
    const c = config[result]
    return <Tag color={c.color}>{c.text}</Tag>
  }

  const logColumns: ColumnsType<any> = [
    { title: '日志ID', dataIndex: 'id', width: 80 },
    { title: '类型', dataIndex: 'logType', width: 80, render: (type: LogType) => getLogTypeTag(type) },
    { title: '模块', dataIndex: 'module', width: 80 },
    { title: '操作', dataIndex: 'action', width: 100 },
    { title: '描述', dataIndex: 'description', width: 150, ellipsis: true },
    { title: '用户', dataIndex: 'userName', width: 80 },
    { title: '角色', dataIndex: 'userRole', width: 80 },
    { title: 'IP地址', dataIndex: 'ipAddress', width: 100 },
    { title: '状态', dataIndex: 'status', width: 80, render: (status: LogStatus) => getStatusTag(status) },
    { title: '时间', dataIndex: 'createdAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '操作', key: 'action', width: 80, render: (_, record) => (
      <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setSelectedLog(record); setDetailModalVisible(true) }}>详情</Button>
    )},
  ]

  const loginLogColumns: ColumnsType<any> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户', dataIndex: 'userName', width: 100 },
    { title: '类型', dataIndex: 'loginType', width: 80, render: (type: string) => <Tag color={type === 'WEB' ? 'blue' : type === 'APP' ? 'green' : 'purple'}>{type}</Tag> },
    { title: 'IP地址', dataIndex: 'ipAddress', width: 120 },
    { title: '位置', dataIndex: 'location', width: 100 },
    { title: '设备', dataIndex: 'device', width: 80 },
    { title: '浏览器', dataIndex: 'browser', width: 100 },
    { title: '结果', dataIndex: 'result', width: 100, render: (result: LoginResult) => getLoginResultTag(result) },
    { title: '登录时间', dataIndex: 'loginTime', width: 100, render: (time: Date) => time ? dayjs(time).format('MM-DD HH:mm') : '-' },
    { title: '时长', dataIndex: 'duration', width: 60, render: (d: number) => d ? `${d}h` : '-' },
  ]

  const accessLogColumns: ColumnsType<any> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '用户', dataIndex: 'userName', width: 100 },
    { title: '资源类型', dataIndex: 'resourceType', width: 80, render: (type: string) => <Tag color={type === 'PAGE' ? 'blue' : type === 'FILE' ? 'orange' : 'green'}>{type}</Tag> },
    { title: '资源路径', dataIndex: 'resourcePath', width: 150, ellipsis: true },
    { title: '资源名称', dataIndex: 'resourceName', width: 120 },
    { title: '动作', dataIndex: 'action', width: 80, render: (action: string) => <Tag color={action === 'VIEW' ? 'cyan' : action === 'DOWNLOAD' ? 'purple' : 'blue'}>{action}</Tag> },
    { title: 'IP地址', dataIndex: 'ipAddress', width: 120 },
    { title: '访问时间', dataIndex: 'accessTime', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
    { title: '时长', dataIndex: 'duration', width: 60, render: (d: number) => d ? `${d}s` : '-' },
  ]

  const reportColumns: ColumnsType<any> = [
    { title: '报表ID', dataIndex: 'id', width: 80 },
    { title: '类型', dataIndex: 'reportType', width: 100, render: (type: string) => <Tag color={type === 'DAILY' ? 'blue' : type === 'WEEKLY' ? 'green' : 'purple'}>{type}</Tag> },
    { title: '统计周期', width: 150, render: (_, record) => `${dayjs(record.startDate).format('MM-DD')} ~ ${dayjs(record.endDate).format('MM-DD')}` },
    { title: '总日志数', dataIndex: 'totalLogs', width: 80 },
    { title: '用户数', dataIndex: 'uniqueUsers', width: 80 },
    { title: 'IP数', dataIndex: 'uniqueIpAddresses', width: 80 },
    { title: '错误率', dataIndex: 'errorRate', width: 80, render: (rate: number) => `${rate}%` },
    { title: '响应时间', dataIndex: 'avgResponseTime', width: 80, render: (time: number) => `${time}ms` },
    { title: '高峰时段', dataIndex: 'peakHour', width: 80, render: (hour: number) => `${hour}:00` },
    { title: '生成时间', dataIndex: 'generatedAt', width: 100, render: (time: Date) => dayjs(time).format('MM-DD HH:mm') },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <Title level={4} className="page-header-title">
            <AuditOutlined style={{ marginRight: 8 }} />
            系统日志审计
          </Title>
          <Text type="secondary">操作日志、登录日志、访问日志、审计报表</Text>
        </div>
        <div className="page-header-actions">
          <Button icon={<CalendarOutlined />} style={{ marginRight: 8 }}>生成报表</Button>
          <Button icon={<ClearOutlined />} style={{ marginRight: 8 }}>清理日志</Button>
          <Button icon={<ExportOutlined />}>导出日志</Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">总日志</Text>} value={stats.totalLogs} prefix={<AuditOutlined style={{ color: '#1890ff' }} />} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">操作日志</Text>} value={stats.operationLogs} prefix={<SettingOutlined style={{ color: '#722ed1' }} />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">登录日志</Text>} value={stats.loginLogs} prefix={<LoginOutlined style={{ color: '#52c41a' }} />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">访问日志</Text>} value={stats.accessLogs} prefix={<EyeOutlined style={{ color: '#13c2c2' }} />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">错误日志</Text>} value={stats.errorLogs} prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card className="daoda-card stat-card">
            <Statistic title={<Text type="secondary">成功率</Text>} value={stats.successRate} suffix="%" prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      {/* 日志列表 */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="操作日志" key="operations">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="日志类型" style={{ width: 120 }} allowClear>
                <Option value="OPERATION">操作日志</Option>
                <Option value="LOGIN">登录日志</Option>
                <Option value="ERROR">错误日志</Option>
                <Option value="SECURITY">安全日志</Option>
              </Select>
              <Select placeholder="模块" style={{ width: 120 }} allowClear>
                <Option value="CRM">CRM</Option>
                <Option value="ERP">ERP</Option>
                <Option value="Workflow">Workflow</Option>
                <Option value="Settings">Settings</Option>
              </Select>
              <Select placeholder="状态" style={{ width: 120 }} allowClear>
                <Option value="SUCCESS">成功</Option>
                <Option value="FAILED">失败</Option>
                <Option value="WARNING">警告</Option>
              </Select>
              <RangePicker />
              <Input.Search placeholder="搜索用户" style={{ width: 200 }} allowClear />
            </Space>
            <Table columns={logColumns} dataSource={logs} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
          </Card>
        </TabPane>
        <TabPane tab="登录日志" key="login">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="登录结果" style={{ width: 120 }} allowClear>
                <Option value="SUCCESS">成功</Option>
                <Option value="FAILED_PASSWORD">密码错误</Option>
                <Option value="ACCOUNT_LOCKED">账户锁定</Option>
              </Select>
              <Select placeholder="登录类型" style={{ width: 120 }} allowClear>
                <Option value="WEB">Web</Option>
                <Option value="APP">App</Option>
                <Option value="API">API</Option>
              </Select>
              <RangePicker />
            </Space>
            <Table columns={loginLogColumns} dataSource={loginLogs} rowKey="id" pagination={{ pageSize: 20 }} />
          </Card>
        </TabPane>
        <TabPane tab="访问日志" key="access">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="资源类型" style={{ width: 120 }} allowClear>
                <Option value="PAGE">页面</Option>
                <Option value="FILE">文件</Option>
                <Option value="API">API</Option>
              </Select>
              <Select placeholder="动作" style={{ width: 120 }} allowClear>
                <Option value="VIEW">查看</Option>
                <Option value="DOWNLOAD">下载</Option>
                <Option value="EDIT">编辑</Option>
              </Select>
              <RangePicker />
            </Space>
            <Table columns={accessLogColumns} dataSource={accessLogs} rowKey="id" pagination={{ pageSize: 20 }} />
          </Card>
        </TabPane>
        <TabPane tab="审计报表" key="reports">
          <Card className="daoda-card">
            <Space style={{ marginBottom: 16 }}>
              <Select placeholder="报表类型" style={{ width: 120 }} allowClear>
                <Option value="DAILY">日报</Option>
                <Option value="WEEKLY">周报</Option>
                <Option value="MONTHLY">月报</Option>
              </Select>
              <RangePicker />
              <Button icon={<CalendarOutlined />}>生成报表</Button>
            </Space>
            <Table columns={reportColumns} dataSource={auditReports} rowKey="id" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
      </Tabs>

      {/* 日志详情弹窗 */}
      <Modal title="日志详情" open={detailModalVisible} onCancel={() => setDetailModalVisible(false)} footer={null} width={700}>
        {selectedLog && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="日志ID">{selectedLog.id}</Descriptions.Item>
            <Descriptions.Item label="类型">{getLogTypeTag(selectedLog.logType)}</Descriptions.Item>
            <Descriptions.Item label="模块">{selectedLog.module}</Descriptions.Item>
            <Descriptions.Item label="操作">{selectedLog.action}</Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>{selectedLog.description}</Descriptions.Item>
            <Descriptions.Item label="用户">{selectedLog.userName || '-'}</Descriptions.Item>
            <Descriptions.Item label="角色">{selectedLog.userRole || '-'}</Descriptions.Item>
            <Descriptions.Item label="IP地址">{selectedLog.ipAddress}</Descriptions.Item>
            <Descriptions.Item label="请求URL">{selectedLog.requestUrl || '-'}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{selectedLog.requestMethod || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(selectedLog.status)}</Descriptions.Item>
            <Descriptions.Item label="时间">{dayjs(selectedLog.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
            {selectedLog.resourceId && <Descriptions.Item label="资源ID">{selectedLog.resourceId}</Descriptions.Item>}
            {selectedLog.resourceName && <Descriptions.Item label="资源名称">{selectedLog.resourceName}</Descriptions.Item>}
            {selectedLog.responseStatus && <Descriptions.Item label="响应状态">{selectedLog.responseStatus}</Descriptions.Item>}
            {selectedLog.errorMessage && <Descriptions.Item label="错误信息" span={2}><Text type="danger">{selectedLog.errorMessage}</Text></Descriptions.Item>}
            {selectedLog.beforeData && selectedLog.afterData && (
              <Descriptions.Item label="数据变更" span={2}>
                <div><Text type="secondary">变更前:</Text> <Text code>{selectedLog.beforeData}</Text></div>
                <div><Text type="secondary">变更后:</Text> <Text code>{selectedLog.afterData}</Text></div>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}