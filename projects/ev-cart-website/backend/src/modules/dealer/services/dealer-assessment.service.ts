import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { DealerAssessment } from './entities/dealer-assessment.entity'
import { CreateDealerAssessmentDto, UpdateDealerAssessmentDto, CalculateAssessmentDto } from './dto/dealer-assessment.dto'
import { Dealer } from './dealer.entity'

@Injectable()
export class DealerAssessmentService {
  constructor(
    @InjectRepository(DealerAssessment)
    private assessmentRepo: Repository<DealerAssessment>,
    @InjectRepository(Dealer)
    private dealerRepo: Repository<Dealer>,
  ) {}

  /**
   * 创建考核记录
   */
  async create(dto: CreateDealerAssessmentDto, userId: string, userName: string): Promise<DealerAssessment> {
    // 验证经销商存在
    const dealer = await this.dealerRepo.findOne({ where: { id: dto.dealerId } })
    if (!dealer) {
      throw new NotFoundException('经销商不存在')
    }

    // 检查是否已存在同期间考核
    const existing = await this.assessmentRepo.findOne({
      where: { dealerId: dto.dealerId, period: dto.period, periodType: dto.periodType },
    })
    if (existing) {
      throw new BadRequestException('该期间考核已存在')
    }

    // 计算总分和等级
    const totalScore = this.calculateTotalScore(dto)
    const grade = this.calculateGrade(totalScore)

    // 计算目标达成率
    const targetAchievementRate = dto.salesTarget && dto.salesActual
      ? (dto.salesActual / dto.salesTarget) * 100
      : null

    const assessment = this.assessmentRepo.create({
      ...dto,
      totalScore,
      grade,
      targetAchievementRate,
      assessedBy: userId,
      assessedByName: userName,
      status: 'draft',
    })

    return this.assessmentRepo.save(assessment)
  }

