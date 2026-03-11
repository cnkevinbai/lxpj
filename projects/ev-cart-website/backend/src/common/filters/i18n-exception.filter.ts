import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { I18nService } from 'nestjs-i18n'

/**
 * 国际化异常过滤器
 * 根据请求语言返回对应的错误消息
 */
@Catch()
export class I18nExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18nService: I18nService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // 获取请求语言
    const lang = request.headers['accept-language']?.split(',')[0] || 'zh-CN'

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // 国际化错误消息
    const message = this.getI18nMessage(exception, lang)

    response.status(status).json({
      success: false,
      error: {
        code: this.getErrorCode(status),
        message,
        details: exception instanceof HttpException ? exception.message : undefined,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }

  /**
   * 获取国际化错误消息
   */
  private getI18nMessage(exception: unknown, lang: string): string {
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          return lang === 'en' ? 'Invalid request parameters' : lang === 'zh-TW' ? '請求參數無效' : '请求参数无效'
        case HttpStatus.UNAUTHORIZED:
          return lang === 'en' ? 'Unauthorized access' : lang === 'zh-TW' ? '未授權訪問' : '未授权访问'
        case HttpStatus.FORBIDDEN:
          return lang === 'en' ? 'Access forbidden' : lang === 'zh-TW' ? '訪問被禁止' : '访问被禁止'
        case HttpStatus.NOT_FOUND:
          return lang === 'en' ? 'Resource not found' : lang === 'zh-TW' ? '資源不存在' : '资源不存在'
        case HttpStatus.CONFLICT:
          return lang === 'en' ? 'Resource conflict' : lang === 'zh-TW' ? '資源衝突' : '资源冲突'
        default:
          return lang === 'en' ? 'Internal server error' : lang === 'zh-TW' ? '服務器內部錯誤' : '服务器内部错误'
      }
    }
    return lang === 'en' ? 'Internal server error' : lang === 'zh-TW' ? '服務器內部錯誤' : '服务器内部错误'
  }

  /**
   * 获取错误码
   */
  private getErrorCode(status: number): string {
    const errorCodes: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_ERROR',
    }
    return errorCodes[status] || 'UNKNOWN_ERROR'
  }
}
