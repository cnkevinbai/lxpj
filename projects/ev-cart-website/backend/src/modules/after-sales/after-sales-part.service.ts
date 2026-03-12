/**
 * 备件管理服务
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ServicePart } from './entities/service-part.entity'

@Injectable()
export class AfterSalesPartService {
  constructor(
    @InjectRepository(ServicePart)
    private partRepository: Repository<ServicePart>,
  ) {}

  /**
   * 创建备件
   */
  async create(data: Partial<ServicePart>): Promise<ServicePart> {
    const part = this.partRepository.create({
      ...data,
      partNo: this.generatePartNo(),
    })
    return this.partRepository.save(part)
  }

  /**
   * 生成备件编号
   */
  private generatePartNo(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `PART-${date}-${random}`
  }

  /**
   * 获取备件列表
   */
  async getParts(
    page: number = 1,
    limit: number = 20,
    filters?: {
      name?: string
      isActive?: boolean
      lowStock?: boolean
    },
  ) {
    const query = this.partRepository.createQueryBuilder('part')
      .orderBy('part.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.name) {
      query.andWhere('part.name LIKE :name', { name: `%${filters.name}%` })
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('part.isActive = :isActive', { isActive: filters.isActive })
    }
    if (filters?.lowStock) {
      query.andWhere('part.stockQuantity <= part.safetyStock')
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取备件详情
   */
  async getPart(id: string): Promise<ServicePart> {
    const part = await this.partRepository.findOne({ where: { id } })
    if (!part) {
      throw new NotFoundException('备件不存在')
    }
    return part
  }

  /**
   * 更新备件
   */
  async update(id: string, data: Partial<ServicePart>): Promise<ServicePart> {
    const part = await this.getPart(id)
    Object.assign(part, data)
    return this.partRepository.save(part)
  }

  /**
   * 删除备件
   */
  async delete(id: string): Promise<void> {
    await this.partRepository.delete(id)
  }

  /**
   * 备件入库
   */
  async stockIn(id: string, quantity: number): Promise<ServicePart> {
    const part = await this.getPart(id)
    part.stockQuantity += quantity
    return this.partRepository.save(part)
  }

  /**
   * 备件出库
   */
  async stockOut(id: string, quantity: number): Promise<ServicePart> {
    const part = await this.getPart(id)
    if (part.stockQuantity < quantity) {
      throw new Error('库存不足')
    }
    part.stockQuantity -= quantity
    return this.partRepository.save(part)
  }

  /**
   * 获取库存预警
   */
  async getLowStockParts() {
    return this.partRepository
      .createQueryBuilder('part')
      .where('part.stockQuantity <= part.safetyStock')
      .andWhere('part.isActive = :isActive', { isActive: true })
      .orderBy('part.stockQuantity', 'ASC')
      .getMany()
  }

  /**
   * 获取备件统计
   */
  async getPartStats() {
    const total = await this.partRepository.count()
    const lowStockCount = await this.partRepository
      .createQueryBuilder('part')
      .where('part.stockQuantity <= part.safetyStock')
      .getCount()

    const totalValue = await this.partRepository
      .createQueryBuilder('part')
      .select('SUM(part.stockQuantity * part.unitPrice)', 'total')
      .getRawOne()

    return {
      total,
      lowStockCount,
      totalValue: parseFloat(totalValue.total || 0),
    }
  }
}
