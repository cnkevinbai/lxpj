/**
 * 订单模块
 * 提供订单管理和支付管理功能
 */
import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
