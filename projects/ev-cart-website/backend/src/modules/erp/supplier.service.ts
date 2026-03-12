/**
 * 供应商管理服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export interface Supplier {
  id: string
  code: string
  name: string
  type: 'manufacturer' | 'trader' | 'service'
  level: 'A' | 'B' | 'C'
  contactName: string
  contactPhone: string
  contactEmail: string
  address: string
  region: string
  industry: string
  creditRating?: string
  paymentTerms?: string
  status: 'active' | 'inactive' | 'blacklisted'
  rating: number  // 1-5 分
  totalOrders: number
  totalAmount: number
  createdAt: Date
}

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository('suppliers')
    private repository: Repository<any>,
  ) {}

  /**
   * 创建供应商
   */
  async create(data: Partial<Supplier>): Promise<any> {
    const supplier = this.repository.create({
      ...data,
      code: this.generateSupplierCode(),
      rating: 0,
      totalOrders: 0,
      totalAmount: 0,
      status: 'active',
      createdAt: new Date(),
    })
    return this.repository.save(supplier)
  }

  /**
   * 生成供应商编号
   */
  private generateSupplierCode(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `SUP-${date}-${random}`
  }

  /**
   * 获取供应商列表
   */
  async getSuppliers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string
      level?: string
      status?: string
      region?: string
    },
  ) {
    const query = this.repository.createQueryBuilder('supplier')
      .orderBy('supplier.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.type) {
      query.andWhere('supplier.type = :type', { type: filters.type })
    }
    if (filters?.level) {
      query.andWhere('supplier.level = :level', { level: filters.level })
    }
    if (filters?.status) {
      query.andWhere('supplier.status = :status', { status: filters.status })
    }
    if (filters?.region) {
      query.andWhere('supplier.region LIKE :region', { region: `%${filters.region}%` })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取供应商详情
   */
  async getSupplier(id: string) {
    return this.repository.findOne({ where: { id } })
  }

  /**
   * 更新供应商
   */
  async update(id: string, data: Partial<Supplier>) {
    return this.repository.update(id, data)
  }

  /**
   * 评估供应商
   */
  async rateSupplier(id: string, rating: number, comment?: string) {
    if (rating < 1 || rating > 5) {
      throw new Error('评分必须在 1-5 分之间')
    }

    const supplier = await this.repository.findOne({ where: { id } })
    if (!supplier) {
      throw new Error('供应商不存在')
    }

    // 计算平均评分
    const newRating = ((supplier.rating * supplier.totalOrders) + rating) / (supplier.totalOrders + 1)
    
    return this.repository.update(id, {
      rating: parseFloat(newRating.toFixed(1)),
      totalOrders: supplier.totalOrders + 1,
    })
  }

  /**
   * 获取供应商统计
   */
  async getStats() {
    const total = await this.repository.count()
    const byType = await this.getStatsByField('type')
    const byLevel = await this.getStatsByField('level')
    const byStatus = await this.getStatsByField('status')
    const avgRating = await this.repository
      .createQueryBuilder('supplier')
      .select('AVG(rating)', 'avg')
      .getRawOne()

    return {
      total,
      byType,
      byLevel,
      byStatus,
      avgRating: parseFloat(avgRating.avg || 0),
    }
  }

  /**
   * 按字段统计
   */
  private async getStatsByField(field: string) {
    const result = await this.repository
      .createQueryBuilder('supplier')
      .select(field, field)
      .addSelect('COUNT(*)', 'count')
      .groupBy(field)
      .getRawMany()

    return result.reduce((acc, item) => {
      acc[item[field]] = parseInt(item.count)
      return acc
    }, {})
  }

  /**
   * 获取优质供应商
   */
  async getTopSuppliers(limit: number = 10) {
    return this.repository
      .createQueryBuilder('supplier')
      .where('supplier.status = :status', { status: 'active' })
      .orderBy('supplier.rating', 'DESC')
      .addOrderBy('supplier.totalAmount', 'DESC')
      .take(limit)
      .getMany()
  }
}
