import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lead } from '../lead/entities/lead.entity'
import { Customer } from '../customer/entities/customer.entity'
import { Order } from '../order/entities/order.entity'
import { RecommendService } from './recommend.service'
import { RecommendController } from './recommend.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Customer, Order])],
  controllers: [RecommendController],
  providers: [RecommendService],
  exports: [RecommendService],
})
export class RecommendModule {}
