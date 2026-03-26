/**
 * 报价模块 Service
 * 负责报价数据的 CRUD 操作和业务逻辑
 * 注意：Quotation 有 customer/items 关系，但无 opportunity 关系
 * QuotationItem 没有 product 关系，需要提供 productName
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateQuotationDto, UpdateQuotationDto, QuotationQueryDto } from './quotation.dto'
import { QuotationStatus } from '@prisma/client'

@Injectable()
export class QuotationService {
  private readonly logger = new Logger(QuotationService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 生成报价单号
   * 格式：QT-YYYYMMDD-XXXX
   */
  private generateQuotationNo(): string {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `QT-${dateStr}-${random}`
  }

  /**
   * 创建报价单
   */
  async create(dto: CreateQuotationDto, userId?: string) {
    // 检查客户是否存在
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    const quotationNo = this.generateQuotationNo()
    let totalAmount = 0

    // 处理报价项目
    const items = dto.items.map(item => {
      const amount = Number(item.quantity) * Number(item.unitPrice) * (1 - Number(item.discount || 0) / 100)
      totalAmount += amount
      return {
        productId: item.productId,
        productName: item.productName || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        amount,
        remark: item.remark,
      }
    })

    const quotation = await this.prisma.quotation.create({
      data: {
        quotationNo,
        customerId: dto.customerId,
        opportunityId: dto.opportunityId,
        amount: totalAmount,
        status: QuotationStatus.DRAFT,
        validUntil: dto.validUntil,
        remark: dto.remark,
        items: {
          create: items,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    })

    this.logger.log(`创建报价单：${quotationNo}`)
    return quotation
  }

  /**
   * 获取报价单详情
   */
  async findOne(id: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    })
    if (!quotation) {
      throw new NotFoundException('报价单不存在')
    }
    return quotation
  }

  /**
   * 获取报价单列表
   */
  async findAll(query: QuotationQueryDto) {
    const { page = 1, pageSize = 10, keyword, status, customerId } = query
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (keyword) {
      where.quotationNo = { contains: keyword }
    }
    if (status) {
      where.status = status
    }
    if (customerId) {
      where.customerId = customerId
    }

    const [list, total] = await Promise.all([
      this.prisma.quotation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          items: true,
        },
      }),
      this.prisma.quotation.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  /**
   * 更新报价单
   */
  async update(id: string, dto: UpdateQuotationDto) {
    const quotation = await this.findOne(id)

    if (quotation.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的报价单可以修改')
    }

    let totalAmount = Number(quotation.amount)
    const updateData: any = {
      opportunityId: dto.opportunityId,
      validUntil: dto.validUntil,
      remark: dto.remark,
    }

    // 如果更新了项目，重新计算金额
    if (dto.items && dto.items.length > 0) {
      totalAmount = 0
      const items = dto.items.map(item => {
        const amount = Number(item.quantity) * Number(item.unitPrice) * (1 - Number(item.discount || 0) / 100)
        totalAmount += amount
        return {
          productId: item.productId,
          productName: item.productName || '',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          amount,
          remark: item.remark,
        }
      })

      // 删除旧项目，创建新项目
      await this.prisma.quotationItem.deleteMany({
        where: { quotationId: id },
      })

      updateData.items = {
        create: items,
      }
      updateData.amount = totalAmount
    }

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        items: true,
      },
    })

    this.logger.log(`更新报价单：${quotation.quotationNo}`)
    return updated
  }

  /**
   * 删除报价单
   */
  async delete(id: string) {
    const quotation = await this.findOne(id)

    if (quotation.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的报价单可以删除')
    }

    await this.prisma.quotation.delete({
      where: { id },
    })

    this.logger.log(`删除报价单：${quotation.quotationNo}`)
  }

  /**
   * 发送报价单
   */
  async send(id: string) {
    const quotation = await this.findOne(id)

    if (quotation.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的报价单可以发送')
    }

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: { status: QuotationStatus.SENT },
    })

    this.logger.log(`发送报价单：${quotation.quotationNo}`)
    return updated
  }

  /**
   * 提交审批
   */
  async submit(id: string) {
    return this.send(id)
  }

  /**
   * 审批通过
   */
  async approve(id: string) {
    const quotation = await this.findOne(id)

    if (quotation.status !== QuotationStatus.SENT) {
      throw new BadRequestException('只有已发送状态的报价单可以审批')
    }

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: { status: QuotationStatus.ACCEPTED },
    })

    this.logger.log(`审批通过报价单：${quotation.quotationNo}`)
    return updated
  }

  /**
   * 接受报价
   */
  async accept(id: string) {
    const quotation = await this.findOne(id)

    if (quotation.status !== QuotationStatus.SENT && quotation.status !== QuotationStatus.VIEWED) {
      throw new BadRequestException('只有已发送或已查看状态的报价单可以接受')
    }

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: { status: QuotationStatus.ACCEPTED },
    })

    this.logger.log(`接受报价：${quotation.quotationNo}`)
    return updated
  }

  /**
   * 拒绝报价
   */
  async reject(id: string) {
    const quotation = await this.findOne(id)

    if (quotation.status !== QuotationStatus.SENT && quotation.status !== QuotationStatus.VIEWED) {
      throw new BadRequestException('只有已发送或已查看状态的报价单可以拒绝')
    }

    const updated = await this.prisma.quotation.update({
      where: { id },
      data: { status: QuotationStatus.REJECTED },
    })

    this.logger.log(`拒绝报价：${quotation.quotationNo}`)
    return updated
  }

  /**
   * 转换为订单
   */
  async convertToOrder(id: string) {
    const quotation = await this.findOne(id)

    if (quotation.status !== QuotationStatus.ACCEPTED) {
      throw new BadRequestException('只有已接受的报价单可以转换为订单')
    }

    // 生成订单号
    const orderNo = `ORD-${Date.now()}`

    // 创建订单
    const order = await this.prisma.order.create({
      data: {
        orderNo,
        customerId: quotation.customerId,
        quotationId: quotation.id,
        amount: quotation.amount,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        items: {
          create: quotation.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            amount: item.amount,
          })),
        },
      },
    })

    // 更新报价单状态
    await this.prisma.quotation.update({
      where: { id },
      data: { status: QuotationStatus.ACCEPTED }, // 保持已接受状态
    })

    this.logger.log(`报价单转订单：${quotation.quotationNo} -> ${orderNo}`)
    return order
  }

  /**
   * 获取报价统计
   */
  async getStats() {
    const [total, draft, sent, accepted, rejected] = await Promise.all([
      this.prisma.quotation.count(),
      this.prisma.quotation.count({ where: { status: QuotationStatus.DRAFT } }),
      this.prisma.quotation.count({ where: { status: QuotationStatus.SENT } }),
      this.prisma.quotation.count({ where: { status: QuotationStatus.ACCEPTED } }),
      this.prisma.quotation.count({ where: { status: QuotationStatus.REJECTED } }),
    ])

    return { total, draft, sent, accepted, rejected }
  }
}