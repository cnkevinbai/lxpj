import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService, CreateOrderDto } from './order.service';

@ApiTags('订单管理')
@ApiBearerAuth()
@Controller('crm/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  @ApiResponse({ status: 200, description: '订单列表获取成功' })
  findAll(@Query() params: any) {
    return this.orderService.findAll(params);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取订单统计' })
  @ApiResponse({ status: 200, description: '统计获取成功' })
  getStatistics(@Query() params: any) {
    return this.orderService.getStatistics(params);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  @ApiResponse({ status: 200, description: '订单详情获取成功' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建订单' })
  @ApiResponse({ status: 201, description: '订单创建成功' })
  create(@Body() data: CreateOrderDto) {
    return this.orderService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新订单' })
  @ApiResponse({ status: 200, description: '订单更新成功' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.orderService.update(id, data);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: '确认订单' })
  @ApiResponse({ status: 200, description: '订单确认成功' })
  confirm(@Param('id') id: string) {
    return this.orderService.confirm(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '取消订单' })
  @ApiResponse({ status: 200, description: '订单取消成功' })
  cancel(@Param('id') id: string, @Body() data: { reason?: string }) {
    return this.orderService.cancel(id, data.reason);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除订单' })
  @ApiResponse({ status: 200, description: '订单删除成功' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
