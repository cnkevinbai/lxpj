/**
 * 系统日志审计服务
 * 操作日志、登录日志、访问日志、审计报表
 */
import { Injectable } from '@nestjs/common'

// 日志类型枚举
export enum LogType {
  OPERATION = 'OPERATION', // 操作日志
  LOGIN = 'LOGIN', // 登录日志
  ACCESS = 'ACCESS', // 访问日志
  AUDIT = 'AUDIT', // 审计日志
  ERROR = 'ERROR', // 错误日志
  SECURITY = 'SECURITY', // 安全日志
  SYSTEM = 'SYSTEM', // 系统日志
}

// 操作类型枚举
export enum OperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  SUBMIT = 'SUBMIT',
  CANCEL = 'CANCEL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SWITCH_ROLE = 'SWITCH_ROLE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

// 日志状态枚举
export enum LogStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  WARNING = 'WARNING',
}

// 登录结果枚举
export enum LoginResult {
  SUCCESS = 'SUCCESS',
  FAILED_PASSWORD = 'FAILED_PASSWORD',
  FAILED_CAPTCHA = 'FAILED_CAPTCHA',
  FAILED_OTP = 'FAILED_OTP',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
}

// 访问资源类型枚举
export enum AccessResourceType {
  PAGE = 'PAGE',
  API = 'API',
  FILE = 'FILE',
  REPORT = 'REPORT',
  DOCUMENT = 'DOCUMENT',
}

// 系统日志接口
export interface SystemLog {
  id: string
  logType: LogType
  operationType?: OperationType
  module: string
  action: string
  description: string
  userId?: string
  userName?: string
  userRole?: string
  ipAddress: string
  userAgent?: string
  requestUrl?: string
  requestMethod?: string
  requestBody?: string
  responseStatus?: number
  responseTime?: number
  resourceId?: string
  resourceName?: string
  beforeData?: string
  afterData?: string
  status: LogStatus
  errorMessage?: string
  createdAt: Date
}

// 登录日志接口
export interface LoginLog {
  id: string
  userId?: string
  userName: string
  loginType: 'WEB' | 'APP' | 'API' | 'MOBILE'
  ipAddress: string
  location?: string
  device?: string
  browser?: string
  os?: string
  result: LoginResult
  failureReason?: string
  sessionId?: string
  loginTime?: Date
  logoutTime?: Date
  duration?: number
  createdAt: Date
}

// 访问日志接口
export interface AccessLog {
  id: string
  userId: string
  userName: string
  resourceType: AccessResourceType
  resourcePath: string
  resourceName: string
  action: 'VIEW' | 'DOWNLOAD' | 'PRINT' | 'SHARE' | 'EDIT'
  ipAddress: string
  accessTime: Date
  duration?: number
  dataSize?: number
  createdAt: Date
}

// 审计报表接口
export interface AuditReport {
  id: string
  reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
  startDate: Date
  endDate: Date
  totalLogs: number
  operationLogs: number
  loginLogs: number
  accessLogs: number
  errorLogs: number
  securityLogs: number
  uniqueUsers: number
  uniqueIpAddresses: number
  topModules: Array<{ module: string; count: number }>
  topUsers: Array<{ userId: string; userName: string; count: number }>
  topActions: Array<{ action: string; count: number }>
  errorRate: number
  avgResponseTime: number
  peakHour: number
  generatedAt: Date
}

@Injectable()
export class SystemLogService {
  private logs: Map<string, SystemLog> = new Map()
  private loginLogs: Map<string, LoginLog> = new Map()
  private accessLogs: Map<string, AccessLog> = new Map()
  private auditReports: Map<string, AuditReport> = new Map()

  constructor() {
    this.initMockData()
  }

