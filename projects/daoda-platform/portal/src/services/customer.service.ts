/**
 * 客户服务
 * 处理客户管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type CustomerLevel = 'A' | 'B' | 'C'
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'LOST'

export interface Customer {
  id: string
  name: string
  contact: string
  phone: string
  email: string | null
  address: string | null
  level: CustomerLevel
  status: CustomerStatus
  source: string | null
  industry: string | null
  province: string | null
  city: string | null
  remark: string | null
  userId: string | null
  createdAt: string
  updatedAt: string
}

export interface FollowUp {
  id: string
  content: string
  nextTime: string | null
  createdAt: string
  customerId: string
}

export interface CreateCustomerDto {
  name: string
  contact: string
  phone: string
  email?: string
  address?: string
  level?: CustomerLevel
  source?: string
  industry?: string
  province?: string
  city?: string
  remark?: string
}

export interface UpdateCustomerDto {
  name?: string
  contact?: string
  phone?: string
  email?: string
  address?: string
  level?: CustomerLevel
  status?: CustomerStatus
  source?: string
  industry?: string
  province?: string
  city?: string
  remark?: string
}

export interface CustomerQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  level?: CustomerLevel
  status?: CustomerStatus
  source?: string
  industry?: string
}

export interface CreateFollowUpDto {
  content: string
  nextTime?: string
}

// ==================== 客户服务 ====================

export const customerService = {
  /**
   * 获取客户列表
   */
  getList(params: CustomerQueryParams): Promise<PaginatedResponse<Customer>> {
    return request.get<PaginatedResponse<Customer>>('/customers', { params })
  },

  /**
   * 获取客户详情
   */
  getOne(id: string): Promise<Customer> {
    return request.get<Customer>(`/customers/${id}`)
  },

  /**
   * 创建客户
   */
  create(dto: CreateCustomerDto): Promise<Customer> {
    return request.post<Customer>('/customers', dto)
  },

  /**
   * 更新客户
   */
  update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    return request.put<Customer>(`/customers/${id}`, dto)
  },

  /**
   * 删除客户
   */
  delete(id: string): Promise<void> {
    return request.delete(`/customers/${id}`)
  },

  /**
   * 获取客户跟进记录
   */
  getFollowUps(customerId: string): Promise<FollowUp[]> {
    return request.get<FollowUp[]>(`/customers/${customerId}/follow-ups`)
  },

  /**
   * 添加跟进记录
   */
  addFollowUp(customerId: string, dto: CreateFollowUpDto): Promise<FollowUp> {
    return request.post<FollowUp>(`/customers/${customerId}/follow-ups`, dto)
  },

  /**
   * 导出客户数据
   */
  export(params?: CustomerQueryParams): Promise<Blob> {
    return request.get('/customers/export', { 
      params, 
      responseType: 'blob' 
    })
  },
}

export default customerService