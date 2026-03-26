import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PurchaseService } from '../services/purchase.service'

@ApiTags('采购管理')
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get('orders')
  @ApiOperation({ summary: '获取采购订单列表' })
  getPurchaseOrders(@Query() params: any) {
    return this.purchaseService.getPurchaseOrders(params)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取采购统计' })
  getStatistics() {
    return this.purchaseService.getStatistics()
  }
}
