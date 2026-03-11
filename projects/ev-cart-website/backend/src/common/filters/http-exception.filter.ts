import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import logger from '../lib/logger'

/**
 * HTTP 异常过滤器
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error'

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: exception instanceof HttpException ? exception.getName() : 'Internal Server Error',
    }

    logger.error(`[${request.method}] ${request.url}`, {
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    })

    response.status(status).json(errorResponse)
  }
}
