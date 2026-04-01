/**
 * ModuleRoute 模块路由接口
 * 定义模块的 API 路由规范
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

/**
 * HTTP 方法枚举
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * 路由中间件类型
 */
export type RouteMiddleware = (req: any, res: any, next: () => void) => void | Promise<void>

/**
 * 模块路由定义
 *
 * @example
 * ```typescript
 * const routes: ModuleRoute[] = [
 *   {
 *     path: '/customers',
 *     method: HttpMethod.GET,
 *     handler: customerController.list,
 *     permission: 'crm:customer:view',
 *     description: '获取客户列表',
 *   },
 *   {
 *     path: '/customers/:id',
 *     method: HttpMethod.GET,
 *     handler: customerController.getOne,
 *     permission: 'crm:customer:view',
 *     description: '获取客户详情',
 *   },
 * ];
 * ```
 */
export interface ModuleRoute {
  // ============================================
  // 路由基本信息 (必需)
  // ============================================

  /**
   * 路由路径
   *
   * 示例:
   * - /customers
   * - /customers/:id
   * - /customers/:id/orders
   *
   * 注意:
   * - 完整路径 = 模块 routePrefix + 此路径
   * - 支持动态参数 (:id, :orderId 等)
   */
  path: string

  /**
   * HTTP 方法
   */
  method: HttpMethod

  /**
   * 路由处理器
   * 可以是控制器方法或函数
   */
  handler: string | Function | [string, string]

  // ============================================
  // 路由配置 (可选)
  // ============================================

  /**
   * 路由名称
   * 用于日志和文档生成
   */
  name?: string

  /**
   * 路由描述
   * 用于 API 文档
   */
  description?: string

  /**
   * 所需权限
   * 用户必须拥有此权限才能访问
   * 格式: module:resource:action
   */
  permission?: string

  /**
   * 是否需要认证
   * 默认 true
   */
  authRequired?: boolean

  /**
   * 是否公开 API
   * 公开 API 无需认证
   */
  public?: boolean

  /**
   * 中间件列表
   * 在处理器之前执行
   */
  middlewares?: RouteMiddleware[]

  /**
   * 路由分组
   * 用于批量管理
   */
  group?: string

  /**
   * 路由标签
   * 用于分类和搜索
   */
  tags?: string[]

  // ============================================
  // 参数配置 (可选)
  // ============================================

  /**
   * 路径参数定义
   */
  pathParams?: Array<{
    name: string
    type: 'string' | 'number' | 'uuid'
    required: boolean
    description?: string
  }>

  /**
   * 查询参数定义
   */
  queryParams?: Array<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'date'
    required?: boolean
    default?: any
    description?: string
  }>

  /**
   * 请求体定义
   */
  bodySchema?: any

  /**
   * 响应体定义
   */
  responseSchema?: any

  // ============================================
  // 性能配置 (可选)
  // ============================================

  /**
   * 是否启用缓存
   */
  cache?: {
    enabled: boolean
    ttl?: number // 缓存时间 (秒)
    key?: string // 缓存键模板
  }

  /**
   * 限流配置
   */
  rateLimit?: {
    enabled: boolean
    limit?: number // 请求次数限制
    window?: number // 时间窗口 (秒)
  }

  /**
   * 超时时间 (毫秒)
   */
  timeout?: number
}

/**
 * 路由组定义
 * 用于批量注册相关路由
 */
export interface RouteGroup {
  /** 组名称 */
  name: string
  /** 路径前缀 */
  prefix?: string
  /** 组内路由 */
  routes: ModuleRoute[]
  /** 组中间件 */
  middlewares?: RouteMiddleware[]
  /** 组权限前缀 */
  permissionPrefix?: string
}
