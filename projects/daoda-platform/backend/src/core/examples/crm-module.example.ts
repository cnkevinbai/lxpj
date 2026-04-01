/**
 * 示例模块实现 - CRM 模块
 * 展示如何使用热插拔框架开发业务模块
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { BaseModule, ModuleManifest, ModuleStatus, ModuleHealth } from '../../core'
import {
  ModuleContext,
  ModuleRoute,
  ModulePermission,
  ModuleMenuItem,
  HttpMethod,
  PermissionType,
  generateCrudPermissions,
} from '../../core'

/**
 * CRM 模块清单定义
 */
const CRM_MANIFEST: ModuleManifest = {
  id: '@daoda/crm',
  name: 'CRM客户管理',
  version: '1.0.0',
  description: '客户关系管理模块，包含客户、线索、商机、订单管理',
  author: '道达智能',
  category: 'business',
  tags: ['crm', 'customer', 'sales', 'marketing'],
  routePrefix: '/api/v1/crm',
  tablePrefix: 'crm_',
  dependencies: [
    { id: '@daoda/core', version: '^1.0.0' },
    { id: '@daoda/auth', version: '^1.0.0', optional: true },
  ],
  hotUpdate: {
    enabled: true,
    strategy: 'rolling' as any,
    rollback: { enabled: true, maxRetries: 3 },
  },
  permissions: ['crm:*'],
  capabilities: ['customerManagement', 'leadManagement', 'orderManagement'],
}

/**
 * CRM 模块实现
 *
 * 继承 BaseModule 基类实现热插拔能力
 */
@ModuleManifest(CRM_MANIFEST)
export class CrmModuleExample extends BaseModule {
  /** 模块清单 */
  readonly manifest = CRM_MANIFEST

  /**
   * 安装钩子 - 初始化数据库表
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger!.info('CRM 模块安装开始')

    // 初始化数据库表结构
    // 实际项目中使用 Prisma 迁移或 SQL
    this.logger!.debug('创建数据库表结构...')

    // 创建默认配置
    await this.config!.set('crm.max_customers', 10000, { moduleId: this.manifest.id })
    await this.config!.set('crm.max_leads', 50000, { moduleId: this.manifest.id })
    await this.config!.set('crm.auto_assign', true, { moduleId: this.manifest.id })

    this.logger!.info('CRM 模块安装完成')
  }

  /**
   * 启动钩子 - 启动业务逻辑
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger!.info('CRM 模块启动开始')

    // 启动定时任务
    // 例如: 每日客户统计、线索自动分配等

    // 监听业务事件
    this.registerEventListeners()

    this.logger!.info('CRM 模块启动完成')
  }

  /**
   * 停止钩子 - 停止业务逻辑
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger!.info('CRM 模块停止')

    // 停止定时任务
    // 清理资源
  }

  /**
   * 卸载钩子 - 清理所有数据
   */
  async onUninstall(): Promise<void> {
    this.logger!.info('CRM 模块卸载开始')

    // 清理配置
    await this.config!.deleteModuleConfigs(this.manifest.id)

    await super.onUninstall()

    this.logger!.info('CRM 模块卸载完成')
  }

