/**
 * 合同模块
 * 提供服务合同的 CRUD 操作、续约、终止等功能
 */
import { Module } from '@nestjs/common'
import { ContractController } from './contract.controller'
import { ContractService } from './contract.service'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
