/**
 * 售后服务统计服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceTicket, TicketType, TicketStatus } from './entities/service-ticket.entity'

export interface TicketStats {
  total: number
  byStatus: Record<TicketStatus, number>
  byType: Record<TicketType, number>
  byPriority: Record<string, number>
  completionRate: number
  avgSatisfaction: number
}

export interface TechnicianStats {
  technicianId: string
  technicianName: string
  totalTickets: number
  completedTickets: number
  avgSatisfaction: number
  avgResponseTime: number
  avgCompleteTime: number
}

export interface DailyStats {
  date: string
  totalTickets: number
  completedTickets: number
  avgSatisfaction: number
}

@Injectable()
export class AfterSalesStatisticService {
  constructor(
    @InjectRepository(ServiceTicket)
    private ticketRepository: Repository<ServiceTicket>,
  ) {}

  /**
   * 获取总体统计
   */
  async getOverviewStats(startDate?: Date, endDate?: Date): Promise<TicketStats> {
    const query = this.ticketRepository.createQueryBuilder('ticket')

    if (startDate) {
      query.andWhere('ticket.createdAt >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('ticket.createdAt <= :endDate', { endDate })
    }

    const total = await query.getCount()

    // 按状态统计
    const byStatusRaw = await query
      .clone()
      .select('status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany()

    const byStatus = {} as Record<TicketStatus, number>
    byStatusRaw.forEach(item => {
      byStatus[item.status] = parseInt(item.count)
    })

    // 按类型统计
    const byTypeRaw = await query
      .clone()
      .select('type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('type')
      .getRawMany()

    const byType = {} as Record<TicketType, number>
    byTypeRaw.forEach(item => {
      byType[item.type] = parseInt(item.count)
    })

    // 按优先级统计
    const byPriorityRaw = await query
      .clone()
      .select('priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .groupBy('priority')
      .getRawMany()

    const byPriority = {}
    byPriorityRaw.forEach(item => {
      byPriority[item.priority] = parseInt(item.count)
    })

    // 完成率
    const completedCount = byStatus['completed'] || 0
    const completionRate = total > 0 ? (completedCount / total) * 100 : 0

    // 平均满意度
    const avgSatisfactionRaw = await query
      .clone()
      .select('AVG(satisfaction)', 'avg')
      .where('satisfaction IS NOT NULL')
      .getRawOne()

    const avgSatisfaction = parseFloat(avgSatisfactionRaw.avg || 0)

    return {
      total,
      byStatus,
      byType,
      byPriority,
      completionRate: parseFloat(completionRate.toFixed(2)),
      avgSatisfaction: parseFloat(avgSatisfaction.toFixed(1)),
    }
  }

  /**
   * 获取服务人员统计
   */
  async getTechnicianStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<TechnicianStats[]> {
    const query = this.ticketRepository.createQueryBuilder('ticket')
      .select('ticket.technicianId', 'technicianId')
      .addSelect('ticket.technicianName', 'technicianName')
      .addSelect('COUNT(*)', 'totalTickets')
      .addSelect('SUM(CASE WHEN ticket.status = \'completed\' THEN 1 ELSE 0 END)', 'completedTickets')
      .addSelect('AVG(ticket.satisfaction)', 'avgSatisfaction')
      .where('ticket.technicianId IS NOT NULL')
      .groupBy('ticket.technicianId')
      .addGroupBy('ticket.technicianName')
      .orderBy('totalTickets', 'DESC')

    if (startDate) {
      query.andWhere('ticket.createdAt >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('ticket.createdAt <= :endDate', { endDate })
    }

    const raw = await query.getRawMany()

    return raw.map(item => ({
      technicianId: item.technicianId,
      technicianName: item.technicianName,
      totalTickets: parseInt(item.totalTickets),
      completedTickets: parseInt(item.completedTickets),
      avgSatisfaction: parseFloat(item.avgSatisfaction || 0),
      avgResponseTime: 0, // 需要计算
      avgCompleteTime: 0, // 需要计算
    }))
  }

  /**
   * 获取每日统计
   */
  async getDailyStats(days: number = 30): Promise<DailyStats[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const query = this.ticketRepository.createQueryBuilder('ticket')
      .select("DATE_TRUNC('day', ticket.createdAt)", 'date')
      .addSelect('COUNT(*)', 'totalTickets')
      .addSelect('SUM(CASE WHEN ticket.status = \'completed\' THEN 1 ELSE 0 END)', 'completedTickets')
      .addSelect('AVG(ticket.satisfaction)', 'avgSatisfaction')
      .where('ticket.createdAt >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('day', ticket.createdAt)")
      .orderBy('date', 'ASC')

    const raw = await query.getRawMany()

    return raw.map(item => ({
      date: item.date,
      totalTickets: parseInt(item.totalTickets),
      completedTickets: parseInt(item.completedTickets),
      avgSatisfaction: parseFloat(item.avgSatisfaction || 0),
    }))
  }

  /**
   * 获取工单类型分布
   */
  async getTypeDistribution(startDate?: Date, endDate?: Date) {
    const query = this.ticketRepository.createQueryBuilder('ticket')
      .select('type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('type')

    if (startDate) {
      query.andWhere('ticket.createdAt >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('ticket.createdAt <= :endDate', { endDate })
    }

    const raw = await query.getRawMany()

    const total = raw.reduce((sum, item) => sum + parseInt(item.count), 0)

    return raw.map(item => ({
      type: item.type,
      count: parseInt(item.count),
      percentage: total > 0 ? parseFloat(((parseInt(item.count) / total) * 100).toFixed(1)) : 0,
    }))
  }

  /**
   * 获取满意度分布
   */
  async getSatisfactionDistribution(startDate?: Date, endDate?: Date) {
    const query = this.ticketRepository.createQueryBuilder('ticket')
      .select('satisfaction', 'satisfaction')
      .addSelect('COUNT(*)', 'count')
      .where('satisfaction IS NOT NULL')
      .groupBy('satisfaction')
      .orderBy('satisfaction', 'ASC')

    if (startDate) {
      query.andWhere('ticket.createdAt >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('ticket.createdAt <= :endDate', { endDate })
    }

    const raw = await query.getRawMany()

    return raw.map(item => ({
      score: parseInt(item.satisfaction),
      count: parseInt(item.count),
    }))
  }

  /**
   * 获取响应时间统计
   */
  async getResponseTimeStats(startDate?: Date, endDate?: Date) {
    // 计算从创建到分配的平均时间
    const query = this.ticketRepository.createQueryBuilder('ticket')
      .where('ticket.assignedAt IS NOT NULL')
      .andWhere('ticket.createdAt IS NOT NULL')

    if (startDate) {
      query.andWhere('ticket.createdAt >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('ticket.createdAt <= :endDate', { endDate })
    }

    const tickets = await query.getMany()

    const responseTimes = tickets
      .filter(t => t.assignedAt && t.createdAt)
      .map(t => (new Date(t.assignedAt).getTime() - new Date(t.createdAt).getTime()) / 1000 / 60) // 分钟

    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0

    return {
      avgResponseTime: parseFloat(avgResponseTime.toFixed(1)),
      totalTickets: tickets.length,
    }
  }

  /**
   * 获取服务报表数据
   */
  async getServiceReport(startDate: Date, endDate: Date) {
    const overview = await this.getOverviewStats(startDate, endDate)
    const technicianStats = await this.getTechnicianStats(startDate, endDate)
    const dailyStats = await this.getDailyStats(30)
    const typeDistribution = await this.getTypeDistribution(startDate, endDate)
    const satisfactionDistribution = await this.getSatisfactionDistribution(startDate, endDate)
    const responseTimeStats = await this.getResponseTimeStats(startDate, endDate)

    return {
      overview,
      technicianStats,
      dailyStats,
      typeDistribution,
      satisfactionDistribution,
      responseTimeStats,
      period: {
        startDate,
        endDate,
      },
    }
  }
}
