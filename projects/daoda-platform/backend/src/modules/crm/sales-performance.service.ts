/**
 * 销售业绩分析服务
 * 销售团队绩效追踪与分析
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

/**
 * 业绩指标
 */
export enum PerformanceMetric {
  REVENUE = 'REVENUE', // 销售收入
  ORDER_COUNT = 'ORDER_COUNT', // 订单数量
  CUSTOMER_COUNT = 'CUSTOMER_COUNT', // 客户数量
  WIN_RATE = 'WIN_RATE', // 赢单率
  CONVERSION_RATE = 'CONVERSION_RATE', // 转化率
  AVG_ORDER_VALUE = 'AVG_ORDER_VALUE', // 平均订单金额
}

/**
 * 销售人员业绩
 */
export interface SalespersonPerformance {
  userId: string
  userName: string
  period: string // 统计周期
  metrics: {
    revenue: number // 销售收入
    orderCount: number // 订单数量
    customerCount: number // 客户数量
    winRate: number // 赢单率 (%)
    conversionRate: number // 转化率 (%)
    avgOrderValue: number // 平均订单金额
  }
  ranking?: number // 排名
  target?: number // 目标
  completionRate?: number // 完成率 (%)
}

/**
 * 团队业绩汇总
 */
export interface TeamPerformance {
  teamId?: string
  teamName?: string
  period: string
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  avgWinRate: number
  avgConversionRate: number
  avgOrderValue: number
  topPerformers: SalespersonPerformance[]
  bottomPerformers: SalespersonPerformance[]
}

/**
 * 业绩趋势
 */
export interface PerformanceTrend {
  userId: string
  userName: string
  metric: PerformanceMetric
  data: Array<{ period: string; value: number }>
  trend: 'up' | 'down' | 'stable'
  changeRate: number // 变化率 (%)
}

@Injectable()
export class SalesPerformanceService {
  private readonly logger = new Logger(SalesPerformanceService.name)

  constructor(private prisma: PrismaService) {}

  // 内存存储
  private performances: Map<string, SalespersonPerformance[]> = new Map()

  /**
   * 获取销售人员业绩
   */
  async getSalespersonPerformance(
    userId: string,
    period?: string,
  ): Promise<SalespersonPerformance> {
    const targetPeriod = period || new Date().toISOString().slice(0, 7)

    // 获取用户信息
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    // 获取订单数据
    const orders = await this.prisma.order.findMany({
      where: {
        // 实际应根据 userId 过滤，这里模拟
      },
      take: 50,
    })

    // 模拟业绩数据
    const revenue = Math.round(50000 + Math.random() * 100000)
    const orderCount = Math.round(10 + Math.random() * 30)
    const customerCount = Math.round(5 + Math.random() * 15)
    const winRate = Math.round(60 + Math.random() * 30)
    const conversionRate = Math.round(20 + Math.random() * 40)
    const avgOrderValue = orderCount > 0 ? Math.round(revenue / orderCount) : 0

    // 模拟目标完成率
    const target = Math.round(100000)
    const completionRate = target > 0 ? Math.round((revenue / target) * 100) : 0

    const performance: SalespersonPerformance = {
      userId,
      userName: user.name || user.email,
      period: targetPeriod,
      metrics: {
        revenue,
        orderCount,
        customerCount,
        winRate,
        conversionRate,
        avgOrderValue,
      },
      target,
      completionRate,
    }

    // 存储业绩
    const performances = this.performances.get(userId) || []
    performances.push(performance)
    this.performances.set(userId, performances)

    this.logger.log(
      `计算业绩: ${user.name || user.email} 收入 ¥${revenue} 完成率 ${completionRate}%`,
    )
    return performance
  }

  /**
   * 获取团队业绩
   */
  async getTeamPerformance(period?: string): Promise<TeamPerformance> {
    const targetPeriod = period || new Date().toISOString().slice(0, 7)

    // 获取所有销售用户
    const users = await this.prisma.user.findMany({
      take: 10,
    })

    const performances: SalespersonPerformance[] = []

    for (const user of users) {
      const perf = await this.getSalespersonPerformance(user.id, targetPeriod)
      performances.push(perf)
    }

    // 排序
    performances.sort((a, b) => b.metrics.revenue - a.metrics.revenue)

    // 添加排名
    performances.forEach((p, idx) => {
      p.ranking = idx + 1
    })

    const totalRevenue = performances.reduce((sum, p) => sum + p.metrics.revenue, 0)
    const totalOrders = performances.reduce((sum, p) => sum + p.metrics.orderCount, 0)
    const totalCustomers = performances.reduce((sum, p) => sum + p.metrics.customerCount, 0)
    const avgWinRate =
      performances.length > 0
        ? Math.round(
            performances.reduce((sum, p) => sum + p.metrics.winRate, 0) / performances.length,
          )
        : 0
    const avgConversionRate =
      performances.length > 0
        ? Math.round(
            performances.reduce((sum, p) => sum + p.metrics.conversionRate, 0) /
              performances.length,
          )
        : 0
    const avgOrderValue =
      performances.length > 0
        ? Math.round(
            performances.reduce((sum, p) => sum + p.metrics.avgOrderValue, 0) / performances.length,
          )
        : 0

    return {
      period: targetPeriod,
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgWinRate,
      avgConversionRate,
      avgOrderValue,
      topPerformers: performances.slice(0, 3),
      bottomPerformers: performances.slice(-3),
    }
  }

