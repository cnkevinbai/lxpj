import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Lead } from '../lead/entities/lead.entity'
import { Customer } from '../customer/entities/customer.entity'
import { Order } from '../order/entities/order.entity'

/**
 * 报表服务
 * 支持数据导出
 */
@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * 获取销售报表数据
   */
  async getSalesReport(startDate: string, endDate: string, businessType: string) {
    const queryBuilder = this.orderRepository.createQueryBuilder('order')

    if (businessType === 'foreign') {
      queryBuilder.innerJoin('order.customer', 'customer', 'customer.businessType = :businessType', { businessType })
    }

    const orders = await queryBuilder
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany()

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = orders.length

    // 按月份分组
    const byMonth = orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toISOString().slice(0, 7)
      if (!acc[month]) {
        acc[month] = { count: 0, amount: 0 }
      }
      acc[month].count += 1
      acc[month].amount += order.totalAmount
      return acc
    }, {})

    return {
      totalAmount,
      totalOrders,
      byMonth,
      startDate,
      endDate,
      businessType,
    }
  }

  /**
   * 获取客户报表数据
   */
  async getCustomerReport(startDate: string, endDate: string, businessType: string) {
    const queryBuilder = this.customerRepository.createQueryBuilder('customer')

    if (businessType) {
      queryBuilder.where('customer.businessType = :businessType', { businessType })
    }

    const customers = await queryBuilder
      .where('customer.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany()

    const byLevel = customers.reduce((acc, customer) => {
      if (!acc[customer.level]) {
        acc[customer.level] = 0
      }
      acc[customer.level] += 1
      return acc
    }, {})

    const byCountry = businessType === 'foreign'
      ? customers.reduce((acc, customer) => {
          if (!acc[customer.country]) {
            acc[customer.country] = 0
          }
          acc[customer.country] += 1
          return acc
        }, {})
      : {}

    return {
      totalCustomers: customers.length,
      byLevel,
      byCountry,
      startDate,
      endDate,
    }
  }

  /**
   * 获取线索报表数据
   */
  async getLeadReport(startDate: string, endDate: string, businessType: string) {
    const queryBuilder = this.leadRepository.createQueryBuilder('lead')

    if (businessType) {
      queryBuilder.where('lead.businessType = :businessType', { businessType })
    }

    const leads = await queryBuilder
      .where('lead.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany()

    const bySource = leads.reduce((acc, lead) => {
      if (!acc[lead.source]) {
        acc[lead.source] = 0
      }
      acc[lead.source] += 1
      return acc
    }, {})

    const byStatus = leads.reduce((acc, lead) => {
      if (!acc[lead.status]) {
        acc[lead.status] = 0
      }
      acc[lead.status] += 1
      return acc
    }, {})

    const conversionRate = leads.length > 0
      ? ((byStatus['converted'] || 0) / leads.length * 100).toFixed(2)
      : 0

    return {
      totalLeads: leads.length,
      bySource,
      byStatus,
      conversionRate,
      startDate,
      endDate,
    }
  }

  /**
   * 导出数据为 CSV
   */
  async exportToCSV(type: string, data: any[]) {
    if (data.length === 0) return ''

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header =>
          `"${String(row[header]).replace(/"/g, '""')}"`,
        ).join(','),
      ),
    ].join('\n')

    return csv
  }
}
