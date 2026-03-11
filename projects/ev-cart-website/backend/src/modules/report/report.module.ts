import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lead } from '../lead/entities/lead.entity'
import { Customer } from '../customer/entities/customer.entity'
import { Order } from '../order/entities/order.entity'
import { ReportService } from './report.service'
import { ReportController } from './report.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Customer, Order]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
