/**
 * 财务服务
 * 处理发票、应收账款、应付账款相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type InvoiceType = 'SALES' | 'PURCHASE'
export type InvoiceStatus = 'PENDING' | 'ISSUED' | 'RECEIVED' | 'CANCELLED'

export type ReceivableStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'
export type PayableStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'

// 发票
export interface Invoice {
  id: string
  invoiceNo: string
  orderId: string | null
  order?: any
  type: InvoiceType
  amount: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  status: InvoiceStatus
  issueDate: string | null
  dueDate: string | null
  customerId: string | null
  customer?: any
  supplierId: string | null
  supplier?: any
  remark: string | null
  createdAt: string
  updatedAt: string
}

// 应收账款
export interface Receivable {
  id: string
  customerId: string
  customer: any
  orderId: string | null
  order?: any
  invoiceId: string | null
  invoice?: Invoice
  amount: number
  paidAmount: number
  remainingAmount: number
  status: ReceivableStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

// 应付账款
export interface Payable {
  id: string
  supplierId: string
  supplier: any
  orderId: string | null
  order?: any
  invoiceId: string | null
  invoice?: Invoice
  amount: number
  paidAmount: number
  remainingAmount: number
  status: PayableStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

// 财务统计
export interface FinanceStats {
  totalRevenue: number
  totalReceivable: number
  totalPayable: number
  paidReceivable: number
  paidPayable: number
  overdueReceivable: number
  overduePayable: number
  pendingInvoice: number
  monthRevenue: number
  monthExpense: number
  monthProfit: number
}

// 趋势数据
export interface TrendData {
  date: string
  revenue: number
  expense: number
  profit: number
}

// DTOs
export interface CreateInvoiceDto {
  invoiceNo: string
  orderId?: string
  type: InvoiceType
  amount: number
  taxRate?: number
  customerId?: string
  supplierId?: string
  issueDate?: string
  dueDate?: string
  remark?: string
}

export interface UpdateInvoiceDto {
  invoiceNo?: string
  type?: InvoiceType
  amount?: number
  taxRate?: number
  status?: InvoiceStatus
  issueDate?: string
  dueDate?: string
  remark?: string
}

export interface CreateReceivableDto {
  customerId: string
  orderId?: string
  invoiceId?: string
  amount: number
  dueDate: string
}

export interface UpdateReceivableDto {
  amount?: number
  paidAmount?: number
  status?: ReceivableStatus
  dueDate?: string
}

export interface CreatePayableDto {
  supplierId: string
  orderId?: string
  invoiceId?: string
  amount: number
  dueDate: string
}

export interface UpdatePayableDto {
  amount?: number
  paidAmount?: number
  status?: PayableStatus
  dueDate?: string
}

// 查询参数
export interface InvoiceQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: InvoiceType
  status?: InvoiceStatus
  startDate?: string
  endDate?: string
}

export interface ReceivableQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  customerId?: string
  status?: ReceivableStatus
  startDate?: string
  endDate?: string
}

export interface PayableQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  supplierId?: string
  status?: PayableStatus
  startDate?: string
  endDate?: string
}

// ==================== 发票服务 ====================

export const invoiceService = {
  /**
   * 获取发票列表
   */
  getList(params: InvoiceQueryParams): Promise<PaginatedResponse<Invoice>> {
    return request.get<PaginatedResponse<Invoice>>('/invoices', { params })
  },

  /**
   * 获取发票详情
   */
  getOne(id: string): Promise<Invoice> {
    return request.get<Invoice>(`/invoices/${id}`)
  },

  /**
   * 创建发票
   */
  create(dto: CreateInvoiceDto): Promise<Invoice> {
    return request.post<Invoice>('/invoices', dto)
  },

  /**
   * 更新发票
   */
  update(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    return request.put<Invoice>(`/invoices/${id}`, dto)
  },

  /**
   * 删除发票
   */
  delete(id: string): Promise<void> {
    return request.delete(`/invoices/${id}`)
  },

  /**
   * 更新发票状态
   */
  updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    return request.patch<Invoice>(`/invoices/${id}/status`, { status })
  },
}

// ==================== 应收账款服务 ====================

export const receivableService = {
  /**
   * 获取应收账款列表
   */
  getList(params: ReceivableQueryParams): Promise<PaginatedResponse<Receivable>> {
    return request.get<PaginatedResponse<Receivable>>('/receivables', { params })
  },

  /**
   * 获取应收账款详情
   */
  getOne(id: string): Promise<Receivable> {
    return request.get<Receivable>(`/receivables/${id}`)
  },

  /**
   * 创建应收账款
   */
  create(dto: CreateReceivableDto): Promise<Receivable> {
    return request.post<Receivable>('/receivables', dto)
  },

  /**
   * 更新应收账款
   */
  update(id: string, dto: UpdateReceivableDto): Promise<Receivable> {
    return request.put<Receivable>(`/receivables/${id}`, dto)
  },

  /**
   * 删除应收账款
   */
  delete(id: string): Promise<void> {
    return request.delete(`/receivables/${id}`)
  },

  /**
   * 收款
   */
  payment(id: string, amount: number, remark?: string): Promise<Receivable> {
    return request.post<Receivable>(`/receivables/${id}/payment`, { amount, remark })
  },

  /**
   * 更新状态
   */
  updateStatus(id: string, status: ReceivableStatus): Promise<Receivable> {
    return request.patch<Receivable>(`/receivables/${id}/status`, { status })
  },
}

// ==================== 应付账款服务 ====================

export const payableService = {
  /**
   * 获取应付账款列表
   */
  getList(params: PayableQueryParams): Promise<PaginatedResponse<Payable>> {
    return request.get<PaginatedResponse<Payable>>('/payables', { params })
  },

  /**
   * 获取应付账款详情
   */
  getOne(id: string): Promise<Payable> {
    return request.get<Payable>(`/payables/${id}`)
  },

  /**
   * 创建应付账款
   */
  create(dto: CreatePayableDto): Promise<Payable> {
    return request.post<Payable>('/payables', dto)
  },

  /**
   * 更新应付账款
   */
  update(id: string, dto: UpdatePayableDto): Promise<Payable> {
    return request.put<Payable>(`/payables/${id}`, dto)
  },

  /**
   * 删除应付账款
   */
  delete(id: string): Promise<void> {
    return request.delete(`/payables/${id}`)
  },

  /**
   * 付款
   */
  payment(id: string, amount: number, remark?: string): Promise<Payable> {
    return request.post<Payable>(`/payables/${id}/payment`, { amount, remark })
  },

  /**
   * 更新状态
   */
  updateStatus(id: string, status: PayableStatus): Promise<Payable> {
    return request.patch<Payable>(`/payables/${id}/status`, { status })
  },
}

// ==================== 财务统计服务 ====================

export const financeStatsService = {
  /**
   * 获取财务统计
   */
  getStats(): Promise<FinanceStats> {
    return request.get<FinanceStats>('/finance/stats')
  },

  /**
   * 获取收支趋势
   */
  getTrend(startDate?: string, endDate?: string): Promise<TrendData[]> {
    return request.get<TrendData[]>('/finance/trend', { params: { startDate, endDate } })
  },

  /**
   * 获取应收账龄分析
   */
  getReceivableAging(): Promise<any> {
    return request.get('/finance/receivable-aging')
  },

  /**
   * 获取应付账龄分析
   */
  getPayableAging(): Promise<any> {
    return request.get('/finance/payable-aging')
  },
}

export default {
  invoice: invoiceService,
  receivable: receivableService,
  payable: payableService,
  stats: financeStatsService,
}
