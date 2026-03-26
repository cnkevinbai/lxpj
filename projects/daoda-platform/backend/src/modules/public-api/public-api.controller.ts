/**
 * 公开 API 控制器
 * 使用 API Key 认证守卫保护
 */
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger'
import { ApiKeyGuard } from '../../common/guards/api-key.guard'

@ApiTags('Public API')
@UseGuards(ApiKeyGuard)
@ApiHeader({
  name: 'x-api-key',
  required: true,
  description: 'API Key',
  schema: { type: 'string', example: 'dk_abc123...' },
})
@Controller('api/v1/public')
export class PublicApiController {
  @Get('health')
  @ApiOperation({ summary: '健康检查' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Daoda Platform',
    }
  }

  @Get('info')
  @ApiOperation({ summary: '获取平台信息' })
  getInfo() {
    return {
      name: 'Daoda Platform',
      version: '1.0.0',
      description: '智能数字化平台开放 API',
    }
  }
}
