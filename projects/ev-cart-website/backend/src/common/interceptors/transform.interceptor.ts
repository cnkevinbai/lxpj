/**
 * 响应转换拦截器 - 统一响应格式
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  success: boolean
  message: string
  data: T
  timestamp: number
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const response: Response<T> = {
          success: true,
          message: '操作成功',
          data: data,
          timestamp: Date.now(),
        }

        // 如果已经是标准响应格式，直接返回
        if (data && typeof data === 'object' && 'success' in data) {
          return data
        }

        // 处理分页数据
        if (data && typeof data === 'object' && 'data' in data && 'total' in data) {
          return {
            success: true,
            message: '查询成功',
            data: data.data,
            total: data.total,
            page: data.page,
            limit: data.limit,
            timestamp: Date.now(),
          }
        }

        return response
      }),
    )
  }
}
