import api from './api'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: {
    id: string
    username: string
    name: string
    avatar?: string
    roles: string[]
  }
}

export const authService = {
  // 登录
  login: async (params: LoginParams): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', params)
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    return response
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    return api.get('/auth/me')
  },

  // 检查是否登录
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}
