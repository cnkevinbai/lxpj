/**
 * 库存盘点服务
 * 实际库存与系统库存核对
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

export interface InventoryCheck {
  id: string
  checkNo: string
  warehouseId: string
  warehouseName: string
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  totalItems: number
  matchedItems: number
  diffItems: number
  totalDiffQuantity: number
  creatorId: string
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CheckItem {
  id: string
  checkId: string
  productId: string
  productName: string
  productCode: string
  systemQuantity: number
  actualQuantity: number
  diffQuantity: number
  diffReason?: string
  status: 'PENDING' | 'CHECKED' | 'ADJUSTED'
  checkedAt?: Date
  adjustedAt?: Date
}

@Injectable()
export class InventoryCheckService {
  private readonly logger = new Logger(InventoryCheckService.name)

  constructor(private prisma: PrismaService) {}

  private checks: Map<string, InventoryCheck> = new Map()
  private checkItems: Map<string, CheckItem[]> = new Map()

  /**
   * 创建盘点单
   */
  async create(data: {
    warehouseId: string
    productIds?: string[]
    creatorId: string
  }): Promise<InventoryCheck> {
    const checkNo = `CK${Date.now().toString(36).toUpperCase()}`

    const inventories = await this.prisma.inventory.findMany({
      where: data.productIds ? { productId: { in: data.productIds } } : {},
    })

    const check: InventoryCheck = {
      id: Date.now().toString(),
      checkNo,
      warehouseId: data.warehouseId,
      warehouseName: '',
      status: 'DRAFT',
      totalItems: inventories.length,
      matchedItems: 0,
      diffItems: 0,
      totalDiffQuantity: 0,
      creatorId: data.creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const items: CheckItem[] = inventories.map((inv) => ({
      id: `${check.id}-${inv.productId}`,
      checkId: check.id,
      productId: inv.productId,
      productName: '',
      productCode: '',
      systemQuantity: Number(inv.quantity),
      actualQuantity: 0,
      diffQuantity: 0,
      status: 'PENDING',
    }))

    this.checks.set(check.id, check)
    this.checkItems.set(check.id, items)

    this.logger.log(`创建盘点单: ${checkNo}, 共 ${items.length} 项`)
    return check
  }

  /**
   * 开始盘点
   */
  async start(id: string) {
    const check = this.checks.get(id)

    if (!check) throw new NotFoundException('盘点单不存在')
    if (check.status !== 'DRAFT') throw new BadRequestException('只能开始草稿状态的盘点单')

    check.status = 'IN_PROGRESS'
    check.updatedAt = new Date()
    this.checks.set(id, check)

    return check
  }

  /**
   * 盘点单个产品
   */
  async checkItem(
    id: string,
    productId: string,
    data: { actualQuantity: number; diffReason?: string },
  ) {
    const check = this.checks.get(id)

    if (!check) throw new NotFoundException('盘点单不存在')
    if (check.status !== 'IN_PROGRESS') throw new BadRequestException('盘点单未开始或已完成')

    const items = this.checkItems.get(id) || []
    const item = items.find((i) => i.productId === productId)

    if (!item) throw new NotFoundException('盘点项不存在')

    item.actualQuantity = data.actualQuantity
    item.diffQuantity = data.actualQuantity - item.systemQuantity
    item.diffReason = data.diffReason
    item.status = 'CHECKED'
    item.checkedAt = new Date()

    const checkedItems = items.filter((i) => i.status === 'CHECKED')
    check.matchedItems = checkedItems.filter((i) => i.diffQuantity === 0).length
    check.diffItems = checkedItems.filter((i) => i.diffQuantity !== 0).length
    check.totalDiffQuantity = checkedItems.reduce((sum, i) => sum + Math.abs(i.diffQuantity), 0)
    check.updatedAt = new Date()

    this.checkItems.set(id, items)
    this.checks.set(id, check)

    return item
  }

  /**
   * 完成盘点
   */
  async complete(id: string) {
    const check = this.checks.get(id)

    if (!check) throw new NotFoundException('盘点单不存在')
    if (check.status !== 'IN_PROGRESS') throw new BadRequestException('盘点单未开始或已完成')

    const items = this.checkItems.get(id) || []
    if (items.filter((i) => i.status === 'PENDING').length > 0) {
      throw new BadRequestException('还有未盘点的项')
    }

    check.status = 'COMPLETED'
    check.completedAt = new Date()
    check.updatedAt = new Date()
    this.checks.set(id, check)

    return check
  }

  /**
   * 调整库存
   */
  async adjustInventory(id: string, productId: string) {
    const check = this.checks.get(id)

    if (!check) throw new NotFoundException('盘点单不存在')
    if (check.status !== 'COMPLETED') throw new BadRequestException('只能调整已完成盘点的库存')

    const items = this.checkItems.get(id) || []
    const item = items.find((i) => i.productId === productId)

    if (!item) throw new NotFoundException('盘点项不存在')
    if (item.diffQuantity === 0) throw new BadRequestException('该项无差异，无需调整')

    await this.prisma.inventory.updateMany({
      where: { productId: item.productId },
      data: { quantity: item.actualQuantity },
    })

    item.status = 'ADJUSTED'
    item.adjustedAt = new Date()
    this.checkItems.set(id, items)

    this.logger.log(`盘点调整: ${item.productName} ${item.systemQuantity} → ${item.actualQuantity}`)
    return item
  }

  /**
   * 批量调整所有差异
   */
  async batchAdjust(id: string) {
    const items = this.checkItems.get(id) || []
    const diffItems = items.filter((i) => i.diffQuantity !== 0 && i.status === 'CHECKED')

    for (const item of diffItems) {
      await this.adjustInventory(id, item.productId)
    }

    return { adjusted: diffItems.length }
  }

  /**
   * 获取盘点单列表
   */
  async findAll(params: {
    page?: number
    pageSize?: number
    status?: string
    warehouseId?: string
  }) {
    const { page = 1, pageSize = 10, status, warehouseId } = params

    let list = Array.from(this.checks.values())

    if (status) list = list.filter((c) => c.status === status)
    if (warehouseId) list = list.filter((c) => c.warehouseId === warehouseId)

    const total = list.length
    const start = (page - 1) * pageSize

    return { list: list.slice(start, start + pageSize), total, page, pageSize }
  }

  /**
   * 获取盘点单详情
   */
  async findOne(id: string) {
    const check = this.checks.get(id)

    if (!check) throw new NotFoundException('盘点单不存在')

    return { ...check, items: this.checkItems.get(id) || [] }
  }

  /**
   * 获取盘点统计
   */
  async getStats() {
    const list = Array.from(this.checks.values())

    return {
      total: list.length,
      byStatus: {
        draft: list.filter((c) => c.status === 'DRAFT').length,
        inProgress: list.filter((c) => c.status === 'IN_PROGRESS').length,
        completed: list.filter((c) => c.status === 'COMPLETED').length,
        cancelled: list.filter((c) => c.status === 'CANCELLED').length,
      },
      avgDiffRate: 0,
    }
  }
}
