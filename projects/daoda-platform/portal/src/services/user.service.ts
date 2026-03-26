/**
 * 用户服务
 * 处理用户管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type UserRole = 'ADMIN' | 'MANAGER' | 'SALES' | 'TECHNICIAN' | 'USER'
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED'

export interface User {
  id: string
  email: string
  phone: string | null
  name: string
  avatar: string | null
  role: UserRole
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  email: string
  phone?: string
  password: string
  name: string
  role?: UserRole
  avatar?: string
}

export interface UpdateUserDto {
  name?: string
  phone?: string
  avatar?: string
  role?: UserRole
  status?: UserStatus
}

export interface UserQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  role?: UserRole
  status?: UserStatus
}

// ==================== 用户服务 ====================

export const userService = {
  /**
   * 获取用户列表
   */
  getList(params: UserQueryParams): Promise<PaginatedResponse<User>> {
    return request.get<PaginatedResponse<User>>('/users', { params })
  },

  /**
   * 获取用户详情
   */
  getOne(id: string): Promise<User> {
    return request.get<User>(`/users/${id}`)
  },

  /**
   * 创建用户
   */
  create(dto: CreateUserDto): Promise<User> {
    return request.post<User>('/users', dto)
  },

  /**
   * 更新用户
   */
  update(id: string, dto: UpdateUserDto): Promise<User> {
    return request.put<User>(`/users/${id}`, dto)
  },

  /**
   * 删除用户
   */
  delete(id: string): Promise<void> {
    return request.delete(`/users/${id}`)
  },

  /**
   * 批量更新用户状态
   */
  batchUpdateStatus(ids: string[], status: UserStatus): Promise<{ message: string }> {
    return request.post('/users/batch/status', { ids, status })
  },

  /**
   * 重置用户密码
   */
  resetPassword(id: string, newPassword: string): Promise<{ message: string }> {
    return request.post(`/users/${id}/reset-password`, { newPassword })
  },
}

export default userService