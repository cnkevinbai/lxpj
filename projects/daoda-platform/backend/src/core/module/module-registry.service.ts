/**
 * ModuleRegistryService 模块注册表服务
 * 提供模块信息的查询和管理
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Injectable } from '@nestjs/common'
import { ModuleManifest, ModuleStatus } from './interfaces'

/**
 * 模块注册信息
 */
export interface ModuleRegistration {
  manifest: ModuleManifest
  status: ModuleStatus
  loadedAt?: number
  startedAt?: number
  lastHealthCheck?: any
}

/**
 * ModuleRegistryService
 *
 * 功能:
 * - 模块信息查询
 * - 模块状态查询
 * - 模块依赖关系
 * - 模块列表管理
 */
@Injectable()
export class ModuleRegistryService {
  /** 模块注册表 */
  private registry: Map<string, ModuleRegistration> = new Map()

  /**
   * 注册模块
   */
  register(manifest: ModuleManifest): void {
    this.registry.set(manifest.id, {
      manifest,
      status: ModuleStatus.NOT_INSTALLED,
    })
  }

  /**
   * 更新模块状态
   */
  updateStatus(moduleId: string, status: ModuleStatus): void {
    const registration = this.registry.get(moduleId)
    if (registration) {
      registration.status = status
      if (status === ModuleStatus.LOADED) {
        registration.loadedAt = Date.now()
      }
      if (status === ModuleStatus.RUNNING) {
        registration.startedAt = Date.now()
      }
    }
  }

  /**
   * 获取模块清单
   */
  getManifest(moduleId: string): ModuleManifest | undefined {
    return this.registry.get(moduleId)?.manifest
  }

  /**
   * 获取模块状态
   */
  getStatus(moduleId: string): ModuleStatus | undefined {
    return this.registry.get(moduleId)?.status
  }

  /**
   * 获取模块注册信息
   */
  getModule(moduleId: string): ModuleRegistration | undefined {
    return this.registry.get(moduleId)
  }

  /**
   * 获取所有模块
   */
  getAllModules(): ModuleRegistration[] {
    return Array.from(this.registry.values())
  }

  /**
   * 获取运行中的模块
   */
  getRunningModules(): ModuleRegistration[] {
    return Array.from(this.registry.values()).filter((m) => m.status === ModuleStatus.RUNNING)
  }

  /**
   * 检查模块是否存在
   */
  hasModule(moduleId: string): boolean {
    return this.registry.has(moduleId)
  }

  /**
   * 检查模块是否运行
   */
  isModuleRunning(moduleId: string): boolean {
    return this.registry.get(moduleId)?.status === ModuleStatus.RUNNING
  }

  /**
   * 获取模块依赖
   */
  getDependencies(moduleId: string): string[] {
    const manifest = this.getManifest(moduleId)
    return manifest?.dependencies?.map((d) => d.id) || []
  }

  /**
   * 获取依赖指定模块的模块列表
   */
  getDependents(moduleId: string): string[] {
    const dependents: string[] = []

    for (const [id, registration] of this.registry) {
      const deps = registration.manifest.dependencies || []
      if (deps.some((d) => d.id === moduleId)) {
        dependents.push(id)
      }
    }

    return dependents
  }

  /**
   * 移除模块注册
   */
  unregister(moduleId: string): boolean {
    return this.registry.delete(moduleId)
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    total: number
    byStatus: Record<string, number>
    byCategory: Record<string, number>
  } {
    const byStatus: Record<string, number> = {}
    const byCategory: Record<string, number> = {}

    for (const registration of this.registry.values()) {
      byStatus[registration.status] = (byStatus[registration.status] || 0) + 1
      const category = registration.manifest.category || 'unknown'
      byCategory[category] = (byCategory[category] || 0) + 1
    }

    return {
      total: this.registry.size,
      byStatus,
      byCategory,
    }
  }
}