  /**
   * 获取考核列表
   */
  async findAll(params: {
    page?: number
    limit?: number
    dealerId?: string
    period?: string
    periodType?: string
    grade?: string
    status?: string
  }) {
    const { page = 1, limit = 20, dealerId, period, periodType, grade, status } = params

    const query = this.assessmentRepo.createQueryBuilder('assessment')
      .leftJoinAndSelect('assessment.dealer', 'dealer')

    if (dealerId) {
      query.andWhere('assessment.dealerId = :dealerId', { dealerId })
    }
    if (period) {
      query.andWhere('assessment.period = :period', { period })
    }
    if (periodType) {
      query.andWhere('assessment.periodType = :periodType', { periodType })
    }
    if (grade) {
      query.andWhere('assessment.grade = :grade', { grade })
    }
    if (status) {
      query.andWhere('assessment.status = :status', { status })
    }

    query.orderBy('assessment.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return { data, total, page, limit }
  }

  /**
   * 获取考核详情
   */
  async findOne(id: string): Promise<DealerAssessment> {
    const assessment = await this.assessmentRepo.findOne({
      where: { id },
      relations: ['dealer'],
    })
    if (!assessment) {
      throw new NotFoundException('考核记录不存在')
    }
    return assessment
  }

  /**
   * 获取经销商考核历史
   */
  async findByDealer(dealerId: string, limit: number = 10): Promise<DealerAssessment[]> {
    return this.assessmentRepo.find({
      where: { dealerId },
      relations: ['dealer'],
      order: { period: 'DESC' },
      take: limit,
    })
  }

  /**
   * 更新考核
   */
  async update(id: string, dto: UpdateDealerAssessmentDto, userId: string, userName: string): Promise<DealerAssessment> {
    const assessment = await this.findOne(id)

    // 如果更新了分数，重新计算总分和等级
    if (dto.scores) {
      assessment.scores = { ...assessment.scores, ...dto.scores }
      dto.totalScore = this.calculateTotalScore({ scores: assessment.scores } as any)
      dto.grade = this.calculateGrade(dto.totalScore)
    }

    Object.assign(assessment, dto, {
      assessedBy: userId,
      assessedByName: userName,
    })

    return this.assessmentRepo.save(assessment)
  }

  /**
   * 提交考核
   */
  async submit(id: string): Promise<DealerAssessment> {
    const assessment = await this.findOne(id)
    assessment.status = 'submitted'
    return this.assessmentRepo.save(assessment)
  }

  /**
   * 审批考核
   */
  async approve(id: string, userId: string, userName: string, comments?: string): Promise<DealerAssessment> {
    const assessment = await this.findOne(id)
    assessment.status = 'approved'
    assessment.approvedBy = userId
    assessment.approvedByName = userName
    assessment.approvedAt = new Date()
    assessment.comments = comments || assessment.comments

    // 更新经销商信息
    await this.updateDealerInfo(assessment)

    return this.assessmentRepo.save(assessment)
  }

  /**
   * 拒绝考核
   */
  async reject(id: string, userId: string, userName: string, reason: string): Promise<DealerAssessment> {
    const assessment = await this.findOne(id)
    assessment.status = 'rejected'
    assessment.approvedBy = userId
    assessment.approvedByName = userName
    assessment.approvedAt = new Date()
    assessment.comments = reason
    return this.assessmentRepo.save(assessment)
  }

  /**
   * 删除考核
   */
  async remove(id: string): Promise<void> {
    const assessment = await this.findOne(id)
    if (assessment.status !== 'draft') {
      throw new BadRequestException('只能删除草稿状态的考核')
    }
    await this.assessmentRepo.delete(id)
  }

  /**
   * 自动计算考核
   */
  async calculate(dto: CalculateAssessmentDto, userId: string, userName: string): Promise<DealerAssessment[]> {
    const { dealerIds, period, periodType } = dto

    // 获取经销商列表
    const dealers = dealerIds
      ? await this.dealerRepo.findByIds(dealerIds)
      : await this.dealerRepo.find({ where: { status: 'active' } })

    const results: DealerAssessment[] = []

    for (const dealer of dealers) {
      // 检查是否已存在
      const existing = await this.assessmentRepo.findOne({
        where: { dealerId: dealer.id, period, periodType },
      })
      if (existing) continue

      // 计算考核数据
      const assessment = await this.create({
        dealerId: dealer.id,
        period,
        periodType,
        salesTarget: dealer.salesTarget || 0,
        salesActual: dealer.salesActual || 0,
        scores: {},
      }, userId, userName)

      results.push(assessment)
    }

    return results
  }

  /**
   * 获取统计数据
   */
  async getStatistics(period?: string, periodType?: string) {
    const query = this.assessmentRepo.createQueryBuilder('assessment')

    if (period) {
      query.where('assessment.period = :period', { period })
    }
    if (periodType) {
      query.andWhere('assessment.periodType = :periodType', { periodType })
    }

    const total = await query.getCount()
    const avgScore = await query
      .select('AVG(assessment.totalScore)', 'avg')
      .getRawOne()

    const gradeDistribution = await query
      .select('assessment.grade', 'grade')
      .addSelect('COUNT(*)', 'count')
      .groupBy('assessment.grade')
      .getRawMany()

    const statusDistribution = await query
      .select('assessment.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('assessment.status')
      .getRawMany()

    return {
      total,
      averageScore: parseFloat(avgScore?.avg) || 0,
      gradeDistribution,
      statusDistribution,
    }
  }

  /**
   * 计算总分
   */
  private calculateTotalScore(dto: CreateDealerAssessmentDto): number {
    if (!dto.scores || Object.keys(dto.scores).length === 0) {
      // 如果没有明细分数，使用简化计算
      let score = 0
      if (dto.targetAchievementRate) {
        score += Math.min(dto.targetAchievementRate, 100) * 0.4
      }
      if (dto.customerSatisfaction) {
        score += dto.customerSatisfaction * 0.2
      }
      if (dto.complianceScore) {
        score += dto.complianceScore * 0.2
      }
      if (dto.newCustomersCount) {
        score += Math.min(dto.newCustomersCount * 5, 20)
      }
      return Math.round(score * 100) / 100
    }

    // 使用明细分数计算
    const weights: Record<string, number> = {
      sales: 0.4,
      market: 0.2,
      service: 0.2,
      compliance: 0.1,
      cooperation: 0.1,
    }

    let total = 0
    for (const [category, score] of Object.entries(dto.scores)) {
      total += score * (weights[category] || 0.1)
    }
    return Math.round(total * 100) / 100
  }

  /**
   * 计算等级
   */
  private calculateGrade(score: number): string {
    if (score >= 95) return 'S'
    if (score >= 85) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    return 'D'
  }

  /**
   * 更新经销商信息
   */
  private async updateDealerInfo(assessment: DealerAssessment): Promise<void> {
    const dealer = await this.dealerRepo.findOne({ where: { id: assessment.dealerId } })
    if (!dealer) return

    dealer.performanceScore = assessment.totalScore
    dealer.lastAssessmentDate = assessment.approvedAt
    dealer.lastAssessmentGrade = assessment.grade
    dealer.assessmentCount = (dealer.assessmentCount || 0) + 1

    // 更新连续合格季度数
    if (['A', 'S', 'B'].includes(assessment.grade)) {
      dealer.consecutiveQualifiedQuarters = (dealer.consecutiveQualifiedQuarters || 0) + 1
    } else {
      dealer.consecutiveQualifiedQuarters = 0
    }

    await this.dealerRepo.save(dealer)
  }
}
