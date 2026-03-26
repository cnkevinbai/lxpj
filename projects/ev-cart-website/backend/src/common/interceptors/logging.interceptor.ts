import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import logger from '../../lib/logger'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, ip } = request
    const start = Date.now()

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start
        logger.info(`[${method}] ${url}`, {
          duration: `${duration}ms`,
          ip,
        })
      }),
    )
  }
}
