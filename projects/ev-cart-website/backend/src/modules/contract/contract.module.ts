/**
 * 合同管理模块 - 电子化合同系统
 * 渔晓白 ⚙️ · 专业交付
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { ContractTemplate } from './entities/contract-template.entity'
import { ContractService } from './contract.service'
import { ContractController } from './contract.controller'
import { ContractTemplateService } from './contract-template.service'
import { EsignService } from './esign.service'

@Module({
  imports: [TypeOrmModule.forFeature([Contract, ContractTemplate])],
  providers: [ContractService, ContractTemplateService, EsignService],
  controllers: [ContractController],
  exports: [ContractService, ContractTemplateService, EsignService],
})
export class ContractModule {}
