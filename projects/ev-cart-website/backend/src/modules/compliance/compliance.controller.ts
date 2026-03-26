/**
 * 合规性检查控制器
 * 渔晓白 ⚙️ · 专业交付
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ComplianceService } from './services/compliance.service'
import { ComplianceType } from './entities/compliance-check.entity'

@Controller('compliance')
@UseGuards(JwtAuthGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('financial/:id')
  async checkFinancial(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.complianceService.checkFinancial(id, data)
  }

  @Post('contract/:id')
  async checkContract(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.complianceService.checkContract(id, data)
  }

  @Post('privacy/:id')
  async checkPrivacy(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.complianceService.checkDataPrivacy(id, data)
  }

  @Get('report')
  async getReport(
    @Query('type') type?: ComplianceType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.complianceService.getComplianceReport(
      type,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )
  }
}
