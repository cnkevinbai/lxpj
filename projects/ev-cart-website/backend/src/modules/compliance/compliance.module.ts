/**
 * 合规性检查模块 - 财务/合同/数据隐私
 * 渔晓白 ⚙️ · 专业交付
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ComplianceCheck } from './entities/compliance-check.entity'
import { ComplianceService } from './compliance.service'
import { ComplianceController } from './compliance.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceCheck])],
  providers: [ComplianceService],
  controllers: [ComplianceController],
  exports: [ComplianceService],
})
export class ComplianceModule {}
