/**
 * Tenant 租户管理模块
 * 热插拔核心模块 - 提供多租户隔离与管理
 *
 * 功能范围:
 * - 租户 CRUD 操作
 * - 租户状态管理 (激活/暂停/过期)
 * - 租户套餐与计费
 * - 租户配置管理
 * - 租户数据隔离
 * - 租户模块启用控制
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
  ModulePermission,
  PermissionType,
  ModuleRoute,
  HttpMethod,
  ModuleEvent,
  EventType,
} from '../../core/module/interfaces'

// ============================================
// 租户状态枚举
// ============================================

export enum TenantStatus {
  ACTIVE = 'ACTIVE', // 正常运行
  SUSPENDED = 'SUSPENDED', // 已暂停
  EXPIRED = 'EXPIRED', // 已过期
  TRIAL = 'TRIAL', // 试用期
}

// ============================================
// 租户套餐枚举
// ============================================

export enum TenantPlan {
  FREE = 'free', // 免费版
  BASIC = 'basic', // 基础版
  PRO = 'pro', // 专业版
  ENTERPRISE = 'enterprise', // 企业版
  CUSTOM = 'custom', // 定制版
}

// ============================================
// 模块清单定义
// ============================================

export const TENANT_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/tenant',
  name: '租户管理',
  version: '1.0.0',
  description: '多租户管理核心模块，支持租户隔离、状态管理、套餐计费、模块控制',
  category: 'core',
  tags: ['tenant', 'multi-tenant', 'saas', 'isolation'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
  ],
  permissions: [
    'tenant:create',
    'tenant:view',
    'tenant:edit',
    'tenant:delete',
    'tenant:suspend',
    'tenant:activate',
    'tenant:manage-modules',
    'tenant:set-plan',
    'tenant:view-statistics',
    'tenant:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
  builtin: true,
  system: true,
}

// ============================================
// Tenant 模块实现
// ============================================

export class TenantHotplugModule extends BaseModule {
  readonly manifest = TENANT_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // 租户数据存储 (模拟)
  private tenants: Map<string, any> = new Map()

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    // 初始化默认租户
    this.initDefaultTenant()

    await context.config.setModuleConfigs(this.manifest.id, {
      defaultPlan: TenantPlan.BASIC,
      trialDays: 14,
      trialMaxUsers: 5,
      planLimits: {
        [TenantPlan.FREE]: { maxUsers: 3, maxModules: 5 },
        [TenantPlan.BASIC]: { maxUsers: 10, maxModules: 10 },
        [TenantPlan.PRO]: { maxUsers: 50, maxModules: 20 },
        [TenantPlan.ENTERPRISE]: { maxUsers: -1, maxModules: -1 },
      },
      enableAutoSuspend: true,
      suspendBeforeDays: 3,
    })

    this.logger?.info('租户管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.tenants.clear()
    this.logger?.info('租户管理模块已销毁')
  }

  // ============================================
  // 默认租户初始化
  // ============================================

  private initDefaultTenant(): void {
    const defaultTenant = {
      id: 'default-tenant',
      code: 'default',
      name: '默认租户',
      logo: null,
      status: TenantStatus.ACTIVE,
      plan: TenantPlan.ENTERPRISE,
      maxUsers: -1,
      expireAt: null,
      config: {},
      enabledModules: ['*'],
      createdAt: new Date(),
      updatedAt: new Date(),
      userCount: 0,
    }

    this.tenants.set(defaultTenant.id, defaultTenant)
    this.logger?.info('默认租户初始化完成')
  }

  // ============================================
  // 业务方法
  // ============================================

  /**
   * 创建租户
   */
  async createTenant(data: {
    code: string
    name: string
    logo?: string
    plan?: TenantPlan
    maxUsers?: number
    expireAt?: Date
    config?: Record<string, any>
  }): Promise<any> {
    const tenantId = `tenant_${Date.now()}`

    const tenant = {
      id: tenantId,
      code: data.code,
      name: data.name,
      logo: data.logo,
      status: TenantStatus.TRIAL,
      plan: data.plan || TenantPlan.BASIC,
      maxUsers: data.maxUsers || 10,
      expireAt: data.expireAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 默认14天试用
      config: data.config || {},
      enabledModules: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userCount: 0,
    }

    this.tenants.set(tenantId, tenant)
    this.logger?.info(`租户创建: ${tenantId} - ${data.name}`)

    await this._context?.eventBus.emit('tenant.created', { tenantId, name: data.name })

    return tenant
  }

  /**
   * 更新租户
   */
  async updateTenant(
    tenantId: string,
    data: Partial<{
      name: string
      logo: string
      maxUsers: number
      expireAt: Date
      config: Record<string, any>
    }>,
  ): Promise<any> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`)
    }

    Object.assign(tenant, data)
    tenant.updatedAt = new Date()

    this.logger?.info(`租户更新: ${tenantId}`)
    await this._context?.eventBus.emit('tenant.updated', { tenantId })

    return tenant
  }

  /**
   * 删除租户
   */
  async deleteTenant(tenantId: string): Promise<void> {
    if (tenantId === 'default-tenant') {
      throw new Error('不能删除默认租户')
    }

    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`)
    }

    if (tenant.userCount > 0) {
      throw new Error('租户下仍有用户，不能删除')
    }

    this.tenants.delete(tenantId)
    this.logger?.info(`租户删除: ${tenantId}`)
    await this._context?.eventBus.emit('tenant.deleted', { tenantId })
  }

  /**
   * 获取租户列表
   */
  async listTenants(query?: {
    keyword?: string
    status?: TenantStatus
    plan?: TenantPlan
    page?: number
    pageSize?: number
  }): Promise<{
    list: any[]
    total: number
    page: number
    pageSize: number
  }> {
    let tenants = Array.from(this.tenants.values())

    // 筛选
    if (query?.keyword) {
      tenants = tenants.filter(
        (t) => t.code.includes(query.keyword!) || t.name.includes(query.keyword!),
      )
    }
    if (query?.status) {
      tenants = tenants.filter((t) => t.status === query.status)
    }
    if (query?.plan) {
      tenants = tenants.filter((t) => t.plan === query.plan)
    }

    // 分页
    const page = query?.page || 1
    const pageSize = query?.pageSize || 10
    const start = (page - 1) * pageSize
    const list = tenants.slice(start, start + pageSize)

    return {
      list,
      total: tenants.length,
      page,
      pageSize,
    }
  }

  /**
   * 获取租户详情
   */
  async getTenant(tenantId: string): Promise<any> {
    return this.tenants.get(tenantId)
  }

  /**
   * 暂停租户
   */
  async suspendTenant(tenantId: string, reason?: string): Promise<any> {
    if (tenantId === 'default-tenant') {
      throw new Error('不能暂停默认租户')
    }

    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`)
    }

    tenant.status = TenantStatus.SUSPENDED
    tenant.suspendReason = reason
    tenant.suspendedAt = new Date()
    tenant.updatedAt = new Date()

    this.logger?.info(`租户暂停: ${tenantId} - ${reason}`)
    await this._context?.eventBus.emit('tenant.suspended', { tenantId, reason })

    return tenant
  }

  /**
   * 激活租户
   */
  async activateTenant(tenantId: string): Promise<any> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`)
    }

    tenant.status = TenantStatus.ACTIVE
    tenant.suspendReason = null
    tenant.suspendedAt = null
    tenant.activatedAt = new Date()
    tenant.updatedAt = new Date()

    this.logger?.info(`租户激活: ${tenantId}`)
    await this._context?.eventBus.emit('tenant.activated', { tenantId })

    return tenant
  }

  /**
   * 设置套餐
   */
  async setPlan(tenantId: string, plan: TenantPlan, expireAt?: Date): Promise<any> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`)
    }

    tenant.plan = plan
    tenant.expireAt = expireAt
    tenant.updatedAt = new Date()

    this.logger?.info(`租户套餐设置: ${tenantId} - ${plan}`)
    await this._context?.eventBus.emit('tenant.plan.updated', { tenantId, plan })

    return tenant
  }

  /**
   * 启用模块
   */
  async enableModule(tenantId: string, moduleId: string): Promise<any> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`)
    }

    if (!tenant.enabledModules.includes(moduleId)) {
      tenant.enabledModules.push(moduleId)
      tenant.updatedAt = new Date()
    }

    this.logger?.info(`租户启用模块: ${tenantId} - ${moduleId}`)
    await this._context?.eventBus.emit('tenant.module.enabled', { tenantId, moduleId })

    return tenant
  }

  /**
   * 禁用模块
   */
  async disableModule(tenantId: string, moduleId: string): Promise<any> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      throw new Error(`租户不存在: ${tenantId}`)
    }

    tenant.enabledModules = tenant.enabledModules.filter((m: string) => m !== moduleId && m !== '*')
    tenant.updatedAt = new Date()

    this.logger?.info(`租户禁用模块: ${tenantId} - ${moduleId}`)
    await this._context?.eventBus.emit('tenant.module.disabled', { tenantId, moduleId })

    return tenant
  }

  /**
   * 检查模块是否启用
   */
  async isModuleEnabled(tenantId: string, moduleId: string): Promise<boolean> {
    const tenant = this.tenants.get(tenantId)
    if (!tenant) {
      return false
    }

    return tenant.enabledModules.includes('*') || tenant.enabledModules.includes(moduleId)
  }

  /**
   * 获取租户统计
   */
  async getStatistics(tenantId?: string): Promise<{
    total: number
    byStatus: Record<TenantStatus, number>
    byPlan: Record<TenantPlan, number>
    expiringSoon: number
  }> {
    let tenants = tenantId ? [this.tenants.get(tenantId)] : Array.from(this.tenants.values())

    tenants = tenants.filter(Boolean)

    const byStatus = {
      [TenantStatus.ACTIVE]: 0,
      [TenantStatus.SUSPENDED]: 0,
      [TenantStatus.EXPIRED]: 0,
      [TenantStatus.TRIAL]: 0,
    }

    const byPlan = {
      [TenantPlan.FREE]: 0,
      [TenantPlan.BASIC]: 0,
      [TenantPlan.PRO]: 0,
      [TenantPlan.ENTERPRISE]: 0,
      [TenantPlan.CUSTOM]: 0,
    }

    tenants.forEach((t) => {
      byStatus[t.status as TenantStatus]++
      byPlan[t.plan as TenantPlan]++
    })

    // 即将过期 (30天内)
    const now = new Date()
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const expiringSoon = tenants.filter(
      (t) => t.expireAt && t.expireAt <= thirtyDaysLater && t.status === TenantStatus.ACTIVE,
    ).length

    return {
      total: tenants.length,
      byStatus,
      byPlan,
      expiringSoon,
    }
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'tenant:create',
        name: '创建租户',
        description: '创建新租户',
        type: PermissionType.RESOURCE,
        resource: 'tenant',
        action: 'create',
      },
      {
        id: 'tenant:view',
        name: '查看租户',
        description: '查看租户列表和详情',
        type: PermissionType.RESOURCE,
        resource: 'tenant',
        action: 'view',
      },
      {
        id: 'tenant:edit',
        name: '编辑租户',
        description: '编辑租户信息',
        type: PermissionType.RESOURCE,
        resource: 'tenant',
        action: 'edit',
      },
      {
        id: 'tenant:delete',
        name: '删除租户',
        description: '删除租户',
        type: PermissionType.RESOURCE,
        resource: 'tenant',
        action: 'delete',
      },
      {
        id: 'tenant:suspend',
        name: '暂停租户',
        description: '暂停租户服务',
        type: PermissionType.ACTION,
        resource: 'tenant',
        action: 'suspend',
      },
      {
        id: 'tenant:activate',
        name: '激活租户',
        description: '激活租户服务',
        type: PermissionType.ACTION,
        resource: 'tenant',
        action: 'activate',
      },
      {
        id: 'tenant:manage-modules',
        name: '管理模块',
        description: '管理租户启用的模块',
        type: PermissionType.ACTION,
        resource: 'tenant',
        action: 'manage-modules',
      },
      {
        id: 'tenant:set-plan',
        name: '设置套餐',
        description: '设置租户套餐计划',
        type: PermissionType.ACTION,
        resource: 'tenant',
        action: 'set-plan',
      },
      {
        id: 'tenant:view-statistics',
        name: '查看统计',
        description: '查看租户统计数据',
        type: PermissionType.ACTION,
        resource: 'tenant',
        action: 'view-statistics',
      },
      {
        id: 'tenant:admin',
        name: '租户管理员',
        description: '租户模块管理权限',
        type: PermissionType.ADMIN,
        resource: 'tenant',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'tenant-management',
        title: '租户管理',
        path: '/settings/tenants',
        icon: 'cluster',
        permissions: ['tenant:view'],
        order: 3,
        parentId: 'settings',
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      {
        path: '/api/v1/tenants',
        method: HttpMethod.POST,
        handler: 'createTenant',
        description: '创建租户',
        permission: 'tenant:create',
      },
      {
        path: '/api/v1/tenants',
        method: HttpMethod.GET,
        handler: 'listTenants',
        description: '获取租户列表',
        permission: 'tenant:view',
      },
      {
        path: '/api/v1/tenants/:id',
        method: HttpMethod.GET,
        handler: 'getTenant',
        description: '获取租户详情',
        permission: 'tenant:view',
      },
      {
        path: '/api/v1/tenants/:id',
        method: HttpMethod.PUT,
        handler: 'updateTenant',
        description: '更新租户',
        permission: 'tenant:edit',
      },
      {
        path: '/api/v1/tenants/:id',
        method: HttpMethod.DELETE,
        handler: 'deleteTenant',
        description: '删除租户',
        permission: 'tenant:delete',
      },
      {
        path: '/api/v1/tenants/:id/suspend',
        method: HttpMethod.PUT,
        handler: 'suspendTenant',
        description: '暂停租户',
        permission: 'tenant:suspend',
      },
      {
        path: '/api/v1/tenants/:id/activate',
        method: HttpMethod.PUT,
        handler: 'activateTenant',
        description: '激活租户',
        permission: 'tenant:activate',
      },
      {
        path: '/api/v1/tenants/:id/plan',
        method: HttpMethod.PUT,
        handler: 'setPlan',
        description: '设置套餐',
        permission: 'tenant:set-plan',
      },
      {
        path: '/api/v1/tenants/:id/modules',
        method: HttpMethod.GET,
        handler: 'getTenant',
        description: '获取租户模块',
        permission: 'tenant:manage-modules',
      },
      {
        path: '/api/v1/tenants/:id/modules/:moduleId',
        method: HttpMethod.POST,
        handler: 'enableModule',
        description: '启用模块',
        permission: 'tenant:manage-modules',
      },
      {
        path: '/api/v1/tenants/:id/modules/:moduleId',
        method: HttpMethod.DELETE,
        handler: 'disableModule',
        description: '禁用模块',
        permission: 'tenant:manage-modules',
      },
      {
        path: '/api/v1/tenants/statistics',
        method: HttpMethod.GET,
        handler: 'getStatistics',
        description: '租户统计',
        permission: 'tenant:view-statistics',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'tenant.created',
        type: EventType.BUSINESS_DATA,
        description: '租户创建事件',
      },
      {
        name: 'tenant.updated',
        type: EventType.BUSINESS_DATA,
        description: '租户更新事件',
      },
      {
        name: 'tenant.deleted',
        type: EventType.BUSINESS_DATA,
        description: '租户删除事件',
      },
      {
        name: 'tenant.suspended',
        type: EventType.SYSTEM,
        description: '租户暂停事件',
      },
      {
        name: 'tenant.activated',
        type: EventType.SYSTEM,
        description: '租户激活事件',
      },
      {
        name: 'tenant.plan.updated',
        type: EventType.BUSINESS_DATA,
        description: '租户套餐更新事件',
      },
      {
        name: 'tenant.module.enabled',
        type: EventType.SYSTEM,
        description: '租户模块启用事件',
      },
      {
        name: 'tenant.module.disabled',
        type: EventType.SYSTEM,
        description: '租户模块禁用事件',
      },
      {
        name: 'tenant.expired',
        type: EventType.SYSTEM,
        description: '租户过期事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const TENANT_HOTPLUG_MODULE = {
  manifest: TENANT_MODULE_MANIFEST,
  moduleClass: TenantHotplugModule,
}
