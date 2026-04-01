/**
 * 成本核算服务
 * 产品成本计算与分析
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

/**
 * 成本类型
 */
export enum CostType {
  MATERIAL = 'MATERIAL', // 材料成本
  LABOR = 'LABOR', // 人工成本
  OVERHEAD = 'OVERHEAD', // 制造费用
  LOGISTICS = 'LOGISTICS', // 物流成本
  OTHER = 'OTHER', // 其他成本
}

/**
 * 成本核算记录
 */
export interface CostRecord {
  id: string
  productId: string
  productName: string
  costType: CostType
  amount: number
  currency: string
  period: string // 核算周期 (YYYY-MM)
  source?: string // 数据来源
  remark?: string
  createdAt: Date
}

/**
 * 产品成本汇总
 */
export interface ProductCostSummary {
  productId: string
  productName: string
  period: string
  totalCost: number
  materialCost: number
  laborCost: number
  overheadCost: number
  logisticsCost: number
  otherCost: number
  unitCost: number // 单位成本
  quantity: number // 生产数量
  grossMargin?: number // 毛利率
}

@Injectable()
export class CostAccountingService {
  private readonly logger = new Logger(CostAccountingService.name)

  constructor(private prisma: PrismaService) {}

  // 内存存储
  private costRecords: Map<string, CostRecord[]> = new Map()

