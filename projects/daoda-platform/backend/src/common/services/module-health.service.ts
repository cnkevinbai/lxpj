/**
 * 模块健康检查服务
 * 定期检查模块运行状态
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ModuleLoaderService } from '../../core/module/module-loader.service'
import { ModuleHealth } from '../../core/module/interfaces'

export interface ModuleHealthReport {
  moduleId: string
  moduleName: string
  version: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  lastCheck: Date
  uptime: number
  errorCount: number
  lastError?: string
  details: Record<string, any>
}

export interface SystemHealthReport {
  timestamp: Date
  totalModules: number
  healthyCount: number
  degradedCount: number
  unhealthyCount: number
  modules: ModuleHealthReport[]
}

@Injectable()
export class ModuleHealthService implements OnModuleInit, OnModuleDestroy {
  private healthHistory: Map<string, ModuleHealthReport[]> = new Map()
  private maxHistoryLength = 100
  private errorCounts: Map<string, number> = new Map()
  private checkInterval?: NodeJS.Timeout

  constructor(private readonly moduleLoader: ModuleLoaderService) {}

  async onModuleInit() {
    console.log('模块健康检查服务已启动')
    // 每5分钟执行一次健康检查
    this.checkInterval = setInterval(
      () => {
        this.performHealthCheck().catch(console.error)
      },
      5 * 60 * 1000,
    )
  }

  onModuleDestroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }
  }

  /**
   * 定时健康检查 (每5分钟)
   */
  async performHealthCheck(): Promise<SystemHealthReport> {
    const modules = this.moduleLoader.getAllModules()
    const reports: ModuleHealthReport[] = []

    for (const module of modules) {
      try {
        const manifest = module.manifest
        const health = await this.moduleLoader.healthCheck(manifest.id)
        const report = this.createReport(manifest, health, module.loadedAt)
        reports.push(report)
        this.recordHealth(report)
      } catch (error) {
        const report = this.createErrorReport(module.manifest, error, module.loadedAt)
        reports.push(report)
        this.recordHealth(report)
      }
    }

    return {
      timestamp: new Date(),
      totalModules: modules.length,
      healthyCount: reports.filter((r) => r.status === 'healthy').length,
      degradedCount: reports.filter((r) => r.status === 'degraded').length,
      unhealthyCount: reports.filter((r) => r.status === 'unhealthy').length,
      modules: reports,
    }
  }

  /**
   * 获取模块健康历史
   */
  getModuleHealthHistory(moduleId: string): ModuleHealthReport[] {
    return this.healthHistory.get(moduleId) || []
  }

  /**
   * 获取所有模块当前状态
   */
  async getCurrentHealth(): Promise<SystemHealthReport> {
    return this.performHealthCheck()
  }

  /**
   * 创建健康报告
   */
  private createReport(manifest: any, health: ModuleHealth, loadedAt?: number): ModuleHealthReport {
    const errorCount = this.errorCounts.get(manifest.id) || 0

    return {
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      status: health.status,
      lastCheck: new Date(health.timestamp),
      uptime: Date.now() - (loadedAt || Date.now()),
      errorCount,
      details: health.details,
    }
  }

  /**
   * 创建错误报告
   */
  private createErrorReport(manifest: any, error: any, loadedAt?: number): ModuleHealthReport {
    const errorCount = (this.errorCounts.get(manifest.id) || 0) + 1
    this.errorCounts.set(manifest.id, errorCount)

    return {
      moduleId: manifest.id,
      moduleName: manifest.name,
      version: manifest.version,
      status: 'unhealthy',
      lastCheck: new Date(),
      uptime: Date.now() - (loadedAt || Date.now()),
      errorCount,
      lastError: error.message,
      details: { error: error.stack },
    }
  }

  /**
   * 记录健康历史
   */
  private recordHealth(report: ModuleHealthReport): void {
    const history = this.healthHistory.get(report.moduleId) || []
    history.push(report)

    // 保持历史记录长度
    if (history.length > this.maxHistoryLength) {
      history.shift()
    }

    this.healthHistory.set(report.moduleId, history)
  }

  /**
   * 清除错误计数
   */
  clearErrorCount(moduleId: string): void {
    this.errorCounts.delete(moduleId)
  }
}
