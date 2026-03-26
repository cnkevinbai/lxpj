import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { OrdersService } from '../services/orders.service'

@ApiTags('订单管理')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  getOrders(@Query() params: any) {
    return this.ordersService.getOrders(params)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取订单统计' })
  getStatistics() {
    return this.ordersService.getStatistics()
  }

  @Post()
  @ApiOperation({ summary: '创建订单' })
  createOrder(@Body() data: any, @Request() req: any) {
    const userId = req.user?.id || 'system'
    return this.ordersService.createOrder(data, userId)
  }

  @Post(':id/status')
  @ApiOperation({ summary: '更新订单状态' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status)
  }
}
