/**
 * 销售预测控制器
 * API 接口：收入预测、订单预测、客户增长预测、产品销售预测、批量预测
 */
import { Controller, Get, Post, Query, Body } from '@nestjs/common'
import { SalesPredictionService } from './sales-prediction.service'

@Controller('api/crm/sales-prediction')
export class SalesPredictionController {
  constructor(private readonly service: SalesPredictionService) {}

  // ========== 预测执行 ==========

  @Post('predict')
  predict(@Body() config: any) {
    return this.service.predict(config)
  }

  // ========== 产品批量预测 ==========

  @Post('batch-products')
  batchPredictProducts() {
    return this.service.batchPredictProducts()
  }

  // ========== 预测记录 ==========

  @Get('predictions')
  getPredictions(@Query() params: any) {
    return this.service.getPredictions(params)
  }

  // ========== 统计 ==========

  @Get('stats')
  getPredictionStats() {
    return this.service.getPredictionStats()
  }
}
