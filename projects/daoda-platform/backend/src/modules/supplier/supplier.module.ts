/**
 * 供应商管理模块
 */
import { Module, Global } from '@nestjs/common'
import { SupplierService } from './supplier.service'
import { SupplierController } from './supplier.controller'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
