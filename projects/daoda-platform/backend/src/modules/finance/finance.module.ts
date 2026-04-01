/**
 * 财务模块定义
 * 热插拔模块 - 聚合发票、应收账款、应付账款
 *
 * 企业财务管理核心模块，支撑财务核算与资金管理
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

export const FINANCE_MODULE_MANIFEST: ModuleManifest = {
  // 基本信息
  id: '@daoda/finance',
  name: '财务管理系统',
  version: '1.0.0',
  description: '财务管理模块，包含发票管理、应收账款、应付账款',

  // 分类
  category: 'business',
  tags: ['finance', 'invoice', 'receivable', 'payable', 'accounting'],

  // 依赖
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
    { id: '@daoda/crm', version: '>=1.0.0', optional: true }, // 客户数据关联
    { id: '@daoda/erp', version: '>=1.0.0', optional: true }, // 采购数据关联
  ],

  // 权限声明
  permissions: [
    'finance:invoice:view',
    'finance:invoice:create',
    'finance:invoice:update',
    'finance:invoice:delete',
    'finance:invoice:approve',
    'finance:receivable:view',
    'finance:receivable:create',
    'finance:receivable:update',
    'finance:receivable:collect',
    'finance:payable:view',
    'finance:payable:create',
    'finance:payable:update',
    'finance:payable:pay',
    'finance:report:view',
  ],

  // 热更新配置
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },

  // 技术信息
  routePrefix: '/api/v1/finance',
  tablePrefix: 'finance_',
}

// ============================================
// 财务模块实现
// ============================================

/**
 * Finance 聚合模块
 * 财务管理核心 - 发票/应收/应付
 */
export class FinanceModule extends BaseModule {
  // 模块清单
  readonly manifest = FINANCE_MODULE_MANIFEST

  // ============================================
  // 生命周期钩子
  // ============================================

  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('财务模块安装开始...')

