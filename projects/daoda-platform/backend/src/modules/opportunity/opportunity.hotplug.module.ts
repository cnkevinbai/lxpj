/**
 * 商机管理热插拔模块
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

export const OPPORTUNITY_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/opportunity',
  name: '商机管理',
  version: '1.0.0',
  description: '商机管理、销售漏斗、商机转化统计',
  category: 'business',
  tags: ['crm', 'opportunity', 'sales', 'funnel'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/customer', version: '>=1.0.0' },
  ],
  permissions: [
    'opportunity:create',
    'opportunity:view',
    'opportunity:update',
    'opportunity:delete',
    'opportunity:win',
    'opportunity:lose',
    'opportunity:assign',
    'opportunity:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.ROLLING,
  },
  builtin: false,
  system: false,
}

export class OpportunityHotplugModule extends BaseModule {
  readonly manifest = OPPORTUNITY_MODULE_MANIFEST

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context
    await context.config.setModuleConfigs(this.manifest.id, {
      stages: ['LEAD', 'CONTACTED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'],
      stageProbabilities: {
        LEAD: 10,
        CONTACTED: 20,
        PROPOSAL: 40,
        NEGOTIATION: 60,
        WON: 100,
        LOST: 0,
      },
      defaultStage: 'LEAD',
    })
    this.logger?.info('商机管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.logger?.info('商机管理模块已销毁')
  }

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'opportunity:create',
        name: '创建商机',
        type: PermissionType.ACTION,
        resource: 'opportunity',
        action: 'create',
      },
      {
        id: 'opportunity:view',
        name: '查看商机',
        type: PermissionType.ACTION,
        resource: 'opportunity',
        action: 'view',
      },
      {
        id: 'opportunity:update',
        name: '更新商机',
        type: PermissionType.ACTION,
        resource: 'opportunity',
        action: 'update',
      },
      {
        id: 'opportunity:delete',
        name: '删除商机',
        type: PermissionType.ACTION,
        resource: 'opportunity',
        action: 'delete',
      },
      {
        id: 'opportunity:win',
        name: '商机赢单',
        type: PermissionType.ACTION,
        resource: 'opportunity',
        action: 'win',
      },
      {
        id: 'opportunity:lose',
        name: '商机输单',
        type: PermissionType.ACTION,
        resource: 'opportunity',
        action: 'lose',
      },
      {
        id: 'opportunity:assign',
        name: '分配商机',
        type: PermissionType.ACTION,
        resource: 'opportunity',
        action: 'assign',
      },
      {
        id: 'opportunity:admin',
        name: '商机管理管理员',
        type: PermissionType.ADMIN,
        resource: 'opportunity',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'opportunity',
        title: '商机管理',
        icon: 'RiseOutlined',
        path: '/crm/opportunities',
        parentId: 'crm',
        order: 40,
        visible: true,
        permissions: ['opportunity:view'],
      },
      {
        id: 'opportunity-funnel',
        title: '销售漏斗',
        icon: 'FilterOutlined',
        path: '/crm/funnel',
        parentId: 'crm',
        order: 45,
        visible: true,
        permissions: ['opportunity:view'],
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      {
        path: '/api/v1/opportunities',
        method: HttpMethod.POST,
        handler: 'create',
        permission: 'opportunity:create',
      },
      {
        path: '/api/v1/opportunities',
        method: HttpMethod.GET,
        handler: 'findAll',
        permission: 'opportunity:view',
      },
      {
        path: '/api/v1/opportunities/:id',
        method: HttpMethod.GET,
        handler: 'findOne',
        permission: 'opportunity:view',
      },
      {
        path: '/api/v1/opportunities/:id',
        method: HttpMethod.PUT,
        handler: 'update',
        permission: 'opportunity:update',
      },
      {
        path: '/api/v1/opportunities/:id',
        method: HttpMethod.DELETE,
        handler: 'delete',
        permission: 'opportunity:delete',
      },
      {
        path: '/api/v1/opportunities/:id/win',
        method: HttpMethod.POST,
        handler: 'win',
        permission: 'opportunity:win',
      },
      {
        path: '/api/v1/opportunities/:id/lose',
        method: HttpMethod.POST,
        handler: 'lose',
        permission: 'opportunity:lose',
      },
      {
        path: '/api/v1/opportunities/:id/assign',
        method: HttpMethod.POST,
        handler: 'assign',
        permission: 'opportunity:assign',
      },
      {
        path: '/api/v1/opportunities/stats',
        method: HttpMethod.GET,
        handler: 'getStats',
        permission: 'opportunity:view',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      { name: 'opportunity.created', type: EventType.BUSINESS_DATA, description: '商机创建事件' },
      { name: 'opportunity.updated', type: EventType.BUSINESS_DATA, description: '商机更新事件' },
      {
        name: 'opportunity.stage-changed',
        type: EventType.BUSINESS_DATA,
        description: '商机阶段变更事件',
      },
      { name: 'opportunity.won', type: EventType.BUSINESS_DATA, description: '商机赢单事件' },
      { name: 'opportunity.lost', type: EventType.BUSINESS_DATA, description: '商机输单事件' },
    ]
  }
}

export const OPPORTUNITY_HOTPLUG_MODULE = {
  manifest: OPPORTUNITY_MODULE_MANIFEST,
  moduleClass: OpportunityHotplugModule,
}
