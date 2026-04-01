/**
 * 服务模块定义
 * 热插拔模块 - 聚合服务工单、合同管理、配件管理
 *
 * 企业售后服务核心模块，支撑工单处理、合同管理、配件库存
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

export const SERVICE_MODULE_MANIFEST: ModuleManifest = {
  // 基本信息
  id: '@daoda/service',
  name: '售后服务管理',
  version: '1.0.0',
  description: '售后服务模块，包含服务工单、合同管理、配件管理',

  // 分类
  category: 'business',
  tags: ['service', 'ticket', 'contract', 'part', 'after-sales', 'support'],

  // 依赖
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
    { id: '@daoda/crm', version: '>=1.0.0', optional: true }, // 客户数据关联
    { id: '@daoda/erp', version: '>=1.0.0', optional: true }, // 配件库存关联
  ],

  // 权限声明
  permissions: [
    'service:ticket:view',
    'service:ticket:create',
    'service:ticket:update',
    'service:ticket:delete',
    'service:ticket:assign',
    'service:ticket:close',
    'service:contract:view',
    'service:contract:create',
    'service:contract:update',
    'service:contract:delete',
    'service:contract:approve',
    'service:part:view',
    'service:part:create',
    'service:part:update',
    'service:part:delete',
    'service:part:stock',
    'service:report:view',
  ],

  // 热更新配置
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },

  // 技术信息
  routePrefix: '/api/v1/service',
  tablePrefix: 'service_',
}

// ============================================
// 服务模块实现
// ============================================

/**
 * Service 聚合模块
 * 售后服务核心 - 工单/合同/配件
 */
export class ServiceModule extends BaseModule {
  // 模块清单
  readonly manifest = SERVICE_MODULE_MANIFEST

  // ============================================
  // 生命周期钩子
  // ============================================

  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('服务模块安装开始...')

