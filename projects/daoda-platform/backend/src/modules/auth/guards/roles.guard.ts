/**
 * 角色守卫
 * 基于用户角色进行访问控制
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'

/**
 * 角色守卫
 * 配合 @Roles() 装饰器使用，限制只有特定角色才能访问
 * 
 * @example
 * @Roles('admin')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('admin-only')
 * adminOnly() {}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取所需角色列表
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // 如果没有设置角色要求，允许访问
    if (!requiredRoles) {
      return true
    }

    // 获取请求中的用户信息（由 JwtAuthGuard 注入）
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('未登录')
    }

    // 检查用户角色是否满足要求
    const hasRole = requiredRoles.some((role) => user.role === role)

    if (!hasRole) {
      throw new ForbiddenException('权限不足')
    }

    return true
  }
}