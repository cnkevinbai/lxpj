/**
 * ConfigCenterService 配置中心服务
 * 提供模块配置的动态管理能力
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Injectable } from '@nestjs/common'

/**
 * 配置项结构
 */
interface ConfigItem {
  key: string
  value: any
  moduleId?: string
  updatedAt: number
  type?: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  hotUpdate?: boolean
}

/**
 * ConfigCenterService
 *
 * 功能:
 * - 配置的获取和设置
 * - 模块级配置管理
 * - 配置热更新支持
 * - 配置变更通知
 *
 * @example
 * ```typescript
 * // 获取配置
 * const dbUrl = context.config.get('database.url');
 * const timeout = context.config.get('api.timeout', 30000); // 带默认值
 *
 * // 设置配置
 * await context.config.set('crm.max_customers', 10000);
 *
 * // 监听配置变更
 * context.config.watch('crm.max_customers', (newValue) => {
 *   console.log('配置已更新:', newValue);
 * });
 * ```
 */
@Injectable()
export class ConfigCenterService {
  /** 配置存储 */
  private configs: Map<string, ConfigItem> = new Map()

  /** 配置变更监听器 */
  private watchers: Map<string, Array<(newValue: any) => void>> = new Map()

  /** 系统默认配置 */
  private defaultConfigs: Record<string, any> = {
    // 数据库配置
    'database.url': 'postgresql://localhost:5432/daoda_platform',
    'database.pool.size': 10,
    'database.pool.timeout': 30000,

    // API 配置
    'api.timeout': 30000,
    'api.rateLimit.enabled': true,
    'api.rateLimit.limit': 100,
    'api.rateLimit.window': 60000,

    // JWT 配置
    'jwt.secret': 'daoda-platform-jwt-secret-key',
    'jwt.expiresIn': '7d',
    'jwt.refreshExpiresIn': '30d',

    // 日志配置
    'log.level': 'info',
    'log.format': 'json',

    // 缓存配置
    'cache.enabled': true,
    'cache.defaultTtl': 300,
    'cache.maxSize': 1000,

    // 文件上传配置
    'upload.maxSize': 10485760, // 10MB
    'upload.allowedTypes': ['jpg', 'png', 'pdf', 'doc', 'xlsx'],
  }

  constructor() {
    // 初始化默认配置
    this.loadDefaultConfigs()
  }

  /**
   * 加载默认配置
   */
  private loadDefaultConfigs(): void {
    for (const [key, value] of Object.entries(this.defaultConfigs)) {
      this.configs.set(key, {
        key,
        value,
        moduleId: 'core',
        updatedAt: Date.now(),
      })
    }
  }

  /**
   * 获取配置值
   * @param key 配置键
   * @param defaultValue 默认值 (配置不存在时返回)
   */
  get<T = any>(key: string, defaultValue?: T): T {
    const config = this.configs.get(key)
    if (config === undefined) {
      return defaultValue as T
    }
    return config.value as T
  }

  /**
   * 设置配置值
   * @param key 配置键
   * @param value 配置值
   * @param options 配置选项
   */
  async set(
    key: string,
    value: any,
    options?: {
      moduleId?: string
      type?: 'string' | 'number' | 'boolean' | 'json'
      description?: string
      hotUpdate?: boolean
    },
  ): Promise<void> {
    const oldValue = this.configs.get(key)?.value

    this.configs.set(key, {
      key,
      value,
      moduleId: options?.moduleId || 'system',
      updatedAt: Date.now(),
      type: options?.type,
      description: options?.description,
      hotUpdate: options?.hotUpdate ?? true,
    })

    // 触发变更监听器
    if (oldValue !== value) {
      this.notifyWatchers(key, value)
    }
  }

  /**
   * 检查配置是否存在
   * @param key 配置键
   */
  has(key: string): boolean {
    return this.configs.has(key)
  }

  /**
   * 删除配置
   * @param key 配置键
   */
  async delete(key: string): Promise<boolean> {
    const existed = this.configs.has(key)
    if (existed) {
      const value = this.configs.get(key)?.value
      this.configs.delete(key)
      this.notifyWatchers(key, undefined)
    }
    return existed
  }

  /**
   * 批量获取配置
   * @param pattern 配置键模式 (支持通配符)
   */
  getMultiple(pattern?: string): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [key, config] of this.configs) {
      if (pattern) {
        if (this.matchPattern(pattern, key)) {
          result[key] = config.value
        }
      } else {
        result[key] = config.value
      }
    }

    return result
  }

  /**
   * 获取模块配置
   * @param moduleId 模块ID
   */
  getModuleConfigs(moduleId: string): Record<string, any> {
    const result: Record<string, any> = {}

    for (const [key, config] of this.configs) {
      if (config.moduleId === moduleId) {
        result[key] = config.value
      }
    }

    return result
  }

  /**
   * 批量设置模块配置
   * @param moduleId 模块ID
   * @param configs 配置对象
   */
  async setModuleConfigs(moduleId: string, configs: Record<string, any>): Promise<void>

  /**
   * 批量设置模块配置（兼容新的调用方式）
   * @param configs 配置对象
   */
  async setModuleConfigs(configs: Record<string, any>): Promise<void>

  async setModuleConfigs(
    moduleIdOrConfigs: string | Record<string, any>,
    configs?: Record<string, any>,
  ): Promise<void> {
    let moduleId: string
    let configObj: Record<string, any>

    // 检测调用方式
    if (typeof moduleIdOrConfigs === 'string') {
      moduleId = moduleIdOrConfigs
      configObj = configs || {}
    } else {
      moduleId = 'system'
      configObj = moduleIdOrConfigs
    }

    for (const [key, value] of Object.entries(configObj)) {
      await this.set(key, value, { moduleId })
    }
  }

  /**
   * 删除模块的所有配置
   * @param moduleId 模块ID
   */
  async deleteModuleConfigs(moduleId: string): Promise<number> {
    let deleted = 0

    for (const [key, config] of this.configs) {
      if (config.moduleId === moduleId) {
        this.configs.delete(key)
        deleted++
      }
    }

    return deleted
  }

  /**
   * 监听配置变更
   * @param key 配置键 (支持通配符)
   * @param handler 变更处理函数
   */
  watch(key: string, handler: (newValue: any) => void): void {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, [])
    }
    this.watchers.get(key)!.push(handler)
  }

  /**
   * 取消监听配置变更
   * @param key 配置键
   * @param handler 处理函数
   */
  unwatch(key: string, handler: (newValue: any) => void): void {
    const watchers = this.watchers.get(key)
    if (watchers) {
      const index = watchers.indexOf(handler)
      if (index !== -1) {
        watchers.splice(index, 1)
      }
    }
  }

  /**
   * 通知监听器
   * @param key 配置键
   * @param newValue 新值
   */
  private notifyWatchers(key: string, newValue: any): void {
    const watchers = this.watchers.get(key)
    if (watchers) {
      watchers.forEach((handler) => handler(newValue))
    }

    // 通知通配符监听器
    for (const [watchKey, watchers] of this.watchers) {
      if (watchKey.includes('*') && this.matchPattern(watchKey, key)) {
        watchers.forEach((handler) => handler(newValue))
      }
    }
  }

  /**
   * 匹配模式（支持通配符）
   * @param pattern 模式
   * @param key 键
   */
  private matchPattern(pattern: string, key: string): boolean {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')
    return regex.test(key)
  }

  /**
   * 获取所有配置
   */
  getAllConfigs(): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [key, config] of this.configs) {
      result[key] = config.value
    }
    return result
  }
}
