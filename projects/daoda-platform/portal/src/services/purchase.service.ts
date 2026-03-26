/**
 * 采购服务
 * 处理采购订单相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

/**
 * 采购状态枚举
 * 对应 Prisma Schema 中的 PurchaseStatus
 */
export type PurchaseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIAL_RECEIVED' | 'COMPLETED'

/**
 * 采购订单项接口
 */
export interface PurchaseOrderItem {
  id: string
  purchaseOrderId: string
  productId: string
  productName: string
  productModel?: string
  quantity: number
  receivedQuantity: number
  unitPrice: number
  totalPrice: number
  createdAt: string
}

/**
 * 采购订单接口
 * 对应 Prisma Schema 中的 PurchaseOrder 模型
 */
export interface PurchaseOrder {
  id: string
  orderNo: string              // 采购单号（唯一）
  supplier: string             // 供应商名称
  supplierContact?: string     // 供应商联系人
  supplierPhone?: string       // 供应商电话
  status: PurchaseStatus       // 订单状态
  totalAmount: number          // 总金额
  paidAmount?: number          // 已付金额
  expectedDate?: string        // 预计到货日期
  actualDate?: string          // 实际到货日期
  remark?: string              // 备注
  items: PurchaseOrderItem[]   // 订单项
  createdAt: string
  updatedAt: string
}

/**
 * 创建采购订单项 DTO
 */
export interface CreatePurchaseOrderItemDto {
  productId: string
  quantity: number
  unitPrice: number
}

/**
 * 创建采购订单 DTO
 */
export interface CreatePurchaseOrderDto {
  supplier: string
  supplierContact?: string
  supplierPhone?: string
  expectedDate?: string
  remark?: string
  items: CreatePurchaseOrderItemDto[]
}

/**
 * 更新采购订单 DTO
 */
export interface UpdatePurchaseOrderDto {
  supplier?: string
  supplierContact?: string
  supplierPhone?: string
  status?: PurchaseStatus
  totalAmount?: number
  expectedDate?: string
  actualDate?: string
  remark?: string
  items?: CreatePurchaseOrderItemDto[]
}

/**
 * 采购订单查询参数
 */
export interface PurchaseOrderQueryParams {
  page?: number
  pageSize?: number
  keyword?: string           // 搜索单号或供应商
  status?: PurchaseStatus    // 状态筛选
  supplier?: string          // 供应商筛选
  startDate?: string         // 开始日期
  endDate?: string           // 结束日期
}

/**
 * 审批采购订单 DTO
 */
export interface ApprovePurchaseOrderDto {
  approved: boolean
  remark?: string
}

// ==================== 采购服务 ====================

export const purchaseService = {
  /**
   * 获取采购订单列表
   */
  getList(params: PurchaseOrderQueryParams): Promise<PaginatedResponse<PurchaseOrder>> {
    return request.get<PaginatedResponse<PurchaseOrder>>('/purchase-orders', { params })
  },

  /**
   * 获取采购订单详情
   */
  getOne(id: string): Promise<PurchaseOrder> {
    return request.get<PurchaseOrder>(`/purchase-orders/${id}`)
  },

  /**
   * 创建采购订单
   */
  create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    return request.post<PurchaseOrder>('/purchase-orders', dto)
  },

  /**
   * 更新采购订单
   */
  update(id: string, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    return request.put<PurchaseOrder>(`/purchase-orders/${id}`, dto)
  },

  /**
   * 删除采购订单
   */
  delete(id: string): Promise<void> {
    return request.delete(`/purchase-orders/${id}`)
  },

  /**
   * 批量删除采购订单
   */
  batchDelete(ids: string[]): Promise<void> {
    return request.delete('/purchase-orders/batch', { data: { ids } })
  },

  /**
   * 审批采购订单
   */
  approve(id: string, dto: ApprovePurchaseOrderDto): Promise<PurchaseOrder> {
    return request.post<PurchaseOrder>(`/purchase-orders/${id}/approve`, dto)
  },

  /**
   * 确认收货
   */
  confirmReceive(id: string, items?: { itemId: string; quantity: number }[]): Promise<PurchaseOrder> {
    return request.post<PurchaseOrder>(`/purchase-orders/${id}/receive`, { items })
  },

  /**
   * 导出采购订单数据
   */
  export(params?: PurchaseOrderQueryParams): Promise<Blob> {
    return request.get('/purchase-orders/export', { 
      params, 
      responseType: 'blob' 
    })
  },
}

export default purchaseService
