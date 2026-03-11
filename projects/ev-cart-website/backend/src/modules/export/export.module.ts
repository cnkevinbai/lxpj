import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Customer } from '../customer/entities/customer.entity'
import { Lead } from '../lead/entities/lead.entity'
import { Opportunity } from '../opportunity/entities/opportunity.entity'
import { Order } from '../order/entities/order.entity'
import { Dealer } from '../dealer/entities/dealer.entity'
import { ExportService } from './export.service'
import { ExportController } from './export.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Lead, Opportunity, Order, Dealer]),
  ],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
