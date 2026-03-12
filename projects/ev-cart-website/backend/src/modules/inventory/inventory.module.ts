import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InventoryProduct } from './entities/inventory-product.entity'
import { InventoryTransaction } from './entities/inventory-transaction.entity'
import { InventoryService } from './services/inventory.service'
import { InventoryController } from './controllers/inventory.controller'

@Module({
  imports: [TypeOrmModule.forFeature([InventoryProduct, InventoryTransaction])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
