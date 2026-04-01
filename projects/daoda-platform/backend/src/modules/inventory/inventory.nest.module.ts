/**
 * Inventory 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生库存服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'

// NestJS 原生组件
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'

// 热插拔模块
import { InventoryHotplugModule, INVENTORY_HOTPLUG_MODULE } from './inventory.hotplug.module'

@Global()
@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    // 热插拔模块实例
    {
      provide: 'INVENTORY_HOTPLUG_MODULE',
      useValue: new InventoryHotplugModule(),
    },
  ],
  exports: [InventoryService, 'INVENTORY_HOTPLUG_MODULE'],
})
export class InventoryNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = INVENTORY_HOTPLUG_MODULE
}
