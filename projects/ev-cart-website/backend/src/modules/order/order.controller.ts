import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { OrderService } from './services/order.service'
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto'

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20, @Query('status') status?: string) {
    return this.orderService.findAll(page, limit, status)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取订单统计' })
  getStatistics() {
    return this.orderService.getStatistics()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新订单' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除订单' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(id)
  }
}
