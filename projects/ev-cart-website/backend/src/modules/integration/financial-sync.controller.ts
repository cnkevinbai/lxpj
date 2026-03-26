import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FinancialSyncService } from './services/financial-sync.service';

/**
 * 财务同步控制器
 */
@Controller('api/v1/finance/sync')
@UseGuards(AuthGuard('jwt'))
export class FinancialSyncController {
  constructor(
    private readonly financialSyncService: FinancialSyncService,
  ) {}

  /**
   * 同步收款记录
   * POST /api/v1/finance/sync/payment
   */
  @Post('payment')
  async syncPayment(@Body() data: any) {
    return this.financialSyncService.syncPaymentToCrm(data);
  }

  /**
   * 同步发票信息
   * POST /api/v1/finance/sync/invoice
   */
  @Post('invoice')
  async syncInvoice(@Body() data: any) {
    return this.financialSyncService.syncInvoiceToCrm(data);
  }

  /**
   * 同步信用额度
   * POST /api/v1/finance/sync/credit
   */
  @Post('credit')
  async syncCredit(@Body() data: any) {
    return this.financialSyncService.syncCreditLimit(data);
  }

  /**
   * 获取财务对账状态
   * GET /api/v1/finance/sync/reconciliation
   */
  @Get('reconciliation')
  async getReconciliationStatus() {
    return this.financialSyncService.getReconciliationStatus();
  }
}
