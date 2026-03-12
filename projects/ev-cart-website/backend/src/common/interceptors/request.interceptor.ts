/**
 * 请求拦截器 - 统一处理
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

export interface Response<T> {
  success: boolean
  message: string
  data: T
  timestamp: number
}

@Injectable()
export class RequestInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest()
    const now = Date.now()

    // 记录请求日志
    console.log(
      `[Request] ${request.method} ${request.url}`,
      `IP: ${request.ip}`,
      `User: ${request.user?.username || 'anonymous'}`,
    )

    // 验证请求数据
    if (request.method === 'POST' || request.method === 'PUT') {
      const body = request.body
      if (!body || Object.keys(body).length === 0) {
        throw new BadRequestException('请求数据不能为空')
      }
    }

    return next.handle().pipe(
      tap((data) => {
        // 记录响应日志
        console.log(
          `[Response] ${request.method} ${request.url}`,
          `Status: 200`,
          `Duration: ${Date.now() - now}ms`,
        )
      }),
    )
  }
}
