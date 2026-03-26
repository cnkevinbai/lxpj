/**
 * 报价单服务
 * 处理报价单管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type QuotationStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CONVERTED' 
  | 'EXPIRED'

export interface QuotationItem {
  id: string
  productId: string
  productName: string
  productCode: string
  quantity: number
  unitPrice: number
  discount: number
  amount: number
  remark: string | null
}

export interface Quotation {
  id: string
  quotationNo: string
  opportunityId: string | null
  opportunityName: string | null
  customerId: string
  customerName: string
  customerContact: string | null
  customerPhone: string | null
  status: QuotationStatus
  validUntil: string | null
  totalAmount: number
  items: QuotationItem[]
  remark: string | null
  createdBy: string | null
  createdByName: string | null
  updatedBy: string | null
  updatedByName: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateQuotationDto {
  opportunityId?: string
  customerId: string
  validUntil?: string
  remark?: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
    discount?: number
    remark?: string
  }[]
}

export interface UpdateQuotationDto {
  opportunityId?: string
  customerId?: string
  validUntil?: string
  status?: QuotationStatus
  remark?: string
  items?: {
    productId: string
    quantity: number
    unitPrice: number
    discount?: number
    remark?: string
  }[]
}

export interface QuotationQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: QuotationStatus
  customerId?: string
  opportunityId?: string
}

// 报价单状态映射
export const quotationStatusMap: Record<QuotationStatus, { color: string; text: string }> = {
  DRAFT: { color: 'default', text: '草稿' },
  PENDING: { color: 'orange', text: '待审批' },
  APPROVED: { color: 'green', text: '已审批' },
  REJECTED: { color: 'red', text: '已拒绝' },
  CONVERTED: { color: 'cyan', text: '已转订单' },
  EXPIRED: { color: 'gray', text: '已过期' },
}

// ==================== 报价单服务 ====================

export const quotationService = {
  /**
   * 获取报价单列表
   */
  getList(params: QuotationQueryParams): Promise<PaginatedResponse<Quotation>> {
    return request.get<PaginatedResponse<Quotation>>('/quotations', { params })
  },

  /**
   * 获取报价单详情
   */
  getOne(id: string): Promise<Quotation> {
    return request.get<Quotation>(`/quotations/${id}`)
  },

  /**
   * 创建报价单
   */
  create(dto: CreateQuotationDto): Promise<Quotation> {
    return request.post<Quotation>('/quotations', dto)
  },

  /**
   * 更新报价单
   */
  update(id: string, dto: UpdateQuotationDto): Promise<Quotation> {
    return request.put<Quotation>(`/quotations/${id}`, dto)
  },

  /**
   * 删除报价单
   */
  delete(id: string): Promise<void> {
    return request.delete(`/quotations/${id}`)
  },

  /**
   * 提交审批
   */
  submit(id: string): Promise<Quotation> {
    return request.post(`/quotations/${id}/submit`)
  },

  /**
   * 审批通过
   */
  approve(id: string): Promise<Quotation> {
    return request.post(`/quotations/${id}/approve`)
  },

  /**
   * 审批拒绝
   */
  reject(id: string): Promise<Quotation> {
    return request.post(`/quotations/${id}/reject`)
  },

  /**
   * 转为订单
   */
  convertToOrder(id: string): Promise<any> {
    return request.post(`/quotations/${id}/convert`)
  },
}

export default quotationService
