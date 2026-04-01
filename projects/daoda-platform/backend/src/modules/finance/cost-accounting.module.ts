/**
 * 成本核算 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { CostAccountingController } from './cost-accounting.controller'
import { CostAccountingService } from './cost-accounting.service'

@Module({
  controllers: [CostAccountingController],
  providers: [CostAccountingService],
  exports: [CostAccountingService],
})
export class CostAccountingModule {}