  /**
   * 添加成本记录
   */
  async addCostRecord(data: {
    productId: string
    costType: CostType
    amount: number
    currency?: string
    period?: string
    source?: string
    remark?: string
  }): Promise<CostRecord> {
    const period = data.period || new Date().toISOString().slice(0, 7)
    const currency = data.currency || 'CNY'

    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    })

    if (!product) {
      throw new Error('产品不存在')
    }

    const record: CostRecord = {
      id: `COST-${Date.now().toString(36).toUpperCase()}`,
      productId: data.productId,
      productName: product.name,
      costType: data.costType,
      amount: data.amount,
      currency,
      period,
      source: data.source,
      remark: data.remark,
      createdAt: new Date(),
    }

    const records = this.costRecords.get(data.productId) || []
    records.push(record)
    this.costRecords.set(data.productId, records)

    this.logger.log(`添加成本记录: ${product.name} ${data.costType} ¥${data.amount}`)
    return record
  }

  /**
   * 批量添加成本记录
   */
  async batchAddCostRecords(
    records: Array<{
      productId: string
      costType: CostType
      amount: number
      period?: string
      remark?: string
    }>,
  ) {
    for (const record of records) {
      await this.addCostRecord(record)
    }
    return { added: records.length }
  }

  /**
   * 计算产品成本汇总
   */
  async calculateProductCost(productId: string, period?: string): Promise<ProductCostSummary> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error('产品不存在')
    }

    const targetPeriod = period || new Date().toISOString().slice(0, 7)
    const records = (this.costRecords.get(productId) || []).filter((r) => r.period === targetPeriod)

    const materialCost = this.sumByType(records, CostType.MATERIAL)
    const laborCost = this.sumByType(records, CostType.LABOR)
    const overheadCost = this.sumByType(records, CostType.OVERHEAD)
    const logisticsCost = this.sumByType(records, CostType.LOGISTICS)
    const otherCost = this.sumByType(records, CostType.OTHER)

    const totalCost = materialCost + laborCost + overheadCost + logisticsCost + otherCost

    // 模拟生产数量
    const quantity = 100

    // 计算单位成本
    const unitCost = quantity > 0 ? Math.round(totalCost / quantity) : totalCost

    // 计算毛利率 (假设售价)
    const price = Number(product.price) || 0
    const grossMargin = price > 0 ? Math.round(((price - unitCost) / price) * 100) : 0

    const summary: ProductCostSummary = {
      productId,
      productName: product.name,
      period: targetPeriod,
      totalCost,
      materialCost,
      laborCost,
      overheadCost,
      logisticsCost,
      otherCost,
      unitCost,
      quantity,
      grossMargin,
    }

    this.logger.log(`计算成本: ${product.name} 总成本 ¥${totalCost} 单位成本 ¥${unitCost}`)
    return summary
  }

  /**
   * 汇总特定类型的成本
   */
  private sumByType(records: CostRecord[], type: CostType): number {
    return records.filter((r) => r.costType === type).reduce((sum, r) => sum + r.amount, 0)
  }

  /**
   * 获取成本趋势
   */
  async getCostTrend(productId: string, months: number = 6) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error('产品不存在')
    }

    // 模拟趋势数据
    const trend = []
    const baseCost = 10000

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const period = date.toISOString().slice(0, 7)

      const variance = Math.round(Math.random() * 2000 - 1000)
      const totalCost = baseCost + variance

      trend.push({
        period,
        totalCost,
        materialCost: Math.round(totalCost * 0.4),
        laborCost: Math.round(totalCost * 0.25),
        overheadCost: Math.round(totalCost * 0.15),
        logisticsCost: Math.round(totalCost * 0.1),
        otherCost: Math.round(totalCost * 0.1),
        unitCost: Math.round(totalCost / 100),
      })
    }

    return trend
  }

  /**
   * 成本对比分析
   */
  async compareCost(productId1: string, productId2: string, period?: string) {
    const summary1 = await this.calculateProductCost(productId1, period)
    const summary2 = await this.calculateProductCost(productId2, period)

    return {
      product1: summary1,
      product2: summary2,
      comparison: {
        totalCostDiff: summary1.totalCost - summary2.totalCost,
        unitCostDiff: summary1.unitCost - summary2.unitCost,
        materialCostDiff: summary1.materialCost - summary2.materialCost,
        laborCostDiff: summary1.laborCost - summary2.laborCost,
        grossMarginDiff: (summary1.grossMargin || 0) - (summary2.grossMargin || 0),
      },
    }
  }

  /**
   * 成本结构分析
   */
  async getCostStructure(productId: string, period?: string) {
    const summary = await this.calculateProductCost(productId, period)

    return {
      total: summary.totalCost,
      structure: [
        {
          type: '材料成本',
          amount: summary.materialCost,
          percentage: Math.round((summary.materialCost / summary.totalCost) * 100) || 0,
        },
        {
          type: '人工成本',
          amount: summary.laborCost,
          percentage: Math.round((summary.laborCost / summary.totalCost) * 100) || 0,
        },
        {
          type: '制造费用',
          amount: summary.overheadCost,
          percentage: Math.round((summary.overheadCost / summary.totalCost) * 100) || 0,
        },
        {
          type: '物流成本',
          amount: summary.logisticsCost,
          percentage: Math.round((summary.logisticsCost / summary.totalCost) * 100) || 0,
        },
        {
          type: '其他成本',
          amount: summary.otherCost,
          percentage: Math.round((summary.otherCost / summary.totalCost) * 100) || 0,
        },
      ],
    }
  }

  /**
   * 获取成本记录列表
   */
  async getCostRecords(params: {
    productId?: string
    period?: string
    costType?: CostType
    page?: number
    pageSize?: number
  }) {
    const { page = 1, pageSize = 10 } = params

    let records = Array.from(this.costRecords.values()).flat()

    if (params.productId) {
      records = records.filter((r) => r.productId === params.productId)
    }

    if (params.period) {
      records = records.filter((r) => r.period === params.period)
    }

    if (params.costType) {
      records = records.filter((r) => r.costType === params.costType)
    }

    const total = records.length
    const start = (page - 1) * pageSize

    return {
      list: records.slice(start, start + pageSize),
      total,
      page,
      pageSize,
    }
  }

  /**
   * 获取成本统计
   */
  async getCostStats(period?: string) {
    const targetPeriod = period || new Date().toISOString().slice(0, 7)
    const records = Array.from(this.costRecords.values())
      .flat()
      .filter((r) => r.period === targetPeriod)

    return {
      period: targetPeriod,
      totalRecords: records.length,
      totalAmount: records.reduce((sum, r) => sum + r.amount, 0),
      byType: {
        material: records
          .filter((r) => r.costType === CostType.MATERIAL)
          .reduce((sum, r) => sum + r.amount, 0),
        labor: records
          .filter((r) => r.costType === CostType.LABOR)
          .reduce((sum, r) => sum + r.amount, 0),
        overhead: records
          .filter((r) => r.costType === CostType.OVERHEAD)
          .reduce((sum, r) => sum + r.amount, 0),
        logistics: records
          .filter((r) => r.costType === CostType.LOGISTICS)
          .reduce((sum, r) => sum + r.amount, 0),
        other: records
          .filter((r) => r.costType === CostType.OTHER)
          .reduce((sum, r) => sum + r.amount, 0),
      },
      productCount: new Set(records.map((r) => r.productId)).size,
    }
  }
}
