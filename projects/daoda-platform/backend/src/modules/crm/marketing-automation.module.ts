/**
 * 营销自动化 NestJS 模块
 */
import { Module } from '@nestjs/common'
import { MarketingAutomationController } from './marketing-automation.controller'
import { MarketingAutomationService } from './marketing-automation.service'

@Module({
  controllers: [MarketingAutomationController],
  providers: [MarketingAutomationService],
  exports: [MarketingAutomationService],
})
export class MarketingAutomationModule {}
