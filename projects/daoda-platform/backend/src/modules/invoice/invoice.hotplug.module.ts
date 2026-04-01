/**
 * Invoice 发票管理模块
 * 热插拔核心模块 - 提供发票 CRUD 操作和业务流程管理
 *
 * 功能范围:
 * - 发票创建/编辑/删除
 * - 发票列表查询 (分页/筛选/搜索)
 * - 发票详情获取
 * - 发票状态管理 (草稿/已发送/已支付/逾期/作废)
 * - 开票操作 (发送发票)
 * - 交付操作 (标记已支付)
 * - 作废操作
 * - 统计数据获取
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

// 定义发票状态枚举
type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'

// ============================================
// 模块清单定义
// ============================================

export const INVOICE_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/invoice',
  name: '发票管理',
  version: '1.0.0',
  description: '发票管理核心模块，提供发票CRUD、状态管理、开票交付、作废流程',
  category: 'business' as const,
  tags: ['invoice', 'finance', 'billing'],
  dependencies: [{ id: '@daoda/auth', version: '>=1.0.0' }],
  permissions: [
    'invoice:create',
    'invoice:view',
    'invoice:edit',
    'invoice:delete',
    'invoice:issue',
    'invoice:pay',
    'invoice:cancel',
    'invoice:export',
    'invoice:statistic',
    'invoice:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
  builtin: true,
  system: false,
}

// ============================================
// Invoice 模块实现
// ============================================

export class InvoiceHotplugModule extends BaseModule {
  readonly manifest = INVOICE_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // 发票数据存储 (模拟 - 实际由 PrismaService 实现)
  private invoices: Map<string, any> = new Map()

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    await context.config.setModuleConfigs({
      defaultPageSize: 20,
      maxPageSize: 100,
      invoiceNumberPrefix: 'INV',
      invoiceNumberDatePattern: 'yyyyMMdd',
      allowNegativeAmount: false,
      enableAutoIssueDate: true,
    })

    this.logger?.info('发票管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.invoices.clear()
    this.logger?.info('发票管理模块已销毁')
  }

  // ============================================
  // 业务方法 (模拟，实际由 InvoiceService 处理)
  // ============================================

  /**
   * 生成发票号
   */
  private generateInvoiceNo(): string {
    this.logger?.info('生成发票号')
    return 'INV-20260330-0001'
  }

  /**
   * 创建发票
   */
  async create(data: any): Promise<any> {
    this.logger?.info('创建发票', data)
    return null
  }

  /**
   * 更新发票
   */
  async update(id: string, data: any): Promise<any> {
    this.logger?.info('更新发票', { id, data })
    return null
  }

  /**
   * 删除发票
   */
  async delete(id: string): Promise<void> {
    this.logger?.info('删除发票', { id })
  }

  /**
   * 获取发票列表
   */
  async findAll(query: any): Promise<any> {
    this.logger?.info('获取发票列表', query)
    return { list: [], total: 0 }
  }

  /**
   * 获取发票详情
   */
  async findOne(id: string): Promise<any> {
    this.logger?.info('获取发票详情', { id })
    return null
  }

  /**
   * 开票（发送发票）
   */
  async issue(id: string): Promise<any> {
    this.logger?.info('开票', { id })
    return null
  }

  /**
   * 标记为已支付
   */
  async markPaid(id: string): Promise<any> {
    this.logger?.info('标记为已支付', { id })
    return null
  }

  /**
   * 标记为逾期
   */
  async markOverdue(id: string): Promise<any> {
    this.logger?.info('标记为逾期', { id })
    return null
  }

  /**
   * 作废发票
   */
  async cancel(id: string): Promise<any> {
    this.logger?.info('作废发票', { id })
    return null
  }

  /**
   * 获取发票统计
   */
  async getStats(): Promise<any> {
    this.logger?.info('获取发票统计')
    return { total: 0, draft: 0, sent: 0, paid: 0, overdue: 0, cancelled: 0 }
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'invoice:create',
        name: '创建发票',
        description: '创建新发票',
        type: PermissionType.RESOURCE,
        resource: 'invoice',
        action: 'create',
      },
      {
        id: 'invoice:view',
        name: '查看发票',
        description: '查看发票列表和详情',
        type: PermissionType.RESOURCE,
        resource: 'invoice',
        action: 'view',
      },
      {
        id: 'invoice:edit',
        name: '编辑发票',
        description: '编辑发票信息（仅草稿状态）',
        type: PermissionType.RESOURCE,
        resource: 'invoice',
        action: 'edit',
      },
      {
        id: 'invoice:delete',
        name: '删除发票',
        description: '删除发票（仅草稿状态）',
        type: PermissionType.RESOURCE,
        resource: 'invoice',
        action: 'delete',
      },
      {
        id: 'invoice:issue',
        name: '开票',
        description: '确认发票（发送发票）',
        type: PermissionType.ACTION,
        resource: 'invoice',
        action: 'issue',
      },
      {
        id: 'invoice:pay',
        name: '交付发票',
        description: '标记发票为已支付',
        type: PermissionType.ACTION,
        resource: 'invoice',
        action: 'pay',
      },
      {
        id: 'invoice:cancel',
        name: '作废发票',
        description: '作废发票',
        type: PermissionType.ACTION,
        resource: 'invoice',
        action: 'cancel',
      },
      {
        id: 'invoice:export',
        name: '导出发票',
        description: '导出发票数据',
        type: PermissionType.ACTION,
        resource: 'invoice',
        action: 'export',
      },
      {
        id: 'invoice:statistic',
        name: '查看统计',
        description: '查看发票统计数据',
        type: PermissionType.ACTION,
        resource: 'invoice',
        action: 'statistic',
      },
      {
        id: 'invoice:admin',
        name: '发票管理员',
        description: '发票模块管理权限',
        type: PermissionType.ADMIN,
        resource: 'invoice',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'invoice-management',
        title: '发票管理',
        path: '/finance/invoices',
        icon: 'file-invoice',
        permissions: ['invoice:view'],
        order: 1,
        parentId: 'finance',
      },
      {
        id: 'invoice-stats',
        title: '发票统计',
        path: '/finance/invoices/stats',
        icon: 'bar-chart',
        permissions: ['invoice:statistic'],
        order: 2,
        parentId: 'finance',
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      // CRUD 路由
      {
        path: '/invoices',
        method: HttpMethod.POST,
        handler: 'create',
        description: '创建发票',
        permission: 'invoice:create',
      },
      {
        path: '/invoices',
        method: HttpMethod.GET,
        handler: 'findAll',
        description: '获取发票列表',
        permission: 'invoice:view',
        queryParams: [
          { name: 'page', type: 'number' as any, required: false, default: 1 },
          { name: 'pageSize', type: 'number' as any, required: false, default: 20 },
          { name: 'keyword', type: 'string' as any, required: false },
          { name: 'type', type: 'string' as any, required: false },
          { name: 'status', type: 'string' as any, required: false },
          { name: 'customerId', type: 'string' as any, required: false },
          { name: 'orderId', type: 'string' as any, required: false },
        ],
      },
      {
        path: '/invoices/:id',
        method: HttpMethod.GET,
        handler: 'findOne',
        description: '获取发票详情',
        permission: 'invoice:view',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '发票ID' }],
      },
      {
        path: '/invoices/:id',
        method: HttpMethod.PATCH,
        handler: 'update',
        description: '更新发票',
        permission: 'invoice:edit',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '发票ID' }],
      },
      {
        path: '/invoices/:id',
        method: HttpMethod.DELETE,
        handler: 'delete',
        description: '删除发票',
        permission: 'invoice:delete',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '发票ID' }],
      },
      // 业务操作路由
      {
        path: '/invoices/:id/issue',
        method: HttpMethod.POST,
        handler: 'issue',
        description: '开票（发送发票）',
        permission: 'invoice:issue',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '发票ID' }],
      },
      {
        path: '/invoices/:id/pay',
        method: HttpMethod.POST,
        handler: 'markPaid',
        description: '标记为已支付',
        permission: 'invoice:pay',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '发票ID' }],
      },
      {
        path: '/invoices/:id/cancel',
        method: HttpMethod.POST,
        handler: 'cancel',
        description: '作废发票',
        permission: 'invoice:cancel',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '发票ID' }],
      },
      {
        path: '/invoices/:id/overdue',
        method: HttpMethod.POST,
        handler: 'markOverdue',
        description: '标记为逾期',
        permission: 'invoice:pay',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '发票ID' }],
      },
      // 统计路由
      {
        path: '/invoices/stats',
        method: HttpMethod.GET,
        handler: 'getStats',
        description: '获取发票统计',
        permission: 'invoice:statistic',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'invoice.created',
        type: EventType.BUSINESS_DATA,
        description: '发票创建事件',
      },
      {
        name: 'invoice.updated',
        type: EventType.BUSINESS_DATA,
        description: '发票更新事件',
      },
      {
        name: 'invoice.deleted',
        type: EventType.BUSINESS_DATA,
        description: '发票删除事件',
      },
      {
        name: 'invoice.issued',
        type: EventType.BUSINESS_DATA,
        description: '发票开票事件',
      },
      {
        name: 'invoice.paid',
        type: EventType.BUSINESS_DATA,
        description: '发票支付事件',
      },
      {
        name: 'invoice.overdue',
        type: EventType.BUSINESS_DATA,
        description: '发票逾期事件',
      },
      {
        name: 'invoice.cancelled',
        type: EventType.BUSINESS_DATA,
        description: '发票作废事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const INVOICE_HOTPLUG_MODULE = {
  manifest: INVOICE_MODULE_MANIFEST,
  moduleClass: InvoiceHotplugModule,
}
