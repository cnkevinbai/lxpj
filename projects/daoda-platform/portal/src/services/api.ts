/**
 * API 配置与请求封装
 * 基于 Axios 的 HTTP 客户端
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'

// ==================== 类型定义 ====================

export interface ApiResponse<T = any> {
  data: T
  code: number
  message: string
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// ==================== 创建 Axios 实例 ====================

const api: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==================== 请求拦截器 ====================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 从 localStorage 获取租户ID并添加到请求头
    const tenantId = localStorage.getItem('x-tenant-id')
    if (tenantId && config.headers) {
      config.headers['X-Tenant-Id'] = tenantId
    }
    
    // 过滤掉空字符串参数（只对 GET 请求的 params）
    if (config.params && typeof config.params === 'object') {
      const filteredParams: Record<string, any> = {}
      for (const [key, value] of Object.entries(config.params)) {
        // 过滤掉 undefined、null、空字符串
        if (value !== undefined && value !== null && value !== '') {
          filteredParams[key] = value
        }
      }
      config.params = filteredParams
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ==================== 响应拦截器 ====================

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response as any
      
      switch (status) {
        case 401:
          // 未授权，跳转登录
          message.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误，请稍后重试')
          break
        default:
          message.error(data?.message || '请求失败')
      }
    } else {
      message.error('网络错误，请检查网络连接')
    }
    
    return Promise.reject(error)
  }
)

// ==================== 导出请求方法 ====================

export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.get(url, config)
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.post(url, data, config)
  },
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.put(url, data, config)
  },
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.delete(url, config)
  },
  
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return api.patch(url, data, config)
  },
}

export default api