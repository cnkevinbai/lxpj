/**
 * 配件管理服务
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Part, PartStatus, PartLogType } from '@prisma/client'
import { CreatePartDto, UpdatePartDto, PartQueryDto, PartListResponse, PartInventoryDto } from './part.dto'

@Injectable()
export class PartService {
  private readonly logger = new Logger(PartService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePartDto): Promise<Part> {
    const existing = await this.prisma.part.findUnique({ where: { partNo: dto.partNo } })
    if (existing) {
      throw new BadRequestException('配件编号已存在')
    }

    const part = await this.prisma.part.create({
      data: {
        ...dto,
        status: dto.status || PartStatus.ACTIVE,
        price: dto.price?.toString(),
        cost: dto.cost?.toString(),
        stock: dto.stock || 0,
      },
    })

    this.logger.log(`创建配件：${part.partNo} - ${part.name}`)
    return part
  }

  async update(id: string, dto: UpdatePartDto): Promise<Part> {
    const part = await this.prisma.part.findUnique({
      where: { id },
    })
    if (!part) {
      throw new NotFoundException('配件不存在')
    }

    if (dto.partNo && dto.partNo !== part.partNo) {
      const existing = await this.prisma.part.findUnique({ where: { partNo: dto.partNo } })
      if (existing) {
        throw new BadRequestException('配件编号已被使用')
      }
    }

    const data: any = { ...dto }
    if (dto.price !== undefined) {
      data.price = dto.price.toString()
    }
    if (dto.cost !== undefined) {
      data.cost = dto.cost.toString()
    }

    const updated = await this.prisma.part.update({ where: { id }, data })
    this.logger.log(`更新配件：${updated.partNo} - ${updated.name}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const part = await this.prisma.part.findUnique({
      where: { id },
    })
    if (!part) {
      throw new NotFoundException('配件不存在')
    }

    await this.prisma.part.update({
      where: { id },
      data: { status: PartStatus.INACTIVE },
    })

    this.logger.log(`禁用配件：${part.partNo} - ${part.name}`)
  }

  async findOne(id: string): Promise<Part> {
    const part = await this.prisma.part.findUnique({
      where: { id },
    })
    if (!part) {
      throw new NotFoundException('配件不存在')
    }
    return part
  }

  async findAll(query: PartQueryDto): Promise<PartListResponse> {
    const { page = 1, pageSize = 10, keyword, category, status, supplier, minStock } = query
    const where: any = {}

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { partNo: { contains: keyword, mode: 'insensitive' } },
        { category: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    if (category) where.category = category
    if (status) where.status = status
    if (supplier) where.supplier = { contains: supplier, mode: 'insensitive' }

    if (minStock !== undefined) {
      where.stock = where.stock || {}
      where.stock.lte = minStock
    }

    const total = await this.prisma.part.count({ where })
    const list = await this.prisma.part.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return { list, total, page, pageSize }
  }

  async updateStock(id: string, qty: number): Promise<Part> {
    const part = await this.prisma.part.findUnique({
      where: { id },
    })
    if (!part) {
      throw new NotFoundException('配件不存在')
    }

    const newStock = qty
    if (newStock < 0) {
      throw new BadRequestException('库存不能为负数')
    }

    const updated = await this.prisma.part.update({
      where: { id },
      data: { stock: newStock },
    })

    this.logger.log(`更新配件库存：${updated.partNo} - 库存: ${updated.stock}`)
    return updated
  }

  async adjustStock(id: string, qty: number): Promise<Part> {
    const part = await this.prisma.part.findUnique({
      where: { id },
    })
    if (!part) {
      throw new NotFoundException('配件不存在')
    }

    const currentStock = parseFloat(part.stock?.toString() || '0')
    const newStock = currentStock + qty

    if (newStock < 0) {
      throw new BadRequestException('调整后库存不能为负数')
    }

    const updated = await this.prisma.part.update({
      where: { id },
      data: { stock: newStock },
    })

    this.logger.log(`调整配件库存：${updated.partNo} - 调整: ${qty}, 新库存: ${updated.stock}`)
    return updated
  }

  async inventoryLog(partId: string, dto: PartInventoryDto): Promise<Part> {
    const part = await this.prisma.part.findUnique({
      where: { id: partId },
    })
    if (!part) {
      throw new NotFoundException('配件不存在')
    }

    const currentStock = parseFloat(part.stock?.toString() || '0')
    let newStock = currentStock

    if (dto.type === PartLogType.IN) {
      newStock = currentStock + dto.qty
    } else if (dto.type === PartLogType.OUT) {
      newStock = currentStock - dto.qty
      if (newStock < 0) {
        throw new BadRequestException('库存不足')
      }
    } else if (dto.type === PartLogType.ADJUSTMENT) {
      newStock = dto.qty
    }

    const updated = await this.prisma.$transaction([
      this.prisma.part.update({
        where: { id: partId },
        data: { stock: newStock },
      }),
      this.prisma.partLog.create({
        data: {
          partId,
          type: dto.type,
          qty: dto.qty,
          beforeQty: currentStock,
          afterQty: newStock,
          reason: dto.reason,
          refType: dto.refType,
          refId: dto.refId,
        },
      }),
    ])

    this.logger.log(`配件库存日志：${part.partNo} - 类型: ${dto.type}, 数量: ${dto.qty}, 新库存: ${newStock}`)
    return updated[0]
  }

  async getCategoryStats(): Promise<{ category: string; count: number }[]> {
    const stats = await this.prisma.part.groupBy({
      by: ['category'],
      where: { category: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    return (stats as Array<{ category: string | null; _count: { id: number } }>)
      .filter((s) => s.category !== null)
      .map((s) => ({ category: s.category!, count: s._count.id }))
  }

  async getStatusStats(): Promise<{ status: PartStatus; count: number }[]> {
    const stats = await this.prisma.part.groupBy({
      by: ['status'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    return (stats as Array<{ status: PartStatus; _count: { id: number } }>).map(
      (s) => ({ status: s.status, count: s._count.id })
    )
  }

  async getSupplierStats(): Promise<{ supplier: string; count: number }[]> {
    const stats = await this.prisma.part.groupBy({
      by: ['supplier'],
      where: { supplier: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    return (stats as Array<{ supplier: string | null; _count: { id: number } }>)
      .filter((s) => s.supplier !== null)
      .map((s) => ({ supplier: s.supplier!, count: s._count.id }))
  }

  async getCategories(): Promise<string[]> {
    const parts = (await this.prisma.part.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    })) as Array<{ category: string }>
    return parts.map((p) => p.category!).filter(Boolean)
  }

  async getSuppliers(): Promise<string[]> {
    const parts = (await this.prisma.part.findMany({
      where: { supplier: { not: null } },
      select: { supplier: true },
      distinct: ['supplier'],
    })) as Array<{ supplier: string }>
    return parts.map((p) => p.supplier!).filter(Boolean)
  }

  async getSummary(): Promise<any> {
    const totalParts = await this.prisma.part.count()
    const totalPartsValue = await this.prisma.part.aggregate({
      _sum: { price: true, cost: true, stock: true },
    })

    const lowStockParts = await this.prisma.part.count({
      where: { stock: { lt: 10 } },
    })

    const outOfStockParts = await this.prisma.part.count({
      where: { stock: { lte: 0 } },
    })

    const byCategory = await this.getCategoryStats()
    const byStatus = await this.getStatusStats()

    return {
      totalParts,
      totalPartsValue: {
        price: totalPartsValue?._sum?.price || 0,
        cost: totalPartsValue?._sum?.cost || 0,
        stock: totalPartsValue?._sum?.stock || 0,
      },
      lowStockCount: lowStockParts,
      outOfStockCount: outOfStockParts,
      byCategory,
      byStatus,
    }
  }
}
