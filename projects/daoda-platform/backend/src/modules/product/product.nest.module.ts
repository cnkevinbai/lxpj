/**
 * Product 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生产品服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module } from '@nestjs/common'

// NestJS 原生组件
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

// 热插拔模块
import { ProductHotplugModule, PRODUCT_HOTPLUG_MODULE } from './product.hotplug.module'

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    ProductService,
    // 热插拔模块实例
    {
      provide: 'PRODUCT_HOTPLUG_MODULE',
      useValue: new ProductHotplugModule(),
    },
  ],
  exports: [ProductService, 'PRODUCT_HOTPLUG_MODULE'],
})
export class ProductNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = PRODUCT_HOTPLUG_MODULE
}
