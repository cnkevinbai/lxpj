/**
 * IModule 接口定义
 * 所有业务模块必须实现此接口以支持热插拔
 *
 * 设计依据: MODULE_DESIGN_MASTER.md - 热插拔架构实现
 * @version 1.0.0
 * @since 2026-03-30
 */

import { ModuleManifest } from './module-manifest.interface'
import { ModuleContext } from './module-context.interface'
import { ModuleRoute } from './module-route.interface'
import { ModulePermission } from './module-permission.interface'
import { ModuleEvent } from './module-event.interface'

/**
 * 模块状态枚举
 */
export enum ModuleStatus {
  /** 未安装 */
  NOT_INSTALLED = 'not_installed',
  /** 已安装 */
  INSTALLED = 'installed',
  /** 已加载 */
  LOADED = 'loaded',
  /** 运行中 */
  RUNNING = 'running',
  /** 已禁用 */
  DISABLED = 'disabled',
  /** 错误状态 */
  ERROR = 'error',
  /** 更新中 */
  UPDATING = 'updating',
}

/**
 * 模块健康状态
 */
export interface ModuleHealth {
  /** 状态: healthy | degraded | unhealthy */
  status: 'healthy' | 'degraded' | 'unhealthy'
  /** 详细信息 */
  details: Record<string, any>
  /** 检查时间 */
  timestamp: number
  /** 错误信息 (如果有) */
  error?: string
}

/**
 * 模块热更新策略
 */
export enum HotUpdateStrategy {
  /** 滚动更新 - 逐个实例更新 */
  ROLLING = 'rolling',
  /** 蓝绿部署 - 新旧版本并行 */
  BLUE_GREEN = 'blue-green',
  /** 金丝雀发布 - 逐步放量 */
  CANARY = 'canary',
  /** 重启更新 - 需要重启 */
  RESTART = 'restart',
}

/**
 * IModule 核心接口
 *
 * 实现此接口的模块将获得:
 * 1. 热插拔能力 - 动态加载/卸载/启用/禁用
 * 2. 生命周期管理 - 完整的钩子函数支持
 * 3. 热更新支持 - 无需重启即可更新模块
 * 4. 健康检查 - 模块状态监控
 *
 * @example
 * ```typescript
 * // CRM 模块实现示例
 * @ModuleManifest({
 *   id: '@daoda/crm',
 *   name: 'CRM客户管理',
 *   version: '1.0.0',
 *   description: '客户关系管理模块',
 * })
 * export class CrmModule implements IModule {
 *   private context: ModuleContext;
 *
 *   async onInstall(context: ModuleContext): Promise<void> {
 *     this.context = context;
 *     // 初始化数据库表、配置等
 *   }
 *
 *   async onInit(): Promise<void> {
 *     // 注册路由、权限、事件
 *     this.context.router.register(this.getRoutes());
 *     this.context.permission.register(this.getPermissions());
 *   }
 *
 *   async onStart(): Promise<void> {
 *     // 启动业务逻辑
 *   }
 *
 *   // ... 其他生命周期方法
 * }
 * ```
 */
export interface IModule {
  // ============================================
  // 模块元数据 (必需)
  // ============================================

  /**
   * 模块清单信息
   * 包含模块ID、名称、版本、依赖等元信息
   */
  readonly manifest: ModuleManifest

  /**
   * 获取模块当前状态
   */
  readonly status: ModuleStatus

  // ============================================
  // 生命周期钩子 (必需实现)
  // ============================================

  /**
   * 安装钩子 - 模块首次安装时调用
   *
   * 职责:
   * - 创建数据库表结构
   * - 初始化默认配置
   * - 创建默认角色权限
   * - 注册模块到系统
   *
   * @param context 模块上下文，提供系统服务访问
   */
  onInstall(context: ModuleContext): Promise<void>

  /**
   * 初始化钩子 - 模块加载后调用
   *
   * 职责:
   * - 注册路由
   * - 注册权限
   * - 注册事件监听
   * - 初始化服务实例
   */
  onInit(): Promise<void>

