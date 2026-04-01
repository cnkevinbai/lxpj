/**
 * 权限守卫
 * 基于用户权限进行细粒度访问控制
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'

/**
 * 权限守卫
 * 配合 @Permissions() 装饰器使用，限制只有拥有特定权限的用户才能访问
 *
 * @example
 * @Permissions('crm:customer:view')
 * @UseGuards(JwtAuthGuard, PermissionsGuard)
 * @Get('customers')
 * getCustomers() {}
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取所需权限列表
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // 如果没有设置权限要求，允许访问
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    // 获取请求中的用户信息（由 JwtAuthGuard 注入）
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('未登录，请先登录')
    }

    // 获取用户权限列表
    const userPermissions = user.permissions || []

    // 检查用户是否拥有所有所需权限
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    )

    if (!hasAllPermissions) {
      const missingPermissions = requiredPermissions.filter(
        (permission) => !userPermissions.includes(permission),
      )
      throw new ForbiddenException(`缺少权限: ${missingPermissions.join(', ')}`)
    }

    return true
  }
}
