import { Injectable } from '@nestjs/common'

@Injectable()
export class DashboardService {
  async getDashboardData() {
    // 模拟数据，实际应该从数据库查询
    return {
      salesToday: 125800.00,
      salesMonth: 2850000.00,
      customersTotal: 1256,
      ordersPending: 18,
      revenueGrowth: 15.8,
      customerGrowth: 8.5,
    }
  }

  async getSalesTrend(days: number = 7) {
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: `${date.getMonth() + 1}-${date.getDate()}`,
        sales: Math.floor(Math.random() * 200000) + 100000,
      })
    }
    return data
  }

  async getCustomerDistribution() {
    return [
      { type: 'A 级客户', value: 120 },
      { type: 'B 级客户', value: 280 },
      { type: 'C 级客户', value: 450 },
    ]
  }

  async getPendingOrders() {
    return [
      { id: 1, orderCode: 'ORD-20260312-001', customer: '张三', amount: 15800, status: 'pending', createdAt: '2026-03-12' },
      { id: 2, orderCode: 'ORD-20260312-002', customer: '李四', amount: 28500, status: 'processing', createdAt: '2026-03-12' },
      { id: 3, orderCode: 'ORD-20260312-003', customer: '王五', amount: 42000, status: 'pending', createdAt: '2026-03-12' },
    ]
  }
}
