/**
 * API文档中心服务
 * OpenAPI规范管理、接口文档、接口测试、版本控制、调用统计
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum ApiStatus {
  DRAFT = 'DRAFT', // 草稿
  ACTIVE = 'ACTIVE', // 生效
  DEPRECATED = 'DEPRECATED', // 已废弃
  RETIRED = 'RETIRED', // 已下线
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

export enum ParamLocation {
  PATH = 'PATH',
  QUERY = 'QUERY',
  HEADER = 'HEADER',
  BODY = 'BODY',
  COOKIE = 'COOKIE',
}

export enum ParamType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  FILE = 'FILE',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  UUID = 'UUID',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  URL = 'URL',
}

export enum AuthType {
  NONE = 'NONE',
  BASIC = 'BASIC',
  BEARER = 'BEARER',
  API_KEY = 'API_KEY',
  OAUTH2 = 'OAUTH2',
  JWT = 'JWT',
  DIGEST = 'DIGEST',
  CUSTOM = 'CUSTOM',
}

export enum ResponseType {
  JSON = 'JSON',
  XML = 'XML',
  HTML = 'HTML',
  TEXT = 'TEXT',
  BINARY = 'BINARY',
  STREAM = 'STREAM',
  FILE = 'FILE',
}

export enum ApiModule {
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

export enum ApiGroup {
  CORE = 'CORE',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  WEBHOOK = 'WEBHOOK',
  CALLBACK = 'CALLBACK',
}

// ========== 导出接口类型 ==========

export interface ApiEndpoint {
  id: string
  path: string
  method: HttpMethod
  name: string
  summary: string
  description?: string
  module: ApiModule
  group: ApiGroup
  tags: string[]
  status: ApiStatus
  version: string
  deprecated?: boolean
  deprecatedSince?: string
  replacedBy?: string
  auth: AuthType
  authConfig?: AuthConfig
  params: ApiParam[]
  requestBody?: RequestBody
  responses: ApiResponse[]
  examples?: ApiExample[]
  errorCode?: ApiError[]
  rateLimit?: RateLimitConfig
  timeout?: number
  cache?: CacheConfig
  sortOrder: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
  lastTestedAt?: Date
  testResult?: TestResult
}

// API参数定义
export interface ApiParam {
  name: string
  location: ParamLocation
  type: ParamType
  description?: string
  required: boolean
  defaultValue?: any
  minValue?: number
  maxValue?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  enum?: string[]
  example?: any
  schema?: string
  ref?: string
}

// 请求体定义
export interface RequestBody {
  description?: string
  required: boolean
  contentType: string
  schema?: string
  example?: any
  examples?: Record<string, any>
}

// 响应定义
export interface ApiResponse {
  statusCode: number
  description: string
  contentType: ResponseType
  schema?: string
  example?: any
  headers?: Record<string, string>
}

// API示例定义
export interface ApiExample {
  name: string
  summary: string
  description?: string
  value: any
  language?: string
}

// API错误定义
export interface ApiError {
  code: string
  message: string
  description?: string
  httpStatus: number
  solution?: string
}

// 认证配置定义
export interface AuthConfig {
  headerName?: string
  paramName?: string
  paramLocation?: ParamLocation
  scopes?: string[]
  flow?: string
  tokenUrl?: string
  authorizationUrl?: string
  refreshUrl?: string
}

// 限流配置定义
export interface RateLimitConfig {
  enabled: boolean
  limit: number
  window: number
  unit: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'
}

// 缓存配置定义
export interface CacheConfig {
  enabled: boolean
  ttl: number
  strategy: 'PUBLIC' | 'PRIVATE' | 'NO_CACHE'
}

// 测试结果定义
export interface TestResult {
  success: boolean
  statusCode?: number
  responseTime?: number
  responseBody?: string
  error?: string
  testedAt: Date
  testedBy: string
}

export interface ApiVersion {
  id: string
  version: string
  baseVersion?: string
  description: string
  changes: ApiChange[]
  endpoints: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED' | 'ARCHIVED'
  releaseDate?: Date
  deprecateDate?: Date
  createdBy: string
  createdAt: Date
  publishedAt?: Date
}

export interface ApiChange {
  type: 'ADD' | 'UPDATE' | 'DELETE' | 'DEPRECATE'
  endpointId: string
  endpointPath: string
  endpointMethod: HttpMethod
  oldValue?: any
  newValue?: any
  reason?: string
  changedAt: Date
}

export interface ApiCategory {
  id: string
  code: string
  name: string
  module: ApiModule
  group: ApiGroup
  parentCode?: string
  description?: string
  icon?: string
  sortOrder: number
  endpointCount: number
}

// API调用统计定义
export interface ApiCallStats {
  endpointId: string
  date: string
  totalCalls: number
  successCalls: number
  failedCalls: number
  avgResponseTime: number
  maxResponseTime: number
  minResponseTime: number
  p50ResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
  errorCodes: Record<string, number>
  topUsers: string[]
  topClients: string[]
}

// API文档导出配置
export interface ExportConfig {
  format: 'OPENAPI_3_0' | 'OPENAPI_3_1' | 'SWAGGER_2_0' | 'MARKDOWN' | 'HTML' | 'PDF'
  module?: ApiModule
  group?: ApiGroup
  status?: ApiStatus
  includeDeprecated: boolean
  includeExamples: boolean
  includeStats: boolean
}

// API测试请求定义
export interface TestRequest {
  endpointId: string
  baseUrl: string
  params: Record<string, any>
  headers: Record<string, string>
  body?: any
  authType?: AuthType
  authValue?: string
}

@Injectable()
export class ApiDocCenterService {
  // API接口存储
  private endpoints: Map<string, ApiEndpoint> = new Map()

  // API版本存储
  private versions: Map<string, ApiVersion> = new Map()

  // API分类存储
  private categories: Map<string, ApiCategory> = new Map()

  // API调用统计存储
  private callStats: Map<string, ApiCallStats[]> = new Map()

  constructor() {
    this.initDefaultEndpoints()
    this.initDefaultVersions()
    this.initDefaultCategories()
    this.initSampleCallStats()
  }

  // 初始化默认API接口
  private initDefaultEndpoints() {
    const defaultEndpoints: ApiEndpoint[] = [
      // ========== AUTH 模块 API ==========
      {
        id: 'API-AUTH-001',
        path: '/auth/login',
        method: HttpMethod.POST,
        name: '用户登录',
        summary: '用户登录认证接口',
        description: '使用用户名密码进行登录，返回JWT token',
        module: ApiModule.AUTH,
        group: ApiGroup.PUBLIC,
        tags: ['认证', '登录'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.NONE,
        params: [],
        requestBody: {
          required: true,
          contentType: 'application/json',
          schema: 'LoginRequest',
          example: { username: 'admin', password: 'password123' },
        },
        responses: [
          {
            statusCode: 200,
            description: '登录成功',
            contentType: ResponseType.JSON,
            example: { token: 'eyJhbGciOiJIUzI1NiIs...', user: { id: 1, name: 'Admin' } },
          },
          {
            statusCode: 401,
            description: '认证失败',
            contentType: ResponseType.JSON,
            example: { error: 'INVALID_CREDENTIALS', message: '用户名或密码错误' },
          },
        ],
        examples: [
          {
            name: '管理员登录',
            summary: '管理员账号登录示例',
            value: { username: 'admin', password: 'admin123' },
          },
        ],
        errorCode: [
          {
            code: 'INVALID_CREDENTIALS',
            message: '认证失败',
            httpStatus: 401,
            solution: '检查用户名密码是否正确',
          },
          {
            code: 'ACCOUNT_DISABLED',
            message: '账号已禁用',
            httpStatus: 403,
            solution: '联系管理员启用账号',
          },
        ],
        rateLimit: { enabled: true, limit: 10, window: 1, unit: 'MINUTE' },
        timeout: 5000,
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-AUTH-002',
        path: '/auth/logout',
        method: HttpMethod.POST,
        name: '用户登出',
        summary: '用户登出接口',
        description: '清除用户会话，失效JWT token',
        module: ApiModule.AUTH,
        group: ApiGroup.CORE,
        tags: ['认证', '登出'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [],
        responses: [
          {
            statusCode: 200,
            description: '登出成功',
            contentType: ResponseType.JSON,
            example: { message: 'Logged out successfully' },
          },
        ],
        sortOrder: 2,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-AUTH-003',
        path: '/auth/refresh',
        method: HttpMethod.POST,
        name: '刷新Token',
        summary: '刷新JWT Token',
        description: '使用refresh token获取新的access token',
        module: ApiModule.AUTH,
        group: ApiGroup.CORE,
        tags: ['认证', 'Token'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [],
        requestBody: {
          required: true,
          contentType: 'application/json',
          example: { refreshToken: 'eyJhbGciOiJIUzI1NiIs...' },
        },
        responses: [
          {
            statusCode: 200,
            description: '刷新成功',
            contentType: ResponseType.JSON,
            example: { token: 'eyJhbGciOiJIUzI1NiIs...', expiresIn: 3600 },
          },
          {
            statusCode: 401,
            description: 'Token无效',
            contentType: ResponseType.JSON,
            example: { error: 'INVALID_TOKEN' },
          },
        ],
        sortOrder: 3,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-AUTH-004',
        path: '/auth/password/reset',
        method: HttpMethod.POST,
        name: '重置密码',
        summary: '请求重置密码',
        description: '发送密码重置邮件',
        module: ApiModule.AUTH,
        group: ApiGroup.PUBLIC,
        tags: ['认证', '密码'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.NONE,
        params: [],
        requestBody: {
          required: true,
          contentType: 'application/json',
          example: { email: 'user@example.com' },
        },
        responses: [
          {
            statusCode: 200,
            description: '邮件已发送',
            contentType: ResponseType.JSON,
            example: { message: 'Password reset email sent' },
          },
        ],
        sortOrder: 4,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== CRM 模块 API ==========
      {
        id: 'API-CRM-001',
        path: '/customers',
        method: HttpMethod.GET,
        name: '获取客户列表',
        summary: '分页获取客户列表',
        description: '支持多条件筛选、排序、分页',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['客户', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'page',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            description: '页码',
            required: false,
            defaultValue: 1,
            minValue: 1,
          },
          {
            name: 'pageSize',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            description: '每页数量',
            required: false,
            defaultValue: 20,
            minValue: 1,
            maxValue: 100,
          },
          {
            name: 'keyword',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '搜索关键词',
            required: false,
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '客户状态',
            required: false,
            enum: ['POTENTIAL', 'ACTIVE', 'VIP', 'CHURNED'],
          },
          {
            name: 'type',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '客户类型',
            required: false,
            enum: ['ENTERPRISE', 'INDIVIDUAL'],
          },
          {
            name: 'level',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '客户等级',
            required: false,
            enum: ['A', 'B', 'C', 'D'],
          },
          {
            name: 'industry',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '行业',
            required: false,
          },
          {
            name: 'region',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '区域',
            required: false,
          },
          {
            name: 'sortField',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '排序字段',
            required: false,
            enum: ['name', 'createdAt', 'amount', 'level'],
          },
          {
            name: 'sortOrder',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            description: '排序方向',
            required: false,
            enum: ['asc', 'desc'],
            defaultValue: 'desc',
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: '成功',
            contentType: ResponseType.JSON,
            example: {
              list: [{ id: 1, name: '客户A', status: 'ACTIVE' }],
              total: 100,
              page: 1,
              pageSize: 20,
            },
          },
        ],
        rateLimit: { enabled: true, limit: 100, window: 1, unit: 'MINUTE' },
        timeout: 10000,
        cache: { enabled: true, ttl: 60, strategy: 'PRIVATE' },
        sortOrder: 5,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CRM-002',
        path: '/customers/{id}',
        method: HttpMethod.GET,
        name: '获取客户详情',
        summary: '根据ID获取客户详细信息',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['客户', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'id',
            location: ParamLocation.PATH,
            type: ParamType.INTEGER,
            description: '客户ID',
            required: true,
            minValue: 1,
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: '成功',
            contentType: ResponseType.JSON,
            example: { id: 1, name: '客户A', status: 'ACTIVE', contacts: [], orders: [] },
          },
          {
            statusCode: 404,
            description: '客户不存在',
            contentType: ResponseType.JSON,
            example: { error: 'NOT_FOUND' },
          },
        ],
        sortOrder: 6,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CRM-003',
        path: '/customers',
        method: HttpMethod.POST,
        name: '创建客户',
        summary: '创建新客户',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['客户', '创建'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [],
        requestBody: {
          required: true,
          contentType: 'application/json',
          example: {
            name: '新客户',
            type: 'ENTERPRISE',
            industry: 'IT',
            region: 'SC',
            contacts: [{ name: '联系人', phone: '13800138000' }],
          },
        },
        responses: [
          {
            statusCode: 201,
            description: '创建成功',
            contentType: ResponseType.JSON,
            example: { id: 100, name: '新客户' },
          },
          {
            statusCode: 400,
            description: '参数错误',
            contentType: ResponseType.JSON,
            example: { error: 'VALIDATION_ERROR', fields: ['name'] },
          },
        ],
        sortOrder: 7,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CRM-004',
        path: '/customers/{id}',
        method: HttpMethod.PUT,
        name: '更新客户',
        summary: '更新客户信息',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['客户', '更新'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'id',
            location: ParamLocation.PATH,
            type: ParamType.INTEGER,
            description: '客户ID',
            required: true,
          },
        ],
        requestBody: {
          required: true,
          contentType: 'application/json',
          example: { name: '更新后的客户', status: 'VIP' },
        },
        responses: [
          {
            statusCode: 200,
            description: '更新成功',
            contentType: ResponseType.JSON,
            example: { id: 100, name: '更新后的客户' },
          },
          { statusCode: 404, description: '客户不存在', contentType: ResponseType.JSON },
        ],
        sortOrder: 8,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CRM-005',
        path: '/customers/{id}',
        method: HttpMethod.DELETE,
        name: '删除客户',
        summary: '删除客户',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['客户', '删除'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'id',
            location: ParamLocation.PATH,
            type: ParamType.INTEGER,
            description: '客户ID',
            required: true,
          },
        ],
        responses: [
          { statusCode: 204, description: '删除成功', contentType: ResponseType.JSON },
          { statusCode: 404, description: '客户不存在', contentType: ResponseType.JSON },
        ],
        sortOrder: 9,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CRM-006',
        path: '/leads',
        method: HttpMethod.GET,
        name: '获取线索列表',
        summary: '分页获取线索列表',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['线索', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'page',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
            defaultValue: 1,
          },
          {
            name: 'pageSize',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
            defaultValue: 20,
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'],
          },
          {
            name: 'source',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: '成功',
            contentType: ResponseType.JSON,
            example: { list: [], total: 50 },
          },
        ],
        sortOrder: 10,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CRM-007',
        path: '/opportunities',
        method: HttpMethod.GET,
        name: '获取商机列表',
        summary: '分页获取商机列表',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['商机', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'page',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
            defaultValue: 1,
          },
          {
            name: 'stage',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['PROPOSAL', 'NEGOTIATION', 'CLOSED_WIN', 'CLOSED_LOSS'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 11,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CRM-008',
        path: '/orders',
        method: HttpMethod.GET,
        name: '获取订单列表',
        summary: '分页获取订单列表',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        tags: ['订单', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'page',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
            defaultValue: 1,
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['DRAFT', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'COMPLETED'],
          },
          {
            name: 'customerId',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 12,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== ERP 模块 API ==========
      {
        id: 'API-ERP-001',
        path: '/products',
        method: HttpMethod.GET,
        name: '获取产品列表',
        summary: '分页获取产品列表',
        module: ApiModule.ERP,
        group: ApiGroup.BUSINESS,
        tags: ['产品', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'page',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
            defaultValue: 1,
          },
          {
            name: 'category',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 13,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-ERP-002',
        path: '/inventory',
        method: HttpMethod.GET,
        name: '获取库存列表',
        summary: '分页获取库存列表',
        module: ApiModule.ERP,
        group: ApiGroup.BUSINESS,
        tags: ['库存', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'productId',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
          {
            name: 'warehouseId',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['NORMAL', 'LOW', 'CRITICAL', 'OVERSTOCK'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 14,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-ERP-003',
        path: '/purchase/orders',
        method: HttpMethod.GET,
        name: '获取采购订单列表',
        summary: '分页获取采购订单',
        module: ApiModule.ERP,
        group: ApiGroup.BUSINESS,
        tags: ['采购', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['PENDING', 'APPROVED', 'PROCESSING', 'RECEIVED'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 15,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-ERP-004',
        path: '/production/orders',
        method: HttpMethod.GET,
        name: '获取生产订单列表',
        summary: '分页获取生产订单',
        module: ApiModule.ERP,
        group: ApiGroup.BUSINESS,
        tags: ['生产', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 16,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== Finance 模块 API ==========
      {
        id: 'API-FIN-001',
        path: '/invoices',
        method: HttpMethod.GET,
        name: '获取发票列表',
        summary: '分页获取发票列表',
        module: ApiModule.FINANCE,
        group: ApiGroup.BUSINESS,
        tags: ['发票', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED'],
          },
          {
            name: 'customerId',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 17,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-FIN-002',
        path: '/receivables',
        method: HttpMethod.GET,
        name: '获取应收账款列表',
        summary: '分页获取应收账款',
        module: ApiModule.FINANCE,
        group: ApiGroup.BUSINESS,
        tags: ['应收', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 18,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-FIN-003',
        path: '/payables',
        method: HttpMethod.GET,
        name: '获取应付账款列表',
        summary: '分页获取应付账款',
        module: ApiModule.FINANCE,
        group: ApiGroup.BUSINESS,
        tags: ['应付', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 19,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== HR 模块 API ==========
      {
        id: 'API-HR-001',
        path: '/employees',
        method: HttpMethod.GET,
        name: '获取员工列表',
        summary: '分页获取员工列表',
        module: ApiModule.HR,
        group: ApiGroup.BUSINESS,
        tags: ['员工', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['ACTIVE', 'INACTIVE', 'RESIGNED', 'RETIRED'],
          },
          {
            name: 'departmentId',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 20,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-HR-002',
        path: '/attendance',
        method: HttpMethod.GET,
        name: '获取考勤记录',
        summary: '分页获取考勤记录',
        module: ApiModule.HR,
        group: ApiGroup.BUSINESS,
        tags: ['考勤', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'employeeId',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
          {
            name: 'startDate',
            location: ParamLocation.QUERY,
            type: ParamType.DATE,
            required: false,
          },
          { name: 'endDate', location: ParamLocation.QUERY, type: ParamType.DATE, required: false },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 21,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-HR-003',
        path: '/salary',
        method: HttpMethod.GET,
        name: '获取薪资记录',
        summary: '分页获取薪资记录',
        module: ApiModule.HR,
        group: ApiGroup.BUSINESS,
        tags: ['薪资', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'employeeId',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
          { name: 'year', location: ParamLocation.QUERY, type: ParamType.INTEGER, required: false },
          {
            name: 'month',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 22,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== Service 模块 API ==========
      {
        id: 'API-SVC-001',
        path: '/tickets',
        method: HttpMethod.GET,
        name: '获取工单列表',
        summary: '分页获取工单列表',
        module: ApiModule.SERVICE,
        group: ApiGroup.BUSINESS,
        tags: ['工单', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['NEW', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
          },
          {
            name: 'priority',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['P1', 'P2', 'P3', 'P4', 'P5'],
          },
          {
            name: 'type',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['INCIDENT', 'PROBLEM', 'REQUEST', 'CHANGE'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 23,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-SVC-002',
        path: '/contracts',
        method: HttpMethod.GET,
        name: '获取合同列表',
        summary: '分页获取服务合同',
        module: ApiModule.SERVICE,
        group: ApiGroup.BUSINESS,
        tags: ['合同', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['ACTIVE', 'EXPIRED', 'TERMINATED'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 24,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== CMS 模块 API ==========
      {
        id: 'API-CMS-001',
        path: '/articles',
        method: HttpMethod.GET,
        name: '获取文章列表',
        summary: '分页获取文章列表',
        module: ApiModule.CMS,
        group: ApiGroup.PUBLIC,
        tags: ['文章', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.NONE,
        params: [
          {
            name: 'category',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['PUBLISHED', 'DRAFT'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 25,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CMS-002',
        path: '/cases',
        method: HttpMethod.GET,
        name: '获取案例列表',
        summary: '分页获取案例列表',
        module: ApiModule.CMS,
        group: ApiGroup.PUBLIC,
        tags: ['案例', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.NONE,
        params: [
          {
            name: 'industry',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 26,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== Workflow 模块 API ==========
      {
        id: 'API-WF-001',
        path: '/workflows',
        method: HttpMethod.GET,
        name: '获取流程列表',
        summary: '分页获取流程定义',
        module: ApiModule.WORKFLOW,
        group: ApiGroup.BUSINESS,
        tags: ['流程', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['ACTIVE', 'INACTIVE', 'DRAFT'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 27,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-WF-002',
        path: '/workflows/{id}/instances',
        method: HttpMethod.GET,
        name: '获取流程实例',
        summary: '获取流程实例列表',
        module: ApiModule.WORKFLOW,
        group: ApiGroup.BUSINESS,
        tags: ['流程', '实例'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          { name: 'id', location: ParamLocation.PATH, type: ParamType.INTEGER, required: true },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 28,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== Settings 模块 API ==========
      {
        id: 'API-SET-001',
        path: '/users',
        method: HttpMethod.GET,
        name: '获取用户列表',
        summary: '分页获取用户列表',
        module: ApiModule.SETTINGS,
        group: ApiGroup.ADMIN,
        tags: ['用户', '管理'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'page',
            location: ParamLocation.QUERY,
            type: ParamType.INTEGER,
            required: false,
            defaultValue: 1,
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['ACTIVE', 'INACTIVE', 'LOCKED'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 29,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-SET-002',
        path: '/roles',
        method: HttpMethod.GET,
        name: '获取角色列表',
        summary: '分页获取角色列表',
        module: ApiModule.SETTINGS,
        group: ApiGroup.ADMIN,
        tags: ['角色', '管理'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 30,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-SET-003',
        path: '/permissions',
        method: HttpMethod.GET,
        name: '获取权限列表',
        summary: '获取所有权限定义',
        module: ApiModule.SETTINGS,
        group: ApiGroup.ADMIN,
        tags: ['权限', '管理'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 31,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== System 模块 API ==========
      {
        id: 'API-SYS-001',
        path: '/system/health',
        method: HttpMethod.GET,
        name: '系统健康检查',
        summary: '检查系统运行状态',
        module: ApiModule.SYSTEM,
        group: ApiGroup.INTERNAL,
        tags: ['系统', '监控'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.NONE,
        params: [],
        responses: [
          {
            statusCode: 200,
            description: '健康',
            contentType: ResponseType.JSON,
            example: { status: 'UP', version: '1.0.0', uptime: 86400 },
          },
        ],
        sortOrder: 32,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-SYS-002',
        path: '/system/version',
        method: HttpMethod.GET,
        name: '获取系统版本',
        summary: '获取系统版本信息',
        module: ApiModule.SYSTEM,
        group: ApiGroup.INTERNAL,
        tags: ['系统', '信息'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.NONE,
        params: [],
        responses: [
          {
            statusCode: 200,
            description: '成功',
            contentType: ResponseType.JSON,
            example: { version: '1.0.0', build: '20260101', env: 'production' },
          },
        ],
        sortOrder: 33,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-SYS-003',
        path: '/system/logs',
        method: HttpMethod.GET,
        name: '获取系统日志',
        summary: '分页获取系统日志',
        module: ApiModule.SYSTEM,
        group: ApiGroup.ADMIN,
        tags: ['系统', '日志'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'level',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
          },
          {
            name: 'startDate',
            location: ParamLocation.QUERY,
            type: ParamType.DATETIME,
            required: false,
          },
          {
            name: 'endDate',
            location: ParamLocation.QUERY,
            type: ParamType.DATETIME,
            required: false,
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 34,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== External/Webhook API ==========
      {
        id: 'API-EXT-001',
        path: '/webhooks/{event}',
        method: HttpMethod.POST,
        name: 'Webhook回调',
        summary: '接收外部Webhook事件',
        module: ApiModule.EXTERNAL,
        group: ApiGroup.WEBHOOK,
        tags: ['Webhook', '回调'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.API_KEY,
        authConfig: { headerName: 'X-Webhook-Key' },
        params: [
          {
            name: 'event',
            location: ParamLocation.PATH,
            type: ParamType.STRING,
            required: true,
            enum: ['payment', 'order', 'shipping', 'customer'],
          },
        ],
        requestBody: {
          required: true,
          contentType: 'application/json',
          description: 'Webhook事件数据',
        },
        responses: [
          {
            statusCode: 200,
            description: '处理成功',
            contentType: ResponseType.JSON,
            example: { received: true, eventId: 'evt-001' },
          },
          { statusCode: 400, description: '数据无效', contentType: ResponseType.JSON },
        ],
        sortOrder: 35,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-EXT-002',
        path: '/callback/{provider}',
        method: HttpMethod.POST,
        name: 'OAuth回调',
        summary: 'OAuth认证回调接口',
        module: ApiModule.EXTERNAL,
        group: ApiGroup.CALLBACK,
        tags: ['OAuth', '回调'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.NONE,
        params: [
          {
            name: 'provider',
            location: ParamLocation.PATH,
            type: ParamType.STRING,
            required: true,
            enum: ['wechat', 'dingtalk', 'feishu'],
          },
          { name: 'code', location: ParamLocation.QUERY, type: ParamType.STRING, required: true },
          { name: 'state', location: ParamLocation.QUERY, type: ParamType.STRING, required: false },
        ],
        responses: [
          { statusCode: 200, description: '认证成功', contentType: ResponseType.JSON },
          { statusCode: 401, description: '认证失败', contentType: ResponseType.JSON },
        ],
        sortOrder: 36,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== Common 模块 API ==========
      {
        id: 'API-CMN-001',
        path: '/common/dictionary/{code}',
        method: HttpMethod.GET,
        name: '获取字典项',
        summary: '根据编码获取字典项',
        module: ApiModule.COMMON,
        group: ApiGroup.PUBLIC,
        tags: ['字典', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'code',
            location: ParamLocation.PATH,
            type: ParamType.STRING,
            required: true,
            example: 'STATUS_CUSTOMER',
          },
        ],
        responses: [
          {
            statusCode: 200,
            description: '成功',
            contentType: ResponseType.JSON,
            example: { code: 'STATUS_CUSTOMER', options: [{ code: 'ACTIVE', name: '活跃' }] },
          },
        ],
        sortOrder: 37,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CMN-002',
        path: '/common/messages',
        method: HttpMethod.GET,
        name: '获取消息列表',
        summary: '分页获取消息列表',
        module: ApiModule.COMMON,
        group: ApiGroup.BUSINESS,
        tags: ['消息', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'type',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['SYSTEM', 'TASK', 'ALERT', 'APPROVAL'],
          },
          {
            name: 'status',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['UNREAD', 'READ', 'ARCHIVED'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 38,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'API-CMN-003',
        path: '/common/reports',
        method: HttpMethod.GET,
        name: '获取报表列表',
        summary: '分页获取报表模板',
        module: ApiModule.COMMON,
        group: ApiGroup.BUSINESS,
        tags: ['报表', '查询'],
        status: ApiStatus.ACTIVE,
        version: '1.0',
        auth: AuthType.BEARER,
        params: [
          {
            name: 'module',
            location: ParamLocation.QUERY,
            type: ParamType.STRING,
            required: false,
            enum: ['CRM', 'ERP', 'FINANCE', 'HR'],
          },
        ],
        responses: [{ statusCode: 200, description: '成功', contentType: ResponseType.JSON }],
        sortOrder: 39,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]

    defaultEndpoints.forEach((ep) => this.endpoints.set(ep.id, ep))
  }

  // 初始化默认版本
  private initDefaultVersions() {
    const defaultVersions: ApiVersion[] = [
      {
        id: 'VER-API-001',
        version: '1.0',
        description: '初始API版本，包含核心接口',
        changes: [],
        endpoints: ['API-AUTH-001', 'API-CRM-001', 'API-ERP-001'],
        status: 'PUBLISHED',
        releaseDate: new Date('2026-01-01'),
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        publishedAt: new Date('2026-01-01'),
      },
      {
        id: 'VER-API-002',
        version: '1.1',
        baseVersion: '1.0',
        description: '新增Service和CMS模块API',
        changes: [
          {
            type: 'ADD',
            endpointId: 'API-SVC-001',
            endpointPath: '/tickets',
            endpointMethod: HttpMethod.GET,
            newValue: '工单列表API',
            changedAt: new Date('2026-03-01'),
          },
          {
            type: 'ADD',
            endpointId: 'API-CMS-001',
            endpointPath: '/articles',
            endpointMethod: HttpMethod.GET,
            newValue: '文章列表API',
            changedAt: new Date('2026-03-01'),
          },
        ],
        endpoints: ['API-SVC-001', 'API-SVC-002', 'API-CMS-001', 'API-CMS-002'],
        status: 'PUBLISHED',
        releaseDate: new Date('2026-03-01'),
        createdBy: 'admin',
        createdAt: new Date('2026-03-01'),
        publishedAt: new Date('2026-03-01'),
      },
      {
        id: 'VER-API-003',
        version: '2.0',
        baseVersion: '1.1',
        description: '重大版本更新，新增Common模块和Webhook',
        changes: [
          {
            type: 'ADD',
            endpointId: 'API-CMN-001',
            endpointPath: '/common/dictionary/{code}',
            endpointMethod: HttpMethod.GET,
            newValue: '字典API',
            changedAt: new Date('2026-03-31'),
          },
          {
            type: 'ADD',
            endpointId: 'API-EXT-001',
            endpointPath: '/webhooks/{event}',
            endpointMethod: HttpMethod.POST,
            newValue: 'Webhook API',
            changedAt: new Date('2026-03-31'),
          },
          {
            type: 'UPDATE',
            endpointId: 'API-CRM-001',
            endpointPath: '/customers',
            endpointMethod: HttpMethod.GET,
            oldValue: '无缓存',
            newValue: '增加缓存配置',
            changedAt: new Date('2026-03-31'),
          },
        ],
        endpoints: ['API-CMN-001', 'API-CMN-002', 'API-CMN-003', 'API-EXT-001', 'API-EXT-002'],
        status: 'DRAFT',
        createdBy: 'admin',
        createdAt: new Date('2026-03-31'),
      },
    ]

    defaultVersions.forEach((v) => this.versions.set(v.id, v))
  }

  // 初始化默认分类
  private initDefaultCategories() {
    const defaultCategories: ApiCategory[] = [
      {
        id: 'CAT-AUTH',
        code: 'AUTH',
        name: '认证模块',
        module: ApiModule.AUTH,
        group: ApiGroup.CORE,
        sortOrder: 1,
        endpointCount: 4,
      },
      {
        id: 'CAT-CRM',
        code: 'CRM',
        name: 'CRM模块',
        module: ApiModule.CRM,
        group: ApiGroup.BUSINESS,
        sortOrder: 2,
        endpointCount: 8,
      },
      {
        id: 'CAT-ERP',
        code: 'ERP',
        name: 'ERP模块',
        module: ApiModule.ERP,
        group: ApiGroup.BUSINESS,
        sortOrder: 3,
        endpointCount: 4,
      },
      {
        id: 'CAT-FIN',
        code: 'FINANCE',
        name: '财务模块',
        module: ApiModule.FINANCE,
        group: ApiGroup.BUSINESS,
        sortOrder: 4,
        endpointCount: 3,
      },
      {
        id: 'CAT-HR',
        code: 'HR',
        name: 'HR模块',
        module: ApiModule.HR,
        group: ApiGroup.BUSINESS,
        sortOrder: 5,
        endpointCount: 3,
      },
      {
        id: 'CAT-SVC',
        code: 'SERVICE',
        name: '服务模块',
        module: ApiModule.SERVICE,
        group: ApiGroup.BUSINESS,
        sortOrder: 6,
        endpointCount: 2,
      },
      {
        id: 'CAT-CMS',
        code: 'CMS',
        name: 'CMS模块',
        module: ApiModule.CMS,
        group: ApiGroup.PUBLIC,
        sortOrder: 7,
        endpointCount: 2,
      },
      {
        id: 'CAT-WF',
        code: 'WORKFLOW',
        name: '流程模块',
        module: ApiModule.WORKFLOW,
        group: ApiGroup.BUSINESS,
        sortOrder: 8,
        endpointCount: 2,
      },
      {
        id: 'CAT-SET',
        code: 'SETTINGS',
        name: '设置模块',
        module: ApiModule.SETTINGS,
        group: ApiGroup.ADMIN,
        sortOrder: 9,
        endpointCount: 3,
      },
      {
        id: 'CAT-SYS',
        code: 'SYSTEM',
        name: '系统模块',
        module: ApiModule.SYSTEM,
        group: ApiGroup.INTERNAL,
        sortOrder: 10,
        endpointCount: 3,
      },
      {
        id: 'CAT-EXT',
        code: 'EXTERNAL',
        name: '外部接口',
        module: ApiModule.EXTERNAL,
        group: ApiGroup.WEBHOOK,
        sortOrder: 11,
        endpointCount: 2,
      },
      {
        id: 'CAT-CMN',
        code: 'COMMON',
        name: '通用模块',
        module: ApiModule.COMMON,
        group: ApiGroup.PUBLIC,
        sortOrder: 12,
        endpointCount: 3,
      },
    ]

    defaultCategories.forEach((c) => this.categories.set(c.id, c))
  }

  // 初始化示例调用统计
  private initSampleCallStats() {
    const today = new Date().toISOString().split('T')[0]

    const sampleStats: ApiCallStats[] = [
      {
        endpointId: 'API-CRM-001',
        date: today,
        totalCalls: 1250,
        successCalls: 1230,
        failedCalls: 20,
        avgResponseTime: 45,
        maxResponseTime: 200,
        minResponseTime: 10,
        p50ResponseTime: 40,
        p95ResponseTime: 80,
        p99ResponseTime: 150,
        errorCodes: { VALIDATION_ERROR: 10, NOT_FOUND: 10 },
        topUsers: ['user1', 'user2'],
        topClients: ['web', 'app'],
      },
      {
        endpointId: 'API-CRM-002',
        date: today,
        totalCalls: 800,
        successCalls: 795,
        failedCalls: 5,
        avgResponseTime: 30,
        maxResponseTime: 100,
        minResponseTime: 5,
        p50ResponseTime: 25,
        p95ResponseTime: 60,
        p99ResponseTime: 90,
        errorCodes: { NOT_FOUND: 5 },
        topUsers: ['user1'],
        topClients: ['web'],
      },
      {
        endpointId: 'API-AUTH-001',
        date: today,
        totalCalls: 500,
        successCalls: 480,
        failedCalls: 20,
        avgResponseTime: 100,
        maxResponseTime: 300,
        minResponseTime: 50,
        p50ResponseTime: 90,
        p95ResponseTime: 200,
        p99ResponseTime: 280,
        errorCodes: { INVALID_CREDENTIALS: 15, ACCOUNT_DISABLED: 5 },
        topUsers: [],
        topClients: ['web', 'app', 'api'],
      },
      {
        endpointId: 'API-ERP-001',
        date: today,
        totalCalls: 600,
        successCalls: 598,
        failedCalls: 2,
        avgResponseTime: 35,
        maxResponseTime: 120,
        minResponseTime: 15,
        p50ResponseTime: 30,
        p95ResponseTime: 70,
        p99ResponseTime: 110,
        errorCodes: { VALIDATION_ERROR: 2 },
        topUsers: ['user2'],
        topClients: ['web'],
      },
      {
        endpointId: 'API-SVC-001',
        date: today,
        totalCalls: 350,
        successCalls: 345,
        failedCalls: 5,
        avgResponseTime: 50,
        maxResponseTime: 150,
        minResponseTime: 20,
        p50ResponseTime: 45,
        p95ResponseTime: 100,
        p99ResponseTime: 140,
        errorCodes: { NOT_FOUND: 5 },
        topUsers: ['user3'],
        topClients: ['web'],
      },
    ]

    sampleStats.forEach((stat) => {
      const existing = this.callStats.get(stat.endpointId) || []
      existing.push(stat)
      this.callStats.set(stat.endpointId, existing)
    })
  }

  // ========== API接口管理 ==========

  async getEndpoints(params?: {
    module?: ApiModule
    group?: ApiGroup
    status?: ApiStatus
    method?: HttpMethod
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    let endpoints = Array.from(this.endpoints.values())

    // 筛选
    if (params?.module) endpoints = endpoints.filter((e) => e.module === params.module)
    if (params?.group) endpoints = endpoints.filter((e) => e.group === params.group)
    if (params?.status) endpoints = endpoints.filter((e) => e.status === params.status)
    if (params?.method) endpoints = endpoints.filter((e) => e.method === params.method)
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      endpoints = endpoints.filter(
        (e) =>
          e.path.toLowerCase().includes(kw) ||
          e.name.toLowerCase().includes(kw) ||
          e.summary.toLowerCase().includes(kw) ||
          (e.description && e.description.toLowerCase().includes(kw)),
      )
    }

    // 排序
    endpoints.sort((a, b) => a.sortOrder - b.sortOrder || a.path.localeCompare(b.path))

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = endpoints.length
    const list = endpoints.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  async getEndpoint(id: string) {
    return this.endpoints.get(id)
  }

  async getEndpointByPath(path: string, method: HttpMethod) {
    return Array.from(this.endpoints.values()).find((e) => e.path === path && e.method === method)
  }

  async createEndpoint(endpoint: ApiEndpoint) {
    endpoint.id = `API-${Date.now()}`
    endpoint.createdAt = new Date()
    endpoint.updatedAt = new Date()
    endpoint.status = endpoint.status || ApiStatus.DRAFT
    endpoint.version = '1.0'
    this.endpoints.set(endpoint.id, endpoint)
    return endpoint
  }

  async updateEndpoint(id: string, updates: Partial<ApiEndpoint>) {
    const endpoint = this.endpoints.get(id)
    if (!endpoint) return null
    Object.assign(endpoint, updates, { updatedAt: new Date() })
    this.endpoints.set(id, endpoint)
    return endpoint
  }

  async deleteEndpoint(id: string) {
    const endpoint = this.endpoints.get(id)
    if (!endpoint) return false
    endpoint.status = ApiStatus.RETIRED
    this.endpoints.set(id, endpoint)
    return true
  }

  async deprecateEndpoint(id: string, replacedBy?: string) {
    const endpoint = this.endpoints.get(id)
    if (!endpoint) return null
    endpoint.status = ApiStatus.DEPRECATED
    endpoint.deprecated = true
    endpoint.deprecatedSince = new Date().toISOString().split('T')[0]
    endpoint.replacedBy = replacedBy
    this.endpoints.set(id, endpoint)
    return endpoint
  }

  // ========== API版本管理 ==========

  async getVersions() {
    return Array.from(this.versions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
  }

  async getVersion(id: string) {
    return this.versions.get(id)
  }

  async createVersion(version: ApiVersion) {
    version.id = `VER-API-${Date.now()}`
    version.createdAt = new Date()
    version.status = 'DRAFT'
    this.versions.set(version.id, version)
    return version
  }

  async publishVersion(id: string) {
    const version = this.versions.get(id)
    if (!version) return null
    version.status = 'PUBLISHED'
    version.publishedAt = new Date()
    version.releaseDate = new Date()
    this.versions.set(id, version)
    return version
  }

  async deprecateVersion(id: string, deprecateDate: Date) {
    const version = this.versions.get(id)
    if (!version) return null
    version.status = 'DEPRECATED'
    version.deprecateDate = deprecateDate
    this.versions.set(id, version)
    return version
  }

  // ========== API分类管理 ==========

  async getCategories() {
    return Array.from(this.categories.values()).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async getCategory(id: string) {
    return this.categories.get(id)
  }

  async createCategory(category: ApiCategory) {
    category.id = `CAT-${Date.now()}`
    this.categories.set(category.id, category)
    return category
  }

  // ========== API测试 ==========

  async testEndpoint(request: TestRequest) {
    const endpoint = this.endpoints.get(request.endpointId)
    if (!endpoint)
      return { success: false, error: '接口不存在', testedAt: new Date(), testedBy: 'system' }

    // 模拟测试结果
    const result: TestResult = {
      success: true,
      statusCode: 200,
      responseTime: Math.floor(Math.random() * 100) + 20,
      responseBody: JSON.stringify(endpoint.responses[0]?.example || {}),
      testedAt: new Date(),
      testedBy: 'tester',
    }

    endpoint.lastTestedAt = result.testedAt
    endpoint.testResult = result
    this.endpoints.set(endpoint.id, endpoint)

    return result
  }

  // ========== API调用统计 ==========

  async getCallStats(endpointId: string, startDate?: string, endDate?: string) {
    let stats = this.callStats.get(endpointId) || []

    if (startDate) stats = stats.filter((s) => s.date >= startDate)
    if (endDate) stats = stats.filter((s) => s.date <= endDate)

    return stats.sort((a, b) => b.date.localeCompare(a.date))
  }

  async getOverallStats(startDate?: string, endDate?: string) {
    let allStats: ApiCallStats[] = []
    this.callStats.forEach((stats) => allStats.push(...stats))

    if (startDate) allStats = allStats.filter((s) => s.date >= startDate)
    if (endDate) allStats = allStats.filter((s) => s.date <= endDate)

    return {
      totalCalls: allStats.reduce((sum, s) => sum + s.totalCalls, 0),
      successCalls: allStats.reduce((sum, s) => sum + s.successCalls, 0),
      failedCalls: allStats.reduce((sum, s) => sum + s.failedCalls, 0),
      avgResponseTime:
        allStats.length > 0
          ? allStats.reduce((sum, s) => sum + s.avgResponseTime, 0) / allStats.length
          : 0,
      errorCodes: this.aggregateErrorCodes(allStats),
      topEndpoints: this.getTopEndpoints(allStats),
    }
  }

  private aggregateErrorCodes(stats: ApiCallStats[]): Record<string, number> {
    const result: Record<string, number> = {}
    stats.forEach((s) => {
      Object.entries(s.errorCodes).forEach(([code, count]) => {
        result[code] = (result[code] || 0) + count
      })
    })
    return result
  }

  private getTopEndpoints(stats: ApiCallStats[]): string[] {
    const counts: Record<string, number> = {}
    stats.forEach((s) => {
      counts[s.endpointId] = (counts[s.endpointId] || 0) + s.totalCalls
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id)
  }

  // ========== OpenAPI导出 ==========

  async exportOpenApi(config: ExportConfig): Promise<string> {
    let endpoints = Array.from(this.endpoints.values())

    // 筛选
    if (config.module) endpoints = endpoints.filter((e) => e.module === config.module)
    if (config.group) endpoints = endpoints.filter((e) => e.group === config.group)
    if (config.status) endpoints = endpoints.filter((e) => e.status === config.status)
    if (!config.includeDeprecated) endpoints = endpoints.filter((e) => !e.deprecated)

    // 生成OpenAPI 3.0规范
    const openApi: any = {
      openapi: '3.0.0',
      info: {
        title: '道达智能数字化平台 API',
        version: '2.0.0',
        description: '道达智能数字化平台RESTful API文档',
        contact: { name: 'API Support', email: 'api@daoda.com' },
      },
      servers: [
        { url: 'https://api.daoda.com/v2', description: '生产环境' },
        { url: 'https://staging-api.daoda.com/v2', description: '测试环境' },
      ],
      paths: {},
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          apiKey: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
        },
      },
    }

    endpoints.forEach((ep) => {
      if (!openApi.paths[ep.path]) openApi.paths[ep.path] = {}

      const pathItem: any = {
        summary: ep.summary,
        description: ep.description,
        tags: ep.tags,
        deprecated: ep.deprecated || false,
      }

      // 参数
      const parameters = ep.params.map((p) => ({
        name: p.name,
        in: p.location.toLowerCase(),
        required: p.required,
        description: p.description,
        schema: this.getSchemaForParam(p),
        example: p.example,
      }))
      pathItem.parameters = parameters

      // 请求体
      if (ep.requestBody) {
        pathItem.requestBody = {
          required: ep.requestBody.required,
          description: ep.requestBody.description,
          content: {
            [ep.requestBody.contentType]: {
              schema: { type: 'object' },
              example: ep.requestBody.example,
            },
          },
        }
      }

      // 响应
      pathItem.responses = {}
      ep.responses.forEach((r) => {
        pathItem.responses[r.statusCode] = {
          description: r.description,
          content: {
            [this.getContentTypeString(r.contentType)]: {
              schema: { type: 'object' },
              example: r.example,
            },
          },
        }
      })

      // 安全配置
      if (ep.auth !== AuthType.NONE) {
        pathItem.security = [{ bearerAuth: [] }]
        if (ep.auth === AuthType.API_KEY) {
          pathItem.security = [{ apiKey: [] }]
        }
      }

      openApi.paths[ep.path][ep.method.toLowerCase()] = pathItem
    })

    return JSON.stringify(openApi, null, 2)
  }

  private getSchemaForParam(param: ApiParam): any {
    const typeMap: Record<ParamType, string> = {
      [ParamType.STRING]: 'string',
      [ParamType.INTEGER]: 'integer',
      [ParamType.NUMBER]: 'number',
      [ParamType.BOOLEAN]: 'boolean',
      [ParamType.ARRAY]: 'array',
      [ParamType.OBJECT]: 'object',
      [ParamType.FILE]: 'file',
      [ParamType.DATE]: 'string',
      [ParamType.DATETIME]: 'string',
      [ParamType.UUID]: 'string',
      [ParamType.EMAIL]: 'string',
      [ParamType.PHONE]: 'string',
      [ParamType.URL]: 'string',
    }

    const schema: any = { type: typeMap[param.type] || 'string' }

    if (param.enum) schema.enum = param.enum
    if (param.minValue !== undefined) schema.minimum = param.minValue
    if (param.maxValue !== undefined) schema.maximum = param.maxValue
    if (param.minLength !== undefined) schema.minLength = param.minLength
    if (param.maxLength !== undefined) schema.maxLength = param.maxLength
    if (param.pattern) schema.pattern = param.pattern

    return schema
  }

  private getContentTypeString(type: ResponseType): string {
    const typeMap: Record<ResponseType, string> = {
      [ResponseType.JSON]: 'application/json',
      [ResponseType.XML]: 'application/xml',
      [ResponseType.HTML]: 'text/html',
      [ResponseType.TEXT]: 'text/plain',
      [ResponseType.BINARY]: 'application/octet-stream',
      [ResponseType.STREAM]: 'application/octet-stream',
      [ResponseType.FILE]: 'application/octet-stream',
    }
    return typeMap[type] || 'application/json'
  }

  // ========== 统计分析 ==========

  async getStats() {
    const endpoints = Array.from(this.endpoints.values())
    return {
      totalEndpoints: endpoints.length,
      byModule: this.countByField(endpoints, 'module'),
      byMethod: this.countByField(endpoints, 'method'),
      byStatus: this.countByField(endpoints, 'status'),
      byGroup: this.countByField(endpoints, 'group'),
      activeEndpoints: endpoints.filter((e) => e.status === ApiStatus.ACTIVE).length,
      deprecatedEndpoints: endpoints.filter((e) => e.status === ApiStatus.DEPRECATED).length,
      totalCategories: this.categories.size,
      totalVersions: this.versions.size,
    }
  }

  private countByField(items: ApiEndpoint[], field: string): Record<string, number> {
    const result: Record<string, number> = {}
    items.forEach((item) => {
      const key = String((item as any)[field])
      result[key] = (result[key] || 0) + 1
    })
    return result
  }

  // ========== 搜索 ==========

  async search(keyword: string) {
    const kw = keyword.toLowerCase()
    const endpoints = Array.from(this.endpoints.values()).filter(
      (e) =>
        e.path.toLowerCase().includes(kw) ||
        e.name.toLowerCase().includes(kw) ||
        e.summary.toLowerCase().includes(kw) ||
        e.tags.some((t) => t.toLowerCase().includes(kw)),
    )
    return endpoints
  }
}
