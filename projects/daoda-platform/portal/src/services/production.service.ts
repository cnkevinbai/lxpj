/**
 * 生产服务
 * 处理生产工单相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

/**
 * 生产状态枚举
 * 对应 Prisma Schema 中的 ProductionStatus
 */
export type ProductionStatus = 'PENDING' | 'PLANNED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

/**
 * 生产工单接口
 * 对应 Prisma Schema 中的 ProductionOrder 模型
 */
export interface ProductionOrder {
  id: string
  orderNo: string              // 工单号（唯一）
  productId: string
  productName: string          // 关联产品名称
  productModel?: string        // 产品型号
  quantity: number             // 生产数量
  completedQuantity: number    // 已完成数量
  status: ProductionStatus     // 工单状态
  startDate?: string           // 计划开始日期
  endDate?: string             // 计划结束日期
  actualStartDate?: string     // 实际开始日期
  actualEndDate?: string       // 实际结束日期
  progress: number             // 进度百分比 (0-100)
  remark?: string              // 备注
  createdAt: string
  updatedAt: string
}

/**
 * 创建生产工单 DTO
 */
export interface CreateProductionOrderDto {
  productId: string
  quantity: number
  startDate?: string
  endDate?: string
  remark?: string
}

/**
 * 更新生产工单 DTO
 */
export interface UpdateProductionOrderDto {
  quantity?: number
  status?: ProductionStatus
  startDate?: string
  endDate?: string
  actualStartDate?: string
  actualEndDate?: string
  progress?: number
  remark?: string
}

/**
 * 生产工单查询参数
 */
export interface ProductionOrderQueryParams {
  page?: number
  pageSize?: number
  keyword?: string           // 搜索工单号或产品名称
  status?: ProductionStatus  // 状态筛选
  productId?: string         // 产品筛选
  startDate?: string         // 开始日期
  endDate?: string           // 结束日期
}

/**
 * 生产工单工序记录
 */
export interface ProductionProcess {
  id: string
  productionOrderId: string
  processName: string        // 工序名称
  sequence: number           // 工序顺序
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  operatorId?: string
  operatorName?: string
  startedAt?: string
  completedAt?: string
  remark?: string
  createdAt: string
}

/**
 * 创建工序记录 DTO
 */
export interface CreateProcessDto {
  processName: string
  sequence: number
}

// ==================== 生产服务 ====================

export const productionService = {
  /**
   * 获取生产工单列表
   */
  getList(params: ProductionOrderQueryParams): Promise<PaginatedResponse<ProductionOrder>> {
    return request.get<PaginatedResponse<ProductionOrder>>('/production-orders', { params })
  },

  /**
   * 获取生产工单详情
   */
  getOne(id: string): Promise<ProductionOrder> {
    return request.get<ProductionOrder>(`/production-orders/${id}`)
  },

  /**
   * 创建生产工单
   */
  create(dto: CreateProductionOrderDto): Promise<ProductionOrder> {
    return request.post<ProductionOrder>('/production-orders', dto)
  },

  /**
   * 更新生产工单
   */
  update(id: string, dto: UpdateProductionOrderDto): Promise<ProductionOrder> {
    return request.put<ProductionOrder>(`/production-orders/${id}`, dto)
  },

  /**
   * 删除生产工单
   */
  delete(id: string): Promise<void> {
    return request.delete(`/production-orders/${id}`)
  },

  /**
   * 批量删除生产工单
   */
  batchDelete(ids: string[]): Promise<void> {
    return request.delete('/production-orders/batch', { data: { ids } })
  },

  /**
   * 开始生产
   */
  startProduction(id: string): Promise<ProductionOrder> {
    return request.post<ProductionOrder>(`/production-orders/${id}/start`)
  },

  /**
   * 暂停生产
   */
  pauseProduction(id: string): Promise<ProductionOrder> {
    return request.post<ProductionOrder>(`/production-orders/${id}/pause`)
  },

  /**
   * 完成生产
   */
  completeProduction(id: string, completedQuantity?: number): Promise<ProductionOrder> {
    return request.post<ProductionOrder>(`/production-orders/${id}/complete`, { completedQuantity })
  },

  /**
   * 更新进度
   */
  updateProgress(id: string, progress: number): Promise<ProductionOrder> {
    return request.post<ProductionOrder>(`/production-orders/${id}/progress`, { progress })
  },

  /**
   * 获取工序记录
   */
  getProcesses(productionOrderId: string): Promise<ProductionProcess[]> {
    return request.get<ProductionProcess[]>(`/production-orders/${productionOrderId}/processes`)
  },

  /**
   * 添加工序记录
   */
  addProcess(productionOrderId: string, dto: CreateProcessDto): Promise<ProductionProcess> {
    return request.post<ProductionProcess>(`/production-orders/${productionOrderId}/processes`, dto)
  },

  /**
   * 导出生产工单数据
   */
  export(params?: ProductionOrderQueryParams): Promise<Blob> {
    return request.get('/production-orders/export', { 
      params, 
      responseType: 'blob' 
    })
  },
}

export default productionService
