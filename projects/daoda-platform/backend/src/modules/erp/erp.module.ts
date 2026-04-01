/**
 * ERP 模块定义
 * 热插拔模块 - 聚合库存、采购、生产、生产计划
 *
 * 企业资源计划核心模块，支撑制造业数字化转型
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

export const ERP_MODULE_MANIFEST: ModuleManifest = {
  // 基本信息
  id: '@daoda/erp',
  name: 'ERP企业资源计划',
  version: '1.0.0',
  description: '企业资源计划模块，包含库存管理、采购管理、生产管理、生产计划',

  // 分类
  category: 'business',
  tags: ['erp', 'inventory', 'purchase', 'production', 'manufacturing'],

  // 依赖
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
    { id: '@daoda/crm', version: '>=1.0.0', optional: true }, // 可选依赖 CRM
  ],

  // 权限声明
  permissions: [
    'erp:inventory:view',
    'erp:inventory:create',
    'erp:inventory:update',
    'erp:inventory:delete',
    'erp:purchase:view',
    'erp:purchase:create',
    'erp:purchase:approve',
    'erp:production:view',
    'erp:production:create',
    'erp:production:execute',
    'erp:plan:view',
    'erp:plan:create',
  ],

  // 热更新配置
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },

  // 技术信息
  routePrefix: '/api/v1/erp',
  tablePrefix: 'erp_',
}

// ============================================
// ERP 模块实现
// ============================================

/**
 * ERP 聚合模块
 * 企业资源计划核心 - 库存/采购/生产
 */
export class ErpModule extends BaseModule {
  // 模块清单
  readonly manifest = ERP_MODULE_MANIFEST

  // ============================================
  // 生命周期钩子
  // ============================================

  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('ERP 模块安装开始...')

