/**
 * 应收账款服务
 */
import { request, PaginatedResponse } from './api'

export type ReceivableStatus = 'pending' | 'partial' | 'paid' | 'overdue'

export interface Receivable {
  id: string
  invoiceId: string
  invoiceNo: string
  customerId: string
  customerName: string
  amount: number
  paidAmount: number
  remainingAmount: number
  status: ReceivableStatus
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

export const receivableService = {
  getList(params: { page?: number; pageSize?: number; customerId?: string; status?: ReceivableStatus }): Promise<PaginatedResponse<Receivable>> {
    return request.get('/receivables', { params })
  },

  getOne(id: string): Promise<Receivable> {
    return request.get(`/receivables/${id}`)
  },

  recordPayment(id: string, data: { amount: number; paymentDate: string; paymentMethod: string; referenceNo?: string; remark?: string }): Promise<Receivable> {
    return request.post(`/receivables/${id}/payment`, data)
  },

  getOverdue(): Promise<Receivable[]> {
    return request.get('/receivables/overdue')
  },

  getAging(): Promise<{ range0to30: number; range31to60: number; range61to90: number; rangeOver90: number }> {
    return request.get('/receivables/aging')
  },

  getStats(): Promise<{ total: number; paid: number; pending: number; overdue: number }> {
    return request.get('/receivables/stats')
  },
}

export default receivableService