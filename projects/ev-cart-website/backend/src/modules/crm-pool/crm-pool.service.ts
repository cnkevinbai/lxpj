import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, MoreThan, LessThan } from 'typeorm'
import { CustomerPool, PoolRule } from './entities/crm-pool.entity'
import { Customer } from '../customer/entities/customer.entity'

@Injectable()
export class CrmPoolService {
  constructor(
    @InjectRepository(CustomerPool)
    private poolRepository: Repository<CustomerPool>,
    @InjectRepository(PoolRule)
    private ruleRepository: Repository<PoolRule>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) {}

  /**
   * 获取公海池客户列表
   */
  async getPoolCustomers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      source?: string
      level?: string
      status?: string
    },
  ) {
    const query = this.poolRepository.createQueryBuilder('pool')
      .orderBy('pool.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.status) {
      query.andWhere('pool.status = :status', { status: filters.status })
    } else {
      query.andWhere('pool.status = :status', { status: 'available' })
    }

    if (filters?.source) {
      query.andWhere('pool.source = :source', { source: filters.source })
    }
    if (filters?.level) {
      query.andWhere('pool.level = :level', { level: filters.level })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 领取公海客户
   */
  async claimCustomer(
    customerId: string,
    userId: string,
    userName: string,
    reason?: string,
  ): Promise<CustomerPool> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // 查找公海池记录
      const pool = await queryRunner.manager.findOne(CustomerPool, {
        where: { customerId, status: 'available' },
      })

      if (!pool) {
        throw new BadRequestException('客户不在公海池或已被领取')
      }

      // 检查领取限制
      await this.checkClaimLimit(userId)

      // 更新客户所有者
      await queryRunner.manager.update(
        Customer,
        { id: customerId },
        { ownerId: userId },
      )

      // 更新公海池记录
      pool.status = 'claimed'
      pool.currentOwnerId = userId
      pool.currentOwnerName = userName
      pool.claimedAt = new Date()
      pool.claimCount += 1
      pool.returnReason = undefined

      const saved = await queryRunner.manager.save(CustomerPool, pool)

      await queryRunner.commitTransaction()
      return saved
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  /**
   * 退回客户到公海
   */
  async returnCustomer(
    customerId: string,
    userId: string,
    userName: string,
    reason: string,
  ): Promise<CustomerPool> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // 查找客户
      const customer = await queryRunner.manager.findOne(Customer, {
        where: { id: customerId },
      })

      if (!customer) {
        throw new BadRequestException('客户不存在')
      }

      // 检查权限
      if (customer.ownerId !== userId) {
        throw new ForbiddenException('无权退回该客户')
      }

      // 更新客户所有者
      await queryRunner.manager.update(
        Customer,
        { id: customerId },
        { ownerId: null },
      )

      // 查找或创建公海池记录
      let pool = await queryRunner.manager.findOne(CustomerPool, {
        where: { customerId },
      })

      if (pool) {
        pool.status = 'available'
        pool.returnAt = new Date()
        pool.returnReason = reason
        pool.previousOwnerId = userId
        pool.previousOwnerName = userName
        pool.currentOwnerId = null
        pool.currentOwnerName = null
        pool.claimedAt = null
      } else {
        pool = queryRunner.manager.create(CustomerPool, {
          customerId,
          customerName: customer.name,
          source: customer.source,
          level: customer.level,
          previousOwnerId: userId,
          previousOwnerName: userName,
          returnAt: new Date(),
          returnReason: reason,
          status: 'available',
        })
      }

      const saved = await queryRunner.manager.save(CustomerPool, pool)

      await queryRunner.commitTransaction()
      return saved
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  /**
   * 检查领取限制
   */
  private async checkClaimLimit(userId: string): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    // 今日领取数量
    const todayCount = await this.poolRepository.count({
      where: {
        currentOwnerId: userId,
        claimedAt: MoreThan(today),
      },
    })

    // 本月领取数量
    const monthCount = await this.poolRepository.count({
      where: {
        currentOwnerId: userId,
        claimedAt: MoreThan(monthStart),
      },
    })

    // 获取领取限制规则
    const claimLimitRule = await this.ruleRepository.findOne({
      where: { ruleType: 'claim_limit', enabled: true },
    })

    if (claimLimitRule) {
      const { maxClaimPerDay = 10, maxClaimPerMonth = 100 } = claimLimitRule.conditions

      if (todayCount >= maxClaimPerDay) {
        throw new ForbiddenException(`今日领取已达上限（${maxClaimPerDay}个）`)
      }

      if (monthCount >= maxClaimPerMonth) {
        throw new ForbiddenException(`本月领取已达上限（${maxClaimPerMonth}个）`)
      }
    }
  }

  /**
   * 获取公海池规则
   */
  async getPoolRules(): Promise<PoolRule[]> {
    return this.ruleRepository.find({
      where: { enabled: true },
      order: { priority: 'DESC' },
    })
  }

  /**
   * 创建公海池规则
   */
  async createPoolRule(ruleData: Partial<PoolRule>): Promise<PoolRule> {
    const rule = this.ruleRepository.create(ruleData)
    return this.ruleRepository.save(rule)
  }

  /**
   * 更新公海池规则
   */
  async updatePoolRule(id: string, ruleData: Partial<PoolRule>): Promise<PoolRule> {
    await this.ruleRepository.update(id, ruleData)
    return this.ruleRepository.findOne({ where: { id } })
  }

  /**
   * 获取公海池统计
   */
  async getPoolStats() {
    const total = await this.poolRepository.count()
    const available = await this.poolRepository.count({ where: { status: 'available' } })
    const claimed = await this.poolRepository.count({ where: { status: 'claimed' } })

    // 按来源统计
    const bySource = await this.poolRepository
      .createQueryBuilder('pool')
      .select('pool.source', 'source')
      .addSelect('COUNT(*)', 'count')
      .groupBy('pool.source')
      .getRawMany()

    // 按等级统计
    const byLevel = await this.poolRepository
      .createQueryBuilder('pool')
      .select('pool.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('pool.level')
      .getRawMany()

    return {
      total,
      available,
      claimed,
      bySource,
      byLevel,
    }
  }

  /**
   * 自动退回检查（定时任务调用）
   */
  async checkAutoReturn(): Promise<number> {
    const now = new Date()
    const noFollowUpDays = 15 // 15 天无跟进
    const noProgressDays = 30 // 30 天无进展

    // 这里简化实现，实际应该检查跟进记录
    // 查找需要自动退回的客户
    const needReturn = await this.poolRepository.find({
      where: {
        status: 'claimed',
        claimedAt: LessThan(new Date(now.getTime() - noProgressDays * 24 * 60 * 60 * 1000)),
      },
    })

    // 自动退回逻辑（可完善）
    return needReturn.length
  }
}