  private initMockData() {
    // 初始化系统日志
    const mockLogs: SystemLog[] = [
      {
        id: 'LOG-001',
        logType: LogType.OPERATION,
        operationType: OperationType.CREATE,
        module: 'CRM',
        action: '创建客户',
        description: '创建新客户：眉山市交通局',
        userId: 'U-001',
        userName: '张三',
        userRole: '销售经理',
        ipAddress: '192.168.1.100',
        requestUrl: '/api/customers',
        requestMethod: 'POST',
        resourceId: 'C-001',
        resourceName: '眉山市交通局',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 09:00'),
      },
      {
        id: 'LOG-002',
        logType: LogType.OPERATION,
        operationType: OperationType.UPDATE,
        module: 'CRM',
        action: '更新客户',
        description: '更新客户信息：眉山市交通局',
        userId: 'U-001',
        userName: '张三',
        userRole: '销售经理',
        ipAddress: '192.168.1.100',
        requestUrl: '/api/customers/C-001',
        requestMethod: 'PUT',
        resourceId: 'C-001',
        resourceName: '眉山市交通局',
        beforeData: '{"status":"潜在"}',
        afterData: '{"status":"意向"}',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 09:30'),
      },
      {
        id: 'LOG-003',
        logType: LogType.OPERATION,
        operationType: OperationType.DELETE,
        module: 'CRM',
        action: '删除线索',
        description: '删除无效线索',
        userId: 'U-002',
        userName: '李四',
        userRole: '销售主管',
        ipAddress: '192.168.1.101',
        requestUrl: '/api/leads/L-001',
        requestMethod: 'DELETE',
        resourceId: 'L-001',
        resourceName: '无效线索',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 10:00'),
      },
      {
        id: 'LOG-004',
        logType: LogType.OPERATION,
        operationType: OperationType.APPROVE,
        module: 'Workflow',
        action: '审批通过',
        description: '审批采购申请单',
        userId: 'U-003',
        userName: '王五',
        userRole: '总经理',
        ipAddress: '192.168.1.102',
        requestUrl: '/api/workflow/approve',
        requestMethod: 'POST',
        resourceId: 'WF-001',
        resourceName: '采购申请单',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 10:30'),
      },
      {
        id: 'LOG-005',
        logType: LogType.OPERATION,
        operationType: OperationType.EXPORT,
        module: 'ERP',
        action: '导出报表',
        description: '导出库存报表',
        userId: 'U-004',
        userName: '赵六',
        userRole: '仓库管理员',
        ipAddress: '192.168.1.103',
        requestUrl: '/api/inventory/export',
        requestMethod: 'GET',
        resourceId: 'RPT-001',
        resourceName: '库存报表',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 11:00'),
      },
      {
        id: 'LOG-006',
        logType: LogType.LOGIN,
        operationType: OperationType.LOGIN,
        module: 'Auth',
        action: '用户登录',
        description: '用户登录成功',
        userId: 'U-001',
        userName: '张三',
        userRole: '销售经理',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome/120.0',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 08:00'),
      },
      {
        id: 'LOG-007',
        logType: LogType.LOGIN,
        operationType: OperationType.LOGIN,
        module: 'Auth',
        action: '用户登录失败',
        description: '密码错误，登录失败',
        userId: 'U-005',
        userName: '钱七',
        ipAddress: '192.168.1.104',
        status: LogStatus.FAILED,
        errorMessage: '密码错误',
        createdAt: new Date('2026-03-31 08:05'),
      },
      {
        id: 'LOG-008',
        logType: LogType.ACCESS,
        module: 'CMS',
        action: '访问页面',
        description: '访问新闻管理页面',
        userId: 'U-006',
        userName: '周八',
        userRole: '内容编辑',
        ipAddress: '192.168.1.105',
        requestUrl: '/cms/news',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 09:15'),
      },
      {
        id: 'LOG-009',
        logType: LogType.ERROR,
        module: 'API',
        action: 'API错误',
        description: 'API请求失败',
        userId: 'U-001',
        userName: '张三',
        ipAddress: '192.168.1.100',
        requestUrl: '/api/customers/export',
        requestMethod: 'GET',
        responseStatus: 500,
        errorMessage: '服务器内部错误',
        status: LogStatus.FAILED,
        createdAt: new Date('2026-03-31 11:30'),
      },
      {
        id: 'LOG-010',
        logType: LogType.SECURITY,
        module: 'Security',
        action: '权限验证失败',
        description: '尝试访问未授权资源',
        userId: 'U-002',
        userName: '李四',
        ipAddress: '192.168.1.101',
        requestUrl: '/admin/settings',
        responseStatus: 403,
        errorMessage: '权限不足',
        status: LogStatus.WARNING,
        createdAt: new Date('2026-03-31 12:00'),
      },
      {
        id: 'LOG-011',
        logType: LogType.SYSTEM,
        module: 'System',
        action: '系统备份',
        description: '自动备份完成',
        ipAddress: '127.0.0.1',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 03:00'),
      },
      {
        id: 'LOG-012',
        logType: LogType.OPERATION,
        operationType: OperationType.UPDATE,
        module: 'Settings',
        action: '修改系统配置',
        description: '修改邮件通知配置',
        userId: 'U-003',
        userName: '王五',
        userRole: '系统管理员',
        ipAddress: '192.168.1.102',
        requestUrl: '/api/settings/email',
        requestMethod: 'PUT',
        beforeData: '{"enabled":false}',
        afterData: '{"enabled":true}',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 13:00'),
      },
      {
        id: 'LOG-013',
        logType: LogType.OPERATION,
        operationType: OperationType.CHANGE_PASSWORD,
        module: 'Auth',
        action: '修改密码',
        description: '用户修改密码',
        userId: 'U-001',
        userName: '张三',
        ipAddress: '192.168.1.100',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 13:30'),
      },
      {
        id: 'LOG-014',
        logType: LogType.LOGIN,
        operationType: OperationType.LOGOUT,
        module: 'Auth',
        action: '用户登出',
        description: '用户主动登出',
        userId: 'U-002',
        userName: '李四',
        ipAddress: '192.168.1.101',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 14:00'),
      },
      {
        id: 'LOG-015',
        logType: LogType.AUDIT,
        module: 'Audit',
        action: '审计检查',
        description: '敏感数据访问审计',
        userId: 'U-003',
        userName: '王五',
        ipAddress: '192.168.1.102',
        resourceId: 'DATA-001',
        resourceName: '财务数据',
        status: LogStatus.SUCCESS,
        createdAt: new Date('2026-03-31 14:30'),
      },
    ]
    mockLogs.forEach((log) => this.logs.set(log.id, log))

