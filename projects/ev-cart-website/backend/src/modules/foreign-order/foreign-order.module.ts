import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ForeignOrder } from './entities/foreign-order.entity'
import { ForeignOrderService } from './foreign-order.service'
import { ForeignOrderController } from './foreign-order.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ForeignOrder])],
  controllers: [ForeignOrderController],
  providers: [ForeignOrderService],
  exports: [ForeignOrderService],
})
export class ForeignOrderModule {}
