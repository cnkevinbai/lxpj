/**
 * 质检管理控制器
 * 产品质量控制与检验 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import {
  QualityInspectionService,
  QualityInspection,
  QualityStandard,
} from './quality-inspection.service'

@Controller('api/inventory/quality-inspection')
export class QualityInspectionController {
  constructor(private readonly service: QualityInspectionService) {}

  // ========== 质检单管理 ==========

  @Post()
  async create(
    @Body()
    data: {
      type: 'PURCHASE' | 'PRODUCTION' | 'FINISHED'
      productId: string
      batchNo?: string
      quantity: number
      inspectorId: string
    },
  ): Promise<QualityInspection> {
    return this.service.create(data)
  }

  @Post(':id/start')
  async start(@Param('id') id: string) {
    return this.service.start(id)
  }

  @Post(':id/items/:standardId/inspect')
  async inspectItem(
    @Param('id') id: string,
    @Param('standardId') standardId: string,
    @Body()
    data: {
      actualValue: string
      isPass: boolean
      remark?: string
    },
  ) {
    return this.service.inspectItem(id, standardId, data)
  }

  @Post(':id/complete')
  async complete(
    @Param('id') id: string,
    @Body()
    data: {
      passQuantity: number
      failQuantity: number
      result?: string
      remark?: string
    },
  ) {
    return this.service.complete(id, data)
  }

  // ========== 查询 ==========

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('productId') productId?: string,
  ) {
    return this.service.findAll({ page, pageSize, type, status, productId })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }

  @Get('failed-records')
  async getFailedRecords(@Query('limit') limit?: number) {
    return this.service.getFailedRecords(limit)
  }

  // ========== 质检标准 ==========

  @Post('standards/:productId')
  async setStandards(@Param('productId') productId: string, @Body() standards: QualityStandard[]) {
    return this.service.setStandards(productId, standards)
  }

  @Get('standards/:productId')
  async getStandards(@Param('productId') productId: string) {
    return this.service.getStandards(productId)
  }
}
