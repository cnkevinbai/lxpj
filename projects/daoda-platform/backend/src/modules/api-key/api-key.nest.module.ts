/**
 * API Key NestJS 包装器
 * 集成热插拔模块和原生 NestJS Service
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Module, Global } from '@nestjs/common'
import { ApiKeyService } from './api-key.service'
import { ApiKeyController } from './api-key.controller'
import { ApiKeyHotplugModule, API_KEY_HOTPLUG_MODULE } from './api-key.hotplug.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [ApiKeyController],
  providers: [
    ApiKeyService,
    {
      provide: 'API_KEY_HOTPLUG_MODULE',
      useValue: new ApiKeyHotplugModule(),
    },
  ],
  exports: [ApiKeyService, 'API_KEY_HOTPLUG_MODULE'],
})
export class ApiKeyNestModule {}