    // 初始化登录日志
    const mockLoginLogs: LoginLog[] = [
      {
        id: 'LL-001',
        userId: 'U-001',
        userName: '张三',
        loginType: 'WEB',
        ipAddress: '192.168.1.100',
        location: '四川眉山',
        device: 'Desktop',
        browser: 'Chrome 120',
        os: 'Windows 10',
        result: LoginResult.SUCCESS,
        sessionId: 'S-001',
        loginTime: new Date('2026-03-31 08:00'),
        createdAt: new Date('2026-03-31 08:00'),
      },
      {
        id: 'LL-002',
        userName: '钱七',
        loginType: 'WEB',
        ipAddress: '192.168.1.104',
        location: '四川成都',
        device: 'Desktop',
        browser: 'Firefox 115',
        os: 'Windows 11',
        result: LoginResult.FAILED_PASSWORD,
        failureReason: '密码错误',
        createdAt: new Date('2026-03-31 08:05'),
      },
      {
        id: 'LL-003',
        userId: 'U-002',
        userName: '李四',
        loginType: 'WEB',
        ipAddress: '192.168.1.101',
        location: '四川眉山',
        device: 'Desktop',
        browser: 'Edge 120',
        os: 'Windows 10',
        result: LoginResult.SUCCESS,
        sessionId: 'S-002',
        loginTime: new Date('2026-03-31 08:10'),
        logoutTime: new Date('2026-03-31 14:00'),
        duration: 5.9,
        createdAt: new Date('2026-03-31 08:10'),
      },
      {
        id: 'LL-004',
        userId: 'U-003',
        userName: '王五',
        loginType: 'APP',
        ipAddress: '192.168.1.102',
        location: '四川眉山',
        device: 'Mobile',
        browser: 'Chrome Mobile',
        os: 'Android 12',
        result: LoginResult.SUCCESS,
        sessionId: 'S-003',
        loginTime: new Date('2026-03-31 08:15'),
        createdAt: new Date('2026-03-31 08:15'),
      },
      {
        id: 'LL-005',
        userName: 'test_user',
        loginType: 'WEB',
        ipAddress: '10.0.0.1',
        result: LoginResult.ACCOUNT_LOCKED,
        failureReason: '账户已锁定',
        createdAt: new Date('2026-03-31 08:20'),
      },
      {
        id: 'LL-006',
        userId: 'U-004',
        userName: '赵六',
        loginType: 'WEB',
        ipAddress: '192.168.1.103',
        location: '四川眉山',
        device: 'Desktop',
        browser: 'Chrome 120',
        os: 'macOS 14',
        result: LoginResult.SUCCESS,
        sessionId: 'S-004',
        loginTime: new Date('2026-03-31 08:30'),
        createdAt: new Date('2026-03-31 08:30'),
      },
      {
        id: 'LL-007',
        userId: 'U-006',
        userName: '周八',
        loginType: 'MOBILE',
        ipAddress: '192.168.1.105',
        location: '四川成都',
        device: 'iPhone',
        browser: 'Safari',
        os: 'iOS 17',
        result: LoginResult.SUCCESS,
        sessionId: 'S-005',
        loginTime: new Date('2026-03-31 09:00'),
        createdAt: new Date('2026-03-31 09:00'),
      },
      {
        id: 'LL-008',
        userName: 'admin_test',
        loginType: 'API',
        ipAddress: '127.0.0.1',
        result: LoginResult.FAILED_CAPTCHA,
        failureReason: '验证码错误',
        createdAt: new Date('2026-03-31 09:30'),
      },
    ]
    mockLoginLogs.forEach((log) => this.loginLogs.set(log.id, log))

