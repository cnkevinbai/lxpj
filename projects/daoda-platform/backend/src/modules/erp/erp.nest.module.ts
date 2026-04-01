/**
 * ERP NestJS 模块包装器
 * 将热插拔 ERP 模块集成到 NestJS 系统
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ErpModule } from './erp.module'
import { InventoryModule } from '../inventory/inventory.module'
import { PurchaseModule } from '../purchase/purchase.module'
import { ProductionModule } from '../production/production.module'
import { ProductionPlanModule } from '../production-plan/production-plan.module'
import { EquipmentModule } from './equipment.module'
import { ProjectManagementModule } from './project-management.module'

// ============================================
// ERP NestJS 模块
// ============================================

@Global()
@Module({
  // 导入子模块
  imports: [
    InventoryModule,
    PurchaseModule,
    ProductionModule,
    ProductionPlanModule,
    EquipmentModule,
    ProjectManagementModule,
  ],

  // 导出子模块
  exports: [
    InventoryModule,
    PurchaseModule,
    ProductionModule,
    ProductionPlanModule,
    EquipmentModule,
    ProjectManagementModule,
  ],
})
export class ErpNestModule implements OnModuleInit, OnModuleDestroy {
  private erpModule: ErpModule

  constructor() {
    this.erpModule = new ErpModule()
  }

  async onModuleInit() {
    // ERP 模块初始化时会自动调用 onStart
    console.log('[ErpNestModule] ERP NestJS 包装器初始化')
  }

  async onModuleDestroy() {
    // 清理
    console.log('[ErpNestModule] ERP NestJS 包装器销毁')
  }

  /**
   * 获取热插拔模块实例
   */
  getHotplugModule(): ErpModule {
    return this.erpModule
  }
}
