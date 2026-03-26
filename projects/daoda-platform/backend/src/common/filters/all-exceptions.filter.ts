import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let code = 50000
    let errors: any[] = []

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()

      if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any
        message = resp.message || message
        errors = Array.isArray(resp.message) ? resp.message : []
      } else {
        message = exceptionResponse as string
      }

      // 错误码映射
      const codeMap: Record<number, number> = {
        400: 40000,
        401: 40100,
        403: 40300,
        404: 40400,
        409: 40900,
        422: 42200,
        500: 50000,
      }
      code = codeMap[status] || 50000
    }

    const errorResponse = {
      code,
      message,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
      requestId: request.headers['x-request-id'] || this.generateRequestId(),
      path: request.url,
    }

    response.status(status).json(errorResponse)
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
