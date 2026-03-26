import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RemoteSupportService } from './remote-support.service';

@ApiTags('远程指导')
@Controller('service/remote/support')
export class RemoteSupportController {
  constructor(private readonly service: RemoteSupportService) {}

  @Post()
  @ApiOperation({ summary: '创建远程指导会话' })
  @ApiResponse({ status: 201, description: '会话创建成功' })
  create(@Body() data: { ticketId: string; engineerId: string }) {
    return this.service.create(data.ticketId, data.engineerId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取远程指导详情' })
  @ApiResponse({ status: 200, description: '详情获取成功' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: '获取消息历史' })
  @ApiResponse({ status: 200, description: '消息获取成功' })
  getMessages(@Param('id') id: string) {
    return this.service.getMessages(id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: '发送消息' })
  @ApiResponse({ status: 201, description: '消息发送成功' })
  sendMessage(@Param('id') id: string, @Body() data: any) {
    return this.service.sendMessage(id, data);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: '完成远程指导' })
  @ApiResponse({ status: 200, description: '完成成功' })
  complete(@Param('id') id: string, @Body() data: any) {
    return this.service.complete(id, data);
  }
}
