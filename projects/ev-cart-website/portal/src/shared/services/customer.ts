import api from './api'

export interface Customer {
  id: string
  name: string
  type: string
  industry?: string
  level?: string
  phone?: string
  email?: string
  address?: string
  owner_id?: string
  created_at: string
}

export interface CustomerListParams {
  page?: number
  pageSize?: number
  keyword?: string
  type?: string
  level?: string
}

export interface CustomerListResponse {
  data: Customer[]
  total: number
  page: number
  pageSize: number
}

export const customerService = {
  // 获取客户列表
  getList: async (params: CustomerListParams): Promise<CustomerListResponse> => {
    return api.get('/crm/customers', { params })
  },

  // 获取客户详情
  getById: async (id: string): Promise<Customer> => {
    return api.get(`/crm/customers/${id}`)
  },

  // 创建客户
  create: async (data: Partial<Customer>): Promise<Customer> => {
    return api.post('/crm/customers', data)
  },

  // 更新客户
  update: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    return api.put(`/crm/customers/${id}`, data)
  },

  // 删除客户
  delete: async (id: string): Promise<void> => {
    return api.delete(`/crm/customers/${id}`)
  },
}
