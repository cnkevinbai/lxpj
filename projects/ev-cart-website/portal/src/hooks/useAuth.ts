/**
 * 认证 Hook
 * 提供用户认证状态和管理功能
 */

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string
  username?: string
  role: string
  avatar?: string
  avatarUrl?: string
  phone?: string
  department?: string
  status?: string
}

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化：从 localStorage 恢复用户状态
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(TOKEN_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  // 登录
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // TODO: 调用实际登录 API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        throw new Error('登录失败')
      }
      
      const data = await response.json()
      const { token, user: userData } = data
      
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    window.location.href = '/login'
  }, [])

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.ok) {
        logout()
        return
      }
      
      const userData = await response.json()
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }, [logout])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser
  }
}

export default useAuth