    // 检查数据库表
    const prisma = context.serviceRegistry.get<any>('prisma')
    if (prisma) {
      try {
        // 检查核心表是否存在
        await prisma.inventory.findFirst()
        await prisma.purchase.findFirst()
        await prisma.production.findFirst()
        this.logger?.info('ERP 数据表验证成功')
      } catch (error) {
        this.logger?.warn('ERP 数据表可能不存在，需要初始化')
      }
    }

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      // 库存配置
      inventory: {
        warningThreshold: 10,
        autoWarning: true,
        warehouses: ['default', 'main', 'auxiliary'],
      },
      // 采购配置
      purchase: {
        approvalThreshold: 10000, // 超过此金额需审批
        autoApproveDays: 3,
        paymentTerms: ['prepaid', 'monthly', 'quarterly'],
      },
      // 生产配置
      production: {
        batchSize: 100,
        leadTime: 7, // 天
        qualityCheck: true,
      },
    })

    this.logger?.info('ERP 模块安装完成')
  }

  /**
   * 初始化钩子
   */
  async onInit(): Promise<void> {
    await super.onInit()

    this.logger?.info('ERP 模块初始化...')

    // 注册内部服务
    this._context?.serviceRegistry.register(this.manifest.id, 'inventory', {
      service: 'inventory',
      methods: ['checkStock', 'reserveStock', 'releaseStock', 'getWarningList'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'purchase', {
      service: 'purchase',
      methods: ['createOrder', 'approveOrder', 'trackOrder', 'calculateCost'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'production', {
      service: 'production',
      methods: ['createPlan', 'startBatch', 'completeBatch', 'qualityCheck'],
    })

    this.logger?.info('ERP 模块服务注册完成')
  }

  /**
   * 启动钩子
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('ERP 模块启动...')

    // 发送启动事件
    this.eventBus?.emit('erp.started', {
      moduleId: this.manifest.id,
      version: this.manifest.version,
      timestamp: new Date().toISOString(),
    })

    // 检查库存预警
    await this.checkInventoryWarnings()

    this.logger?.info('ERP 模块已启动')
  }

  /**
   * 停止钩子
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('ERP 模块停止...')

    // 发送停止事件
    this.eventBus?.emit('erp.stopped', {
      moduleId: this.manifest.id,
      timestamp: new Date().toISOString(),
    })

    this.logger?.info('ERP 模块已停止')
  }

  /**
   * 卸载钩子
   */
  async onUninstall(): Promise<void> {
    await super.onUninstall()

    this.logger?.info('ERP 模块卸载...')

    // 清理服务注册
    this._context?.serviceRegistry.unregister(this.manifest.id, 'inventory')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'purchase')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'production')

    this.logger?.info('ERP 模块已卸载')
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
      inventoryService: false,
      purchaseService: false,
      productionService: false,
    }

    try {
      // 检查数据库连接
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`
        checks.database = true
      }

      // 检查服务注册
      checks.inventoryService = this._context?.serviceRegistry.get('inventory') !== undefined
      checks.purchaseService = this._context?.serviceRegistry.get('purchase') !== undefined
      checks.productionService = this._context?.serviceRegistry.get('production') !== undefined
    } catch (error) {
      this.logger?.error('ERP 健康检查失败', error)
    }

    const healthyCount = Object.values(checks).filter(Boolean).length
    const status: 'healthy' | 'degraded' | 'unhealthy' =
      healthyCount === 4 ? 'healthy' : healthyCount >= 2 ? 'degraded' : 'unhealthy'

    return {
      status,
      details: {
        checks,
        healthyCount,
        totalCount: 4,
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
      // ===== 库存管理 API =====
      {
        path: '/inventory',
        method: HttpMethod.GET,
        handler: 'inventory.list',
        description: '库存列表查询',
        permission: 'erp:inventory:view',
      },
      {
        path: '/inventory/:id',
        method: HttpMethod.GET,
        handler: 'inventory.detail',
        description: '库存详情',
        permission: 'erp:inventory:view',
      },
      {
        path: '/inventory',
        method: HttpMethod.POST,
        handler: 'inventory.create',
        description: '创建库存记录',
        permission: 'erp:inventory:create',
      },
      {
        path: '/inventory/:id',
        method: HttpMethod.PUT,
        handler: 'inventory.update',
        description: '更新库存',
        permission: 'erp:inventory:update',
      },
      {
        path: '/inventory/:id',
        method: HttpMethod.DELETE,
        handler: 'inventory.delete',
        description: '删除库存记录',
        permission: 'erp:inventory:delete',
      },
      {
        path: '/inventory/warning',
        method: HttpMethod.GET,
        handler: 'inventory.warningList',
        description: '库存预警列表',
        permission: 'erp:inventory:view',
      },
      {
        path: '/inventory/log',
        method: HttpMethod.GET,
        handler: 'inventory.logList',
        description: '库存变动日志',
        permission: 'erp:inventory:view',
      },

      // ===== 采购管理 API =====
      {
        path: '/purchase',
        method: HttpMethod.GET,
        handler: 'purchase.list',
        description: '采购单列表',
        permission: 'erp:purchase:view',
      },
      {
        path: '/purchase/:id',
        method: HttpMethod.GET,
        handler: 'purchase.detail',
        description: '采购单详情',
        permission: 'erp:purchase:view',
      },
      {
        path: '/purchase',
        method: HttpMethod.POST,
        handler: 'purchase.create',
        description: '创建采购单',
        permission: 'erp:purchase:create',
      },
      {
        path: '/purchase/:id/approve',
        method: HttpMethod.POST,
        handler: 'purchase.approve',
        description: '审批采购单',
        permission: 'erp:purchase:approve',
      },
      {
        path: '/purchase/:id/receive',
        method: HttpMethod.POST,
        handler: 'purchase.receive',
        description: '采购入库',
        permission: 'erp:purchase:create',
      },

      // ===== 生产管理 API =====
      {
        path: '/production',
        method: HttpMethod.GET,
        handler: 'production.list',
        description: '生产批次列表',
        permission: 'erp:production:view',
      },
      {
        path: '/production/:id',
        method: HttpMethod.GET,
        handler: 'production.detail',
        description: '生产批次详情',
        permission: 'erp:production:view',
      },
      {
        path: '/production',
        method: HttpMethod.POST,
        handler: 'production.create',
        description: '创建生产批次',
        permission: 'erp:production:create',
      },
      {
        path: '/production/:id/start',
        method: HttpMethod.POST,
        handler: 'production.start',
        description: '开始生产',
        permission: 'erp:production:execute',
      },
      {
        path: '/production/:id/complete',
        method: HttpMethod.POST,
        handler: 'production.complete',
        description: '完成生产',
        permission: 'erp:production:execute',
      },
      {
        path: '/production/:id/quality',
        method: HttpMethod.POST,
        handler: 'production.qualityCheck',
        description: '质量检查',
        permission: 'erp:production:execute',
      },

      // ===== 生产计划 API =====
      {
        path: '/plan',
        method: HttpMethod.GET,
        handler: 'plan.list',
        description: '生产计划列表',
        permission: 'erp:plan:view',
      },
      {
        path: '/plan/:id',
        method: HttpMethod.GET,
        handler: 'plan.detail',
        description: '生产计划详情',
        permission: 'erp:plan:view',
      },
      {
        path: '/plan',
        method: HttpMethod.POST,
        handler: 'plan.create',
        description: '创建生产计划',
        permission: 'erp:plan:create',
      },
      {
        path: '/plan/:id/execute',
        method: HttpMethod.POST,
        handler: 'plan.execute',
        description: '执行生产计划',
        permission: 'erp:plan:create',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    // 库存权限
    const inventoryPermissions = this.generateCrudPermissions('erp', 'inventory', '库存')

    // 采购权限
    const purchasePermissions = [
      ...this.generateCrudPermissions('erp', 'purchase', '采购单'),
      {
        id: 'erp:purchase:approve',
        name: '审批采购单',
        type: PermissionType.ACTION,
        description: '审批采购订单，金额超过阈值时需要',
      },
    ]

    // 生产权限
    const productionPermissions = [
      ...this.generateCrudPermissions('erp', 'production', '生产批次'),
      {
        id: 'erp:production:execute',
        name: '执行生产',
        type: PermissionType.ACTION,
        description: '开始/完成生产批次',
      },
    ]

    // 生产计划权限
    const planPermissions = this.generateCrudPermissions('erp', 'plan', '生产计划')

    return [
      ...inventoryPermissions,
      ...purchasePermissions,
      ...productionPermissions,
      ...planPermissions,
    ] as ModulePermission[]
  }

  /**
   * 获取菜单定义
   */
  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'erp',
        title: 'ERP资源计划',
        path: '/erp',
        icon: 'box',
        order: 3,
        children: [
          // 库存管理
          {
            id: 'erp-inventory',
            title: '库存管理',
            path: '/erp/inventory',
            icon: 'database',
            permissions: ['erp:inventory:view'],
            order: 1,
            children: [
              {
                id: 'erp-inventory-list',
                title: '库存列表',
                path: '/erp/inventory/list',
                icon: 'list',
                permissions: ['erp:inventory:view'],
                order: 1,
              },
              {
                id: 'erp-inventory-warning',
                title: '库存预警',
                path: '/erp/inventory/warning',
                icon: 'alert',
                permissions: ['erp:inventory:view'],
                order: 2,
              },
              {
                id: 'erp-inventory-log',
                title: '变动日志',
                path: '/erp/inventory/log',
                icon: 'history',
                permissions: ['erp:inventory:view'],
                order: 3,
              },
            ],
          },
          // 采购管理
          {
            id: 'erp-purchase',
            title: '采购管理',
            path: '/erp/purchase',
            icon: 'shopping',
            permissions: ['erp:purchase:view'],
            order: 2,
          },
          // 生产管理
          {
            id: 'erp-production',
            title: '生产管理',
            path: '/erp/production',
            icon: 'tool',
            permissions: ['erp:production:view'],
            order: 3,
          },
          // 生产计划
          {
            id: 'erp-plan',
            title: '生产计划',
            path: '/erp/plan',
            icon: 'calendar',
            permissions: ['erp:plan:view'],
            order: 4,
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
      // 库存事件
      {
        name: 'erp.inventory.warning',
        type: EventType.BUSINESS_DATA,
        description: '库存预警触发',
      },
      {
        name: 'erp.inventory.change',
        type: EventType.BUSINESS_DATA,
        description: '库存变动',
      },

      // 采购事件
      {
        name: 'erp.purchase.created',
        type: EventType.BUSINESS_DATA,
        description: '采购单创建',
      },
      {
        name: 'erp.purchase.approved',
        type: EventType.USER_ACTION,
        description: '采购单审批',
      },
      {
        name: 'erp.purchase.received',
        type: EventType.BUSINESS_DATA,
        description: '采购入库',
      },

      // 生产事件
      {
        name: 'erp.production.started',
        type: EventType.USER_ACTION,
        description: '生产开始',
      },
      {
        name: 'erp.production.completed',
        type: EventType.BUSINESS_DATA,
        description: '生产完成',
      },
      {
        name: 'erp.production.quality_failed',
        type: EventType.SYSTEM,
        description: '质量检查不合格',
      },
    ]
  }

  // ============================================
  // 私有方法
  // ============================================

  /**
   * 生成 CRUD 权限
   */
  private generateCrudPermissions(
    module: string,
    resource: string,
    displayName: string,
  ): ModulePermission[] {
    const actions = [
      { code: 'view', name: '查看', type: PermissionType.RESOURCE },
      { code: 'create', name: '创建', type: PermissionType.ACTION },
      { code: 'update', name: '更新', type: PermissionType.ACTION },
      { code: 'delete', name: '删除', type: PermissionType.ADMIN },
    ]

    return actions.map((action) => ({
      id: `${module}:${resource}:${action.code}`,
      name: `${displayName}${action.name}`,
      type: action.type,
      description: `${displayName}的${action.name}权限`,
    })) as ModulePermission[]
  }

  /**
   * 检查库存预警
   */
  private async checkInventoryWarnings(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const warnings = await prisma.inventory.findMany({
        where: {
          quantity: { lte: prisma.inventory.fields.warningQty },
        },
        include: { product: true },
      })

      if (warnings.length > 0) {
        this.logger?.warn(`发现 ${warnings.length} 个库存预警`)

        // 发送预警事件
        for (const warning of warnings) {
          this.eventBus?.emit('erp.inventory.warning', {
            productId: warning.productId,
            productName: warning.product?.name,
            warehouse: warning.warehouse,
            quantity: warning.quantity,
            warningQty: warning.warningQty,
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('库存预警检查失败', error)
    }
  }
}
