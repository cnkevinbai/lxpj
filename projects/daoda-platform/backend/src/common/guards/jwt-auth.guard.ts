/**
 * JWT 认证守卫
 * 保护需要认证的路由
 */
import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

/**
 * JWT 认证守卫
 * 继承 Passport 的默认认证守卫，支持 @Public() 装饰器跳过认证
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  /**
   * 判断请求是否需要认证
   * 如果控制器或方法标记了 @Public() 装饰器，则跳过认证
   */
  canActivate(context: ExecutionContext) {
    // 检查是否有 @Public() 装饰器
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    // 执行 JWT 认证
    return super.canActivate(context)
  }
}
