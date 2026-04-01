/**
 * User 用户管理模块
 * 热插拔核心模块 - 提供用户 CRUD 操作
 *
 * 功能范围:
 * - 用户创建/编辑/删除
 * - 用户列表查询 (分页/筛选/搜索)
 * - 用户详情获取
 * - 用户状态管理 (激活/禁用/锁定)
 * - 用户角色分配
 * - 用户头像上传
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
// 模块清单定义
// ============================================

export const USER_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/user',
  name: '用户管理',
  version: '1.0.0',
  description: '用户管理核心模块，提供用户CRUD、状态管理、角色分配',
  category: 'core',
  tags: ['user', 'management', 'admin'],
  dependencies: [{ id: '@daoda/auth', version: '>=1.0.0' }],
  permissions: [
    'user:create',
    'user:view',
    'user:edit',
    'user:delete',
    'user:assign-role',
    'user:manage-status',
    'user:upload-avatar',
    'user:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
  builtin: true,
  system: true,
}

// ============================================
// User 模块实现
// ============================================

export class UserHotplugModule extends BaseModule {
  readonly manifest = USER_MODULE_MANIFEST

  protected _context: ModuleContext | null = null

  // 用户数据存储 (模拟)
  private users: Map<string, any> = new Map()

  // ============================================
  // 生命周期方法
  // ============================================

  async initialize(context: ModuleContext): Promise<void> {
    this._context = context

    await context.config.setModuleConfigs(this.manifest.id, {
      defaultPageSize: 20,
      maxPageSize: 100,
      avatarMaxSize: 2 * 1024 * 1024, // 2MB
      avatarAllowedTypes: ['jpg', 'jpeg', 'png', 'webp'],
      passwordResetExpireHours: 24,
    })

    this.logger?.info('用户管理模块初始化完成')
  }

  async onDestroy(): Promise<void> {
    this.users.clear()
    this.logger?.info('用户管理模块已销毁')
  }

  // ============================================
  // 业务方法 (模拟)
  // ============================================

  /**
   * 创建用户
   */
  async create(data: {
    email: string
    phone?: string
    password: string
    name: string
    roleId?: string
    avatar?: string
  }): Promise<any> {
    const userId = `user_${Date.now()}`
    const user = {
      id: userId,
      ...data,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.set(userId, user)
    this.logger?.info(`用户创建: ${userId} - ${data.email}`)

    // 发布事件
    await this._context?.eventBus.emit('user.created', { userId, email: data.email })

    return user
  }

  /**
   * 更新用户
   */
  async update(
    userId: string,
    data: Partial<{
      name: string
      phone: string
      avatar: string
      roleId: string
      status: string
    }>,
  ): Promise<any> {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error(`用户不存在: ${userId}`)
    }

    Object.assign(user, data)
    user.updatedAt = new Date()

    this.logger?.info(`用户更新: ${userId}`)
    await this._context?.eventBus.emit('user.updated', { userId })

    return user
  }

  /**
   * 删除用户
   */
  async delete(userId: string): Promise<void> {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error(`用户不存在: ${userId}`)
    }

    this.users.delete(userId)
    this.logger?.info(`用户删除: ${userId}`)
    await this._context?.eventBus.emit('user.deleted', { userId })
  }

  /**
   * 获取用户列表
   */
  async findAll(query: {
    page?: number
    pageSize?: number
    keyword?: string
    roleId?: string
    status?: string
  }): Promise<{
    list: any[]
    total: number
    page: number
    pageSize: number
  }> {
    let users = Array.from(this.users.values())

    // 筛选
    if (query.keyword) {
      users = users.filter(
        (u) => u.name.includes(query.keyword!) || u.email.includes(query.keyword!),
      )
    }
    if (query.roleId) {
      users = users.filter((u) => u.roleId === query.roleId)
    }
    if (query.status) {
      users = users.filter((u) => u.status === query.status)
    }

    // 分页
    const page = query.page || 1
    const pageSize = query.pageSize || 20
    const start = (page - 1) * pageSize
    const list = users.slice(start, start + pageSize)

    return {
      list,
      total: users.length,
      page,
      pageSize,
    }
  }

  /**
   * 获取用户详情
   */
  async findOne(userId: string): Promise<any> {
    return this.users.get(userId)
  }

  /**
   * 修改用户状态
   */
  async changeStatus(userId: string, status: 'ACTIVE' | 'INACTIVE' | 'LOCKED'): Promise<any> {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error(`用户不存在: ${userId}`)
    }

    user.status = status
    user.updatedAt = new Date()

    this.logger?.info(`用户状态变更: ${userId} -> ${status}`)
    await this._context?.eventBus.emit('user.status.changed', { userId, status })

    return user
  }

  /**
   * 分配角色
   */
  async assignRole(userId: string, roleId: string): Promise<any> {
    const user = this.users.get(userId)
    if (!user) {
      throw new Error(`用户不存在: ${userId}`)
    }

    user.roleId = roleId
    user.updatedAt = new Date()

    this.logger?.info(`用户角色分配: ${userId} -> ${roleId}`)
    await this._context?.eventBus.emit('user.role.assigned', { userId, roleId })

    return user
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'user:create',
        name: '创建用户',
        description: '创建新用户账号',
        type: PermissionType.RESOURCE,
        resource: 'user',
        action: 'create',
      },
      {
        id: 'user:view',
        name: '查看用户',
        description: '查看用户列表和详情',
        type: PermissionType.RESOURCE,
        resource: 'user',
        action: 'view',
      },
      {
        id: 'user:edit',
        name: '编辑用户',
        description: '编辑用户基本信息',
        type: PermissionType.RESOURCE,
        resource: 'user',
        action: 'edit',
      },
      {
        id: 'user:delete',
        name: '删除用户',
        description: '删除用户账号',
        type: PermissionType.RESOURCE,
        resource: 'user',
        action: 'delete',
      },
      {
        id: 'user:assign-role',
        name: '分配角色',
        description: '为用户分配角色',
        type: PermissionType.ACTION,
        resource: 'user',
        action: 'assign-role',
      },
      {
        id: 'user:manage-status',
        name: '管理状态',
        description: '激活/禁用/锁定用户',
        type: PermissionType.ACTION,
        resource: 'user',
        action: 'manage-status',
      },
      {
        id: 'user:upload-avatar',
        name: '上传头像',
        description: '上传用户头像',
        type: PermissionType.ACTION,
        resource: 'user',
        action: 'upload-avatar',
      },
      {
        id: 'user:admin',
        name: '用户管理员',
        description: '用户模块管理权限',
        type: PermissionType.ADMIN,
        resource: 'user',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'user-management',
        title: '用户管理',
        path: '/settings/users',
        icon: 'user',
        permissions: ['user:view'],
        order: 1,
        parentId: 'settings',
      },
    ]
  }

  getRoutes(): ModuleRoute[] {
    return [
      {
        path: '/api/v1/users',
        method: HttpMethod.POST,
        handler: 'create',
        description: '创建用户',
        permission: 'user:create',
      },
      {
        path: '/api/v1/users',
        method: HttpMethod.GET,
        handler: 'findAll',
        description: '获取用户列表',
        permission: 'user:view',
      },
      {
        path: '/api/v1/users/:id',
        method: HttpMethod.GET,
        handler: 'findOne',
        description: '获取用户详情',
        permission: 'user:view',
      },
      {
        path: '/api/v1/users/:id',
        method: HttpMethod.PUT,
        handler: 'update',
        description: '更新用户',
        permission: 'user:edit',
      },
      {
        path: '/api/v1/users/:id',
        method: HttpMethod.DELETE,
        handler: 'delete',
        description: '删除用户',
        permission: 'user:delete',
      },
      {
        path: '/api/v1/users/:id/status',
        method: HttpMethod.PUT,
        handler: 'changeStatus',
        description: '修改用户状态',
        permission: 'user:manage-status',
      },
      {
        path: '/api/v1/users/:id/role',
        method: HttpMethod.PUT,
        handler: 'assignRole',
        description: '分配用户角色',
        permission: 'user:assign-role',
      },
      {
        path: '/api/v1/users/:id/avatar',
        method: HttpMethod.POST,
        handler: 'uploadAvatar',
        description: '上传用户头像',
        permission: 'user:upload-avatar',
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'user.created',
        type: EventType.BUSINESS_DATA,
        description: '用户创建事件',
      },
      {
        name: 'user.updated',
        type: EventType.BUSINESS_DATA,
        description: '用户信息更新事件',
      },
      {
        name: 'user.deleted',
        type: EventType.BUSINESS_DATA,
        description: '用户删除事件',
      },
      {
        name: 'user.status.changed',
        type: EventType.USER_ACTION,
        description: '用户状态变更事件',
      },
      {
        name: 'user.role.assigned',
        type: EventType.USER_ACTION,
        description: '用户角色分配事件',
      },
      {
        name: 'user.avatar.uploaded',
        type: EventType.USER_ACTION,
        description: '用户头像上传事件',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export const USER_HOTPLUG_MODULE = {
  manifest: USER_MODULE_MANIFEST,
  moduleClass: UserHotplugModule,
}
