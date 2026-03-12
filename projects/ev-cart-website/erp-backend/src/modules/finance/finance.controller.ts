import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { FinanceService } from './finance.service'

@ApiTags('finance')
@Controller('api/v1/finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ==================== 凭证管理 ====================

  @Post('vouchers')
  @ApiOperation({ summary: '创建凭证' })
  async createVoucher(@Body() dto: any) {
    return this.financeService.createVoucher(dto)
  }

  @Get('vouchers')
  @ApiOperation({ summary: '凭证列表' })
  async getVouchers(@Query('date') date?: string) {
    return this.financeService.getVouchers(date)
  }

  @Get('vouchers/:id')
  @ApiOperation({ summary: '凭证详情' })
  async getVoucher(@Param('id') id: string) {
    return this.financeService.getVoucher(id)
  }

  @Post('vouchers/:id/post')
  @ApiOperation({ summary: '凭证过账' })
  async postVoucher(@Param('id') id: string) {
    return this.financeService.postVoucher(id)
  }

  // ==================== 应收账款 ====================

  @Get('receivables')
  @ApiOperation({ summary: '应收账款列表' })
  async getReceivables(@Query('customer_id') customerId?: string) {
    return this.financeService.getReceivables(customerId)
  }

  @Post('receivables/:id/receive')
  @ApiOperation({ summary: '收款' })
  async receive(@Param('id') id: string, @Body('amount') amount: number) {
    return this.financeService.receive(id, amount)
  }

  // ==================== 应付账款 ====================

  @Get('payables')
  @ApiOperation({ summary: '应付账款列表' })
  async getPayables(@Query('supplier_id') supplierId?: string) {
    return this.financeService.getPayables(supplierId)
  }

  @Post('payables/:id/pay')
  @ApiOperation({ summary: '付款' })
  async pay(@Param('id') id: string, @Body('amount') amount: number) {
    return this.financeService.pay(id, amount)
  }

  // ==================== 财务报表 ====================

  @Get('reports/balance')
  @ApiOperation({ summary: '资产负债表' })
  async getBalanceSheet() {
    return this.financeService.getBalanceSheet()
  }

  @Get('reports/profit')
  @ApiOperation({ summary: '利润表' })
  async getProfitSheet() {
    return this.financeService.getProfitSheet()
  }
}
