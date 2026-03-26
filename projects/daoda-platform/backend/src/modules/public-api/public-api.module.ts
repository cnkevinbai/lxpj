/**
 * 公开 API 模块
 */
import { Module } from '@nestjs/common'
import { PublicApiController } from './public-api.controller'
import { ApiKeyModule } from '../api-key/api-key.module'

@Module({
  imports: [ApiKeyModule],
  controllers: [PublicApiController],
})
export class PublicApiModule {}
