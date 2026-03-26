/**
 * BOM 物料清单服务
 * 处理产品物料清单相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type BomStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE'

export interface BomItem {
  id: string
  bomId: string
  productId: string
  product?: any
  quantity: number
  unit: string | null
  scrapRate: number | null
  remark: string | null
  createdAt: string
}

export interface Bom {
  id: string
  bomNo: string
  productId: string
  product?: any
  version: string
  status: BomStatus
  remark: string | null
  items?: BomItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateBomDto {
  bomNo: string
  productId: string
  version?: string
  status?: BomStatus
  remark?: string
}

export interface UpdateBomDto {
  bomNo?: string
  productId?: string
  version?: string
  status?: BomStatus
  remark?: string
}

export interface CreateBomItemDto {
  productId: string
  materialId?: string
  quantity: number
  unit?: string
  scrapRate?: number
  remark?: string
}

export interface UpdateBomItemDto {
  quantity?: number
  unit?: string
  scrapRate?: number
  remark?: string
}

export interface BomQueryParams {
  page?: number
  pageSize?: number
  bomNo?: string
  productId?: string
  status?: BomStatus
}

// ==================== BOM 服务 ====================

export const bomService = {
  /**
   * 获取 BOM 列表
   */
  getList(params: BomQueryParams): Promise<PaginatedResponse<Bom>> {
    return request.get<PaginatedResponse<Bom>>('/bom', { params })
  },

  /**
   * 获取 BOM 详情
   */
  getOne(id: string): Promise<Bom> {
    return request.get<Bom>(`/bom/${id}`)
  },

  /**
   * 创建 BOM
   */
  create(dto: CreateBomDto): Promise<Bom> {
    return request.post<Bom>('/bom', dto)
  },

  /**
   * 更新 BOM
   */
  update(id: string, dto: UpdateBomDto): Promise<Bom> {
    return request.patch<Bom>(`/bom/${id}`, dto)
  },

  /**
   * 删除 BOM
   */
  delete(id: string): Promise<void> {
    return request.delete(`/bom/${id}`)
  },

  /**
   * 添加 BOM 物料项
   */
  addItem(bomId: string, dto: CreateBomItemDto): Promise<BomItem> {
    return request.post<BomItem>(`/bom/${bomId}/items`, dto)
  },

  /**
   * 更新 BOM 物料项
   */
  updateItem(itemId: string, dto: UpdateBomItemDto): Promise<BomItem> {
    return request.patch<BomItem>(`/bom/items/${itemId}`, dto)
  },

  /**
   * 删除 BOM 物料项
   */
  removeItem(itemId: string): Promise<void> {
    return request.delete(`/bom/items/${itemId}`)
  },

  /**
   * 激活 BOM
   */
  activate(id: string): Promise<Bom> {
    return request.post<Bom>(`/bom/${id}/activate`)
  },

  /**
   * 停用 BOM
   */
  deactivate(id: string): Promise<Bom> {
    return request.post<Bom>(`/bom/${id}/deactivate`)
  },

  /**
   * 复制 BOM
   */
  copy(id: string, newBomNo: string): Promise<Bom> {
    return request.post<Bom>(`/bom/${id}/copy`, { bomNo: newBomNo })
  },

  /**
   * 获取产品的 BOM 列表
   */
  getByProductId(productId: string): Promise<Bom[]> {
    return request.get<Bom[]>(`/bom/product/${productId}`)
  },

  /**
   * 获取 BOM 统计
   */
  getStatistics(): Promise<{ total: number; active: number; draft: number }> {
    return request.get('/bom/statistics')
  },
}

export default bomService