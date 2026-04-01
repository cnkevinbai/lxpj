/**
 * 客户公海池服务
 * 销售资源回收再分配
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CustomerStatus } from '@prisma/client'

@Injectable()
export class CustomerPoolService {
  private readonly logger = new Logger(CustomerPoolService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 获取公海池客户列表
   */
  async getPoolList(params: {
    page?: number
    pageSize?: number
    level?: string
    industry?: string
  }) {
    const { page = 1, pageSize = 10, level, industry } = params
    const skip = (page - 1) * pageSize

    const where: any = {
      status: CustomerStatus.ACTIVE,
      userId: null, // 无负责人的客户
    }

    if (level) where.level = level
    if (industry) where.industry = industry

    const [list, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  /**
   * 从公海领取客户
   */
  async claimFromPool(customerId: string, userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      throw new Error('客户不存在')
    }

    if (customer.userId) {
      throw new Error('该客户已被领取')
    }

    const updated = await this.prisma.customer.update({
      where: { id: customerId },
      data: { userId },
    })

    this.logger.log(`用户 ${userId} 从公海领取客户 ${customer.name}`)
    return updated
  }

  /**
   * 释放客户到公海
   */
  async releaseToPool(customerId: string, userId: string, reason?: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      throw new Error('客户不存在')
    }

    if (customer.userId !== userId) {
      throw new Error('只能释放自己负责的客户')
    }

    const updated = await this.prisma.customer.update({
      where: { id: customerId },
      data: { userId: null },
    })

    this.logger.log(`用户 ${userId} 释放客户 ${customer.name} 到公海`)
    return updated
  }

  /**
   * 管理员分配客户
   */
  async assignCustomer(customerId: string, toUserId: string, adminId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      throw new Error('客户不存在')
    }

    const updated = await this.prisma.customer.update({
      where: { id: customerId },
      data: { userId: toUserId },
    })

    this.logger.log(`管理员 ${adminId} 分配客户 ${customer.name}`)
    return updated
  }

  /**
   * 自动回收长期未跟进的客户
   */
  async autoReclaim() {
    const results: { customerId: string; reason: string }[] = []

    // 简化实现：回收30天未更新的客户
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30)

    const customers = await this.prisma.customer.findMany({
      where: {
        userId: { not: null },
        updatedAt: { lt: cutoffDate },
      },
    })

    for (const customer of customers) {
      await this.prisma.customer.update({
        where: { id: customer.id },
        data: { userId: null },
      })

      results.push({
        customerId: customer.id,
        reason: '30天未跟进自动回收',
      })
    }

    this.logger.log(`自动回收 ${results.length} 个客户到公海`)
    return results
  }

  /**
   * 获取公海统计
   */
  async getStats() {
    const total = await this.prisma.customer.count({
      where: { userId: null, status: CustomerStatus.ACTIVE },
    })

    const byLevel = await this.prisma.customer.groupBy({
      by: ['level'],
      where: { userId: null, status: CustomerStatus.ACTIVE },
      _count: true,
    })

    return {
      total,
      byLevel: byLevel.map((g) => ({ level: g.level, count: g._count })),
    }
  }
}
