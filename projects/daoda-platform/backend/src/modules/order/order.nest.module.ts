/**
 * Order 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生订单服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'

// NestJS 原生组件
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

// 热插拔模块
import { OrderHotplugModule, ORDER_HOTPLUG_MODULE } from './order.hotplug.module'

@Global()
@Module({
  imports: [],
  controllers: [OrderController],
  providers: [
    OrderService,
    // 热插拔模块实例
    {
      provide: 'ORDER_HOTPLUG_MODULE',
      useValue: new OrderHotplugModule(),
    },
  ],
  exports: [OrderService, 'ORDER_HOTPLUG_MODULE'],
})
export class OrderNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = ORDER_HOTPLUG_MODULE
}
