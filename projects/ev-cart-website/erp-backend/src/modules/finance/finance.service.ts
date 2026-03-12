import { Injectable } from '@nestjs/common'

@Injectable()
export class FinanceService {
  private vouchers: any[] = []
  private receivables: any[] = []
  private payables: any[] = []

  // ==================== 凭证管理 ====================

  async createVoucher(dto: any) {
    const voucher = {
      id: `VCH-${Date.now()}`,
      voucher_no: `记-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}`,
      ...dto,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    this.vouchers.push(voucher)
    return { success: true, data: voucher }
  }

  async getVouchers(date?: string) {
    let vouchers = this.vouchers
    if (date) {
      vouchers = vouchers.filter(v => v.voucher_date === date)
    }
    return vouchers
  }

  async getVoucher(id: string) {
    return this.vouchers.find(v => v.id === id)
  }

  async postVoucher(id: string) {
    const voucher = this.vouchers.find(v => v.id === id)
    if (voucher) {
      voucher.status = 'posted'
      return { success: true, message: '凭证过账成功', data: voucher }
    }
    return { success: false, message: '凭证不存在' }
  }

  // ==================== 应收账款 ====================

  async getReceivables(customerId?: string) {
    let receivables = this.receivables
    if (customerId) {
      receivables = receivables.filter(r => r.customer_id === customerId)
    }
    return receivables
  }

  async receive(id: string, amount: number) {
    const receivable = this.receivables.find(r => r.id === id)
    if (receivable) {
      receivable.received_amount += amount
      if (receivable.received_amount >= receivable.amount) {
        receivable.status = 'paid'
      }
      return { success: true, data: receivable }
    }
    return { success: false, message: '应收账款不存在' }
  }

  // ==================== 应付账款 ====================

  async getPayables(supplierId?: string) {
    let payables = this.payables
    if (supplierId) {
      payables = payables.filter(p => p.supplier_id === supplierId)
    }
    return payables
  }

  async pay(id: string, amount: number) {
    const payable = this.payables.find(p => p.id === id)
    if (payable) {
      payable.paid_amount += amount
      if (payable.paid_amount >= payable.amount) {
        payable.status = 'paid'
      }
      return { success: true, data: payable }
    }
    return { success: false, message: '应付账款不存在' }
  }

  // ==================== 财务报表 ====================

  async getBalanceSheet() {
    return {
      assets: 1000000,
      liabilities: 400000,
      equity: 600000,
    }
  }

  async getProfitSheet() {
    return {
      revenue: 500000,
      cost: 300000,
      profit: 200000,
    }
  }
}
