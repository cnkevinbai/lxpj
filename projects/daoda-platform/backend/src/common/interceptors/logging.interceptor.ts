// 复用 LoggingInterceptor 的功能
// 记录请求和响应日志
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const now = Date.now()

    const userAgent = request.headers['user-agent'] || ''
    const method = request.method
    const url = request.url

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now
        console.log(
          `[${method}] ${url} ${response.statusCode} ${userAgent} ${duration}ms`,
        )
      }),
    )
  }
}
