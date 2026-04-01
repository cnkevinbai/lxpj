/**
 * 数据字典服务
 * 全局数据标准、枚举管理、字段定义、数据一致性保障
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum DictionaryType {
  FIELD = 'FIELD', // 字段定义
  ENUM = 'ENUM', // 枚举定义
  STATUS = 'STATUS', // 状态定义
  CATEGORY = 'CATEGORY', // 分类定义
  TYPE = 'TYPE', // 类型定义
  CODE = 'CODE', // 编码定义
  RULE = 'RULE', // 规则定义
  UNIT = 'UNIT', // 单位定义
  CURRENCY = 'CURRENCY', // 货币定义
  REGION = 'REGION', // 区域定义
  INDUSTRY = 'INDUSTRY', // 行业定义
  LEVEL = 'LEVEL', // 等级定义
  PRIORITY = 'PRIORITY', // 优先级定义
  SEVERITY = 'SEVERITY', // 严重程度定义
}

export enum DictionaryStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
  ARCHIVED = 'ARCHIVED',
}

export enum DataType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  JSON = 'JSON',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  ENUM = 'ENUM',
  UUID = 'UUID',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  URL = 'URL',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
}

export enum Module {
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
}

// 字典项接口
export interface DictionaryItem {
  id: string
  code: string
  name: string
  type: DictionaryType
  module: Module
  dataType?: DataType
  description?: string
  value?: any
  defaultValue?: any
  minValue?: number
  maxValue?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  required?: boolean
  unique?: boolean
  readonly?: boolean
  hidden?: boolean
  options?: DictionaryOption[]
  parentCode?: string
  children?: string[]
  tags?: string[]
  status: DictionaryStatus
  version: string
  sortOrder: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
  deprecatedAt?: Date
  replacedBy?: string
}

// 字典选项接口（用于枚举值）
export interface DictionaryOption {
  code: string
  name: string
  value: any
  description?: string
  color?: string
  icon?: string
  sortOrder: number
  enabled: boolean
  tags?: string[]
}

// 字典版本接口
export interface DictionaryVersion {
  id: string
  version: string
  description: string
  changes: DictionaryChange[]
  itemCount: number
  createdBy: string
  createdAt: Date
  publishedAt?: Date
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

// 字典变更接口
export interface DictionaryChange {
  type: 'ADD' | 'UPDATE' | 'DELETE' | 'DEPRECATE'
  itemId: string
  itemCode: string
  oldValue?: any
  newValue?: any
  reason?: string
  changedAt: Date
}

// 字典分类接口
export interface DictionaryCategory {
  id: string
  code: string
  name: string
  module: Module
  parentCode?: string
  description?: string
  icon?: string
  sortOrder: number
  itemCount: number
}

// 字典引用接口
export interface DictionaryReference {
  id: string
  itemCode: string
  module: Module
  entityType: string
  entityField: string
  usageType: 'REFERENCE' | 'VALIDATION' | 'DEFAULT' | 'DISPLAY'
  required: boolean
  description?: string
}

// 字典导入结果接口
export interface ImportResult {
  total: number
  added: number
  updated: number
  skipped: number
  errors: number
  errorDetails?: string[]
}

// 字典导出配置接口
export interface ExportConfig {
  format: 'JSON' | 'YAML' | 'CSV' | 'EXCEL'
  module?: Module
  type?: DictionaryType
  status?: DictionaryStatus
  includeDeprecated: boolean
  includeChildren: boolean
}

@Injectable()
export class DataDictionaryService {
  // 字典项存储
  private items: Map<string, DictionaryItem> = new Map()

  // 字典版本存储
  private versions: Map<string, DictionaryVersion> = new Map()

  // 字典分类存储
  private categories: Map<string, DictionaryCategory> = new Map()

  // 字典引用存储
  private references: Map<string, DictionaryReference> = new Map()

  constructor() {
    this.initDefaultItems()
    this.initDefaultCategories()
    this.initSampleVersions()
    this.initSampleReferences()
  }

  // 初始化默认字典项
  private initDefaultItems() {
    const defaultItems: DictionaryItem[] = [
      // ========== 状态类字典 ==========
      {
        id: 'DICT-STATUS-001',
        code: 'STATUS_COMMON',
        name: '通用状态',
        type: DictionaryType.STATUS,
        module: Module.COMMON,
        dataType: DataType.ENUM,
        description: '系统中通用的状态枚举值',
        options: [
          { code: 'ACTIVE', name: '启用', value: 1, color: 'green', sortOrder: 1, enabled: true },
          {
            code: 'INACTIVE',
            name: '禁用',
            value: 0,
            color: 'default',
            sortOrder: 2,
            enabled: true,
          },
          { code: 'PENDING', name: '待处理', value: 2, color: 'blue', sortOrder: 3, enabled: true },
          { code: 'DELETED', name: '已删除', value: -1, color: 'red', sortOrder: 4, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-STATUS-002',
        code: 'STATUS_CUSTOMER',
        name: '客户状态',
        type: DictionaryType.STATUS,
        module: Module.CRM,
        dataType: DataType.ENUM,
        description: 'CRM模块客户状态枚举',
        options: [
          {
            code: 'POTENTIAL',
            name: '潜在客户',
            value: 10,
            color: 'blue',
            sortOrder: 1,
            enabled: true,
          },
          {
            code: 'ACTIVE',
            name: '活跃客户',
            value: 20,
            color: 'green',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'INACTIVE',
            name: '非活跃客户',
            value: 30,
            color: 'default',
            sortOrder: 3,
            enabled: true,
          },
          { code: 'VIP', name: 'VIP客户', value: 40, color: 'gold', sortOrder: 4, enabled: true },
          {
            code: 'CHURNED',
            name: '流失客户',
            value: 50,
            color: 'red',
            sortOrder: 5,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 2,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-STATUS-003',
        code: 'STATUS_LEAD',
        name: '线索状态',
        type: DictionaryType.STATUS,
        module: Module.CRM,
        dataType: DataType.ENUM,
        description: 'CRM模块线索状态枚举',
        options: [
          { code: 'NEW', name: '新线索', value: 1, color: 'blue', sortOrder: 1, enabled: true },
          {
            code: 'CONTACTED',
            name: '已联系',
            value: 2,
            color: 'cyan',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'QUALIFIED',
            name: '已验证',
            value: 3,
            color: 'green',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'CONVERTED',
            name: '已转化',
            value: 4,
            color: 'success',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'DISQUALIFIED',
            name: '不合格',
            value: 5,
            color: 'red',
            sortOrder: 5,
            enabled: true,
          },
          {
            code: 'CLOSED',
            name: '已关闭',
            value: 6,
            color: 'default',
            sortOrder: 6,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 3,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-STATUS-004',
        code: 'STATUS_ORDER',
        name: '订单状态',
        type: DictionaryType.STATUS,
        module: Module.CRM,
        dataType: DataType.ENUM,
        description: 'CRM模块订单状态枚举',
        options: [
          { code: 'DRAFT', name: '草稿', value: 10, color: 'default', sortOrder: 1, enabled: true },
          {
            code: 'PENDING',
            name: '待审核',
            value: 20,
            color: 'blue',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'CONFIRMED',
            name: '已确认',
            value: 30,
            color: 'cyan',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'PROCESSING',
            name: '处理中',
            value: 40,
            color: 'processing',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'SHIPPED',
            name: '已发货',
            value: 50,
            color: 'orange',
            sortOrder: 5,
            enabled: true,
          },
          {
            code: 'DELIVERED',
            name: '已交付',
            value: 60,
            color: 'green',
            sortOrder: 6,
            enabled: true,
          },
          {
            code: 'COMPLETED',
            name: '已完成',
            value: 70,
            color: 'success',
            sortOrder: 7,
            enabled: true,
          },
          {
            code: 'CANCELLED',
            name: '已取消',
            value: 80,
            color: 'red',
            sortOrder: 8,
            enabled: true,
          },
          {
            code: 'RETURNED',
            name: '已退货',
            value: 90,
            color: 'warning',
            sortOrder: 9,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 4,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-STATUS-005',
        code: 'STATUS_INVENTORY',
        name: '库存状态',
        type: DictionaryType.STATUS,
        module: Module.ERP,
        dataType: DataType.ENUM,
        description: 'ERP模块库存状态枚举',
        options: [
          { code: 'NORMAL', name: '正常', value: 1, color: 'green', sortOrder: 1, enabled: true },
          { code: 'LOW', name: '低库存', value: 2, color: 'orange', sortOrder: 2, enabled: true },
          {
            code: 'CRITICAL',
            name: '警戒库存',
            value: 3,
            color: 'red',
            sortOrder: 3,
            enabled: true,
          },
          { code: 'OVERSTOCK', name: '超储', value: 4, color: 'blue', sortOrder: 4, enabled: true },
          { code: 'LOCKED', name: '锁定', value: 5, color: 'default', sortOrder: 5, enabled: true },
          { code: 'RESERVED', name: '预留', value: 6, color: 'cyan', sortOrder: 6, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 5,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-STATUS-006',
        code: 'STATUS_WORKFLOW',
        name: '流程状态',
        type: DictionaryType.STATUS,
        module: Module.WORKFLOW,
        dataType: DataType.ENUM,
        description: 'Workflow模块流程状态枚举',
        options: [
          { code: 'DRAFT', name: '草稿', value: 10, color: 'default', sortOrder: 1, enabled: true },
          {
            code: 'PENDING',
            name: '待提交',
            value: 20,
            color: 'blue',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'SUBMITTED',
            name: '已提交',
            value: 30,
            color: 'cyan',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'APPROVED',
            name: '已审批',
            value: 40,
            color: 'green',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'REJECTED',
            name: '已拒绝',
            value: 50,
            color: 'red',
            sortOrder: 5,
            enabled: true,
          },
          {
            code: 'CANCELLED',
            name: '已取消',
            value: 60,
            color: 'warning',
            sortOrder: 6,
            enabled: true,
          },
          {
            code: 'COMPLETED',
            name: '已完成',
            value: 70,
            color: 'success',
            sortOrder: 7,
            enabled: true,
          },
          {
            code: 'ARCHIVED',
            name: '已归档',
            value: 80,
            color: 'default',
            sortOrder: 8,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 6,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-STATUS-007',
        code: 'STATUS_TICKET',
        name: '工单状态',
        type: DictionaryType.STATUS,
        module: Module.SERVICE,
        dataType: DataType.ENUM,
        description: 'Service模块工单状态枚举',
        options: [
          { code: 'NEW', name: '新建', value: 1, color: 'blue', sortOrder: 1, enabled: true },
          { code: 'OPEN', name: '待处理', value: 2, color: 'orange', sortOrder: 2, enabled: true },
          {
            code: 'ASSIGNED',
            name: '已分配',
            value: 3,
            color: 'cyan',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'IN_PROGRESS',
            name: '处理中',
            value: 4,
            color: 'processing',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'RESOLVED',
            name: '已解决',
            value: 5,
            color: 'green',
            sortOrder: 5,
            enabled: true,
          },
          {
            code: 'VERIFIED',
            name: '已验证',
            value: 6,
            color: 'success',
            sortOrder: 6,
            enabled: true,
          },
          {
            code: 'CLOSED',
            name: '已关闭',
            value: 7,
            color: 'default',
            sortOrder: 7,
            enabled: true,
          },
          {
            code: 'REOPENED',
            name: '重开',
            value: 8,
            color: 'warning',
            sortOrder: 8,
            enabled: true,
          },
          {
            code: 'CANCELLED',
            name: '已取消',
            value: 9,
            color: 'red',
            sortOrder: 9,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 7,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-STATUS-008',
        code: 'STATUS_CONTENT',
        name: '内容状态',
        type: DictionaryType.STATUS,
        module: Module.CMS,
        dataType: DataType.ENUM,
        description: 'CMS模块内容状态枚举',
        options: [
          { code: 'DRAFT', name: '草稿', value: 10, color: 'default', sortOrder: 1, enabled: true },
          {
            code: 'PENDING',
            name: '待审核',
            value: 20,
            color: 'blue',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'APPROVED',
            name: '已审核',
            value: 30,
            color: 'cyan',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'PUBLISHED',
            name: '已发布',
            value: 40,
            color: 'green',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'SCHEDULED',
            name: '定时发布',
            value: 50,
            color: 'orange',
            sortOrder: 5,
            enabled: true,
          },
          {
            code: 'UNPUBLISHED',
            name: '已下线',
            value: 60,
            color: 'warning',
            sortOrder: 6,
            enabled: true,
          },
          {
            code: 'ARCHIVED',
            name: '已归档',
            value: 70,
            color: 'default',
            sortOrder: 7,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 8,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 类型类字典 ==========
      {
        id: 'DICT-TYPE-001',
        code: 'TYPE_CUSTOMER',
        name: '客户类型',
        type: DictionaryType.TYPE,
        module: Module.CRM,
        dataType: DataType.ENUM,
        description: 'CRM模块客户类型分类',
        options: [
          {
            code: 'ENTERPRISE',
            name: '企业客户',
            value: 1,
            color: 'blue',
            sortOrder: 1,
            enabled: true,
          },
          {
            code: 'INDIVIDUAL',
            name: '个人客户',
            value: 2,
            color: 'cyan',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'GOVERNMENT',
            name: '政府客户',
            value: 3,
            color: 'gold',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'PARTNER',
            name: '合作伙伴',
            value: 4,
            color: 'green',
            sortOrder: 4,
            enabled: true,
          },
          { code: 'AGENT', name: '代理商', value: 5, color: 'purple', sortOrder: 5, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-TYPE-002',
        code: 'TYPE_PRODUCT',
        name: '产品类型',
        type: DictionaryType.TYPE,
        module: Module.ERP,
        dataType: DataType.ENUM,
        description: 'ERP模块产品类型分类',
        options: [
          {
            code: 'STANDARD',
            name: '标准产品',
            value: 1,
            color: 'blue',
            sortOrder: 1,
            enabled: true,
          },
          {
            code: 'CUSTOM',
            name: '定制产品',
            value: 2,
            color: 'purple',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'SERVICE',
            name: '服务产品',
            value: 3,
            color: 'cyan',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'BUNDLE',
            name: '套装产品',
            value: 4,
            color: 'green',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'VIRTUAL',
            name: '虚拟产品',
            value: 5,
            color: 'orange',
            sortOrder: 5,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 2,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-TYPE-003',
        code: 'TYPE_TASK',
        name: '任务类型',
        type: DictionaryType.TYPE,
        module: Module.COMMON,
        dataType: DataType.ENUM,
        description: '通用任务类型分类',
        options: [
          {
            code: 'TASK',
            name: '普通任务',
            value: 1,
            color: 'default',
            sortOrder: 1,
            enabled: true,
          },
          { code: 'MEETING', name: '会议', value: 2, color: 'blue', sortOrder: 2, enabled: true },
          { code: 'CALL', name: '电话', value: 3, color: 'cyan', sortOrder: 3, enabled: true },
          { code: 'EMAIL', name: '邮件', value: 4, color: 'green', sortOrder: 4, enabled: true },
          { code: 'VISIT', name: '拜访', value: 5, color: 'orange', sortOrder: 5, enabled: true },
          {
            code: 'DEADLINE',
            name: '截止日期',
            value: 6,
            color: 'red',
            sortOrder: 6,
            enabled: true,
          },
          {
            code: 'REMINDER',
            name: '提醒',
            value: 7,
            color: 'purple',
            sortOrder: 7,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 3,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-TYPE-004',
        code: 'TYPE_TICKET',
        name: '工单类型',
        type: DictionaryType.TYPE,
        module: Module.SERVICE,
        dataType: DataType.ENUM,
        description: 'Service模块工单类型分类',
        options: [
          { code: 'INCIDENT', name: '事故', value: 1, color: 'red', sortOrder: 1, enabled: true },
          { code: 'PROBLEM', name: '问题', value: 2, color: 'orange', sortOrder: 2, enabled: true },
          { code: 'REQUEST', name: '请求', value: 3, color: 'blue', sortOrder: 3, enabled: true },
          { code: 'CHANGE', name: '变更', value: 4, color: 'purple', sortOrder: 4, enabled: true },
          {
            code: 'COMPLAINT',
            name: '投诉',
            value: 5,
            color: 'error',
            sortOrder: 5,
            enabled: true,
          },
          { code: 'INQUIRY', name: '咨询', value: 6, color: 'cyan', sortOrder: 6, enabled: true },
          {
            code: 'MAINTENANCE',
            name: '维护',
            value: 7,
            color: 'green',
            sortOrder: 7,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 4,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 优先级类字典 ==========
      {
        id: 'DICT-PRIORITY-001',
        code: 'PRIORITY_COMMON',
        name: '通用优先级',
        type: DictionaryType.PRIORITY,
        module: Module.COMMON,
        dataType: DataType.ENUM,
        description: '系统中通用的优先级枚举',
        options: [
          { code: 'LOW', name: '低', value: 1, color: 'default', sortOrder: 1, enabled: true },
          { code: 'NORMAL', name: '普通', value: 2, color: 'blue', sortOrder: 2, enabled: true },
          { code: 'HIGH', name: '高', value: 3, color: 'orange', sortOrder: 3, enabled: true },
          { code: 'URGENT', name: '紧急', value: 4, color: 'red', sortOrder: 4, enabled: true },
          { code: 'CRITICAL', name: '严重', value: 5, color: 'error', sortOrder: 5, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-PRIORITY-002',
        code: 'PRIORITY_TICKET',
        name: '工单优先级',
        type: DictionaryType.PRIORITY,
        module: Module.SERVICE,
        dataType: DataType.ENUM,
        description: 'Service模块工单优先级',
        options: [
          {
            code: 'P1',
            name: 'P1-紧急',
            value: 1,
            color: 'red',
            description: '24小时内响应',
            sortOrder: 1,
            enabled: true,
          },
          {
            code: 'P2',
            name: 'P2-高',
            value: 2,
            color: 'orange',
            description: '48小时内响应',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'P3',
            name: 'P3-普通',
            value: 3,
            color: 'blue',
            description: '72小时内响应',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'P4',
            name: 'P4-低',
            value: 4,
            color: 'default',
            description: '一周内响应',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'P5',
            name: 'P5-计划',
            value: 5,
            color: 'cyan',
            description: '计划性处理',
            sortOrder: 5,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 2,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 严重程度类字典 ==========
      {
        id: 'DICT-SEVERITY-001',
        code: 'SEVERITY_COMMON',
        name: '通用严重程度',
        type: DictionaryType.SEVERITY,
        module: Module.COMMON,
        dataType: DataType.ENUM,
        description: '系统中通用的严重程度枚举',
        options: [
          { code: 'INFO', name: '信息', value: 1, color: 'default', sortOrder: 1, enabled: true },
          { code: 'WARNING', name: '警告', value: 2, color: 'orange', sortOrder: 2, enabled: true },
          { code: 'ERROR', name: '错误', value: 3, color: 'red', sortOrder: 3, enabled: true },
          { code: 'CRITICAL', name: '严重', value: 4, color: 'error', sortOrder: 4, enabled: true },
          { code: 'FATAL', name: '致命', value: 5, color: 'magenta', sortOrder: 5, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 区域类字典 ==========
      {
        id: 'DICT-REGION-001',
        code: 'REGION_CHINA',
        name: '中国区域',
        type: DictionaryType.REGION,
        module: Module.COMMON,
        dataType: DataType.ENUM,
        description: '中国行政区域划分',
        options: [
          { code: 'SC', name: '四川省', value: 'SC', sortOrder: 1, enabled: true },
          { code: 'BJ', name: '北京市', value: 'BJ', sortOrder: 2, enabled: true },
          { code: 'SH', name: '上海市', value: 'SH', sortOrder: 3, enabled: true },
          { code: 'GD', name: '广东省', value: 'GD', sortOrder: 4, enabled: true },
          { code: 'ZJ', name: '浙江省', value: 'ZJ', sortOrder: 5, enabled: true },
          { code: 'JS', name: '江苏省', value: 'JS', sortOrder: 6, enabled: true },
          { code: 'SD', name: '山东省', value: 'SD', sortOrder: 7, enabled: true },
          { code: 'HN', name: '河南省', value: 'HN', sortOrder: 8, enabled: true },
          { code: 'HB', name: '河北省', value: 'HB', sortOrder: 9, enabled: true },
          { code: 'CQ', name: '重庆市', value: 'CQ', sortOrder: 10, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 行业类字典 ==========
      {
        id: 'DICT-INDUSTRY-001',
        code: 'INDUSTRY_COMMON',
        name: '行业分类',
        type: DictionaryType.INDUSTRY,
        module: Module.CRM,
        dataType: DataType.ENUM,
        description: '客户行业分类',
        options: [
          { code: 'IT', name: 'IT/互联网', value: 1, color: 'blue', sortOrder: 1, enabled: true },
          { code: 'FINANCE', name: '金融', value: 2, color: 'gold', sortOrder: 2, enabled: true },
          {
            code: 'MANUFACTURE',
            name: '制造业',
            value: 3,
            color: 'orange',
            sortOrder: 3,
            enabled: true,
          },
          { code: 'RETAIL', name: '零售', value: 4, color: 'green', sortOrder: 4, enabled: true },
          { code: 'EDUCATION', name: '教育', value: 5, color: 'cyan', sortOrder: 5, enabled: true },
          {
            code: 'HEALTHCARE',
            name: '医疗健康',
            value: 6,
            color: 'red',
            sortOrder: 6,
            enabled: true,
          },
          {
            code: 'GOVERNMENT',
            name: '政府',
            value: 7,
            color: 'purple',
            sortOrder: 7,
            enabled: true,
          },
          {
            code: 'ENERGY',
            name: '能源',
            value: 8,
            color: 'geekblue',
            sortOrder: 8,
            enabled: true,
          },
          {
            code: 'TRANSPORT',
            name: '交通物流',
            value: 9,
            color: 'lime',
            sortOrder: 9,
            enabled: true,
          },
          {
            code: 'CONSTRUCTION',
            name: '建筑',
            value: 10,
            color: 'volcano',
            sortOrder: 10,
            enabled: true,
          },
          {
            code: 'AGRICULTURE',
            name: '农业',
            value: 11,
            color: 'green',
            sortOrder: 11,
            enabled: true,
          },
          {
            code: 'OTHER',
            name: '其他',
            value: 12,
            color: 'default',
            sortOrder: 12,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 货币类字典 ==========
      {
        id: 'DICT-CURRENCY-001',
        code: 'CURRENCY_COMMON',
        name: '货币类型',
        type: DictionaryType.CURRENCY,
        module: Module.FINANCE,
        dataType: DataType.ENUM,
        description: '系统中支持的货币类型',
        options: [
          {
            code: 'CNY',
            name: '人民币',
            value: 'CNY',
            description: '¥',
            sortOrder: 1,
            enabled: true,
          },
          {
            code: 'USD',
            name: '美元',
            value: 'USD',
            description: '$',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'EUR',
            name: '欧元',
            value: 'EUR',
            description: '€',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'GBP',
            name: '英镑',
            value: 'GBP',
            description: '£',
            sortOrder: 4,
            enabled: true,
          },
          {
            code: 'JPY',
            name: '日元',
            value: 'JPY',
            description: '¥',
            sortOrder: 5,
            enabled: true,
          },
          {
            code: 'HKD',
            name: '港币',
            value: 'HKD',
            description: 'HK$',
            sortOrder: 6,
            enabled: true,
          },
          {
            code: 'KRW',
            name: '韩元',
            value: 'KRW',
            description: '₩',
            sortOrder: 7,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 单位类字典 ==========
      {
        id: 'DICT-UNIT-001',
        code: 'UNIT_COMMON',
        name: '计量单位',
        type: DictionaryType.UNIT,
        module: Module.ERP,
        dataType: DataType.ENUM,
        description: 'ERP模块计量单位',
        options: [
          { code: 'PCS', name: '件', value: 'PCS', sortOrder: 1, enabled: true },
          { code: 'KG', name: '千克', value: 'KG', sortOrder: 2, enabled: true },
          { code: 'G', name: '克', value: 'G', sortOrder: 3, enabled: true },
          { code: 'L', name: '升', value: 'L', sortOrder: 4, enabled: true },
          { code: 'ML', name: '毫升', value: 'ML', sortOrder: 5, enabled: true },
          { code: 'M', name: '米', value: 'M', sortOrder: 6, enabled: true },
          { code: 'CM', name: '厘米', value: 'CM', sortOrder: 7, enabled: true },
          { code: 'BOX', name: '箱', value: 'BOX', sortOrder: 8, enabled: true },
          { code: 'SET', name: '套', value: 'SET', sortOrder: 9, enabled: true },
          { code: 'BAG', name: '袋', value: 'BAG', sortOrder: 10, enabled: true },
          { code: 'TON', name: '吨', value: 'TON', sortOrder: 11, enabled: true },
          { code: 'SQM', name: '平方米', value: 'SQM', sortOrder: 12, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 等级类字典 ==========
      {
        id: 'DICT-LEVEL-001',
        code: 'LEVEL_CUSTOMER',
        name: '客户等级',
        type: DictionaryType.LEVEL,
        module: Module.CRM,
        dataType: DataType.ENUM,
        description: 'CRM模块客户等级划分',
        options: [
          {
            code: 'A',
            name: 'A级客户',
            value: 'A',
            color: 'gold',
            description: '年交易额>100万',
            sortOrder: 1,
            enabled: true,
          },
          {
            code: 'B',
            name: 'B级客户',
            value: 'B',
            color: 'green',
            description: '年交易额50-100万',
            sortOrder: 2,
            enabled: true,
          },
          {
            code: 'C',
            name: 'C级客户',
            value: 'C',
            color: 'blue',
            description: '年交易额10-50万',
            sortOrder: 3,
            enabled: true,
          },
          {
            code: 'D',
            name: 'D级客户',
            value: 'D',
            color: 'default',
            description: '年交易额<10万',
            sortOrder: 4,
            enabled: true,
          },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-LEVEL-002',
        code: 'LEVEL_EMPLOYEE',
        name: '员工等级',
        type: DictionaryType.LEVEL,
        module: Module.HR,
        dataType: DataType.ENUM,
        description: 'HR模块员工等级划分',
        options: [
          { code: 'E1', name: '初级', value: 'E1', color: 'default', sortOrder: 1, enabled: true },
          { code: 'E2', name: '中级', value: 'E2', color: 'blue', sortOrder: 2, enabled: true },
          { code: 'E3', name: '高级', value: 'E3', color: 'green', sortOrder: 3, enabled: true },
          { code: 'E4', name: '资深', value: 'E4', color: 'cyan', sortOrder: 4, enabled: true },
          { code: 'E5', name: '专家', value: 'E5', color: 'gold', sortOrder: 5, enabled: true },
          { code: 'E6', name: '总监', value: 'E6', color: 'purple', sortOrder: 6, enabled: true },
          { code: 'E7', name: 'VP', value: 'E7', color: 'magenta', sortOrder: 7, enabled: true },
        ],
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 2,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 字段定义类字典 ==========
      {
        id: 'DICT-FIELD-001',
        code: 'FIELD_CUSTOMER_NAME',
        name: '客户名称字段',
        type: DictionaryType.FIELD,
        module: Module.CRM,
        dataType: DataType.STRING,
        description: '客户名称字段定义',
        minLength: 2,
        maxLength: 100,
        required: true,
        pattern: '^[\u4e00-\u9fa5a-zA-Z0-9]+$',
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-FIELD-002',
        code: 'FIELD_PHONE',
        name: '电话号码字段',
        type: DictionaryType.FIELD,
        module: Module.COMMON,
        dataType: DataType.PHONE,
        description: '电话号码字段定义',
        minLength: 11,
        maxLength: 20,
        pattern: '^[0-9+-]+$',
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 2,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-FIELD-003',
        code: 'FIELD_EMAIL',
        name: '邮箱字段',
        type: DictionaryType.FIELD,
        module: Module.COMMON,
        dataType: DataType.EMAIL,
        description: '邮箱地址字段定义',
        minLength: 5,
        maxLength: 100,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 3,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-FIELD-004',
        code: 'FIELD_AMOUNT',
        name: '金额字段',
        type: DictionaryType.FIELD,
        module: Module.FINANCE,
        dataType: DataType.DECIMAL,
        description: '金额字段定义',
        minValue: 0,
        maxValue: 999999999999,
        defaultValue: 0,
        required: true,
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 4,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-FIELD-005',
        code: 'FIELD_QTY',
        name: '数量字段',
        type: DictionaryType.FIELD,
        module: Module.ERP,
        dataType: DataType.INTEGER,
        description: '数量字段定义',
        minValue: 0,
        maxValue: 999999999,
        defaultValue: 0,
        required: true,
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 5,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },

      // ========== 编码定义类字典 ==========
      {
        id: 'DICT-CODE-001',
        code: 'CODE_CUSTOMER',
        name: '客户编码规则',
        type: DictionaryType.CODE,
        module: Module.CRM,
        dataType: DataType.STRING,
        description: '客户编码生成规则：CUS-{区域}-{日期}-{序号}',
        pattern: '^CUS-[A-Z]{2}-[0-9]{8}-[0-9]{4}$',
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 1,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-CODE-002',
        code: 'CODE_PRODUCT',
        name: '产品编码规则',
        type: DictionaryType.CODE,
        module: Module.ERP,
        dataType: DataType.STRING,
        description: '产品编码生成规则：PRD-{分类}-{序号}',
        pattern: '^PRD-[A-Z]{3}-[0-9]{6}$',
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 2,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DICT-CODE-003',
        code: 'CODE_ORDER',
        name: '订单编码规则',
        type: DictionaryType.CODE,
        module: Module.CRM,
        dataType: DataType.STRING,
        description: '订单编码生成规则：ORD-{日期}-{序号}',
        pattern: '^ORD-[0-9]{8}-[0-9]{6}$',
        status: DictionaryStatus.ACTIVE,
        version: '1.0',
        sortOrder: 3,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]

    defaultItems.forEach((item) => this.items.set(item.id, item))
  }

  // 初始化默认分类
  private initDefaultCategories() {
    const defaultCategories: DictionaryCategory[] = [
      {
        id: 'CAT-001',
        code: 'STATUS',
        name: '状态字典',
        module: Module.COMMON,
        sortOrder: 1,
        itemCount: 8,
      },
      {
        id: 'CAT-002',
        code: 'TYPE',
        name: '类型字典',
        module: Module.COMMON,
        sortOrder: 2,
        itemCount: 4,
      },
      {
        id: 'CAT-003',
        code: 'PRIORITY',
        name: '优先级字典',
        module: Module.COMMON,
        sortOrder: 3,
        itemCount: 2,
      },
      {
        id: 'CAT-004',
        code: 'SEVERITY',
        name: '严重程度字典',
        module: Module.COMMON,
        sortOrder: 4,
        itemCount: 1,
      },
      {
        id: 'CAT-005',
        code: 'REGION',
        name: '区域字典',
        module: Module.COMMON,
        sortOrder: 5,
        itemCount: 1,
      },
      {
        id: 'CAT-006',
        code: 'INDUSTRY',
        name: '行业字典',
        module: Module.CRM,
        sortOrder: 6,
        itemCount: 1,
      },
      {
        id: 'CAT-007',
        code: 'CURRENCY',
        name: '货币字典',
        module: Module.FINANCE,
        sortOrder: 7,
        itemCount: 1,
      },
      {
        id: 'CAT-008',
        code: 'UNIT',
        name: '单位字典',
        module: Module.ERP,
        sortOrder: 8,
        itemCount: 1,
      },
      {
        id: 'CAT-009',
        code: 'LEVEL',
        name: '等级字典',
        module: Module.HR,
        sortOrder: 9,
        itemCount: 2,
      },
      {
        id: 'CAT-010',
        code: 'FIELD',
        name: '字段定义',
        module: Module.COMMON,
        sortOrder: 10,
        itemCount: 5,
      },
      {
        id: 'CAT-011',
        code: 'CODE',
        name: '编码规则',
        module: Module.COMMON,
        sortOrder: 11,
        itemCount: 3,
      },
    ]

    defaultCategories.forEach((cat) => this.categories.set(cat.id, cat))
  }

  // 初始化示例版本
  private initSampleVersions() {
    const sampleVersions: DictionaryVersion[] = [
      {
        id: 'VER-001',
        version: '1.0',
        description: '初始版本，包含基础字典项',
        changes: [],
        itemCount: 25,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        publishedAt: new Date('2026-01-01'),
        status: 'PUBLISHED',
      },
      {
        id: 'VER-002',
        version: '1.1',
        description: '新增工单类型和优先级字典',
        changes: [
          {
            type: 'ADD',
            itemId: 'DICT-TYPE-004',
            itemCode: 'TYPE_TICKET',
            newValue: '工单类型',
            changedAt: new Date('2026-03-01'),
          },
          {
            type: 'ADD',
            itemId: 'DICT-PRIORITY-002',
            itemCode: 'PRIORITY_TICKET',
            newValue: '工单优先级',
            changedAt: new Date('2026-03-01'),
          },
        ],
        itemCount: 27,
        createdBy: 'admin',
        createdAt: new Date('2026-03-01'),
        publishedAt: new Date('2026-03-01'),
        status: 'PUBLISHED',
      },
      {
        id: 'VER-003',
        version: '2.0',
        description: '重大版本更新，新增字段定义和编码规则',
        changes: [
          {
            type: 'ADD',
            itemId: 'DICT-FIELD-001',
            itemCode: 'FIELD_CUSTOMER_NAME',
            newValue: '字段定义',
            changedAt: new Date('2026-03-31'),
          },
          {
            type: 'ADD',
            itemId: 'DICT-CODE-001',
            itemCode: 'CODE_CUSTOMER',
            newValue: '编码规则',
            changedAt: new Date('2026-03-31'),
          },
        ],
        itemCount: 30,
        createdBy: 'admin',
        createdAt: new Date('2026-03-31'),
        status: 'DRAFT',
      },
    ]

    sampleVersions.forEach((v) => this.versions.set(v.id, v))
  }

  // 初始化示例引用
  private initSampleReferences() {
    const sampleRefs: DictionaryReference[] = [
      {
        id: 'REF-001',
        itemCode: 'STATUS_CUSTOMER',
        module: Module.CRM,
        entityType: 'Customer',
        entityField: 'status',
        usageType: 'REFERENCE',
        required: true,
        description: '客户实体状态字段引用',
      },
      {
        id: 'REF-002',
        itemCode: 'STATUS_ORDER',
        module: Module.CRM,
        entityType: 'Order',
        entityField: 'status',
        usageType: 'REFERENCE',
        required: true,
        description: '订单实体状态字段引用',
      },
      {
        id: 'REF-003',
        itemCode: 'PRIORITY_TICKET',
        module: Module.SERVICE,
        entityType: 'Ticket',
        entityField: 'priority',
        usageType: 'REFERENCE',
        required: true,
        description: '工单实体优先级字段引用',
      },
      {
        id: 'REF-004',
        itemCode: 'CURRENCY_COMMON',
        module: Module.FINANCE,
        entityType: 'Invoice',
        entityField: 'currency',
        usageType: 'DEFAULT',
        required: true,
        description: '发票实体货币字段默认值',
      },
      {
        id: 'REF-005',
        itemCode: 'FIELD_AMOUNT',
        module: Module.FINANCE,
        entityType: 'Invoice',
        entityField: 'amount',
        usageType: 'VALIDATION',
        required: true,
        description: '发票实体金额字段验证规则',
      },
    ]

    sampleRefs.forEach((r) => this.references.set(r.id, r))
  }

  // ========== 字典项管理 ==========

  async getItems(params?: {
    module?: Module
    type?: DictionaryType
    status?: DictionaryStatus
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    let items = Array.from(this.items.values())

    // 筛选
    if (params?.module) items = items.filter((i) => i.module === params.module)
    if (params?.type) items = items.filter((i) => i.type === params.type)
    if (params?.status) items = items.filter((i) => i.status === params.status)
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      items = items.filter(
        (i) =>
          i.code.toLowerCase().includes(kw) ||
          i.name.toLowerCase().includes(kw) ||
          (i.description && i.description.toLowerCase().includes(kw)),
      )
    }

    // 排序
    items.sort((a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code))

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = items.length
    const list = items.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  async getItem(id: string) {
    return this.items.get(id)
  }

  async getItemByCode(code: string) {
    return Array.from(this.items.values()).find((i) => i.code === code)
  }

  async getOptions(code: string) {
    const item = await this.getItemByCode(code)
    if (!item || !item.options) return []
    return item.options.filter((o) => o.enabled).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async createItem(item: DictionaryItem) {
    item.id = `DICT-${Date.now()}`
    item.createdAt = new Date()
    item.updatedAt = new Date()
    item.status = item.status || DictionaryStatus.DRAFT
    item.version = '1.0'
    this.items.set(item.id, item)
    return item
  }

  async updateItem(id: string, updates: Partial<DictionaryItem>) {
    const item = this.items.get(id)
    if (!item) return null
    Object.assign(item, updates, { updatedAt: new Date() })
    this.items.set(id, item)
    return item
  }

  async deleteItem(id: string) {
    const item = this.items.get(id)
    if (!item) return false
    item.status = DictionaryStatus.ARCHIVED
    item.deprecatedAt = new Date()
    this.items.set(id, item)
    return true
  }

  async deprecateItem(id: string, replacedBy?: string) {
    const item = this.items.get(id)
    if (!item) return null
    item.status = DictionaryStatus.DEPRECATED
    item.deprecatedAt = new Date()
    item.replacedBy = replacedBy
    this.items.set(id, item)
    return item
  }

  // ========== 字典分类管理 ==========

  async getCategories(module?: Module) {
    let categories = Array.from(this.categories.values())
    if (module) categories = categories.filter((c) => c.module === module)
    return categories.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async getCategory(id: string) {
    return this.categories.get(id)
  }

  async createCategory(category: DictionaryCategory) {
    category.id = `CAT-${Date.now()}`
    this.categories.set(category.id, category)
    return category
  }

  async updateCategory(id: string, updates: Partial<DictionaryCategory>) {
    const category = this.categories.get(id)
    if (!category) return null
    Object.assign(category, updates)
    this.categories.set(id, category)
    return category
  }

  // ========== 字典版本管理 ==========

  async getVersions() {
    return Array.from(this.versions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
  }

  async getVersion(id: string) {
    return this.versions.get(id)
  }

  async createVersion(version: DictionaryVersion) {
    version.id = `VER-${Date.now()}`
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
    this.versions.set(id, version)
    return version
  }

  // ========== 字典引用管理 ==========

  async getReferences(module?: Module, itemCode?: string) {
    let refs = Array.from(this.references.values())
    if (module) refs = refs.filter((r) => r.module === module)
    if (itemCode) refs = refs.filter((r) => r.itemCode === itemCode)
    return refs
  }

  async createReference(ref: DictionaryReference) {
    ref.id = `REF-${Date.now()}`
    this.references.set(ref.id, ref)
    return ref
  }

  async deleteReference(id: string) {
    return this.references.delete(id)
  }

  // ========== 数据验证 ==========

  async validateValue(code: string, value: any) {
    const item = await this.getItemByCode(code)
    if (!item) return { valid: false, error: '字典项不存在' }

    // 枚举类型验证
    if (
      item.type === DictionaryType.ENUM ||
      item.type === DictionaryType.STATUS ||
      item.type === DictionaryType.TYPE ||
      item.type === DictionaryType.PRIORITY ||
      item.type === DictionaryType.SEVERITY ||
      item.type === DictionaryType.LEVEL
    ) {
      const options = item.options || []
      const validOption = options.find((o) => o.value === value || o.code === value)
      if (!validOption) {
        return { valid: false, error: `值不在有效选项范围内`, validOptions: options }
      }
      return { valid: true, matchedOption: validOption }
    }

    // 字段类型验证
    if (item.type === DictionaryType.FIELD) {
      // 字符串长度验证
      if (item.minLength && typeof value === 'string' && value.length < item.minLength) {
        return { valid: false, error: `长度不能小于 ${item.minLength}` }
      }
      if (item.maxLength && typeof value === 'string' && value.length > item.maxLength) {
        return { valid: false, error: `长度不能大于 ${item.maxLength}` }
      }

      // 数值范围验证
      if (item.minValue !== undefined && typeof value === 'number' && value < item.minValue) {
        return { valid: false, error: `值不能小于 ${item.minValue}` }
      }
      if (item.maxValue !== undefined && typeof value === 'number' && value > item.maxValue) {
        return { valid: false, error: `值不能大于 ${item.maxValue}` }
      }

      // 正则验证
      if (item.pattern && typeof value === 'string') {
        const regex = new RegExp(item.pattern)
        if (!regex.test(value)) {
          return { valid: false, error: `格式不符合要求` }
        }
      }

      return { valid: true }
    }

    return { valid: true }
  }

  // ========== 批量操作 ==========

  async batchCreateItems(items: DictionaryItem[]) {
    const results = { added: 0, errors: 0 }
    items.forEach((item) => {
      try {
        this.createItem(item)
        results.added++
      } catch (e) {
        results.errors++
      }
    })
    return results
  }

  async batchUpdateStatus(ids: string[], status: DictionaryStatus) {
    ids.forEach((id) => {
      const item = this.items.get(id)
      if (item) {
        item.status = status
        item.updatedAt = new Date()
        if (status === DictionaryStatus.DEPRECATED) {
          item.deprecatedAt = new Date()
        }
        this.items.set(id, item)
      }
    })
    return { updated: ids.length }
  }

  // ========== 导入导出 ==========

  async exportData(config: ExportConfig) {
    let items = Array.from(this.items.values())

    // 筛选
    if (config.module) items = items.filter((i) => i.module === config.module)
    if (config.type) items = items.filter((i) => i.type === config.type)
    if (config.status) items = items.filter((i) => i.status === config.status)
    if (!config.includeDeprecated)
      items = items.filter((i) => i.status !== DictionaryStatus.DEPRECATED)

    const exportData = items.map((i) => ({
      code: i.code,
      name: i.name,
      type: i.type,
      module: i.module,
      dataType: i.dataType,
      description: i.description,
      options: i.options,
      status: i.status,
      version: i.version,
      sortOrder: i.sortOrder,
    }))

    if (config.format === 'JSON') {
      return JSON.stringify(exportData, null, 2)
    }

    return exportData
  }

  async importData(data: any, format: 'JSON' | 'YAML' | 'CSV' | 'EXCEL') {
    const result: ImportResult = { total: 0, added: 0, updated: 0, skipped: 0, errors: 0 }

    let items: any[] = []
    if (format === 'JSON') {
      items = Array.isArray(data) ? data : JSON.parse(data)
    } else {
      items = Array.isArray(data) ? data : []
    }

    result.total = items.length

    for (const item of items) {
      try {
        const existing = await this.getItemByCode(item.code)
        if (existing) {
          if (existing.status === DictionaryStatus.ACTIVE) {
            result.skipped++
          } else {
            this.updateItem(existing.id, item)
            result.updated++
          }
        } else {
          this.createItem(item)
          result.added++
        }
      } catch (e) {
        result.errors++
        result.errorDetails = result.errorDetails || []
        result.errorDetails.push(`导入失败: ${item.code} - ${(e as Error).message}`)
      }
    }

    return result
  }

  // ========== 统计分析 ==========

  async getStats() {
    const items = Array.from(this.items.values())
    return {
      totalItems: items.length,
      byModule: this.countByField(items, 'module'),
      byType: this.countByField(items, 'type'),
      byStatus: this.countByField(items, 'status'),
      activeItems: items.filter((i) => i.status === DictionaryStatus.ACTIVE).length,
      deprecatedItems: items.filter((i) => i.status === DictionaryStatus.DEPRECATED).length,
      totalCategories: this.categories.size,
      totalReferences: this.references.size,
    }
  }

  private countByField(items: DictionaryItem[], field: string): Record<string, number> {
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
    const items = Array.from(this.items.values()).filter(
      (i) =>
        i.code.toLowerCase().includes(kw) ||
        i.name.toLowerCase().includes(kw) ||
        (i.description && i.description.toLowerCase().includes(kw)),
    )
    return items
  }
}
