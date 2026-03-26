import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailServiceService } from './mail-service.service';

@ApiTags('邮寄服务')
@Controller('service/mail')
export class MailServiceController {
  constructor(private readonly service: MailServiceService) {}

  @Post()
  @ApiOperation({ summary: '创建邮寄单' })
  @ApiResponse({ status: 201, description: '邮寄单创建成功' })
  create(@Body() data: { ticketId: string; parts: any[] }) {
    return this.service.create(data.ticketId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取邮寄单详情' })
  @ApiResponse({ status: 200, description: '邮寄单详情获取成功' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get('ticket/:ticketId')
  @ApiOperation({ summary: '根据工单 ID 获取邮寄单' })
  @ApiResponse({ status: 200, description: '邮寄单获取成功' })
  findByTicketId(@Param('ticketId') ticketId: string) {
    return this.service.findByTicketId(ticketId);
  }

  @Post(':id/ship')
  @ApiOperation({ summary: '确认发货' })
  @ApiResponse({ status: 200, description: '发货成功' })
  ship(@Param('id') id: string, @Body() data: {
    courierCompany: string;
    trackingNumber: string;
    shippingCost: number;
  }) {
    return this.service.ship(id, data);
  }

  @Post(':id/confirm-delivery')
  @ApiOperation({ summary: '确认收货' })
  @ApiResponse({ status: 200, description: '收货确认成功' })
  confirmDelivery(@Param('id') id: string) {
    return this.service.confirmDelivery(id);
  }
}
