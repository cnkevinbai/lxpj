/**
 * Invoice 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生发票服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'

// NestJS 原生组件
import { InvoiceController } from './invoice.controller'
import { InvoiceService } from './invoice.service'

// 热插拔模块
import { InvoiceHotplugModule, INVOICE_HOTPLUG_MODULE } from './invoice.hotplug.module'

// Guards
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Global()
@Module({
  imports: [],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    JwtAuthGuard,
    // 热插拔模块实例
    {
      provide: 'INVOICE_HOTPLUG_MODULE',
      useValue: new InvoiceHotplugModule(),
    },
  ],
  exports: [InvoiceService, InvoiceController, JwtAuthGuard, 'INVOICE_HOTPLUG_MODULE'],
})
export class InvoiceNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = INVOICE_HOTPLUG_MODULE
}
