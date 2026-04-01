/**
 * Purchase 热插拔模块 - NestJS 包装器
 * 将热插拔模块与 NestJS 原生采购服务集成
 *
 * 功能范围:
 * - 采购单 CRUD 操作
 * - 采购单状态流转
 * - 权限验证
 * - 事件发布
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global } from '@nestjs/common'

// NestJS 原生组件
import { PurchaseController } from './purchase.controller'
import { PurchaseService } from './purchase.service'

// 热插拔模块
import { PurchaseHotplugModule, PURCHASE_HOTPLUG_MODULE } from './purchase.hotplug.module'

// Guards
import { PermissionsGuard } from '../auth/guards/permissions.guard'

// Decorators
import { Permissions } from '../auth/decorators/permissions.decorator'

/**
 * Purchase NestJS Module
 * 将热插拔模块与 NestJS 控制器/服务集成
 *
 * @version 1.0.0
 * @since 2026-03-30
 */
@Global()
@Module({
  imports: [],
  controllers: [PurchaseController],
  providers: [
    PurchaseService,
    // 热插拔模块实例
    {
      provide: 'PURCHASE_HOTPLUG_MODULE',
      useValue: new PurchaseHotplugModule(),
    },
    // 权限验证守卫
    PermissionsGuard,
  ],
  exports: [PurchaseService, 'PURCHASE_HOTPLUG_MODULE', PermissionsGuard],
})
export class PurchaseNestModule {
  // 热插拔模块元信息
  static readonly hotplugModule = PURCHASE_HOTPLUG_MODULE

  // 导出权限装饰器
  static readonly Permissions = Permissions
}
