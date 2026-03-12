import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PurchaseModule } from './modules/purchase/purchase.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { ProductionModule } from './modules/production/production.module'
import { FinanceModule } from './modules/finance/finance.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PurchaseModule,
    InventoryModule,
    ProductionModule,
    FinanceModule,
  ],
})
export class AppModule {}
