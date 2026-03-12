import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserHandover, HandoverItem } from './entities/handover.entity'
import { Customer } from '../customer/entities/customer.entity'
import { Lead } from '../lead/entities/lead.entity'
import { Opportunity } from '../opportunity/entities/opportunity.entity'
import { Order } from '../order/entities/order.entity'
import { UserHandoverService } from './user-handover.service'
import { UserHandoverController } from './user-handover.controller'
import { AuditLogModule } from '../audit-log/audit-log.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserHandover,
      HandoverItem,
      Customer,
      Lead,
      Opportunity,
      Order,
    ]),
    AuditLogModule,
  ],
  providers: [UserHandoverService],
  controllers: [UserHandoverController],
  exports: [UserHandoverService],
})
export class UserHandoverModule {}
