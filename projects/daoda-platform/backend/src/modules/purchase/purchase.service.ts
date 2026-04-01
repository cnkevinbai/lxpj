/**
 * 采购模块 Service
 * 负责采购数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreatePurchaseDto, UpdatePurchaseDto, PurchaseQueryDto } from './purchase.dto'
import { PurchaseStatus } from '@prisma/client'

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  /**
   * 生成采购单号
   * 格式：PO-YYYYMMDD-XXXX
   */
  private generatePurchaseNo(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    return `PO-${dateStr}-${random}`
  }

  /**
   * 创建采购单
   * @param dto 创建采购单 DTO
   * @param userId 用户 ID
   * @returns 创建的采购单
   */
  async create(dto: CreatePurchaseDto, userId?: string) {
    // 计算总金额
    const totalAmount = dto.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice
    }, 0)

    // 生成采购单号
    const purchaseNo = this.generatePurchaseNo()

    // 创建采购单及采购项
    return this.prisma.purchase.create({
      data: {
        purchaseNo,
        supplierId: dto.supplierId,
        supplierName: dto.supplierName,
        status: PurchaseStatus.DRAFT,
        amount: totalAmount,
        paidAmount: 0,
        paymentStatus: 'UNPAID',
        remark: dto.remark,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
            remark: item.remark,
          })),
        },
      },
    })
  }

  /**
   * 根据 ID 查找采购单
   * @param id 采购单 ID
   * @returns 采购单详情
   */
  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    })

    if (!purchase) {
      throw new NotFoundException('采购单不存在')
    }

    return purchase
  }

  /**
   * 获取采购单列表（分页）
   * @param query 查询参数
   * @returns 采购单列表和总数
   */
  async findAll(query: PurchaseQueryDto) {
    const { page = 1, pageSize = 10, keyword, status, paymentStatus } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（采购单号或供应商）
    if (keyword) {
      where.OR = [{ purchaseNo: { contains: keyword } }, { supplier: { contains: keyword } }]
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    // 查询总数
    const total = await this.prisma.purchase.count({ where })

    // 查询数据
    const list = await this.prisma.purchase.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 更新采购单
   * @param id 采购单 ID
   * @param dto 更新 DTO
   * @returns 更新后的采购单
   */
  async update(id: string, dto: UpdatePurchaseDto) {
    // 检查采购单是否存在
    const existing = await this.prisma.purchase.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('采购单不存在')
    }

    // 如果更新已付金额，需要验证
    if (dto.paidAmount !== undefined) {
      const totalAmountNum = Number(existing.amount)
      if (dto.paidAmount > totalAmountNum) {
        throw new BadRequestException('已付金额不能大于总金额')
      }

      // 自动更新付款状态
      if (dto.paidAmount >= totalAmountNum) {
        dto.paymentStatus = 'PAID'
      } else if (dto.paidAmount > 0) {
        dto.paymentStatus = 'PARTIAL'
      } else {
        dto.paymentStatus = 'UNPAID'
      }
    }

    // 更新采购单
    return this.prisma.purchase.update({
      where: { id },
      data: {
        supplierId: dto.supplierId,
        supplierName: dto.supplierName,
        status: dto.status,
        paidAmount: dto.paidAmount,
        paymentStatus: dto.paymentStatus,
        remark: dto.remark,
      },
    })
  }

  /**
   * 确认采购单（状态变更为已确认）
   * @param id 采购单 ID
   * @returns 更新后的采购单
   */
  async approve(id: string) {
    return this.prisma.purchase.update({
      where: { id },
      data: { status: PurchaseStatus.APPROVED },
      include: { items: true },
    })
  }

  /**
   * 完成采购单（收货并更新库存）
   * @param id 采购单 ID
   * @returns 更新后的采购单
   */
  async complete(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!purchase) {
      throw new NotFoundException('采购单不存在')
    }

    // 使用事务更新采购单状态并增加库存
    await this.prisma.$transaction(async (tx) => {
      // 更新采购单状态
      await tx.purchase.update({
        where: { id },
        data: { status: PurchaseStatus.RECEIVED },
      })

      // 遍历采购项，更新库存
      for (const item of purchase.items) {
        // 查找或创建库存记录
        let inventory = await tx.inventory.findFirst({
          where: { productId: item.productId },
        })

        const itemQty = Number(item.quantity)
        const currentQty = inventory ? Number(inventory.quantity) : 0
        const newQty = currentQty + itemQty

        if (inventory) {
          // 更新库存数量
          await tx.inventory.update({
            where: { id: inventory.id },
            data: { quantity: newQty, qty: newQty },
          })
        } else {
          // 创建新的库存记录
          inventory = await tx.inventory.create({
            data: {
              productId: item.productId,
              warehouse: 'default',
              quantity: itemQty,
              qty: itemQty,
              warningQty: 10,
            },
          })
        }

        // 创建库存日志
        await tx.inventoryLog.create({
          data: {
            inventoryId: inventory.id,
            type: 'IN',
            qty: itemQty,
            beforeQty: currentQty,
            afterQty: newQty,
            reason: `采购入库 - ${purchase.purchaseNo}`,
            refType: 'purchase',
            refId: id,
          },
        })
      }
    })

    return this.findOne(id)
  }

  /**
   * 取消采购单
   * @param id 采购单 ID
   * @returns 更新后的采购单
   */
  async cancel(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    })

    if (!purchase) {
      throw new NotFoundException('采购单不存在')
    }

    if (purchase.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestException('已收货的采购单不能取消')
    }

    return this.prisma.purchase.update({
      where: { id },
      data: { status: PurchaseStatus.CANCELLED },
      include: { items: true },
    })
  }

  /**
   * 删除采购单
   * @param id 采购单 ID
   */
  async delete(id: string) {
    // 检查采购单是否存在
    const existing = await this.prisma.purchase.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('采购单不存在')
    }

    // 只能删除待处理的采购单
    if (existing.status !== PurchaseStatus.PENDING) {
      throw new BadRequestException('只能删除待处理的采购单')
    }

    // 删除采购单（采购项会级联删除）
    await this.prisma.purchase.delete({
      where: { id },
    })

    return { message: '采购单已删除' }
  }
}
