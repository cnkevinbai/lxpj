/**
 * 绩效管理 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { PerformanceController } from './performance.controller'
import { PerformanceService } from './performance.service'

@Module({
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule {}
