/**
 * 库存调拨服务
 * 多仓库之间的库存转移管理
 *
 * @version 1.0.0
 * @since 2026-03-31
 */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'

export interface InventoryTransfer {
  id: string
  transferNo: string
  productId: string
  productName: string
  fromWarehouseId: string
  fromWarehouseName: string
  toWarehouseId: string
  toWarehouseName: string
  quantity: number
  status: 'DRAFT' | 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED'
  applicantId: string
  approverId?: string
  remark?: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class InventoryTransferService {
  private readonly logger = new Logger(InventoryTransferService.name)

  constructor(private prisma: PrismaService) {}

  // 内存存储 (实际应使用数据库)
  private transfers: Map<string, InventoryTransfer> = new Map()

  /**
   * 创建调拨单
   */
  async create(data: {
    productId: string
    fromWarehouseId: string
    toWarehouseId: string
    quantity: number
    applicantId: string
    remark?: string
  }): Promise<InventoryTransfer> {
    if (data.fromWarehouseId === data.toWarehouseId) {
      throw new BadRequestException('调出仓库和调入仓库不能相同')
    }

    const fromInventory = await this.prisma.inventory.findFirst({
      where: { productId: data.productId },
    })

    if (!fromInventory || Number(fromInventory.quantity) < data.quantity) {
      throw new BadRequestException('调出仓库库存不足')
    }

    const transferNo = `TR${Date.now().toString(36).toUpperCase()}`

    const transfer: InventoryTransfer = {
      id: Date.now().toString(),
      transferNo,
      productId: data.productId,
      productName: '',
      fromWarehouseId: data.fromWarehouseId,
      fromWarehouseName: '',
      toWarehouseId: data.toWarehouseId,
      toWarehouseName: '',
      quantity: data.quantity,
      status: 'DRAFT',
      applicantId: data.applicantId,
      remark: data.remark,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.transfers.set(transfer.id, transfer)
    this.logger.log(`创建调拨单: ${transferNo}`)

    return transfer
  }

  /**
   * 提交审批
   */
  async submitForApproval(id: string) {
    const transfer = this.transfers.get(id)

    if (!transfer) {
      throw new NotFoundException('调拨单不存在')
    }

    if (transfer.status !== 'DRAFT') {
      throw new BadRequestException('只能提交草稿状态的调拨单')
    }

    transfer.status = 'PENDING'
    transfer.updatedAt = new Date()
    this.transfers.set(id, transfer)

    this.logger.log(`调拨单 ${transfer.transferNo} 已提交审批`)
    return transfer
  }

  /**
   * 审批通过
   */
  async approve(id: string, approverId: string) {
    const transfer = this.transfers.get(id)

    if (!transfer) {
      throw new NotFoundException('调拨单不存在')
    }

    if (transfer.status !== 'PENDING') {
      throw new BadRequestException('只能审批待审批状态的调拨单')
    }

    transfer.status = 'IN_TRANSIT'
    transfer.approverId = approverId
    transfer.updatedAt = new Date()
    this.transfers.set(id, transfer)

    this.logger.log(`调拨单 ${transfer.transferNo} 已审批通过`)
    return transfer
  }

  /**
   * 完成调拨
   */
  async complete(id: string) {
    const transfer = this.transfers.get(id)

    if (!transfer) {
      throw new NotFoundException('调拨单不存在')
    }

    if (transfer.status !== 'IN_TRANSIT') {
      throw new BadRequestException('只能完成运输中的调拨单')
    }

    // 执行库存变更
    const fromInventory = await this.prisma.inventory.findFirst({
      where: { productId: transfer.productId },
    })

    if (fromInventory) {
      await this.prisma.inventory.update({
        where: { id: fromInventory.id },
        data: { quantity: Number(fromInventory.quantity) - transfer.quantity },
      })
    }

    const toInventory = await this.prisma.inventory.findFirst({
      where: { productId: transfer.productId },
    })

    if (toInventory) {
      await this.prisma.inventory.update({
        where: { id: toInventory.id },
        data: { quantity: Number(toInventory.quantity) + transfer.quantity },
      })
    } else {
      await this.prisma.inventory.create({
        data: {
          productId: transfer.productId,
          quantity: transfer.quantity,
          warningQty: 0,
        },
      })
    }

    transfer.status = 'COMPLETED'
    transfer.updatedAt = new Date()
    this.transfers.set(id, transfer)

    this.logger.log(`调拨单 ${transfer.transferNo} 已完成`)
    return transfer
  }

  /**
   * 取消调拨
   */
  async cancel(id: string, reason?: string) {
    const transfer = this.transfers.get(id)

    if (!transfer) {
      throw new NotFoundException('调拨单不存在')
    }

    if (transfer.status === 'COMPLETED') {
      throw new BadRequestException('已完成的调拨单不能取消')
    }

    transfer.status = 'CANCELLED'
    transfer.remark = reason ? `${transfer.remark || ''}\n取消原因: ${reason}` : transfer.remark
    transfer.updatedAt = new Date()
    this.transfers.set(id, transfer)

    this.logger.log(`调拨单 ${transfer.transferNo} 已取消`)
    return transfer
  }

  /**
   * 获取调拨单列表
   */
  async findAll(params: {
    page?: number
    pageSize?: number
    status?: string
    productId?: string
    warehouseId?: string
  }) {
    const { page = 1, pageSize = 10, status, productId, warehouseId } = params

    let list = Array.from(this.transfers.values())

    if (status) {
      list = list.filter((t) => t.status === status)
    }

    if (productId) {
      list = list.filter((t) => t.productId === productId)
    }

    if (warehouseId) {
      list = list.filter(
        (t) => t.fromWarehouseId === warehouseId || t.toWarehouseId === warehouseId,
      )
    }

    const total = list.length
    const start = (page - 1) * pageSize
    const pagedList = list.slice(start, start + pageSize)

    return { list: pagedList, total, page, pageSize }
  }

  /**
   * 获取调拨单详情
   */
  async findOne(id: string) {
    const transfer = this.transfers.get(id)

    if (!transfer) {
      throw new NotFoundException('调拨单不存在')
    }

    return transfer
  }

  /**
   * 获取调拨统计
   */
  async getStats() {
    const list = Array.from(this.transfers.values())

    return {
      total: list.length,
      byStatus: {
        draft: list.filter((t) => t.status === 'DRAFT').length,
        pending: list.filter((t) => t.status === 'PENDING').length,
        inTransit: list.filter((t) => t.status === 'IN_TRANSIT').length,
        completed: list.filter((t) => t.status === 'COMPLETED').length,
        cancelled: list.filter((t) => t.status === 'CANCELLED').length,
      },
      totalQuantity: list
        .filter((t) => t.status === 'COMPLETED')
        .reduce((sum, t) => sum + t.quantity, 0),
    }
  }
}
