/**
 * 税务管理 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { TaxManagementController } from './tax-management.controller'
import { TaxManagementService } from './tax-management.service'

@Module({
  controllers: [TaxManagementController],
  providers: [TaxManagementService],
  exports: [TaxManagementService],
})
export class TaxManagementModule {}
