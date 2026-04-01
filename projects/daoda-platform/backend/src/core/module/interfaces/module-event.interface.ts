/**
 * ModuleEvent 模块事件接口
 * 定义模块的事件规范
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

/**
 * 事件类型枚举
 */
export enum EventType {
  /** 模块生命周期事件 */
  MODULE_LIFECYCLE = 'module_lifecycle',
  /** 业务数据事件 */
  BUSINESS_DATA = 'business_data',
  /** 系统事件 */
  SYSTEM = 'system',
  /** 用户行为事件 */
  USER_ACTION = 'user_action',
  /** 外部集成事件 */
  EXTERNAL = 'external',
}

/**
 * 事件优先级枚举
 */
export enum EventPriority {
  /** 低优先级 */
  LOW = 0,
  /** 普通优先级 */
  NORMAL = 1,
  /** 高优先级 */
  HIGH = 2,
  /** 最高优先级 */
  CRITICAL = 3,
}

/**
 * 模块事件定义
 *
 * @example
 * ```typescript
 * const events: ModuleEvent[] = [
 *   {
 *     name: 'crm.customer.created',
 *     description: '客户创建事件',
 *     type: EventType.BUSINESS_DATA,
 *     payloadSchema: {
 *       customerId: { type: 'string', required: true },
 *       createdBy: { type: 'string', required: true },
 *       timestamp: { type: 'number', required: true },
 *     },
 *   },
 *   {
 *     name: 'crm.order.completed',
 *     description: '订单完成事件',
 *     type: EventType.BUSINESS_DATA,
 *   },
 * ];
 * ```
 */
export interface ModuleEvent {
  // ============================================
  // 事件基本信息 (必需)
  // ============================================

  /**
   * 事件名称
   *
   * 格式: module.resource.action 或 module.action
   * 示例: crm.customer.created, crm.order.completed
   */
  name: string

  /**
   * 事件描述
   */
  description?: string

  /**
   * 事件类型
   */
  type: EventType

  // ============================================
  // 事件配置 (可选)
  // ============================================

  /**
   * 所属模块ID
   */
  moduleId?: string

  /**
   * 事件分组
   */
  group?: string

  /**
   * 是否异步事件
   * 异步事件不会阻塞发布者
   */
  async?: boolean

  /**
   * 是否持久化
   * 持久化事件会存储到数据库
   */
  persistent?: boolean

  /**
   * 事件优先级
   */
  priority?: EventPriority

  // ============================================
  // Payload 定义 (可选)
  // ============================================

  /**
   * Payload 数据结构定义
   */
  payloadSchema?: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date'
      required?: boolean
      description?: string
    }
  >

  /**
   * Payload 示例
   */
  payloadExample?: any

  // ============================================
  // 监听器配置 (可选)
  // ============================================

  /**
   * 默认监听器
   */
  listeners?: Array<{
    moduleId: string
    handler: string
    priority?: number
  }>

  /**
   * 是否支持多监听器
   */
  multiListener?: boolean
}

/**
 * 事件 Payload 结构
 */
export interface EventPayload<T = any> {
  /** 事件ID */
  eventId: string
  /** 事件名称 */
  eventName: string
  /** 事件类型 */
  eventType: EventType
  /** 模块ID */
  moduleId: string
  /** 事件时间 */
  timestamp: number
  /** 业务数据 */
  data: T
  /** 触发用户 */
  userId?: string
  /** 触发来源 */
  source?: string
  /** 关联ID (用于追踪) */
  correlationId?: string
  /** 元数据 */
  metadata?: Record<string, any>
}

/**
 * 事件监听器定义
 */
export interface EventListener {
  /** 监听器ID */
  id: string
  /** 监听的事件名称 (支持通配符) */
  eventName: string | string[]
  /** 处理函数 */
  handler: (payload: EventPayload) => Promise<void> | void
  /** 监听器模块ID */
  moduleId?: string
  /** 优先级 */
  priority?: number
  /** 是否异步处理 */
  async?: boolean
  /** 是否单次监听 */
  once?: boolean
  /** 过滤条件 */
  filter?: (payload: EventPayload) => boolean
}

/**
 * 标准模块生命周期事件名称
 */
export const ModuleLifecycleEvents = {
  /** 模块安装 */
  INSTALLED: 'module.installed',
  /** 模块初始化 */
  INITIALIZED: 'module.initialized',
  /** 模块启动 */
  STARTED: 'module.started',
  /** 模块停止 */
  STOPPED: 'module.stopped',
  /** 模块卸载 */
  UNINSTALLED: 'module.uninstalled',
  /** 模块更新 */
  UPDATED: 'module.updated',
  /** 模块健康检查 */
  HEALTH_CHECK: 'module.health_check',
  /** 模块错误 */
  ERROR: 'module.error',
}

/**
 * 标准业务数据事件模板
 */
export const BusinessDataEventTemplates = {
  /** 创建事件 */
  CREATED: (module: string, resource: string) => `${module}.${resource}.created`,
  /** 更新事件 */
  UPDATED: (module: string, resource: string) => `${module}.${resource}.updated`,
  /** 删除事件 */
  DELETED: (module: string, resource: string) => `${module}.${resource}.deleted`,
  /** 状态变更事件 */
  STATUS_CHANGED: (module: string, resource: string) => `${module}.${resource}.status_changed`,
}
