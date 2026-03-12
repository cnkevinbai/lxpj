/**
 * 插件系统集成入口
 * 渔晓白 ⚙️ · 专业交付
 */

import { pluginManager } from '@evcart/plugin-system'
import { PluginContext } from '@evcart/plugin-system/types'

/**
 * 初始化插件系统
 */
export async function initializePlugins(context: PluginContext): Promise<void> {
  try {
    // 初始化插件管理器
    await pluginManager.initialize(context)
    
    console.log('✅ 插件系统初始化完成')
    
    // 触发应用初始化钩子
    await pluginManager.emitHook('onAppInit', context)
    
    // 注册插件系统事件监听
    pluginManager.on('plugin:enable', (event) => {
      console.log(`🔌 插件启用：${event.payload.pluginName}`)
    })
    
    pluginManager.on('plugin:disable', (event) => {
      console.log(`🔌 插件禁用：${event.payload.pluginName}`)
    })
    
    pluginManager.on('plugin:uninstall', (event) => {
      console.log(`🔌 插件卸载：${event.payload.pluginName}`)
    })
  } catch (error) {
    console.error('❌ 插件系统初始化失败:', error)
  }
}

/**
 * 注册内置插件
 */
export async function registerBuiltInPlugins(): Promise<void> {
  const builtInPlugins = [
    // 示例：导出插件
    // './plugins/export-plugin',
    
    // 示例：AI 助手插件
    // './plugins/ai-assistant',
  ]
  
  for (const pluginPath of builtInPlugins) {
    try {
      await pluginManager.register(pluginPath)
      console.log(`✅ 内置插件注册成功：${pluginPath}`)
    } catch (error) {
      console.error(`❌ 内置插件注册失败：${pluginPath}`, error)
    }
  }
}

/**
 * 加载用户插件
 */
export async function loadUserPlugins(): Promise<void> {
  // 从配置加载用户安装的插件
  const userPlugins = localStorage.getItem('installed_plugins')
  if (!userPlugins) return
  
  try {
    const plugins = JSON.parse(userPlugins)
    for (const plugin of plugins) {
      if (plugin.enabled) {
        await pluginManager.enable(plugin.name)
      }
    }
  } catch (error) {
    console.error('加载用户插件失败:', error)
  }
}

/**
 * 获取插件状态
 */
export function getPluginStatus() {
  return {
    total: pluginManager.getAllPlugins().length,
    enabled: pluginManager.getEnabledPlugins().length,
    registry: pluginManager.getRegistry(),
  }
}

export default {
  initializePlugins,
  registerBuiltInPlugins,
  loadUserPlugins,
  getPluginStatus,
}
