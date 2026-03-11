import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/api'

interface User {
  id: string
  username: string
  email: string
  role: string
  department: string
  businessType: string
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 检查本地存储的 Token
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      setUser(JSON.parse(userData))
      // 验证 Token 是否有效
      validateToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      await apiClient.get('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      // Token 无效，清除本地存储
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { accessToken, refreshToken, user } = response.data

      // 存储 Token 和用户信息
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(user))

      setUser(user)

      // 根据部门自动跳转到对应仪表盘
      if (user.department === 'foreign') {
        navigate('/crm/foreign-dashboard')
      } else {
        navigate('/crm/dashboard')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '登录失败')
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/crm/login')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.role === 'admin') return true

    // TODO: 实现权限检查逻辑
    return true
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
