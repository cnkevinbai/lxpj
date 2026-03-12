/**
 * 公海池服务 - 客户公共资源管理
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Customer } from '../customer/entities/customer.entity'

export interface PoolConfig {
  autoReleaseDays: number  // 多少天无跟进自动释放
  maxHoldDays: number      // 最多持有天数
  maxCustomersPerUser: number  // 每人最多持有客户数
}

@Injectable()
export class CrmPoolService {
  private defaultConfig: PoolConfig = {
    autoReleaseDays: 15,
    maxHoldDays: 90,
    maxCustomersPerUser: 50,
  }

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  /**
   * 获取公海池客户列表
   */
  async getPoolCustomers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      industry?: string
      level?: string
      region?: string
    },
  ) {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.ownerId IS NULL')
      .orderBy('customer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.industry) {
      query.andWhere('customer.industry = :industry', { industry: filters.industry })
    }
    if (filters?.level) {
      query.andWhere('customer.level = :level', { level: filters.level })
    }
    if (filters?.region) {
      query.andWhere('customer.region LIKE :region', { region: `%${filters.region}%` })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 领取公海客户
   */
  async claimCustomer(customerId: string, userId: string, userName: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } })
    if (!customer) {
      throw new Error('客户不存在')
    }
    if (customer.ownerId) {
      throw new Error('客户已被领取')
    }

    // 检查用户持有数量
    const userCustomerCount = await this.customerRepository.count({
      where: { ownerId: userId },
    })

    if (userCustomerCount >= this.defaultConfig.maxCustomersPerUser) {
      throw new Error(`您已持有最多${this.defaultConfig.maxCustomersPerUser}个客户`)
    }

    customer.ownerId = userId
    customer.ownerName = userName
    customer.holdStartedAt = new Date()
    customer.status = 'following'

    return this.customerRepository.save(customer)
  }

  /**
   * 释放客户到公海
   */
  async releaseCustomer(customerId: string, userId: string, reason?: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId, ownerId: userId },
    })
    if (!customer) {
      throw new Error('客户不存在或不属于您')
    }

    customer.ownerId = null
    customer.ownerName = null
    customer.holdStartedAt = null
    customer.status = 'pool'
    customer.releaseReason = reason

    return this.customerRepository.save(customer)
  }

  /**
   * 自动释放超期客户
   */
  async autoReleaseExpiredCustomers(): Promise<number> {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() - this.defaultConfig.autoReleaseDays)

    const result = await this.customerRepository
      .createQueryBuilder()
      .update(Customer)
      .set({
        ownerId: null,
        ownerName: null,
        holdStartedAt: null,
        status: 'pool',
        releaseReason: '超期自动释放',
      })
      .where('ownerId IS NOT NULL')
      .andWhere('lastFollowUpAt < :expiryDate', { expiryDate })
      .execute()

    return result.affected || 0
  }

  /**
   * 获取用户持有客户统计
   */
  async getUserStats(userId: string) {
    const total = await this.customerRepository.count({
      where: { ownerId: userId },
    })

    const expiringSoon = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.ownerId = :userId', { userId })
      .andWhere('customer.lastFollowUpAt < :date', {
        date: new Date(Date.now() - this.defaultConfig.autoReleaseDays * 1000 * 60 * 60 * 24),
      })
      .getCount()

    return {
      total,
      expiringSoon,
      limit: this.defaultConfig.maxCustomersPerUser,
      remaining: this.defaultConfig.maxCustomersPerUser - total,
    }
  }

  /**
   * 公海池统计
   */
  async getPoolStats() {
    const total = await this.customerRepository.count({
      where: { ownerId: null },
    })

    const byIndustry = await this.customerRepository
      .createQueryBuilder('customer')
      .select('industry', 'industry')
      .addSelect('COUNT(*)', 'count')
      .where('ownerId IS NULL')
      .groupBy('industry')
      .getRawMany()

    const byLevel = await this.customerRepository
      .createQueryBuilder('customer')
      .select('level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('ownerId IS NULL')
      .groupBy('level')
      .getRawMany()

    return {
      total,
      byIndustry: byIndustry.reduce((acc, item) => {
        acc[item.industry] = parseInt(item.count)
        return acc
      }, {}),
      byLevel: byLevel.reduce((acc, item) => {
        acc[item.level] = parseInt(item.count)
        return acc
      }, {}),
    }
  }
}
