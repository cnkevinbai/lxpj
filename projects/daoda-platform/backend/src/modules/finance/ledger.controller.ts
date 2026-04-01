/**
 * 总账管理控制器
 * 会计科目与凭证管理 API
 */
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { LedgerService, AccountType, AccountLevel, VoucherStatus } from './ledger.service'

@Controller('api/finance/ledger')
export class LedgerController {
  constructor(private readonly service: LedgerService) {}

  // ========== 会计科目 ==========

  @Get('accounts')
  async getAllAccounts(@Query('type') type?: AccountType, @Query('level') level?: AccountLevel) {
    return this.service.getAllAccounts(type, level)
  }

  @Get('accounts/tree')
  async getAccountTree(@Query('parentCode') parentCode?: string) {
    return this.service.getAccountTree(parentCode)
  }

  @Get('accounts/:id')
  async getAccountById(@Param('id') id: string) {
    return this.service.getAccountById(id)
  }

  @Get('accounts/code/:code')
  async getAccountByCode(@Param('code') code: string) {
    return this.service.getAccountByCode(code)
  }

  @Post('accounts')
  async createAccount(
    @Body()
    data: Partial<{
      code: string
      name: string
      type: AccountType
      level: AccountLevel
      parentCode?: string
      description?: string
      isLeaf: boolean
    }>,
  ) {
    return this.service.createAccount(data)
  }

  @Post('accounts/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      name: string
      description: string
    }>,
  ) {
    return this.service.updateAccount(id, data)
  }

  @Delete('accounts/:id')
  async deleteAccount(@Param('id') id: string) {
    return this.service.deleteAccount(id)
  }

  // ========== 凭证管理 ==========

  @Get('vouchers')
  async getAllVouchers(
    @Query('status') status?: VoucherStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.getAllVouchers(
      status,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    )
  }

  @Get('vouchers/:id')
  async getVoucherById(@Param('id') id: string) {
    return this.service.getVoucherById(id)
  }

  @Post('vouchers')
  async createVoucher(
    @Body()
    data: Partial<{
      voucherNo: string
      voucherDate: string
      entries: Array<{
        accountId: string
        accountCode: string
        accountName: string
        debit: number
        credit: number
        description?: string
      }>
      creator: string
      creatorName: string
      remark?: string
    }>,
  ) {
    return this.service.createVoucher({
      ...data,
      voucherDate: data.voucherDate ? new Date(data.voucherDate) : undefined,
    } as any)
  }

  @Post('vouchers/:id')
  async updateVoucher(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      entries: Array<{
        accountId: string
        accountCode: string
        accountName: string
        debit: number
        credit: number
        description?: string
      }>
      remark?: string
    }>,
  ) {
    return this.service.updateVoucher(id, data as any)
  }

  @Delete('vouchers/:id')
  async deleteVoucher(@Param('id') id: string) {
    return this.service.deleteVoucher(id)
  }

  // ========== 凭证操作 ==========

  @Post('vouchers/:id/submit')
  async submitVoucher(@Param('id') id: string) {
    return this.service.submitVoucher(id)
  }

  @Post('vouchers/:id/approve')
  async approveVoucher(@Param('id') id: string, @Body() body: { reviewer: string }) {
    return this.service.approveVoucher(id, body.reviewer)
  }

  @Post('vouchers/:id/reject')
  async rejectVoucher(@Param('id') id: string, @Body() body: { reviewer: string }) {
    return this.service.rejectVoucher(id, body.reviewer)
  }

  @Post('vouchers/:id/post')
  async postVoucher(@Param('id') id: string, @Body() body: { poster: string }) {
    return this.service.postVoucher(id, body.poster)
  }

  // ========== 账簿查询 ==========

  @Get('ledger')
  async getLedger(
    @Query()
    query: {
      accountCode?: string
      startDate?: string
      endDate?: string
      page?: number
      pageSize?: number
    },
  ) {
    return this.service.getLedger({
      accountCode: query.accountCode,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page ? Number(query.page) : undefined,
      pageSize: query.pageSize ? Number(query.pageSize) : undefined,
    } as any)
  }

  @Get('balances')
  async getAccountBalances(@Query('type') type?: AccountType) {
    return this.service.getAccountBalances(type)
  }

  @Get('trial-balance')
  async getTrialBalance() {
    return this.service.getTrialBalance()
  }

  // ========== 期间管理 ==========

  @Post('period')
  async setCurrentPeriod(@Body() body: { period: string }) {
    return this.service.setCurrentPeriod(body.period)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }
}
