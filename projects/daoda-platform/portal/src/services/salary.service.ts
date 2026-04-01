/**
 * 薪资管理服务
 */
import { request, PaginatedResponse } from './api'

export type SalaryStatus = 'draft' | 'pending' | 'approved' | 'paid'

export interface SalaryRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  month: string
  baseSalary: number
  bonus: number
  allowance: number
  deduction: number
  tax: number
  insurance: number
  netSalary: number
  status: SalaryStatus
  items: SalaryItem[]
  paidAt?: string
  remark?: string
  createdAt: string
}

export interface SalaryItem {
  name: string
  type: 'add' | 'deduct'
  amount: number
}

export const salaryService = {
  getList(params: { page?: number; pageSize?: number; employeeId?: string; month?: string; status?: SalaryStatus }): Promise<PaginatedResponse<SalaryRecord>> {
    return request.get('/salary', { params })
  },

  getOne(id: string): Promise<SalaryRecord> {
    return request.get(`/salary/${id}`)
  },

  create(data: Partial<SalaryRecord>): Promise<SalaryRecord> {
    return request.post('/salary', data)
  },

  update(id: string, data: Partial<SalaryRecord>): Promise<SalaryRecord> {
    return request.put(`/salary/${id}`, data)
  },

  delete(id: string): Promise<void> {
    return request.delete(`/salary/${id}`)
  },

  batchCreate(month: string): Promise<SalaryRecord[]> {
    return request.post('/salary/batch', { month })
  },

  approve(ids: string[]): Promise<void> {
    return request.post('/salary/approve', { ids })
  },

  pay(ids: string[]): Promise<void> {
    return request.post('/salary/pay', { ids })
  },

  getStats(month: string): Promise<{ totalEmployees: number; totalAmount: number; totalPaid: number }> {
    return request.get('/salary/stats', { params: { month } })
  },

  export(month: string): Promise<Blob> {
    return request.get('/salary/export', { params: { month }, responseType: 'blob' })
  },
}

export default salaryService