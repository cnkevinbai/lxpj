/**
 * 发票模块 Service
 * 负责发票的 CRUD 操作和业务逻辑
 * 注意：Invoice 模型没有 customer/order 关系，只有 customerId/orderId
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateInvoiceDto, UpdateInvoiceDto, InvoiceQueryDto } from './invoice.dto'
import { InvoiceStatus } from '@prisma/client'

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  /**
   * 生成发票号
   * 格式：INV-YYYYMMDD-XXXX
   */
  private generateInvoiceNo(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `INV-${dateStr}-${random}`
  }

  /**
   * 创建发票
   * @param dto 创建发票 DTO
   * @returns 创建的发票
   */
  async create(dto: CreateInvoiceDto) {
    // 如果提供了客户 ID，检查客户是否存在
    if (dto.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: dto.customerId },
      })
      if (!customer) {
        throw new NotFoundException('客户不存在')
      }
    }

    // 如果提供了订单 ID，检查订单是否存在
    if (dto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
      })
      if (!order) {
        throw new NotFoundException('订单不存在')
      }
    }

    // 生成发票号
    const invoiceNo = this.generateInvoiceNo()

    // 计算总金额
    const totalAmount = Number(dto.amount || 0) + Number(dto.taxAmount || 0)

    // 创建发票
    return this.prisma.invoice.create({
      data: {
        invoiceNo,
        type: dto.type,
        status: InvoiceStatus.DRAFT,
        amount: dto.amount,
        taxAmount: dto.taxAmount || 0,
        totalAmount,
        issueDate: dto.issueDate,
        dueDate: dto.dueDate,
        remark: dto.remark,
        customerId: dto.customerId,
        orderId: dto.orderId,
        purchaseId: dto.purchaseId,
        supplierId: dto.supplierId,
      },
    })
  }

  /**
   * 根据 ID 查找发票
   * @param id 发票 ID
   * @returns 发票详情
   */
  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    })

    if (!invoice) {
      throw new NotFoundException('发票不存在')
    }

    return invoice
  }

  /**
   * 获取发票列表（分页）
   * @param query 查询参数
   * @returns 发票列表和总数
   */
  async findAll(query: InvoiceQueryDto) {
    const { page = 1, pageSize = 10, keyword, type, status, customerId, orderId } = query
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (keyword) {
      where.invoiceNo = { contains: keyword }
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (orderId) {
      where.orderId = orderId
    }

    const [list, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  /**
   * 更新发票
   * @param id 发票 ID
   * @param dto 更新内容
   * @returns 更新后的发票
   */
  async update(id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.findOne(id)

    // 只有草稿状态可以修改
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的发票可以修改')
    }

    // 重新计算总金额
    const amount = dto.amount !== undefined ? dto.amount : invoice.amount
    const taxAmount = dto.taxAmount !== undefined ? dto.taxAmount : invoice.taxAmount
    const totalAmount = Number(amount) + Number(taxAmount)

    return this.prisma.invoice.update({
      where: { id },
      data: {
        type: dto.type,
        amount: dto.amount,
        taxAmount: dto.taxAmount,
        totalAmount,
        issueDate: dto.issueDate,
        dueDate: dto.dueDate,
        remark: dto.remark,
        customerId: dto.customerId,
        orderId: dto.orderId,
      },
    })
  }

  /**
   * 删除发票
   * @param id 发票 ID
   */
  async delete(id: string) {
    const invoice = await this.findOne(id)

    // 只有草稿状态可以删除
    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的发票可以删除')
    }

    await this.prisma.invoice.delete({
      where: { id },
    })
  }

  /**
   * 开票（发送发票）
   * @param id 发票 ID
   * @returns 更新后的发票
   */
  async issue(id: string) {
    const invoice = await this.findOne(id)

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的发票可以开票')
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.SENT,
        issueDate: invoice.issueDate || new Date(),
      },
    })
  }

  /**
   * 标记为已支付
   * @param id 发票 ID
   * @returns 更新后的发票
   */
  async markPaid(id: string) {
    const invoice = await this.findOne(id)

    if (invoice.status !== InvoiceStatus.SENT && invoice.status !== InvoiceStatus.OVERDUE) {
      throw new BadRequestException('只有已发送或逾期状态的发票可以标记为已支付')
    }

    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.PAID },
    })
  }

  /**
   * 标记为逾期
   * @param id 发票 ID
   * @returns 更新后的发票
   */
  async markOverdue(id: string) {
    const invoice = await this.findOne(id)

    if (invoice.status !== InvoiceStatus.SENT) {
      throw new BadRequestException('只有已发送状态的发票可以标记为逾期')
    }

    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.OVERDUE },
    })
  }

  /**
   * 作废发票
   * @param id 发票 ID
   * @returns 更新后的发票
   */
  async cancel(id: string) {
    const invoice = await this.findOne(id)

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('已支付的发票不能作废')
    }

    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.CANCELLED },
    })
  }

  /**
   * 获取发票统计
   * @returns 统计数据
   */
  async getStats() {
    const [total, draft, sent, paid, overdue, cancelled] = await Promise.all([
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.DRAFT } }),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.SENT } }),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.PAID } }),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.OVERDUE } }),
      this.prisma.invoice.count({ where: { status: InvoiceStatus.CANCELLED } }),
    ])

    return { total, draft, sent, paid, overdue, cancelled }
  }
}