    // 检查数据库表
    const prisma = context.serviceRegistry.get<any>('prisma')
    if (prisma) {
      try {
        await prisma.serviceTicket.findFirst()
        await prisma.contract.findFirst()
        await prisma.part.findFirst()
        this.logger?.info('服务数据表验证成功')
      } catch (error) {
        this.logger?.warn('服务数据表可能不存在，需要初始化')
      }
    }

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      // 工单配置
      ticket: {
        priorityLevels: ['low', 'medium', 'high', 'urgent'],
        autoAssign: false,
        slaHours: {
          low: 72,
          medium: 48,
          high: 24,
          urgent: 4,
        },
        statusFlow: ['pending', 'assigned', 'in_progress', 'resolved', 'closed'],
      },
      // 合同配置
      contract: {
        sequencePrefix: 'CON',
        autoNumber: true,
        approvalThreshold: 100000, // 超过此金额需审批
        reminderDays: 30, // 合同到期提醒天数
      },
      // 配件配置
      part: {
        lowStockThreshold: 10,
        autoReorder: false,
        reorderQuantity: 50,
      },
    })

    this.logger?.info('服务模块安装完成')
  }

  /**
   * 初始化钩子
   */
  async onInit(): Promise<void> {
    await super.onInit()

    this.logger?.info('服务模块初始化...')

    // 注册内部服务
    this._context?.serviceRegistry.register(this.manifest.id, 'ticket', {
      service: 'ticket',
      methods: ['create', 'assign', 'update', 'resolve', 'close', 'slaCheck', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'contract', {
      service: 'contract',
      methods: ['create', 'approve', 'renew', 'terminate', 'expiryCheck', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'part', {
      service: 'part',
      methods: ['create', 'stockIn', 'stockOut', 'lowStockCheck', 'reorder', 'getStats'],
    })

    this.logger?.info('服务模块服务注册完成')
  }

  /**
   * 启动钩子
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('服务模块启动...')

    // 发送启动事件
    this.eventBus?.emit('service.started', {
      moduleId: this.manifest.id,
      version: this.manifest.version,
      timestamp: new Date().toISOString(),
    })

    // 检查 SLA 超时工单
    await this.checkSlaOverdue()

    // 检查合同到期提醒
    await this.checkContractExpiry()

    // 检查配件低库存
    await this.checkLowStockParts()

    this.logger?.info('服务模块已启动')
  }

  /**
   * 停止钩子
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('服务模块停止...')

    // 发送停止事件
    this.eventBus?.emit('service.stopped', {
      moduleId: this.manifest.id,
      timestamp: new Date().toISOString(),
    })

    this.logger?.info('服务模块已停止')
  }

  /**
   * 卸载钩子
   */
  async onUninstall(): Promise<void> {
    await super.onUninstall()

    this.logger?.info('服务模块卸载...')

    // 清理服务注册
    this._context?.serviceRegistry.unregister(this.manifest.id, 'ticket')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'contract')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'part')

    this.logger?.info('服务模块已卸载')
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
      ticketService: false,
      contractService: false,
      partService: false,
    }

    try {
      // 检查数据库连接
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`
        checks.database = true
      }

      // 检查服务注册
      checks.ticketService = this._context?.serviceRegistry.get('ticket') !== undefined
      checks.contractService = this._context?.serviceRegistry.get('contract') !== undefined
      checks.partService = this._context?.serviceRegistry.get('part') !== undefined
    } catch (error) {
      this.logger?.error('服务健康检查失败', error)
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
      // ===== 服务工单 API =====
      {
        path: '/ticket',
        method: HttpMethod.GET,
        handler: 'ticket.list',
        description: '工单列表查询',
        permission: 'service:ticket:view',
      },
      {
        path: '/ticket/:id',
        method: HttpMethod.GET,
        handler: 'ticket.detail',
        description: '工单详情',
        permission: 'service:ticket:view',
      },
      {
        path: '/ticket',
        method: HttpMethod.POST,
        handler: 'ticket.create',
        description: '创建工单',
        permission: 'service:ticket:create',
      },
      {
        path: '/ticket/:id',
        method: HttpMethod.PUT,
        handler: 'ticket.update',
        description: '更新工单',
        permission: 'service:ticket:update',
      },
      {
        path: '/ticket/:id/assign',
        method: HttpMethod.POST,
        handler: 'ticket.assign',
        description: '分配工单',
        permission: 'service:ticket:assign',
      },
      {
        path: '/ticket/:id/resolve',
        method: HttpMethod.POST,
        handler: 'ticket.resolve',
        description: '解决工单',
        permission: 'service:ticket:update',
      },
      {
        path: '/ticket/:id/close',
        method: HttpMethod.POST,
        handler: 'ticket.close',
        description: '关闭工单',
        permission: 'service:ticket:close',
      },
      {
        path: '/ticket/:id',
        method: HttpMethod.DELETE,
        handler: 'ticket.delete',
        description: '删除工单',
        permission: 'service:ticket:delete',
      },
      {
        path: '/ticket/stats',
        method: HttpMethod.GET,
        handler: 'ticket.stats',
        description: '工单统计',
        permission: 'service:ticket:view',
      },
      {
        path: '/ticket/sla-overdue',
        method: HttpMethod.GET,
        handler: 'ticket.slaOverdue',
        description: 'SLA超时工单',
        permission: 'service:ticket:view',
      },
      {
        path: '/ticket/by-customer/:customerId',
        method: HttpMethod.GET,
        handler: 'ticket.byCustomer',
        description: '客户工单列表',
        permission: 'service:ticket:view',
      },

      // ===== 合同管理 API =====
      {
        path: '/contract',
        method: HttpMethod.GET,
        handler: 'contract.list',
        description: '合同列表查询',
        permission: 'service:contract:view',
      },
      {
        path: '/contract/:id',
        method: HttpMethod.GET,
        handler: 'contract.detail',
        description: '合同详情',
        permission: 'service:contract:view',
      },
      {
        path: '/contract',
        method: HttpMethod.POST,
        handler: 'contract.create',
        description: '创建合同',
        permission: 'service:contract:create',
      },
      {
        path: '/contract/:id',
        method: HttpMethod.PUT,
        handler: 'contract.update',
        description: '更新合同',
        permission: 'service:contract:update',
      },
      {
        path: '/contract/:id/approve',
        method: HttpMethod.POST,
        handler: 'contract.approve',
        description: '审批合同',
        permission: 'service:contract:approve',
      },
      {
        path: '/contract/:id/renew',
        method: HttpMethod.POST,
        handler: 'contract.renew',
        description: '续签合同',
        permission: 'service:contract:create',
      },
      {
        path: '/contract/:id/terminate',
        method: HttpMethod.POST,
        handler: 'contract.terminate',
        description: '终止合同',
        permission: 'service:contract:delete',
      },
      {
        path: '/contract/:id',
        method: HttpMethod.DELETE,
        handler: 'contract.delete',
        description: '删除合同',
        permission: 'service:contract:delete',
      },
      {
        path: '/contract/expiring',
        method: HttpMethod.GET,
        handler: 'contract.expiring',
        description: '即将到期合同',
        permission: 'service:contract:view',
      },
      {
        path: '/contract/stats',
        method: HttpMethod.GET,
        handler: 'contract.stats',
        description: '合同统计',
        permission: 'service:contract:view',
      },
      {
        path: '/contract/by-customer/:customerId',
        method: HttpMethod.GET,
        handler: 'contract.byCustomer',
        description: '客户合同列表',
        permission: 'service:contract:view',
      },

      // ===== 配件管理 API =====
      {
        path: '/part',
        method: HttpMethod.GET,
        handler: 'part.list',
        description: '配件列表查询',
        permission: 'service:part:view',
      },
      {
        path: '/part/:id',
        method: HttpMethod.GET,
        handler: 'part.detail',
        description: '配件详情',
        permission: 'service:part:view',
      },
      {
        path: '/part',
        method: HttpMethod.POST,
        handler: 'part.create',
        description: '创建配件',
        permission: 'service:part:create',
      },
      {
        path: '/part/:id',
        method: HttpMethod.PUT,
        handler: 'part.update',
        description: '更新配件',
        permission: 'service:part:update',
      },
      {
        path: '/part/:id',
        method: HttpMethod.DELETE,
        handler: 'part.delete',
        description: '删除配件',
        permission: 'service:part:delete',
      },
      {
        path: '/part/:id/stock-in',
        method: HttpMethod.POST,
        handler: 'part.stockIn',
        description: '配件入库',
        permission: 'service:part:stock',
      },
      {
        path: '/part/:id/stock-out',
        method: HttpMethod.POST,
        handler: 'part.stockOut',
        description: '配件出库',
        permission: 'service:part:stock',
      },
      {
        path: '/part/low-stock',
        method: HttpMethod.GET,
        handler: 'part.lowStock',
        description: '低库存配件',
        permission: 'service:part:view',
      },
      {
        path: '/part/:id/reorder',
        method: HttpMethod.POST,
        handler: 'part.reorder',
        description: '配件补货',
        permission: 'service:part:stock',
      },
      {
        path: '/part/stats',
        method: HttpMethod.GET,
        handler: 'part.stats',
        description: '配件统计',
        permission: 'service:part:view',
      },

      // ===== 服务报表 API =====
      {
        path: '/report/summary',
        method: HttpMethod.GET,
        handler: 'report.summary',
        description: '服务汇总报表',
        permission: 'service:report:view',
      },
      {
        path: '/report/sla',
        method: HttpMethod.GET,
        handler: 'report.sla',
        description: 'SLA达成率报表',
        permission: 'service:report:view',
      },
      {
        path: '/report/contract-revenue',
        method: HttpMethod.GET,
        handler: 'report.contractRevenue',
        description: '合同收入报表',
        permission: 'service:report:view',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    // 工单权限
    const ticketPermissions = [
      ...this.generateCrudPermissions('service', 'ticket', '工单'),
      {
        id: 'service:ticket:assign',
        name: '分配工单',
        type: PermissionType.ACTION,
        description: '将工单分配给服务人员',
      },
      {
        id: 'service:ticket:close',
        name: '关闭工单',
        type: PermissionType.ACTION,
        description: '关闭已解决的工单',
      },
    ]

    // 合同权限
    const contractPermissions = [
      ...this.generateCrudPermissions('service', 'contract', '合同'),
      {
        id: 'service:contract:approve',
        name: '审批合同',
        type: PermissionType.ACTION,
        description: '审批合同，金额超过阈值时需要',
      },
    ]

    // 配件权限
    const partPermissions = [
      ...this.generateCrudPermissions('service', 'part', '配件'),
      {
        id: 'service:part:stock',
        name: '配件库存管理',
        type: PermissionType.ACTION,
        description: '配件入库和出库操作',
      },
    ]

    // 报表权限
    const reportPermissions: ModulePermission[] = [
      {
        id: 'service:report:view',
        name: '查看服务报表',
        type: PermissionType.RESOURCE,
        description: '查看服务汇总报表和SLA报表',
      },
    ]

    return [
      ...ticketPermissions,
      ...contractPermissions,
      ...partPermissions,
      ...reportPermissions,
    ] as ModulePermission[]
  }

  /**
   * 获取菜单定义
   */
  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'service',
        title: '售后服务',
        path: '/service',
        icon: 'tool',
        order: 5,
        children: [
          // 服务工单
          {
            id: 'service-ticket',
            title: '服务工单',
            path: '/service/ticket',
            icon: 'ticket',
            permissions: ['service:ticket:view'],
            order: 1,
            children: [
              {
                id: 'service-ticket-list',
                title: '工单列表',
                path: '/service/ticket/list',
                icon: 'list',
                permissions: ['service:ticket:view'],
                order: 1,
              },
              {
                id: 'service-ticket-sla',
                title: 'SLA超时',
                path: '/service/ticket/sla',
                icon: 'alert',
                permissions: ['service:ticket:view'],
                order: 2,
              },
              {
                id: 'service-ticket-stats',
                title: '工单统计',
                path: '/service/ticket/stats',
                icon: 'chart',
                permissions: ['service:ticket:view'],
                order: 3,
              },
            ],
          },
          // 合同管理
          {
            id: 'service-contract',
            title: '合同管理',
            path: '/service/contract',
            icon: 'file-contract',
            permissions: ['service:contract:view'],
            order: 2,
            children: [
              {
                id: 'service-contract-list',
                title: '合同列表',
                path: '/service/contract/list',
                icon: 'list',
                permissions: ['service:contract:view'],
                order: 1,
              },
              {
                id: 'service-contract-expiring',
                title: '即将到期',
                path: '/service/contract/expiring',
                icon: 'clock',
                permissions: ['service:contract:view'],
                order: 2,
              },
              {
                id: 'service-contract-stats',
                title: '合同统计',
                path: '/service/contract/stats',
                icon: 'chart',
                permissions: ['service:contract:view'],
                order: 3,
              },
            ],
          },
          // 配件管理
          {
            id: 'service-part',
            title: '配件管理',
            path: '/service/part',
            icon: 'box',
            permissions: ['service:part:view'],
            order: 3,
            children: [
              {
                id: 'service-part-list',
                title: '配件列表',
                path: '/service/part/list',
                icon: 'list',
                permissions: ['service:part:view'],
                order: 1,
              },
              {
                id: 'service-part-low-stock',
                title: '低库存',
                path: '/service/part/low-stock',
                icon: 'alert',
                permissions: ['service:part:view'],
                order: 2,
              },
              {
                id: 'service-part-stats',
                title: '配件统计',
                path: '/service/part/stats',
                icon: 'chart',
                permissions: ['service:part:view'],
                order: 3,
              },
            ],
          },
          // 服务报表
          {
            id: 'service-report',
            title: '服务报表',
            path: '/service/report',
            icon: 'chart-bar',
            permissions: ['service:report:view'],
            order: 4,
            children: [
              {
                id: 'service-report-summary',
                title: '服务汇总',
                path: '/service/report/summary',
                icon: 'dashboard',
                permissions: ['service:report:view'],
                order: 1,
              },
              {
                id: 'service-report-sla',
                title: 'SLA达成率',
                path: '/service/report/sla',
                icon: 'line-chart',
                permissions: ['service:report:view'],
                order: 2,
              },
              {
                id: 'service-report-revenue',
                title: '合同收入',
                path: '/service/report/contract-revenue',
                icon: 'bar-chart',
                permissions: ['service:report:view'],
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
      // 工单事件
      {
        name: 'service.ticket.created',
        type: EventType.BUSINESS_DATA,
        description: '工单创建',
      },
      {
        name: 'service.ticket.assigned',
        type: EventType.USER_ACTION,
        description: '工单分配',
      },
      {
        name: 'service.ticket.resolved',
        type: EventType.USER_ACTION,
        description: '工单解决',
      },
      {
        name: 'service.ticket.closed',
        type: EventType.USER_ACTION,
        description: '工单关闭',
      },
      {
        name: 'service.ticket.sla_overdue',
        type: EventType.SYSTEM,
        description: 'SLA超时',
      },

      // 合同事件
      {
        name: 'service.contract.created',
        type: EventType.BUSINESS_DATA,
        description: '合同创建',
      },
      {
        name: 'service.contract.approved',
        type: EventType.USER_ACTION,
        description: '合同审批通过',
      },
      {
        name: 'service.contract.expiring',
        type: EventType.SYSTEM,
        description: '合同即将到期',
      },
      {
        name: 'service.contract.terminated',
        type: EventType.USER_ACTION,
        description: '合同终止',
      },

      // 配件事件
      {
        name: 'service.part.low_stock',
        type: EventType.SYSTEM,
        description: '配件低库存',
      },
      {
        name: 'service.part.stock_in',
        type: EventType.USER_ACTION,
        description: '配件入库',
      },
      {
        name: 'service.part.stock_out',
        type: EventType.USER_ACTION,
        description: '配件出库',
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
   * 检查 SLA 超时工单
   */
  private async checkSlaOverdue(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const now = new Date()

      // 查找 SLA 超时但未解决的工单
      const overdueTickets = await prisma.serviceTicket.findMany({
        where: {
          status: { notIn: ['resolved', 'closed'] },
          slaDeadline: { lt: now },
        },
        include: { customer: true, assignee: true },
      })

      if (overdueTickets.length > 0) {
        this.logger?.warn(`发现 ${overdueTickets.length} 个 SLA 超时工单`)

        for (const ticket of overdueTickets) {
          this.eventBus?.emit('service.ticket.sla_overdue', {
            ticketId: ticket.id,
            ticketNo: ticket.ticketNo,
            customerId: ticket.customerId,
            customerName: ticket.customer?.name,
            assigneeId: ticket.assigneeId,
            assigneeName: ticket.assignee?.name,
            priority: ticket.priority,
            slaDeadline: ticket.slaDeadline,
            overdueMinutes: Math.floor(
              (now.getTime() - ticket.slaDeadline.getTime()) / (1000 * 60),
            ),
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('SLA 超时检查失败', error)
    }
  }

  /**
   * 检查合同到期提醒
   */
  private async checkContractExpiry(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const reminderDays = 30
      const expiryThreshold = new Date()
      expiryThreshold.setDate(expiryThreshold.getDate() + reminderDays)

      // 查找即将到期的合同
      const expiringContracts = await prisma.contract.findMany({
        where: {
          status: 'active',
          endDate: { lte: expiryThreshold, gte: new Date() },
        },
        include: { customer: true },
      })

      if (expiringContracts.length > 0) {
        this.logger?.info(`发现 ${expiringContracts.length} 个即将到期合同`)

        for (const contract of expiringContracts) {
          this.eventBus?.emit('service.contract.expiring', {
            contractId: contract.id,
            contractNo: contract.contractNo,
            customerId: contract.customerId,
            customerName: contract.customer?.name,
            endDate: contract.endDate,
            daysRemaining: Math.floor(
              (contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
            ),
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('合同到期检查失败', error)
    }
  }

  /**
   * 检查配件低库存
   */
  private async checkLowStockParts(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const lowStockThreshold = 10

      // 查找低库存配件
      const lowStockParts = await prisma.part.findMany({
        where: {
          stock: { lte: lowStockThreshold },
        },
      })

      if (lowStockParts.length > 0) {
        this.logger?.warn(`发现 ${lowStockParts.length} 个低库存配件`)

        for (const part of lowStockParts) {
          this.eventBus?.emit('service.part.low_stock', {
            partId: part.id,
            partNo: part.partNo,
            name: part.name,
            stock: part.stock,
            threshold: lowStockThreshold,
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('配件低库存检查失败', error)
    }
  }
}
