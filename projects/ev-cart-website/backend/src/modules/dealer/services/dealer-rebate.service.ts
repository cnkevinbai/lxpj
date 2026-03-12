import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { DealerRebate } from './entities/dealer-rebate.entity'
import { Dealer } from './dealer.entity'
import { CreateDealerRebateDto, UpdateDealerRebateDto, CalculateRebateDto } from './dto/dealer-rebate.dto'

@Injectable()
export class DealerRebateService {
  constructor(
    @InjectRepository(DealerRebate)
    private rebateRepo: Repository<DealerRebate>,
    @InjectRepository(Dealer)
    private dealerRepo: Repository<Dealer>,
  ) {}

  /**
   * 创建返利记录
   */
  async create(dto: CreateDealerRebateDto, userId: string, userName: string): Promise<DealerRebate> {
    const dealer = await this.dealerRepo.findOne({ where: { id: dto.dealerId } })
    if (!dealer) {
      throw new NotFoundException('经销商不存在')
    }

    const rebate = this.rebateRepo.create({
      ...dto,
      createdBy: userId,
      createdByName: userName,
      status: 'pending',
    })

    return this.rebateRepo.save(rebate)
  }

  /**
   * 获取返利列表
   */
  async findAll(params: {
    page?: number
    limit?: number
    dealerId?: string
    period?: string
    rebateType?: string
    status?: string
  }) {
    const { page = 1, limit = 20, dealerId, period, rebateType, status } = params

    const query = this.rebateRepo.createQueryBuilder('rebate')
      .leftJoinAndSelect('rebate.dealer', 'dealer')

    if (dealerId) {
      query.andWhere('rebate.dealerId = :dealerId', { dealerId })
    }
    if (period) {
      query.andWhere('rebate.period = :period', { period })
    }
    if (rebateType) {
      query.andWhere('rebate.rebateType = :rebateType', { rebateType })
    }
    if (status) {
      query.andWhere('rebate.status = :status', { status })
    }

    query.orderBy('rebate.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return { data, total, page, limit }
  }

  /**
   * 获取返利详情
   */
  async findOne(id: string): Promise<DealerRebate> {
    const rebate = await this.rebateRepo.findOne({
      where: { id },
      relations: ['dealer'],
    })
    if (!rebate) {
      throw new NotFoundException('返利记录不存在')
    }
    return rebate
  }

  /**
   * 获取经销商返利历史
   */
  async findByDealer(dealerId: string, limit: number = 10): Promise<DealerRebate[]> {
    return this.rebateRepo.find({
      where: { dealerId },
      relations: ['dealer'],
      order: { period: 'DESC' },
      take: limit,
    })
  }

  /**
   * 更新返利
   */
  async update(id: string, dto: UpdateDealerRebateDto, userId: string, userName: string): Promise<DealerRebate> {
    const rebate = await this.findOne(id)
    Object.assign(rebate, dto)
    return this.rebateRepo.save(rebate)
  }

  /**
   * 审批返利
   */
  async approve(id: string, userId: string, userName: string): Promise<DealerRebate> {
    const rebate = await this.findOne(id)
    rebate.status = 'approved'
    rebate.approvedBy = userId
    rebate.approvedByName = userName
    rebate.approvedAt = new Date()
    return this.rebateRepo.save(rebate)
  }

  /**
   * 发放返利
   */
  async pay(id: string, paymentMethod: string, paymentRef?: string): Promise<DealerRebate> {
    const rebate = await this.findOne(id)
    if (rebate.status !== 'approved') {
      throw new BadRequestException('只能发放已审批的返利')
    }

    rebate.status = 'paid'
    rebate.paymentMethod = paymentMethod
    rebate.paymentRef = paymentRef
    rebate.paidAt = new Date()

    // 更新经销商累计返利
    const dealer = await this.dealerRepo.findOne({ where: { id: rebate.dealerId } })
    if (dealer) {
      dealer.totalRebate = (dealer.totalRebate || 0) + rebate.amount
      await this.dealerRepo.save(dealer)
    }

    return this.rebateRepo.save(rebate)
  }

  /**
   * 取消返利
   */
  async cancel(id: string, reason: string): Promise<DealerRebate> {
    const rebate = await this.findOne(id)
    if (rebate.status === 'paid') {
      throw new BadRequestException('已发放的返利不能取消')
    }
    rebate.status = 'cancelled'
    rebate.notes = reason
    return this.rebateRepo.save(rebate)
  }

  /**
   * 删除返利
   */
  async remove(id: string): Promise<void> {
    const rebate = await this.findOne(id)
    if (rebate.status !== 'pending') {
      throw new BadRequestException('只能删除待处理的返利')
    }
    await this.rebateRepo.delete(id)
  }

  /**
   * 自动计算返利
   */
  async calculate(dto: CalculateRebateDto, userId: string, userName: string): Promise<DealerRebate[]> {
    const { dealerIds, period, rebateType = 'all' } = dto

    // 获取经销商列表
    const dealers = dealerIds
      ? await this.dealerRepo.findByIds(dealerIds)
      : await this.dealerRepo.find({ where: { status: 'active' } })

    const results: DealerRebate[] = []

    for (const dealer of dealers) {
      // 计算销售返利
      if (rebateType === 'all' || rebateType === 'sales') {
        const salesRebate = await this.calculateSalesRebate(dealer, period, userId, userName)
        if (salesRebate) {
          results.push(salesRebate)
        }
      }

      // 计算增长返利（仅年度）
      if ((rebateType === 'all' || rebateType === 'growth') && period.includes('Y')) {
        const growthRebate = await this.calculateGrowthRebate(dealer, period, userId, userName)
        if (growthRebate) {
          results.push(growthRebate)
        }
      }
    }

    return results
  }

  /**
   * 获取统计数据
   */
  async getStatistics(period?: string, rebateType?: string) {
    const query = this.rebateRepo.createQueryBuilder('rebate')

    if (period) {
      query.where('rebate.period = :period', { period })
    }
    if (rebateType) {
      query.andWhere('rebate.rebateType = :rebateType', { rebateType })
    }

    const total = await query.getCount()
    const totalAmount = await query
      .select('SUM(rebate.amount)', 'sum')
      .getRawOne()
    const paidAmount = await query
      .select('SUM(rebate.amount)', 'sum')
      .where('rebate.status = :status', { status: 'paid' })
      .getRawOne()
    const pendingAmount = await query
      .select('SUM(rebate.amount)', 'sum')
      .where('rebate.status = :status', { status: 'pending' })
      .getRawOne()

    const byType = await query
      .select('rebate.rebateType', 'type')
      .addSelect('SUM(rebate.amount)', 'amount')
      .addSelect('COUNT(*)', 'count')
      .groupBy('rebate.rebateType')
      .getRawMany()

    return {
      total,
      totalAmount: parseFloat(totalAmount?.sum) || 0,
      paidAmount: parseFloat(paidAmount?.sum) || 0,
      pendingAmount: parseFloat(pendingAmount?.sum) || 0,
      byType,
    }
  }

  /**
   * 计算销售返利
   */
  private async calculateSalesRebate(
    dealer: Dealer,
    period: string,
    userId: string,
    userName: string,
  ): Promise<DealerRebate | null> {
    // 检查是否已存在
    const existing = await this.rebateRepo.findOne({
      where: { dealerId: dealer.id, period, rebateType: 'sales' },
    })
    if (existing) return null

    // 根据等级确定返点比例
    const rebateRates: Record<string, number> = {
      trial: 0.01,
      standard: 0.02,
      gold: 0.03,
      platinum: 0.05,
      strategic: 0.08,
    }

    const rate = rebateRates[dealer.level] || 0.02
    const amount = (dealer.salesActual || 0) * rate

    if (amount <= 0) return null

    return this.rebateRepo.save(
      this.rebateRepo.create({
        dealerId: dealer.id,
        rebateType: 'sales',
        period,
        amount,
        basisAmount: dealer.salesActual,
        rebateRate: rate,
        calculationFormula: `销售额 × ${rate * 100}%`,
        createdBy: userId,
        createdByName: userName,
        status: 'pending',
      }),
    )
  }

  /**
   * 计算增长返利
   */
  private async calculateGrowthRebate(
    dealer: Dealer,
    period: string,
    userId: string,
    userName: string,
  ): Promise<DealerRebate | null> {
    // 这里应该查询去年的销售数据，简化处理
    const lastYearSales = dealer.salesActual || 0
    const currentSales = dealer.salesActual || 0
    const growth = currentSales - lastYearSales

    if (growth <= 0) return null

    const rebateRates: Record<string, number> = {
      gold: 0.01,
      platinum: 0.02,
      strategic: 0.03,
    }

    const rate = rebateRates[dealer.level] || 0
    if (rate === 0) return null

    const amount = growth * rate

    return this.rebateRepo.save(
      this.rebateRepo.create({
        dealerId: dealer.id,
        rebateType: 'growth',
        period,
        amount,
        basisAmount: growth,
        rebateRate: rate,
        calculationFormula: `增长额 × ${rate * 100}%`,
        createdBy: userId,
        createdByName: userName,
        status: 'pending',
      }),
    )
  }
}
