/**
 * 成本核算控制器
 * 产品成本计算与分析 API
 */
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { CostAccountingService, CostType } from './cost-accounting.service'

@Controller('api/finance/cost-accounting')
export class CostAccountingController {
  constructor(private readonly service: CostAccountingService) {}

  // ========== 成本记录 ==========

  @Post('records')
  async addCostRecord(
    @Body()
    data: {
      productId: string
      costType: CostType
      amount: number
      currency?: string
      period?: string
      source?: string
      remark?: string
    },
  ) {
    return this.service.addCostRecord(data)
  }

  @Post('records/batch')
  async batchAddCostRecords(
    @Body()
    body: {
      records: Array<{
        productId: string
        costType: CostType
        amount: number
        currency?: string
        period?: string
        source?: string
        remark?: string
      }>
    },
  ) {
    return this.service.batchAddCostRecords(body.records)
  }

  @Get('records')
  async getCostRecords(
    @Query('productId') productId?: string,
    @Query('costType') costType?: CostType,
    @Query('period') period?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.service.getCostRecords({ productId, costType, period, page, pageSize })
  }

  // ========== 成本计算 ==========

  @Get('products/:productId/calculate')
  async calculateProductCost(
    @Param('productId') productId: string,
    @Query('period') period?: string,
  ) {
    return this.service.calculateProductCost(productId, period)
  }

  // ========== 成本分析 ==========

  @Get('products/:productId/trend')
  async getCostTrend(@Param('productId') productId: string, @Query('months') months?: number) {
    return this.service.getCostTrend(productId, months)
  }

  @Get('products/compare')
  async compareCost(
    @Query('productId1') productId1: string,
    @Query('productId2') productId2: string,
    @Query('period') period?: string,
  ) {
    return this.service.compareCost(productId1, productId2, period)
  }

  @Get('products/:productId/structure')
  async getCostStructure(@Param('productId') productId: string, @Query('period') period?: string) {
    return this.service.getCostStructure(productId, period)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getCostStats(@Query('period') period?: string) {
    return this.service.getCostStats(period)
  }
}
