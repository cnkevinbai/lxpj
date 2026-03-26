/**
 * 应收账款模块 Service
 * 负责应收账款的 CRUD 操作和业务逻辑
 * 注意：Receivable 有 customer 关系，无 invoice/order 关系
 * 有 paidAmount，无 receivedAmount
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateReceivableDto, UpdateReceivableDto, ReceivableQueryDto } from './receivable.dto'
import { ReceivableStatus } from '@prisma/client'

@Injectable()
export class ReceivableService {
  private readonly logger = new Logger(ReceivableService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 生成应收单号
   */
  private generateReceivableNo(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `REC-${dateStr}-${random}`
  }

  /**
   * 创建应收账款
   */
  async create(dto: CreateReceivableDto) {
    // 检查客户是否存在
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    const receivableNo = this.generateReceivableNo()

    // 确定状态
    let status: ReceivableStatus = ReceivableStatus.PENDING
    if (dto.paidAmount && Number(dto.paidAmount) >= Number(dto.amount)) {
      status = ReceivableStatus.PAID
    } else if (dto.paidAmount && Number(dto.paidAmount) > 0) {
      status = ReceivableStatus.PARTIAL
    }

    const receivable = await this.prisma.receivable.create({
      data: {
        receivableNo,
        customerId: dto.customerId,
        orderId: dto.orderId,
        amount: dto.amount,
        paidAmount: dto.paidAmount || 0,
        dueDate: dto.dueDate,
        status,
        remark: dto.remark,
      },
      include: {
        customer: true,
      },
    })

    this.logger.log(`创建应收账款：${receivableNo}`)
    return receivable
  }

  /**
   * 获取应收账款详情
   */
  async findOne(id: string) {
    const receivable = await this.prisma.receivable.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    })
    if (!receivable) {
      throw new NotFoundException('应收账款不存在')
    }
    return receivable
  }

  /**
   * 获取应收账款列表
   */
  async findAll(query: ReceivableQueryDto) {
    const { page = 1, pageSize = 10, keyword, status, customerId } = query
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (keyword) {
      where.receivableNo = { contains: keyword }
    }
    if (status) {
      where.status = status
    }
    if (customerId) {
      where.customerId = customerId
    }

    const [list, total] = await Promise.all([
      this.prisma.receivable.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
        },
      }),
      this.prisma.receivable.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  /**
   * 更新应收账款
   */
  async update(id: string, dto: UpdateReceivableDto) {
    const receivable = await this.findOne(id)

    // 计算新状态
    let status: ReceivableStatus = receivable.status
    if (dto.paidAmount !== undefined) {
      if (Number(dto.paidAmount) >= Number(receivable.amount)) {
        status = ReceivableStatus.PAID
      } else if (Number(dto.paidAmount) > 0) {
        status = ReceivableStatus.PARTIAL
      } else {
        status = ReceivableStatus.PENDING
      }
    }

    const updated = await this.prisma.receivable.update({
      where: { id },
      data: {
        paidAmount: dto.paidAmount,
        dueDate: dto.dueDate,
        remark: dto.remark,
        status,
      },
      include: {
        customer: true,
      },
    })

    this.logger.log(`更新应收账款：${receivable.receivableNo}`)
    return updated
  }

  /**
   * 记录收款
   */
  async recordPayment(id: string, amount: number, remark?: string) {
    const receivable = await this.findOne(id)

    const newPaidAmount = Number(receivable.paidAmount) + amount

    if (newPaidAmount > Number(receivable.amount)) {
      throw new BadRequestException('收款金额不能超过应收金额')
    }

    let status: ReceivableStatus = ReceivableStatus.PARTIAL
    if (newPaidAmount >= Number(receivable.amount)) {
      status = ReceivableStatus.PAID
    }

    const updated = await this.prisma.receivable.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        status,
        remark: remark ? `${receivable.remark || ''}\n${remark}` : receivable.remark,
      },
      include: {
        customer: true,
      },
    })

    this.logger.log(`记录收款：${receivable.receivableNo} 收款 ${amount}`)
    return updated
  }

  /**
   * 删除应收账款
   */
  async delete(id: string) {
    const receivable = await this.findOne(id)

    if (receivable.status !== ReceivableStatus.PENDING) {
      throw new BadRequestException('只有待收状态的应收账款可以删除')
    }

    await this.prisma.receivable.delete({
      where: { id },
    })

    this.logger.log(`删除应收账款：${receivable.receivableNo}`)
  }

  /**
   * 标记为逾期
   */
  async markOverdue(id: string) {
    const receivable = await this.findOne(id)

    if (receivable.status !== ReceivableStatus.PENDING && receivable.status !== ReceivableStatus.PARTIAL) {
      throw new BadRequestException('只有待收或部分收款状态可以标记为逾期')
    }

    const updated = await this.prisma.receivable.update({
      where: { id },
      data: { status: ReceivableStatus.OVERDUE },
    })

    this.logger.log(`标记逾期：${receivable.receivableNo}`)
    return updated
  }

  /**
   * 取消应收账款
   */
  async cancel(id: string) {
    const receivable = await this.findOne(id)

    if (receivable.status === ReceivableStatus.PAID) {
      throw new BadRequestException('已收款的应收账款不能取消')
    }

    const updated = await this.prisma.receivable.update({
      where: { id },
      data: { status: ReceivableStatus.CANCELLED },
    })

    this.logger.log(`取消应收账款：${receivable.receivableNo}`)
    return updated
  }

  /**
   * 获取应收统计
   */
  async getStats() {
    const [total, pending, partial, paid, overdue] = await Promise.all([
      this.prisma.receivable.count(),
      this.prisma.receivable.count({ where: { status: ReceivableStatus.PENDING } }),
      this.prisma.receivable.count({ where: { status: ReceivableStatus.PARTIAL } }),
      this.prisma.receivable.count({ where: { status: ReceivableStatus.PAID } }),
      this.prisma.receivable.count({ where: { status: ReceivableStatus.OVERDUE } }),
    ])

    return { total, pending, partial, paid, overdue }
  }
}