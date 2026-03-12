/**
 * 插件系统类型定义
 * 渔晓白 ⚙️ · 专业交付
 */

// ==================== 插件清单 ====================

export interface PluginManifest {
  /** 插件唯一标识 */
  name: string
  /** 语义化版本号 */
  version: string
  /** 显示名称 */
  displayName: string
  /** 插件描述 */
  description: string
  /** 作者信息 */
  author: string
  /** 入口文件路径 */
  main: string
  /** 插件依赖 */
  dependencies?: Record<string, string>
  /** 权限列表 */
  permissions?: PluginPermission[]
  /** 支持的钩子 */
  hooks?: string[]
  /** 菜单项配置 */
  menuItems?: MenuItem[]
  /** 路由配置 */
  routes?: RouteConfig[]
  /** 最小核心版本 */
  minCoreVersion?: string
}

// ==================== 权限类型 ====================

export type PluginPermission =
  | 'read:lead'
  | 'write:lead'
  | 'delete:lead'
  | 'read:customer'
  | 'write:customer'
  | 'delete:customer'
  | 'read:opportunity'
  | 'write:opportunity'
  | 'delete:opportunity'
  | 'read:order'
  | 'write:order'
  | 'delete:order'
  | 'read:product'
  | 'write:product'
  | 'delete:product'
  | 'read:purchase'
  | 'write:purchase'
  | 'delete:purchase'
  | 'read:inventory'
  | 'write:inventory'
  | 'delete:inventory'
  | 'read:production'
  | 'write:production'
  | 'delete:production'
  | 'read:finance'
  | 'write:finance'
  | 'delete:finance'
  | 'admin'

// ==================== 菜单项 ====================

export interface MenuItem {
  /** 父级菜单 key */
  parent?: string
  /** 菜单显示文本 */
  label: string
  /** 路由路径 */
  path: string
  /** 图标名称 */
  icon?: string
  /** 权限要求 */
  permission?: PluginPermission
  /** 子菜单 */
  children?: MenuItem[]
}

// ==================== 路由配置 ====================

export interface RouteConfig {
  /** 路由路径 */
  path: string
  /** 组件路径 */
  component: string
  /** 是否需要认证 */
  auth?: boolean
  /** 权限要求 */
  permission?: PluginPermission
  /** 路由元数据 */
  meta?: Record<string, any>
}

// ==================== 插件上下文 ====================

export interface PluginContext {
  /** 应用实例 */
  app: any
  /** 路由器实例 */
  router: any
  /** 状态管理实例 */
  store: any
  /** API 服务实例 */
  api: any
  /** 配置对象 */
  config: Record<string, any>
  /** 工具函数 */
  utils: any
}

// ==================== 插件基类 ====================

export abstract class Plugin {
  /** 插件清单 */
  manifest: PluginManifest
  /** 插件上下文 */
  context?: PluginContext
  /** 插件配置 */
  config?: Record<string, any>

  constructor(manifest: PluginManifest) {
    this.manifest = manifest
  }

  // ========== 生命周期钩子 ==========

  /** 插件安装时调用 */
  async onInstall?(ctx: PluginContext): Promise<void>
  
  /** 插件启用时调用 */
  async onEnable?(ctx: PluginContext): Promise<void>
  
  /** 插件禁用时调用 */
  async onDisable?(ctx: PluginContext): Promise<void>
  
  /** 插件卸载时调用 */
  async onUninstall?(ctx: PluginContext): Promise<void>

  // ========== 应用生命周期 ==========

  /** 应用初始化时调用 */
  async onAppInit?(ctx: PluginContext): Promise<void>
  
  /** 路由变化时调用 */
  async onRouteChange?(path: string, ctx: PluginContext): Promise<void>
  
  /** 用户登录时调用 */
  async onUserLogin?(user: any, ctx: PluginContext): Promise<void>
  
  /** 用户登出时调用 */
  async onUserLogout?(ctx: PluginContext): Promise<void>

  // ========== 数据钩子 ==========

  /** 数据创建前 */
  async beforeCreate?(entity: string, data: any, ctx: PluginContext): Promise<any>
  
  /** 数据创建后 */
  async afterCreate?(entity: string, data: any, ctx: PluginContext): Promise<void>
  
  /** 数据更新前 */
  async beforeUpdate?(entity: string, data: any, ctx: PluginContext): Promise<any>
  
  /** 数据更新后 */
  async afterUpdate?(entity: string, data: any, ctx: PluginContext): Promise<void>
  
  /** 数据删除前 */
  async beforeDelete?(entity: string, id: string, ctx: PluginContext): Promise<void>
  
  /** 数据删除后 */
  async afterDelete?(entity: string, id: string, ctx: PluginContext): Promise<void>
}

// ==================== 插件配置 ====================

export interface PluginConfig {
  enabled: boolean
  autoEnable?: boolean
  settings?: Record<string, any>
}

// ==================== 插件注册表 ====================

export interface PluginRegistry {
  name: string
  version: string
  path: string
  installedAt: Date
  updatedAt: Date
  enabled: boolean
  manifest: PluginManifest
}

// ==================== 插件事件 ====================

export interface PluginEvent {
  type: string
  payload?: any
  timestamp: Date
  source: string
}

// ==================== 导出 ====================

export default {
  Plugin,
}