    // 初始化访问日志
    const mockAccessLogs: AccessLog[] = [
      {
        id: 'AL-001',
        userId: 'U-001',
        userName: '张三',
        resourceType: AccessResourceType.PAGE,
        resourcePath: '/crm/customers',
        resourceName: '客户管理页面',
        action: 'VIEW',
        ipAddress: '192.168.1.100',
        accessTime: new Date('2026-03-31 09:00'),
        duration: 300,
        createdAt: new Date('2026-03-31 09:00'),
      },
      {
        id: 'AL-002',
        userId: 'U-004',
        userName: '赵六',
        resourceType: AccessResourceType.FILE,
        resourcePath: '/files/report.xlsx',
        resourceName: '库存报表.xlsx',
        action: 'DOWNLOAD',
        ipAddress: '192.168.1.103',
        accessTime: new Date('2026-03-31 11:00'),
        dataSize: 1024,
        createdAt: new Date('2026-03-31 11:00'),
      },
      {
        id: 'AL-003',
        userId: 'U-006',
        userName: '周八',
        resourceType: AccessResourceType.PAGE,
        resourcePath: '/cms/news',
        resourceName: '新闻管理页面',
        action: 'EDIT',
        ipAddress: '192.168.1.105',
        accessTime: new Date('2026-03-31 09:15'),
        duration: 600,
        createdAt: new Date('2026-03-31 09:15'),
      },
      {
        id: 'AL-004',
        userId: 'U-003',
        userName: '王五',
        resourceType: AccessResourceType.REPORT,
        resourcePath: '/reports/finance.pdf',
        resourceName: '财务月报.pdf',
        action: 'VIEW',
        ipAddress: '192.168.1.102',
        accessTime: new Date('2026-03-31 10:30'),
        dataSize: 2048,
        createdAt: new Date('2026-03-31 10:30'),
      },
      {
        id: 'AL-005',
        userId: 'U-002',
        userName: '李四',
        resourceType: AccessResourceType.API,
        resourcePath: '/api/leads',
        resourceName: '线索API',
        action: 'VIEW',
        ipAddress: '192.168.1.101',
        accessTime: new Date('2026-03-31 10:00'),
        createdAt: new Date('2026-03-31 10:00'),
      },
      {
        id: 'AL-006',
        userId: 'U-003',
        userName: '王五',
        resourceType: AccessResourceType.DOCUMENT,
        resourcePath: '/docs/contract.docx',
        resourceName: '合同文档.docx',
        action: 'DOWNLOAD',
        ipAddress: '192.168.1.102',
        accessTime: new Date('2026-03-31 14:30'),
        dataSize: 512,
        createdAt: new Date('2026-03-31 14:30'),
      },
    ]
    mockAccessLogs.forEach((log) => this.accessLogs.set(log.id, log))

