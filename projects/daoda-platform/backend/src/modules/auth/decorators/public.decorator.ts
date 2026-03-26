/**
 * 公开接口装饰器
 * 标记不需要认证的公开接口
 */
import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

/**
 * @Public() 装饰器
 * 标记接口为公开访问，无需 JWT 认证
 * 
 * @example
 * @Public()
 * @Get('public-data')
 * getPublicData() {}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)