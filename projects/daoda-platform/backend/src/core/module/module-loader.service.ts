/**
 * ModuleLoaderService 模块加载器服务
 * 负责模块的加载、卸载、启用、禁用
 *
 * 设计依据: MODULE_DESIGN_MASTER.md - 热插拔架构实现
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Injectable, OnModuleInit } from '@nestjs/common'
import { IModule, ModuleStatus, ModuleManifest, ModuleContext, ModuleHealth } from './interfaces'
import { LoggerService } from '../logger/logger.service'
import { EventBusService } from '../event/event-bus.service'
import { ConfigCenterService } from '../config/config-center.service'

/**
 * 已加载模块结构
 */
interface LoadedModule {
  manifest: ModuleManifest
  instance: IModule
  context: ModuleContext
  status: ModuleStatus
  loadedAt: number
  startedAt?: number
  lastHealthCheck?: ModuleHealth
}

/**
 * ModuleLoaderService
 *
 * 功能:
 * - 模块加载和卸载
 * - 模块启用和禁用
 * - 依赖检查
 * - 健康检查
 * - 状态管理
 *
 * @example
 * ```typescript
 * // 加载模块
 * await moduleLoader.load('@daoda/crm');
 *
 * // 启用模块
 * await moduleLoader.enable('@daoda/crm');
 *
 * // 禁用模块
 * await moduleLoader.disable('@daoda/crm');
 *
 * // 卸载模块
 * await moduleLoader.unload('@daoda/crm');
 * ```
 */
@Injectable()
export class ModuleLoaderService implements OnModuleInit {
  /** 已加载模块 */
  private modules: Map<string, LoadedModule> = new Map()

  /** 模块清单缓存 */
  private manifests: Map<string, ModuleManifest> = new Map()

  /** 核心版本 */
  private coreVersion: string = '1.0.0'

  /** 环境 */
  private environment: 'development' | 'production' | 'test' = 'development'

  constructor(
    private readonly logger: LoggerService,
    private readonly eventBus: EventBusService,
    private readonly config: ConfigCenterService,
  ) {
    this.logger.setModuleId('module-loader')
  }

  async onModuleInit(): Promise<void> {
    // 初始化模块加载器
    this.logger.info('模块加载器初始化完成')

    // 从配置获取核心版本和环境
    this.coreVersion = this.config.get('core.version', '1.0.0')
    this.environment = this.config.get('environment', 'development')
  }

  /**
   * 注册模块清单
   * 在加载之前需要先注册模块清单
   * @param manifest 模块清单
   */
  registerManifest(manifest: ModuleManifest): void {
    this.manifests.set(manifest.id, manifest)
    this.logger.info(`模块清单已注册: ${manifest.id} (${manifest.version})`)
  }

  /**
   * 批量注册模块清单
   */
  registerManifests(manifests: ModuleManifest[]): void {
    for (const manifest of manifests) {
      this.registerManifest(manifest)
    }
  }

  /**
   * 加载模块
   * @param moduleId 模块ID
   */
  async load(moduleId: string): Promise<void> {
    // 1. 检查模块是否已加载
    if (this.modules.has(moduleId)) {
      throw new Error(`模块 ${moduleId} 已加载`)
    }

    // 2. 获取模块清单
    const manifest = this.manifests.get(moduleId)
    if (!manifest) {
      throw new Error(`模块清单未注册: ${moduleId}`)
    }

    // 3. 检查依赖
    await this.checkDependencies(manifest)

    // 4. 创建模块实例
    const instance = await this.createModuleInstance(moduleId)

    // 5. 创建模块上下文
    const context = this.createModuleContext(manifest)

    // 6. 调用安装钩子
    await instance.onInstall(context)

    // 7. 注册模块
    this.modules.set(moduleId, {
      manifest,
      instance,
      context,
      status: ModuleStatus.INSTALLED,
      loadedAt: Date.now(),
    })

    // 8. 发布事件
    this.eventBus.emit('module.installed', {
      moduleId,
      version: manifest.version,
    })

    this.logger.info(`模块已安装: ${moduleId} (${manifest.version})`)
  }

