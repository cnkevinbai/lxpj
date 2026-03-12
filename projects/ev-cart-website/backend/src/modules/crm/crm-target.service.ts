/**
 * 销售目标服务 - 目标设定/进度跟踪
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export interface SalesTarget {
  id: string
  userId: string
  userName: string
  targetType: 'monthly' | 'quarterly' | 'yearly'
  amount: number
  actualAmount: number
  contractCount: number
  actualCount: number
  startDate: Date
  endDate: Date
  createdAt: Date
}

@Injectable()
export class CrmTargetService {
  constructor(
    @InjectRepository('sales_targets')
    private repository: Repository<any>,
  ) {}

  /**
   * 创建销售目标
   */
  async createTarget(data: Partial<SalesTarget>): Promise<any> {
    const target = this.repository.create({
      ...data,
      actualAmount: 0,
      actualCount: 0,
      createdAt: new Date(),
    })
    return this.repository.save(target)
  }

  /**
   * 获取用户目标
   */
  async getUserTargets(
    userId: string,
    targetType?: string,
  ) {
    const query = this.repository.createQueryBuilder('target')
      .where('target.userId = :userId', { userId })
      .orderBy('target.createdAt', 'DESC')

    if (targetType) {
      query.andWhere('target.targetType = :targetType', { targetType })
    }

    return query.getMany()
  }

  /**
   * 更新实际完成
   */
  async updateActual(targetId: string, actualAmount: number, actualCount: number) {
    return this.repository.update(targetId, { actualAmount, actualCount })
  }

  /**
   * 计算目标完成率
   */
  calculateProgress(target: SalesTarget) {
    return {
      amountProgress: target.amount > 0
        ? ((target.actualAmount / target.amount) * 100).toFixed(2)
        : '0',
      countProgress: target.contractCount > 0
        ? ((target.actualCount / target.contractCount) * 100).toFixed(2)
        : '0',
      remainingAmount: target.amount - target.actualAmount,
      remainingCount: target.contractCount - target.actualCount,
    }
  }

  /**
   * 获取团队目标统计
   */
  async getTeamStats(startDate?: Date, endDate?: Date) {
    const query = this.repository.createQueryBuilder('target')
      .select('SUM(target.amount)', 'totalTarget')
      .addSelect('SUM(target.actualAmount)', 'totalActual')
      .addSelect('SUM(target.contractCount)', 'totalContracts')
      .addSelect('SUM(target.actualCount)', 'totalActualCount')

    if (startDate) {
      query.andWhere('target.startDate >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('target.endDate <= :endDate', { endDate })
    }

    const result = await query.getRawOne()

    return {
      totalTarget: parseFloat(result.totalTarget || 0),
      totalActual: parseFloat(result.totalActual || 0),
      progress: result.totalTarget > 0
        ? ((result.totalActual / result.totalTarget) * 100).toFixed(2)
        : '0',
      totalContracts: parseInt(result.totalContracts || 0),
      totalActualCount: parseInt(result.totalActualCount || 0),
    }
  }

  /**
   * 获取目标完成情况排行
   */
  async getTargetRanking(period: 'monthly' | 'quarterly' | 'yearly') {
    return this.repository
      .createQueryBuilder('target')
      .select([
        'target.userId',
        'target.userName',
        'target.amount',
        'target.actualAmount',
        'target.contractCount',
        'target.actualCount',
      ])
      .where('target.targetType = :period', { period })
      .orderBy('target.actualAmount', 'DESC')
      .getMany()
  }
}
