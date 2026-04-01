/**
 * Role 角色管理模块
 * 热插拔核心模块 - 提供角色权限管理
 *
 * 功能范围:
 * - 角色 CRUD 操作
 * - 权限分配与管理
 * - 用户角色关联
 * - 角色继承关系
 * - 角色数据权限范围
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { BaseModule } from '../../core/module/base-module'
import {
  ModuleManifest,
  ModuleContext,
  HotUpdateStrategy,
  ModuleMenuItem,
  ModulePermission,
  PermissionType,
  ModuleRoute,
  HttpMethod,
  ModuleEvent,
  EventType,
} from '../../core/module/interfaces'

// ============================================
// 角色类型枚举
// ============================================

export enum RoleType {
  SYSTEM = 'system', // 系统内置角色
  CUSTOM = 'custom', // 自定义角色
}

export enum DataScopeType {
  ALL = 'all', // 全部数据
  DEPARTMENT = 'department', // 本部门数据
  DEPARTMENT_AND_SUB = 'department_and_sub', // 本部门及子部门
  SELF = 'self', // 仅本人数据
  CUSTOM = 'custom', // 自定义范围
}

// ============================================
// 模块清单定义
// ============================================

export const ROLE_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/role',
  name: '角色权限管理',
  version: '1.0.0',
  description: '角色权限管理核心模块，支持RBAC角色体系、权限分配、数据范围控制',
  category: 'core',
  tags: ['role', 'permission', 'rbac', 'auth'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
  ],
  permissions: [
    'role:create',
    'role:view',
    'role:edit',
    'role:delete',
    'role:assign-permission',
    'role:assign-user',
    'role:set-data-scope',
    'role:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
  builtin: true,
  system: true,
}

// ============================================
// Role 模块实现
// ============================================

export class RoleHotplugModule extends BaseModule {
  readonly manifest = ROLE_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // 角色数据存储 (模拟)
  private roles: Map<string, any> = new Map()

  // 权限数据存储 (模拟)
  private permissions: Map<string, any> = new Map()

  // 用户-角色关联 (模拟)
  private userRoles: Map<string, string[]> = new Map()

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    // 初始化系统内置角色
    this.initSystemRoles()

    await context.config.setModuleConfigs(this.manifest.id, {
      maxRolesPerUser: 5,
      allowRoleInheritance: true,
      maxInheritanceDepth: 3,
      defaultDataScope: DataScopeType.SELF,
    })

    this.logger?.info('角色权限管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.roles.clear()
    this.permissions.clear()
    this.userRoles.clear()
    this.logger?.info('角色权限管理模块已销毁')
  }

  // ============================================
  // 系统角色初始化
  // ============================================

  private initSystemRoles(): void {
    const systemRoles = [
      {
        id: 'admin',
        name: '超级管理员',
        code: 'ADMIN',
        type: RoleType.SYSTEM,
        permissions: ['*'],
        dataScope: DataScopeType.ALL,
        description: '系统超级管理员，拥有所有权限',
      },
      {
        id: 'manager',
        name: '部门经理',
        code: 'MANAGER',
        type: RoleType.SYSTEM,
        permissions: ['department:*'],
        dataScope: DataScopeType.DEPARTMENT_AND_SUB,
        description: '部门经理，管理本部门及子部门',
      },
      {
        id: 'user',
        name: '普通用户',
        code: 'USER',
        type: RoleType.SYSTEM,
        permissions: ['self:*'],
        dataScope: DataScopeType.SELF,
        description: '普通用户，仅可操作个人数据',
      },
    ]

    systemRoles.forEach((role) => {
      this.roles.set(role.id, {
        ...role,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: [],
        enabled: true,
      })
    })

    this.logger?.info('系统内置角色初始化完成')
  }

  // ============================================
  // 业务方法
  // ============================================

  /**
   * 创建角色
   */
  async createRole(data: {
    name: string
    code: string
    description?: string
    parentId?: string
    permissions?: string[]
    dataScope?: DataScopeType
  }): Promise<any> {
    const roleId = `role_${Date.now()}`

    const role = {
      id: roleId,
      name: data.name,
      code: data.code,
      type: RoleType.CUSTOM,
      description: data.description,
      parentId: data.parentId,
      permissions: data.permissions || [],
      dataScope: data.dataScope || DataScopeType.SELF,
      users: [],
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.roles.set(roleId, role)
    this.logger?.info(`角色创建: ${roleId} - ${data.name}`)

    await this._context?.eventBus.emit('role.created', { roleId, name: data.name })

    return role
  }

  /**
   * 更新角色
   */
  async updateRole(
    roleId: string,
    data: Partial<{
      name: string
      description: string
      permissions: string[]
      dataScope: DataScopeType
      enabled: boolean
    }>,
  ): Promise<any> {
    const role = this.roles.get(roleId)
    if (!role) {
      throw new Error(`角色不存在: ${roleId}`)
    }

    if (role.type === RoleType.SYSTEM) {
      throw new Error('系统内置角色不可修改')
    }

    Object.assign(role, data)
    role.updatedAt = new Date()

    this.logger?.info(`角色更新: ${roleId}`)
    await this._context?.eventBus.emit('role.updated', { roleId })

    return role
  }

  /**
   * 删除角色
   */
  async deleteRole(roleId: string): Promise<void> {
    const role = this.roles.get(roleId)
    if (!role) {
      throw new Error(`角色不存在: ${roleId}`)
    }

    if (role.type === RoleType.SYSTEM) {
      throw new Error('系统内置角色不可删除')
    }

    if (role.users.length > 0) {
      throw new Error('角色仍有用户关联，请先解除关联')
    }

    this.roles.delete(roleId)
    this.logger?.info(`角色删除: ${roleId}`)
    await this._context?.eventBus.emit('role.deleted', { roleId })
  }

  /**
   * 获取角色列表
   */
  async listRoles(filter?: { type?: RoleType; enabled?: boolean }): Promise<any[]> {
    let roles = Array.from(this.roles.values())

    if (filter?.type) {
      roles = roles.filter((r) => r.type === filter.type)
    }
    if (filter?.enabled !== undefined) {
      roles = roles.filter((r) => r.enabled === filter.enabled)
    }

    return roles
  }

  /**
   * 获取角色详情
   */
  async getRole(roleId: string): Promise<any> {
    return this.roles.get(roleId)
  }

  /**
   * 分配权限
   */
  async assignPermissions(roleId: string, permissions: string[]): Promise<any> {
    const role = this.roles.get(roleId)
    if (!role) {
      throw new Error(`角色不存在: ${roleId}`)
    }

    if (role.type === RoleType.SYSTEM) {
      throw new Error('系统内置角色权限不可修改')
    }

    role.permissions = permissions
    role.updatedAt = new Date()

    this.logger?.info(`角色权限分配: ${roleId} - ${permissions.length}个权限`)
    await this._context?.eventBus.emit('role.permissions.updated', { roleId, permissions })

    return role
  }

  /**
   * 设置数据范围
   */
  async setDataScope(
    roleId: string,
    dataScope: DataScopeType,
    customScope?: string[],
  ): Promise<any> {
    const role = this.roles.get(roleId)
    if (!role) {
      throw new Error(`角色不存在: ${roleId}`)
    }

    role.dataScope = dataScope
    if (dataScope === DataScopeType.CUSTOM && customScope) {
      role.customDataScope = customScope
    }
    role.updatedAt = new Date()

    this.logger?.info(`角色数据范围设置: ${roleId} - ${dataScope}`)
    await this._context?.eventBus.emit('role.dataScope.updated', { roleId, dataScope })

    return role
  }

  /**
   * 分配用户到角色
   */
  async assignUserToRole(roleId: string, userId: string): Promise<any> {
    const role = this.roles.get(roleId)
    if (!role) {
      throw new Error(`角色不存在: ${roleId}`)
    }

    // 添加到角色的用户列表
    if (!role.users.includes(userId)) {
      role.users.push(userId)
      role.updatedAt = new Date()
    }

    // 更新用户的角色列表
    const userRoleList = this.userRoles.get(userId) || []
    if (!userRoleList.includes(roleId)) {
      userRoleList.push(roleId)
      this.userRoles.set(userId, userRoleList)
    }

    this.logger?.info(`用户角色分配: ${userId} -> ${roleId}`)
    await this._context?.eventBus.emit('role.user.assigned', { roleId, userId })

    return role
  }

  /**
   * 移除用户角色
   */
  async removeUserFromRole(roleId: string, userId: string): Promise<any> {
    const role = this.roles.get(roleId)
    if (!role) {
      throw new Error(`角色不存在: ${roleId}`)
    }

    // 从角色的用户列表移除
    role.users = role.users.filter((uid: string) => uid !== userId)
    role.updatedAt = new Date()

    // 从用户的角色列表移除
    const userRoleList = this.userRoles.get(userId) || []
    this.userRoles.set(
      userId,
      userRoleList.filter((rid) => rid !== roleId),
    )

    this.logger?.info(`用户角色移除: ${userId} <- ${roleId}`)
    await this._context?.eventBus.emit('role.user.removed', { roleId, userId })

    return role
  }

  /**
   * 获取用户角色列表
   */
  async getUserRoles(userId: string): Promise<any[]> {
    const roleIds = this.userRoles.get(userId) || []
    return roleIds.map((rid) => this.roles.get(rid)).filter(Boolean)
  }

  /**
   * 检查用户权限
   */
  async checkUserPermission(userId: string, permission: string): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId)

    for (const role of userRoles) {
      // 检查通配符权限
      if (role.permissions.includes('*')) return true

      // 检查模块通配符
      const moduleWildcard = permission.split(':')[0] + ':*'
      if (role.permissions.includes(moduleWildcard)) return true

      // 检查精确权限
      if (role.permissions.includes(permission)) return true
    }

    return false
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'role:create',
        name: '创建角色',
        description: '创建新的角色',
        type: PermissionType.RESOURCE,
        resource: 'role',
        action: 'create',
      },
      {
        id: 'role:view',
        name: '查看角色',
        description: '查看角色列表和详情',
        type: PermissionType.RESOURCE,
        resource: 'role',
        action: 'view',
      },
      {
        id: 'role:edit',
        name: '编辑角色',
        description: '编辑角色信息',
        type: PermissionType.RESOURCE,
        resource: 'role',
        action: 'edit',
      },
      {
        id: 'role:delete',
        name: '删除角色',
        description: '删除角色',
        type: PermissionType.RESOURCE,
        resource: 'role',
        action: 'delete',
      },
      {
        id: 'role:assign-permission',
        name: '分配权限',
        description: '为角色分配权限',
        type: PermissionType.ACTION,
        resource: 'role',
        action: 'assign-permission',
      },
      {
        id: 'role:assign-user',
        name: '分配用户',
        description: '为用户分配角色',
        type: PermissionType.ACTION,
        resource: 'role',
        action: 'assign-user',
      },
      {
        id: 'role:set-data-scope',
        name: '设置数据范围',
        description: '设置角色的数据权限范围',
        type: PermissionType.ACTION,
        resource: 'role',
        action: 'set-data-scope',
      },
      {
        id: 'role:admin',
        name: '角色管理员',
        description: '角色模块管理权限',
        type: PermissionType.ADMIN,
        resource: 'role',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'role-management',
        title: '角色管理',
        path: '/settings/roles',
        icon: 'safety',
        permissions: ['role:view'],
        order: 2,
        parentId: 'settings',
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      {
        path: '/api/v1/roles',
        method: HttpMethod.POST,
        handler: 'createRole',
        description: '创建角色',
        permission: 'role:create',
      },
      {
        path: '/api/v1/roles',
        method: HttpMethod.GET,
        handler: 'listRoles',
        description: '获取角色列表',
        permission: 'role:view',
      },
      {
        path: '/api/v1/roles/:id',
        method: HttpMethod.GET,
        handler: 'getRole',
        description: '获取角色详情',
        permission: 'role:view',
      },
      {
        path: '/api/v1/roles/:id',
        method: HttpMethod.PUT,
        handler: 'updateRole',
        description: '更新角色',
        permission: 'role:edit',
      },
      {
        path: '/api/v1/roles/:id',
        method: HttpMethod.DELETE,
        handler: 'deleteRole',
        description: '删除角色',
        permission: 'role:delete',
      },
      {
        path: '/api/v1/roles/:id/permissions',
        method: HttpMethod.PUT,
        handler: 'assignPermissions',
        description: '分配权限',
        permission: 'role:assign-permission',
      },
      {
        path: '/api/v1/roles/:id/data-scope',
        method: HttpMethod.PUT,
        handler: 'setDataScope',
        description: '设置数据范围',
        permission: 'role:set-data-scope',
      },
      {
        path: '/api/v1/roles/:id/users',
        method: HttpMethod.POST,
        handler: 'assignUserToRole',
        description: '分配用户到角色',
        permission: 'role:assign-user',
      },
      {
        path: '/api/v1/roles/:id/users/:userId',
        method: HttpMethod.DELETE,
        handler: 'removeUserFromRole',
        description: '移除用户角色',
        permission: 'role:assign-user',
      },
      {
        path: '/api/v1/users/:userId/roles',
        method: HttpMethod.GET,
        handler: 'getUserRoles',
        description: '获取用户角色',
        permission: 'role:view',
      },
      {
        path: '/api/v1/users/:userId/permissions/:permission/check',
        method: HttpMethod.GET,
        handler: 'checkUserPermission',
        description: '检查用户权限',
        permission: 'role:view',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'role.created',
        type: EventType.BUSINESS_DATA,
        description: '角色创建事件',
      },
      {
        name: 'role.updated',
        type: EventType.BUSINESS_DATA,
        description: '角色更新事件',
      },
      {
        name: 'role.deleted',
        type: EventType.BUSINESS_DATA,
        description: '角色删除事件',
      },
      {
        name: 'role.permissions.updated',
        type: EventType.BUSINESS_DATA,
        description: '角色权限更新事件',
      },
      {
        name: 'role.dataScope.updated',
        type: EventType.BUSINESS_DATA,
        description: '角色数据范围更新事件',
      },
      {
        name: 'role.user.assigned',
        type: EventType.USER_ACTION,
        description: '用户角色分配事件',
      },
      {
        name: 'role.user.removed',
        type: EventType.USER_ACTION,
        description: '用户角色移除事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const ROLE_HOTPLUG_MODULE = {
  manifest: ROLE_MODULE_MANIFEST,
  moduleClass: RoleHotplugModule,
}