  /**
   * 初始化模块
   * @param moduleId 模块ID
   */
  async init(moduleId: string): Promise<void> {
    const loadedModule = this.modules.get(moduleId)
    if (!loadedModule) {
      throw new Error(`模块未加载: ${moduleId}`)
    }

    if (loadedModule.status !== ModuleStatus.INSTALLED) {
      throw new Error(`模块状态不允许初始化: ${moduleId} (${loadedModule.status})`)
    }

    // 调用初始化钩子
    await loadedModule.instance.onInit()

    loadedModule.status = ModuleStatus.LOADED

    this.eventBus.emit('module.initialized', { moduleId })
    this.logger.info(`模块已初始化: ${moduleId}`)
  }

  /**
   * 启用模块
   * @param moduleId 模块ID
   */
  async enable(moduleId: string): Promise<void> {
    const loadedModule = this.modules.get(moduleId)
    if (!loadedModule) {
      throw new Error(`模块未加载: ${moduleId}`)
    }

    if (loadedModule.status === ModuleStatus.RUNNING) {
      return // 已在运行
    }

    // 如果未初始化，先初始化
    if (loadedModule.status === ModuleStatus.INSTALLED) {
      await this.init(moduleId)
    }

    // 调用启动钩子
    await loadedModule.instance.onStart()

    loadedModule.status = ModuleStatus.RUNNING
    loadedModule.startedAt = Date.now()

    // 注册路由、权限、菜单
    if (loadedModule.instance.getRoutes) {
      loadedModule.context.router.register(moduleId, loadedModule.instance.getRoutes())
    }
    if (loadedModule.instance.getPermissions) {
      loadedModule.context.permission.register(moduleId, loadedModule.instance.getPermissions())
    }
    if (loadedModule.instance.getMenus) {
      loadedModule.context.menu.register(moduleId, loadedModule.instance.getMenus())
    }

    this.eventBus.emit('module.started', { moduleId })
    this.logger.info(`模块已启动: ${moduleId}`)
  }

  /**
   * 禁用模块
   * @param moduleId 模块ID
   */
  async disable(moduleId: string): Promise<void> {
    const loadedModule = this.modules.get(moduleId)
    if (!loadedModule) {
      throw new Error(`模块未加载: ${moduleId}`)
    }

    if (loadedModule.status !== ModuleStatus.RUNNING) {
      return // 不在运行状态
    }

    // 调用停止钩子
    await loadedModule.instance.onStop()

    // 注销路由、权限、菜单
    loadedModule.context.router.unregister(moduleId)
    loadedModule.context.permission.unregister(moduleId)
    loadedModule.context.menu.unregister(moduleId)

    loadedModule.status = ModuleStatus.DISABLED

    this.eventBus.emit('module.stopped', { moduleId })
    this.logger.info(`模块已禁用: ${moduleId}`)
  }

  /**
   * 卸载模块
   * @param moduleId 模块ID
   */
  async unload(moduleId: string): Promise<void> {
    const loadedModule = this.modules.get(moduleId)
    if (!loadedModule) {
      throw new Error(`模块未加载: ${moduleId}`)
    }

    // 1. 先禁用
    if (loadedModule.status === ModuleStatus.RUNNING) {
      await this.disable(moduleId)
    }

    // 2. 调用卸载钩子
    await loadedModule.instance.onUninstall()

    // 3. 清理资源
    loadedModule.context.serviceRegistry.unregisterAll(moduleId)
    loadedModule.context.eventBus.offModule(moduleId)

    // 4. 移除模块
    this.modules.delete(moduleId)

    this.eventBus.emit('module.uninstalled', { moduleId })
    this.logger.info(`模块已卸载: ${moduleId}`)
  }

