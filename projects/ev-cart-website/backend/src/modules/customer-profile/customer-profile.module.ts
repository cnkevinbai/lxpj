import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Customer } from '../customer/entities/customer.entity'
import { Order } from '../order/entities/order.entity'
import { FollowUp } from '../follow-up/entities/follow-up.entity'
import { CustomerProfileService } from './customer-profile.service'
import { CustomerProfileController } from './customer-profile.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Order, FollowUp])],
  providers: [CustomerProfileService],
  controllers: [CustomerProfileController],
  exports: [CustomerProfileService],
})
export class CustomerProfileModule {}
