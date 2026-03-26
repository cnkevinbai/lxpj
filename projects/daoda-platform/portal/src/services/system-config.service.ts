/**
 * 系统配置服务
 * 处理系统配置相关操作
 */
import { request } from './api'

// ==================== 类型定义 ====================

export type ConfigCategory = 'basic' | 'email' | 'storage' | 'security'

export interface SystemConfig {
  id: string
  key: string
  value: string
  category: ConfigCategory
  remark: string | null
  updatedAt: string
}

export interface UpdateSystemConfigDto {
  value: string
  remark?: string
}

export interface BatchUpdateConfigDto {
  configs: {
    key: string
    value: string
    remark?: string
  }[]
}

// ==================== 系统配置服务 ====================

export const systemConfigService = {
  /**
   * 获取所有配置
   */
  getAll(): Promise<SystemConfig[]> {
    return request.get<SystemConfig[]>('/system-configs')
  },

  /**
   * 按分类获取配置
   */
  getByCategory(category: ConfigCategory): Promise<SystemConfig[]> {
    return request.get<SystemConfig[]>(`/system-configs/category/${category}`)
  },

  /**
   * 获取单个配置
   */
  getOne(key: string): Promise<SystemConfig> {
    return request.get<SystemConfig>(`/system-configs/${key}`)
  },

  /**
   * 更新配置
   */
  update(key: string, dto: UpdateSystemConfigDto): Promise<SystemConfig> {
    return request.put<SystemConfig>(`/system-configs/${key}`, dto)
  },

  /**
   * 批量更新配置
   */
  batchUpdate(dto: BatchUpdateConfigDto): Promise<{ message: string }> {
    return request.post('/system-configs/batch', dto)
  },
}

export default systemConfigService
