import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatMessage } from './entities/chat-message.entity'
import { AiChatService } from './ai-chat.service'
import { AiChatController } from './ai-chat.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  controllers: [AiChatController],
  providers: [AiChatService],
  exports: [AiChatService],
})
export class AiChatModule {}
