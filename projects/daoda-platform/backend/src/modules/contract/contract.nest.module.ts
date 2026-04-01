/**
 * 合同 NestJS 包装器
 * 集成热插拔模块和原生 NestJS Service
 *
 * @version 1.0.0
 * @since 2026-03-31
 */

import { Module, Global } from '@nestjs/common'
import { ContractService } from './contract.service'
import { ContractController } from './contract.controller'
import { ContractHotplugModule, CONTRACT_HOTPLUG_MODULE } from './contract.hotplug.module'
import { PrismaModule } from '../../common/prisma/prisma.module'

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [ContractController],
  providers: [
    ContractService,
    {
      provide: 'CONTRACT_HOTPLUG_MODULE',
      useValue: new ContractHotplugModule(),
    },
  ],
  exports: [ContractService, 'CONTRACT_HOTPLUG_MODULE'],
})
export class ContractNestModule {}
