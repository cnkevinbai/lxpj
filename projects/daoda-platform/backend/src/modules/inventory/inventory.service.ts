/**
 * 库存模块 Service
 * 负责库存数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import {
  CreateInventoryDto,
  UpdateInventoryDto,
  InventoryQueryDto,
  InventoryChangeDto,
  InventoryLogQueryDto,
} from './inventory.dto'
import { InventoryLogType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name)
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInventoryDto) {
    // 检查该产品在该仓库是否已有库存记录
    const existing = await this.prisma.inventory.findUnique({
      where: {
        productId_warehouse: {
          productId: dto.productId,
          warehouse: dto.warehouse || 'default',
        },
      },
    })

    if (existing) {
      throw new BadRequestException('该产品在此仓库已存在库存记录')
    }

    return this.prisma.inventory.create({
      data: {
        productId: dto.productId,
        warehouse: dto.warehouse || 'default',
        quantity: dto.quantity || 0,
        qty: dto.quantity || 0,
        warningQty: dto.warningQty || 10,
      },
      include: {
        product: true,
      },
    })
  }

  async findOne(id: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
      },
    })
    if (!inventory) {
      throw new NotFoundException('库存不存在')
    }
    return inventory
  }

  async findByProductId(productId: string) {
    return this.prisma.inventory.findMany({
      where: { productId },
      include: {
        product: true,
      },
    })
  }

  async findAll(query: InventoryQueryDto) {
    const { page = 1, pageSize = 10, keyword, productId, warehouse } = query
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (productId) where.productId = productId
    if (warehouse) where.warehouse = warehouse
    if (keyword) {
      where.OR = [
        { product: { name: { contains: keyword } } },
        { product: { code: { contains: keyword } } },
      ]
    }

    const [list, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          product: {
            select: {
              id: true,
              code: true,
              name: true,
              category: true,
              unit: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventory.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  async update(id: string, dto: UpdateInventoryDto) {
    await this.findOne(id)
    return this.prisma.inventory.update({
      where: { id },
      data: {
        warehouse: dto.warehouse,
        quantity: dto.quantity,
        qty: dto.quantity,
        warningQty: dto.warningQty,
      },
      include: {
        product: true,
      },
    })
  }

  async changeStock(id: string, dto: InventoryChangeDto) {
    const inventory = await this.findOne(id)

    const currentQty = Number(inventory.quantity)
    const changeQty = Number(dto.quantity)
    const newQuantity = dto.type === 'OUT' ? currentQty - changeQty : currentQty + changeQty

    if (newQuantity < 0) {
      throw new BadRequestException('库存不足')
    }

    // 更新库存
    const updated = await this.prisma.inventory.update({
      where: { id },
      data: {
        quantity: newQuantity,
        qty: newQuantity,
      },
    })

    // 记录库存变动日志
    await this.prisma.inventoryLog.create({
      data: {
        inventoryId: id,
        type: dto.type,
        qty: changeQty,
        beforeQty: currentQty,
        afterQty: newQuantity,
        reason: dto.reason,
        refType: dto.refType,
        refId: dto.refId,
      },
    })

    this.logger.log(`库存变动：${id} ${dto.type} ${changeQty}`)
    return updated
  }

  async findLogs(query: InventoryLogQueryDto) {
    const { page = 1, pageSize = 10, inventoryId, type } = query
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (inventoryId) where.inventoryId = inventoryId
    if (type) where.type = type

    const [list, total] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          inventory: {
            include: {
              product: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventoryLog.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  async checkWarning() {
    // 获取库存低于预警值的记录
    const warnings = await this.prisma.$queryRaw<Array<{
      id: string
      productId: string
      warehouse: string
      quantity: Decimal
      warningQty: Decimal
    }>>`
      SELECT id, "product_id", warehouse, quantity, warning_qty
      FROM inventories
      WHERE quantity <= COALESCE(warning_qty, 10)
    `

    return warnings.map((w) => ({
      id: w.id,
      productId: w.productId,
      warehouse: w.warehouse,
      quantity: Number(w.quantity),
      warningQty: Number(w.warningQty),
    }))
  }

  async delete(id: string) {
    const inventory = await this.findOne(id)

    // 删除相关的库存日志
    await this.prisma.inventoryLog.deleteMany({
      where: { inventoryId: id },
    })

    // 删除库存记录
    await this.prisma.inventory.delete({
      where: { id },
    })

    return { message: '库存记录已删除' }
  }

  async getStats() {
    const total = await this.prisma.inventory.count()
    const lowStock = await this.prisma.inventory.count({
      where: {
        quantity: { lte: 10 },
      },
    })
    const outOfStock = await this.prisma.inventory.count({
      where: {
        quantity: { lte: 0 },
      },
    })
    return { total, lowStock, outOfStock }
  }
}