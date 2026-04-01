/**
 * 插件管理热插拔模块
 * 提供插件市场、安装、卸载、启用、禁用功能
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { BaseModule } from '../../core/module/base-module'
import {
  ModuleManifest,
  ModuleContext,
  HotUpdateStrategy,
  ModuleMenuItem,
  ModulePermission,
  PermissionType,
  ModuleRoute,
  HttpMethod,
  ModuleEvent,
  EventType,
} from '../../core/module/interfaces'

// ============================================
// 模块清单定义
// ============================================

export const PLUGIN_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/plugin',
  name: '插件管理',
  version: '1.0.0',
  description: '插件市场、安装、卸载、启用、禁用管理',
  category: 'core',
  tags: ['plugin', 'extension', 'market', 'management'],
  dependencies: [{ id: '@daoda/auth', version: '>=1.0.0' }],
  permissions: [
    'plugin:view',
    'plugin:install',
    'plugin:uninstall',
    'plugin:enable',
    'plugin:disable',
    'plugin:update',
    'plugin:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
  builtin: true,
  system: true,
}

// ============================================
// 插件模块实现
// ============================================

export class PluginHotplugModule extends BaseModule {
  readonly manifest = PLUGIN_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    // 配置默认值
    await context.config.setModuleConfigs(this.manifest.id, {
      pluginsDir: './plugins',
      allowRemotePlugins: true,
      marketUrl: 'https://market.daoda.com/api/plugins',
      autoUpdate: false,
      maxInstalledPlugins: 50,
      requireSignature: false, // 是否需要签名验证
    })

    this.logger?.info('插件管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.logger?.info('插件管理模块已销毁')
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'plugin:view',
        name: '查看插件',
        description: '查看已安装插件和市场插件列表',
        type: PermissionType.ACTION,
        resource: 'plugin',
        action: 'view',
      },
      {
        id: 'plugin:install',
        name: '安装插件',
        description: '从市场安装插件',
        type: PermissionType.ACTION,
        resource: 'plugin',
        action: 'install',
      },
      {
        id: 'plugin:uninstall',
        name: '卸载插件',
        description: '卸载已安装的插件',
        type: PermissionType.ACTION,
        resource: 'plugin',
        action: 'uninstall',
      },
      {
        id: 'plugin:enable',
        name: '启用插件',
        description: '启用已安装的插件',
        type: PermissionType.ACTION,
        resource: 'plugin',
        action: 'enable',
      },
      {
        id: 'plugin:disable',
        name: '禁用插件',
        description: '禁用已启用的插件',
        type: PermissionType.ACTION,
        resource: 'plugin',
        action: 'disable',
      },
      {
        id: 'plugin:update',
        name: '更新插件',
        description: '更新插件到最新版本',
        type: PermissionType.ACTION,
        resource: 'plugin',
        action: 'update',
      },
      {
        id: 'plugin:admin',
        name: '插件管理员',
        description: '插件模块管理权限',
        type: PermissionType.ADMIN,
        resource: 'plugin',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'plugin-market',
        title: '插件市场',
        icon: 'AppstoreOutlined',
        path: '/settings/plugins/market',
        parentId: 'settings',
        order: 50,
        visible: true,
        permissions: ['plugin:view'],
      },
      {
        id: 'plugin-installed',
        title: '已安装插件',
        icon: 'ApiOutlined',
        path: '/settings/plugins/installed',
        parentId: 'settings',
        order: 51,
        visible: true,
        permissions: ['plugin:view'],
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      {
        path: '/api/v1/plugins/installed',
        method: HttpMethod.GET,
        handler: 'getInstalled',
        description: '获取已安装插件列表',
        permission: 'plugin:view',
      },
      {
        path: '/api/v1/plugins/market',
        method: HttpMethod.GET,
        handler: 'getMarket',
        description: '获取插件市场列表',
        permission: 'plugin:view',
      },
      {
        path: '/api/v1/plugins/:id',
        method: HttpMethod.GET,
        handler: 'getDetail',
        description: '获取插件详情',
        permission: 'plugin:view',
      },
      {
        path: '/api/v1/plugins/:id/install',
        method: HttpMethod.POST,
        handler: 'install',
        description: '安装插件',
        permission: 'plugin:install',
      },
      {
        path: '/api/v1/plugins/:id',
        method: HttpMethod.DELETE,
        handler: 'uninstall',
        description: '卸载插件',
        permission: 'plugin:uninstall',
      },
      {
        path: '/api/v1/plugins/:id/enable',
        method: HttpMethod.PUT,
        handler: 'enable',
        description: '启用插件',
        permission: 'plugin:enable',
      },
      {
        path: '/api/v1/plugins/:id/disable',
        method: HttpMethod.PUT,
        handler: 'disable',
        description: '禁用插件',
        permission: 'plugin:disable',
      },
      {
        path: '/api/v1/plugins/:id/update',
        method: HttpMethod.PUT,
        handler: 'update',
        description: '更新插件',
        permission: 'plugin:update',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'plugin.installed',
        type: EventType.SYSTEM,
        description: '插件安装事件',
      },
      {
        name: 'plugin.uninstalled',
        type: EventType.SYSTEM,
        description: '插件卸载事件',
      },
      {
        name: 'plugin.enabled',
        type: EventType.SYSTEM,
        description: '插件启用事件',
      },
      {
        name: 'plugin.disabled',
        type: EventType.SYSTEM,
        description: '插件禁用事件',
      },
      {
        name: 'plugin.updated',
        type: EventType.SYSTEM,
        description: '插件更新事件',
      },
      {
        name: 'plugin.error',
        type: EventType.SYSTEM,
        description: '插件错误事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const PLUGIN_HOTPLUG_MODULE = {
  manifest: PLUGIN_MODULE_MANIFEST,
  moduleClass: PluginHotplugModule,
}
