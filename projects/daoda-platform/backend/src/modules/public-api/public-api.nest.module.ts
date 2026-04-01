/**
 * 公开 API NestJS 包装器
 * 集成热插拔模块和原生 NestJS Controller
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Module, Global } from '@nestjs/common'
import { PublicApiController } from './public-api.controller'
import { PublicApiHotplugModule, PUBLIC_API_HOTPLUG_MODULE } from './public-api.hotplug.module'
import { ApiKeyModule } from '../api-key/api-key.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [ApiKeyModule, PrismaModule],
  controllers: [PublicApiController],
  providers: [
    {
      provide: 'PUBLIC_API_HOTPLUG_MODULE',
      useValue: new PublicApiHotplugModule(),
    },
  ],
  exports: ['PUBLIC_API_HOTPLUG_MODULE'],
})
export class PublicApiNestModule {}
