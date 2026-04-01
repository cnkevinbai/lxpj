/**
 * 税务管理控制器
 * API 接口：税种配置、税金计算、纳税申报、发票税务
 */
import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common'
import {
  TaxManagementService,
  TaxType,
  DeclarationStatus,
  TaxPeriod,
} from './tax-management.service'

@Controller('api/finance/tax')
export class TaxManagementController {
  constructor(private readonly service: TaxManagementService) {}

  // ========== 税种配置管理 ==========

  @Get('configs')
  getTaxConfigs(@Query() params?: any) {
    return this.service.getTaxConfigs(params)
  }

  @Get('configs/:id')
  getTaxConfig(@Param('id') id: string) {
    return this.service.getTaxConfig(id)
  }

  @Post('configs')
  createTaxConfig(@Body() config: any) {
    return this.service.createTaxConfig(config)
  }

  // ========== 税金计算 ==========

  @Post('calculate')
  calculateTax(@Body() params: any) {
    return this.service.calculateTax(params)
  }

  @Get('calculations')
  getTaxCalculations(@Query() params?: any) {
    return this.service.getTaxCalculations(params)
  }

  // ========== 纳税申报 ==========

  @Get('declarations')
  getTaxDeclarations(@Query() params?: any) {
    return this.service.getTaxDeclarations(params)
  }

  @Post('declarations')
  createTaxDeclaration(@Body() declaration: any) {
    return this.service.createTaxDeclaration(declaration)
  }

  @Post('declarations/:id/submit')
  submitDeclaration(@Param('id') id: string) {
    return this.service.submitDeclaration(id)
  }

  @Post('declarations/:id/approve')
  approveDeclaration(@Param('id') id: string) {
    return this.service.approveDeclaration(id)
  }

  @Post('declarations/:id/pay')
  payTax(@Param('id') id: string) {
    return this.service.payTax(id)
  }

  // ========== 发票税务信息 ==========

  @Get('invoice-tax')
  getInvoiceTaxInfos(@Query() params?: any) {
    return this.service.getInvoiceTaxInfos(params)
  }

  @Post('invoice-tax/:id/certify')
  certifyInvoice(@Param('id') id: string) {
    return this.service.certifyInvoice(id)
  }

  // ========== 税务提醒 ==========

  @Get('reminders')
  getTaxReminders(@Query() params?: any) {
    return this.service.getTaxReminders(params)
  }

  @Post('reminders/:id/complete')
  completeReminder(@Param('id') id: string) {
    return this.service.completeReminder(id)
  }

  // ========== 统计 ==========

  @Get('stats')
  getStats() {
    return this.service.getStats()
  }
}
