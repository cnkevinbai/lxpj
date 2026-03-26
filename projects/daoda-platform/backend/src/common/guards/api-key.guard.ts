/**
 * API Key 认证守卫
 * 用于保护公开 API 端点
 */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { ApiKeyService } from '../../modules/api-key/api-key.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    // 从 Header 获取 API Key
    const apiKey = request.headers['x-api-key']

    if (!apiKey) {
      throw new UnauthorizedException('API Key is required')
    }

    // 验证 API Key
    const keyInfo = await this.apiKeyService.validateKey(apiKey)

    if (!keyInfo || !keyInfo.enabled) {
      throw new UnauthorizedException('Invalid API Key')
    }

    // 检查频率限制
    const allowed = await this.apiKeyService.checkRateLimit(apiKey)

    if (!allowed) {
      throw new UnauthorizedException('Rate limit exceeded')
    }

    // 设置租户信息
    request.tenantId = keyInfo.tenantId
    request.apiKey = keyInfo

    return true
  }
}
