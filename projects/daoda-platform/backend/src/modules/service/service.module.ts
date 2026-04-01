/**
 * 售后服务模块
 * 提供售后服务工单管理、客户满意度等功能
 */
import { Module } from '@nestjs/common'
import { ServiceController } from './service.controller'
import { ServiceService } from './service.service'
import { ServiceDispatchController } from './service-dispatch.controller'
import { ServiceDispatchService } from './service-dispatch.service'
import { SlaController } from './sla.controller'
import { SLAService } from './sla.service'
import { CustomerSatisfactionController } from './customer-satisfaction.controller'
import { CustomerSatisfactionService } from './customer-satisfaction.service'

@Module({
  controllers: [
    ServiceController,
    ServiceDispatchController,
    SlaController,
    CustomerSatisfactionController,
  ],
  providers: [ServiceService, ServiceDispatchService, SLAService, CustomerSatisfactionService],
  exports: [ServiceService, ServiceDispatchService, SLAService, CustomerSatisfactionService],
})
export class ServiceModule {}
