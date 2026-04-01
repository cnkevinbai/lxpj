/**
 * 应付账款服务
 */
import { request, PaginatedResponse } from './api'

export type PayableStatus = 'pending' | 'partial' | 'paid' | 'overdue'

export interface Payable {
  id: string
  invoiceId: string
  invoiceNo: string
  supplierId: string
  supplierName: string
  amount: number
  paidAmount: number
  remainingAmount: number
  status: PayableStatus
  dueDate: string
  lastPaymentDate?: string
  payments: PaymentRecord[]
  createdAt: string
}

export interface PaymentRecord {
  id: string
  amount: number
  paymentDate: string
  paymentMethod: string
  referenceNo?: string
  remark?: string
}

export const payableService = {
  getList(params: { page?: number; pageSize?: number; supplierId?: string; status?: PayableStatus }): Promise<PaginatedResponse<Payable>> {
    return request.get('/payables', { params })
  },

  getOne(id: string): Promise<Payable> {
    return request.get(`/payables/${id}`)
  },

  recordPayment(id: string, data: { amount: number; paymentDate: string; paymentMethod: string; referenceNo?: string; remark?: string }): Promise<Payable> {
    return request.post(`/payables/${id}/payment`, data)
  },

  getOverdue(): Promise<Payable[]> {
    return request.get('/payables/overdue')
  },

  getStats(): Promise<{ total: number; paid: number; pending: number; overdue: number }> {
    return request.get('/payables/stats')
  },
}

export default payableService