  /**
   * 检查模块依赖
   */
  private async checkDependencies(manifest: ModuleManifest): Promise<void> {
    if (!manifest.dependencies || manifest.dependencies.length === 0) {
      return
    }

    for (const dep of manifest.dependencies) {
      const loadedDep = this.modules.get(dep.id)

      if (!loadedDep && !dep.optional) {
        throw new Error(`模块 ${manifest.id} 依赖 ${dep.id}，但该模块未加载`)
      }

      if (loadedDep) {
        // 简化版本检查
        const depVersion = loadedDep.manifest.version
        const requiredVersion = dep.version

        // 基本版本检查 (简化，不使用 semver)
        if (!this.checkVersionMatch(depVersion, requiredVersion)) {
          throw new Error(
            `模块 ${manifest.id} 需要 ${dep.id}@${requiredVersion}，但当前版本是 ${depVersion}`,
          )
        }
      }
    }

    // 检查冲突
    if (manifest.conflicts) {
      for (const conflictId of manifest.conflicts) {
        if (this.modules.has(conflictId)) {
          throw new Error(`模块 ${manifest.id} 与 ${conflictId} 冲突`)
        }
      }
    }
  }

  /**
   * 简化版本匹配检查
   */
  private checkVersionMatch(current: string, required: string): boolean {
    // ^1.0.0 -> 允许 1.x.x
    // ~1.0.0 -> 允许 1.0.x
    // >=1.0.0 -> 允许 >= 1.0.0

    if (required.startsWith('^')) {
      const base = required.substring(1)
      const parts = base.split('.')
      const currentParts = current.split('.')
      return currentParts[0] === parts[0]
    }

    if (required.startsWith('~')) {
      const base = required.substring(1)
      const parts = base.split('.')
      const currentParts = current.split('.')
      return currentParts[0] === parts[0] && currentParts[1] === parts[1]
    }

    if (required.startsWith('>=')) {
      const minVersion = required.substring(2)
      return current >= minVersion
    }

    // 精确匹配
    return current === required
  }

  /**
   * 创建模块实例
   * 目前使用静态模块，后续支持动态加载
   */
  private async createModuleInstance(moduleId: string): Promise<IModule> {
    // 从清单获取入口路径
    const manifest = this.manifests.get(moduleId)

    // 目前返回空实现，后续支持动态导入
    throw new Error(`模块实例创建需要具体实现: ${moduleId}`)
  }

  /**
   * 创建模块上下文
   */
  private createModuleContext(manifest: ModuleManifest): ModuleContext {
    const moduleLogger = this.logger.createChildLogger(manifest.id)

    return {
      logger: moduleLogger,
      config: this.config,
      eventBus: this.eventBus,
      db: this.createDatabaseService(),
      router: this.createRouteRegistry(),
      permission: this.createPermissionRegistry(),
      menu: this.createMenuRegistry(),
      serviceRegistry: this.createServiceRegistry(),
      moduleId: manifest.id,
      moduleRegistry: this.createModuleRegistry(),
      coreVersion: this.coreVersion,
      environment: this.environment,
      getModule: (id) => this.getModuleInstance(id),
      getModuleService: (id, name) => this.getModuleService(id, name),
      hasDependency: (id) => this.modules.has(id),
    }
  }

  /**
   * 创建数据库服务代理
   */
  private createDatabaseService(): any {
    return {
      queryRaw: async (query: string, ...values: any[]) => {
        // 后续实现 Prisma 查询
        throw new Error('数据库服务未实现')
      },
      executeRaw: async (query: string, ...values: any[]) => {
        throw new Error('数据库服务未实现')
      },
      getModel: (modelName: string) => {
        throw new Error('数据库服务未实现')
      },
    }
  }

  /**
   * 创建路由注册表
   */
  private createRouteRegistry(): any {
    return {
      register: (moduleId: string, routes: any[]) => {
        this.logger.debug(`路由已注册: ${moduleId} (${routes.length} 个)`)
      },
      unregister: (moduleId: string) => {
        this.logger.debug(`路由已注销: ${moduleId}`)
      },
      getRoutes: (moduleId: string) => {
        return []
      },
    }
  }

  /**
   * 创建权限注册表
   */
  private createPermissionRegistry(): any {
    return {
      register: (moduleId: string, permissions: any[]) => {
        this.logger.debug(`权限已注册: ${moduleId} (${permissions.length} 个)`)
      },
      unregister: (moduleId: string) => {
        this.logger.debug(`权限已注销: ${moduleId}`)
      },
      check: async (userId: string, permissionId: string) => {
        return true // 后续实现
      },
    }
  }

