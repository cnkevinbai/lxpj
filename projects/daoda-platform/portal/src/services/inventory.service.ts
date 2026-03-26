/**
 * 库存服务
 * 处理库存管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

/**
 * 库存记录接口
 * 对应 Prisma Schema 中的 Inventory 模型
 */
export interface Inventory {
  id: string
  productId: string
  productName: string          // 关联产品名称（从后端返回）
  productModel?: string        // 产品型号
  quantity: number             // 库存数量
  warehouse: string            // 仓库名称
  location?: string            // 库位
  minStock?: number            // 最低库存预警值
  maxStock?: number            // 最高库存值
  updatedAt: string
  createdAt?: string
}

/**
 * 创建库存 DTO
 */
export interface CreateInventoryDto {
  productId: string
  quantity: number
  warehouse: string
  location?: string
  minStock?: number
  maxStock?: number
}

/**
 * 更新库存 DTO
 */
export interface UpdateInventoryDto {
  quantity?: number
  warehouse?: string
  location?: string
  minStock?: number
  maxStock?: number
}

/**
 * 库存查询参数
 */
export interface InventoryQueryParams {
  page?: number
  pageSize?: number
  keyword?: string           // 搜索产品名称
  warehouse?: string         // 仓库筛选
  status?: 'normal' | 'warning' | 'shortage'  // 库存状态
}

/**
 * 库存调整记录
 */
export interface InventoryAdjustment {
  id: string
  inventoryId: string
  type: 'IN' | 'OUT' | 'ADJUST'  // 入库/出库/调整
  quantity: number
  reason: string
  operatorId: string
  operatorName: string
  createdAt: string
}

/**
 * 创建调整记录 DTO
 */
export interface CreateAdjustmentDto {
  type: 'IN' | 'OUT' | 'ADJUST'
  quantity: number
  reason: string
}

// ==================== 库存服务 ====================

export const inventoryService = {
  /**
   * 获取库存列表
   */
  getList(params: InventoryQueryParams): Promise<PaginatedResponse<Inventory>> {
    return request.get<PaginatedResponse<Inventory>>('/inventory', { params })
  },

  /**
   * 获取库存详情
   */
  getOne(id: string): Promise<Inventory> {
    return request.get<Inventory>(`/inventory/${id}`)
  },

  /**
   * 创建库存记录
   */
  create(dto: CreateInventoryDto): Promise<Inventory> {
    return request.post<Inventory>('/inventory', dto)
  },

  /**
   * 更新库存记录
   */
  update(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
    return request.put<Inventory>(`/inventory/${id}`, dto)
  },

  /**
   * 删除库存记录
   */
  delete(id: string): Promise<void> {
    return request.delete(`/inventory/${id}`)
  },

  /**
   * 批量删除库存记录
   */
  batchDelete(ids: string[]): Promise<void> {
    return request.delete('/inventory/batch', { data: { ids } })
  },

  /**
   * 获取库存调整记录
   */
  getAdjustments(inventoryId: string): Promise<InventoryAdjustment[]> {
    return request.get<InventoryAdjustment[]>(`/inventory/${inventoryId}/adjustments`)
  },

  /**
   * 添加库存调整记录
   */
  addAdjustment(inventoryId: string, dto: CreateAdjustmentDto): Promise<InventoryAdjustment> {
    return request.post<InventoryAdjustment>(`/inventory/${inventoryId}/adjustments`, dto)
  },

  /**
   * 导出库存数据
   */
  export(params?: InventoryQueryParams): Promise<Blob> {
    return request.get('/inventory/export', { 
      params, 
      responseType: 'blob' 
    })
  },
}

export default inventoryService