  /**
   * 健康检查
   */
  async onHealthCheck(): Promise<ModuleHealth> {
    const baseHealth = await super.onHealthCheck()

    // 添加 CRM 特定检查
    const checks = {
      databaseConnection: true, // 检查数据库连接
      cacheAvailable: true, // 检查缓存可用
      externalServices: true, // 检查外部服务
    }

    const allHealthy = Object.values(checks).every((v) => v)

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      details: {
        ...baseHealth.details,
        checks,
        customerCount: 0, // 示例数据
        leadCount: 0,
      },
      timestamp: Date.now(),
    }
  }

  /**
   * 注册事件监听器
   */
  protected registerEventListeners(): void {
    // 监听客户创建事件
    this.eventBus!.on('crm.customer.created', (payload) => {
      this.logger!.info('客户已创建', payload.data)
      // 执行后续操作: 发送欢迎邮件、分配销售等
    })

    // 监听订单完成事件
    this.eventBus!.once('crm.order.completed', (payload) => {
      this.logger!.info('订单已完成', payload.data)
      // 执行后续操作: 更新客户状态、发送通知等
    })

    // 监听通配符事件 - 所有 CRM 事件
    this.eventBus!.on('crm.*', (payload) => {
      this.logger!.debug('CRM 事件', { event: payload.eventName })
    })
  }

  /**
   * 获取路由定义
   */
  getRoutes(): ModuleRoute[] {
    return [
      // 客户管理路由
      {
        path: '/customers',
        method: HttpMethod.GET,
        handler: 'customerController.list',
        permission: 'crm:customer:view',
        description: '获取客户列表',
        queryParams: [
          { name: 'page', type: 'number', default: 1 },
          { name: 'pageSize', type: 'number', default: 20 },
          { name: 'keyword', type: 'string' },
          { name: 'status', type: 'string' },
        ],
      },
      {
        path: '/customers/:id',
        method: HttpMethod.GET,
        handler: 'customerController.getOne',
        permission: 'crm:customer:view',
        description: '获取客户详情',
        pathParams: [{ name: 'id', type: 'uuid', required: true }],
      },
      {
        path: '/customers',
        method: HttpMethod.POST,
        handler: 'customerController.create',
        permission: 'crm:customer:create',
        description: '创建客户',
      },
      {
        path: '/customers/:id',
        method: HttpMethod.PUT,
        handler: 'customerController.update',
        permission: 'crm:customer:edit',
        description: '更新客户',
      },
      {
        path: '/customers/:id',
        method: HttpMethod.DELETE,
        handler: 'customerController.delete',
        permission: 'crm:customer:delete',
        description: '删除客户',
      },

      // 线索管理路由
      {
        path: '/leads',
        method: HttpMethod.GET,
        handler: 'leadController.list',
        permission: 'crm:lead:view',
        description: '获取线索列表',
      },
      {
        path: '/leads/:id/convert',
        method: HttpMethod.POST,
        handler: 'leadController.convert',
        permission: 'crm:lead:convert',
        description: '线索转客户',
      },

      // 商机管理路由
      {
        path: '/opportunities',
        method: HttpMethod.GET,
        handler: 'opportunityController.list',
        permission: 'crm:opportunity:view',
        description: '获取商机列表',
      },

      // 订单管理路由
      {
        path: '/orders',
        method: HttpMethod.GET,
        handler: 'orderController.list',
        permission: 'crm:order:view',
        description: '获取订单列表',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    return [
      // 使用工具生成标准 CRUD 权限
      ...generateCrudPermissions('crm', 'customer', { export: true, import: true }),
      ...generateCrudPermissions('crm', 'lead', { export: true }),
      ...generateCrudPermissions('crm', 'opportunity'),
      ...generateCrudPermissions('crm', 'order', { export: true }),

      // 特殊权限
      {
        id: 'crm:lead:convert',
        name: '线索转客户',
        description: '将线索转换为正式客户',
        type: PermissionType.ACTION,
        moduleId: this.manifest.id,
      },
      {
        id: 'crm:opportunity:close',
        name: '关闭商机',
        description: '关闭商机并记录结果',
        type: PermissionType.ACTION,
        moduleId: this.manifest.id,
      },

      // 数据权限
      {
        id: 'crm:data:self',
        name: '仅本人数据',
        description: '只能查看自己负责的客户/线索',
        type: PermissionType.DATA,
        moduleId: this.manifest.id,
        dataScope: 'self' as any,
      },
      {
        id: 'crm:data:dept',
        name: '本部门数据',
        description: '查看本部门所有客户/线索',
        type: PermissionType.DATA,
        moduleId: this.manifest.id,
        dataScope: 'dept' as any,
      },
      {
        id: 'crm:data:all',
        name: '全部数据',
        description: '查看所有客户/线索数据',
        type: PermissionType.DATA,
        moduleId: this.manifest.id,
        dataScope: 'all' as any,
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
        title: 'CRM',
        icon: 'team',
        order: 100,
        children: [
          {
            id: 'crm-dashboard',
            title: 'CRM 首页',
            path: '/crm/dashboard',
            order: 1,
          },
          {
            id: 'crm-customers',
            title: '客户管理',
            path: '/crm/customers',
            permissions: ['crm:customer:view'],
            order: 2,
          },
          {
            id: 'crm-leads',
            title: '线索管理',
            path: '/crm/leads',
            permissions: ['crm:lead:view'],
            order: 3,
          },
          {
            id: 'crm-opportunities',
            title: '商机管理',
            path: '/crm/opportunities',
            permissions: ['crm:opportunity:view'],
            order: 4,
          },
          {
            id: 'crm-orders',
            title: '订单管理',
            path: '/crm/orders',
            permissions: ['crm:order:view'],
            order: 5,
          },
        ],
      },
    ]
  }
}

/**
 * 导出模块清单和实现
 */
export { CRM_MANIFEST }
export default CrmModuleExample
