/**
 * 系统监控仪表盘服务
 * 系统健康状态、性能指标、服务监控、告警管理、日志查看
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum ServiceStatus {
  HEALTHY = 'HEALTHY', // 健康
  WARNING = 'WARNING', // 警告
  CRITICAL = 'CRITICAL', // 严重
  DOWN = 'DOWN', // 不可用
  UNKNOWN = 'UNKNOWN', // 未知
}

export enum AlertLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  SILENCED = 'SILENCED',
}

export enum MetricType {
  CPU = 'CPU',
  MEMORY = 'MEMORY',
  DISK = 'DISK',
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  API = 'API',
  SERVICE = 'SERVICE',
  USER = 'USER',
  JOB = 'JOB',
  QUEUE = 'QUEUE',
  CACHE = 'CACHE',
}

export enum ServiceType {
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

export enum JobStatus {
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
}

export enum JobType {
  CRON = 'CRON',
  SCHEDULED = 'SCHEDULED',
  RECURRING = 'RECURRING',
  ONE_TIME = 'ONE_TIME',
}

export enum DatabaseType {
  POSTGRES = 'POSTGRES',
  MYSQL = 'MYSQL',
  MONGODB = 'MONGODB',
  REDIS = 'REDIS',
  CLICKHOUSE = 'CLICKHOUSE',
  ELASTICSEARCH = 'ELASTICSEARCH',
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  FATAL = 'FATAL',
}

// ========== 导出接口类型 ==========

export interface HealthCheckResult {
  service: string
  type: ServiceType
  status: ServiceStatus
  message?: string
  responseTime?: number
  lastCheckAt: Date
  details?: Record<string, any>
  errorCount: number
  uptime: number
}

export interface SystemMetric {
  id: string
  type: MetricType
  name: string
  value: number
  unit: string
  threshold?: number
  status: ServiceStatus
  trend: 'UP' | 'DOWN' | 'STABLE'
  changePercent: number
  recordedAt: Date
  tags?: Record<string, string>
}

// 服务监控定义
export interface ServiceMonitor {
  id: string
  name: string
  type: ServiceType
  host: string
  port?: number
  status: ServiceStatus
  healthChecks: HealthCheckResult[]
  metrics: SystemMetric[]
  lastRestart?: Date
  version?: string
  dependencies: string[]
  config?: Record<string, any>
  enabled: boolean
  checkInterval: number
  timeout: number
  retries: number
}

// 告警定义
export interface Alert {
  id: string
  name: string
  level: AlertLevel
  status: AlertStatus
  message: string
  source: string
  service?: string
  metric?: string
  value?: number
  threshold?: number
  details?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  acknowledgedAt?: Date
  acknowledgedBy?: string
  silencedUntil?: Date
  silencedBy?: string
  assignee?: string
  tags?: string[]
  notificationSent: boolean
  escalationPolicy?: string
}

// 告警规则定义
export interface AlertRule {
  id: string
  name: string
  description?: string
  metric: MetricType
  condition: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS' | 'NOT_EQUALS' | 'CHANGES' | 'ABSENCE'
  threshold: number
  duration: number
  level: AlertLevel
  enabled: boolean
  serviceFilter?: string[]
  actions: AlertAction[]
  cooldown: number
  createdBy: string
  createdAt: Date
}

// 告警动作定义
export interface AlertAction {
  type: 'NOTIFY' | 'ESCALATE' | 'SILENCE' | 'AUTO_RESOLVE' | 'WEBHOOK'
  config: Record<string, any>
}

// 定时任务状态定义
export interface JobInfo {
  id: string
  name: string
  type: 'CRON' | 'SCHEDULED' | 'RECURRING' | 'ONE_TIME'
  status: 'RUNNING' | 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED'
  lastRunAt?: Date
  nextRunAt?: Date
  duration?: number
  result?: string
  error?: string
  progress?: number
  triggeredBy?: string
  logs?: string[]
}

// 数据库连接状态定义
export interface DatabaseConnection {
  id: string
  name: string
  type: 'POSTGRES' | 'MYSQL' | 'MONGODB' | 'REDIS' | 'CLICKHOUSE' | 'ELASTICSEARCH'
  host: string
  port: number
  database: string
  status: ServiceStatus
  connections: number
  maxConnections: number
  activeQueries: number
  idleConnections: number
  responseTime: number
  lastError?: string
  replicationStatus?: string
  version?: string
  uptime: number
}

// API端点状态定义
export interface ApiEndpointStatus {
  path: string
  method: string
  status: ServiceStatus
  avgResponseTime: number
  calls: number
  errors: number
  successRate: number
  lastCalledAt: Date
  lastErrorAt?: Date
  errorRate: number
  p50ResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
}

// 用户活动统计定义
export interface UserActivityStats {
  onlineUsers: number
  totalUsers: number
  activeSessions: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  topActiveUsers: string[]
  avgSessionDuration: number
  peakConcurrency: number
  peakTime?: Date
  deviceStats: Record<string, number>
  locationStats: Record<string, number>
}

// 系统概览定义
export interface SystemOverview {
  overallStatus: ServiceStatus
  servicesHealthy: number
  servicesWarning: number
  servicesCritical: number
  servicesDown: number
  activeAlerts: number
  criticalAlerts: number
  uptime: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkIn: number
  networkOut: number
  apiCallsTotal: number
  apiCallsSuccess: number
  apiCallsFailed: number
  activeJobs: number
  pendingJobs: number
  failedJobs: number
}

// 日志条目定义
export interface LogEntry {
  id: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'FATAL'
  message: string
  source: string
  service?: string
  timestamp: Date
  context?: Record<string, any>
  stack?: string
  requestId?: string
  userId?: string
}

// 性能趋势定义
export interface PerformanceTrend {
  metric: MetricType
  period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH'
  data: { timestamp: Date; value: number }[]
  avg: number
  min: number
  max: number
  trend: 'UP' | 'DOWN' | 'STABLE'
}

@Injectable()
export class SystemMonitorDashboardService {
  // 服务监控存储
  private services: Map<string, ServiceMonitor> = new Map()

  // 告警存储
  private alerts: Map<string, Alert> = new Map()

  // 告警规则存储
  private alertRules: Map<string, AlertRule> = new Map()

  // 指标存储
  private metrics: Map<string, SystemMetric[]> = new Map()

  // 任务状态存储
  private jobs: Map<string, JobInfo> = new Map()

  // 数据库连接存储
  private databases: Map<string, DatabaseConnection> = new Map()

  // API状态存储
  private apiEndpoints: Map<string, ApiEndpointStatus> = new Map()

  // 日志存储
  private logs: LogEntry[] = []

  constructor() {
    this.initDefaultServices()
    this.initDefaultAlertRules()
    this.initDefaultMetrics()
    this.initDefaultJobs()
    this.initDefaultDatabases()
    this.initDefaultApiEndpoints()
    this.initSampleLogs()
  }

  // 初始化默认服务
  private initDefaultServices() {
    const defaultServices: ServiceMonitor[] = [
      {
        id: 'SVC-APP-001',
        name: 'Application Server',
        type: ServiceType.APPLICATION,
        host: 'localhost',
        port: 3000,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '1.0.0',
        dependencies: ['SVC-DB-001', 'SVC-CACHE-001'],
        enabled: true,
        checkInterval: 30000,
        timeout: 5000,
        retries: 3,
      },
      {
        id: 'SVC-APP-002',
        name: 'Portal Server',
        type: ServiceType.APPLICATION,
        host: 'localhost',
        port: 5173,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '1.0.0',
        dependencies: ['SVC-APP-001'],
        enabled: true,
        checkInterval: 30000,
        timeout: 5000,
        retries: 3,
      },
      {
        id: 'SVC-DB-001',
        name: 'PostgreSQL Database',
        type: ServiceType.DATABASE,
        host: 'localhost',
        port: 5432,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '15.0',
        dependencies: [],
        enabled: true,
        checkInterval: 60000,
        timeout: 10000,
        retries: 2,
      },
      {
        id: 'SVC-CACHE-001',
        name: 'Redis Cache',
        type: ServiceType.CACHE,
        host: 'localhost',
        port: 6379,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '7.0',
        dependencies: [],
        enabled: true,
        checkInterval: 30000,
        timeout: 3000,
        retries: 3,
      },
      {
        id: 'SVC-MQ-001',
        name: 'Kafka Message Queue',
        type: ServiceType.MESSAGE_QUEUE,
        host: 'localhost',
        port: 9092,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '3.0',
        dependencies: [],
        enabled: true,
        checkInterval: 60000,
        timeout: 5000,
        retries: 2,
      },
      {
        id: 'SVC-STORAGE-001',
        name: 'MinIO Storage',
        type: ServiceType.FILE_STORAGE,
        host: 'localhost',
        port: 9000,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: 'latest',
        dependencies: [],
        enabled: true,
        checkInterval: 60000,
        timeout: 5000,
        retries: 2,
      },
      {
        id: 'SVC-EMAIL-001',
        name: 'Email Service',
        type: ServiceType.EMAIL_SERVICE,
        host: 'smtp.example.com',
        port: 587,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        dependencies: [],
        enabled: true,
        checkInterval: 120000,
        timeout: 10000,
        retries: 2,
      },
      {
        id: 'SVC-AUTH-001',
        name: 'Auth Service',
        type: ServiceType.AUTH_SERVICE,
        host: 'localhost',
        port: 3001,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '1.0.0',
        dependencies: ['SVC-DB-001', 'SVC-CACHE-001'],
        enabled: true,
        checkInterval: 30000,
        timeout: 5000,
        retries: 3,
      },
      {
        id: 'SVC-GATEWAY-001',
        name: 'API Gateway',
        type: ServiceType.API_GATEWAY,
        host: 'localhost',
        port: 8080,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '1.0.0',
        dependencies: ['SVC-APP-001'],
        enabled: true,
        checkInterval: 30000,
        timeout: 5000,
        retries: 3,
      },
      {
        id: 'SVC-LOG-001',
        name: 'Log Service',
        type: ServiceType.LOG_SERVICE,
        host: 'localhost',
        port: 9200,
        status: ServiceStatus.HEALTHY,
        healthChecks: [],
        metrics: [],
        version: '8.0',
        dependencies: [],
        enabled: true,
        checkInterval: 60000,
        timeout: 5000,
        retries: 2,
      },
    ]

    defaultServices.forEach((s) => this.services.set(s.id, s))
  }

  // 初始化默认告警规则
  private initDefaultAlertRules() {
    const defaultRules: AlertRule[] = [
      {
        id: 'RULE-CPU-001',
        name: 'CPU使用率过高',
        description: '当CPU使用率超过80%持续5分钟触发告警',
        metric: MetricType.CPU,
        condition: 'GREATER_THAN',
        threshold: 80,
        duration: 300,
        level: AlertLevel.WARNING,
        enabled: true,
        actions: [{ type: 'NOTIFY', config: { channels: ['email', 'slack'] } }],
        cooldown: 600,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-CPU-002',
        name: 'CPU使用率严重过高',
        description: '当CPU使用率超过95%持续2分钟触发严重告警',
        metric: MetricType.CPU,
        condition: 'GREATER_THAN',
        threshold: 95,
        duration: 120,
        level: AlertLevel.CRITICAL,
        enabled: true,
        actions: [
          { type: 'NOTIFY', config: { channels: ['email', 'slack', 'phone'] } },
          { type: 'ESCALATE', config: { level: 'L2' } },
        ],
        cooldown: 300,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-MEM-001',
        name: '内存使用率过高',
        description: '当内存使用率超过85%持续5分钟触发告警',
        metric: MetricType.MEMORY,
        condition: 'GREATER_THAN',
        threshold: 85,
        duration: 300,
        level: AlertLevel.WARNING,
        enabled: true,
        actions: [{ type: 'NOTIFY', config: { channels: ['email'] } }],
        cooldown: 600,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-DISK-001',
        name: '磁盘空间不足',
        description: '当磁盘使用率超过90%触发告警',
        metric: MetricType.DISK,
        condition: 'GREATER_THAN',
        threshold: 90,
        duration: 60,
        level: AlertLevel.ERROR,
        enabled: true,
        actions: [{ type: 'NOTIFY', config: { channels: ['email', 'slack'] } }],
        cooldown: 1800,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-API-001',
        name: 'API响应时间过长',
        description: '当API平均响应时间超过1000ms触发告警',
        metric: MetricType.API,
        condition: 'GREATER_THAN',
        threshold: 1000,
        duration: 120,
        level: AlertLevel.WARNING,
        enabled: true,
        actions: [{ type: 'NOTIFY', config: { channels: ['email'] } }],
        cooldown: 600,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-API-002',
        name: 'API错误率过高',
        description: '当API错误率超过5%触发告警',
        metric: MetricType.API,
        condition: 'GREATER_THAN',
        threshold: 5,
        duration: 180,
        level: AlertLevel.ERROR,
        enabled: true,
        actions: [{ type: 'NOTIFY', config: { channels: ['email', 'slack'] } }],
        cooldown: 600,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-DB-001',
        name: '数据库连接数过多',
        description: '当数据库连接数超过最大连接数的80%触发告警',
        metric: MetricType.DATABASE,
        condition: 'GREATER_THAN',
        threshold: 80,
        duration: 300,
        level: AlertLevel.WARNING,
        enabled: true,
        actions: [{ type: 'NOTIFY', config: { channels: ['email'] } }],
        cooldown: 600,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-SVC-001',
        name: '服务不可用',
        description: '当服务状态变为DOWN触发严重告警',
        metric: MetricType.SERVICE,
        condition: 'EQUALS',
        threshold: 0,
        duration: 60,
        level: AlertLevel.CRITICAL,
        enabled: true,
        actions: [
          { type: 'NOTIFY', config: { channels: ['email', 'slack', 'phone'] } },
          { type: 'ESCALATE', config: { level: 'L1' } },
        ],
        cooldown: 300,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
      },
    ]

    defaultRules.forEach((r) => this.alertRules.set(r.id, r))
  }

  // 初始化默认指标
  private initDefaultMetrics() {
    const now = new Date()
    const defaultMetrics: SystemMetric[] = [
      {
        id: 'MET-CPU-001',
        type: MetricType.CPU,
        name: 'CPU使用率',
        value: 45.2,
        unit: '%',
        threshold: 80,
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 2.1,
        recordedAt: now,
      },
      {
        id: 'MET-CPU-002',
        type: MetricType.CPU,
        name: 'CPU负载',
        value: 1.25,
        unit: 'load',
        status: ServiceStatus.HEALTHY,
        trend: 'DOWN',
        changePercent: -5.2,
        recordedAt: now,
      },
      {
        id: 'MET-MEM-001',
        type: MetricType.MEMORY,
        name: '内存使用率',
        value: 62.8,
        unit: '%',
        threshold: 85,
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 3.5,
        recordedAt: now,
      },
      {
        id: 'MET-MEM-002',
        type: MetricType.MEMORY,
        name: '可用内存',
        value: 3840,
        unit: 'MB',
        status: ServiceStatus.HEALTHY,
        trend: 'DOWN',
        changePercent: -3.5,
        recordedAt: now,
      },
      {
        id: 'MET-MEM-003',
        type: MetricType.MEMORY,
        name: '缓存内存',
        value: 512,
        unit: 'MB',
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 0,
        recordedAt: now,
      },
      {
        id: 'MET-DISK-001',
        type: MetricType.DISK,
        name: '磁盘使用率',
        value: 55.6,
        unit: '%',
        threshold: 90,
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 1.2,
        recordedAt: now,
      },
      {
        id: 'MET-DISK-002',
        type: MetricType.DISK,
        name: '可用磁盘',
        value: 450,
        unit: 'GB',
        status: ServiceStatus.HEALTHY,
        trend: 'DOWN',
        changePercent: -1.2,
        recordedAt: now,
      },
      {
        id: 'MET-DISK-003',
        type: MetricType.DISK,
        name: '磁盘IO',
        value: 125,
        unit: 'MB/s',
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 0.5,
        recordedAt: now,
      },
      {
        id: 'MET-NET-001',
        type: MetricType.NETWORK,
        name: '入站流量',
        value: 50.2,
        unit: 'Mbps',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 8.5,
        recordedAt: now,
      },
      {
        id: 'MET-NET-002',
        type: MetricType.NETWORK,
        name: '出站流量',
        value: 25.8,
        unit: 'Mbps',
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 2.1,
        recordedAt: now,
      },
      {
        id: 'MET-NET-003',
        type: MetricType.NETWORK,
        name: '连接数',
        value: 1250,
        unit: 'conn',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 5.2,
        recordedAt: now,
      },
      {
        id: 'MET-API-001',
        type: MetricType.API,
        name: 'API调用量',
        value: 3500,
        unit: 'calls',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 12.5,
        recordedAt: now,
      },
      {
        id: 'MET-API-002',
        type: MetricType.API,
        name: 'API平均响应',
        value: 48,
        unit: 'ms',
        threshold: 1000,
        status: ServiceStatus.HEALTHY,
        trend: 'DOWN',
        changePercent: -5.2,
        recordedAt: now,
      },
      {
        id: 'MET-API-003',
        type: MetricType.API,
        name: 'API成功率',
        value: 99.5,
        unit: '%',
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 0.1,
        recordedAt: now,
      },
      {
        id: 'MET-API-004',
        type: MetricType.API,
        name: 'API错误率',
        value: 0.5,
        unit: '%',
        status: ServiceStatus.HEALTHY,
        trend: 'DOWN',
        changePercent: -0.1,
        recordedAt: now,
      },
      {
        id: 'MET-DB-001',
        type: MetricType.DATABASE,
        name: '数据库连接数',
        value: 25,
        unit: 'conn',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 5.0,
        recordedAt: now,
      },
      {
        id: 'MET-DB-002',
        type: MetricType.DATABASE,
        name: '数据库响应时间',
        value: 5,
        unit: 'ms',
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 0,
        recordedAt: now,
      },
      {
        id: 'MET-DB-003',
        type: MetricType.DATABASE,
        name: '活跃查询数',
        value: 12,
        unit: 'queries',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 8.3,
        recordedAt: now,
      },
      {
        id: 'MET-CACHE-001',
        type: MetricType.CACHE,
        name: '缓存命中率',
        value: 92.5,
        unit: '%',
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 1.2,
        recordedAt: now,
      },
      {
        id: 'MET-CACHE-002',
        type: MetricType.CACHE,
        name: '缓存键数',
        value: 1520,
        unit: 'keys',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 3.5,
        recordedAt: now,
      },
      {
        id: 'MET-QUEUE-001',
        type: MetricType.QUEUE,
        name: '队列积压',
        value: 125,
        unit: 'messages',
        status: ServiceStatus.HEALTHY,
        trend: 'DOWN',
        changePercent: -8.2,
        recordedAt: now,
      },
      {
        id: 'MET-USER-001',
        type: MetricType.USER,
        name: '在线用户',
        value: 85,
        unit: 'users',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 15.2,
        recordedAt: now,
      },
      {
        id: 'MET-USER-002',
        type: MetricType.USER,
        name: '活跃会话',
        value: 125,
        unit: 'sessions',
        status: ServiceStatus.HEALTHY,
        trend: 'UP',
        changePercent: 12.5,
        recordedAt: now,
      },
      {
        id: 'MET-JOB-001',
        type: MetricType.JOB,
        name: '运行任务数',
        value: 3,
        unit: 'jobs',
        status: ServiceStatus.HEALTHY,
        trend: 'STABLE',
        changePercent: 0,
        recordedAt: now,
      },
      {
        id: 'MET-JOB-002',
        type: MetricType.JOB,
        name: '待执行任务',
        value: 15,
        unit: 'jobs',
        status: ServiceStatus.HEALTHY,
        trend: 'DOWN',
        changePercent: -5.2,
        recordedAt: now,
      },
    ]

    defaultMetrics.forEach((m) => {
      const existing = this.metrics.get(m.type) || []
      existing.push(m)
      this.metrics.set(m.type, existing)
    })
  }

  // 初始化默认任务状态
  private initDefaultJobs() {
    const defaultJobs: JobInfo[] = [
      {
        id: 'JOB-001',
        name: '数据同步任务',
        type: 'CRON',
        status: 'SUCCESS',
        lastRunAt: new Date('2026-03-31T15:00:00'),
        nextRunAt: new Date('2026-03-31T16:00:00'),
        duration: 1250,
        result: '同步完成，新增125条记录',
        triggeredBy: 'cron',
        progress: 100,
      },
      {
        id: 'JOB-002',
        name: '报表生成任务',
        type: 'SCHEDULED',
        status: 'SUCCESS',
        lastRunAt: new Date('2026-03-31T14:30:00'),
        nextRunAt: new Date('2026-03-31T15:30:00'),
        duration: 3500,
        result: '日报表已生成',
        triggeredBy: 'system',
        progress: 100,
      },
      {
        id: 'JOB-003',
        name: '日志清理任务',
        type: 'RECURRING',
        status: 'SUCCESS',
        lastRunAt: new Date('2026-03-31T15:00:00'),
        nextRunAt: new Date('2026-03-31T15:10:00'),
        duration: 500,
        result: '清理了50MB日志',
        triggeredBy: 'system',
        progress: 100,
      },
      {
        id: 'JOB-004',
        name: '缓存刷新任务',
        type: 'CRON',
        status: 'RUNNING',
        lastRunAt: new Date('2026-03-31T15:20:00'),
        nextRunAt: new Date('2026-03-31T15:30:00'),
        duration: 0,
        triggeredBy: 'manual',
        progress: 65,
      },
      {
        id: 'JOB-005',
        name: '邮件发送任务',
        type: 'ONE_TIME',
        status: 'PENDING',
        nextRunAt: new Date('2026-03-31T16:00:00'),
        triggeredBy: 'user',
        progress: 0,
      },
      {
        id: 'JOB-006',
        name: '数据备份任务',
        type: 'SCHEDULED',
        status: 'FAILED',
        lastRunAt: new Date('2026-03-31T14:00:00'),
        nextRunAt: new Date('2026-03-31T15:00:00'),
        duration: 500,
        error: '存储空间不足',
        triggeredBy: 'system',
        progress: 0,
      },
      {
        id: 'JOB-007',
        name: '用户统计任务',
        type: 'CRON',
        status: 'SUCCESS',
        lastRunAt: new Date('2026-03-31T15:00:00'),
        nextRunAt: new Date('2026-03-31T16:00:00'),
        duration: 800,
        result: '统计完成',
        triggeredBy: 'cron',
        progress: 100,
      },
      {
        id: 'JOB-008',
        name: '告警检查任务',
        type: 'RECURRING',
        status: 'SUCCESS',
        lastRunAt: new Date('2026-03-31T15:00:00'),
        nextRunAt: new Date('2026-03-31T15:05:00'),
        duration: 100,
        result: '检查完成，无告警',
        triggeredBy: 'system',
        progress: 100,
      },
    ]

    defaultJobs.forEach((j) => this.jobs.set(j.id, j))
  }

  // 初始化默认数据库连接
  private initDefaultDatabases() {
    const defaultDbs: DatabaseConnection[] = [
      {
        id: 'DB-001',
        name: '主数据库',
        type: 'POSTGRES',
        host: 'localhost',
        port: 5432,
        database: 'daoda_platform',
        status: ServiceStatus.HEALTHY,
        connections: 25,
        maxConnections: 100,
        activeQueries: 12,
        idleConnections: 13,
        responseTime: 5,
        version: '15.0',
        uptime: 864000,
      },
      {
        id: 'DB-002',
        name: 'Redis缓存',
        type: 'REDIS',
        host: 'localhost',
        port: 6379,
        database: '0',
        status: ServiceStatus.HEALTHY,
        connections: 15,
        maxConnections: 50,
        activeQueries: 5,
        idleConnections: 10,
        responseTime: 2,
        version: '7.0',
        uptime: 864000,
      },
      {
        id: 'DB-003',
        name: 'ClickHouse分析库',
        type: 'CLICKHOUSE',
        host: 'localhost',
        port: 8123,
        database: 'analytics',
        status: ServiceStatus.HEALTHY,
        connections: 5,
        maxConnections: 20,
        activeQueries: 2,
        idleConnections: 3,
        responseTime: 15,
        version: '23.0',
        uptime: 432000,
      },
      {
        id: 'DB-004',
        name: 'Elasticsearch日志库',
        type: 'ELASTICSEARCH',
        host: 'localhost',
        port: 9200,
        database: 'logs',
        status: ServiceStatus.HEALTHY,
        connections: 3,
        maxConnections: 10,
        activeQueries: 1,
        idleConnections: 2,
        responseTime: 10,
        version: '8.0',
        uptime: 432000,
      },
    ]

    defaultDbs.forEach((d) => this.databases.set(d.id, d))
  }

  // 初始化默认API端点状态
  private initDefaultApiEndpoints() {
    const defaultEndpoints: ApiEndpointStatus[] = [
      {
        path: '/auth/login',
        method: 'POST',
        status: ServiceStatus.HEALTHY,
        avgResponseTime: 100,
        calls: 500,
        errors: 20,
        successRate: 96,
        lastCalledAt: new Date(),
        p50ResponseTime: 90,
        p95ResponseTime: 200,
        p99ResponseTime: 280,
        errorRate: 4,
      },
      {
        path: '/customers',
        method: 'GET',
        status: ServiceStatus.HEALTHY,
        avgResponseTime: 45,
        calls: 1250,
        errors: 20,
        successRate: 98.4,
        lastCalledAt: new Date(),
        p50ResponseTime: 40,
        p95ResponseTime: 80,
        p99ResponseTime: 150,
        errorRate: 1.6,
      },
      {
        path: '/customers/{id}',
        method: 'GET',
        status: ServiceStatus.HEALTHY,
        avgResponseTime: 30,
        calls: 800,
        errors: 5,
        successRate: 99.4,
        lastCalledAt: new Date(),
        p50ResponseTime: 25,
        p95ResponseTime: 60,
        p99ResponseTime: 90,
        errorRate: 0.6,
      },
      {
        path: '/products',
        method: 'GET',
        status: ServiceStatus.HEALTHY,
        avgResponseTime: 35,
        calls: 600,
        errors: 2,
        successRate: 99.7,
        lastCalledAt: new Date(),
        p50ResponseTime: 30,
        p95ResponseTime: 70,
        p99ResponseTime: 110,
        errorRate: 0.3,
      },
      {
        path: '/invoices',
        method: 'GET',
        status: ServiceStatus.HEALTHY,
        avgResponseTime: 40,
        calls: 400,
        errors: 5,
        successRate: 98.8,
        lastCalledAt: new Date(),
        p50ResponseTime: 35,
        p95ResponseTime: 80,
        p99ResponseTime: 120,
        errorRate: 1.2,
      },
      {
        path: '/tickets',
        method: 'GET',
        status: ServiceStatus.HEALTHY,
        avgResponseTime: 50,
        calls: 350,
        errors: 5,
        successRate: 98.6,
        lastCalledAt: new Date(),
        p50ResponseTime: 45,
        p95ResponseTime: 100,
        p99ResponseTime: 140,
        errorRate: 1.4,
      },
      {
        path: '/system/health',
        method: 'GET',
        status: ServiceStatus.HEALTHY,
        avgResponseTime: 5,
        calls: 1000,
        errors: 0,
        successRate: 100,
        lastCalledAt: new Date(),
        p50ResponseTime: 3,
        p95ResponseTime: 10,
        p99ResponseTime: 15,
        errorRate: 0,
      },
      {
        path: '/api/v1/unknown',
        method: 'GET',
        status: ServiceStatus.WARNING,
        avgResponseTime: 1500,
        calls: 50,
        errors: 10,
        successRate: 80,
        lastCalledAt: new Date(),
        lastErrorAt: new Date(),
        p50ResponseTime: 1000,
        p95ResponseTime: 2000,
        p99ResponseTime: 3000,
        errorRate: 20,
      },
    ]

    defaultEndpoints.forEach((e) => this.apiEndpoints.set(`${e.method}:${e.path}`, e))
  }

  // 初始化示例日志
  private initSampleLogs() {
    const sampleLogs: LogEntry[] = [
      {
        id: 'LOG-001',
        level: 'INFO',
        message: '系统启动完成',
        source: 'ApplicationServer',
        service: 'SVC-APP-001',
        timestamp: new Date('2026-03-31T15:00:00'),
        context: { version: '1.0.0' },
      },
      {
        id: 'LOG-002',
        level: 'INFO',
        message: '数据库连接成功',
        source: 'DatabaseService',
        service: 'SVC-DB-001',
        timestamp: new Date('2026-03-31T15:00:05'),
        context: { database: 'daoda_platform' },
      },
      {
        id: 'LOG-003',
        level: 'INFO',
        message: '用户登录成功',
        source: 'AuthService',
        service: 'SVC-AUTH-001',
        timestamp: new Date('2026-03-31T15:05:00'),
        context: { userId: 'user-001' },
        requestId: 'req-001',
        userId: 'user-001',
      },
      {
        id: 'LOG-004',
        level: 'WARN',
        message: '缓存命中率偏低',
        source: 'CacheService',
        service: 'SVC-CACHE-001',
        timestamp: new Date('2026-03-31T15:10:00'),
        context: { hitRate: 85 },
      },
      {
        id: 'LOG-005',
        level: 'ERROR',
        message: '数据备份失败',
        source: 'BackupService',
        service: 'SVC-APP-001',
        timestamp: new Date('2026-03-31T14:00:00'),
        context: { jobId: 'JOB-006' },
        stack: 'Error: Storage full\n  at BackupService.run()',
      },
      {
        id: 'LOG-006',
        level: 'INFO',
        message: 'API调用统计完成',
        source: 'MonitorService',
        service: 'SVC-APP-001',
        timestamp: new Date('2026-03-31T15:15:00'),
        context: { calls: 3500 },
      },
      {
        id: 'LOG-007',
        level: 'DEBUG',
        message: '缓存刷新任务执行',
        source: 'JobScheduler',
        service: 'SVC-APP-001',
        timestamp: new Date('2026-03-31T15:20:00'),
        context: { jobId: 'JOB-004', progress: 65 },
      },
      {
        id: 'LOG-008',
        level: 'INFO',
        message: '报表生成完成',
        source: 'ReportService',
        service: 'SVC-APP-001',
        timestamp: new Date('2026-03-31T14:30:00'),
        context: { reportId: 'RPT-001' },
      },
      {
        id: 'LOG-009',
        level: 'WARN',
        message: '磁盘空间不足',
        source: 'DiskMonitor',
        service: 'SVC-APP-001',
        timestamp: new Date('2026-03-31T15:00:00'),
        context: { usage: 92 },
      },
      {
        id: 'LOG-010',
        level: 'INFO',
        message: '邮件发送成功',
        source: 'EmailService',
        service: 'SVC-EMAIL-001',
        timestamp: new Date('2026-03-31T15:25:00'),
        context: { to: 'admin@example.com' },
      },
    ]

    this.logs = sampleLogs
  }

  // ========== 系统概览 ==========

  async getSystemOverview(): Promise<SystemOverview> {
    const services = Array.from(this.services.values())
    const metrics = this.metrics

    return {
      overallStatus: ServiceStatus.HEALTHY,
      servicesHealthy: services.filter((s) => s.status === ServiceStatus.HEALTHY).length,
      servicesWarning: services.filter((s) => s.status === ServiceStatus.WARNING).length,
      servicesCritical: services.filter((s) => s.status === ServiceStatus.CRITICAL).length,
      servicesDown: services.filter((s) => s.status === ServiceStatus.DOWN).length,
      activeAlerts: Array.from(this.alerts.values()).filter((a) => a.status === AlertStatus.ACTIVE)
        .length,
      criticalAlerts: Array.from(this.alerts.values()).filter(
        (a) => a.level === AlertLevel.CRITICAL && a.status === AlertStatus.ACTIVE,
      ).length,
      uptime: 864000,
      cpuUsage: this.getMetricValue(MetricType.CPU, 'CPU使用率') || 45.2,
      memoryUsage: this.getMetricValue(MetricType.MEMORY, '内存使用率') || 62.8,
      diskUsage: this.getMetricValue(MetricType.DISK, '磁盘使用率') || 55.6,
      networkIn: this.getMetricValue(MetricType.NETWORK, '入站流量') || 50.2,
      networkOut: this.getMetricValue(MetricType.NETWORK, '出站流量') || 25.8,
      apiCallsTotal: 3500,
      apiCallsSuccess: 3480,
      apiCallsFailed: 20,
      activeJobs: Array.from(this.jobs.values()).filter((j) => j.status === 'RUNNING').length,
      pendingJobs: Array.from(this.jobs.values()).filter((j) => j.status === 'PENDING').length,
      failedJobs: Array.from(this.jobs.values()).filter((j) => j.status === 'FAILED').length,
    }
  }

  private getMetricValue(type: MetricType, name: string): number | null {
    const metrics = this.metrics.get(type) || []
    const metric = metrics.find((m) => m.name === name)
    return metric?.value || null
  }

  // ========== 服务监控 ==========

  async getServices() {
    return Array.from(this.services.values())
  }

  async getService(id: string) {
    return this.services.get(id)
  }

  async getServiceHealth(id: string): Promise<HealthCheckResult | null> {
    const service = this.services.get(id)
    if (!service) return null

    return {
      service: service.name,
      type: service.type,
      status: service.status,
      message: this.getStatusMessage(service.status),
      responseTime: Math.random() * 50 + 10,
      lastCheckAt: new Date(),
      details: { host: service.host, port: service.port },
      errorCount: service.status === ServiceStatus.HEALTHY ? 0 : Math.floor(Math.random() * 5),
      uptime: 864000,
    }
  }

  private getStatusMessage(status: ServiceStatus): string {
    const messages: Record<ServiceStatus, string> = {
      [ServiceStatus.HEALTHY]: '服务运行正常',
      [ServiceStatus.WARNING]: '服务存在轻微问题',
      [ServiceStatus.CRITICAL]: '服务存在严重问题',
      [ServiceStatus.DOWN]: '服务不可用',
      [ServiceStatus.UNKNOWN]: '状态未知',
    }
    return messages[status] || '未知状态'
  }

  async checkAllServices() {
    const results: HealthCheckResult[] = []

    for (const service of this.services.values()) {
      const result = await this.getServiceHealth(service.id)
      if (result) results.push(result)
    }

    return results
  }

  // ========== 指标监控 ==========

  async getMetrics(type?: MetricType) {
    if (type) return this.metrics.get(type) || []
    return Array.from(this.metrics.values()).flat()
  }

  async getMetricTrend(
    type: MetricType,
    period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH',
  ): Promise<PerformanceTrend> {
    const metrics = this.metrics.get(type) || []
    const now = new Date()

    // 生成模拟趋势数据
    const data: { timestamp: Date; value: number }[] = []
    const points = period === 'HOUR' ? 60 : period === 'DAY' ? 24 : period === 'WEEK' ? 7 : 30

    for (let i = points; i >= 0; i--) {
      const timestamp = new Date(
        now.getTime() -
          i *
            (period === 'HOUR'
              ? 60000
              : period === 'DAY'
                ? 3600000
                : period === 'WEEK'
                  ? 86400000
                  : 86400000),
      )
      const baseValue = metrics.length > 0 ? metrics[0].value : 50
      const value = baseValue + (Math.random() - 0.5) * 10
      data.push({ timestamp, value })
    }

    return {
      metric: type,
      period,
      data,
      avg: data.reduce((sum, d) => sum + d.value, 0) / data.length,
      min: Math.min(...data.map((d) => d.value)),
      max: Math.max(...data.map((d) => d.value)),
      trend:
        data[data.length - 1].value > data[0].value
          ? 'UP'
          : data[data.length - 1].value < data[0].value
            ? 'DOWN'
            : 'STABLE',
    }
  }

  // ========== 告警管理 ==========

  async getAlerts(params?: { level?: AlertLevel; status?: AlertStatus; service?: string }) {
    let alerts = Array.from(this.alerts.values())

    if (params?.level) alerts = alerts.filter((a) => a.level === params.level)
    if (params?.status) alerts = alerts.filter((a) => a.status === params.status)
    if (params?.service) alerts = alerts.filter((a) => a.service === params.service)

    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getAlert(id: string) {
    return this.alerts.get(id)
  }

  async createAlert(alert: Alert) {
    alert.id = `ALERT-${Date.now()}`
    alert.createdAt = new Date()
    alert.updatedAt = new Date()
    alert.status = AlertStatus.ACTIVE
    this.alerts.set(alert.id, alert)
    return alert
  }

  async acknowledgeAlert(id: string, acknowledgedBy: string) {
    const alert = this.alerts.get(id)
    if (!alert) return null

    alert.status = AlertStatus.ACKNOWLEDGED
    alert.acknowledgedAt = new Date()
    alert.acknowledgedBy = acknowledgedBy
    alert.updatedAt = new Date()
    this.alerts.set(id, alert)
    return alert
  }

  async resolveAlert(id: string) {
    const alert = this.alerts.get(id)
    if (!alert) return null

    alert.status = AlertStatus.RESOLVED
    alert.resolvedAt = new Date()
    alert.updatedAt = new Date()
    this.alerts.set(id, alert)
    return alert
  }

  async silenceAlert(id: string, duration: number, silencedBy: string) {
    const alert = this.alerts.get(id)
    if (!alert) return null

    alert.status = AlertStatus.SILENCED
    alert.silencedUntil = new Date(Date.now() + duration * 60000)
    alert.silencedBy = silencedBy
    alert.updatedAt = new Date()
    this.alerts.set(id, alert)
    return alert
  }

  // ========== 告警规则 ==========

  async getAlertRules() {
    return Array.from(this.alertRules.values())
  }

  async getAlertRule(id: string) {
    return this.alertRules.get(id)
  }

  async createAlertRule(rule: AlertRule) {
    rule.id = `RULE-${Date.now()}`
    rule.createdAt = new Date()
    this.alertRules.set(rule.id, rule)
    return rule
  }

  async updateAlertRule(id: string, updates: Partial<AlertRule>) {
    const rule = this.alertRules.get(id)
    if (!rule) return null
    Object.assign(rule, updates)
    this.alertRules.set(id, rule)
    return rule
  }

  async deleteAlertRule(id: string) {
    return this.alertRules.delete(id)
  }

  // ========== 任务监控 ==========

  async getJobs() {
    return Array.from(this.jobs.values())
  }

  async getJob(id: string) {
    return this.jobs.get(id)
  }

  async getJobStats() {
    const jobs = Array.from(this.jobs.values())
    return {
      total: jobs.length,
      running: jobs.filter((j) => j.status === 'RUNNING').length,
      success: jobs.filter((j) => j.status === 'SUCCESS').length,
      failed: jobs.filter((j) => j.status === 'FAILED').length,
      pending: jobs.filter((j) => j.status === 'PENDING').length,
      cancelled: jobs.filter((j) => j.status === 'CANCELLED').length,
    }
  }

  async cancelJob(id: string) {
    const job = this.jobs.get(id)
    if (!job) return null
    job.status = 'CANCELLED'
    this.jobs.set(id, job)
    return job
  }

  async retryJob(id: string) {
    const job = this.jobs.get(id)
    if (!job) return null
    job.status = 'PENDING'
    job.error = undefined
    this.jobs.set(id, job)
    return job
  }

  // ========== 数据库监控 ==========

  async getDatabases() {
    return Array.from(this.databases.values())
  }

  async getDatabase(id: string) {
    return this.databases.get(id)
  }

  async getDatabaseStats() {
    const dbs = Array.from(this.databases.values())
    return {
      total: dbs.length,
      healthy: dbs.filter((d) => d.status === ServiceStatus.HEALTHY).length,
      warning: dbs.filter((d) => d.status === ServiceStatus.WARNING).length,
      critical: dbs.filter((d) => d.status === ServiceStatus.CRITICAL).length,
      totalConnections: dbs.reduce((sum, d) => sum + d.connections, 0),
      totalActiveQueries: dbs.reduce((sum, d) => sum + d.activeQueries, 0),
      avgResponseTime: dbs.reduce((sum, d) => sum + d.responseTime, 0) / dbs.length,
    }
  }

  // ========== API监控 ==========

  async getApiEndpoints() {
    return Array.from(this.apiEndpoints.values())
  }

  async getApiEndpoint(path: string, method: string) {
    return this.apiEndpoints.get(`${method}:${path}`)
  }

  async getApiStats() {
    const endpoints = Array.from(this.apiEndpoints.values())
    return {
      totalEndpoints: endpoints.length,
      healthy: endpoints.filter((e) => e.status === ServiceStatus.HEALTHY).length,
      warning: endpoints.filter((e) => e.status === ServiceStatus.WARNING).length,
      critical: endpoints.filter((e) => e.status === ServiceStatus.CRITICAL).length,
      totalCalls: endpoints.reduce((sum, e) => sum + e.calls, 0),
      totalErrors: endpoints.reduce((sum, e) => sum + e.errors, 0),
      avgResponseTime: endpoints.reduce((sum, e) => sum + e.avgResponseTime, 0) / endpoints.length,
      avgSuccessRate: endpoints.reduce((sum, e) => sum + e.successRate, 0) / endpoints.length,
      avgErrorRate: endpoints.reduce((sum, e) => sum + e.errorRate, 0) / endpoints.length,
    }
  }

  // ========== 用户活动 ==========

  async getUserActivity(): Promise<UserActivityStats> {
    return {
      onlineUsers: 85,
      totalUsers: 1250,
      activeSessions: 125,
      newUsersToday: 15,
      newUsersThisWeek: 85,
      newUsersThisMonth: 350,
      topActiveUsers: ['user-001', 'user-002', 'user-003', 'user-004', 'user-005'],
      avgSessionDuration: 25,
      peakConcurrency: 150,
      peakTime: new Date('2026-03-31T14:00:00'),
      deviceStats: { desktop: 60, mobile: 35, tablet: 5 },
      locationStats: { CN: 80, US: 10, JP: 5, OTHER: 5 },
    }
  }

  // ========== 日志监控 ==========

  async getLogs(params?: {
    level?: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'FATAL'
    service?: string
    startTime?: Date
    endTime?: Date
    limit?: number
  }) {
    let logs = [...this.logs]

    if (params?.level) logs = logs.filter((l) => l.level === params.level)
    if (params?.service) logs = logs.filter((l) => l.service === params.service)
    if (params?.startTime) logs = logs.filter((l) => l.timestamp >= params.startTime!)
    if (params?.endTime) logs = logs.filter((l) => l.timestamp <= params.endTime!)

    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    if (params?.limit) logs = logs.slice(0, params.limit)

    return logs
  }

  async getLogStats() {
    const logs = this.logs
    return {
      total: logs.length,
      info: logs.filter((l) => l.level === 'INFO').length,
      warn: logs.filter((l) => l.level === 'WARN').length,
      error: logs.filter((l) => l.level === 'ERROR').length,
      debug: logs.filter((l) => l.level === 'DEBUG').length,
      fatal: logs.filter((l) => l.level === 'FATAL').length,
    }
  }

  // ========== 系统操作 ==========

  async restartService(id: string) {
    const service = this.services.get(id)
    if (!service) return null

    service.status = ServiceStatus.HEALTHY
    service.lastRestart = new Date()
    this.services.set(id, service)
    return service
  }

  async clearCache() {
    return { success: true, clearedKeys: 1520, timestamp: new Date() }
  }

  async refreshMetrics() {
    const now = new Date()

    for (const [type, metrics] of this.metrics.entries()) {
      for (const metric of metrics) {
        metric.value = metric.value + (Math.random() - 0.5) * 5
        metric.recordedAt = now
        metric.changePercent = (Math.random() - 0.5) * 10
      }
    }

    return { success: true, refreshedAt: now }
  }

  // ========== 统计分析 ==========

  async getStats() {
    const services = Array.from(this.services.values())
    const alerts = Array.from(this.alerts.values())
    const jobs = Array.from(this.jobs.values())

    return {
      totalServices: services.length,
      healthyServices: services.filter((s) => s.status === ServiceStatus.HEALTHY).length,
      totalAlerts: alerts.length,
      activeAlerts: alerts.filter((a) => a.status === AlertStatus.ACTIVE).length,
      totalJobs: jobs.length,
      runningJobs: jobs.filter((j) => j.status === 'RUNNING').length,
      totalDatabases: this.databases.size,
      totalApiEndpoints: this.apiEndpoints.size,
      totalLogs: this.logs.length,
    }
  }
}
