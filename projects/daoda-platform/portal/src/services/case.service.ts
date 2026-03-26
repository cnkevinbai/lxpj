/**
 * 案例管理服务
 * 处理案例内容管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type CaseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Case {
  id: string
  title: string
  customer: string
  industry: string | null
  description: string
  solution: string | null
  result: string | null
  images: string | null
  status: CaseStatus
  createdAt: string
  updatedAt: string
}

export interface CreateCaseDto {
  title: string
  customer: string
  industry?: string
  description: string
  solution?: string
  result?: string
  images?: string[]
  status?: CaseStatus
}

export interface UpdateCaseDto {
  title?: string
  customer?: string
  industry?: string
  description?: string
  solution?: string
  result?: string
  images?: string[]
  status?: CaseStatus
}

export interface CaseQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  customer?: string
  industry?: string
  status?: CaseStatus
}

// ==================== 案例服务 ====================

export const caseService = {
  /**
   * 获取案例列表
   */
  getList(params: CaseQueryParams): Promise<PaginatedResponse<Case>> {
    return request.get<PaginatedResponse<Case>>('/cases', { params })
  },

  /**
   * 获取案例详情
   */
  getOne(id: string): Promise<Case> {
    return request.get<Case>(`/cases/${id}`)
  },

  /**
   * 创建案例
   */
  create(dto: CreateCaseDto): Promise<Case> {
    return request.post<Case>('/cases', dto)
  },

  /**
   * 更新案例
   */
  update(id: string, dto: UpdateCaseDto): Promise<Case> {
    return request.put<Case>(`/cases/${id}`, dto)
  },

  /**
   * 删除案例
   */
  delete(id: string): Promise<void> {
    return request.delete(`/cases/${id}`)
  },

  /**
   * 发布案例
   */
  publish(id: string): Promise<Case> {
    return request.post<Case>(`/cases/${id}/publish`)
  },

  /**
   * 获取案例统计
   */
  getStats(): Promise<{
    total: number
    published: number
    draft: number
    archived: number
  }> {
    return request.get('/cases/stats')
  },
}

export default caseService
