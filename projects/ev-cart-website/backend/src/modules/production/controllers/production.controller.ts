import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProductionService } from '../services/production.service'

@ApiTags('生产管理')
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get('orders')
  @ApiOperation({ summary: '获取生产工单列表' })
  getProductionOrders(@Query() params: any) {
    return this.productionService.getProductionOrders(params)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取生产统计' })
  getStatistics() {
    return this.productionService.getStatistics()
  }
}
