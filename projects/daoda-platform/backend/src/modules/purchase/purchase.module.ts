/**
 * 采购模块 Module
 * 采购模块 NestJS Module，整合所有采购相关功能
 */
import { Module } from '@nestjs/common'
import { PurchaseController } from './purchase.controller'
import { PurchaseService } from './purchase.service'
import { PurchaseNestModule } from './purchase.nest.module'

@Module({
  imports: [PurchaseNestModule],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService, PurchaseNestModule],
})
export class PurchaseModule {}
