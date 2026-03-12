import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Currency, CurrencyRateHistory } from './entities/currency.entity'
import { ForeignCurrencyService } from './foreign-currency.service'
import { ForeignCurrencyController } from './foreign-currency.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Currency, CurrencyRateHistory])],
  providers: [ForeignCurrencyService],
  controllers: [ForeignCurrencyController],
  exports: [ForeignCurrencyService],
})
export class ForeignCurrencyModule {}
