/**
 * 客户管理热插拔模块
 * 提供客户、跟进记录等核心 CRM 功能
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

export const CUSTOMER_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/customer',
  name: '客户管理',
  version: '1.0.0',
  description: '客户信息管理、跟进记录、客户分级、批量操作',
  category: 'business',
  tags: ['crm', 'customer', 'follow-up', 'sales'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/tenant', version: '>=1.0.0' },
  ],
  permissions: [
    'customer:create',
    'customer:view',
    'customer:update',
    'customer:delete',
    'customer:assign',
    'customer:export',
    'customer:import',
    'follow-up:create',
    'follow-up:view',
    'follow-up:delete',
    'customer:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.ROLLING,
  },
  builtin: false,
  system: false,
}

// ============================================
// 客户模块实现
// ============================================

export class CustomerHotplugModule extends BaseModule {
  readonly manifest = CUSTOMER_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    // 配置默认值
    await context.config.setModuleConfigs(this.manifest.id, {
      defaultLevel: 'B', // 默认客户等级
      autoAssign: true, // 自动分配
      levels: ['A', 'B', 'C'], // 客户等级
      statuses: ['ACTIVE', 'INACTIVE', 'LOST'], // 客户状态
      sources: ['官网', '展会', '推荐', '电话', '其他'], // 客户来源
      industries: ['景区', '高尔夫', '园区', '游乐场', '其他'], // 行业分类
      maxFollowUpDays: 7, // 跟进提醒天数
    })

    this.logger?.info('客户管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.logger?.info('客户管理模块已销毁')
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'customer:create',
        name: '创建客户',
        description: '创建新客户',
        type: PermissionType.ACTION,
        resource: 'customer',
        action: 'create',
      },
      {
        id: 'customer:view',
        name: '查看客户',
        description: '查看客户列表和详情',
        type: PermissionType.ACTION,
        resource: 'customer',
        action: 'view',
      },
      {
        id: 'customer:update',
        name: '更新客户',
        description: '修改客户信息',
        type: PermissionType.ACTION,
        resource: 'customer',
        action: 'update',
      },
      {
        id: 'customer:delete',
        name: '删除客户',
        description: '删除客户（标记为流失）',
        type: PermissionType.ACTION,
        resource: 'customer',
        action: 'delete',
      },
      {
        id: 'customer:assign',
        name: '分配客户',
        description: '将客户分配给销售人员',
        type: PermissionType.ACTION,
        resource: 'customer',
        action: 'assign',
      },
      {
        id: 'customer:export',
        name: '导出客户',
        description: '导出客户数据',
        type: PermissionType.ACTION,
        resource: 'customer',
        action: 'export',
      },
      {
        id: 'customer:import',
        name: '导入客户',
        description: '批量导入客户',
        type: PermissionType.ACTION,
        resource: 'customer',
        action: 'import',
      },
      {
        id: 'follow-up:create',
        name: '创建跟进',
        description: '添加客户跟进记录',
        type: PermissionType.ACTION,
        resource: 'follow-up',
        action: 'create',
      },
      {
        id: 'follow-up:view',
        name: '查看跟进',
        description: '查看客户跟进历史',
        type: PermissionType.ACTION,
        resource: 'follow-up',
        action: 'view',
      },
      {
        id: 'follow-up:delete',
        name: '删除跟进',
        description: '删除跟进记录',
        type: PermissionType.ACTION,
        resource: 'follow-up',
        action: 'delete',
      },
      {
        id: 'customer:admin',
        name: '客户管理管理员',
        description: '客户模块管理权限',
        type: PermissionType.ADMIN,
        resource: 'customer',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'customer',
        title: '客户列表',
        icon: 'TeamOutlined',
        path: '/crm/customers',
        parentId: 'crm',
        order: 10,
        visible: true,
        permissions: ['customer:view'],
      },
      {
        id: 'follow-up',
        title: '跟进记录',
        icon: 'MessageOutlined',
        path: '/crm/follow-ups',
        parentId: 'crm',
        order: 20,
        visible: true,
        permissions: ['follow-up:view'],
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      // 客户 CRUD
      {
        path: '/api/v1/customers',
        method: HttpMethod.POST,
        handler: 'create',
        description: '创建客户',
        permission: 'customer:create',
      },
      {
        path: '/api/v1/customers',
        method: HttpMethod.GET,
        handler: 'findAll',
        description: '获取客户列表',
        permission: 'customer:view',
      },
      {
        path: '/api/v1/customers/:id',
        method: HttpMethod.GET,
        handler: 'findOne',
        description: '获取客户详情',
        permission: 'customer:view',
      },
      {
        path: '/api/v1/customers/:id',
        method: HttpMethod.PUT,
        handler: 'update',
        description: '更新客户',
        permission: 'customer:update',
      },
      {
        path: '/api/v1/customers/:id',
        method: HttpMethod.DELETE,
        handler: 'delete',
        description: '删除客户',
        permission: 'customer:delete',
      },
      // 批量操作
      {
        path: '/api/v1/customers/batch-assign',
        method: HttpMethod.POST,
        handler: 'batchAssign',
        description: '批量分配客户',
        permission: 'customer:assign',
      },
      {
        path: '/api/v1/customers/batch-update-status',
        method: HttpMethod.POST,
        handler: 'batchUpdateStatus',
        description: '批量更新状态',
        permission: 'customer:update',
      },
      {
        path: '/api/v1/customers/import',
        method: HttpMethod.POST,
        handler: 'batchImport',
        description: '批量导入客户',
        permission: 'customer:import',
      },
      {
        path: '/api/v1/customers/export',
        method: HttpMethod.GET,
        handler: 'export',
        description: '导出客户',
        permission: 'customer:export',
      },
      // 跟进记录
      {
        path: '/api/v1/customers/:id/follow-ups',
        method: HttpMethod.POST,
        handler: 'addFollowUp',
        description: '添加跟进记录',
        permission: 'follow-up:create',
      },
      {
        path: '/api/v1/customers/:id/follow-ups',
        method: HttpMethod.GET,
        handler: 'getFollowUps',
        description: '获取跟进记录',
        permission: 'follow-up:view',
      },
      {
        path: '/api/v1/customers/follow-ups/:id',
        method: HttpMethod.DELETE,
        handler: 'deleteFollowUp',
        description: '删除跟进记录',
        permission: 'follow-up:delete',
      },
      // 待跟进
      {
        path: '/api/v1/customers/pending-follow-ups',
        method: HttpMethod.GET,
        handler: 'getPendingFollowUps',
        description: '获取待跟进客户',
        permission: 'follow-up:view',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'customer.created',
        type: EventType.BUSINESS_DATA,
        description: '客户创建事件',
      },
      {
        name: 'customer.updated',
        type: EventType.BUSINESS_DATA,
        description: '客户更新事件',
      },
      {
        name: 'customer.deleted',
        type: EventType.BUSINESS_DATA,
        description: '客户删除事件',
      },
      {
        name: 'customer.assigned',
        type: EventType.BUSINESS_DATA,
        description: '客户分配事件',
      },
      {
        name: 'customer.level-changed',
        type: EventType.BUSINESS_DATA,
        description: '客户等级变更事件',
      },
      {
        name: 'follow-up.created',
        type: EventType.USER_ACTION,
        description: '跟进记录创建事件',
      },
      {
        name: 'follow-up.reminder',
        type: EventType.SYSTEM,
        description: '跟进提醒事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const CUSTOMER_HOTPLUG_MODULE = {
  manifest: CUSTOMER_MODULE_MANIFEST,
  moduleClass: CustomerHotplugModule,
}
