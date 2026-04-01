/**
 * 财务 NestJS 模块包装器
 * 将热插拔财务模块集成到 NestJS 系统
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Module, Global, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { FinanceModule } from './finance.module'
import { InvoiceModule } from '../invoice/invoice.module'
import { ReceivableModule } from '../receivable/receivable.module'
import { PayableModule } from '../payable/payable.module'
import { CostAccountingModule } from './cost-accounting.module'
import { LedgerModule } from './ledger.module'
import { FixedAssetModule } from './fixed-asset.module'
import { BudgetModule } from './budget.module'
import { TaxManagementModule } from './tax-management.module'

// ============================================
// 财务 NestJS 模块
// ============================================

@Global()
@Module({
  // 导入子模块
  imports: [
    InvoiceModule,
    ReceivableModule,
    PayableModule,
    CostAccountingModule,
    LedgerModule,
    FixedAssetModule,
    BudgetModule,
    TaxManagementModule,
  ],

  // 导出子模块
  exports: [
    InvoiceModule,
    ReceivableModule,
    PayableModule,
    CostAccountingModule,
    LedgerModule,
    FixedAssetModule,
    BudgetModule,
    TaxManagementModule,
  ],
})
export class FinanceNestModule implements OnModuleInit, OnModuleDestroy {
  private financeModule: FinanceModule

  constructor() {
    this.financeModule = new FinanceModule()
  }

  async onModuleInit() {
    console.log('[FinanceNestModule] 财务 NestJS 包装器初始化')
  }

  async onModuleDestroy() {
    console.log('[FinanceNestModule] 财务 NestJS 包装器销毁')
  }

  /**
   * 获取热插拔模块实例
   */
  getHotplugModule(): FinanceModule {
    return this.financeModule
  }
}
