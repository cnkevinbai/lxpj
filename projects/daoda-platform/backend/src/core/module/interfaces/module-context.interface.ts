/**
 * ModuleContext 模块上下文接口
 * 提供模块运行时可访问的系统服务
 *
 * 设计依据: PLUGIN_SYSTEM_DESIGN.md - 插件上下文接口
 * @version 1.0.0
 * @since 2026-03-30
 */

import { LoggerService } from '../../logger/logger.service'
import { EventBusService } from '../../event/event-bus.service'
import { ConfigCenterService } from '../../config/config-center.service'
import { ModuleRegistryService } from '../module-registry.service'

/**
 * 数据库服务接口
 * 提供对平台数据库的安全访问
 */
export interface DatabaseService {
  /**
   * 执行原始 SQL 查询
   * @param query SQL 查询语句
   * @param values 参数值
   */
  queryRaw<T = any>(query: string, ...values: any[]): Promise<T>

  /**
   * 执行原始 SQL 命令
   * @param query SQL 命令语句
   * @param values 参数值
   */
  executeRaw(query: string, ...values: any[]): Promise<number>

  /**
   * 获取 Prisma Client (受限访问)
   * 仅提供模型查询方法，不暴露完整 Client
   */
  getModel(modelName: string): any
}

/**
 * 路由注册接口
 * 用于模块动态注册 API 路由
 */
export interface RouteRegistry {
  /**
   * 注册路由
   * @param moduleId 模块ID
   * @param routes 路由定义列表
   */
  register(moduleId: string, routes: any[]): void

  /**
   * 注销路由
   * @param moduleId 模块ID
   */
  unregister(moduleId: string): void

  /**
   * 获取模块路由
   * @param moduleId 模块ID
   */
  getRoutes(moduleId: string): any[]
}

/**
 * 权限注册接口
 * 用于模块动态注册权限定义
 */
export interface PermissionRegistry {
  /**
   * 注册权限
   * @param moduleId 模块ID
   * @param permissions 权限定义列表
   */
  register(moduleId: string, permissions: any[]): void

  /**
   * 注销权限
   * @param moduleId 模块ID
   */
  unregister(moduleId: string): void

  /**
   * 检查权限
   * @param userId 用户ID
   * @param permissionId 权限ID
   */
  check(userId: string, permissionId: string): Promise<boolean>
}

/**
 * 菜单注册接口
 * 用于模块动态注册菜单项
 */
export interface MenuRegistry {
  /**
   * 注册菜单
   * @param moduleId 模块ID
   * @param menus 菜单定义列表
   */
  register(moduleId: string, menus: any[]): void

  /**
   * 注销菜单
   * @param moduleId 模块ID
   */
  unregister(moduleId: string): void

  /**
   * 获取菜单树
   */
  getMenuTree(): any[]
}

/**
 * 服务注册接口
 * 用于模块注册和发现服务
 */
export interface ServiceRegistry {
  /**
   * 注册服务
   * @param moduleId 模块ID
   * @param serviceName 服务名称
   * @param service 服务实例
   */
  register(moduleId: string, serviceName: string, service: any): void

  /**
   * 注销服务
   * @param moduleId 模块ID
   * @param serviceName 服务名称
   */
  unregister(moduleId: string, serviceName: string): void

  /**
   * 获取服务
   * @param serviceName 服务名称
   */
  get<T = any>(serviceName: string): T | undefined

  /**
   * 注销模块所有服务
   * @param moduleId 模块ID
   */
  unregisterAll(moduleId: string): void
}

/**
 * 模块上下文接口
 *
 * 模块通过上下文访问系统服务:
 * 1. 日志服务 - 记录模块日志
 * 2. 配置中心 - 获取/设置配置
 * 3. 事件总线 - 发布/订阅事件
 * 4. 数据库服务 - 安全访问数据库
 * 5. 路由注册 - 动态注册 API
 * 6. 权限注册 - 动态注册权限
 * 7. 服务注册 - 注册和发现服务
 *
 * @example
 * ```typescript
 * async onInstall(context: ModuleContext): Promise<void> {
 *   // 使用日志服务
 *   context.logger.info('CRM模块安装开始');
 *
 *   // 获取配置
 *   const dbConfig = context.config.get('database.url');
 *
 *   // 注册路由
 *   context.router.register(this.manifest.id, this.getRoutes());
 *
 *   // 发布事件
 *   context.eventBus.emit('module.installed', { moduleId: this.manifest.id });
 * }
 * ```
 */
export interface ModuleContext {
  // ============================================
  // 核心服务
  // ============================================

  /**
   * 日志服务
   * 提供模块级别的日志记录
   */
  logger: LoggerService

  /**
   * 配置中心
   * 提供模块配置的获取和设置
   */
  config: ConfigCenterService

  /**
   * 事件总线
   * 提供模块间的事件通信
   */
  eventBus: EventBusService

  /**
   * 数据库服务
   * 提供安全的数据库访问
   */
  db: DatabaseService

  // ============================================
  // 注册服务
  // ============================================

  /**
   * 路由注册
   * 用于动态注册 API 路由
   */
  router: RouteRegistry

  /**
   * 权限注册
   * 用于动态注册权限定义
   */
  permission: PermissionRegistry

  /**
   * 菜单注册
   * 用于动态注册菜单项
   */
  menu: MenuRegistry

  /**
   * 服务注册
   * 用于注册和发现模块服务
   */
  serviceRegistry: ServiceRegistry

  // ============================================
  // 模块信息
  // ============================================

  /**
   * 当前模块ID
   */
  moduleId: string

  /**
   * 模块注册表
   * 用于获取其他模块信息
   */
  moduleRegistry: ModuleRegistryService

  /**
   * 核心版本
   */
  coreVersion: string

  /**
   * 系统环境
   */
  environment: 'development' | 'production' | 'test'

  // ============================================
  // 工具方法
  // ============================================

  /**
   * 获取其他模块
   * @param moduleId 模块ID
   */
  getModule<T = any>(moduleId: string): T | undefined

  /**
   * 获取其他模块的服务
   * @param moduleId 模块ID
   * @param serviceName 服务名称
   */
  getModuleService<T = any>(moduleId: string, serviceName: string): T | undefined

  /**
   * 检查依赖模块是否可用
   * @param moduleId 模块ID
   */
  hasDependency(moduleId: string): boolean
}

/**
 * 创建模块上下文的选项
 */
export interface CreateModuleContextOptions {
  /** 模块ID */
  moduleId: string
  /** 模块清单 */
  manifest: any
  /** 核心版本 */
  coreVersion: string
  /** 环境 */
  environment: 'development' | 'production' | 'test'
}
