/**
 * 线索管理热插拔模块
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

export const LEAD_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/lead',
  name: '线索管理',
  version: '1.0.0',
  description: '销售线索管理、线索转化、线索分配',
  category: 'business',
  tags: ['crm', 'lead', 'sales'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/customer', version: '>=1.0.0', optional: true },
  ],
  permissions: [
    'lead:create',
    'lead:view',
    'lead:update',
    'lead:delete',
    'lead:convert',
    'lead:assign',
    'lead:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.ROLLING,
  },
  builtin: false,
  system: false,
}

export class LeadHotplugModule extends BaseModule {
  readonly manifest = LEAD_MODULE_MANIFEST

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context
    await context.config.setModuleConfigs(this.manifest.id, {
      defaultSource: 'website',
      sources: ['官网', '展会', '推荐', '电话', '广告'],
      statuses: ['NEW', 'CONTACTED', 'QUALIFIED', 'UNQUALIFIED', 'CONVERTED'],
      autoAssign: true,
    })
    this.logger?.info('线索管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.logger?.info('线索管理模块已销毁')
  }

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'lead:create',
        name: '创建线索',
        type: PermissionType.ACTION,
        resource: 'lead',
        action: 'create',
      },
      {
        id: 'lead:view',
        name: '查看线索',
        type: PermissionType.ACTION,
        resource: 'lead',
        action: 'view',
      },
      {
        id: 'lead:update',
        name: '更新线索',
        type: PermissionType.ACTION,
        resource: 'lead',
        action: 'update',
      },
      {
        id: 'lead:delete',
        name: '删除线索',
        type: PermissionType.ACTION,
        resource: 'lead',
        action: 'delete',
      },
      {
        id: 'lead:convert',
        name: '转化线索',
        type: PermissionType.ACTION,
        resource: 'lead',
        action: 'convert',
      },
      {
        id: 'lead:assign',
        name: '分配线索',
        type: PermissionType.ACTION,
        resource: 'lead',
        action: 'assign',
      },
      {
        id: 'lead:admin',
        name: '线索管理管理员',
        type: PermissionType.ADMIN,
        resource: 'lead',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'lead',
        title: '线索管理',
        icon: 'UserAddOutlined',
        path: '/crm/leads',
        parentId: 'crm',
        order: 30,
        visible: true,
        permissions: ['lead:view'],
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      {
        path: '/api/v1/leads',
        method: HttpMethod.POST,
        handler: 'create',
        permission: 'lead:create',
      },
      {
        path: '/api/v1/leads',
        method: HttpMethod.GET,
        handler: 'findAll',
        permission: 'lead:view',
      },
      {
        path: '/api/v1/leads/:id',
        method: HttpMethod.GET,
        handler: 'findOne',
        permission: 'lead:view',
      },
      {
        path: '/api/v1/leads/:id',
        method: HttpMethod.PUT,
        handler: 'update',
        permission: 'lead:update',
      },
      {
        path: '/api/v1/leads/:id',
        method: HttpMethod.DELETE,
        handler: 'delete',
        permission: 'lead:delete',
      },
      {
        path: '/api/v1/leads/:id/convert',
        method: HttpMethod.POST,
        handler: 'convert',
        permission: 'lead:convert',
      },
      {
        path: '/api/v1/leads/:id/assign',
        method: HttpMethod.POST,
        handler: 'assign',
        permission: 'lead:assign',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      { name: 'lead.created', type: EventType.BUSINESS_DATA, description: '线索创建事件' },
      { name: 'lead.updated', type: EventType.BUSINESS_DATA, description: '线索更新事件' },
      { name: 'lead.converted', type: EventType.BUSINESS_DATA, description: '线索转化事件' },
      { name: 'lead.assigned', type: EventType.BUSINESS_DATA, description: '线索分配事件' },
    ]
  }
}

export const LEAD_HOTPLUG_MODULE = {
  manifest: LEAD_MODULE_MANIFEST,
  moduleClass: LeadHotplugModule,
}
