import { Injectable, Type, DynamicModule } from '@nestjs/common'
import { Module } from '@nestjs/common'

// 模块元数据接口
export interface ModuleMetadata {
  id: string
  name: string
  version: string
  description?: string
  dependencies: string[]
  enabled: boolean
  loadedAt?: Date
  instance?: any
}

@Injectable()
export class ModuleRegistryService {
  private modules: Map<string, ModuleMetadata> = new Map()
  private loadedModules: Map<string, any> = new Map()

  /**
   * 注册模块
   */
  register(metadata: ModuleMetadata): void {
    this.modules.set(metadata.id, { ...metadata, enabled: false })
  }

  /**
   * 获取模块元数据
   */
  getMetadata(moduleId: string): ModuleMetadata | undefined {
    return this.modules.get(moduleId)
  }

  /**
   * 获取所有已注册模块
   */
  getAllModules(): ModuleMetadata[] {
    return Array.from(this.modules.values())
  }

  /**
   * 获取已启用的模块
   */
  getEnabledModules(): ModuleMetadata[] {
    return Array.from(this.modules.values()).filter(m => m.enabled)
  }

  /**
   * 检查模块是否已加载
   */
  isLoaded(moduleId: string): boolean {
    return this.loadedModules.has(moduleId)
  }

  /**
   * 设置模块实例
   */
  setModuleInstance(moduleId: string, instance: any): void {
    this.loadedModules.set(moduleId, instance)
    const metadata = this.modules.get(moduleId)
    if (metadata) {
      metadata.instance = instance
      metadata.loadedAt = new Date()
    }
  }

  /**
   * 移除模块实例
   */
  removeModuleInstance(moduleId: string): void {
    this.loadedModules.delete(moduleId)
    const metadata = this.modules.get(moduleId)
    if (metadata) {
      metadata.instance = undefined
      metadata.loadedAt = undefined
    }
  }
}
