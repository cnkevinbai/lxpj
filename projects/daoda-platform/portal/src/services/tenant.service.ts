import { request } from './api'

export interface Tenant {
  id: string
  code: string
  name: string
  logo?: string
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'
  plan?: string
  maxUsers: number
  expireAt?: string
  config?: any
  createdAt: string
}

export interface CreateTenantDto {
  code: string
  name: string
  logo?: string
  plan?: string
  maxUsers?: number
  expireAt?: string
}

export interface UpdateTenantDto {
  name?: string
  logo?: string
  plan?: string
  maxUsers?: number
  expireAt?: string
  config?: any
}

export const tenantService = {
  async getAll(): Promise<Tenant[]> {
    const response = await request.get<any>('/tenants')
    // 后端返回嵌套结构: { code, message, data: { code, message, data: { list, total } } }
    const data = response.data?.data || response.data || response
    return data.list || data || []
  },

  async getOne(id: string): Promise<Tenant> {
    const response = await request.get<any>(`/tenants/${id}`)
    return response.data?.data || response.data || response
  },

  async create(data: Partial<Tenant>): Promise<Tenant> {
    const response = await request.post<any>('/tenants', data)
    return response.data?.data || response.data || response
  },

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    const response = await request.put<any>(`/tenants/${id}`, data)
    return response.data?.data || response.data || response
  },

  delete(id: string): Promise<void> {
    return request.delete(`/tenants/${id}`)
  },

  suspend(id: string): Promise<Tenant> {
    return request.put<Tenant>(`/tenants/${id}/suspend`)
  },

  activate(id: string): Promise<Tenant> {
    return request.put<Tenant>(`/tenants/${id}/activate`)
  },
}
