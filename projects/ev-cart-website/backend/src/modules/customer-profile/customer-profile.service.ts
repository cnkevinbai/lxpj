import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Customer } from '../customer/entities/customer.entity'
import { Order } from '../order/entities/order.entity'
import { FollowUp } from '../follow-up/entities/follow-up.entity'

export interface CustomerProfile {
  basicInfo: any
  tags: string[]
  score: number
  level: string
  valueLevel: string
  activityLevel: string
  preferences: {
    contactMethod?: string
    bestContactTime?: string
    interestedProducts?: string[]
  }
  statistics: {
    totalOrders: number
    totalAmount: number
    avgOrderValue: number
    lastOrderDate?: Date
    followUpCount: number
    lastFollowUpDate?: Date
  }
  riskFactors: string[]
  recommendations: string[]
}

@Injectable()
export class CustomerProfileService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(FollowUp)
    private followUpRepository: Repository<FollowUp>,
  ) {}

  /**
   * 获取客户完整画像
   */
  async getCustomerProfile(customerId: string): Promise<CustomerProfile> {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } })
    if (!customer) {
      throw new Error('客户不存在')
    }

    // 获取订单统计
    const orders = await this.orderRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    })

    const totalOrders = orders.length
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0
    const lastOrderDate = orders[0]?.createdAt

    // 获取跟进统计
    const followUps = await this.followUpRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    })

    const followUpCount = followUps.length
    const lastFollowUpDate = followUps[0]?.createdAt

    // 计算客户评分
    const score = this.calculateCustomerScore(customer, orders, followUps)

    // 生成标签
    const tags = this.generateTags(customer, orders, followUps)

    // 计算价值等级
    const valueLevel = this.calculateValueLevel(totalAmount, totalOrders)

    // 计算活跃度
    const activityLevel = this.calculateActivityLevel(lastOrderDate, lastFollowUpDate)

    // 识别风险因素
    const riskFactors = this.identifyRiskFactors(customer, orders, followUps)

    // 生成推荐
    const recommendations = this.generateRecommendations(customer, orders, followUps)

    return {
      basicInfo: {
        id: customer.id,
        name: customer.name,
        type: customer.type,
        industry: customer.industry,
        level: customer.level,
        source: customer.source,
        contactPerson: customer.contactPerson,
        contactPhone: customer.contactPhone,
        contactEmail: customer.contactEmail,
        province: customer.province,
        city: customer.city,
        createdAt: customer.createdAt,
      },
      tags,
      score,
      level: customer.level,
      valueLevel,
      activityLevel,
      preferences: {
        contactMethod: this.inferContactMethod(followUps),
        bestContactTime: this.inferBestContactTime(followUps),
        interestedProducts: this.inferInterestedProducts(orders),
      },
      statistics: {
        totalOrders,
        totalAmount,
        avgOrderValue,
        lastOrderDate,
        followUpCount,
        lastFollowUpDate,
      },
      riskFactors,
      recommendations,
    }
  }

  /**
   * 计算客户评分（0-100）
   */
  private calculateCustomerScore(customer: any, orders: any[], followUps: any[]): number {
    let score = 50 // 基础分

    // 订单贡献（最高 30 分）
    if (orders.length > 0) {
      const orderScore = Math.min(30, orders.length * 3)
      score += orderScore
    }

    // 跟进活跃度（最高 10 分）
    if (followUps.length > 0) {
      const followUpScore = Math.min(10, followUps.length)
      score += followUpScore
    }

    // 信息完整度（最高 10 分）
    let infoScore = 0
    if (customer.contactPerson) infoScore += 2
    if (customer.contactPhone) infoScore += 2
    if (customer.contactEmail) infoScore += 2
    if (customer.industry) infoScore += 2
    if (customer.province) infoScore += 2
    score += Math.min(10, infoScore)

    return Math.min(100, score)
  }

  /**
   * 生成客户标签
   */
  private generateTags(customer: any, orders: any[], followUps: any[]): string[] {
    const tags: string[] = []

    // 基于订单
    if (orders.length >= 10) tags.push('高频购买')
    if (orders.length >= 5) tags.push('稳定客户')
    if (orders.some((o) => o.totalAmount > 100000)) tags.push('大单客户')

    // 基于跟进
    if (followUps.length >= 10) tags.push('高跟进')
    if (followUps.length === 0) tags.push('未跟进')

    // 基于等级
    if (customer.level === 'VIP') tags.push('VIP 客户')
    if (customer.level === 'A') tags.push('重点客户')

    // 基于类型
    if (customer.type === 'enterprise') tags.push('企业客户')
    if (customer.type === 'government') tags.push('政府客户')

    // 基于时间
    const daysSinceCreated = (Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreated < 30) tags.push('新客户')
    if (daysSinceCreated > 365) tags.push('老客户')

    return tags
  }

  /**
   * 计算价值等级
   */
  private calculateValueLevel(totalAmount: number, totalOrders: number): string {
    if (totalAmount >= 1000000) return 'S' // 百万级
    if (totalAmount >= 500000) return 'A'  // 50 万级
    if (totalAmount >= 100000) return 'B'  // 10 万级
    if (totalAmount >= 50000) return 'C'   // 5 万级
    if (totalAmount > 0) return 'D'        // 有消费
    return 'E'                              // 无消费
  }

  /**
   * 计算活跃度
   */
  private calculateActivityLevel(lastOrderDate?: Date, lastFollowUpDate?: Date): string {
    const now = new Date()
    const daysSinceOrder = lastOrderDate ? (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24) : 999
    const daysSinceFollowUp = lastFollowUpDate ? (now.getTime() - lastFollowUpDate.getTime()) / (1000 * 60 * 60 * 24) : 999

    if (daysSinceOrder <= 7 || daysSinceFollowUp <= 3) return '非常活跃'
    if (daysSinceOrder <= 30 || daysSinceFollowUp <= 7) return '活跃'
    if (daysSinceOrder <= 90 || daysSinceFollowUp <= 30) return '一般'
    if (daysSinceOrder <= 180) return '不活跃'
    return '沉睡'
  }

  /**
   * 推断联系方式偏好
   */
  private inferContactMethod(followUps: any[]): string | undefined {
    if (followUps.length === 0) return undefined

    const phoneFollowUps = followUps.filter((f) => f.method === 'phone').length
    const emailFollowUps = followUps.filter((f) => f.method === 'email').length
    const wechatFollowUps = followUps.filter((f) => f.method === 'wechat').length

    const max = Math.max(phoneFollowUps, emailFollowUps, wechatFollowUps)
    if (max === phoneFollowUps) return '电话'
    if (max === emailFollowUps) return '邮件'
    if (max === wechatFollowUps) return '微信'
    return undefined
  }

  /**
   * 推断最佳联系时间
   */
  private inferBestContactTime(followUps: any[]): string | undefined {
    if (followUps.length === 0) return undefined

    // 简化实现，实际应该分析成功跟进的时间分布
    return '工作日 9:00-11:00'
  }

  /**
   * 推断感兴趣的产品
   */
  private inferInterestedProducts(orders: any[]): string[] {
    const products = new Set<string>()
    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item: any) => {
          if (item.productName) products.add(item.productName)
        })
      }
    })
    return Array.from(products).slice(0, 5)
  }

  /**
   * 识别风险因素
   */
  private identifyRiskFactors(customer: any, orders: any[], followUps: any[]): string[] {
    const risks: string[] = []

    // 长期未下单
    if (orders.length > 0) {
      const daysSinceLastOrder = (Date.now() - new Date(orders[0].createdAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastOrder > 180) risks.push('长期未下单')
    }

    // 长期未跟进
    if (followUps.length > 0) {
      const daysSinceLastFollowUp = (Date.now() - new Date(followUps[0].createdAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastFollowUp > 30) risks.push('长期未跟进')
    }

    // 订单量下降
    // （简化实现）

    return risks
  }

  /**
   * 生成推荐
   */
  private generateRecommendations(customer: any, orders: any[], followUps: any[]): string[] {
    const recs: string[] = []

    // 未跟进推荐
    if (followUps.length === 0) {
      recs.push('建议尽快安排首次跟进')
    }

    // 长期未联系推荐
    if (followUps.length > 0) {
      const daysSinceLastFollowUp = (Date.now() - new Date(followUps[0].createdAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastFollowUp > 15) {
        recs.push('建议安排回访维护关系')
      }
    }

    // 高价值客户推荐
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    if (totalAmount >= 500000) {
      recs.push('建议列为重点维护客户')
    }

    // 沉睡客户推荐
    if (orders.length > 0) {
      const daysSinceLastOrder = (Date.now() - new Date(orders[0].createdAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastOrder > 90) {
        recs.push('建议激活沉睡客户')
      }
    }

    return recs
  }

  /**
   * 批量获取客户画像
   */
  async batchGetProfiles(customerIds: string[]): Promise<CustomerProfile[]> {
    const profiles: CustomerProfile[] = []
    for (const id of customerIds) {
      try {
        const profile = await this.getCustomerProfile(id)
        profiles.push(profile)
      } catch (error) {
        console.error(`获取客户 ${id} 画像失败:`, error)
      }
    }
    return profiles
  }
}
