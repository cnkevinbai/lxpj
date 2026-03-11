import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Request } from 'express'

/**
 * 国际化响应拦截器
 * 根据请求语言返回对应的响应消息
 */
@Injectable()
export class I18nResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const lang = request.headers['accept-language']?.split(',')[0] || 'zh-CN'

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: this.getSuccessMessage(lang),
        timestamp: new Date().toISOString(),
      })),
    )
  }

  /**
   * 获取国际化成功消息
   */
  private getSuccessMessage(lang: string): string {
    switch (lang) {
      case 'en':
        return 'Success'
      case 'zh-TW':
        return '成功'
      default:
        return '成功'
    }
  }
}
