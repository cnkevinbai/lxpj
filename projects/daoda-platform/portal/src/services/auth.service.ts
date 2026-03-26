/**
 * 认证服务
 * 处理登录、注册、Token 刷新等
 */
import { request } from './api'

// ==================== 类型定义 ====================

export interface LoginDto {
  email?: string
  phone?: string
  password: string
}

export interface RegisterDto {
  email: string
  phone?: string
  password: string
  name: string
}

export interface UserInfo {
  id: string
  email: string
  phone: string | null
  name: string
  avatar: string | null
  role: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserInfo
}

// ==================== 认证服务 ====================

export const authService = {
  /**
   * 用户登录
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    const response = await request.post<any>('/auth/login', dto)
    // 后端返回嵌套结构: { code, message, data: { code, message, data: LoginResponse } }
    return response.data?.data || response.data || response
  },

  /**
   * 用户注册
   */
  async register(dto: RegisterDto): Promise<LoginResponse> {
    const response = await request.post<any>('/auth/register', dto)
    return response.data?.data || response.data || response
  },

  /**
   * 刷新 Token
   */
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await request.post<any>('/auth/refresh')
    return response.data?.data || response.data || response
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<UserInfo> {
    const response = await request.get<any>('/auth/me')
    return response.data?.data || response.data || response
  },

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await request.post('/auth/change-password', { oldPassword, newPassword })
  },

  /**
   * 退出登录
   */
  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
  },
}

export default authService