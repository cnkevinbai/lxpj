/**
 * Product 产品管理模块
 * 热插拔核心模块 - 提供产品的 CRUD、分类管理和价格管理
 *
 * 功能范围:
 * - 产品信息 CRUD
 * - 产品分类和系列管理
 * - 产品价格管理
 * - 产品状态管理 (活跃、停售、淘汰)
 * - 库存关联
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

// ============================================
// 模块清单定义
// ============================================

export const PRODUCT_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/product',
  name: '产品管理',
  version: '1.0.0',
  description: '产品管理模块，提供产品信息管理、分类和价格管理',
  category: 'business' as const,
  tags: ['product', 'inventory', 'catalog'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
  ],
  permissions: [
    'product:view',
    'product:create',
    'product:edit',
    'product:delete',
    'product:price',
    'product:category',
    'product:series',
    'product:import',
    'product:export',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
  builtin: true,
  system: false,
}

// ============================================
// Product 模块实现
// ============================================

export class ProductHotplugModule extends BaseModule {
  readonly manifest = PRODUCT_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // 产品数据存储 (模拟 - 实际由 ProductService + Prisma 实现)
  private products: Map<string, any> = new Map()

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    await context.config.setModuleConfigs({
      productCodePrefix: 'PROD',
      requireBarcode: true,
      allowNegativeStock: false,
      priceDecimalPlaces: 2,
    })

    this.logger?.info('产品管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.products.clear()
    this.logger?.info('产品管理模块已销毁')
  }

  // ============================================
  // 业务方法 (模拟实现，实际由 ProductService 处理)
  // ============================================

  /**
   * 生成产品编码
   */
  async generateProductCode(): Promise<string> {
    this.logger?.info('生成产品编码')
    return 'PROD-2026-0001'
  }

  /**
   * 创建产品
   */
  async createProduct(data: any): Promise<any> {
    this.logger?.info('创建产品', data)
    return null
  }

  /**
   * 获取产品列表
   */
  async getProducts(query: any): Promise<any> {
    this.logger?.info('获取产品列表', query)
    return { list: [], total: 0 }
  }

  /**
   * 更新产品
   */
  async updateProduct(id: string, data: any): Promise<any> {
    this.logger?.info('更新产品', { id, data })
    return null
  }

  /**
   * 删除产品
   */
  async deleteProduct(id: string): Promise<void> {
    this.logger?.info('删除产品', { id })
  }

  /**
   * 更新产品价格
   */
  async updatePrice(id: string, price: number): Promise<any> {
    this.logger?.info('更新产品价格', { id, price })
    return null
  }

  /**
   * 批量更新价格
   */
  async batchUpdatePrice(ids: string[], price: number): Promise<number> {
    this.logger?.info('批量更新价格', { ids, price })
    return ids.length
  }

  /**
   * 批量调整价格
   */
  async batchAdjustPrice(ids: string[], percentage: number): Promise<number> {
    this.logger?.info('批量调整价格', { ids, percentage })
    return ids.length
  }

  /**
   * 获取产品分类统计
   */
  async getCategoryStats(): Promise<any> {
    this.logger?.info('获取产品分类统计')
    return []
  }

  /**
   * 获取产品系列统计
   */
  async getSeriesStats(): Promise<any> {
    this.logger?.info('获取产品系列统计')
    return []
  }

  /**
   * 获取产品分类列表
   */
  async getCategories(): Promise<any> {
    this.logger?.info('获取产品分类列表')
    return []
  }

  /**
   * 获取产品系列列表
   */
  async getSeries(): Promise<any> {
    this.logger?.info('获取产品系列列表')
    return []
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'product:view',
        name: '查看产品',
        description: '查看产品列表和详情',
        type: PermissionType.RESOURCE,
        resource: 'product',
        action: 'view',
      },
      {
        id: 'product:create',
        name: '创建产品',
        description: '创建新产品',
        type: PermissionType.RESOURCE,
        resource: 'product',
        action: 'create',
      },
      {
        id: 'product:edit',
        name: '编辑产品',
        description: '编辑产品信息',
        type: PermissionType.RESOURCE,
        resource: 'product',
        action: 'edit',
      },
      {
        id: 'product:delete',
        name: '删除产品',
        description: '删除产品',
        type: PermissionType.RESOURCE,
        resource: 'product',
        action: 'delete',
      },
      {
        id: 'product:price',
        name: '更新产品价格',
        description: '更新产品价格',
        type: PermissionType.ACTION,
        resource: 'product',
        action: 'price',
      },
      {
        id: 'product:category',
        name: '产品分类统计',
        description: '查看产品分类统计',
        type: PermissionType.ACTION,
        resource: 'product',
        action: 'category',
      },
      {
        id: 'product:series',
        name: '产品系列统计',
        description: '查看产品系列统计',
        type: PermissionType.ACTION,
        resource: 'product',
        action: 'series',
      },
      {
        id: 'product:import',
        name: '导入产品',
        description: '批量导入产品数据',
        type: PermissionType.ACTION,
        resource: 'product',
        action: 'import',
      },
      {
        id: 'product:export',
        name: '导出产品',
        description: '导出产品数据',
        type: PermissionType.ACTION,
        resource: 'product',
        action: 'export',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'product-list',
        title: '产品管理',
        icon: 'package',
        path: '/products',
        order: 10,
        permissions: ['product:view'],
      },
      {
        id: 'product-stats',
        title: '产品统计',
        icon: 'bar-chart',
        path: '/products/stats',
        order: 11,
        permissions: ['product:category', 'product:series'],
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      // 产品列表
      {
        path: '/products',
        method: HttpMethod.GET,
        handler: 'getProducts',
        description: '获取产品列表',
        permission: 'product:view',
        queryParams: [
          { name: 'page', type: 'number' as any, required: false, default: 1 },
          { name: 'pageSize', type: 'number' as any, required: false, default: 20 },
          { name: 'keyword', type: 'string' as any, required: false },
          { name: 'category', type: 'string' as any, required: false },
          { name: 'series', type: 'string' as any, required: false },
          { name: 'status', type: 'string' as any, required: false },
          { name: 'minPrice', type: 'number' as any, required: false },
          { name: 'maxPrice', type: 'number' as any, required: false },
        ],
      },
      // 创建产品
      {
        path: '/products',
        method: HttpMethod.POST,
        handler: 'createProduct',
        description: '创建产品',
        permission: 'product:create',
      },
      // 获取产品详情
      {
        path: '/products/:id',
        method: HttpMethod.GET,
        handler: 'getProductById',
        description: '获取产品详情',
        permission: 'product:view',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '产品ID' }],
      },
      // 更新产品
      {
        path: '/products/:id',
        method: HttpMethod.PUT,
        handler: 'updateProduct',
        description: '更新产品',
        permission: 'product:edit',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '产品ID' }],
      },
      // 更新产品价格
      {
        path: '/products/:id/price',
        method: HttpMethod.PUT,
        handler: 'updatePrice',
        description: '更新产品价格',
        permission: 'product:price',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '产品ID' }],
      },
      // 批量更新价格
      {
        path: '/products/batch/price',
        method: HttpMethod.POST,
        handler: 'batchUpdatePrice',
        description: '批量更新价格',
        permission: 'product:price',
      },
      // 批量调整价格
      {
        path: '/products/batch/adjust-price',
        method: HttpMethod.POST,
        handler: 'batchAdjustPrice',
        description: '批量调整价格',
        permission: 'product:price',
      },
      // 删除产品
      {
        path: '/products/:id',
        method: HttpMethod.DELETE,
        handler: 'deleteProduct',
        description: '删除产品',
        permission: 'product:delete',
        pathParams: [{ name: 'id', type: 'uuid' as any, required: true, description: '产品ID' }],
      },
      // 产品分类统计
      {
        path: '/products/stats/categories',
        method: HttpMethod.GET,
        handler: 'getCategoryStats',
        description: '获取产品分类统计',
        permission: 'product:category',
      },
      // 产品系列统计
      {
        path: '/products/stats/series',
        method: HttpMethod.GET,
        handler: 'getSeriesStats',
        description: '获取产品系列统计',
        permission: 'product:series',
      },
      // 获取分类列表
      {
        path: '/products/categories',
        method: HttpMethod.GET,
        handler: 'getCategories',
        description: '获取产品分类列表',
        permission: 'product:category',
      },
      // 获取系列列表
      {
        path: '/products/series',
        method: HttpMethod.GET,
        handler: 'getSeries',
        description: '获取产品系列列表',
        permission: 'product:series',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'product.created',
        type: EventType.BUSINESS_DATA,
        description: '产品创建事件',
        payloadSchema: {
          productId: { type: 'string' as any, required: true },
          code: { type: 'string' as any, required: true },
          name: { type: 'string' as any, required: true },
          category: { type: 'string' as any, required: false },
        },
      },
      {
        name: 'product.updated',
        type: EventType.BUSINESS_DATA,
        description: '产品更新事件',
        payloadSchema: {
          productId: { type: 'string' as any, required: true },
          changes: { type: 'object' as any, required: true },
        },
      },
      {
        name: 'product.price.changed',
        type: EventType.BUSINESS_DATA,
        description: '产品价格变更事件',
        payloadSchema: {
          productId: { type: 'string' as any, required: true },
          oldPrice: { type: 'number' as any, required: true },
          newPrice: { type: 'number' as any, required: true },
        },
      },
      {
        name: 'product.deleted',
        type: EventType.BUSINESS_DATA,
        description: '产品删除事件',
        payloadSchema: {
          productId: { type: 'string' as any, required: true },
          code: { type: 'string' as any, required: true },
          name: { type: 'string' as any, required: true },
        },
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const PRODUCT_HOTPLUG_MODULE = {
  manifest: PRODUCT_MODULE_MANIFEST,
  moduleClass: ProductHotplugModule,
}
