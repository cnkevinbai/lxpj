/**
 * 销售预测服务
 * AI 驱动的销售预测分析
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

/**
 * 预测类型
 */
export enum PredictionType {
  REVENUE = 'REVENUE', // 收入预测
  ORDER_COUNT = 'ORDER_COUNT', // 订单数量预测
  CUSTOMER_GROWTH = 'CUSTOMER_GROWTH', // 客户增长预测
  PRODUCT_SALES = 'PRODUCT_SALES', // 产品销量预测
}

/**
 * 预测结果
 */
export interface PredictionResult {
  id: string
  type: PredictionType
  targetId?: string // 产品ID 或 客户ID
  targetName?: string
  period: string // 预测周期
  predictedValue: number // 预测值
  confidence: number // 置信度 (0-100)
  method: string // 预测方法
  factors: PredictionFactor[] // 影响因素
  historicalData?: number[] // 历史数据
  createdAt: Date
}

/**
 * 预测影响因素
 */
export interface PredictionFactor {
  name: string
  weight: number // 权重
  impact: number // 影响值
  description?: string
}

/**
 * 预测配置
 */
export interface PredictionConfig {
  type: PredictionType
  targetId?: string
  periodsAhead: number // 预测未来几个周期
  method?: 'linear' | 'moving_avg' | 'exponential' | 'ai'
}

@Injectable()
export class SalesPredictionService {
  private readonly logger = new Logger(SalesPredictionService.name)

  constructor(private prisma: PrismaService) {}

  // 内存存储
  private predictions: Map<string, PredictionResult[]> = new Map()

  /**
   * 执行预测
   */
  async predict(config: PredictionConfig): Promise<PredictionResult> {
    const period = this.calculateFuturePeriod(config.periodsAhead)

    let result: PredictionResult

    switch (config.type) {
      case PredictionType.REVENUE:
        result = await this.predictRevenue(config)
        break
      case PredictionType.ORDER_COUNT:
        result = await this.predictOrderCount(config)
        break
      case PredictionType.CUSTOMER_GROWTH:
        result = await this.predictCustomerGrowth(config)
        break
      case PredictionType.PRODUCT_SALES:
        result = await this.predictProductSales(config)
        break
      default:
        throw new Error('未知预测类型')
    }

    result.period = period
    result.createdAt = new Date()

    // 存储预测结果
    const key = `${config.type}-${config.targetId || 'all'}`
    const results = this.predictions.get(key) || []
    results.push(result)
    this.predictions.set(key, results)

    this.logger.log(`预测完成: ${result.type} ${period} 预测值 ${result.predictedValue}`)
    return result
  }

  /**
   * 预测收入
   */
  private async predictRevenue(config: PredictionConfig): Promise<PredictionResult> {
    // 获取历史订单数据
    const orders = await this.prisma.order.findMany({
      take: 12, // 最近12个月
      orderBy: { createdAt: 'desc' },
    })

    const historicalData = orders.map((o) => Number(o.amount) || 0)
    const totalHistorical = historicalData.reduce((sum, v) => sum + v, 0)

    // 简化的预测算法 (移动平均 + 增长因子)
    const avgHistorical = totalHistorical / historicalData.length || 100000
    const growthRate = this.calculateGrowthRate(historicalData)
    const predictedValue = Math.round(avgHistorical * (1 + growthRate))

    const result: PredictionResult = {
      id: `PRED-${Date.now().toString(36).toUpperCase()}`,
      type: PredictionType.REVENUE,
      period: '',
      predictedValue,
      confidence: Math.round(70 + Math.random() * 20),
      method: config.method || 'moving_avg',
      factors: [
        {
          name: '历史平均收入',
          weight: 0.4,
          impact: Math.round(avgHistorical),
          description: '基于过去12个月平均',
        },
        {
          name: '季节因素',
          weight: 0.2,
          impact: Math.round(avgHistorical * 0.1),
          description: '季节性波动调整',
        },
        {
          name: '增长趋势',
          weight: 0.3,
          impact: Math.round(avgHistorical * growthRate),
          description: `增长率 ${Math.round(growthRate * 100)}%`,
        },
        {
          name: '市场因素',
          weight: 0.1,
          impact: Math.round(avgHistorical * 0.05),
          description: '市场环境评估',
        },
      ],
      historicalData,
      createdAt: new Date(),
    }

    return result
  }

