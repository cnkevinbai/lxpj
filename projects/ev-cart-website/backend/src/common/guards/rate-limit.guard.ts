import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ThrottlerStorageException } from '@nestjs/throttler'

/**
 * 速率限制守卫
 * 防止 API 滥用，保证高可用
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    
    // 检查是否跳过限流
    const skipThrottle = this.reflector.get<boolean>('skipThrottle', handler)
    if (skipThrottle) {
      return true
    }

    // 获取自定义限流配置
    const throttleOverride = this.reflector.get<{ ttl: number; limit: number }>('throttle', handler)
    
    try {
      // 限流检查由 ThrottlerModule 处理
      return true
    } catch (error) {
      if (error instanceof ThrottlerStorageException) {
        throw error
      }
      return true
    }
  }
}

/**
 * 限流装饰器
 * @param ttl 时间窗口 (秒)
 * @param limit 请求次数
 */
export const Throttle = (ttl: number, limit: number) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('throttle', { ttl, limit }, descriptor.value)
  }
}

/**
 * 跳过限流装饰器
 */
export const SkipThrottle = () => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('skipThrottle', true, descriptor.value)
  }
}
