/**
 * BOM 模块服务
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateBomDto, UpdateBomDto, CreateBomItemDto, UpdateBomItemDto, BomQueryDto, BomListResponse } from './bom.dto'

@Injectable()
export class BomService {
  private readonly logger = new Logger(BomService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBomDto): Promise<any> {
    const existing = await this.prisma.bom.findUnique({ where: { bomNo: dto.bomNo } })
    if (existing) {
      throw new BadRequestException('BOM 编号已存在')
    }

    const bom = await this.prisma.bom.create({
      data: {
        bomNo: dto.bomNo,
        productId: dto.productId,
        version: dto.version || '1.0',
        status: dto.status || 'ACTIVE',
        remark: dto.remark,
      },
    })

    this.logger.log(`创建 BOM：${bom.bomNo}`)
    return bom
  }

  async update(id: string, dto: UpdateBomDto): Promise<any> {
    const bom = await this.prisma.bom.findUnique({
      where: { id },
    })
    if (!bom) {
      throw new NotFoundException('BOM 不存在')
    }

    if (dto.bomNo && dto.bomNo !== bom.bomNo) {
      const existing = await this.prisma.bom.findUnique({ where: { bomNo: dto.bomNo } })
      if (existing && existing.id !== id) {
        throw new BadRequestException('BOM 编号已被使用')
      }
    }

    const data: any = {}
    if (dto.bomNo) data.bomNo = dto.bomNo
    if (dto.productId) data.productId = dto.productId
    if (dto.version) data.version = dto.version
    if (dto.status) data.status = dto.status
    if (dto.remark !== undefined) data.remark = dto.remark

    const updated = await this.prisma.bom.update({ where: { id }, data })
    this.logger.log(`更新 BOM：${updated.bomNo}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const bom = await this.prisma.bom.findUnique({
      where: { id },
    })
    if (!bom) {
      throw new NotFoundException('BOM 不存在')
    }

    await this.prisma.bom.delete({ where: { id } })
    this.logger.log(`删除 BOM：${bom.bomNo}`)
  }

  async findOne(id: string, includeItems: boolean = false): Promise<any> {
    const bom = await this.prisma.bom.findUnique({
      where: { id },
      include: includeItems ? { items: true } : undefined,
    })
    if (!bom) {
      throw new NotFoundException('BOM 不存在')
    }
    return bom
  }

  async findAll(query: BomQueryDto): Promise<BomListResponse> {
    const { page = 1, pageSize = 10, bomNo, productId, status } = query
    const where: any = {}

    if (bomNo) where.bomNo = { contains: bomNo, mode: 'insensitive' }
    if (productId) where.productId = productId
    if (status) where.status = status

    const total = await this.prisma.bom.count({ where })
    const list = await this.prisma.bom.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return { list, total, page, pageSize }
  }

  async addItem(bomId: string, dto: CreateBomItemDto): Promise<any> {
    const bom = await this.prisma.bom.findUnique({ where: { id: bomId } })
    if (!bom) {
      throw new NotFoundException('BOM 不存在')
    }

    // 检查物料是否已存在
    const existingItem = await this.prisma.bomItem.findFirst({
      where: { bomId: bomId, productId: dto.productId },
    })
    if (existingItem) {
      throw new BadRequestException('物料已存在于 BOM 中')
    }

    const item = await this.prisma.bomItem.create({
      data: {
        bomId: bomId,
        productId: dto.productId,
        materialId: dto.materialId,
        quantity: dto.quantity,
        unit: dto.unit,
        scrapRate: dto.scrapRate,
        remark: dto.remark,
      },
    })

    this.logger.log(`添加 BOM 物料：BOM ${bom.bomNo} - 物料 ${dto.productId}`)
    return item
  }

  async updateItem(itemId: string, dto: UpdateBomItemDto): Promise<any> {
    const item = await this.prisma.bomItem.findUnique({
      where: { id: itemId },
    })
    if (!item) {
      throw new NotFoundException('BOM 物料项不存在')
    }

    const data: any = {}
    if (dto.quantity !== undefined) data.quantity = dto.quantity
    if (dto.unit) data.unit = dto.unit
    if (dto.scrapRate !== undefined) data.scrapRate = dto.scrapRate
    if (dto.remark !== undefined) data.remark = dto.remark

    const updated = await this.prisma.bomItem.update({ where: { id: itemId }, data })
    this.logger.log(`更新 BOM 物料：${itemId}`)
    return updated
  }

  async removeItem(itemId: string): Promise<void> {
    const item = await this.prisma.bomItem.findUnique({
      where: { id: itemId },
    })
    if (!item) {
      throw new NotFoundException('BOM 物料项不存在')
    }

    await this.prisma.bomItem.delete({ where: { id: itemId } })
    this.logger.log(`删除 BOM 物料：${itemId}`)
  }

  async getCountByStatus(): Promise<{ status: string; count: number }[]> {
    const stats = await this.prisma.bom.groupBy({
      by: ['status'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    return stats.map((s: any) => ({ status: s.status, count: s._count.id }))
  }

  async getBomByProduct(productId: string): Promise<any[]> {
    const boms = await this.prisma.bom.findMany({
      where: { productId: productId },
      orderBy: { version: 'desc' },
    })
    return boms
  }
}
