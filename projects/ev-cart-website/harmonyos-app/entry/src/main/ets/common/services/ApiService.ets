/**
 * API 服务封装
 * 道达智能 CRM+ERP 移动办公平台
 * 渔晓白 ⚙️ · 专业交付
 */

import { http } from '@kit.NetworkKit'
import { promptAction } from '@kit.ArkUI'
import { Storage } from '@kit.ArkTS'

// API 基础配置
const API_BASE_URL = 'https://api.example.com'
const TIMEOUT = 10000 // 10 秒

// 响应数据类型
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

// 请求方法
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

class ApiService {
  private token: string = ''

  constructor() {
    // 从存储加载 Token
    this.loadToken()
  }

  /**
   * 加载 Token
   */
  private loadToken() {
    this.token = Storage.get('token') || ''
  }

  /**
   * 保存 Token
   */
  saveToken(token: string) {
    this.token = token
    Storage.put('token', token)
  }

  /**
   * 清除 Token
   */
  clearToken() {
    this.token = ''
    Storage.delete('token')
  }

  /**
   * 通用请求方法
   */
  async request<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> {
    const fullUrl = `${API_BASE_URL}${url}`

    // 创建 HTTP 请求
    const httpRequest = http.createHttp()

    try {
      const response = await httpRequest.request(fullUrl, {
        method: method,
        header: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
        data: data ? JSON.stringify(data) : undefined,
        extraData: {
          timeout: TIMEOUT
        }
      })

      // 解析响应
      const result = response.result as ApiResponse<T>

      if (result.success) {
        return result.data
      } else {
        // 错误处理
        promptAction.showToast({ message: result.message || '请求失败' })
        throw new Error(result.message)
      }
    } catch (error) {
      console.error('API Request Error:', error)
      promptAction.showToast({ message: '网络请求失败' })
      throw error
    } finally {
      httpRequest.destroy()
    }
  }

  // ========== GET 请求 ==========
  async get<T>(url: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(HttpMethod.GET, url, undefined, params)
  }

  // ========== POST 请求 ==========
  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(HttpMethod.POST, url, data)
  }

  // ========== PUT 请求 ==========
  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(HttpMethod.PUT, url, data)
  }

  // ========== DELETE 请求 ==========
  async delete<T>(url: string): Promise<T> {
    return this.request<T>(HttpMethod.DELETE, url)
  }
}

// 导出单例
export const apiService = new ApiService()
export default apiService
