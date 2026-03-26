/**
 * 认证服务
 */
import { request } from './api'

interface LoginResponse {
  token: string
  refreshToken?: string
  expiresIn?: number
  user: {
    id: string
    email: string
    name: string
    role: string
    permissions?: string[]
    tenantId?: string
  }
}

/**
 * 用户登录
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  // 模拟登录
  if (email === 'admin@daoda.com' && password === 'admin123') {
    return {
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 86400,
      user: {
        id: '1',
        email: 'admin@daoda.com',
        name: '管理员',
        role: 'admin',
        permissions: ['ALL'],
        tenantId: 'default',
      },
    }
  }
  
  // 实际 API 调用
  // return request.post<LoginResponse>('/auth/login', { email, password })
  throw new Error('用户名或密码错误')
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  localStorage.removeItem('token')
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  return request.get('/auth/me')
}

/**
 * 刷新 Token
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  // 模拟刷新
  return {
    token: 'mock-jwt-token-refreshed-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresIn: 86400,
    user: {
      id: '1',
      email: 'admin@daoda.com',
      name: '管理员',
      role: 'admin',
      permissions: ['ALL'],
      tenantId: 'default',
    },
  }
}

// 导出 authApi 对象供 store 使用
export const authApi = {
  login,
  logout,
  getCurrentUser,
  refreshToken,
}