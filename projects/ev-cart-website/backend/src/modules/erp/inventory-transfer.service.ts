/**
 * 库存调拨服务 - 多仓库调拨管理
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

export interface InventoryTransfer {
  id: string
  transferNo: string
  fromWarehouseId: string
  fromWarehouseName: string
  toWarehouseId: string
  toWarehouseName: string
  items: TransferItem[]
  status: 'pending' | 'approved' | 'in_transit' | 'completed' | 'cancelled'
  applicantId: string
  applicantName: string
  approverId?: string
  approverName?: string
  shippedAt?: Date
  receivedAt?: Date
  completedAt?: Date
  remarks?: string
  createdAt: Date
}

export interface TransferItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unit: string
  batchNo?: string
}

@Injectable()
export class InventoryTransferService {
  constructor(
    @InjectRepository('inventory_transfers')
    private repository: Repository<any>,
  ) {}

  /**
   * 创建调拨单
   */
  async create(data: Partial<InventoryTransfer>): Promise<any> {
    const transfer = this.repository.create({
      ...data,
      transferNo: this.generateTransferNo(),
      status: 'pending',
      createdAt: new Date(),
    })
    return this.repository.save(transfer)
  }

  /**
   * 生成调拨单号
   */
  private generateTransferNo(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `TRF-${date}-${random}`
  }

  /**
   * 获取调拨单列表
   */
  async getTransfers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string
      fromWarehouseId?: string
      toWarehouseId?: string
      startDate?: string
      endDate?: string
    },
  ) {
    const query = this.repository.createQueryBuilder('transfer')
      .orderBy('transfer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.status) {
      query.andWhere('transfer.status = :status', { status: filters.status })
    }
    if (filters?.fromWarehouseId) {
      query.andWhere('transfer.fromWarehouseId = :fromWarehouseId', { fromWarehouseId: filters.fromWarehouseId })
    }
    if (filters?.toWarehouseId) {
      query.andWhere('transfer.toWarehouseId = :toWarehouseId', { toWarehouseId: filters.toWarehouseId })
    }
    if (filters?.startDate) {
      query.andWhere('transfer.createdAt >= :startDate', { startDate: filters.startDate })
    }
    if (filters?.endDate) {
      query.andWhere('transfer.createdAt <= :endDate', { endDate: filters.endDate })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 审批调拨单
   */
  async approve(id: string, approverId: string, approverName: string) {
    return this.repository.update(id, {
      status: 'approved',
      approverId,
      approverName,
      approvedAt: new Date(),
    })
  }

  /**
   * 发货
   */
  async ship(id: string) {
    return this.repository.update(id, {
      status: 'in_transit',
      shippedAt: new Date(),
    })
  }

  /**
   * 收货
   */
  async receive(id: string) {
    return this.repository.update(id, {
      status: 'completed',
      receivedAt: new Date(),
      completedAt: new Date(),
    })
  }

  /**
   * 取消调拨
   */
  async cancel(id: string, reason?: string) {
    return this.repository.update(id, {
      status: 'cancelled',
      completedAt: new Date(),
      remarks: reason,
    })
  }

  /**
   * 获取调拨统计
   */
  async getStats(startDate?: Date, endDate?: Date) {
    const query = this.repository.createQueryBuilder('transfer')

    if (startDate) {
      query.andWhere('transfer.createdAt >= :startDate', { startDate })
    }
    if (endDate) {
      query.andWhere('transfer.createdAt <= :endDate', { endDate })
    }

    const total = await query.getCount()
    const byStatus = await query
      .clone()
      .select('status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('status')
      .getRawMany()

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count)
        return acc
      }, {}),
    }
  }
}
