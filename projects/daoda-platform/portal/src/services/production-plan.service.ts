/**
 * 生产计划服务
 * 处理生产计划相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type PlanStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface ProductionPlanItem {
  id: string
  planId: string
  productId: string
  product?: any
  quantity: number
  remark: string | null
  createdAt: string
}

export interface ProductionPlan {
  id: string
  planNo: string
  productId: string
  product?: any
  quantity: number
  status: PlanStatus
  startDate: string
  endDate: string
  remark: string | null
  items?: ProductionPlanItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateProductionPlanDto {
  planNo: string
  productId: string
  quantity: number
  status?: PlanStatus
  startDate: string
  endDate: string
  remark?: string
}

export interface UpdateProductionPlanDto {
  planNo?: string
  productId?: string
  quantity?: number
  status?: PlanStatus
  startDate?: string
  endDate?: string
  remark?: string
}

export interface CreatePlanItemDto {
  productId: string
  quantity: number
  remark?: string
}

export interface UpdatePlanItemDto {
  quantity?: number
  remark?: string
}

export interface PlanQueryParams {
  page?: number
  pageSize?: number
  planNo?: string
  status?: PlanStatus
  startDateStart?: string
  startDateEnd?: string
}

// ==================== 生产计划服务 ====================

export const productionPlanService = {
  /**
   * 获取生产计划列表
   */
  getList(params: PlanQueryParams): Promise<PaginatedResponse<ProductionPlan>> {
    return request.get<PaginatedResponse<ProductionPlan>>('/production-plans', { params })
  },

  /**
   * 获取生产计划详情
   */
  getOne(id: string): Promise<ProductionPlan> {
    return request.get<ProductionPlan>(`/production-plans/${id}`)
  },

  /**
   * 创建生产计划
   */
  create(dto: CreateProductionPlanDto): Promise<ProductionPlan> {
    return request.post<ProductionPlan>('/production-plans', dto)
  },

  /**
   * 更新生产计划
   */
  update(id: string, dto: UpdateProductionPlanDto): Promise<ProductionPlan> {
    return request.patch<ProductionPlan>(`/production-plans/${id}`, dto)
  },

  /**
   * 删除生产计划
   */
  delete(id: string): Promise<void> {
    return request.delete(`/production-plans/${id}`)
  },

  /**
   * 添加计划项
   */
  addItem(planId: string, dto: CreatePlanItemDto): Promise<ProductionPlanItem> {
    return request.post<ProductionPlanItem>(`/production-plans/${planId}/items`, dto)
  },

  /**
   * 更新计划项
   */
  updateItem(itemId: string, dto: UpdatePlanItemDto): Promise<ProductionPlanItem> {
    return request.patch<ProductionPlanItem>(`/production-plans/items/${itemId}`, dto)
  },

  /**
   * 删除计划项
   */
  removeItem(itemId: string): Promise<void> {
    return request.delete(`/production-plans/items/${itemId}`)
  },

  /**
   * 审批计划
   */
  approve(id: string): Promise<ProductionPlan> {
    return request.post<ProductionPlan>(`/production-plans/${id}/approve`)
  },

  /**
   * 开始执行计划
   */
  start(id: string): Promise<ProductionPlan> {
    return request.post<ProductionPlan>(`/production-plans/${id}/start`)
  },

  /**
   * 完成计划
   */
  complete(id: string): Promise<ProductionPlan> {
    return request.post<ProductionPlan>(`/production-plans/${id}/complete`)
  },

  /**
   * 取消计划
   */
  cancel(id: string): Promise<ProductionPlan> {
    return request.post<ProductionPlan>(`/production-plans/${id}/cancel`)
  },

  /**
   * 生成生产工单
   */
  generateOrders(id: string): Promise<{ message: string; count: number }> {
    return request.post(`/production-plans/${id}/generate-orders`)
  },

  /**
   * 获取按状态统计
   */
  getCountByStatus(): Promise<{ status: string; count: number }[]> {
    return request.get('/production-plans/statistics/by-status')
  },
}

export default productionPlanService