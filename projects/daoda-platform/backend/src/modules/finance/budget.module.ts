/**
 * 预算管理 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { BudgetController } from './budget.controller'
import { BudgetService } from './budget.service'

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
