import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DealerLevelHistory } from './entities/dealer-level-history.entity'
import { Dealer } from './dealer.entity'

@Injectable()
export class DealerLevelService {
  constructor(
    @InjectRepository(DealerLevelHistory)
    private historyRepo: Repository<DealerLevelHistory>,
    @InjectRepository(Dealer)
    private dealerRepo: Repository<Dealer>,
  ) {}

  /**
   * 调整经销商等级
   */
  async changeLevel(
    dealerId: string,
    newLevel: string,
    reason: string,
    reasonType: string,
    userId: string,
    userName: string,
    effectiveDate?: Date,
  ): Promise<DealerLevelHistory> {
    const dealer = await this.dealerRepo.findOne({ where: { id: dealerId } })
    if (!dealer) {
      throw new NotFoundException('经销商不存在')
    }

    const oldLevel = dealer.level
    dealer.level = newLevel

    const history = this.historyRepo.create({
      dealerId,
      oldLevel,
      newLevel,
      reason,
      reasonType,
      approvedBy: userId,
      approvedByName: userName,
      effectiveDate: effectiveDate || new Date(),
    })

    await Promise.all([
      this.dealerRepo.save(dealer),
      this.historyRepo.save(history),
    ])

    return history
  }

  /**
   * 自动评估等级
   */
  async evaluateAndAdjust(
    dealerId: string,
    userId: string,
    userName: string,
  ): Promise<{ adjusted: boolean; oldLevel: string; newLevel: string; reason: string }> {
    const dealer = await this.dealerRepo.findOne({ where: { id: dealerId } })
    if (!dealer) {
      throw new NotFoundException('经销商不存在')
    }

    const oldLevel = dealer.level
    let newLevel = oldLevel
    let reason = ''
    let reasonType = ''

    // 评估逻辑
    const score = dealer.performanceScore || 0
    const consecutiveQuarters = dealer.consecutiveQualifiedQuarters || 0
    const salesActual = dealer.salesActual || 0

    // 升级条件
    if (score >= 90 && consecutiveQuarters >= 2) {
      if (oldLevel === 'trial' && salesActual >= 500000) {
        newLevel = 'standard'
        reason = '连续 2 季度考核优秀，年销售额达标'
        reasonType = 'promotion'
      } else if (oldLevel === 'standard' && salesActual >= 2000000) {
        newLevel = 'gold'
        reason = '连续 2 季度考核优秀，年销售额达标'
        reasonType = 'promotion'
      } else if (oldLevel === 'gold' && salesActual >= 5000000) {
        newLevel = 'platinum'
        reason = '连续 2 季度考核优秀，年销售额达标'
        reasonType = 'promotion'
      } else if (oldLevel === 'platinum' && salesActual >= 10000000) {
        newLevel = 'strategic'
        reason = '连续 2 季度考核优秀，年销售额达标'
        reasonType = 'promotion'
      }
    }

    // 降级条件
    if (score < 60 || consecutiveQuarters === 0 && score < 70) {
      if (oldLevel === 'strategic') {
        newLevel = 'platinum'
        reason = '考核不达标'
        reasonType = 'demotion'
      } else if (oldLevel === 'platinum') {
        newLevel = 'gold'
        reason = '考核不达标'
        reasonType = 'demotion'
      } else if (oldLevel === 'gold') {
        newLevel = 'standard'
        reason = '考核不达标'
        reasonType = 'demotion'
      } else if (oldLevel === 'standard') {
        newLevel = 'trial'
        reason = '考核不达标'
        reasonType = 'demotion'
      }
    }

    // 如果等级有变化，执行调整
    if (newLevel !== oldLevel) {
      await this.changeLevel(dealerId, newLevel, reason, reasonType, userId, userName)
      return { adjusted: true, oldLevel, newLevel, reason }
    }

    return { adjusted: false, oldLevel, newLevel: oldLevel, reason: '无需调整' }
  }

  /**
   * 获取等级变更历史
   */
  async getHistory(dealerId: string, limit: number = 20): Promise<DealerLevelHistory[]> {
    return this.historyRepo.find({
      where: { dealerId },
      order: { effectiveDate: 'DESC' },
      take: limit,
    })
  }

  /**
   * 获取所有历史记录
   */
  async findAll(params: {
    page?: number
    limit?: number
    oldLevel?: string
    newLevel?: string
    reasonType?: string
  }) {
    const { page = 1, limit = 20, oldLevel, newLevel, reasonType } = params

    const query = this.historyRepo.createQueryBuilder('history')
      .leftJoinAndSelect('history.dealer', 'dealer')

    if (oldLevel) {
      query.andWhere('history.oldLevel = :oldLevel', { oldLevel })
    }
    if (newLevel) {
      query.andWhere('history.newLevel = :newLevel', { newLevel })
    }
    if (reasonType) {
      query.andWhere('history.reasonType = :reasonType', { reasonType })
    }

    query.orderBy('history.effectiveDate', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return { data, total, page, limit }
  }

  /**
   * 获取统计数据
   */
  async getStatistics() {
    const total = await this.historyRepo.count()
    const promotions = await this.historyRepo.count({ where: { reasonType: 'promotion' } })
    const demotions = await this.historyRepo.count({ where: { reasonType: 'demotion' } })

    const byOldLevel = await this.historyRepo
      .createQueryBuilder('history')
      .select('history.oldLevel', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('history.oldLevel')
      .getRawMany()

    const byNewLevel = await this.historyRepo
      .createQueryBuilder('history')
      .select('history.newLevel', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('history.newLevel')
      .getRawMany()

    return {
      total,
      promotions,
      demotions,
      byOldLevel,
      byNewLevel,
    }
  }
}
