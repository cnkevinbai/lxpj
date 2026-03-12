/**
 * 合同统计服务 - 数据分析/报表生成
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contract, ContractStatus, ContractType } from './entities/contract.entity'

@Injectable()
export class ContractStatisticsService {
  constructor(
    @InjectRepository(Contract)
    private repository: Repository<Contract>,
  ) {}

  /**
   * 获取合同总览统计
   */
  async getOverviewStats() {
    const total = await this.repository.count()
    const byStatus = await this.getStatsByStatus()
    const byType = await this.getStatsByType()
    const amountStats = await this.getAmountStats()

    return {
      total,
      byStatus,
      byType,
      amount: amountStats,
    }
  }

  /**
   * 按状态统计
   */
  private async getStatsByStatus() {
    const result = await this.repository
      .createQueryBuilder('contract')
      .select('status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany()

    return result.reduce((acc, item) => {
      acc[item.status] = parseInt(item.count)
      return acc
    }, {} as Record<ContractStatus, number>)
  }

  /**
   * 按类型统计
   */
  private async getStatsByType() {
    const result = await this.repository
      .createQueryBuilder('contract')
      .select('type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('type')
      .getRawMany()

    return result.reduce((acc, item) => {
      acc[item.type] = parseInt(item.count)
      return acc
    }, {} as Record<ContractType, number>)
  }

  /**
   * 金额统计
   */
  private async getAmountStats() {
    const result = await this.repository
      .createQueryBuilder('contract')
      .select('SUM(amount)', 'total')
      .addSelect('AVG(amount)', 'avg')
      .addSelect('MAX(amount)', 'max')
      .addSelect('MIN(amount)', 'min')
      .where('status IN (:...statuses)', {
        statuses: ['effective', 'signed', 'approved'],
      })
      .getRawOne()

    return {
      total: parseFloat(result.total || 0),
      avg: parseFloat(result.avg || 0),
      max: parseFloat(result.max || 0),
      min: parseFloat(result.min || 0),
    }
  }

  /**
   * 获取趋势统计
   */
  async getTrendStats(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const trend = await this.repository
      .createQueryBuilder('contract')
      .select("DATE_TRUNC('day', created_at)", 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(amount)', 'amount')
      .where('created_at >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('day', created_at)")
      .orderBy('date', 'ASC')
      .getRawMany()

    return trend.map(item => ({
      date: item.date,
      count: parseInt(item.count),
      amount: parseFloat(item.amount || 0),
    }))
  }

  /**
   * 获取客户合同统计
   */
  async getCustomerStats(customerId?: string) {
    const query = this.repository
      .createQueryBuilder('contract')
      .select('customer_id', 'customerId')
      .addSelect('customer_name', 'customerName')
      .addSelect('COUNT(*)', 'contractCount')
      .addSelect('SUM(amount)', 'totalAmount')
      .groupBy('customer_id')
      .addGroupBy('customer_name')
      .orderBy('totalAmount', 'DESC')

    if (customerId) {
      query.where('customer_id = :customerId', { customerId })
    }

    const result = await query.getRawMany()

    return result.map(item => ({
      customerId: item.customerId,
      customerName: item.customerName,
      contractCount: parseInt(item.contractCount),
      totalAmount: parseFloat(item.totalAmount || 0),
    }))
  }

  /**
   * 获取部门合同统计
   */
  async getDepartmentStats() {
    const result = await this.repository
      .createQueryBuilder('contract')
      .select('owner_name', 'ownerName')
      .addSelect('COUNT(*)', 'contractCount')
      .addSelect('SUM(amount)', 'totalAmount')
      .addSelect('AVG(amount)', 'avgAmount')
      .where('status IN (:...statuses)', {
        statuses: ['effective', 'signed', 'approved'],
      })
      .groupBy('owner_name')
      .orderBy('totalAmount', 'DESC')
      .getRawMany()

    return result.map(item => ({
      ownerName: item.ownerName,
      contractCount: parseInt(item.contractCount),
      totalAmount: parseFloat(item.totalAmount || 0),
      avgAmount: parseFloat(item.avgAmount || 0),
    }))
  }

  /**
   * 生成合同报表
   */
  async generateReport(startDate?: Date, endDate?: Date) {
    const query = this.repository.createQueryBuilder('contract')

    if (startDate) {
      query.andWhere('contract.createdAt >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('contract.createdAt <= :endDate', { endDate })
    }

    const contracts = await query.getMany()

    return {
      summary: {
        total: contracts.length,
        totalAmount: contracts.reduce((sum, c) => sum + c.amount, 0),
        avgAmount: contracts.length > 0 ? contracts.reduce((sum, c) => sum + c.amount, 0) / contracts.length : 0,
      },
      byStatus: this.groupBy(contracts, 'status'),
      byType: this.groupBy(contracts, 'type'),
      byCustomer: this.groupBy(contracts, 'customerId'),
      list: contracts,
    }
  }

  /**
   * 分组统计
   */
  private groupBy(contracts: Contract[], key: keyof Contract) {
    return contracts.reduce((acc, contract) => {
      const value = contract[key] as string
      if (!acc[value]) {
        acc[value] = { count: 0, amount: 0 }
      }
      acc[value].count++
      acc[value].amount += contract.amount
      return acc
    }, {} as Record<string, { count: number; amount: number }>)
  }
}
