/**
 * CRM 模块定义
 * 热插拔模块示例 - 聚合客户管理、线索、商机
 *
 * 简化版本，展示核心热插拔功能
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

export const CRM_MODULE_MANIFEST: ModuleManifest = {
  // 基本信息
  id: '@daoda/crm',
  name: 'CRM客户管理',
  version: '1.0.0',
  description: '客户关系管理模块，包含客户管理、线索管理、商机管理',

  // 分类
  category: 'business',
  tags: ['crm', 'customer', 'lead', 'opportunity', 'sales'],

  // 依赖
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
  ],

  // 权限声明（简化为数组）
  permissions: ['crm:customer:view', 'crm:customer:create', 'crm:lead:view'],

  // 热更新配置
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
}

// ============================================
// CRM 模块实现
// ============================================

/**
 * CRM 聚合模块
 * 展示热插拔模块核心功能
 */
export class CrmModule extends BaseModule {
  // 模块清单
  readonly manifest = CRM_MODULE_MANIFEST

  // ============================================
  // 生命周期钩子（无参数，使用 this._context）
  // ============================================

  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('CRM 模块安装开始...')

    // 检查数据库表
    const prisma = context.serviceRegistry.get<any>('prisma')
    if (prisma) {
      try {
        await prisma.customer.findFirst()
        await prisma.lead.findFirst()
        await prisma.opportunity.findFirst()
        this.logger?.info('CRM 数据表验证成功')
      } catch (error) {
        this.logger?.warn('CRM 数据表可能不存在')
      }
    }

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      poolRules: { recycleDays: 30 },
      customerLevels: ['VIP', 'A', 'B', 'C', 'D'],
    })

    this.logger?.info('CRM 模块安装完成')
  }

  /**
   * 启动钩子
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('CRM 模块启动...')

    // 发送模块启动事件
    await this._context?.eventBus.emit('crm.module.started', {
      moduleId: this.manifest.id,
      timestamp: Date.now(),
    })

    this.logger?.info('CRM 模块已启动')
  }

  /**
   * 停止钩子
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('CRM 模块停止...')

    // 发送模块停止事件
    await this._context?.eventBus.emit('crm.module.stopped', {
      moduleId: this.manifest.id,
      timestamp: Date.now(),
    })
  }

  // ============================================
  // 扩展点实现
  // ============================================

  /**
   * 获取路由定义
   */
  getRoutes(): ModuleRoute[] {
    return [
      // 客户管理路由
      {
        path: '/api/v1/crm/customers',
        method: HttpMethod.GET,
        handler: 'customer.findAll',
        permission: 'crm:customer:view',
        description: '获取客户列表',
      },
      {
        path: '/api/v1/crm/customers/:id',
        method: HttpMethod.GET,
        handler: 'customer.findOne',
        permission: 'crm:customer:view',
        description: '获取客户详情',
      },
      {
        path: '/api/v1/crm/customers',
        method: HttpMethod.POST,
        handler: 'customer.create',
        permission: 'crm:customer:create',
        description: '创建客户',
      },
      {
        path: '/api/v1/crm/customers/:id',
        method: HttpMethod.PUT,
        handler: 'customer.update',
        permission: 'crm:customer:update',
        description: '更新客户',
      },
      // 线索管理路由
      {
        path: '/api/v1/crm/leads',
        method: HttpMethod.GET,
        handler: 'lead.findAll',
        permission: 'crm:lead:view',
        description: '获取线索列表',
      },
      {
        path: '/api/v1/crm/leads/:id',
        method: HttpMethod.GET,
        handler: 'lead.findOne',
        permission: 'crm:lead:view',
        description: '获取线索详情',
      },
      // 商机管理路由
      {
        path: '/api/v1/crm/opportunities',
        method: HttpMethod.GET,
        handler: 'opportunity.findAll',
        permission: 'crm:opportunity:view',
        description: '获取商机列表',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'crm:customer:view',
        name: '查看客户',
        type: PermissionType.RESOURCE,
        resource: 'customer',
        action: 'view',
      },
      {
        id: 'crm:customer:create',
        name: '创建客户',
        type: PermissionType.RESOURCE,
        resource: 'customer',
        action: 'create',
      },
      {
        id: 'crm:customer:update',
        name: '编辑客户',
        type: PermissionType.RESOURCE,
        resource: 'customer',
        action: 'edit',
      },
      {
        id: 'crm:customer:delete',
        name: '删除客户',
        type: PermissionType.RESOURCE,
        resource: 'customer',
        action: 'delete',
      },
      {
        id: 'crm:lead:view',
        name: '查看线索',
        type: PermissionType.RESOURCE,
        resource: 'lead',
        action: 'view',
      },
      {
        id: 'crm:lead:create',
        name: '创建线索',
        type: PermissionType.RESOURCE,
        resource: 'lead',
        action: 'create',
      },
      {
        id: 'crm:opportunity:view',
        name: '查看商机',
        type: PermissionType.RESOURCE,
        resource: 'opportunity',
        action: 'view',
      },
      {
        id: 'crm:opportunity:create',
        name: '创建商机',
        type: PermissionType.RESOURCE,
        resource: 'opportunity',
        action: 'create',
      },
    ]
  }

  /**
   * 获取菜单定义
   */
  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'crm',
        title: 'CRM客户管理',
        path: '/crm',
        icon: 'team',
        order: 2,
        children: [
          {
            id: 'crm-customer',
            title: '客户管理',
            path: '/crm/customer',
            icon: 'user',
            permissions: ['crm:customer:view'],
            order: 1,
          },
          {
            id: 'crm-lead',
            title: '线索管理',
            path: '/crm/lead',
            icon: 'phone',
            permissions: ['crm:lead:view'],
            order: 2,
          },
          {
            id: 'crm-opportunity',
            title: '商机管理',
            path: '/crm/opportunity',
            icon: 'dollar',
            permissions: ['crm:opportunity:view'],
            order: 3,
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
      {
        name: 'crm.customer.created',
        type: EventType.BUSINESS_DATA,
        description: '客户创建事件',
      },
      {
        name: 'crm.customer.updated',
        type: EventType.BUSINESS_DATA,
        description: '客户更新事件',
      },
      {
        name: 'crm.lead.created',
        type: EventType.BUSINESS_DATA,
        description: '线索创建事件',
      },
      {
        name: 'crm.lead.converted',
        type: EventType.BUSINESS_DATA,
        description: '线索转化事件',
      },
      {
        name: 'crm.opportunity.created',
        type: EventType.BUSINESS_DATA,
        description: '商机创建事件',
      },
      {
        name: 'crm.opportunity.closed',
        type: EventType.BUSINESS_DATA,
        description: '商机关闭事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export { CRM_MODULE_MANIFEST as CRM_MANIFEST }
