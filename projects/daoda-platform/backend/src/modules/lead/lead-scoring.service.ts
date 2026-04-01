/**
 * 线索评分服务
 * 基于多维度自动评估线索质量
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

/**
 * 线索评分维度配置
 */
export interface ScoringDimension {
  name: string
  weight: number
  criteria: ScoringCriteria[]
}

export interface ScoringCriteria {
  condition: string
  points: number
  description: string
}

@Injectable()
export class LeadScoringService {
  private readonly logger = new Logger(LeadScoringService.name)

  constructor(private prisma: PrismaService) {}

  // 内存存储评分结果
  private scores: Map<string, number> = new Map()
  private scoreDetails: Map<string, any> = new Map()

  // 默认评分维度
  private scoringDimensions: ScoringDimension[] = [
    {
      name: '基本信息完整度',
      weight: 20,
      criteria: [
        { condition: '有公司名称', points: 10, description: '公司名称已填写' },
        { condition: '有联系电话', points: 8, description: '联系电话已填写' },
        { condition: '有邮箱', points: 5, description: '邮箱已填写' },
        { condition: '有地址', points: 5, description: '地址已填写' },
      ],
    },
    {
      name: '来源质量',
      weight: 30,
      criteria: [
        { condition: '来源=官网咨询', points: 30, description: '官网主动咨询' },
        { condition: '来源=展会', points: 25, description: '展会获取' },
        { condition: '来源=老客户推荐', points: 35, description: '老客户推荐' },
        { condition: '来源=广告', points: 15, description: '广告投放获取' },
        { condition: '来源=其他', points: 10, description: '其他来源' },
      ],
    },
    {
      name: '行业匹配度',
      weight: 20,
      criteria: [
        { condition: '行业=景区', points: 25, description: '核心目标行业' },
        { condition: '行业=高尔夫', points: 20, description: '重点目标行业' },
        { condition: '行业=游乐场', points: 15, description: '目标行业' },
        { condition: '行业=其他', points: 5, description: '其他行业' },
      ],
    },
    {
      name: '地区匹配度',
      weight: 15,
      criteria: [
        { condition: '省份=北京/上海/广东', points: 15, description: '重点区域' },
        { condition: '省份=浙江/江苏/四川', points: 12, description: '拓展区域' },
        { condition: '省份=其他', points: 8, description: '其他区域' },
      ],
    },
  ]

  /**
   * 计算线索评分
   */
  async calculateScore(leadId: string): Promise<{ total: number; dimensions: any[] }> {
    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      throw new Error('线索不存在')
    }

    const dimensionScores: any[] = []

    for (const dimension of this.scoringDimensions) {
      let dimensionScore = 0

      for (const criteria of dimension.criteria) {
        const matched = this.evaluateCriteria(lead, criteria.condition)
        if (matched) {
          dimensionScore += criteria.points
        }
      }

      const weightedScore = Math.round((dimensionScore * dimension.weight) / 100)
      dimensionScores.push({
        name: dimension.name,
        weight: dimension.weight,
        rawScore: dimensionScore,
        weightedScore,
        maxScore: this.getMaxDimensionScore(dimension),
      })
    }

    const total = dimensionScores.reduce((sum, d) => sum + d.weightedScore, 0)

    // 存储评分
    this.scores.set(leadId, total)
    this.scoreDetails.set(leadId, { total, dimensions: dimensionScores })

    this.logger.log(`线索 ${lead.name || leadId} 评分: ${total}分`)
    return { total, dimensions: dimensionScores }
  }

  /**
   * 评估单个条件
   */
  private evaluateCriteria(lead: any, condition: string): boolean {
    if (condition === '有公司名称') return !!lead.company
    if (condition === '有联系电话') return !!lead.phone
    if (condition === '有邮箱') return !!lead.email

    if (condition.startsWith('来源=')) {
      const source = condition.replace('来源=', '')
      return lead.source === source
    }

    return false
  }

  /**
   * 获取维度最大分
   */
  private getMaxDimensionScore(dimension: ScoringDimension): number {
    return Math.max(...dimension.criteria.map((c) => c.points))
  }

  /**
   * 批量评分
   */
  async batchScore(): Promise<{ scored: number; highQuality: number }> {
    const leads = await this.prisma.lead.findMany()

    let highQuality = 0

    for (const lead of leads) {
      const { total } = await this.calculateScore(lead.id)
      if (total >= 70) {
        highQuality++
      }
    }

    return { scored: leads.length, highQuality }
  }

  /**
   * 获取评分分布
   */
  async getScoreDistribution() {
    const scores = Array.from(this.scores.values())

    return {
      distribution: {
        high: scores.filter((s) => s >= 70).length,
        medium: scores.filter((s) => s >= 40 && s < 70).length,
        low: scores.filter((s) => s < 40).length,
      },
      avgScore:
        scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0,
    }
  }

  /**
   * 获取评分配置
   */
  getScoringConfig() {
    return this.scoringDimensions
  }

  /**
   * 更新评分配置
   */
  updateScoringConfig(dimensions: ScoringDimension[]) {
    this.scoringDimensions = dimensions
    return this.scoringDimensions
  }

  /**
   * 获取线索评分
   */
  getLeadScore(leadId: string) {
    return {
      score: this.scores.get(leadId),
      detail: this.scoreDetails.get(leadId),
    }
  }

  /**
   * 获取高分线索列表
   */
  async getHighScoreLeads(limit: number = 10) {
    const highScoreIds = Array.from(this.scores.entries())
      .filter(([id, score]) => score >= 70)
      .slice(0, limit)
      .map(([id]) => id)

    if (highScoreIds.length === 0) {
      return []
    }

    return this.prisma.lead.findMany({
      where: { id: { in: highScoreIds } },
      take: limit,
    })
  }

  /**
   * 获取低分线索列表
   */
  async getLowScoreLeads(limit: number = 10) {
    const lowScoreIds = Array.from(this.scores.entries())
      .filter(([id, score]) => score < 30)
      .slice(0, limit)
      .map(([id]) => id)

    if (lowScoreIds.length === 0) {
      return []
    }

    return this.prisma.lead.findMany({
      where: { id: { in: lowScoreIds } },
      take: limit,
    })
  }
}
