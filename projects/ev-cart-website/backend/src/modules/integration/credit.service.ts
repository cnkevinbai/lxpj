import { Injectable } from '@nestjs/common'

@Injectable()
export class CreditService {
  private customers: Record<string, any> = {}

  async getCustomerCredit(customerId: string): Promise<any> {
    // 获取客户信用数据
    const customer = this.customers[customerId] || {
      credit_limit: 1000000,
      used_credit: 500000,
      receivables: 500000,
      payables: 0,
    }

    return {
      customer_id: customerId,
      credit_limit: customer.credit_limit,
      used_credit: customer.used_credit,
      available_credit: customer.credit_limit - customer.used_credit,
      receivables: customer.receivables,
      payables: customer.payables,
    }
  }

  async checkCredit(customerId: string, orderAmount: number): Promise<any> {
    const credit = await this.getCustomerCredit(customerId)
    const passed = credit.available_credit >= orderAmount

    return {
      customer_id: customerId,
      order_amount: orderAmount,
      passed,
      message: passed ? '信用充足' : '信用不足',
      available_credit: credit.available_credit,
    }
  }

  async syncCustomerCredit(data: any): Promise<any> {
    // 同步客户信用数据
    this.customers[data.customer_id] = data
    return { success: true, message: '信用数据同步成功' }
  }
}