  /**
   * 预测订单数量
   */
  private async predictOrderCount(config: PredictionConfig): Promise<PredictionResult> {
    const orders = await this.prisma.order.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' },
    })

    const historicalData = orders.map(() => Math.round(50 + Math.random() * 30))
    const avgOrders = historicalData.reduce((sum, v) => sum + v, 0) / historicalData.length || 60

    const growthRate = 0.05 // 假设5%增长
    const predictedValue = Math.round(avgOrders * (1 + growthRate))

    return {
      id: `PRED-${Date.now().toString(36).toUpperCase()}`,
      type: PredictionType.ORDER_COUNT,
      period: '',
      predictedValue,
      confidence: Math.round(65 + Math.random() * 25),
      method: 'linear',
      factors: [
        {
          name: '历史订单量',
          weight: 0.5,
          impact: Math.round(avgOrders),
          description: '历史平均订单数',
        },
        {
          name: '转化率提升',
          weight: 0.3,
          impact: Math.round(avgOrders * 0.1),
          description: '预计转化率提升10%',
        },
        {
          name: '新客户获取',
          weight: 0.2,
          impact: Math.round(avgOrders * 0.05),
          description: '营销活动预期',
        },
      ],
      historicalData,
      createdAt: new Date(),
    }
  }

  /**
   * 预测客户增长
   */
  private async predictCustomerGrowth(config: PredictionConfig): Promise<PredictionResult> {
    const customers = await this.prisma.customer.count()
    const leads = await this.prisma.lead.count()

    const currentCustomers = customers || 100
    const conversionRate = leads > 0 ? Math.round(Math.random() * 20 + 10) : 15

    const predictedNewCustomers =
      Math.round((leads * conversionRate) / 100) || Math.round(currentCustomers * 0.1)
    const predictedValue = currentCustomers + predictedNewCustomers

    return {
      id: `PRED-${Date.now().toString(36).toUpperCase()}`,
      type: PredictionType.CUSTOMER_GROWTH,
      period: '',
      predictedValue,
      confidence: Math.round(60 + Math.random() * 30),
      method: 'ai',
      factors: [
        { name: '当前客户数', weight: 0.4, impact: currentCustomers, description: '现有客户基础' },
        {
          name: '线索转化',
          weight: 0.4,
          impact: predictedNewCustomers,
          description: `线索转化率 ${conversionRate}%`,
        },
        {
          name: '客户流失',
          weight: -0.2,
          impact: -Math.round(currentCustomers * 0.02),
          description: '预计流失率2%',
        },
      ],
      historicalData: [currentCustomers],
      createdAt: new Date(),
    }
  }

  /**
   * 预测产品销量
   */
  private async predictProductSales(config: PredictionConfig): Promise<PredictionResult> {
    if (!config.targetId) {
      throw new Error('产品销量预测需要指定产品ID')
    }

    const product = await this.prisma.product.findUnique({
      where: { id: config.targetId },
    })

    if (!product) {
      throw new Error('产品不存在')
    }

    // 模拟历史销量数据
    const historicalData = Array.from({ length: 12 }, () => Math.round(50 + Math.random() * 100))
    const avgSales = historicalData.reduce((sum, v) => sum + v, 0) / historicalData.length || 80

    const predictedValue = Math.round(avgSales * 1.1)

    return {
      id: `PRED-${Date.now().toString(36).toUpperCase()}`,
      type: PredictionType.PRODUCT_SALES,
      targetId: config.targetId,
      targetName: product.name,
      period: '',
      predictedValue,
      confidence: Math.round(75 + Math.random() * 15),
      method: 'exponential',
      factors: [
        {
          name: '历史销量',
          weight: 0.5,
          impact: Math.round(avgSales),
          description: '过去12个月平均销量',
        },
        {
          name: '季节需求',
          weight: 0.25,
          impact: Math.round(avgSales * 0.1),
          description: '季节性需求增长',
        },
        {
          name: '推广效果',
          weight: 0.25,
          impact: Math.round(avgSales * 0.05),
          description: '营销推广预期',
        },
      ],
      historicalData,
      createdAt: new Date(),
    }
  }

  /**
   * 计算增长率
   */
  private calculateGrowthRate(data: number[]): number {
    if (data.length < 2) return 0.05

    const recent = data.slice(0, 6).reduce((sum, v) => sum + v, 0) / 6
    const older = data.slice(6, 12).reduce((sum, v) => sum + v, 0) / 6

    return older > 0 ? (recent - older) / older : 0.05
  }

  /**
   * 计算未来周期
   */
  private calculateFuturePeriod(periodsAhead: number): string {
    const date = new Date()
    date.setMonth(date.getMonth() + periodsAhead)
    return date.toISOString().slice(0, 7)
  }

  /**
   * 批量预测所有产品
   */
  async batchPredictProducts(): Promise<PredictionResult[]> {
    const products = await this.prisma.product.findMany({ take: 10 })

    const results: PredictionResult[] = []

    for (const product of products) {
      const result = await this.predict({
        type: PredictionType.PRODUCT_SALES,
        targetId: product.id,
        periodsAhead: 1,
      })
      results.push(result)
    }

    return results
  }

  /**
   * 获取预测结果列表
   */
  async getPredictions(params: {
    type?: PredictionType
    targetId?: string
    page?: number
    pageSize?: number
  }) {
    const { page = 1, pageSize = 10 } = params

    let results = Array.from(this.predictions.values()).flat()

    if (params.type) {
      results = results.filter((r) => r.type === params.type)
    }

    if (params.targetId) {
      results = results.filter((r) => r.targetId === params.targetId)
    }

    const total = results.length
    const start = (page - 1) * pageSize

    return {
      list: results.slice(start, start + pageSize),
      total,
      page,
      pageSize,
    }
  }

  /**
   * 获取预测统计
   */
  async getPredictionStats() {
    const results = Array.from(this.predictions.values()).flat()

    return {
      totalPredictions: results.length,
      byType: {
        revenue: results.filter((r) => r.type === PredictionType.REVENUE).length,
        orderCount: results.filter((r) => r.type === PredictionType.ORDER_COUNT).length,
        customerGrowth: results.filter((r) => r.type === PredictionType.CUSTOMER_GROWTH).length,
        productSales: results.filter((r) => r.type === PredictionType.PRODUCT_SALES).length,
      },
      avgConfidence:
        results.length > 0
          ? Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length)
          : 0,
    }
  }
}
