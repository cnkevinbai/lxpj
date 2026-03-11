import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AiChatService } from './ai-chat.service'

@ApiTags('ai-chat')
@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('message')
  @ApiOperation({ summary: '发送消息获取回复' })
  async sendMessage(@Body('message') message: string) {
    const reply = await this.aiChatService.getReply(message)
    return { message, reply, timestamp: new Date().toISOString() }
  }

  @Get('suggestions')
  @ApiOperation({ summary: '获取推荐问题' })
  getSuggestions() {
    return { suggestions: this.aiChatService.getSuggestedQuestions() }
  }
}
