import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { MessageService } from './services/message.service'

@ApiTags('消息中心')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: '获取消息列表' })
  getMessages(@Query() params: any) {
    return this.messageService.getMessages(params)
  }

  @Post(':id/read')
  @ApiOperation({ summary: '标记为已读' })
  markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(id)
  }

  @Post('read-all')
  @ApiOperation({ summary: '全部标记已读' })
  markAllAsRead() {
    return this.messageService.markAllAsRead()
  }

  @Post(':id/delete')
  @ApiOperation({ summary: '删除消息' })
  deleteMessage(@Param('id') id: string) {
    return this.messageService.deleteMessage(id)
  }
}
