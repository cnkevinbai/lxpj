/**
 * API 密钥管理服务
 * 处理 API 密钥相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED'

export interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  description: string | null
  permissions: string[]
  rateLimit: number | null
  expiresAt: string | null
  lastUsedAt: string | null
  status: ApiKeyStatus
  userId: string
  user?: any
  createdAt: string
  updatedAt: string
}

export interface CreateApiKeyDto {
  name: string
  description?: string
  permissions?: string[]
  rateLimit?: number
  expiresAt?: string
}

export interface UpdateApiKeyDto {
  name?: string
  description?: string
  permissions?: string[]
  rateLimit?: number
  expiresAt?: string
}

export interface ApiKeyQueryParams {
  page?: number
  pageSize?: number
  name?: string
  status?: ApiKeyStatus
}

export interface ApiKeyUsage {
  apiKeyId: string
  date: string
  requestCount: number
  errorCount: number
  avgDuration: number
}

// ==================== API 密钥服务 ====================

export const apiKeyService = {
  /**
   * 获取 API 密钥列表
   */
  getList(params: ApiKeyQueryParams): Promise<PaginatedResponse<ApiKey>> {
    return request.get<PaginatedResponse<ApiKey>>('/api-keys', { params })
  },

  /**
   * 获取 API 密钥详情
   */
  getOne(id: string): Promise<ApiKey> {
    return request.get<ApiKey>(`/api-keys/${id}`)
  },

  /**
   * 创建 API 密钥
   */
  create(dto: CreateApiKeyDto): Promise<ApiKey & { plainKey: string }> {
    return request.post('/api-keys', dto)
  },

  /**
   * 更新 API 密钥
   */
  update(id: string, dto: UpdateApiKeyDto): Promise<ApiKey> {
    return request.put<ApiKey>(`/api-keys/${id}`, dto)
  },

  /**
   * 删除 API 密钥
   */
  delete(id: string): Promise<void> {
    return request.delete(`/api-keys/${id}`)
  },

  /**
   * 撤销 API 密钥
   */
  revoke(id: string): Promise<ApiKey> {
    return request.post<ApiKey>(`/api-keys/${id}/revoke`)
  },

  /**
   * 重新生成 API 密钥
   */
  regenerate(id: string): Promise<ApiKey & { plainKey: string }> {
    return request.post(`/api-keys/${id}/regenerate`)
  },

  /**
   * 获取 API 密钥使用统计
   */
  getUsage(id: string, days?: number): Promise<ApiKeyUsage[]> {
    return request.get<ApiKeyUsage[]>(`/api-keys/${id}/usage`, {
      params: { days: days || 30 },
    })
  },

  /**
   * 获取所有权限列表
   */
  getPermissions(): Promise<{ name: string; description: string }[]> {
    return request.get('/api-keys/permissions')
  },

  /**
   * 测试 API 密钥
   */
  test(id: string): Promise<{ valid: boolean; message: string }> {
    return request.post(`/api-keys/${id}/test`)
  },
}

export default apiKeyService