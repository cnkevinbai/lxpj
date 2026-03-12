import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Opportunity } from '../opportunity/entities/opportunity.entity'
import { Order } from '../order/entities/order.entity'
import { SalesForecastService } from './sales-forecast.service'
import { SalesForecastController } from './sales-forecast.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity, Order])],
  providers: [SalesForecastService],
  controllers: [SalesForecastController],
  exports: [SalesForecastService],
})
export class SalesForecastModule {}
