import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CrmPoolService } from './crm-pool.service'
import { CrmPoolController } from './crm-pool.controller'
import { CustomerPool, PoolRule } from './entities/crm-pool.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CustomerPool, PoolRule])],
  providers: [CrmPoolService],
  controllers: [CrmPoolController],
  exports: [CrmPoolService],
})
export class CrmPoolModule {}
