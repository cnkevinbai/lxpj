/**
 * 投诉管理服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServiceComplaint, ComplaintType, ComplaintStatus } from './entities/service-complaint.entity'

@Injectable()
export class AfterSalesComplaintService {
  constructor(
    @InjectRepository(ServiceComplaint)
    private complaintRepository: Repository<ServiceComplaint>,
  ) {}

  /**
   * 创建投诉
   */
  async create(data: Partial<ServiceComplaint>): Promise<ServiceComplaint> {
    const complaint = this.complaintRepository.create({
      ...data,
      complaintNo: this.generateComplaintNo(),
      status: 'pending',
    })
    return this.complaintRepository.save(complaint)
  }

  /**
   * 生成投诉编号
   */
  private generateComplaintNo(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `CP-${date}-${random}`
  }

  /**
   * 获取投诉列表
   */
  async getComplaints(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: ComplaintType
      status?: ComplaintStatus
      customerId?: string
    },
  ) {
    const query = this.complaintRepository.createQueryBuilder('complaint')
      .orderBy('complaint.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.type) {
      query.andWhere('complaint.type = :type', { type: filters.type })
    }
    if (filters?.status) {
      query.andWhere('complaint.status = :status', { status: filters.status })
    }
    if (filters?.customerId) {
      query.andWhere('complaint.customerId = :customerId', { customerId: filters.customerId })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取投诉详情
   */
  async getComplaint(id: string): Promise<ServiceComplaint> {
    const complaint = await this.complaintRepository.findOne({ where: { id } })
    if (!complaint) {
      throw new NotFoundException('投诉不存在')
    }
    return complaint
  }

  /**
   * 处理投诉
   */
  async process(
    id: string,
    solution: string,
  ): Promise<ServiceComplaint> {
    const complaint = await this.getComplaint(id)
    complaint.status = 'processing'
    complaint.solution = solution
    return this.complaintRepository.save(complaint)
  }

  /**
   * 解决投诉
   */
  async resolve(
    id: string,
    satisfaction: number,
  ): Promise<ServiceComplaint> {
    const complaint = await this.getComplaint(id)
    complaint.status = 'resolved'
    complaint.satisfaction = satisfaction
    complaint.resolvedAt = new Date()
    return this.complaintRepository.save(complaint)
  }

  /**
   * 关闭投诉
   */
  async close(id: string): Promise<ServiceComplaint> {
    const complaint = await this.getComplaint(id)
    complaint.status = 'closed'
    return this.complaintRepository.save(complaint)
  }

  /**
   * 获取投诉统计
   */
  async getComplaintStats() {
    const total = await this.complaintRepository.count()
    const byStatus = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany()

    const byType = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('type')
      .getRawMany()

    const avgSatisfaction = await this.complaintRepository
      .createQueryBuilder('complaint')
      .select('AVG(satisfaction)', 'avg')
      .where('satisfaction IS NOT NULL')
      .getRawOne()

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count)
        return acc
      }, {}),
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count)
        return acc
      }, {}),
      avgSatisfaction: parseFloat(avgSatisfaction.avg || 0),
    }
  }
}
