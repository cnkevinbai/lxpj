import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { InventoryService } from './inventory.service'

@ApiTags('inventory')
@Controller('api/v1/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ==================== 库存查询 ====================

  @Get('stock')
  @ApiOperation({ summary: '库存查询' })
  async getStock(
    @Query('material_id') materialId?: string,
    @Query('warehouse_id') warehouseId?: string,
  ) {
    return this.inventoryService.getStock(materialId, warehouseId)
  }

  @Get('warnings')
  @ApiOperation({ summary: '库存预警' })
  async getWarnings() {
    return this.inventoryService.getWarnings()
  }

  @Post('check-availability')
  @ApiOperation({ summary: '可用量检查' })
  async checkAvailability(@Body('items') items: any[]) {
    return this.inventoryService.checkAvailability(items)
  }

  // ==================== 入库管理 ====================

  @Post('inbound')
  @ApiOperation({ summary: '创建入库单' })
  async createInbound(@Body() dto: any) {
    return this.inventoryService.createInbound(dto)
  }

  @Get('inbound')
  @ApiOperation({ summary: '入库单列表' })
  async getInbound(@Query('warehouse_id') warehouseId?: string) {
    return this.inventoryService.getInbound(warehouseId)
  }

  @Post('inbound/:id/confirm')
  @ApiOperation({ summary: '确认入库' })
  async confirmInbound(@Param('id') id: string) {
    return this.inventoryService.confirmInbound(id)
  }

  // ==================== 出库管理 ====================

  @Post('outbound')
  @ApiOperation({ summary: '创建出库单' })
  async createOutbound(@Body() dto: any) {
    return this.inventoryService.createOutbound(dto)
  }

  @Get('outbound')
  @ApiOperation({ summary: '出库单列表' })
  async getOutbound(@Query('warehouse_id') warehouseId?: string) {
    return this.inventoryService.getOutbound(warehouseId)
  }

  @Post('outbound/:id/confirm')
  @ApiOperation({ summary: '确认出库' })
  async confirmOutbound(@Param('id') id: string) {
    return this.inventoryService.confirmOutbound(id)
  }
}