  /**
   * 启动钩子 - 模块启用时调用
   *
   * 职责:
   * - 启动业务逻辑
   * - 开启定时任务
   * - 连接外部服务
   * - 开始处理请求
   */
  onStart(): Promise<void>

  /**
   * 停止钩子 - 模块禁用时调用
   *
   * 职责:
   * - 停止定时任务
   * - 断开外部连接
   * - 释放资源
   * - 保存状态
   */
  onStop(): Promise<void>

  /**
   * 卸载钩子 - 模块卸载时调用
   *
   * 职责:
   * - 清理数据库 (可选保留数据)
   * - 删除配置
   * - 移除权限
   * - 完全清理资源
   */
  onUninstall(): Promise<void>

  // ============================================
  // 热更新钩子 (可选实现)
  // ============================================

  /**
   * 更新前钩子 - 热更新前调用
   *
   * 职责:
   * - 备份当前状态
   * - 通知相关模块
   * - 准备更新环境
   *
   * @param fromVersion 当前版本
   * @param toVersion 目标版本
   */
  onBeforeUpdate?(fromVersion: string, toVersion: string): Promise<void>

  /**
   * 更换后钩子 - 热更新后调用
   *
   * 职责:
   * - 恢复状态
   * - 迁移数据
   * - 验证功能
   *
   * @param fromVersion 旧版本
   * @param toVersion 新版本
   */
  onAfterUpdate?(fromVersion: string, toVersion: string): Promise<void>

  // ============================================
  // 健康检查 (必需实现)
  // ============================================

  /**
   * 健康检查 - 定期调用以监控模块状态
   *
   * 检查项:
   * - 数据库连接
   * - 服务可用性
   * - 关键功能状态
   * - 性能指标
   *
   * @returns 健康状态报告
   */
  onHealthCheck(): Promise<ModuleHealth>

  // ============================================
  // 扩展点注册 (可选实现)
  // ============================================

  /**
   * 获取模块路由定义
   *
   * 路由将自动注册到系统路由表
   * 支持动态添加/移除
   */
  getRoutes?(): ModuleRoute[]

  /**
   * 获取模块权限定义
   *
   * 权限将自动注册到权限系统
   * 支持角色绑定
   */
  getPermissions?(): ModulePermission[]

  /**
   * 获取模块事件定义
   *
   * 事件将自动注册到事件总线
   * 支持发布/订阅
   */
  getEvents?(): ModuleEvent[]

  /**
   * 获取模块菜单定义
   *
   * 菜单将自动添加到系统菜单树
   * 支持动态显示/隐藏
   */
  getMenus?(): ModuleMenuItem[]

  /**
   * 获取模块配置定义
   *
   * 配置将自动添加到配置中心
   * 支持热更新
   */
  getConfigs?(): ModuleConfigDefinition[]
}

/**
 * 模块菜单项定义
 */
export interface ModuleMenuItem {
  /** 菜单ID */
  id: string
  /** 菜单标题 */
  title: string
  /** 菜单图标 */
  icon?: string
  /** 路由路径 */
  path?: string
  /** 父菜单ID */
  parentId?: string
  /** 排序权重 */
  order?: number
  /** 是否显示 */
  visible?: boolean
  /** 所需权限 */
  permissions?: string[]
  /** 子菜单 */
  children?: ModuleMenuItem[]
}

/**
 * 模块配置定义
 */
export interface ModuleConfigDefinition {
  /** 配置键 */
  key: string
  /** 配置名称 */
  name: string
  /** 配置描述 */
  description?: string
  /** 配置类型 */
  type: 'string' | 'number' | 'boolean' | 'select' | 'json'
  /** 默认值 */
  defaultValue: any
  /** 是否必填 */
  required?: boolean
  /** 校验规则 */
  validation?: {
    min?: number
    max?: number
    pattern?: string
    options?: string[]
  }
  /** 是否支持热更新 */
  hotUpdate?: boolean
  /** 配置分组 */
  group?: string
}
