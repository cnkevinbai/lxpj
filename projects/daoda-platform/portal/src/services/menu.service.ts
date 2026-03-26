/**
 * 菜单管理服务
 * 处理系统菜单相关操作
 */
import { request, PaginatedResponse } from './api'

// ==================== 类型定义 ====================

export type MenuType = 'DIRECTORY' | 'MENU' | 'BUTTON'
export type MenuStatus = 'ENABLED' | 'DISABLED'

export interface Menu {
  id: string
  parentId: string | null
  parent?: Menu
  children?: Menu[]
  name: string
  path: string | null
  component: string | null
  icon: string | null
  type: MenuType
  permission: string | null
  sortOrder: number
  status: MenuStatus
  visible: boolean
  cache: boolean
  remark: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateMenuDto {
  parentId?: string
  name: string
  path?: string
  component?: string
  icon?: string
  type: MenuType
  permission?: string
  sortOrder?: number
  status?: MenuStatus
  visible?: boolean
  cache?: boolean
  remark?: string
}

export interface UpdateMenuDto {
  parentId?: string
  name?: string
  path?: string
  component?: string
  icon?: string
  type?: MenuType
  permission?: string
  sortOrder?: number
  status?: MenuStatus
  visible?: boolean
  cache?: boolean
  remark?: string
}

export interface MenuQueryParams {
  name?: string
  status?: MenuStatus
  type?: MenuType
}

// ==================== 菜单服务 ====================

export const menuService = {
  /**
   * 获取菜单树
   */
  getTree(): Promise<Menu[]> {
    return request.get<Menu[]>('/menus/tree')
  },

  /**
   * 获取菜单列表（扁平）
   */
  getList(params: MenuQueryParams): Promise<Menu[]> {
    return request.get<Menu[]>('/menus', { params })
  },

  /**
   * 获取菜单详情
   */
  getOne(id: string): Promise<Menu> {
    return request.get<Menu>(`/menus/${id}`)
  },

  /**
   * 创建菜单
   */
  create(dto: CreateMenuDto): Promise<Menu> {
    return request.post<Menu>('/menus', dto)
  },

  /**
   * 更新菜单
   */
  update(id: string, dto: UpdateMenuDto): Promise<Menu> {
    return request.put<Menu>(`/menus/${id}`, dto)
  },

  /**
   * 删除菜单
   */
  delete(id: string): Promise<void> {
    return request.delete(`/menus/${id}`)
  },

  /**
   * 获取用户菜单
   */
  getUserMenus(): Promise<Menu[]> {
    return request.get<Menu[]>('/menus/user')
  },

  /**
   * 获取角色菜单
   */
  getRoleMenus(roleId: string): Promise<Menu[]> {
    return request.get<Menu[]>(`/menus/role/${roleId}`)
  },

  /**
   * 分配角色菜单
   */
  assignRoleMenus(roleId: string, menuIds: string[]): Promise<void> {
    return request.post(`/menus/role/${roleId}`, { menuIds })
  },

  /**
   * 启用菜单
   */
  enable(id: string): Promise<Menu> {
    return request.post<Menu>(`/menus/${id}/enable`)
  },

  /**
   * 禁用菜单
   */
  disable(id: string): Promise<Menu> {
    return request.post<Menu>(`/menus/${id}/disable`)
  },

  /**
   * 移动菜单
   */
  move(id: string, parentId: string | null, sortOrder: number): Promise<Menu> {
    return request.post<Menu>(`/menus/${id}/move`, { parentId, sortOrder })
  },
}

export default menuService