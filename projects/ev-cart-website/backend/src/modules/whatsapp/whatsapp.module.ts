import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WhatsAppService } from './whatsapp.service'
import { WhatsAppController } from './whatsapp.controller'

@Module({
  imports: [ConfigModule],
  providers: [WhatsAppService],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
