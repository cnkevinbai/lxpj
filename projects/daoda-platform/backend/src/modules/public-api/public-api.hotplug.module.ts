/**
 * 公开 API 模块
 * 热插拔扩展模块 - 提供官网数据对接接口
 *
 * 功能范围:
 * - 新闻/案例/视频/产品公开接口
 * - 线索/咨询/合作申请提交
 * - 网站配置获取
 * - 搜索功能
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

export const PUBLIC_API_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/public-api',
  name: '公开 API',
  version: '1.0.0',
  description: '官网数据对接公开接口，提供新闻、案例、产品、线索提交等功能',
  category: 'extension',
  tags: ['public-api', 'website', 'cms', 'api-key'],
  dependencies: [
    { id: '@daoda/api-key', version: '>=1.0.0' },
    { id: '@daoda/cms', version: '>=1.0.0', optional: true },
    { id: '@daoda/crm', version: '>=1.0.0', optional: true },
  ],
  permissions: [
    'public-api:news',
    'public-api:cases',
    'public-api:videos',
    'public-api:products',
    'public-api:solutions',
    'public-api:lead-submit',
    'public-api:inquiry-submit',
    'public-api:partnership-submit',
    'public-api:config',
    'public-api:search',
    'public-api:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
  builtin: false,
  system: false,
}

// ============================================
// 公开 API 模块实现
// ============================================

export class PublicApiHotplugModule extends BaseModule {
  readonly manifest = PUBLIC_API_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    // 配置默认值
    await context.config.setModuleConfigs(this.manifest.id, {
      defaultPageSize: 10, // 默认分页大小
      maxPageSize: 50, // 最大分页大小
      enableSearch: true, // 启用搜索
      searchFields: ['title', 'content', 'name', 'description'], // 搜索字段
      leadAutoCreate: true, // 线索自动创建
      inquiryAutoCreate: true, // 咨询自动创建
      partnershipAutoCreate: true, // 合作申请自动创建
      defaultLeadSource: 'website', // 默认线索来源
      requireApiKey: true, // 要求 API Key 认证
    })

    this.logger?.info('公开 API 模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.logger?.info('公开 API 模块已销毁')
  }

  // ============================================
  // 业务方法 (模拟实现，实际由 NestJS Controller 处理)
  // ============================================

  /**
   * 获取新闻列表
   */
  async getNews(query: any): Promise<any> {
    this.logger?.info('获取公开新闻列表')
    return { list: [], total: 0 }
  }

  /**
   * 获取案例列表
   */
  async getCases(query: any): Promise<any> {
    this.logger?.info('获取公开案例列表')
    return { list: [], total: 0 }
  }

  /**
   * 获取视频列表
   */
  async getVideos(query: any): Promise<any> {
    this.logger?.info('获取公开视频列表')
    return { list: [], total: 0 }
  }

  /**
   * 获取产品列表
   */
  async getProducts(query: any): Promise<any> {
    this.logger?.info('获取公开产品列表')
    return { list: [], total: 0 }
  }

  /**
   * 提交线索
   */
  async submitLead(dto: any): Promise<any> {
    this.logger?.info(`提交线索: ${dto.name}`)
    return null
  }

  /**
   * 提交咨询
   */
  async submitInquiry(dto: any): Promise<any> {
    this.logger?.info(`提交咨询: ${dto.name}`)
    return null
  }

  /**
   * 提交合作申请
   */
  async submitPartnership(dto: any): Promise<any> {
    this.logger?.info(`提交合作申请: ${dto.company}`)
    return null
  }

  /**
   * 搜索
   */
  async search(query: string, type?: string): Promise<any> {
    this.logger?.info(`公开搜索: ${query}`)
    return { results: [] }
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'public-api:news',
        name: '新闻接口',
        description: '访问公开新闻列表/详情接口',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'news',
      },
      {
        id: 'public-api:cases',
        name: '案例接口',
        description: '访问公开案例列表/详情接口',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'cases',
      },
      {
        id: 'public-api:videos',
        name: '视频接口',
        description: '访问公开视频列表/详情接口',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'videos',
      },
      {
        id: 'public-api:products',
        name: '产品接口',
        description: '访问公开产品列表/详情接口',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'products',
      },
      {
        id: 'public-api:solutions',
        name: '解决方案接口',
        description: '访问公开解决方案接口',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'solutions',
      },
      {
        id: 'public-api:lead-submit',
        name: '线索提交',
        description: '提交线索表单',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'lead-submit',
      },
      {
        id: 'public-api:inquiry-submit',
        name: '咨询提交',
        description: '提交咨询表单',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'inquiry-submit',
      },
      {
        id: 'public-api:partnership-submit',
        name: '合作申请',
        description: '提交合作申请表单',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'partnership-submit',
      },
      {
        id: 'public-api:config',
        name: '配置接口',
        description: '获取网站配置',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'config',
      },
      {
        id: 'public-api:search',
        name: '搜索接口',
        description: '使用搜索功能',
        type: PermissionType.ACTION,
        resource: 'public-api',
        action: 'search',
      },
      {
        id: 'public-api:admin',
        name: '公开 API 管理员',
        description: '公开 API 模块管理权限',
        type: PermissionType.ADMIN,
        resource: 'public-api',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    // 公开 API 无菜单项，仅提供 API 接口
    return []
  }

  getRoutes(): ModuleRoute[] {
    return [
      // 新闻接口
      {
        path: '/api/v1/public/news',
        method: HttpMethod.GET,
        handler: 'getNews',
        description: '获取公开新闻列表',
        permission: 'public-api:news',
        public: false, // 需要 API Key
      },
      {
        path: '/api/v1/public/news/:id',
        method: HttpMethod.GET,
        handler: 'getNewsDetail',
        description: '获取公开新闻详情',
        permission: 'public-api:news',
      },
      // 案例接口
      {
        path: '/api/v1/public/cases',
        method: HttpMethod.GET,
        handler: 'getCases',
        description: '获取公开案例列表',
        permission: 'public-api:cases',
      },
      {
        path: '/api/v1/public/cases/:id',
        method: HttpMethod.GET,
        handler: 'getCaseDetail',
        description: '获取公开案例详情',
        permission: 'public-api:cases',
      },
      // 视频接口
      {
        path: '/api/v1/public/videos',
        method: HttpMethod.GET,
        handler: 'getVideos',
        description: '获取公开视频列表',
        permission: 'public-api:videos',
      },
      {
        path: '/api/v1/public/videos/:id',
        method: HttpMethod.GET,
        handler: 'getVideoDetail',
        description: '获取公开视频详情',
        permission: 'public-api:videos',
      },
      // 产品接口
      {
        path: '/api/v1/public/products',
        method: HttpMethod.GET,
        handler: 'getProducts',
        description: '获取公开产品列表',
        permission: 'public-api:products',
      },
      {
        path: '/api/v1/public/products/:id',
        method: HttpMethod.GET,
        handler: 'getProductDetail',
        description: '获取公开产品详情',
        permission: 'public-api:products',
      },
      // 解决方案接口
      {
        path: '/api/v1/public/solutions',
        method: HttpMethod.GET,
        handler: 'getSolutions',
        description: '获取公开解决方案列表',
        permission: 'public-api:solutions',
      },
      {
        path: '/api/v1/public/solutions/:id',
        method: HttpMethod.GET,
        handler: 'getSolutionDetail',
        description: '获取公开解决方案详情',
        permission: 'public-api:solutions',
      },
      // 表单提交
      {
        path: '/api/v1/public/leads',
        method: HttpMethod.POST,
        handler: 'submitLead',
        description: '提交线索',
        permission: 'public-api:lead-submit',
      },
      {
        path: '/api/v1/public/inquiries',
        method: HttpMethod.POST,
        handler: 'submitInquiry',
        description: '提交咨询',
        permission: 'public-api:inquiry-submit',
      },
      {
        path: '/api/v1/public/partnerships',
        method: HttpMethod.POST,
        handler: 'submitPartnership',
        description: '提交合作申请',
        permission: 'public-api:partnership-submit',
      },
      // 配置
      {
        path: '/api/v1/public/config',
        method: HttpMethod.GET,
        handler: 'getConfig',
        description: '获取网站配置',
        permission: 'public-api:config',
      },
      // 搜索
      {
        path: '/api/v1/public/search',
        method: HttpMethod.GET,
        handler: 'search',
        description: '公开搜索',
        permission: 'public-api:search',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'public-api.lead.submitted',
        type: EventType.USER_ACTION,
        description: '线索提交事件',
      },
      {
        name: 'public-api.inquiry.submitted',
        type: EventType.USER_ACTION,
        description: '咨询提交事件',
      },
      {
        name: 'public-api.partnership.submitted',
        type: EventType.USER_ACTION,
        description: '合作申请提交事件',
      },
      {
        name: 'public-api.search.executed',
        type: EventType.USER_ACTION,
        description: '搜索执行事件',
      },
      {
        name: 'public-api.news.viewed',
        type: EventType.USER_ACTION,
        description: '新闻查看事件',
      },
      {
        name: 'public-api.case.viewed',
        type: EventType.USER_ACTION,
        description: '案例查看事件',
      },
      {
        name: 'public-api.product.viewed',
        type: EventType.USER_ACTION,
        description: '产品查看事件',
      },
      {
        name: 'public-api.video.viewed',
        type: EventType.USER_ACTION,
        description: '视频查看事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const PUBLIC_API_HOTPLUG_MODULE = {
  manifest: PUBLIC_API_MODULE_MANIFEST,
  moduleClass: PublicApiHotplugModule,
}
