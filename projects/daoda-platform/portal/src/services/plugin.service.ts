import { request } from './api'

export interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  enabled: boolean
  installed: boolean
  permissions: string[]
  dependencies: { id: string; version: string }[]
  rating: number
  downloads: number
  icon?: string
}

export const pluginService = {
  // 获取已安装插件
  getInstalled(): Promise<Plugin[]> {
    return request.get<Plugin[]>('/plugins/installed')
  },

  // 获取市场插件
  getMarket(): Promise<Plugin[]> {
    return request.get<Plugin[]>('/plugins/market')
  },

  // 安装插件
  install(id: string): Promise<void> {
    return request.post(`/plugins/${id}/install`)
  },

  // 卸载插件
  uninstall(id: string): Promise<void> {
    return request.delete(`/plugins/${id}`)
  },

  // 启用插件
  enable(id: string): Promise<void> {
    return request.put(`/plugins/${id}/enable`)
  },

  // 禁用插件
  disable(id: string): Promise<void> {
    return request.put(`/plugins/${id}/disable`)
  },

  // 更新插件
  update(id: string): Promise<void> {
    return request.put(`/plugins/${id}/update`)
  },

  // 获取插件详情
  getDetail(id: string): Promise<Plugin> {
    return request.get<Plugin>(`/plugins/${id}`)
  },
}