    // 检查数据库表
    const prisma = context.serviceRegistry.get<any>('prisma')
    if (prisma) {
      try {
        await prisma.invoice.findFirst()
        await prisma.receivable.findFirst()
        await prisma.payable.findFirst()
        this.logger?.info('财务数据表验证成功')
      } catch (error) {
        this.logger?.warn('财务数据表可能不存在，需要初始化')
      }
    }

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      // 发票配置
      invoice: {
        sequencePrefix: 'INV',
        autoNumber: true,
        taxRate: 0.13, // 13%增值税
        approvalThreshold: 50000, // 超过此金额需审批
      },
      // 应收账款配置
      receivable: {
        agingThresholds: [30, 60, 90, 180], // 账龄分段
        autoReminder: true,
        reminderDays: [7, 15, 30], // 提前提醒天数
      },
      // 应付账款配置
      payable: {
        paymentTerms: ['prepaid', 'monthly', 'quarterly'],
        autoApprovalLimit: 10000,
      },
    })

    this.logger?.info('财务模块安装完成')
  }

  /**
   * 初始化钩子
   */
  async onInit(): Promise<void> {
    await super.onInit()

    this.logger?.info('财务模块初始化...')

    // 注册内部服务
    this._context?.serviceRegistry.register(this.manifest.id, 'invoice', {
      service: 'invoice',
      methods: ['create', 'approve', 'void', 'getByCustomer', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'receivable', {
      service: 'receivable',
      methods: ['create', 'collect', 'agingAnalysis', 'getOverdue', 'sendReminder'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'payable', {
      service: 'payable',
      methods: ['create', 'pay', 'getBySupplier', 'getPending', 'agingReport'],
    })

    this.logger?.info('财务模块服务注册完成')
  }

  /**
   * 启动钩子
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('财务模块启动...')

    // 发送启动事件
    this.eventBus?.emit('finance.started', {
      moduleId: this.manifest.id,
      version: this.manifest.version,
      timestamp: new Date().toISOString(),
    })

    // 检查应收账款逾期提醒
    await this.checkReceivableReminders()

    this.logger?.info('财务模块已启动')
  }

  /**
   * 停止钩子
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('财务模块停止...')

    // 发送停止事件
    this.eventBus?.emit('finance.stopped', {
      moduleId: this.manifest.id,
      timestamp: new Date().toISOString(),
    })

    this.logger?.info('财务模块已停止')
  }

  /**
   * 卸载钩子
   */
  async onUninstall(): Promise<void> {
    await super.onUninstall()

    this.logger?.info('财务模块卸载...')

    // 清理服务注册
    this._context?.serviceRegistry.unregister(this.manifest.id, 'invoice')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'receivable')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'payable')

    this.logger?.info('财务模块已卸载')
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
      invoiceService: false,
      receivableService: false,
      payableService: false,
    }

    try {
      // 检查数据库连接
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`
        checks.database = true
      }

      // 检查服务注册
      checks.invoiceService = this._context?.serviceRegistry.get('invoice') !== undefined
      checks.receivableService = this._context?.serviceRegistry.get('receivable') !== undefined
      checks.payableService = this._context?.serviceRegistry.get('payable') !== undefined
    } catch (error) {
      this.logger?.error('财务健康检查失败', error)
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
      // ===== 发票管理 API =====
      {
        path: '/invoice',
        method: HttpMethod.GET,
        handler: 'invoice.list',
        description: '发票列表查询',
        permission: 'finance:invoice:view',
      },
      {
        path: '/invoice/:id',
        method: HttpMethod.GET,
        handler: 'invoice.detail',
        description: '发票详情',
        permission: 'finance:invoice:view',
      },
      {
        path: '/invoice',
        method: HttpMethod.POST,
        handler: 'invoice.create',
        description: '创建发票',
        permission: 'finance:invoice:create',
      },
      {
        path: '/invoice/:id',
        method: HttpMethod.PUT,
        handler: 'invoice.update',
        description: '更新发票',
        permission: 'finance:invoice:update',
      },
      {
        path: '/invoice/:id/approve',
        method: HttpMethod.POST,
        handler: 'invoice.approve',
        description: '审批发票',
        permission: 'finance:invoice:approve',
      },
      {
        path: '/invoice/:id/void',
        method: HttpMethod.POST,
        handler: 'invoice.void',
        description: '作废发票',
        permission: 'finance:invoice:delete',
      },
      {
        path: '/invoice/stats',
        method: HttpMethod.GET,
        handler: 'invoice.stats',
        description: '发票统计',
        permission: 'finance:invoice:view',
      },
      {
        path: '/invoice/by-customer/:customerId',
        method: HttpMethod.GET,
        handler: 'invoice.byCustomer',
        description: '客户发票列表',
        permission: 'finance:invoice:view',
      },

      // ===== 应收账款 API =====
      {
        path: '/receivable',
        method: HttpMethod.GET,
        handler: 'receivable.list',
        description: '应收账款列表',
        permission: 'finance:receivable:view',
      },
      {
        path: '/receivable/:id',
        method: HttpMethod.GET,
        handler: 'receivable.detail',
        description: '应收账款详情',
        permission: 'finance:receivable:view',
      },
      {
        path: '/receivable',
        method: HttpMethod.POST,
        handler: 'receivable.create',
        description: '创建应收账款',
        permission: 'finance:receivable:create',
      },
      {
        path: '/receivable/:id/collect',
        method: HttpMethod.POST,
        handler: 'receivable.collect',
        description: '收款登记',
        permission: 'finance:receivable:collect',
      },
      {
        path: '/receivable/aging',
        method: HttpMethod.GET,
        handler: 'receivable.aging',
        description: '账龄分析',
        permission: 'finance:receivable:view',
      },
      {
        path: '/receivable/overdue',
        method: HttpMethod.GET,
        handler: 'receivable.overdue',
        description: '逾期应收账款',
        permission: 'finance:receivable:view',
      },
      {
        path: '/receivable/:id/reminder',
        method: HttpMethod.POST,
        handler: 'receivable.reminder',
        description: '发送催款提醒',
        permission: 'finance:receivable:update',
      },

      // ===== 应付账款 API =====
      {
        path: '/payable',
        method: HttpMethod.GET,
        handler: 'payable.list',
        description: '应付账款列表',
        permission: 'finance:payable:view',
      },
      {
        path: '/payable/:id',
        method: HttpMethod.GET,
        handler: 'payable.detail',
        description: '应付账款详情',
        permission: 'finance:payable:view',
      },
      {
        path: '/payable',
        method: HttpMethod.POST,
        handler: 'payable.create',
        description: '创建应付账款',
        permission: 'finance:payable:create',
      },
      {
        path: '/payable/:id/pay',
        method: HttpMethod.POST,
        handler: 'payable.pay',
        description: '付款登记',
        permission: 'finance:payable:pay',
      },
      {
        path: '/payable/pending',
        method: HttpMethod.GET,
        handler: 'payable.pending',
        description: '待付款列表',
        permission: 'finance:payable:view',
      },
      {
        path: '/payable/aging',
        method: HttpMethod.GET,
        handler: 'payable.aging',
        description: '应付账龄分析',
        permission: 'finance:payable:view',
      },
      {
        path: '/payable/by-supplier/:supplierId',
        method: HttpMethod.GET,
        handler: 'payable.bySupplier',
        description: '供应商应付账款',
        permission: 'finance:payable:view',
      },

      // ===== 财务报表 API =====
      {
        path: '/report/summary',
        method: HttpMethod.GET,
        handler: 'report.summary',
        description: '财务汇总报表',
        permission: 'finance:report:view',
      },
      {
        path: '/report/cashflow',
        method: HttpMethod.GET,
        handler: 'report.cashflow',
        description: '现金流报表',
        permission: 'finance:report:view',
      },
      {
        path: '/report/ar-ap',
        method: HttpMethod.GET,
        handler: 'report.arAp',
        description: '应收应付对比报表',
        permission: 'finance:report:view',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    // 发票权限
    const invoicePermissions = [
      ...this.generateCrudPermissions('finance', 'invoice', '发票'),
      {
        id: 'finance:invoice:approve',
        name: '审批发票',
        type: PermissionType.ACTION,
        description: '审批发票，金额超过阈值时需要',
      },
    ]

    // 应收账款权限
    const receivablePermissions = [
      ...this.generateCrudPermissions('finance', 'receivable', '应收账款'),
      {
        id: 'finance:receivable:collect',
        name: '收款登记',
        type: PermissionType.ACTION,
        description: '登记应收账款收款',
      },
    ]

    // 应付账款权限
    const payablePermissions = [
      ...this.generateCrudPermissions('finance', 'payable', '应付账款'),
      {
        id: 'finance:payable:pay',
        name: '付款登记',
        type: PermissionType.ACTION,
        description: '登记应付账款付款',
      },
    ]

    // 报表权限
    const reportPermissions: ModulePermission[] = [
      {
        id: 'finance:report:view',
        name: '查看财务报表',
        type: PermissionType.RESOURCE,
        description: '查看财务汇总报表和现金流报表',
      },
    ]

    return [
      ...invoicePermissions,
      ...receivablePermissions,
      ...payablePermissions,
      ...reportPermissions,
    ] as ModulePermission[]
  }

  /**
   * 获取菜单定义
   */
  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'finance',
        title: '财务管理',
        path: '/finance',
        icon: 'wallet',
        order: 4,
        children: [
          // 发票管理
          {
            id: 'finance-invoice',
            title: '发票管理',
            path: '/finance/invoice',
            icon: 'file-text',
            permissions: ['finance:invoice:view'],
            order: 1,
            children: [
              {
                id: 'finance-invoice-list',
                title: '发票列表',
                path: '/finance/invoice/list',
                icon: 'list',
                permissions: ['finance:invoice:view'],
                order: 1,
              },
              {
                id: 'finance-invoice-stats',
                title: '发票统计',
                path: '/finance/invoice/stats',
                icon: 'chart',
                permissions: ['finance:invoice:view'],
                order: 2,
              },
            ],
          },
          // 应收账款
          {
            id: 'finance-receivable',
            title: '应收账款',
            path: '/finance/receivable',
            icon: 'arrow-down',
            permissions: ['finance:receivable:view'],
            order: 2,
            children: [
              {
                id: 'finance-receivable-list',
                title: '应收列表',
                path: '/finance/receivable/list',
                icon: 'list',
                permissions: ['finance:receivable:view'],
                order: 1,
              },
              {
                id: 'finance-receivable-aging',
                title: '账龄分析',
                path: '/finance/receivable/aging',
                icon: 'calendar',
                permissions: ['finance:receivable:view'],
                order: 2,
              },
              {
                id: 'finance-receivable-overdue',
                title: '逾期提醒',
                path: '/finance/receivable/overdue',
                icon: 'alert',
                permissions: ['finance:receivable:view'],
                order: 3,
              },
            ],
          },
          // 应付账款
          {
            id: 'finance-payable',
            title: '应付账款',
            path: '/finance/payable',
            icon: 'arrow-up',
            permissions: ['finance:payable:view'],
            order: 3,
            children: [
              {
                id: 'finance-payable-list',
                title: '应付列表',
                path: '/finance/payable/list',
                icon: 'list',
                permissions: ['finance:payable:view'],
                order: 1,
              },
              {
                id: 'finance-payable-pending',
                title: '待付款',
                path: '/finance/payable/pending',
                icon: 'clock',
                permissions: ['finance:payable:view'],
                order: 2,
              },
              {
                id: 'finance-payable-aging',
                title: '账龄分析',
                path: '/finance/payable/aging',
                icon: 'calendar',
                permissions: ['finance:payable:view'],
                order: 3,
              },
            ],
          },
          // 财务报表
          {
            id: 'finance-report',
            title: '财务报表',
            path: '/finance/report',
            icon: 'chart-bar',
            permissions: ['finance:report:view'],
            order: 4,
            children: [
              {
                id: 'finance-report-summary',
                title: '财务汇总',
                path: '/finance/report/summary',
                icon: 'dashboard',
                permissions: ['finance:report:view'],
                order: 1,
              },
              {
                id: 'finance-report-cashflow',
                title: '现金流',
                path: '/finance/report/cashflow',
                icon: 'line-chart',
                permissions: ['finance:report:view'],
                order: 2,
              },
              {
                id: 'finance-report-arap',
                title: '应收应付对比',
                path: '/finance/report/ar-ap',
                icon: 'bar-chart',
                permissions: ['finance:report:view'],
                order: 3,
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
      // 发票事件
      {
        name: 'finance.invoice.created',
        type: EventType.BUSINESS_DATA,
        description: '发票创建',
      },
      {
        name: 'finance.invoice.approved',
        type: EventType.USER_ACTION,
        description: '发票审批通过',
      },
      {
        name: 'finance.invoice.voided',
        type: EventType.USER_ACTION,
        description: '发票作废',
      },

      // 应收账款事件
      {
        name: 'finance.receivable.created',
        type: EventType.BUSINESS_DATA,
        description: '应收账款创建',
      },
      {
        name: 'finance.receivable.collected',
        type: EventType.USER_ACTION,
        description: '应收账款收款',
      },
      {
        name: 'finance.receivable.overdue',
        type: EventType.SYSTEM,
        description: '应收账款逾期',
      },

      // 应付账款事件
      {
        name: 'finance.payable.created',
        type: EventType.BUSINESS_DATA,
        description: '应付账款创建',
      },
      {
        name: 'finance.payable.paid',
        type: EventType.USER_ACTION,
        description: '应付账款付款',
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
   * 检查应收账款逾期提醒
   */
  private async checkReceivableReminders(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const today = new Date()

      // 查找逾期应收账款
      const overdueReceivables = await prisma.receivable.findMany({
        where: {
          dueDate: { lt: today },
          status: 'pending',
        },
        include: { customer: true },
      })

      if (overdueReceivables.length > 0) {
        this.logger?.warn(`发现 ${overdueReceivables.length} 笔逾期应收账款`)

        // 发送逾期事件
        for (const receivable of overdueReceivables) {
          this.eventBus?.emit('finance.receivable.overdue', {
            receivableId: receivable.id,
            customerId: receivable.customerId,
            customerName: receivable.customer?.name,
            amount: receivable.amount,
            dueDate: receivable.dueDate,
            overdueDays: Math.floor(
              (today.getTime() - receivable.dueDate.getTime()) / (1000 * 60 * 60 * 24),
            ),
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('应收账款逾期检查失败', error)
    }
  }
}
