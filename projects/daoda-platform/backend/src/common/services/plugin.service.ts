/**
 * 插件管理服务
 * 负责插件的安装、卸载、启用、禁用、更新
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as path from 'path'

export interface PluginInfo {
  id: string
  name: string
  version: string
  description: string
  author: string
  enabled: boolean
  installed: boolean
  installPath?: string
  installedAt?: Date
  updatedAt?: Date
  permissions: string[]
  dependencies: { id: string; version: string }[]
  rating: number
  downloads: number
  icon?: string
  homepage?: string
  repository?: string
}

export interface PluginMarketItem extends PluginInfo {
  price: number
  category: string
  tags: string[]
  screenshots: string[]
  readme: string
  versions: { version: string; date: string; notes: string }[]
}

@Injectable()
export class PluginService implements OnModuleInit {
  private pluginsDir: string
  private installedPlugins: Map<string, PluginInfo> = new Map()

  constructor(private configService: ConfigService) {
    this.pluginsDir = this.configService.get('PLUGINS_DIR', path.join(process.cwd(), 'plugins'))
  }

  async onModuleInit() {
    await this.ensurePluginsDirectory()
    await this.loadInstalledPlugins()
  }

  /**
   * 确保插件目录存在
   */
  private async ensurePluginsDirectory(): Promise<void> {
    if (!fs.existsSync(this.pluginsDir)) {
      fs.mkdirSync(this.pluginsDir, { recursive: true })
      // 创建子目录
      fs.mkdirSync(path.join(this.pluginsDir, 'installed'), { recursive: true })
      fs.mkdirSync(path.join(this.pluginsDir, 'temp'), { recursive: true })
    }
  }

  /**
   * 加载已安装插件列表
   */
  private async loadInstalledPlugins(): Promise<void> {
    const installedDir = path.join(this.pluginsDir, 'installed')

    if (!fs.existsSync(installedDir)) {
      return
    }

    const pluginDirs = fs
      .readdirSync(installedDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    for (const pluginDir of pluginDirs) {
      const manifestPath = path.join(installedDir, pluginDir, 'plugin.json')

      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
          this.installedPlugins.set(manifest.id, {
            ...manifest,
            installed: true,
            installPath: path.join(installedDir, pluginDir),
          })
        } catch (error) {
          console.error(`Failed to load plugin manifest: ${pluginDir}`, error)
        }
      }
    }
  }

  /**
   * 获取已安装插件列表
   */
  async getInstalledPlugins(): Promise<PluginInfo[]> {
    return Array.from(this.installedPlugins.values())
  }

  /**
   * 获取插件市场列表
   */
  async getMarketPlugins(): Promise<PluginMarketItem[]> {
    // 模拟市场数据 - 实际应从远程 API 获取
    const marketPlugins: PluginMarketItem[] = [
      {
        id: '@daoda/plugin-ai-assistant',
        name: 'AI 智能助手',
        version: '1.2.0',
        description: '集成 AI 能力，提供智能客服、智能推荐、智能分析等功能',
        author: '道达智能',
        enabled: false,
        installed: false,
        permissions: ['ai:chat', 'ai:analyze'],
        dependencies: [],
        rating: 4.8,
        downloads: 1250,
        price: 0,
        category: 'productivity',
        tags: ['ai', 'chatbot', 'assistant'],
        screenshots: [],
        readme: '# AI 智能助手\n\n集成 GPT 模型，提供智能对话能力。',
        versions: [
          { version: '1.2.0', date: '2026-03-28', notes: '新增多模型支持' },
          { version: '1.1.0', date: '2026-03-15', notes: '优化响应速度' },
          { version: '1.0.0', date: '2026-03-01', notes: '首个版本发布' },
        ],
      },
      {
        id: '@daoda/plugin-advanced-report',
        name: '高级报表引擎',
        version: '2.0.1',
        description: '强大的报表设计引擎，支持自定义报表、数据可视化、导出功能',
        author: '道达智能',
        enabled: false,
        installed: false,
        permissions: ['report:create', 'report:export', 'report:schedule'],
        dependencies: [],
        rating: 4.6,
        downloads: 890,
        price: 999,
        category: 'analytics',
        tags: ['report', 'chart', 'export'],
        screenshots: [],
        readme: '# 高级报表引擎\n\n支持拖拽式报表设计。',
        versions: [
          { version: '2.0.1', date: '2026-03-25', notes: '修复导出问题' },
          { version: '2.0.0', date: '2026-03-20', notes: '全新设计器' },
        ],
      },
      {
        id: '@daoda/plugin-workflow-engine',
        name: '工作流引擎',
        version: '1.5.0',
        description: '可视化流程设计器，支持审批流、业务流、自动化流程',
        author: '道达智能',
        enabled: false,
        installed: false,
        permissions: ['workflow:create', 'workflow:manage'],
        dependencies: [],
        rating: 4.9,
        downloads: 2100,
        price: 0,
        category: 'automation',
        tags: ['workflow', 'approval', 'automation'],
        screenshots: [],
        readme: '# 工作流引擎\n\n可视化流程编排。',
        versions: [{ version: '1.5.0', date: '2026-03-30', notes: '新增条件分支' }],
      },
      {
        id: '@daoda/plugin-data-sync',
        name: '数据同步中心',
        version: '1.0.0',
        description: '多数据源同步，支持 MySQL、PostgreSQL、MongoDB、ES 等',
        author: '道达智能',
        enabled: false,
        installed: false,
        permissions: ['sync:create', 'sync:execute'],
        dependencies: [],
        rating: 4.5,
        downloads: 560,
        price: 0,
        category: 'integration',
        tags: ['sync', 'etl', 'data'],
        screenshots: [],
        readme: '# 数据同步中心\n\n多数据源同步管理。',
        versions: [{ version: '1.0.0', date: '2026-03-10', notes: '首个版本' }],
      },
      {
        id: '@daoda/plugin-iot-gateway',
        name: 'IoT 网关',
        version: '1.3.0',
        description: '物联网设备接入网关，支持 MQTT、CoAP、HTTP 协议',
        author: '道达智能',
        enabled: false,
        installed: false,
        permissions: ['iot:device', 'iot:gateway'],
        dependencies: [],
        rating: 4.7,
        downloads: 780,
        price: 1999,
        category: 'iot',
        tags: ['iot', 'mqtt', 'device'],
        screenshots: [],
        readme: '# IoT 网关\n\n设备接入管理。',
        versions: [{ version: '1.3.0', date: '2026-03-28', notes: '新增设备影子' }],
      },
    ]

    // 标记已安装的插件
    return marketPlugins.map((plugin) => ({
      ...plugin,
      installed: this.installedPlugins.has(plugin.id),
      enabled: this.installedPlugins.get(plugin.id)?.enabled || false,
    }))
  }

  /**
   * 安装插件
   */
  async installPlugin(pluginId: string): Promise<PluginInfo> {
    // 检查是否已安装
    if (this.installedPlugins.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is already installed`)
    }

    // 模拟安装过程
    const marketPlugins = await this.getMarketPlugins()
    const plugin = marketPlugins.find((p) => p.id === pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found in market`)
    }

    // 创建插件目录
    const installPath = path.join(
      this.pluginsDir,
      'installed',
      pluginId.replace('@', '').replace('/', '-'),
    )
    fs.mkdirSync(installPath, { recursive: true })

    // 写入插件清单
    const pluginInfo: PluginInfo = {
      ...plugin,
      installed: true,
      enabled: false,
      installPath,
      installedAt: new Date(),
    }

    fs.writeFileSync(path.join(installPath, 'plugin.json'), JSON.stringify(pluginInfo, null, 2))

    this.installedPlugins.set(pluginId, pluginInfo)

    return pluginInfo
  }

  /**
   * 卸载插件
   */
  async uninstallPlugin(pluginId: string): Promise<void> {
    const plugin = this.installedPlugins.get(pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`)
    }

    // 如果插件已启用，先禁用
    if (plugin.enabled) {
      await this.disablePlugin(pluginId)
    }

    // 删除插件目录
    if (plugin.installPath && fs.existsSync(plugin.installPath)) {
      fs.rmSync(plugin.installPath, { recursive: true })
    }

    this.installedPlugins.delete(pluginId)
  }

  /**
   * 启用插件
   */
  async enablePlugin(pluginId: string): Promise<PluginInfo> {
    const plugin = this.installedPlugins.get(pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`)
    }

    // 检查依赖
    for (const dep of plugin.dependencies) {
      const depPlugin = this.installedPlugins.get(dep.id)
      if (!depPlugin || !depPlugin.enabled) {
        throw new Error(`Dependency ${dep.id} is not installed or enabled`)
      }
    }

    plugin.enabled = true
    plugin.updatedAt = new Date()

    // 更新清单文件
    if (plugin.installPath) {
      fs.writeFileSync(
        path.join(plugin.installPath, 'plugin.json'),
        JSON.stringify(plugin, null, 2),
      )
    }

    this.installedPlugins.set(pluginId, plugin)

    return plugin
  }

  /**
   * 禁用插件
   */
  async disablePlugin(pluginId: string): Promise<PluginInfo> {
    const plugin = this.installedPlugins.get(pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`)
    }

    plugin.enabled = false
    plugin.updatedAt = new Date()

    // 更新清单文件
    if (plugin.installPath) {
      fs.writeFileSync(
        path.join(plugin.installPath, 'plugin.json'),
        JSON.stringify(plugin, null, 2),
      )
    }

    this.installedPlugins.set(pluginId, plugin)

    return plugin
  }

  /**
   * 更新插件
   */
  async updatePlugin(pluginId: string): Promise<PluginInfo> {
    const plugin = this.installedPlugins.get(pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} is not installed`)
    }

    // 模拟更新
    const marketPlugins = await this.getMarketPlugins()
    const latestPlugin = marketPlugins.find((p) => p.id === pluginId)

    if (!latestPlugin) {
      throw new Error(`Plugin ${pluginId} not found in market`)
    }

    if (latestPlugin.version === plugin.version) {
      return plugin // 已是最新版本
    }

    // 更新版本
    plugin.version = latestPlugin.version
    plugin.updatedAt = new Date()

    // 更新清单文件
    if (plugin.installPath) {
      fs.writeFileSync(
        path.join(plugin.installPath, 'plugin.json'),
        JSON.stringify(plugin, null, 2),
      )
    }

    this.installedPlugins.set(pluginId, plugin)

    return plugin
  }

  /**
   * 获取插件详情
   */
  async getPluginDetail(pluginId: string): Promise<PluginInfo | PluginMarketItem> {
    // 优先从已安装列表获取
    const installed = this.installedPlugins.get(pluginId)
    if (installed) {
      return installed
    }

    // 从市场获取
    const marketPlugins = await this.getMarketPlugins()
    const marketPlugin = marketPlugins.find((p) => p.id === pluginId)

    if (marketPlugin) {
      return marketPlugin
    }

    throw new Error(`Plugin ${pluginId} not found`)
  }
}
