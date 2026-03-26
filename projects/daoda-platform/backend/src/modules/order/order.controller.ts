/**
 * 订单控制器
 */
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { OrderService } from './order.service'
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from './order.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('订单管理')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: '创建订单' })
  async create(@Body() dto: CreateOrderDto, @Request() req: any) {
    return this.orderService.create(dto, req.user?.sub)
  }

  @Get()
  @ApiOperation({ summary: '获取订单列表' })
  async findAll(@Query() query: OrderQueryDto) {
    return this.orderService.findAll(query)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取订单统计' })
  async getStatistics() {
    return this.orderService.getStats()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取订单详情' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新订单' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto)
  }
}