/**
 * 库存调拨控制器
 * 多仓库之间的库存转移管理 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { InventoryTransferService, InventoryTransfer } from './inventory-transfer.service'

@Controller('api/inventory/transfer')
export class InventoryTransferController {
  constructor(private readonly service: InventoryTransferService) {}

  // ========== 调拨单管理 ==========

  @Post()
  async create(
    @Body()
    data: {
      productId: string
      fromWarehouseId: string
      toWarehouseId: string
      quantity: number
      applicantId: string
      remark?: string
    },
  ): Promise<InventoryTransfer> {
    return this.service.create(data)
  }

  @Post(':id/submit')
  async submitForApproval(@Param('id') id: string) {
    return this.service.submitForApproval(id)
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string, @Body() body: { approverId: string }) {
    return this.service.approve(id, body.approverId)
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string) {
    return this.service.complete(id)
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.service.cancel(id, body?.reason)
  }

  // ========== 查询 ==========

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('status') status?: string,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.service.findAll({ page, pageSize, status, productId, warehouseId })
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
