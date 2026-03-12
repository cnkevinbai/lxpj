import { Injectable } from '@nestjs/common'

@Injectable()
export class ReportsService {
  async getSalesReport(dateFrom: string, dateTo: string) {
    return {
      totalSales: 8560000,
      totalOrders: 1256,
      averageOrderValue: 6815,
      growthRate: 15.8,
      byMonth: [
        { month: '01 月', sales: 1250000, target: 1000000 },
        { month: '02 月', sales: 1580000, target: 1200000 },
        { month: '03 月', sales: 2100000, target: 1500000 },
      ],
      byProduct: [
        { product: 'EV Cart Pro', sales: 2580000, growth: 15.8 },
        { product: 'EV Cart Standard', sales: 1850000, growth: 12.5 },
        { product: 'EV Cart Lite', sales: 1250000, growth: 8.2 },
      ],
    }
  }

  async getCustomerReport(dateFrom: string, dateTo: string) {
    return {
      totalCustomers: 856,
      newCustomers: 156,
      activeCustomers: 428,
      sleepingCustomers: 89,
      lostCustomers: 23,
      byLevel: [
        { level: 'A 级', count: 120 },
        { level: 'B 级', count: 280 },
        { level: 'C 级', count: 456 },
      ],
    }
  }

  async getProductReport(dateFrom: string, dateTo: string) {
    return {
      totalProducts: 156,
      totalSales: 8560000,
      topProducts: [
        { rank: 1, product: 'EV Cart Pro', sales: 2580000, growth: 15.8 },
        { rank: 2, product: 'EV Cart Standard', sales: 1850000, growth: 12.5 },
        { rank: 3, product: 'EV Cart Lite', sales: 1250000, growth: 8.2 },
      ],
      inventory: {
        total: 5680,
        lowStock: 23,
        outOfStock: 5,
      },
    }
  }

  async getDealerReport(dateFrom: string, dateTo: string) {
    return {
      totalDealers: 156,
      activeDealers: 128,
      topDealers: [
        { dealer: '深圳经销商', score: 96.5, sales: 5800000, level: 'strategic' },
        { dealer: '广州经销商', score: 92.8, sales: 4200000, level: 'platinum' },
        { dealer: '上海经销商', score: 88.5, sales: 3500000, level: 'gold' },
      ],
    }
  }

  async getRecruitmentReport(dateFrom: string, dateTo: string) {
    return {
      openJobs: 28,
      totalResumes: 456,
      interviewing: 89,
      hired: 23,
      byDepartment: [
        { department: '技术部', jobs: 12, resumes: 180 },
        { department: '销售部', jobs: 8, resumes: 120 },
        { department: '市场部', jobs: 5, resumes: 89 },
      ],
    }
  }
}
