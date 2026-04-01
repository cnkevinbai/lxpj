/**
 * 供应商管理服务
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name)

  constructor(private prisma: PrismaService) {}

  // 内存存储 (实际应使用数据库)
  private suppliers: Map<string, any> = new Map()
  private evaluations: Map<string, any[]> = new Map()

  /**
   * 创建供应商
   */
  async create(data: any): Promise<any> {
    const code = data.code || `SUP${Date.now().toString(36).toUpperCase()}`

    const supplier = {
      id: Date.now().toString(),
      code,
      name: data.name,
      shortName: data.shortName,
      category: data.category,
      contact: data.contact,
      phone: data.phone,
      email: data.email,
      address: data.address,
      province: data.province,
      city: data.city,
      bankName: data.bankName,
      bankAccount: data.bankAccount,
      creditCode: data.creditCode,
      status: 'ACTIVE',
      level: data.level || 'B',
      rating: data.rating || 0,
      remark: data.remark,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.suppliers.set(supplier.id, supplier)
    this.logger.log(`创建供应商: ${supplier.name}`)
    return supplier
  }

  /**
   * 更新供应商
   */
  async update(id: string, data: any): Promise<any> {
    const supplier = this.suppliers.get(id)

    if (!supplier) {
      throw new NotFoundException('供应商不存在')
    }

    const updated = {
      ...supplier,
      ...data,
      updatedAt: new Date(),
    }

    this.suppliers.set(id, updated)
    this.logger.log(`更新供应商: ${updated.name}`)
    return updated
  }

  /**
   * 获取供应商列表
   */
  async findAll(params: {
    page?: number
    pageSize?: number
    keyword?: string
    category?: string
    status?: string
  }) {
    const { page = 1, pageSize = 10, keyword, category, status } = params

    let list = Array.from(this.suppliers.values())

    if (keyword) {
      list = list.filter(
        (s) =>
          s.name?.includes(keyword) || s.code?.includes(keyword) || s.contact?.includes(keyword),
      )
    }

    if (category) {
      list = list.filter((s) => s.category === category)
    }

    if (status) {
      list = list.filter((s) => s.status === status)
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pagedList = list.slice(start, start + pageSize)

    return { list: pagedList, total, page, pageSize }
  }

  /**
   * 获取供应商详情
   */
  async findOne(id: string) {
    const supplier = this.suppliers.get(id)

    if (!supplier) {
      throw new NotFoundException('供应商不存在')
    }

    return {
      ...supplier,
      _count: { purchases: 0 },
    }
  }

  /**
   * 删除供应商
   */
  async delete(id: string) {
    const supplier = this.suppliers.get(id)

    if (!supplier) {
      throw new NotFoundException('供应商不存在')
    }

    supplier.status = 'INACTIVE'
    supplier.updatedAt = new Date()
    this.suppliers.set(id, supplier)

    this.logger.log(`停用供应商: ${supplier.name}`)
  }

  /**
   * 加入黑名单
   */
  async blacklist(id: string, reason: string) {
    const supplier = this.suppliers.get(id)

    if (!supplier) {
      throw new NotFoundException('供应商不存在')
    }

    supplier.status = 'BLACKLIST'
    supplier.remark = `[黑名单] ${reason}`
    supplier.updatedAt = new Date()
    this.suppliers.set(id, supplier)

    this.logger.log(`供应商加入黑名单: ${supplier.name}`)
    return supplier
  }

  /**
   * 供应商评估
   */
  async evaluate(
    supplierId: string,
    data: {
      quality: number
      delivery: number
      price: number
      service: number
      period: string
      remark?: string
    },
  ) {
    const supplier = this.suppliers.get(supplierId)

    if (!supplier) {
      throw new NotFoundException('供应商不存在')
    }

    const total = (data.quality + data.delivery + data.price + data.service) / 4

    const evaluation = {
      id: Date.now().toString(),
      supplierId,
      quality: data.quality,
      delivery: data.delivery,
      price: data.price,
      service: data.service,
      total,
      period: data.period,
      remark: data.remark,
      createdAt: new Date(),
    }

    // 保存评估
    const evals = this.evaluations.get(supplierId) || []
    evals.push(evaluation)
    this.evaluations.set(supplierId, evals)

    // 更新供应商评分
    supplier.rating = total
    supplier.updatedAt = new Date()
    this.suppliers.set(supplierId, supplier)

    return evaluation
  }

  /**
   * 获取供应商评估历史
   */
  async getEvaluations(supplierId: string, params: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 10 } = params

    const evals = this.evaluations.get(supplierId) || []
    const total = evals.length
    const start = (page - 1) * pageSize
    const list = evals.slice(start, start + pageSize)

    return { list, total, page, pageSize }
  }

  /**
   * 获取供应商分类列表
   */
  getCategories() {
    return [
      { value: 'raw-material', label: '原材料' },
      { value: 'parts', label: '零部件' },
      { value: 'equipment', label: '设备' },
      { value: 'service', label: '服务' },
      { value: 'logistics', label: '物流' },
      { value: 'other', label: '其他' },
    ]
  }

  /**
   * 获取供应商统计
   */
  async getStats() {
    const list = Array.from(this.suppliers.values())
    const active = list.filter((s) => s.status === 'ACTIVE')

    const byLevel = active.reduce((acc: any, s) => {
      acc[s.level] = (acc[s.level] || 0) + 1
      return acc
    }, {})

    const byCategory = active.reduce((acc: any, s) => {
      if (s.category) {
        acc[s.category] = (acc[s.category] || 0) + 1
      }
      return acc
    }, {})

    const avgRating =
      active.length > 0 ? active.reduce((sum, s) => sum + (s.rating || 0), 0) / active.length : 0

    return {
      total: active.length,
      byLevel: Object.entries(byLevel).map(([level, count]) => ({ level, count })),
      byCategory: Object.entries(byCategory).map(([category, count]) => ({ category, count })),
      avgRating,
    }
  }
}
