import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AiChatService } from './services/ai-chat.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('ai-chat')
@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('message')
  @ApiOperation({ summary: '发送消息获取回复' })
  async sendMessage(
    @Body('message') message: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'anonymous'
    const reply = await this.aiChatService.getReply(message, userId)
    return { message, reply, timestamp: new Date().toISOString() }
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取聊天历史' })
  getChatHistory(@Request() req: any, @Query('limit') limit: number = 50) {
    return this.aiChatService.getChatHistory(req.user.id, limit)
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '转人工客服' })
  async transferToHuman(@Request() req: any, @Body('reason') reason: string) {
    return this.aiChatService.transferToHuman(req.user.id, reason)
  }

  @Post('feedback')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '提交满意度评价' })
  async submitFeedback(
    @Request() req: any,
    @Body('rating') rating: number,
    @Body('comment') comment?: string,
  ) {
    await this.aiChatService.submitFeedback(req.user.id, rating, comment)
    return { success: true, message: '感谢您的评价！' }
  }

  @Get('suggestions')
  @ApiOperation({ summary: '获取推荐问题' })
  getSuggestions() {
    return { suggestions: this.aiChatService.getSuggestedQuestions() }
  }
}
