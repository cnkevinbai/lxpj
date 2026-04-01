/**
 * @Public() 装饰器
 * 标记不需要认证的公开路由
 */
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

/**
 * 标记路由为公开访问，无需 JWT 认证
 * @example
 * @Public()
 * @Get('public-endpoint')
 * getPublicData() {}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
