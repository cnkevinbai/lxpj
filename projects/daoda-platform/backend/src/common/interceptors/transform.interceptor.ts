import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request } from 'express'

export interface Response<T> {
  code: number
  message: string
  data: T
  timestamp: string
  requestId: string
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>()
    const requestId = (request.headers['x-request-id'] as string) || this.generateRequestId()

    return next.handle().pipe(
      map((data) => ({
        code: 0,
        message: 'success',
        data,
        timestamp: new Date().toISOString(),
        requestId,
      })),
    )
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
