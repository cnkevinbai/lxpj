import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'
import { Lead } from '../lead/entities/lead.entity'
import { Customer } from '../customer/entities/customer.entity'
import { Order } from '../order/entities/order.entity'

/**
 * 智能推荐服务
 * 基于规则推荐 (后续可升级为机器学习)
 */
@Injectable()
export class RecommendService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * 推荐优先跟进的线索
   * 基于：创建时间、来源、意向产品
   */
  async recommendLeadsToFollow(userId: string, limit: number = 10) {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const leads = await this.leadRepository.find({
      where: {
        ownerId: userId,
        createdAt: MoreThanOrEqual(thirtyDaysAgo),
        status: 'new',
      },
      order: { createdAt: 'DESC' },
      take: limit,
    })

    // 评分算法 (简化版)
    const scored = leads.map(lead => {
      let score = 50 // 基础分

      // 根据来源加分
      if (lead.source === 'exhibition') score += 20
      if (lead.source === 'referral') score += 15
      if (lead.source === 'website') score += 10

      // 根据时间加分 (越近越高)
      const daysOld = (Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      if (daysOld < 1) score += 20
      else if (daysOld < 3) score += 10
      else if (daysOld < 7) score += 5

      return { ...lead, score }
    })

    return scored.sort((a, b) => b.score - a.score)
  }

  /**
   * 推荐产品给客户
   * 基于：客户类型、行业、历史订单
   */
  async recommendProductsForCustomer(customerId: string) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } })
    if (!customer) return []

    const recommendations = []

    // 根据行业推荐
    if (customer.industry === '景区') {
      recommendations.push({
        product: 'EC-11',
        reason: '景区常用车型，11 座适合小团体游览',
        score: 90,
      })
      recommendations.push({
        product: 'EC-23',
        reason: '23 座巴士适合大客流运输',
        score: 85,
      })
    }

    if (customer.industry === '酒店') {
      recommendations.push({
        product: 'EC-14',
        reason: '14 座适合酒店客人接送',
        score: 90,
      })
    }

    if (customer.industry === '房地产') {
      recommendations.push({
        product: 'EC-11',
        reason: '适合小区业主接送',
        score: 85,
      })
    }

    return recommendations.sort((a, b) => b.score - a.score)
  }

  /**
   * 推荐最佳联系时间
   * 基于：客户所在时区、历史联系记录
   */
  async recommendContactTime(customerId: string) {
    const customer = await this.customerRepository.findOne({ where: { id: customerId } })
    if (!customer) return { bestTime: '09:00-11:00', timezone: 'UTC+8' }

    // 根据国家推荐时区
    const timezoneMap: Record<string, string> = {
      '美国': 'UTC-5',
      '英国': 'UTC+0',
      '德国': 'UTC+1',
      '澳大利亚': 'UTC+10',
      '日本': 'UTC+9',
      '中国': 'UTC+8',
    }

    const timezone = timezoneMap[customer.country] || 'UTC+8'

    // 推荐最佳联系时间 (当地工作时间)
    return {
      bestTime: '09:00-11:00 或 14:00-16:00',
      timezone,
      note: '建议避开当地午休时间',
    }
  }

  /**
   * 推荐下一步行动
   * 基于：客户状态、最后联系时间
   */
  async recommendNextAction(customerId: string) {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['owner'],
    })

    if (!customer) return { action: '无', priority: 'low' }

    // 根据状态推荐
    const actionMap: Record<string, { action: string; priority: string }> = {
      'potential': { action: '首次联系，了解需求', priority: 'high' },
      'active': { action: '定期跟进，维护关系', priority: 'medium' },
      'inactive': { action: '激活客户，发送优惠', priority: 'medium' },
      'lost': { action: '分析原因，尝试挽回', priority: 'low' },
    }

    return actionMap[customer.status] || { action: '保持联系', priority: 'low' }
  }
}
