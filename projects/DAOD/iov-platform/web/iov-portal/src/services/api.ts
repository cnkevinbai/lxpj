/**
 * API 配置
 */
import axios from 'axios'
import { message } from 'antd'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      message.error('没有权限访问')
    } else if (error.response?.status === 404) {
      message.error('资源不存在')
    } else if (error.response?.status === 500) {
      message.error('服务器错误')
    }
    return Promise.reject(error)
  }
)

export default api

// 便捷方法
export const request = {
  get: <T = any>(url: string, params?: any) => api.get<any, T>(url, { params }),
  post: <T = any>(url: string, data?: any) => api.post<any, T>(url, data),
  put: <T = any>(url: string, data?: any) => api.put<any, T>(url, data),
  delete: <T = any>(url: string) => api.delete<any, T>(url),
}