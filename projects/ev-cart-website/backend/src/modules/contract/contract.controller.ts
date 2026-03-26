/**
 * 合同控制器
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ContractService } from './services/contract.service'
import { ContractSignature } from './entities/contract.entity'

@Controller('contracts')
@UseGuards(JwtAuthGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  async create(@Body() data: any) {
    return this.contractService.create(data)
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.contractService.findAll(page, limit, {
      type,
      status,
      customerId,
      startDate,
      endDate,
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractService.findOne(id)
  }

  @Post(':id/submit')
  async submitForApproval(@Param('id') id: string) {
    return this.contractService.submitForApproval(id)
  }

  @Post(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @Body('approverId') approverId: string,
  ) {
    return this.contractService.approve(id, approved, approverId)
  }

  @Post(':id/sign')
  async sign(
    @Param('id') id: string,
    @Body() signatureData: ContractSignature,
  ) {
    return this.contractService.signContract(id, signatureData)
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    return this.contractService.activate(id)
  }

  @Post(':id/archive')
  async archive(@Param('id') id: string) {
    return this.contractService.archive(id)
  }

  @Post(':id/change')
  async createChange(
    @Param('id') id: string,
    @Body() changeData: any,
  ) {
    return this.contractService.createChange(id, changeData)
  }

  @Get('expiring/soon')
  async getExpiring(@Query('days') days: number = 30) {
    return this.contractService.getExpiringContracts(days)
  }

  @Get('stats/overview')
  async getStats() {
    return this.contractService.getStats()
  }
}