  /**
   * 创建菜单注册表
   */
  private createMenuRegistry(): any {
    return {
      register: (moduleId: string, menus: any[]) => {
        this.logger.debug(`菜单已注册: ${moduleId} (${menus.length} 个)`)
      },
      unregister: (moduleId: string) => {
        this.logger.debug(`菜单已注销: ${moduleId}`)
      },
      getMenuTree: () => {
        return []
      },
    }
  }

  /**
   * 创建服务注册表
   */
  private createServiceRegistry(): any {
    const services: Map<string, Map<string, any>> = new Map()

    return {
      register: (moduleId: string, serviceName: string, service: any) => {
        if (!services.has(moduleId)) {
          services.set(moduleId, new Map())
        }
        services.get(moduleId)!.set(serviceName, service)
        this.logger.debug(`服务已注册: ${serviceName} (${moduleId})`)
      },
      unregister: (moduleId: string, serviceName: string) => {
        services.get(moduleId)?.delete(serviceName)
      },
      get: (serviceName: string) => {
        for (const moduleServices of services.values()) {
          if (moduleServices.has(serviceName)) {
            return moduleServices.get(serviceName)
          }
        }
        return undefined
      },
      unregisterAll: (moduleId: string) => {
        services.delete(moduleId)
      },
    }
  }

  /**
   * 创建模块注册表
   */
  private createModuleRegistry(): any {
    return {
      getModule: (moduleId: string) => this.modules.get(moduleId),
      getManifest: (moduleId: string) => this.manifests.get(moduleId),
      getAllModules: () => Array.from(this.modules.values()),
      getModuleStatus: (moduleId: string) => this.modules.get(moduleId)?.status,
    }
  }

  /**
   * 获取模块实例
   */
  private getModuleInstance(moduleId: string): any | undefined {
    return this.modules.get(moduleId)?.instance
  }

  /**
   * 获取模块服务
   */
  private getModuleService(moduleId: string, serviceName: string): any | undefined {
    const loadedModule = this.modules.get(moduleId)
    return loadedModule?.context.serviceRegistry.get(serviceName)
  }

  /**
   * 执行健康检查
   * @param moduleId 模块ID
   */
  async healthCheck(moduleId: string): Promise<ModuleHealth> {
    const loadedModule = this.modules.get(moduleId)
    if (!loadedModule) {
      return {
        status: 'unhealthy',
        details: {},
        timestamp: Date.now(),
        error: `模块未加载: ${moduleId}`,
      }
    }

    const health = await loadedModule.instance.onHealthCheck()
    loadedModule.lastHealthCheck = health

    return health
  }

  /**
   * 执行所有模块健康检查
   */
  async healthCheckAll(): Promise<Record<string, ModuleHealth>> {
    const results: Record<string, ModuleHealth> = {}

    for (const [moduleId, loadedModule] of this.modules) {
      if (loadedModule.status === ModuleStatus.RUNNING) {
        results[moduleId] = await this.healthCheck(moduleId)
      }
    }

    return results
  }

  /**
   * 获取模块状态
   */
  getStatus(moduleId: string): ModuleStatus | undefined {
    return this.modules.get(moduleId)?.status
  }

  /**
   * 获取所有已加载模块
   */
  getAllModules(): LoadedModule[] {
    return Array.from(this.modules.values())
  }

  /**
   * 获取模块统计
   */
  getStats(): {
    total: number
    running: number
    disabled: number
    error: number
  } {
    const stats = { total: 0, running: 0, disabled: 0, error: 0 }

    for (const loadedModule of this.modules.values()) {
      stats.total++
      switch (loadedModule.status) {
        case ModuleStatus.RUNNING:
          stats.running++
          break
        case ModuleStatus.DISABLED:
          stats.disabled++
          break
        case ModuleStatus.ERROR:
          stats.error++
          break
      }
    }

    return stats
  }
}
