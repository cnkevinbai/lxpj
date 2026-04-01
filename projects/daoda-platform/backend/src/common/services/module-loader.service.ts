import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ModuleRegistryService, ModuleMetadata } from './module-registry.service'
import { PrismaService } from '../prisma/prisma.service'

// 模块生命周期接口
export interface LifecycleHook {
  onEnable?(): Promise<void>
  onDisable?(): Promise<void>
  onLoad?(): Promise<void>
  onUnload?(): Promise<void>
}

@Injectable()
export class ModuleLoaderService implements OnModuleInit {
  constructor(
    private registry: ModuleRegistryService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    // 初始化时从数据库加载模块状态
    await this.loadModuleStates()
  }

  /**
   * 从数据库加载模块状态
   */
  private async loadModuleStates(): Promise<void> {
    const moduleConfigs = await this.prisma.moduleConfig.findMany()

    for (const config of moduleConfigs) {
      const metadata = this.registry.getMetadata(config.moduleCode)
      if (metadata) {
        metadata.enabled = config.enabled
      }
    }
  }

  /**
   * 启用模块
   */
  async enableModule(moduleId: string): Promise<void> {
    const metadata = this.registry.getMetadata(moduleId)
    if (!metadata) {
      throw new Error(`Module ${moduleId} not found`)
    }

    // 检查依赖
    await this.checkDependencies(moduleId)

    // 更新数据库
    await this.prisma.moduleConfig.update({
      where: { moduleCode: moduleId },
      data: { enabled: true },
    })

    // 更新注册表
    metadata.enabled = true

    // 调用生命周期钩子
    if (metadata.instance?.onEnable) {
      await metadata.instance.onEnable()
    }
  }

  /**
   * 禁用模块
   */
  async disableModule(moduleId: string): Promise<void> {
    const metadata = this.registry.getMetadata(moduleId)
    if (!metadata) {
      throw new Error(`Module ${moduleId} not found`)
    }

    // 检查是否有其他模块依赖此模块
    await this.checkDependents(moduleId)

    // 调用生命周期钩子
    if (metadata.instance?.onDisable) {
      await metadata.instance.onDisable()
    }

    // 更新数据库
    await this.prisma.moduleConfig.update({
      where: { moduleCode: moduleId },
      data: { enabled: false },
    })

    // 更新注册表
    metadata.enabled = false
  }

  /**
   * 检查依赖是否满足
   */
  private async checkDependencies(moduleId: string): Promise<void> {
    const metadata = this.registry.getMetadata(moduleId)
    if (!metadata) return

    for (const depId of metadata.dependencies) {
      const dep = this.registry.getMetadata(depId)
      if (!dep || !dep.enabled) {
        throw new Error(`Dependency ${depId} not enabled`)
      }
    }
  }

  /**
   * 检查是否有其他模块依赖此模块
   */
  private async checkDependents(moduleId: string): Promise<void> {
    const allModules = this.registry.getAllModules()

    for (const mod of allModules) {
      if (mod.dependencies.includes(moduleId) && mod.enabled) {
        throw new Error(`Module ${mod.id} depends on ${moduleId}`)
      }
    }
  }

  /**
   * 获取模块状态
   */
  getModuleStatus(moduleId: string): {
    registered: boolean
    enabled: boolean
    loaded: boolean
    dependencies: string[]
  } {
    const metadata = this.registry.getMetadata(moduleId)

    return {
      registered: !!metadata,
      enabled: metadata?.enabled || false,
      loaded: this.registry.isLoaded(moduleId),
      dependencies: metadata?.dependencies || [],
    }
  }
}
