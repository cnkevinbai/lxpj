import { request } from './api'

export interface ModuleConfig {
  id: string
  moduleCode: string
  moduleName: string
  enabled: boolean
  description?: string
  config?: any
  sortOrder: number
}

export const moduleConfigService = {
  // 获取所有模块配置
  async getAll(): Promise<ModuleConfig[]> {
    const response = await request.get<any>('/module-configs')
    const data = response.data?.data || response.data || response
    return data.list || data || []
  },

  // 获取启用的模块
  async getEnabled(): Promise<ModuleConfig[]> {
    const response = await request.get<any>('/module-configs/enabled')
    const data = response.data?.data || response.data || response
    return data.list || data || []
  },

  // 更新模块配置
  async update(moduleCode: string, data: Partial<ModuleConfig>): Promise<ModuleConfig> {
    const response = await request.put<any>(`/module-configs/${moduleCode}`, data)
    return response.data?.data || response.data || response
  },

  // 切换模块启用状态
  async toggle(moduleCode: string, enabled: boolean): Promise<ModuleConfig> {
    const response = await request.put<any>(`/module-configs/${moduleCode}/toggle`, { enabled })
    return response.data?.data || response.data || response
  },
}
