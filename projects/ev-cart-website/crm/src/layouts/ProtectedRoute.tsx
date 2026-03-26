import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// 鉴权守卫组件 - 检查用户是否已登录
const ProtectedRoute: React.FC<{
  children: React.ReactNode
  requireAnyRole?: string[]
  requireAllRoles?: string[]
}> = ({ children, requireAnyRole, requireAllRoles }) => {
  const location = useLocation()

  // 从 localStorage 获取用户信息和 token
  const token = localStorage.getItem('access_token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  // 检查是否已登录
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 检查角色权限（如果配置了）
  if (requireAnyRole && requireAnyRole.length > 0) {
    const userRoles = user.roles || []
    const hasAnyRole = userRoles.some((role: string) => requireAnyRole.includes(role))
    if (!hasAnyRole) {
      return <Navigate to="/403" replace />
    }
  }

  if (requireAllRoles && requireAllRoles.length > 0) {
    const userRoles = user.roles || []
    const hasAllRoles = requireAllRoles.every((role: string) => userRoles.includes(role))
    if (!hasAllRoles) {
      return <Navigate to="/403" replace />
    }
  }

  return <>{children}</>
}

// 仅检查登录状态的高阶组件
export const withAuthentication = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <ProtectedRoute>
      <Component {...props} />
    </ProtectedRoute>
  )
}

// 检查特定角色的高阶组件
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[]
): React.FC<P> => {
  return (props: P) => (
    <ProtectedRoute requireAnyRole={requiredRoles}>
      <Component {...props} />
    </ProtectedRoute>
  )
}

// 需要所有指定角色的高阶组件
export const withAllRoles = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[]
): React.FC<P> => {
  return (props: P) => (
    <ProtectedRoute requireAllRoles={requiredRoles}>
      <Component {...props} />
    </ProtectedRoute>
  )
}

export default ProtectedRoute
