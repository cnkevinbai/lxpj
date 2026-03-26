/**
 * 客户服务
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Customer, CustomerLevel, CustomerStatus, FollowUp } from '@prisma/client'
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
  CreateFollowUpDto,
  FollowUpQueryDto,
  CustomerListResponse,
  FollowUpListResponse,
} from './customer.dto'

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto, userId?: string, tenantId?: string): Promise<Customer> {
    const existing = await this.prisma.customer.findFirst({
      where: { phone: dto.phone },
    })
    if (existing) {
      throw new BadRequestException('该手机号已存在')
    }

    // 生成客户编号（如果未提供）
    const customerNo = dto.customerNo || `C${Date.now().toString(36).toUpperCase()}`

    const customer = await this.prisma.customer.create({
      data: {
        customerNo,
        name: dto.name,
        contactName: dto.contactName,
        contact: dto.contact,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        source: dto.source,
        industry: dto.industry,
        province: dto.province,
        city: dto.city,
        level: dto.level || CustomerLevel.B,
        status: CustomerStatus.ACTIVE,
        remark: dto.remark,
        userId: userId,
        tenantId: tenantId || 'default-tenant-id',
      },
    })

    this.logger.log(`创建客户：${customer.name}`)
    return customer
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    if (dto.phone && dto.phone !== customer.phone) {
      const existing = await this.prisma.customer.findFirst({
        where: { phone: dto.phone, id: { not: id } },
      })
      if (existing) {
        throw new BadRequestException('手机号已被使用')
      }
    }

    const updated = await this.prisma.customer.update({
      where: { id },
      data: dto,
    })

    this.logger.log(`更新客户：${updated.name}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    await this.prisma.customer.update({
      where: { id },
      data: { status: CustomerStatus.LOST },
    })

    this.logger.log(`删除客户：${customer.name}`)
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { orders: true, serviceTickets: true, followUps: true } },
      },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }
    return customer
  }

  async findAll(query: CustomerQueryDto): Promise<CustomerListResponse> {
    const { page = 1, pageSize = 10, keyword, level, status, source, industry } = query
    const where: any = { deletedAt: null }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword } },
        { contact: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    if (level) where.level = level
    if (status) where.status = status
    if (source) where.source = source
    if (industry) where.industry = industry

    const total = await this.prisma.customer.count({ where })
    const list = await this.prisma.customer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    })

    return { list, total, page, pageSize }
  }

  async batchImport(customers: CreateCustomerDto[], userId?: string): Promise<{ success: number; failed: number; errors: any[] }> {
    const errors: any[] = []
    let successCount = 0

    for (const customer of customers) {
      try {
        await this.create(customer, userId)
        successCount++
      } catch (error) {
        errors.push({ customer: customer.name, error: error.message })
      }
    }

    return { success: successCount, failed: errors.length, errors }
  }

  async batchUpdateStatus(ids: string[], status: CustomerStatus): Promise<number> {
    const result = await this.prisma.customer.updateMany({
      where: { id: { in: ids } },
      data: { status },
    })
    return result.count
  }

  async batchAssign(ids: string[], userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('负责人不存在')
    }

    const result = await this.prisma.customer.updateMany({
      where: { id: { in: ids } },
      data: { userId },
    })
    return result.count
  }

  async addFollowUp(customerId: string, dto: CreateFollowUpDto): Promise<FollowUp> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    const followUp = await this.prisma.followUp.create({
      data: {
        customerId,
        content: dto.content,
        nextTime: dto.nextTime || null,
      },
      include: { customer: { select: { id: true, name: true } } },
    })

    this.logger.log(`添加跟进记录：${customer.name}`)
    return followUp
  }

  async getFollowUps(customerId: string, query: FollowUpQueryDto): Promise<FollowUpListResponse> {
    const { page = 1, pageSize = 10 } = query

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    const total = await this.prisma.followUp.count({ where: { customerId } })
    const list = await this.prisma.followUp.findMany({
      where: { customerId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return { list, total, page, pageSize }
  }

  async deleteFollowUp(id: string): Promise<void> {
    const followUp = await this.prisma.followUp.findUnique({ where: { id } })
    if (!followUp) {
      throw new NotFoundException('跟进记录不存在')
    }

    await this.prisma.followUp.delete({ where: { id } })
  }

  async getPendingFollowUps(query: CustomerQueryDto): Promise<CustomerListResponse> {
    const { page = 1, pageSize = 10 } = query
    const now = new Date()

    const followUps = await this.prisma.followUp.findMany({
      where: { nextTime: { lte: now } },
      select: { customerId: true },
      distinct: ['customerId'],
    })

    const customerIds = followUps.map((f) => f.customerId)
    if (customerIds.length === 0) {
      return { list: [], total: 0, page, pageSize }
    }

    const list = await this.prisma.customer.findMany({
      where: { id: { in: customerIds } },
      include: { user: { select: { id: true, name: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    const total = await this.prisma.customer.count({
      where: { id: { in: customerIds } },
    })

    return { list, total, page, pageSize }
  }
}
