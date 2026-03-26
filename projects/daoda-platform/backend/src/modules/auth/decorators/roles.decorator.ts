/**
 * 角色装饰器
 * 用于标记接口所需的角色权限
 */
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

/**
 * @Roles() 装饰器
 * 标记访问接口所需的角色列表（角色编码）
 * 需要配合 RolesGuard 使用
 * 
 * @example
 * @Roles('admin')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('admin-only')
 * adminOnly() {}
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
