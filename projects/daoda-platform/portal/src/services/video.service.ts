/**
 * 视频管理服务
 * 处理视频内容管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type VideoStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Video {
  id: string
  title: string
  description: string | null
  cover: string | null
  url: string
  duration: number | null
  category: string | null
  status: VideoStatus
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateVideoDto {
  title: string
  description?: string
  cover?: string
  url: string
  duration?: number
  category?: string
  status?: VideoStatus
}

export interface UpdateVideoDto {
  title?: string
  description?: string
  cover?: string
  url?: string
  duration?: number
  category?: string
  status?: VideoStatus
}

export interface VideoQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  category?: string
  status?: VideoStatus
}

// ==================== 视频服务 ====================

export const videoService = {
  /**
   * 获取视频列表
   */
  getList(params: VideoQueryParams): Promise<PaginatedResponse<Video>> {
    return request.get<PaginatedResponse<Video>>('/videos', { params })
  },

  /**
   * 获取视频详情
   */
  getOne(id: string): Promise<Video> {
    return request.get<Video>(`/videos/${id}`)
  },

  /**
   * 创建视频
   */
  create(dto: CreateVideoDto): Promise<Video> {
    return request.post<Video>('/videos', dto)
  },

  /**
   * 更新视频
   */
  update(id: string, dto: UpdateVideoDto): Promise<Video> {
    return request.put<Video>(`/videos/${id}`, dto)
  },

  /**
   * 删除视频
   */
  delete(id: string): Promise<void> {
    return request.delete(`/videos/${id}`)
  },

  /**
   * 发布视频
   */
  publish(id: string): Promise<Video> {
    return request.post<Video>(`/videos/${id}/publish`)
  },

  /**
   * 获取视频统计
   */
  getStats(): Promise<{
    total: number
    published: number
    draft: number
    archived: number
  }> {
    return request.get('/videos/stats')
  },
}

export default videoService
