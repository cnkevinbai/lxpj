/**
 * 售后服务模块
 * 提供售后服务工单管理功能
 */
import { Module } from '@nestjs/common'
import { ServiceController } from './service.controller'
import { ServiceService } from './service.service'

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
