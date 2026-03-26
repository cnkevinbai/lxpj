/**
 * 线索服务
 * 处理线索管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'UNQUALIFIED' | 'CONVERTED'

export interface Lead {
  id: string
  name: string
  contact: string
  phone: string
  email: string | null
  company: string | null
  position: string | null
  status: LeadStatus
  source: string | null
  industry: string | null
  province: string | null
  city: string | null
  budget: number | null
  requirement: string | null
  userId: string | null
  userName: string | null
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateLeadDto {
  name: string
  contact: string
  phone: string
  email?: string
  company?: string
  position?: string
  source?: string
  industry?: string
  province?: string
  city?: string
  budget?: number
  requirement?: string
  remark?: string
}

export interface UpdateLeadDto {
  name?: string
  contact?: string
  phone?: string
  email?: string
  company?: string
  position?: string
  status?: LeadStatus
  source?: string
  industry?: string
  province?: string
  city?: string
  budget?: number
  requirement?: string
  remark?: string
}

export interface LeadQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: LeadStatus
  source?: string
  industry?: string
}

// ==================== 线索服务 ====================

export const leadService = {
  /**
   * 获取线索列表
   */
  getList(params: LeadQueryParams): Promise<PaginatedResponse<Lead>> {
    return request.get<PaginatedResponse<Lead>>('/leads', { params })
  },

  /**
   * 获取线索详情
   */
  getOne(id: string): Promise<Lead> {
    return request.get<Lead>(`/leads/${id}`)
  },

  /**
   * 创建线索
   */
  create(dto: CreateLeadDto): Promise<Lead> {
    return request.post<Lead>('/leads', dto)
  },

  /**
   * 更新线索
   */
  update(id: string, dto: UpdateLeadDto): Promise<Lead> {
    return request.put<Lead>(`/leads/${id}`, dto)
  },

  /**
   * 删除线索
   */
  delete(id: string): Promise<void> {
    return request.delete(`/leads/${id}`)
  },

  /**
   * 转化为客户
   */
  convert(id: string): Promise<{ customerId: string }> {
    return request.post(`/leads/${id}/convert`)
  },

  /**
   * 分配销售
   */
  assign(id: string, userId: string): Promise<Lead> {
    return request.post(`/leads/${id}/assign`, { userId })
  },

  /**
   * 丢弃线索
   */
  discard(id: string): Promise<Lead> {
    return request.post(`/leads/${id}/discard`)
  },
}

export default leadService
