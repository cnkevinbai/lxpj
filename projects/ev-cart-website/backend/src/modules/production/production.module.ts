import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductionOrder } from './entities/production-order.entity'
import { ProductionService } from './services/production.service'
import { ProductionController } from './controllers/production.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ProductionOrder])],
  controllers: [ProductionController],
  providers: [ProductionService],
  exports: [ProductionService],
})
export class ProductionModule {}
