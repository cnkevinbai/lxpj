import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProductionService } from './production.service'

@ApiTags('production')
@Controller('api/v1/production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  // ==================== 生产工单 ====================

  @Post('orders')
  @ApiOperation({ summary: '创建生产工单' })
  async createOrder(@Body() dto: any) {
    return this.productionService.createOrder(dto)
  }

  @Get('orders')
  @ApiOperation({ summary: '生产工单列表' })
  async getOrders(@Query('status') status?: string) {
    return this.productionService.getOrders(status)
  }

  @Get('orders/:id')
  @ApiOperation({ summary: '生产工单详情' })
  async getOrder(@Param('id') id: string) {
    return this.productionService.getOrder(id)
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: '更新生产工单状态' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.productionService.updateOrderStatus(id, status)
  }

  @Get('progress')
  @ApiOperation({ summary: '生产进度查询' })
  async getProgress(@Query('order_id') orderId: string) {
    return this.productionService.getProgress(orderId)
  }

  // ==================== BOM 管理 ====================

  @Post('boms')
  @ApiOperation({ summary: '创建 BOM' })
  async createBom(@Body() dto: any) {
    return this.productionService.createBom(dto)
  }

  @Get('boms')
  @ApiOperation({ summary: 'BOM 列表' })
  async getBoms() {
    return this.productionService.getBoms()
  }

  @Get('boms/:id')
  @ApiOperation({ summary: 'BOM 详情' })
  async getBom(@Param('id') id: string) {
    return this.productionService.getBom(id)
  }
}
