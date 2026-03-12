/**
 * 插件管理器
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Plugin,
  PluginManifest,
  PluginContext,
  PluginConfig,
  PluginRegistry,
  PluginEvent,
} from './types'

export class PluginManager {
  /** 已注册的插件 */
  private plugins: Map<string, Plugin> = new Map()
  
  /** 插件配置 */
  private configs: Map<string, PluginConfig> = new Map()
  
  /** 插件注册表 */
  private registry: Map<string, PluginRegistry> = new Map()
  
  /** 插件上下文 */
  private context?: PluginContext
  
  /** 事件监听器 */
  private eventListeners: Map<string, Array<(event: PluginEvent) => void>> = new Map()

  /**
   * 初始化插件管理器
   */
  async initialize(context: PluginContext): Promise<void> {
    this.context = context
    await this.loadPlugins()
  }

  /**
   * 加载所有插件
   */
  private async loadPlugins(): Promise<void> {
    // 从插件目录加载
    const pluginPaths = await this.discoverPlugins()
    
    for (const path of pluginPaths) {
      try {
        await this.register(path)
      } catch (error) {
        console.error(`Failed to load plugin from ${path}:`, error)
      }
    }

    // 自动启用配置的插件
    for (const [name, config] of this.configs) {
      if (config.autoEnable && config.enabled) {
        await this.enable(name)
      }
    }
  }

  /**
   * 发现插件
   */
  private async discoverPlugins(): Promise<string[]> {
    // 实现插件发现逻辑
    // 可以扫描 plugins 目录或从配置文件读取
    return []
  }

  /**
   * 注册插件
   */
  async register(pluginPath: string): Promise<void> {
    // 加载插件清单
    const manifest = await this.loadManifest(pluginPath)
    
    // 验证依赖
    await this.validateDependencies(manifest)
    
    // 加载插件类
    const PluginClass = await this.loadPluginClass(pluginPath, manifest.main)
    
    // 创建插件实例
    const plugin = new PluginClass(manifest)
    
    // 存储插件
    this.plugins.set(manifest.name, plugin)
    
    // 更新注册表
    this.registry.set(manifest.name, {
      name: manifest.name,
      version: manifest.version,
      path: pluginPath,
      installedAt: new Date(),
      updatedAt: new Date(),
      enabled: false,
      manifest,
    })
    
    // 调用安装钩子
    if (plugin.onInstall) {
      await plugin.onInstall(this.context!)
    }
    
    console.log(`Plugin registered: ${manifest.displayName} v${manifest.version}`)
  }

  /**
   * 加载插件清单
   */
  private async loadManifest(pluginPath: string): Promise<PluginManifest> {
    const manifestPath = `${pluginPath}/manifest.json`
    const response = await fetch(manifestPath)
    return response.json()
  }

  /**
   * 加载插件类
   */
  private async loadPluginClass(pluginPath: string, mainFile: string): Promise<typeof Plugin> {
    const module = await import(`${pluginPath}/${mainFile}`)
    return module.default
  }

  /**
   * 验证依赖
   */
  private async validateDependencies(manifest: PluginManifest): Promise<void> {
    if (!manifest.dependencies) return

    for (const [name, version] of Object.entries(manifest.dependencies)) {
      if (name === 'core') {
        // 验证核心版本
        const coreVersion = this.getCoreVersion()
        if (!this.satisfiesVersion(coreVersion, version)) {
          throw new Error(
            `Plugin ${manifest.name} requires core ${version}, but got ${coreVersion}`
          )
        }
      } else {
        // 验证其他插件依赖
        const depPlugin = this.plugins.get(name)
        if (!depPlugin) {
          throw new Error(
            `Plugin ${manifest.name} requires dependency ${name}`
          )
        }
        if (!this.satisfiesVersion(depPlugin.manifest.version, version)) {
          throw new Error(
            `Plugin ${manifest.name} requires ${name} ${version}, but got ${depPlugin.manifest.version}`
          )
        }
      }
    }
  }

  /**
   * 版本匹配检查
   */
  private satisfiesVersion(current: string, required: string): boolean {
    // 简单的语义化版本检查
    // 实际应使用 semver 库
    return true
  }

  /**
   * 获取核心版本
   */
  private getCoreVersion(): string {
    return '1.0.0'
  }

  /**
   * 启用插件
   */
  async enable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    const config = this.configs.get(pluginName) || { enabled: false }
    if (config.enabled) {
      console.log(`Plugin ${pluginName} is already enabled`)
      return
    }

    // 调用启用钩子
    if (plugin.onEnable) {
      await plugin.onEnable(this.context!)
    }

    // 更新配置
    config.enabled = true
    this.configs.set(pluginName, config)

    // 更新注册表
    const registry = this.registry.get(pluginName)!
    registry.enabled = true
    registry.updatedAt = new Date()
    this.registry.set(pluginName, registry)

    // 触发事件
    this.emit('plugin:enable', { pluginName })

    console.log(`Plugin enabled: ${plugin.manifest.displayName}`)
  }

  /**
   * 禁用插件
   */
  async disable(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    const config = this.configs.get(pluginName)
    if (!config || !config.enabled) {
      console.log(`Plugin ${pluginName} is already disabled`)
      return
    }

    // 调用禁用钩子
    if (plugin.onDisable) {
      await plugin.onDisable(this.context!)
    }

    // 更新配置
    config.enabled = false
    this.configs.set(pluginName, config)

    // 更新注册表
    const registry = this.registry.get(pluginName)!
    registry.enabled = false
    registry.updatedAt = new Date()
    this.registry.set(pluginName, registry)

    // 触发事件
    this.emit('plugin:disable', { pluginName })

    console.log(`Plugin disabled: ${plugin.manifest.displayName}`)
  }

  /**
   * 卸载插件
   */
  async unregister(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName)
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`)
    }

    // 先禁用
    if (this.configs.get(pluginName)?.enabled) {
      await this.disable(pluginName)
    }

    // 调用卸载钩子
    if (plugin.onUninstall) {
      await plugin.onUninstall(this.context!)
    }

    // 删除插件
    this.plugins.delete(pluginName)
    this.configs.delete(pluginName)
    this.registry.delete(pluginName)

    // 触发事件
    this.emit('plugin:uninstall', { pluginName })

    console.log(`Plugin uninstalled: ${plugin.manifest.displayName}`)
  }

  /**
   * 获取插件
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  /**
   * 获取所有插件
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * 获取启用的插件
   */
  getEnabledPlugins(): Plugin[] {
    return this.getAllPlugins().filter(plugin => 
      this.configs.get(plugin.manifest.name)?.enabled
    )
  }

  /**
   * 获取插件注册表
   */
  getRegistry(): PluginRegistry[] {
    return Array.from(this.registry.values())
  }

  /**
   * 检查插件是否启用
   */
  isPluginEnabled(name: string): boolean {
    return this.configs.get(name)?.enabled || false
  }

  // ========== 事件系统 ==========

  /**
   * 注册事件监听
   */
  on(event: string, callback: (event: PluginEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  /**
   * 移除事件监听
   */
  off(event: string, callback: (event: PluginEvent) => void): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(type: string, payload?: any): void {
    const event: PluginEvent = {
      type,
      payload,
      timestamp: new Date(),
      source: 'PluginManager',
    }

    const listeners = this.eventListeners.get(type) || []
    listeners.forEach(listener => listener(event))
  }

  /**
   * 触发插件钩子
   */
  async emitHook(hookName: string, ...args: any[]): Promise<void> {
    const plugins = this.getEnabledPlugins()
    
    for (const plugin of plugins) {
      const hook = (plugin as any)[hookName]
      if (typeof hook === 'function') {
        try {
          await hook.call(plugin, ...args, this.context)
        } catch (error) {
          console.error(`Error in plugin ${plugin.manifest.name} hook ${hookName}:`, error)
        }
      }
    }
  }
}

// 导出单例
export const pluginManager = new PluginManager()
