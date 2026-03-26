/**
 * 新闻管理服务
 * 处理新闻内容管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface News {
  id: string
  title: string
  summary: string | null
  content: string
  cover: string | null
  category: string | null
  status: NewsStatus
  viewCount: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateNewsDto {
  title: string
  summary?: string
  content: string
  cover?: string
  category?: string
  status?: NewsStatus
}

export interface UpdateNewsDto {
  title?: string
  summary?: string
  content?: string
  cover?: string
  category?: string
  status?: NewsStatus
}

export interface NewsQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: NewsStatus
  category?: string
}

// ==================== 新闻服务 ====================

export const newsService = {
  /**
   * 获取新闻列表
   */
  getList(params: NewsQueryParams): Promise<PaginatedResponse<News>> {
    return request.get<PaginatedResponse<News>>('/news', { params })
  },

  /**
   * 获取新闻详情
   */
  getOne(id: string): Promise<News> {
    return request.get<News>(`/news/${id}`)
  },

  /**
   * 创建新闻
   */
  create(dto: CreateNewsDto): Promise<News> {
    return request.post<News>('/news', dto)
  },

  /**
   * 更新新闻
   */
  update(id: string, dto: UpdateNewsDto): Promise<News> {
    return request.put<News>(`/news/${id}`, dto)
  },

  /**
   * 删除新闻
   */
  delete(id: string): Promise<void> {
    return request.delete(`/news/${id}`)
  },

  /**
   * 发布新闻
   */
  publish(id: string): Promise<News> {
    return request.post<News>(`/news/${id}/publish`)
  },

  /**
   * 获取新闻统计
   */
  getStats(): Promise<{
    total: number
    published: number
    draft: number
    archived: number
  }> {
    return request.get('/news/stats')
  },
}

export default newsService
