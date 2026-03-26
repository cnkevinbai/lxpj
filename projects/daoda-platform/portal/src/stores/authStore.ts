/**
 * 认证状态管理
 * 使用 Zustand 管理用户认证状态
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, UserInfo } from '../services'

// ==================== 类型定义 ====================

interface AuthState {
  // 状态
  user: UserInfo | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  
  // 操作
  login: (email: string, password: string) => Promise<void>
  loginWithPhone: (phone: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: UserInfo) => void
  setToken: (token: string, refreshToken: string) => void
  refreshUserInfo: () => Promise<void>
  init: () => Promise<void>
}

// ==================== 创建 Store ====================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,

      // 邮箱登录
      login: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const response = await authService.login({ email, password })
          localStorage.setItem('token', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)
          set({
            user: response.user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      // 手机号登录
      loginWithPhone: async (phone: string, password: string) => {
        set({ loading: true })
        try {
          const response = await authService.login({ phone, password })
          localStorage.setItem('token', response.accessToken)
          localStorage.setItem('refreshToken', response.refreshToken)
          set({
            user: response.user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            loading: false,
          })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      // 退出登录
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      // 设置用户信息
      setUser: (user: UserInfo) => {
        set({ user })
      },

      // 设置 Token
      setToken: (token: string, refreshToken: string) => {
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        set({ token, refreshToken })
      },

      // 刷新用户信息
      refreshUserInfo: async () => {
        try {
          const user = await authService.getCurrentUser()
          set({ user })
        } catch (error) {
          // Token 无效，清除登录状态
          get().logout()
        }
      },

      // 初始化（检查本地存储的 Token）
      init: async () => {
        const token = localStorage.getItem('token')
        if (token) {
          set({ token, loading: true })
          try {
            const user = await authService.getCurrentUser()
            set({
              user,
              isAuthenticated: true,
              loading: false,
            })
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
            })
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
)

export default useAuthStore