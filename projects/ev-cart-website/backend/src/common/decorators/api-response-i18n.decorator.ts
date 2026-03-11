import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger'

/**
 * 国际化 API 响应装饰器
 * 自动生成多语言响应文档
 */
export function ApiI18nResponse<T extends Type<any>>(options: {
  type?: T
  summary?: string
  description?: string
  isArray?: boolean
}) {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.summary || '成功',
      schema: options.type ? {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              data: options.isArray 
                ? { type: 'array', items: { $ref: `#/components/schemas/${options.type.name}` } }
                : { $ref: `#/components/schemas/${options.type.name}` },
              message: { type: 'string', example: '成功' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        ],
      } : undefined,
    }),
    ApiBadRequestResponse({
      description: '请求参数无效',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: '请求参数无效' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: '未授权访问',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: '未授权访问' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: '访问被禁止',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            properties: {
              code: { type: 'string', example: 'FORBIDDEN' },
              message: { type: 'string', example: '访问被禁止' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: '资源不存在',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string', example: '资源不存在' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: '服务器内部错误',
      schema: {
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            properties: {
              code: { type: 'string', example: 'INTERNAL_ERROR' },
              message: { type: 'string', example: '服务器内部错误' },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    }),
  )
}
