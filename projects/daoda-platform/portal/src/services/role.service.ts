/**
 * 角色服务
 * 处理角色管理相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export interface Permission {
  id: string
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  parentId: string | null
  path?: string
  icon?: string
  sort: number
  children?: Permission[]
}

export interface Role {
  id: string
  name: string
  code: string
  description: string | null
  permissions: string[] // permission ids
  userCount: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface CreateRoleDto {
  name: string
  code: string
  description?: string
  permissions?: string[]
}

export interface UpdateRoleDto {
  name?: string
  description?: string
  permissions?: string[]
  status?: 'ACTIVE' | 'INACTIVE'
}

export interface RoleQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: 'ACTIVE' | 'INACTIVE'
}

// ==================== 角色服务 ====================

export const roleService = {
  /**
   * 获取角色列表
   */
  getList(params: RoleQueryParams): Promise<PaginatedResponse<Role>> {
    return request.get<PaginatedResponse<Role>>('/roles', { params })
  },

  /**
   * 获取角色详情
   */
  getOne(id: string): Promise<Role> {
    return request.get<Role>(`/roles/${id}`)
  },

  /**
   * 创建角色
   */
  create(dto: CreateRoleDto): Promise<Role> {
    return request.post<Role>('/roles', dto)
  },

  /**
   * 更新角色
   */
  update(id: string, dto: UpdateRoleDto): Promise<Role> {
    return request.put<Role>(`/roles/${id}`, dto)
  },

  /**
   * 删除角色
   */
  delete(id: string): Promise<void> {
    return request.delete(`/roles/${id}`)
  },

  /**
   * 获取权限树
   */
  getPermissionTree(): Promise<Permission[]> {
    return request.get<Permission[]>('/permissions/tree')
  },

  /**
   * 获取所有角色（用于选择）
   */
  getAllRoles(): Promise<Role[]> {
    return request.get<Role[]>('/roles/all')
  },
}

export default roleService