  /**
   * 获取业绩趋势
   */
  async getPerformanceTrend(
    userId: string,
    metric: PerformanceMetric,
    months: number = 6,
  ): Promise<PerformanceTrend> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    // 模拟趋势数据
    const data = []
    let baseValue = 50000

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const period = date.toISOString().slice(0, 7)

      const variance = Math.round(Math.random() * 20000 - 10000)
      const value = baseValue + variance

      data.push({ period, value })

      // 模拟增长
      baseValue = value * 1.05
    }

    // 计算趋势
    const firstValue = data[0]?.value || 0
    const lastValue = data[data.length - 1]?.value || 0
    const changeRate =
      firstValue > 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0

    const trend = changeRate > 5 ? 'up' : changeRate < -5 ? 'down' : 'stable'

    return {
      userId,
      userName: user.name || user.email,
      metric,
      data,
      trend,
      changeRate,
    }
  }

  /**
   * 业绩排行榜
   */
  async getRanking(period?: string, limit?: number) {
    const targetPeriod = period || new Date().toISOString().slice(0, 7)

    const users = await this.prisma.user.findMany({
      take: limit || 10,
    })

    const rankings = []

    for (const user of users) {
      const perf = await this.getSalespersonPerformance(user.id, targetPeriod)
      rankings.push({
        ranking: 0,
        userId: user.id,
        userName: user.name || user.email,
        revenue: perf.metrics.revenue,
        orderCount: perf.metrics.orderCount,
        winRate: perf.metrics.winRate,
        completionRate: perf.completionRate,
      })
    }

    // 排序并添加排名
    rankings.sort((a, b) => b.revenue - a.revenue)
    rankings.forEach((r, idx) => {
      r.ranking = idx + 1
    })

    return rankings
  }

  /**
   * 业绩目标设置
   */
  async setTarget(userId: string, target: number, period?: string) {
    const targetPeriod = period || new Date().toISOString().slice(0, 7)

    // 模拟存储目标
    this.logger.log(`设置目标: ${userId} ¥${target} 周期 ${targetPeriod}`)

    return {
      userId,
      target,
      period: targetPeriod,
      createdAt: new Date(),
    }
  }

  /**
   * 业绩统计
   */
  async getPerformanceStats(period?: string) {
    const targetPeriod = period || new Date().toISOString().slice(0, 7)

    const performances = Array.from(this.performances.values())
      .flat()
      .filter((p) => p.period === targetPeriod)

    return {
      period: targetPeriod,
      totalSalespeople: performances.length,
      totalRevenue: performances.reduce((sum, p) => sum + p.metrics.revenue, 0),
      avgRevenue:
        performances.length > 0
          ? Math.round(
              performances.reduce((sum, p) => sum + p.metrics.revenue, 0) / performances.length,
            )
          : 0,
      avgWinRate:
        performances.length > 0
          ? Math.round(
              performances.reduce((sum, p) => sum + p.metrics.winRate, 0) / performances.length,
            )
          : 0,
      avgCompletionRate:
        performances.length > 0
          ? Math.round(
              performances.reduce((sum, p) => sum + (p.completionRate || 0), 0) /
                performances.length,
            )
          : 0,
      aboveTarget: performances.filter((p) => (p.completionRate || 0) >= 100).length,
      belowTarget: performances.filter((p) => (p.completionRate || 0) < 100).length,
    }
  }

  /**
   * 业绩对比
   */
  async comparePerformance(userId1: string, userId2: string, period?: string) {
    const perf1 = await this.getSalespersonPerformance(userId1, period)
    const perf2 = await this.getSalespersonPerformance(userId2, period)

    return {
      user1: perf1,
      user2: perf2,
      comparison: {
        revenueDiff: perf1.metrics.revenue - perf2.metrics.revenue,
        orderCountDiff: perf1.metrics.orderCount - perf2.metrics.orderCount,
        winRateDiff: perf1.metrics.winRate - perf2.metrics.winRate,
        conversionRateDiff: perf1.metrics.conversionRate - perf2.metrics.conversionRate,
        avgOrderValueDiff: perf1.metrics.avgOrderValue - perf2.metrics.avgOrderValue,
      },
    }
  }
}