    // 初始化审计报表
    const mockReports: AuditReport[] = [
      {
        id: 'AR-001',
        reportType: 'DAILY',
        startDate: new Date('2026-03-30'),
        endDate: new Date('2026-03-31'),
        totalLogs: 150,
        operationLogs: 80,
        loginLogs: 30,
        accessLogs: 20,
        errorLogs: 5,
        securityLogs: 3,
        uniqueUsers: 25,
        uniqueIpAddresses: 15,
        topModules: [
          { module: 'CRM', count: 40 },
          { module: 'ERP', count: 30 },
          { module: 'Workflow', count: 20 },
        ],
        topUsers: [
          { userId: 'U-001', userName: '张三', count: 25 },
          { userId: 'U-002', userName: '李四', count: 20 },
        ],
        topActions: [
          { action: 'VIEW', count: 60 },
          { action: 'CREATE', count: 30 },
        ],
        errorRate: 3.3,
        avgResponseTime: 150,
        peakHour: 10,
        generatedAt: new Date('2026-03-31 06:00'),
      },
      {
        id: 'AR-002',
        reportType: 'WEEKLY',
        startDate: new Date('2026-03-24'),
        endDate: new Date('2026-03-31'),
        totalLogs: 850,
        operationLogs: 450,
        loginLogs: 150,
        accessLogs: 100,
        errorLogs: 25,
        securityLogs: 15,
        uniqueUsers: 35,
        uniqueIpAddresses: 20,
        topModules: [
          { module: 'CRM', count: 200 },
          { module: 'ERP', count: 150 },
        ],
        topUsers: [{ userId: 'U-001', userName: '张三', count: 120 }],
        topActions: [{ action: 'VIEW', count: 300 }],
        errorRate: 2.9,
        avgResponseTime: 145,
        peakHour: 9,
        generatedAt: new Date('2026-03-31 07:00'),
      },
    ]
    mockReports.forEach((report) => this.auditReports.set(report.id, report))
  }

  // 获取系统日志列表
  async getLogs(params: {
    logType?: LogType
    module?: string
    userId?: string
    userName?: string
    startDate?: Date
    endDate?: Date
    status?: LogStatus
    page?: number
    pageSize?: number
  }) {
    let logs = Array.from(this.logs.values())

    // 筛选
    if (params.logType) logs = logs.filter((l) => l.logType === params.logType)
    if (params.module) logs = logs.filter((l) => l.module === params.module)
    if (params.userId) logs = logs.filter((l) => l.userId === params.userId)
    if (params.userName) logs = logs.filter((l) => l.userName?.includes(params.userName!))
    if (params.status) logs = logs.filter((l) => l.status === params.status)
    if (params.startDate) logs = logs.filter((l) => l.createdAt >= params.startDate!)
    if (params.endDate) logs = logs.filter((l) => l.createdAt <= params.endDate!)

    // 按时间倒序
    logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // 分页
    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const total = logs.length
    const list = logs.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  // 获取日志详情
  async getLogDetail(id: string) {
    return this.logs.get(id)
  }

  // 获取登录日志列表
  async getLoginLogs(params: {
    userId?: string
    userName?: string
    result?: LoginResult
    loginType?: string
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    let logs = Array.from(this.loginLogs.values())

    if (params.userId) logs = logs.filter((l) => l.userId === params.userId)
    if (params.userName) logs = logs.filter((l) => l.userName.includes(params.userName!))
    if (params.result) logs = logs.filter((l) => l.result === params.result)
    if (params.loginType) logs = logs.filter((l) => l.loginType === params.loginType)
    if (params.startDate) logs = logs.filter((l) => l.createdAt >= params.startDate!)
    if (params.endDate) logs = logs.filter((l) => l.createdAt <= params.endDate!)

    logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const total = logs.length
    const list = logs.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  // 获取访问日志列表
  async getAccessLogs(params: {
    userId?: string
    userName?: string
    resourceType?: AccessResourceType
    action?: string
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    let logs = Array.from(this.accessLogs.values())

    if (params.userId) logs = logs.filter((l) => l.userId === params.userId)
    if (params.userName) logs = logs.filter((l) => l.userName.includes(params.userName!))
    if (params.resourceType) logs = logs.filter((l) => l.resourceType === params.resourceType)
    if (params.action) logs = logs.filter((l) => l.action === params.action)
    if (params.startDate) logs = logs.filter((l) => l.createdAt >= params.startDate!)
    if (params.endDate) logs = logs.filter((l) => l.createdAt <= params.endDate!)

    logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const total = logs.length
    const list = logs.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  // 获取审计报表
  async getAuditReports(params: { reportType?: string; startDate?: Date; endDate?: Date }) {
    let reports = Array.from(this.auditReports.values())

    if (params.reportType) reports = reports.filter((r) => r.reportType === params.reportType)
    if (params.startDate) reports = reports.filter((r) => r.startDate >= params.startDate!)
    if (params.endDate) reports = reports.filter((r) => r.endDate <= params.endDate!)

    reports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())

    return reports
  }

  // 生成审计报表
  async generateAuditReport(params: {
    reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM'
    startDate: Date
    endDate: Date
  }) {
    const logs = Array.from(this.logs.values()).filter(
      (l) => l.createdAt >= params.startDate && l.createdAt <= params.endDate,
    )

    const reportId = `AR-${String(this.auditReports.size + 1).padStart(3, '0')}`

    // 计算统计数据
    const operationLogs = logs.filter((l) => l.logType === LogType.OPERATION).length
    const loginLogs = logs.filter((l) => l.logType === LogType.LOGIN).length
    const accessLogs = logs.filter((l) => l.logType === LogType.ACCESS).length
    const errorLogs = logs.filter((l) => l.logType === LogType.ERROR).length
    const securityLogs = logs.filter((l) => l.logType === LogType.SECURITY).length

    const uniqueUsers = new Set(logs.filter((l) => l.userId).map((l) => l.userId)).size
    const uniqueIpAddresses = new Set(logs.map((l) => l.ipAddress)).size

    // 模块统计
    const moduleCount: Record<string, number> = {}
    logs.forEach((l) => {
      moduleCount[l.module] = (moduleCount[l.module] || 0) + 1
    })
    const topModules = Object.entries(moduleCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([module, count]) => ({ module, count }))

    // 用户统计
    const userCount: Record<string, { userId: string; userName: string; count: number }> = {}
    logs
      .filter((l) => l.userId)
      .forEach((l) => {
        const uid = l.userId as string
        if (!userCount[uid]) userCount[uid] = { userId: uid, userName: l.userName || '', count: 0 }
        userCount[uid].count++
      })
    const topUsers = Object.values(userCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // 操作统计
    const actionCount: Record<string, number> = {}
    logs.forEach((l) => {
      actionCount[l.action] = (actionCount[l.action] || 0) + 1
    })
    const topActions = Object.entries(actionCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }))

    // 错误率
    const errorRate = logs.length > 0 ? (errorLogs / logs.length) * 100 : 0

    // 平均响应时间
    const responseTimes = logs.filter((l) => l.responseTime).map((l) => l.responseTime as number)
    const avgResponseTime =
      responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0

    // 高峰时段
    const hourCount: Record<number, number> = {}
    logs.forEach((l) => {
      const hour = l.createdAt.getHours()
      hourCount[hour] = (hourCount[hour] || 0) + 1
    })
    const peakHour = Object.entries(hourCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 9

    const report: AuditReport = {
      id: reportId,
      reportType: params.reportType,
      startDate: params.startDate,
      endDate: params.endDate,
      totalLogs: logs.length,
      operationLogs,
      loginLogs,
      accessLogs,
      errorLogs,
      securityLogs,
      uniqueUsers,
      uniqueIpAddresses,
      topModules,
      topUsers,
      topActions,
      errorRate,
      avgResponseTime,
      peakHour: Number(peakHour),
      generatedAt: new Date(),
    }

    this.auditReports.set(reportId, report)
    return report
  }

  // 获取日志统计概览
  async getLogStatistics(startDate?: Date, endDate?: Date) {
    let logs = Array.from(this.logs.values())
    if (startDate) logs = logs.filter((l) => l.createdAt >= startDate)
    if (endDate) logs = logs.filter((l) => l.createdAt <= endDate)

    return {
      totalLogs: logs.length,
      operationLogs: logs.filter((l) => l.logType === LogType.OPERATION).length,
      loginLogs: logs.filter((l) => l.logType === LogType.LOGIN).length,
      accessLogs: logs.filter((l) => l.logType === LogType.ACCESS).length,
      errorLogs: logs.filter((l) => l.logType === LogType.ERROR).length,
      securityLogs: logs.filter((l) => l.logType === LogType.SECURITY).length,
      successRate:
        logs.length > 0
          ? (logs.filter((l) => l.status === LogStatus.SUCCESS).length / logs.length) * 100
          : 0,
      uniqueUsers: new Set(logs.filter((l) => l.userId).map((l) => l.userId)).size,
      uniqueIpAddresses: new Set(logs.map((l) => l.ipAddress)).size,
    }
  }

  // 清理过期日志
  async cleanExpiredLogs(retentionDays: number) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    let cleanedCount = 0
    for (const [id, log] of this.logs.entries()) {
      if (log.createdAt < cutoffDate) {
        this.logs.delete(id)
        cleanedCount++
      }
    }

    return { cleanedCount, retentionDays, cutoffDate }
  }

  // 导出日志
  async exportLogs(params: {
    logType?: LogType
    startDate?: Date
    endDate?: Date
    format?: 'CSV' | 'JSON' | 'EXCEL'
  }) {
    let logs = Array.from(this.logs.values())

    if (params.logType) logs = logs.filter((l) => l.logType === params.logType)
    if (params.startDate) logs = logs.filter((l) => l.createdAt >= params.startDate!)
    if (params.endDate) logs = logs.filter((l) => l.createdAt <= params.endDate!)

    return {
      format: params.format || 'CSV',
      totalRecords: logs.length,
      exportTime: new Date(),
      downloadUrl: `/exports/logs_${Date.now()}.${params.format?.toLowerCase() || 'csv'}`,
    }
  }
}
