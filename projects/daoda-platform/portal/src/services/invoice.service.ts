/**
 * 发票管理服务
 */
import { request, PaginatedResponse } from './api'

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled'

export interface Invoice {
  id: string
  invoiceNo: string
  customerId: string
  customerName: string
  amount: number
  taxAmount: number
  totalAmount: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  paidDate?: string
  type: 'sales' | 'purchase'
  items: InvoiceItem[]
  remark?: string
  createdAt: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate: number
  taxAmount: number
}

export const invoiceService = {
  getList(params: { page?: number; pageSize?: number; status?: InvoiceStatus; customerId?: string; type?: string }): Promise<PaginatedResponse<Invoice>> {
    return request.get('/invoices', { params })
  },

  getOne(id: string): Promise<Invoice> {
    return request.get(`/invoices/${id}`)
  },

  create(data: Partial<Invoice>): Promise<Invoice> {
    return request.post('/invoices', data)
  },

  update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    return request.put(`/invoices/${id}`, data)
  },

  delete(id: string): Promise<void> {
    return request.delete(`/invoices/${id}`)
  },

  issue(id: string): Promise<Invoice> {
    return request.post(`/invoices/${id}/issue`)
  },

  cancel(id: string, reason: string): Promise<Invoice> {
    return request.post(`/invoices/${id}/cancel`, { reason })
  },

  getStats(params: { month?: string }): Promise<{ totalIssued: number; totalPaid: number; totalPending: number }> {
    return request.get('/invoices/stats', { params })
  },
}

export default invoiceService