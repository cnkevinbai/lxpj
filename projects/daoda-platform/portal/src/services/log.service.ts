/**
 * 操作日志服务
 * 处理系统操作日志相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type LogStatus = 'SUCCESS' | 'FAILED'

export interface OperationLog {
  id: string
  userId: string | null
  user?: any
  action: string
  module: string | null
  ip: string | null
  userAgent: string | null
  params: any | null
  duration: number | null
  status: LogStatus
  error: string | null
  createdAt: string
}

export interface LogQueryParams {
  page?: number
  pageSize?: number
  userId?: string
  action?: string
  module?: string
  status?: LogStatus
  startDate?: string
  endDate?: string
}

// ==================== 操作日志服务 ====================

export const logService = {
  /**
   * 获取操作日志列表
   */
  getList(params: LogQueryParams): Promise<PaginatedResponse<OperationLog>> {
    return request.get<PaginatedResponse<OperationLog>>('/logs', { params })
  },

  /**
   * 获取日志详情
   */
  getOne(id: string): Promise<OperationLog> {
    return request.get<OperationLog>(`/logs/${id}`)
  },

  /**
   * 删除日志
   */
  delete(id: string): Promise<void> {
    return request.delete(`/logs/${id}`)
  },

  /**
   * 批量删除日志
   */
  batchDelete(ids: string[]): Promise<void> {
    return request.post('/logs/batch-delete', { ids })
  },

  /**
   * 清理过期日志
   */
  cleanup(days: number): Promise<{ deleted: number }> {
    return request.post('/logs/cleanup', { days })
  },

  /**
   * 导出日志
   */
  export(params: LogQueryParams): Promise<Blob> {
    return request.get('/logs/export', { params, responseType: 'blob' })
  },

  /**
   * 获取日志统计
   */
  getStatistics(): Promise<{
    total: number
    today: number
    successRate: number
    topActions: { action: string; count: number }[]
  }> {
    return request.get('/logs/statistics')
  },

  /**
   * 获取模块列表
   */
  getModules(): Promise<string[]> {
    return request.get('/logs/modules')
  },

  /**
   * 获取操作类型列表
   */
  getActions(): Promise<string[]> {
    return request.get('/logs/actions')
  },
}

export default logService