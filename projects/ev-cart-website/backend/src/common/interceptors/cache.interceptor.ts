/**
 * 缓存拦截器 - 提升响应速度
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { RedisService } from '../../redis/redis.service'

export interface CacheOptions {
  ttl: number // 缓存时间 (秒)
  key: string // 缓存键
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private redisService: RedisService,
    private options: CacheOptions,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    // 生成缓存键
    const cacheKey = this.generateCacheKey(request, this.options.key)

    // 尝试从缓存读取
    try {
      const cached = await this.redisService.get(cacheKey)
      if (cached) {
        response.header('X-Cache', 'HIT')
        return of(JSON.parse(cached))
      }
    } catch (error) {
      console.error('Cache read error:', error)
    }

    // 执行请求并缓存结果
    response.header('X-Cache', 'MISS')
    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.redisService.set(
            cacheKey,
            JSON.stringify(data),
            this.options.ttl,
          )
        } catch (error) {
          console.error('Cache write error:', error)
        }
      }),
      catchError((error) => {
        console.error('Request error:', error)
        throw error
      }),
    )
  }

  private generateCacheKey(request: any, prefix: string): string {
    const method = request.method
    const path = request.url
    const query = JSON.stringify(request.query)
    return `${prefix}:${method}:${path}:${query}`
  }
}

/**
 * 创建缓存装饰器
 */
export function UseCache(options: CacheOptions) {
  return function (
    target: any,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const ctx = args[0] // ExecutionContext
      const cacheInterceptor = new CacheInterceptor(
        this.redisService,
        options,
      )
      return cacheInterceptor.intercept(ctx, {
        handle: () => originalMethod.apply(this, args),
      })
    }
    return descriptor
  }
}
