import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InventoryService } from './inventory.service'

@ApiTags('库存管理')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('products')
  @ApiOperation({ summary: '获取库存列表' })
  getInventory(@Query() params: any) {
    return this.inventoryService.getInventory(params)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取库存统计' })
  getStatistics() {
    return this.inventoryService.getStatistics()
  }

  @Get('alerts')
  @ApiOperation({ summary: '库存预警' })
  getLowStockAlert() {
    return this.inventoryService.getLowStockAlert()
  }

  @Get('transactions')
  @ApiOperation({ summary: '获取库存流水' })
  getTransactions(@Query() params: any) {
    return this.inventoryService.getTransactions(params)
  }

  @Post('stock-in')
  @ApiOperation({ summary: '入库操作' })
  stockIn(@Body() data: any, @Request() req: any) {
    const userId = req.user?.id || 'system'
    return this.inventoryService.stockIn(data, userId)
  }

  @Post('stock-out')
  @ApiOperation({ summary: '出库操作' })
  stockOut(@Body() data: any, @Request() req: any) {
    const userId = req.user?.id || 'system'
    return this.inventoryService.stockOut(data, userId)
  }
}
