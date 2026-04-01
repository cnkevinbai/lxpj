/**
 * BaseModule 模块基类
 * 提供模块开发的便捷基类实现
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import {
  IModule,
  ModuleStatus,
  ModuleManifest,
  ModuleContext,
  ModuleHealth,
  ModuleRoute,
  ModulePermission,
  ModuleMenuItem,
} from './interfaces'

/**
 * BaseModule 模块基类
 *
 * 继承此基类可以简化模块开发:
 * - 自动管理状态
 * - 提供默认健康检查
 * - 提供便捷的日志和配置访问
 *
 * @example
 * ```typescript
 * import { BaseModule, ModuleManifest } from '@daoda/core';
 *
 * @ModuleManifest({
 *   id: '@daoda/crm',
 *   name: 'CRM客户管理',
 *   version: '1.0.0',
 * })
 * export class CrmModule extends BaseModule {
 *   // 只需要实现必要的方法
 *   async onInstall(context: ModuleContext): Promise<void> {
 *     super.onInstall(context);
 *     // 初始化数据库表...
 *     this.logger.info('CRM模块安装完成');
 *   }
 *
 *   async onStart(): Promise<void> {
 *     // 启动业务逻辑...
 *     this.logger.info('CRM模块启动完成');
 *   }
 * }
 * ```
 */
export abstract class BaseModule implements IModule {
  /** 模块清单 */
  abstract readonly manifest: ModuleManifest

  /** 模块状态 */
  protected _status: ModuleStatus = ModuleStatus.NOT_INSTALLED

  /** 模块上下文 */
  protected _context: ModuleContext | null = null

  // ============================================
  // 可选扩展方法 - 子类可覆盖
  // ============================================

  /** 获取路由定义 */
  getRoutes?(): ModuleRoute[]

  /** 获取权限定义 */
  getPermissions?(): ModulePermission[]

  /** 获取菜单定义 */
  getMenus?(): ModuleMenuItem[]

  /** 注册事件监听器 */
  protected registerEventListeners?(): void

  /**
   * 获取状态
   */
  get status(): ModuleStatus {
    return this._status
  }

  /**
   * 获取日志服务 (便捷访问)
   */
  protected get logger() {
    return this._context?.logger
  }

  /**
   * 获取配置服务 (便捷访问)
   */
  protected get config() {
    return this._context?.config
  }

  /**
   * 获取事件总线 (便捷访问)
   */
  protected get eventBus() {
    return this._context?.eventBus
  }

  /**
   * 安装钩子 - 基类提供基础实现
   */
  async onInstall(context: ModuleContext): Promise<void> {
    this._context = context
    this._status = ModuleStatus.INSTALLED

    // 发布安装事件
    this.eventBus?.emit('module.installed', {
      moduleId: this.manifest.id,
      version: this.manifest.version,
    })
  }

  /**
   * 初始化钩子 - 基类提供基础实现
   */
  async onInit(): Promise<void> {
    this._status = ModuleStatus.LOADED

    // 注册路由、权限、菜单等
    this.registerExtensions()

    this.eventBus?.emit('module.initialized', {
      moduleId: this.manifest.id,
    })
  }

  /**
   * 启动钩子 - 基类提供基础实现
   */
  async onStart(): Promise<void> {
    this._status = ModuleStatus.RUNNING

    this.eventBus?.emit('module.started', {
      moduleId: this.manifest.id,
    })
  }

  /**
   * 停止钩子 - 基类提供基础实现
   */
  async onStop(): Promise<void> {
    this._status = ModuleStatus.DISABLED

    // 注销扩展
    this.unregisterExtensions()

    this.eventBus?.emit('module.stopped', {
      moduleId: this.manifest.id,
    })
  }

  /**
   * 卸载钩子 - 基类提供基础实现
   */
  async onUninstall(): Promise<void> {
    this._status = ModuleStatus.NOT_INSTALLED
    this._context = null

    this.logger?.info(`模块已卸载: ${this.manifest.id}`)
  }

  /**
   * 健康检查 - 提供默认实现
   */
  async onHealthCheck(): Promise<ModuleHealth> {
    return {
      status: this._status === ModuleStatus.RUNNING ? 'healthy' : 'unhealthy',
      details: {
        status: this._status,
      },
      timestamp: Date.now(),
    }
  }

  /**
   * 注册扩展点 - 自动调用子类定义的方法
   */
  protected registerExtensions(): void {
    // 注册路由
    if (this.getRoutes) {
      const routes = this.getRoutes()
      if (routes?.length) {
        this._context?.router.register(this.manifest.id, routes)
      }
    }

    // 注册权限
    if (this.getPermissions) {
      const permissions = this.getPermissions()
      if (permissions?.length) {
        this._context?.permission.register(this.manifest.id, permissions)
      }
    }

    // 注册菜单
    if (this.getMenus) {
      const menus = this.getMenus()
      if (menus?.length) {
        this._context?.menu.register(this.manifest.id, menus)
      }
    }

    // 注册事件监听
    if (this.registerEventListeners) {
      this.registerEventListeners()
    }
  }

  /**
   * 注销扩展点
   */
  protected unregisterExtensions(): void {
    this._context?.router.unregister(this.manifest.id)
    this._context?.permission.unregister(this.manifest.id)
    this._context?.menu.unregister(this.manifest.id)
    this._context?.eventBus.offModule(this.manifest.id)
  }

  /**
   * 获取模块上下文
   */
  getContext(): ModuleContext | null {
    return this._context
  }

  /**
   * 获取模块 ID
   */
  getModuleId(): string {
    return this.manifest.id
  }

  /**
   * 检查模块是否运行
   */
  isRunning(): boolean {
    return this._status === ModuleStatus.RUNNING
  }
}
