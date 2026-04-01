/**
 * 公开 API 模块
 * 官网数据对接
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module } from '@nestjs/common'
import { PublicApiController } from './public-api.controller'
import { ApiKeyModule } from '../api-key/api-key.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Module({
  imports: [ApiKeyModule, PrismaModule],
  controllers: [PublicApiController],
  exports: [],
})
export class PublicApiModule {}
