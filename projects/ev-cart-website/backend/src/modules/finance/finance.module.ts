import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FinanceReceivable } from './entities/finance-receivable.entity'
import { FinancePayment } from './entities/finance-payment.entity'
import { FinanceService } from './services/finance.service'
import { FinanceController } from './controllers/finance.controller'

@Module({
  imports: [TypeOrmModule.forFeature([FinanceReceivable, FinancePayment])],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
