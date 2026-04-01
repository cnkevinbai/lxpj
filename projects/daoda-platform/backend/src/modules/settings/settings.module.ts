/**
 * Settings 模块定义
 * 热插拔模块 - 聚合系统配置、用户管理、角色管理、菜单管理、租户管理、日志管理、Webhook管理
 *
 * 系统设置核心模块，提供完整的系统管理功能
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { BaseModule } from '../../core/module/base-module'
import {
  ModuleManifest,
  ModuleContext,
  HotUpdateStrategy,
  ModuleMenuItem,
} from '../../core/module/interfaces'
import { HttpMethod, ModuleRoute } from '../../core/module/interfaces/module-route.interface'
import {
  ModulePermission,
  PermissionType,
} from '../../core/module/interfaces/module-permission.interface'
import { ModuleEvent, EventType } from '../../core/module/interfaces/module-event.interface'

// ============================================
// 模块清单定义
// ============================================

export const SETTINGS_MODULE_MANIFEST: ModuleManifest = {
  // 基本信息
  id: '@daoda/settings',
  name: '系统设置管理',
  version: '1.0.0',
  description:
    '系统设置模块，包含用户管理、角色管理、菜单管理、系统配置、租户管理、日志管理、Webhook管理',

  // 分类
  category: 'core',
  tags: [
    'settings',
    'system',
    'user',
    'role',
    'menu',
    'config',
    'tenant',
    'log',
    'webhook',
    'admin',
  ],

  // 依赖
  dependencies: [{ id: '@daoda/auth', version: '>=1.0.0' }],

  // 权限声明
  permissions: [
    'settings:user:view',
    'settings:user:create',
    'settings:user:update',
    'settings:user:delete',
    'settings:role:view',
    'settings:role:create',
    'settings:role:update',
    'settings:role:delete',
    'settings:menu:view',
    'settings:menu:create',
    'settings:menu:update',
    'settings:menu:delete',
    'settings:config:view',
    'settings:config:update',
    'settings:tenant:view',
    'settings:tenant:create',
    'settings:tenant:update',
    'settings:tenant:delete',
    'settings:log:view',
    'settings:log:export',
    'settings:webhook:view',
    'settings:webhook:create',
    'settings:webhook:update',
    'settings:webhook:delete',
    'settings:webhook:test',
    'settings:module:view',
    'settings:module:enable',
    'settings:module:disable',
    'settings:admin:all',
  ],

  // 热更新配置
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },

  // 技术信息
  routePrefix: '/api/v1/settings',
  tablePrefix: 'sys_',
}

// ============================================
// Settings 模块实现
// ============================================

/**
 * Settings 聚合模块
 * 系统管理核心 - 用户/角色/菜单/配置/租户/日志/Webhook
 */
export class SettingsModule extends BaseModule {
  // 模块清单
  readonly manifest = SETTINGS_MODULE_MANIFEST

  // ============================================
  // 生命周期钩子
  // ============================================

  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('Settings模块安装开始...')

