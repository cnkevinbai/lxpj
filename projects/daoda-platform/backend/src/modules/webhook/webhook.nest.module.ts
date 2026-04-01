/**
 * Webhook NestJS 包装器
 * 集成热插拔模块和原生 NestJS Service
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Module, Global } from '@nestjs/common'
import { WebhookService } from './webhook.service'
import { WebhookController } from './webhook.controller'
import { WebhookHotplugModule, WEBHOOK_HOTPLUG_MODULE } from './webhook.hotplug.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    {
      provide: 'WEBHOOK_HOTPLUG_MODULE',
      useValue: new WebhookHotplugModule(),
    },
  ],
  exports: [WebhookService, 'WEBHOOK_HOTPLUG_MODULE'],
})
export class WebhookNestModule {}
