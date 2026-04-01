/**
 * 库存盘点控制器
 * 实际库存与系统库存核对 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { InventoryCheckService, InventoryCheck, CheckItem } from './inventory-check.service'

@Controller('api/inventory/check')
export class InventoryCheckController {
  constructor(private readonly service: InventoryCheckService) {}

  // ========== 盘点单管理 ==========

  @Post()
  async create(
    @Body() data: { warehouseId: string; productIds?: string[]; creatorId: string },
  ): Promise<InventoryCheck> {
    return this.service.create(data)
  }

  @Post(':id/start')
  async start(@Param('id') id: string) {
    return this.service.start(id)
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    return this.service.complete(id)
  }

  // ========== 盘点操作 ==========

  @Post(':id/items/:productId/check')
  async checkItem(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @Body() data: { actualQuantity: number; diffReason?: string },
  ) {
    return this.service.checkItem(id, productId, data)
  }

  @Post(':id/items/:productId/adjust')
  async adjustInventory(@Param('id') id: string, @Param('productId') productId: string) {
    return this.service.adjustInventory(id, productId)
  }

  @Post(':id/batch-adjust')
  async batchAdjust(@Param('id') id: string) {
    return this.service.batchAdjust(id)
  }

  // ========== 查询 ==========

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.service.findAll({ page, pageSize, status, warehouseId })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }
}
