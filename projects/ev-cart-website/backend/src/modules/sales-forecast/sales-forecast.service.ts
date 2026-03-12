import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between, MoreThan } from 'typeorm'
import { Opportunity } from '../opportunity/entities/opportunity.entity'
import { Order } from '../order/entities/order.entity'

export interface SalesForecast {
  period: string
  predictedAmount: number
  confidence: number
  breakdown: {
    byStage: Array<{ stage: string; amount: number; probability: number }>
    bySalesperson: Array<{ name: string; amount: number }>
    byProduct: Array<{ product: string; amount: number }>
  }
  trends: {
    growth: number
    conversionRate: number
    avgDealSize: number
    salesCycle: number
  }
  recommendations: string[]
}

@Injectable()
export class SalesForecastService {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * 获取销售预测
   */
  async getForecast(period: 'week' | 'month' | 'quarter' = 'month'): Promise<SalesForecast> {
    const now = new Date()
    const startDate = this.getPeriodStart(now, period)

    // 获取商机数据
    const opportunities = await this.opportunityRepository.find({
      where: {
        createdAt: MoreThan(startDate),
      },
      relations: ['owner'],
    })

    // 按阶段统计
    const byStage = this.calculateByStage(opportunities)

    // 按销售人员统计
    const bySalesperson = this.calculateBySalesperson(opportunities)

    // 计算预测金额
    const predictedAmount = byStage.reduce(
      (sum, stage) => sum + stage.amount * (stage.probability / 100),
      0,
    )

    // 计算置信度
    const confidence = this.calculateConfidence(opportunities)

    // 计算趋势
    const trends = await this.calculateTrends(startDate)

    // 生成推荐
    const recommendations = this.generateRecommendations(opportunities, trends)

    return {
      period: `${period}ly`,
      predictedAmount: Math.round(predictedAmount * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      breakdown: {
        byStage,
        bySalesperson,
        byProduct: [], // 简化实现
      },
      trends,
      recommendations,
    }
  }

  /**
   * 按阶段统计
   */
  private calculateByStage(opportunities: Opportunity[]): Array<{ stage: string; amount: number; probability: number }> {
    const stageMap = new Map<string, { amount: number; probability: number }>()

    opportunities.forEach((opp) => {
      const stage = opp.stage || 'Unknown'
      const existing = stageMap.get(stage) || { amount: 0, probability: opp.probability || 0 }
      stageMap.set(stage, {
        amount: existing.amount + (opp.estimatedAmount || 0),
        probability: existing.probability,
      })
    })

    return Array.from(stageMap.entries()).map(([stage, data]) => ({
      stage,
      amount: Math.round(data.amount * 100) / 100,
      probability: data.probability,
    }))
  }

  /**
   * 按销售人员统计
   */
  private calculateBySalesperson(opportunities: Opportunity[]): Array<{ name: string; amount: number }> {
    const salesMap = new Map<string, number>()

    opportunities.forEach((opp) => {
      const name = (opp.owner as any)?.name || '未分配'
      const existing = salesMap.get(name) || 0
      salesMap.set(name, existing + (opp.estimatedAmount || 0))
    })

    return Array.from(salesMap.entries())
      .map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100 }))
      .sort((a, b) => b.amount - a.amount)
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(opportunities: Opportunity[]): number {
    if (opportunities.length === 0) return 0

    // 基于商机数量和历史转化率计算
    const highProbabilityOpps = opportunities.filter((o) => (o.probability || 0) >= 70).length
    const ratio = highProbabilityOpps / opportunities.length

    // 商机越多，置信度越高
    const volumeFactor = Math.min(1, opportunities.length / 20)

    return ratio * 0.7 + volumeFactor * 0.3
  }

  /**
   * 计算趋势
   */
  private async calculateTrends(startDate: Date) {
    const now = new Date()

    // 获取历史订单
    const orders = await this.orderRepository.find({
      where: {
        createdAt: Between(startDate, now),
      },
    })

    // 计算增长率（简化）
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const previousAmount = totalAmount * 0.9 // 假设 10% 增长
    const growth = previousAmount > 0 ? ((totalAmount - previousAmount) / previousAmount) * 100 : 0

    // 转化率（简化）
    const conversionRate = 25 // 假设 25%

    // 平均订单金额
    const avgDealSize = orders.length > 0 ? totalAmount / orders.length : 0

    // 销售周期（简化）
    const salesCycle = 30 // 假设 30 天

    return {
      growth: Math.round(growth * 100) / 100,
      conversionRate,
      avgDealSize: Math.round(avgDealSize * 100) / 100,
      salesCycle,
    }
  }

  /**
   * 生成推荐
   */
  private generateRecommendations(opportunities: any[], trends: any): string[] {
    const recs: string[] = []

    // 基于转化率
    if (trends.conversionRate < 20) {
      recs.push('转化率较低，建议优化销售流程')
    }

    // 基于平均订单金额
    if (trends.avgDealSize < 50000) {
      recs.push('平均订单金额较小，建议开发大客户')
    }

    // 基于商机阶段分布
    const earlyStage = opportunities.filter((o) => o.probability < 50).length
    const lateStage = opportunities.filter((o) => o.probability >= 70).length
    if (earlyStage > lateStage * 2) {
      recs.push('早期商机较多，建议加速推进高意向客户')
    }

    // 基于增长率
    if (trends.growth < 0) {
      recs.push('销售额下滑，建议加强客户开发')
    }

    if (recs.length === 0) {
      recs.push('销售状况良好，继续保持')
    }

    return recs
  }

  /**
   * 获取周期开始日期
   */
  private getPeriodStart(now: Date, period: string): Date {
    const start = new Date(now)

    switch (period) {
      case 'week':
        start.setDate(start.getDate() - 7)
        break
      case 'month':
        start.setMonth(start.getMonth() - 1)
        break
      case 'quarter':
        start.setMonth(start.getMonth() - 3)
        break
    }

    return start
  }

  /**
   * 获取销售团队业绩排行
   */
  async getSalesLeaderboard(period: 'month' | 'quarter' | 'year' = 'month') {
    const now = new Date()
    const startDate = this.getPeriodStart(now, period === 'week' ? 'month' : period)

    const orders = await this.orderRepository.find({
      where: {
        createdAt: Between(startDate, now),
      },
      relations: ['sales'],
    })

    const salesMap = new Map<string, { name: string; amount: number; count: number }>()

    orders.forEach((order) => {
      const salesName = (order.sales as any)?.name || '未分配'
      const existing = salesMap.get(salesName) || { name: salesName, amount: 0, count: 0 }
      salesMap.set(salesName, {
        ...existing,
        amount: existing.amount + order.totalAmount,
        count: existing.count + 1,
      })
    })

    return Array.from(salesMap.values())
      .sort((a, b) => b.amount - a.amount)
      .map((item, index) => ({
        rank: index + 1,
        ...item,
        amount: Math.round(item.amount * 100) / 100,
      }))
  }
}
