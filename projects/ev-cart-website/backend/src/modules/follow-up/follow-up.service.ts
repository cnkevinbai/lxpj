import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThanOrEqual, LessThanOrEqual, IsNull } from 'typeorm'
import { FollowUpLog } from './entities/follow-up.entity'
import { CreateFollowUpDto, UpdateFollowUpDto } from './dto/follow-up.dto'

/**
 * 跟进记录服务
 */
@Injectable()
export class FollowUpService {
  constructor(
    @InjectRepository(FollowUpLog)
    private repository: Repository<FollowUpLog>,
  ) {}

  /**
   * 创建跟进记录
   */
  async create(createFollowUpDto: CreateFollowUpDto) {
    const followUp = this.repository.create(createFollowUpDto)
    return this.repository.save(followUp)
  }

  /**
   * 获取目标的所有跟进记录
   */
  async findByTarget(targetType: string, targetId: string, page: number = 1, limit: number = 20) {
    const [data, total] = await this.repository.findAndCount({
      where: { targetType, targetId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return {
      data,
      total,
      page,
      limit,
    }
  }

  /**
   * 获取业务员的跟进记录
   */
  async findByUser(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId }

    if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate)
    }
    if (endDate) {
      where.createdAt = LessThanOrEqual(endDate)
    }

    return this.repository.find({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })
  }

  /**
   * 获取待跟进记录
   */
  async getPendingFollowups(userId: string, days: number = 7) {
    const today = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + days)

    return this.repository.find({
      where: {
        userId,
        nextFollowupDate: MoreThanOrEqual(today.toISOString().split('T')[0]),
        status: 'pending',
      },
      relations: ['user'],
      order: { nextFollowupDate: 'ASC' },
    })
  }

  /**
   * 更新跟进记录
   */
  async update(id: string, updateFollowUpDto: UpdateFollowUpDto) {
    const followUp = await this.repository.findOne({ where: { id } })
    if (!followUp) {
      throw new NotFoundException('跟进记录不存在')
    }

    Object.assign(followUp, updateFollowUpDto)
    if (updateFollowUpDto.status === 'completed') {
      followUp.completedAt = new Date()
    }

    return this.repository.save(followUp)
  }

  /**
   * 删除跟进记录
   */
  async remove(id: string) {
    const followUp = await this.repository.findOne({ where: { id } })
    if (!followUp) {
      throw new NotFoundException('跟进记录不存在')
    }
    return this.repository.remove(followUp)
  }

  /**
   * 跟进统计
   */
  async getStats(userId: string, startDate: string, endDate: string) {
    const total = await this.repository.count({
      where: {
        userId,
        createdAt: MoreThanOrEqual(startDate),
        createdAt: LessThanOrEqual(endDate),
      },
    })

    const byType = await this.repository
      .createQueryBuilder('follow_up')
      .select('follow_up.followType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('follow_up.userId = :userId', { userId })
      .andWhere('follow_up.createdAt >= :startDate', { startDate })
      .andWhere('follow_up.createdAt <= :endDate', { endDate })
      .groupBy('follow_up.followType')
      .getRawMany()

    const pending = await this.repository.count({
      where: {
        userId,
        status: 'pending',
      },
    })

    return {
      total,
      byType,
      pending,
      startDate,
      endDate,
    }
  }

  /**
   * 团队跟进统计
   */
  async getTeamStats(startDate: string, endDate: string) {
    const teamStats = await this.repository
      .createQueryBuilder('follow_up')
      .select('follow_up.userId', 'userId')
      .addSelect('user.username', 'username')
      .addSelect('COUNT(*)', 'total')
      .innerJoin('user', 'user', 'user.id = follow_up.userId')
      .where('follow_up.createdAt >= :startDate', { startDate })
      .where('follow_up.createdAt <= :endDate', { endDate })
      .groupBy('follow_up.userId')
      .addGroupBy('user.username')
      .orderBy('total', 'DESC')
      .getRawMany()

    return {
      teamStats,
      startDate,
      endDate,
    }
  }
}
