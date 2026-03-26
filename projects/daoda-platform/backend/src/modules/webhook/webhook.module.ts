import { Module } from '@nestjs/common'
import { WebhookController } from './webhook.controller'
import { WebhookService } from './webhook.service'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports: [WebhookService],
})
export class WebhookModule {}