    // 检查数据库表
    const prisma = context.serviceRegistry.get<any>('prisma')
    if (prisma) {
      try {
        await prisma.user.findFirst()
        await prisma.role.findFirst()
        await prisma.menu.findFirst()
        await prisma.systemConfig.findFirst()
        await prisma.tenant.findFirst()
        await prisma.log.findFirst()
        await prisma.webhook.findFirst()
        this.logger?.info('Settings数据表验证成功')
      } catch (error) {
        this.logger?.warn('Settings数据表可能不存在，需要初始化')
      }
    }

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      // 用户配置
      user: {
        sequencePrefix: 'USR',
        autoNumber: true,
        defaultRole: 'user',
        passwordMinLength: 8,
        requirePasswordChange: true,
        sessionTimeoutMinutes: 30,
        maxFailedAttempts: 5,
        lockoutDurationMinutes: 15,
      },
      // 角色配置
      role: {
        defaultPermissions: ['dashboard:view'],
        adminRole: 'admin',
        superAdminRole: 'super_admin',
      },
      // 菜单配置
      menu: {
        maxLevel: 3,
        defaultIcon: 'folder',
        cacheEnabled: true,
      },
      // 系统配置
      system: {
        siteName: '道达智能数字化平台',
        siteUrl: 'https://daoda.ai',
        logo: '/assets/logo.png',
        favicon: '/assets/favicon.ico',
        theme: 'dark',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
      },
      // 租户配置
      tenant: {
        maxTenants: 100,
        defaultQuota: {
          users: 50,
          storage: 1024, // MB
          apiCalls: 10000,
        },
        trialDays: 30,
      },
      // 日志配置
      log: {
        retentionDays: 90,
        maxExportRows: 10000,
        levels: ['debug', 'info', 'warn', 'error'],
        defaultLevel: 'info',
      },
      // Webhook配置
      webhook: {
        timeoutMs: 30000,
        retryAttempts: 3,
        retryDelayMs: 1000,
        maxPayloadSize: 1024, // KB
      },
      // 模块配置
      module: {
        autoEnableNew: false,
        requireApproval: true,
        maxEnabled: 50,
      },
    })

    this.logger?.info('Settings模块安装完成')
  }

  /**
   * 初始化钩子
   */
  async onInit(): Promise<void> {
    await super.onInit()

    this.logger?.info('Settings模块初始化...')

    // 注册内部服务
    this._context?.serviceRegistry.register(this.manifest.id, 'user', {
      service: 'user',
      methods: ['create', 'update', 'delete', 'resetPassword', 'unlock', 'assignRole', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'role', {
      service: 'role',
      methods: ['create', 'update', 'delete', 'assignPermissions', 'getUsers', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'menu', {
      service: 'menu',
      methods: ['create', 'update', 'delete', 'reorder', 'getTree', 'getUserMenu', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'config', {
      service: 'config',
      methods: ['get', 'set', 'delete', 'getModule', 'setModule', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'tenant', {
      service: 'tenant',
      methods: ['create', 'update', 'delete', 'switch', 'getQuota', 'checkQuota', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'log', {
      service: 'log',
      methods: ['create', 'query', 'export', 'clean', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'webhook', {
      service: 'webhook',
      methods: ['create', 'update', 'delete', 'trigger', 'test', 'getHistory', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'module', {
      service: 'module',
      methods: ['list', 'enable', 'disable', 'install', 'uninstall', 'getInfo', 'getStats'],
    })

    this.logger?.info('Settings模块服务注册完成')
  }

  /**
   * 启动钩子
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('Settings模块启动...')

    // 发送启动事件
    this.eventBus?.emit('settings.started', {
      moduleId: this.manifest.id,
      version: this.manifest.version,
      timestamp: new Date().toISOString(),
    })

    // 检查系统健康状态
    await this.checkSystemHealth()

    // 检查过期租户
    await this.checkExpiredTenants()

    // 检查日志清理
    await this.checkLogCleanup()

    this.logger?.info('Settings模块已启动')
  }

  /**
   * 停止钩子
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('Settings模块停止...')

    // 发送停止事件
    this.eventBus?.emit('settings.stopped', {
      moduleId: this.manifest.id,
      timestamp: new Date().toISOString(),
    })

    this.logger?.info('Settings模块已停止')
  }

  /**
   * 卸载钩子
   */
  async onUninstall(): Promise<void> {
    await super.onUninstall()

    this.logger?.info('Settings模块卸载...')

    // 清理服务注册
    this._context?.serviceRegistry.unregister(this.manifest.id, 'user')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'role')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'menu')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'config')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'tenant')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'log')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'webhook')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'module')

    this.logger?.info('Settings模块已卸载')
  }

  /**
   * 健康检查
   */
  async onHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    details: any
    timestamp: number
  }> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')

    const checks = {
      database: false,
      userService: false,
      roleService: false,
      menuService: false,
      configService: false,
      tenantService: false,
      logService: false,
      webhookService: false,
      moduleService: false,
    }

    try {
      // 检查数据库连接
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`
        checks.database = true
      }

      // 检查服务注册
      checks.userService = this._context?.serviceRegistry.get('user') !== undefined
      checks.roleService = this._context?.serviceRegistry.get('role') !== undefined
      checks.menuService = this._context?.serviceRegistry.get('menu') !== undefined
      checks.configService = this._context?.serviceRegistry.get('config') !== undefined
      checks.tenantService = this._context?.serviceRegistry.get('tenant') !== undefined
      checks.logService = this._context?.serviceRegistry.get('log') !== undefined
      checks.webhookService = this._context?.serviceRegistry.get('webhook') !== undefined
      checks.moduleService = this._context?.serviceRegistry.get('module') !== undefined
    } catch (error) {
      this.logger?.error('Settings健康检查失败', error)
    }

    const healthyCount = Object.values(checks).filter(Boolean).length
    const status: 'healthy' | 'degraded' | 'unhealthy' =
      healthyCount === 9 ? 'healthy' : healthyCount >= 6 ? 'degraded' : 'unhealthy'

    return {
      status,
      details: {
        checks,
        healthyCount,
        totalCount: 9,
      },
      timestamp: Date.now(),
    }
  }

  // ============================================
  // 扩展点注册
  // ============================================

  /**
   * 获取路由定义
   */
  getRoutes(): ModuleRoute[] {
    return [
      // ===== 用户管理 API =====
      {
        path: '/user',
        method: HttpMethod.GET,
        handler: 'user.list',
        description: '用户列表查询',
        permission: 'settings:user:view',
      },
      {
        path: '/user/:id',
        method: HttpMethod.GET,
        handler: 'user.detail',
        description: '用户详情',
        permission: 'settings:user:view',
      },
      {
        path: '/user',
        method: HttpMethod.POST,
        handler: 'user.create',
        description: '创建用户',
        permission: 'settings:user:create',
      },
      {
        path: '/user/:id',
        method: HttpMethod.PUT,
        handler: 'user.update',
        description: '更新用户',
        permission: 'settings:user:update',
      },
      {
        path: '/user/:id',
        method: HttpMethod.DELETE,
        handler: 'user.delete',
        description: '删除用户',
        permission: 'settings:user:delete',
      },
      {
        path: '/user/:id/reset-password',
        method: HttpMethod.POST,
        handler: 'user.resetPassword',
        description: '重置密码',
        permission: 'settings:user:update',
      },
      {
        path: '/user/:id/unlock',
        method: HttpMethod.POST,
        handler: 'user.unlock',
        description: '解锁用户',
        permission: 'settings:user:update',
      },
      {
        path: '/user/:id/roles',
        method: HttpMethod.POST,
        handler: 'user.assignRole',
        description: '分配角色',
        permission: 'settings:user:update',
      },
      {
        path: '/user/stats',
        method: HttpMethod.GET,
        handler: 'user.stats',
        description: '用户统计',
        permission: 'settings:user:view',
      },

      // ===== 角色管理 API =====
      {
        path: '/role',
        method: HttpMethod.GET,
        handler: 'role.list',
        description: '角色列表查询',
        permission: 'settings:role:view',
      },
      {
        path: '/role/:id',
        method: HttpMethod.GET,
        handler: 'role.detail',
        description: '角色详情',
        permission: 'settings:role:view',
      },
      {
        path: '/role',
        method: HttpMethod.POST,
        handler: 'role.create',
        description: '创建角色',
        permission: 'settings:role:create',
      },
      {
        path: '/role/:id',
        method: HttpMethod.PUT,
        handler: 'role.update',
        description: '更新角色',
        permission: 'settings:role:update',
      },
      {
        path: '/role/:id',
        method: HttpMethod.DELETE,
        handler: 'role.delete',
        description: '删除角色',
        permission: 'settings:role:delete',
      },
      {
        path: '/role/:id/permissions',
        method: HttpMethod.POST,
        handler: 'role.assignPermissions',
        description: '分配权限',
        permission: 'settings:role:update',
      },
      {
        path: '/role/:id/users',
        method: HttpMethod.GET,
        handler: 'role.getUsers',
        description: '角色用户列表',
        permission: 'settings:role:view',
      },
      {
        path: '/role/stats',
        method: HttpMethod.GET,
        handler: 'role.stats',
        description: '角色统计',
        permission: 'settings:role:view',
      },

      // ===== 菜单管理 API =====
      {
        path: '/menu',
        method: HttpMethod.GET,
        handler: 'menu.list',
        description: '菜单列表查询',
        permission: 'settings:menu:view',
      },
      {
        path: '/menu/tree',
        method: HttpMethod.GET,
        handler: 'menu.tree',
        description: '菜单树结构',
        permission: 'settings:menu:view',
      },
      {
        path: '/menu/:id',
        method: HttpMethod.GET,
        handler: 'menu.detail',
        description: '菜单详情',
        permission: 'settings:menu:view',
      },
      {
        path: '/menu',
        method: HttpMethod.POST,
        handler: 'menu.create',
        description: '创建菜单',
        permission: 'settings:menu:create',
      },
      {
        path: '/menu/:id',
        method: HttpMethod.PUT,
        handler: 'menu.update',
        description: '更新菜单',
        permission: 'settings:menu:update',
      },
      {
        path: '/menu/:id',
        method: HttpMethod.DELETE,
        handler: 'menu.delete',
        description: '删除菜单',
        permission: 'settings:menu:delete',
      },
      {
        path: '/menu/reorder',
        method: HttpMethod.POST,
        handler: 'menu.reorder',
        description: '菜单排序',
        permission: 'settings:menu:update',
      },
      {
        path: '/menu/user',
        method: HttpMethod.GET,
        handler: 'menu.userMenu',
        description: '用户菜单',
        permission: 'settings:menu:view',
      },

      // ===== 系统配置 API =====
      {
        path: '/config',
        method: HttpMethod.GET,
        handler: 'config.list',
        description: '配置列表查询',
        permission: 'settings:config:view',
      },
      {
        path: '/config/:key',
        method: HttpMethod.GET,
        handler: 'config.get',
        description: '获取配置项',
        permission: 'settings:config:view',
      },
      {
        path: '/config/:key',
        method: HttpMethod.PUT,
        handler: 'config.set',
        description: '设置配置项',
        permission: 'settings:config:update',
      },
      {
        path: '/config/:key',
        method: HttpMethod.DELETE,
        handler: 'config.delete',
        description: '删除配置项',
        permission: 'settings:config:update',
      },
      {
        path: '/config/module/:moduleId',
        method: HttpMethod.GET,
        handler: 'config.getModule',
        description: '获取模块配置',
        permission: 'settings:config:view',
      },
      {
        path: '/config/module/:moduleId',
        method: HttpMethod.PUT,
        handler: 'config.setModule',
        description: '设置模块配置',
        permission: 'settings:config:update',
      },

      // ===== 租户管理 API =====
      {
        path: '/tenant',
        method: HttpMethod.GET,
        handler: 'tenant.list',
        description: '租户列表查询',
        permission: 'settings:tenant:view',
      },
      {
        path: '/tenant/:id',
        method: HttpMethod.GET,
        handler: 'tenant.detail',
        description: '租户详情',
        permission: 'settings:tenant:view',
      },
      {
        path: '/tenant',
        method: HttpMethod.POST,
        handler: 'tenant.create',
        description: '创建租户',
        permission: 'settings:tenant:create',
      },
      {
        path: '/tenant/:id',
        method: HttpMethod.PUT,
        handler: 'tenant.update',
        description: '更新租户',
        permission: 'settings:tenant:update',
      },
      {
        path: '/tenant/:id',
        method: HttpMethod.DELETE,
        handler: 'tenant.delete',
        description: '删除租户',
        permission: 'settings:tenant:delete',
      },
      {
        path: '/tenant/:id/switch',
        method: HttpMethod.POST,
        handler: 'tenant.switch',
        description: '切换租户',
        permission: 'settings:tenant:view',
      },
      {
        path: '/tenant/:id/quota',
        method: HttpMethod.GET,
        handler: 'tenant.getQuota',
        description: '租户配额',
        permission: 'settings:tenant:view',
      },
      {
        path: '/tenant/:id/quota/check',
        method: HttpMethod.POST,
        handler: 'tenant.checkQuota',
        description: '检查配额',
        permission: 'settings:tenant:view',
      },
      {
        path: '/tenant/stats',
        method: HttpMethod.GET,
        handler: 'tenant.stats',
        description: '租户统计',
        permission: 'settings:tenant:view',
      },

      // ===== 日志管理 API =====
      {
        path: '/log',
        method: HttpMethod.GET,
        handler: 'log.list',
        description: '日志列表查询',
        permission: 'settings:log:view',
      },
      {
        path: '/log/:id',
        method: HttpMethod.GET,
        handler: 'log.detail',
        description: '日志详情',
        permission: 'settings:log:view',
      },
      {
        path: '/log',
        method: HttpMethod.POST,
        handler: 'log.create',
        description: '创建日志',
        permission: 'settings:user:view',
      },
      {
        path: '/log/export',
        method: HttpMethod.GET,
        handler: 'log.export',
        description: '导出日志',
        permission: 'settings:log:export',
      },
      {
        path: '/log/clean',
        method: HttpMethod.POST,
        handler: 'log.clean',
        description: '清理日志',
        permission: 'settings:admin:all',
      },
      {
        path: '/log/stats',
        method: HttpMethod.GET,
        handler: 'log.stats',
        description: '日志统计',
        permission: 'settings:log:view',
      },

      // ===== Webhook 管理 API =====
      {
        path: '/webhook',
        method: HttpMethod.GET,
        handler: 'webhook.list',
        description: 'Webhook列表查询',
        permission: 'settings:webhook:view',
      },
      {
        path: '/webhook/:id',
        method: HttpMethod.GET,
        handler: 'webhook.detail',
        description: 'Webhook详情',
        permission: 'settings:webhook:view',
      },
      {
        path: '/webhook',
        method: HttpMethod.POST,
        handler: 'webhook.create',
        description: '创建Webhook',
        permission: 'settings:webhook:create',
      },
      {
        path: '/webhook/:id',
        method: HttpMethod.PUT,
        handler: 'webhook.update',
        description: '更新Webhook',
        permission: 'settings:webhook:update',
      },
      {
        path: '/webhook/:id',
        method: HttpMethod.DELETE,
        handler: 'webhook.delete',
        description: '删除Webhook',
        permission: 'settings:webhook:delete',
      },
      {
        path: '/webhook/:id/test',
        method: HttpMethod.POST,
        handler: 'webhook.test',
        description: '测试Webhook',
        permission: 'settings:webhook:test',
      },
      {
        path: '/webhook/:id/history',
        method: HttpMethod.GET,
        handler: 'webhook.history',
        description: 'Webhook历史',
        permission: 'settings:webhook:view',
      },
      {
        path: '/webhook/:id/trigger',
        method: HttpMethod.POST,
        handler: 'webhook.trigger',
        description: '触发Webhook',
        permission: 'settings:user:view',
      },
      {
        path: '/webhook/stats',
        method: HttpMethod.GET,
        handler: 'webhook.stats',
        description: 'Webhook统计',
        permission: 'settings:webhook:view',
      },

      // ===== 模块管理 API =====
      {
        path: '/module',
        method: HttpMethod.GET,
        handler: 'module.list',
        description: '模块列表查询',
        permission: 'settings:module:view',
      },
      {
        path: '/module/:id',
        method: HttpMethod.GET,
        handler: 'module.info',
        description: '模块详情',
        permission: 'settings:module:view',
      },
      {
        path: '/module/:id/enable',
        method: HttpMethod.POST,
        handler: 'module.enable',
        description: '启用模块',
        permission: 'settings:module:enable',
      },
      {
        path: '/module/:id/disable',
        method: HttpMethod.POST,
        handler: 'module.disable',
        description: '禁用模块',
        permission: 'settings:module:disable',
      },
      {
        path: '/module/:id/install',
        method: HttpMethod.POST,
        handler: 'module.install',
        description: '安装模块',
        permission: 'settings:admin:all',
      },
      {
        path: '/module/:id/uninstall',
        method: HttpMethod.POST,
        handler: 'module.uninstall',
        description: '卸载模块',
        permission: 'settings:admin:all',
      },
      {
        path: '/module/stats',
        method: HttpMethod.GET,
        handler: 'module.stats',
        description: '模块统计',
        permission: 'settings:module:view',
      },

      // ===== 系统健康检查 API =====
      {
        path: '/health',
        method: HttpMethod.GET,
        handler: 'system.health',
        description: '系统健康检查',
        permission: 'settings:user:view',
      },
      {
        path: '/health/detailed',
        method: HttpMethod.GET,
        handler: 'system.healthDetailed',
        description: '详细健康检查',
        permission: 'settings:admin:all',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    // 用户权限
    const userPermissions: ModulePermission[] = [
      {
        id: 'settings:user:view',
        name: '查看用户',
        type: PermissionType.RESOURCE,
        description: '查看用户信息',
      },
      {
        id: 'settings:user:create',
        name: '创建用户',
        type: PermissionType.ACTION,
        description: '创建新用户',
      },
      {
        id: 'settings:user:update',
        name: '更新用户',
        type: PermissionType.ACTION,
        description: '更新用户信息、重置密码、分配角色',
      },
      {
        id: 'settings:user:delete',
        name: '删除用户',
        type: PermissionType.ADMIN,
        description: '删除用户账号',
      },
    ]

    // 角色权限
    const rolePermissions: ModulePermission[] = [
      {
        id: 'settings:role:view',
        name: '查看角色',
        type: PermissionType.RESOURCE,
        description: '查看角色信息',
      },
      {
        id: 'settings:role:create',
        name: '创建角色',
        type: PermissionType.ACTION,
        description: '创建新角色',
      },
      {
        id: 'settings:role:update',
        name: '更新角色',
        type: PermissionType.ACTION,
        description: '更新角色、分配权限',
      },
      {
        id: 'settings:role:delete',
        name: '删除角色',
        type: PermissionType.ADMIN,
        description: '删除角色',
      },
    ]

    // 菜单权限
    const menuPermissions: ModulePermission[] = [
      {
        id: 'settings:menu:view',
        name: '查看菜单',
        type: PermissionType.RESOURCE,
        description: '查看菜单配置',
      },
      {
        id: 'settings:menu:create',
        name: '创建菜单',
        type: PermissionType.ACTION,
        description: '创建菜单项',
      },
      {
        id: 'settings:menu:update',
        name: '更新菜单',
        type: PermissionType.ACTION,
        description: '更新菜单、排序',
      },
      {
        id: 'settings:menu:delete',
        name: '删除菜单',
        type: PermissionType.ADMIN,
        description: '删除菜单项',
      },
    ]

    // 配置权限
    const configPermissions: ModulePermission[] = [
      {
        id: 'settings:config:view',
        name: '查看配置',
        type: PermissionType.RESOURCE,
        description: '查看系统配置',
      },
      {
        id: 'settings:config:update',
        name: '更新配置',
        type: PermissionType.ADMIN,
        description: '修改系统配置',
      },
    ]

    // 租户权限
    const tenantPermissions: ModulePermission[] = [
      {
        id: 'settings:tenant:view',
        name: '查看租户',
        type: PermissionType.RESOURCE,
        description: '查看租户信息',
      },
      {
        id: 'settings:tenant:create',
        name: '创建租户',
        type: PermissionType.ADMIN,
        description: '创建新租户',
      },
      {
        id: 'settings:tenant:update',
        name: '更新租户',
        type: PermissionType.ADMIN,
        description: '更新租户信息',
      },
      {
        id: 'settings:tenant:delete',
        name: '删除租户',
        type: PermissionType.ADMIN,
        description: '删除租户',
      },
    ]

    // 日志权限
    const logPermissions: ModulePermission[] = [
      {
        id: 'settings:log:view',
        name: '查看日志',
        type: PermissionType.RESOURCE,
        description: '查看系统日志',
      },
      {
        id: 'settings:log:export',
        name: '导出日志',
        type: PermissionType.ACTION,
        description: '导出日志数据',
      },
    ]

    // Webhook权限
    const webhookPermissions: ModulePermission[] = [
      {
        id: 'settings:webhook:view',
        name: '查看Webhook',
        type: PermissionType.RESOURCE,
        description: '查看Webhook配置',
      },
      {
        id: 'settings:webhook:create',
        name: '创建Webhook',
        type: PermissionType.ACTION,
        description: '创建Webhook',
      },
      {
        id: 'settings:webhook:update',
        name: '更新Webhook',
        type: PermissionType.ACTION,
        description: '更新Webhook',
      },
      {
        id: 'settings:webhook:delete',
        name: '删除Webhook',
        type: PermissionType.ADMIN,
        description: '删除Webhook',
      },
      {
        id: 'settings:webhook:test',
        name: '测试Webhook',
        type: PermissionType.ACTION,
        description: '测试Webhook连接',
      },
    ]

    // 模块权限
    const modulePermissions: ModulePermission[] = [
      {
        id: 'settings:module:view',
        name: '查看模块',
        type: PermissionType.RESOURCE,
        description: '查看模块信息',
      },
      {
        id: 'settings:module:enable',
        name: '启用模块',
        type: PermissionType.ADMIN,
        description: '启用模块',
      },
      {
        id: 'settings:module:disable',
        name: '禁用模块',
        type: PermissionType.ADMIN,
        description: '禁用模块',
      },
    ]

    // 超级管理员权限
    const adminPermissions: ModulePermission[] = [
      {
        id: 'settings:admin:all',
        name: '超级管理员',
        type: PermissionType.ADMIN,
        description: '拥有所有系统设置权限',
      },
    ]

    return [
      ...userPermissions,
      ...rolePermissions,
      ...menuPermissions,
      ...configPermissions,
      ...tenantPermissions,
      ...logPermissions,
      ...webhookPermissions,
      ...modulePermissions,
      ...adminPermissions,
    ] as ModulePermission[]
  }

  /**
   * 获取菜单定义
   */
  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'settings',
        title: '系统设置',
        path: '/settings',
        icon: 'settings',
        order: 99, // 放在最后
        children: [
          // 用户管理
          {
            id: 'settings-user',
            title: '用户管理',
            path: '/settings/user',
            icon: 'user',
            permissions: ['settings:user:view'],
            order: 1,
            children: [
              {
                id: 'settings-user-list',
                title: '用户列表',
                path: '/settings/user/list',
                icon: 'list',
                permissions: ['settings:user:view'],
                order: 1,
              },
              {
                id: 'settings-user-stats',
                title: '用户统计',
                path: '/settings/user/stats',
                icon: 'chart',
                permissions: ['settings:user:view'],
                order: 2,
              },
            ],
          },
          // 角色管理
          {
            id: 'settings-role',
            title: '角色管理',
            path: '/settings/role',
            icon: 'shield',
            permissions: ['settings:role:view'],
            order: 2,
            children: [
              {
                id: 'settings-role-list',
                title: '角色列表',
                path: '/settings/role/list',
                icon: 'list',
                permissions: ['settings:role:view'],
                order: 1,
              },
              {
                id: 'settings-role-permissions',
                title: '权限配置',
                path: '/settings/role/permissions',
                icon: 'key',
                permissions: ['settings:role:update'],
                order: 2,
              },
            ],
          },
          // 菜单管理
          {
            id: 'settings-menu',
            title: '菜单管理',
            path: '/settings/menu',
            icon: 'menu',
            permissions: ['settings:menu:view'],
            order: 3,
            children: [
              {
                id: 'settings-menu-tree',
                title: '菜单配置',
                path: '/settings/menu/tree',
                icon: 'tree',
                permissions: ['settings:menu:view'],
                order: 1,
              },
            ],
          },
          // 系统配置
          {
            id: 'settings-config',
            title: '系统配置',
            path: '/settings/config',
            icon: 'sliders',
            permissions: ['settings:config:view'],
            order: 4,
            children: [
              {
                id: 'settings-config-general',
                title: '基础设置',
                path: '/settings/config/general',
                icon: 'cog',
                permissions: ['settings:config:view'],
                order: 1,
              },
              {
                id: 'settings-config-module',
                title: '模块配置',
                path: '/settings/config/module',
                icon: 'plugin',
                permissions: ['settings:config:view'],
                order: 2,
              },
            ],
          },
          // 租户管理
          {
            id: 'settings-tenant',
            title: '租户管理',
            path: '/settings/tenant',
            icon: 'building',
            permissions: ['settings:tenant:view'],
            order: 5,
            children: [
              {
                id: 'settings-tenant-list',
                title: '租户列表',
                path: '/settings/tenant/list',
                icon: 'list',
                permissions: ['settings:tenant:view'],
                order: 1,
              },
              {
                id: 'settings-tenant-quota',
                title: '配额管理',
                path: '/settings/tenant/quota',
                icon: 'chart-pie',
                permissions: ['settings:tenant:update'],
                order: 2,
              },
            ],
          },
          // 日志管理
          {
            id: 'settings-log',
            title: '日志管理',
            path: '/settings/log',
            icon: 'history',
            permissions: ['settings:log:view'],
            order: 6,
            children: [
              {
                id: 'settings-log-list',
                title: '日志查询',
                path: '/settings/log/list',
                icon: 'search',
                permissions: ['settings:log:view'],
                order: 1,
              },
              {
                id: 'settings-log-export',
                title: '日志导出',
                path: '/settings/log/export',
                icon: 'download',
                permissions: ['settings:log:export'],
                order: 2,
              },
            ],
          },
          // Webhook管理
          {
            id: 'settings-webhook',
            title: 'Webhook',
            path: '/settings/webhook',
            icon: 'webhook',
            permissions: ['settings:webhook:view'],
            order: 7,
            children: [
              {
                id: 'settings-webhook-list',
                title: 'Webhook列表',
                path: '/settings/webhook/list',
                icon: 'list',
                permissions: ['settings:webhook:view'],
                order: 1,
              },
              {
                id: 'settings-webhook-history',
                title: '调用历史',
                path: '/settings/webhook/history',
                icon: 'timeline',
                permissions: ['settings:webhook:view'],
                order: 2,
              },
            ],
          },
          // 模块管理
          {
            id: 'settings-module',
            title: '模块管理',
            path: '/settings/module',
            icon: 'plugin',
            permissions: ['settings:module:view'],
            order: 8,
            children: [
              {
                id: 'settings-module-list',
                title: '模块列表',
                path: '/settings/module/list',
                icon: 'list',
                permissions: ['settings:module:view'],
                order: 1,
              },
              {
                id: 'settings-module-stats',
                title: '模块统计',
                path: '/settings/module/stats',
                icon: 'chart',
                permissions: ['settings:module:view'],
                order: 2,
              },
            ],
          },
          // 系统监控
          {
            id: 'settings-health',
            title: '系统监控',
            path: '/settings/health',
            icon: 'monitor',
            permissions: ['settings:admin:all'],
            order: 9,
            children: [
              {
                id: 'settings-health-status',
                title: '健康状态',
                path: '/settings/health/status',
                icon: 'heartbeat',
                permissions: ['settings:admin:all'],
                order: 1,
              },
            ],
          },
        ],
      },
    ]
  }

  /**
   * 获取事件定义
   */
  getEvents(): ModuleEvent[] {
    return [
      // 用户事件
      {
        name: 'settings.user.created',
        type: EventType.BUSINESS_DATA,
        description: '用户创建',
      },
      {
        name: 'settings.user.updated',
        type: EventType.USER_ACTION,
        description: '用户更新',
      },
      {
        name: 'settings.user.deleted',
        type: EventType.USER_ACTION,
        description: '用户删除',
      },
      {
        name: 'settings.user.locked',
        type: EventType.SYSTEM,
        description: '用户锁定',
      },

      // 角色事件
      {
        name: 'settings.role.created',
        type: EventType.BUSINESS_DATA,
        description: '角色创建',
      },
      {
        name: 'settings.role.permissions_changed',
        type: EventType.USER_ACTION,
        description: '角色权限变更',
      },

      // 菜单事件
      {
        name: 'settings.menu.updated',
        type: EventType.USER_ACTION,
        description: '菜单更新',
      },

      // 配置事件
      {
        name: 'settings.config.changed',
        type: EventType.USER_ACTION,
        description: '配置变更',
      },

      // 租户事件
      {
        name: 'settings.tenant.created',
        type: EventType.BUSINESS_DATA,
        description: '租户创建',
      },
      {
        name: 'settings.tenant.expired',
        type: EventType.SYSTEM,
        description: '租户到期',
      },

      // Webhook事件
      {
        name: 'settings.webhook.triggered',
        type: EventType.EXTERNAL,
        description: 'Webhook触发',
      },
      {
        name: 'settings.webhook.failed',
        type: EventType.EXTERNAL,
        description: 'Webhook调用失败',
      },

      // 模块事件
      {
        name: 'settings.module.enabled',
        type: EventType.MODULE_LIFECYCLE,
        description: '模块启用',
      },
      {
        name: 'settings.module.disabled',
        type: EventType.MODULE_LIFECYCLE,
        description: '模块禁用',
      },

      // 系统事件
      {
        name: 'settings.system.health_check',
        type: EventType.SYSTEM,
        description: '系统健康检查',
      },
    ]
  }

  // ============================================
  // 私有检测方法
  // ============================================

  /**
   * 检查系统健康状态
   */
  private async checkSystemHealth(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      // 检查数据库连接
      await prisma.$queryRaw`SELECT 1`

      // 检查用户锁定状态
      const lockedUsers = await prisma.user.findMany({
        where: { locked: true },
      })

      if (lockedUsers.length > 0) {
        this.logger?.warn(`发现 ${lockedUsers.length} 个锁定用户`)
      }

      this.eventBus?.emit('settings.system.health_check', {
        status: 'healthy',
        lockedUsers: lockedUsers.length,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      this.logger?.error('系统健康检查失败', error)

      this.eventBus?.emit('settings.system.health_check', {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })
    }
  }

  /**
   * 检查过期租户
   */
  private async checkExpiredTenants(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const now = new Date()

      // 查找即将过期或已过期的租户
      const expiringTenants = await prisma.tenant.findMany({
        where: {
          status: 'active',
          expireDate: { lte: now },
        },
      })

      if (expiringTenants.length > 0) {
        this.logger?.warn(`发现 ${expiringTenants.length} 个过期租户`)

        for (const tenant of expiringTenants) {
          this.eventBus?.emit('settings.tenant.expired', {
            tenantId: tenant.id,
            tenantName: tenant.name,
            expireDate: tenant.expireDate,
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('租户过期检查失败', error)
    }
  }

  /**
   * 检查日志清理
   */
  private async checkLogCleanup(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      // 获取日志配置
      const moduleConfigs = await this._context?.config.getModuleConfigs(this.manifest.id)
      const retentionDays = moduleConfigs?.log?.retentionDays || 90

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

      // 查找需要清理的日志数量
      const logsToClean = await prisma.log.count({
        where: {
          createdAt: { lt: cutoffDate },
        },
      })

      if (logsToClean > 0) {
        this.logger?.info(`有 ${logsToClean} 条日志超过保留期限 (${retentionDays}天)`)
      }
    } catch (error) {
      this.logger?.error('日志清理检查失败', error)
    }
  }
}
