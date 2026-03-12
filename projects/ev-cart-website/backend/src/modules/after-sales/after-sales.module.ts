/**
 * 售后服务模块
 * 渔晓白 ⚙️ · 专业交付
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServiceTicket } from './entities/service-ticket.entity'
import { ServiceOrder } from './entities/service-order.entity'
import { ServiceComplaint } from './entities/service-complaint.entity'
import { ServiceCenter } from './entities/service-center.entity'
import { ServicePart } from './entities/service-part.entity'
import { ServiceContract } from './entities/service-contract.entity'
import { AfterSalesService } from './after-sales.service'
import { AfterSalesStatisticService } from './after-sales-statistic.service'
import { AfterSalesController } from './after-sales.controller'
import { RbacModule } from '../rbac/rbac.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceTicket,
      ServiceOrder,
      ServiceComplaint,
      ServiceCenter,
      ServicePart,
      ServiceContract,
    ]),
    RbacModule,
  ],
  providers: [AfterSalesService, AfterSalesStatisticService],
  controllers: [AfterSalesController],
  exports: [AfterSalesService, AfterSalesStatisticService],
})
export class AfterSalesModule {}
