import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ForeignCustomer } from './entities/foreign-customer.entity'
import { ForeignCustomerService } from './foreign-customer.service'
import { ForeignCustomerController } from './foreign-customer.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ForeignCustomer])],
  controllers: [ForeignCustomerController],
  providers: [ForeignCustomerService],
  exports: [ForeignCustomerService],
})
export class ForeignCustomerModule {}
