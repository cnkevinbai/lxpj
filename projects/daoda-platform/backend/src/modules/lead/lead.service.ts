/**
 * 线索模块 Service
 * 负责线索数据的 CRUD 操作和业务逻辑
 * 注意：Lead 模型没有 deletedAt, score, userId, customerId, user 关系
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateLeadDto, UpdateLeadDto, LeadQueryDto } from './lead.dto'
import { LeadStatus } from '@prisma/client'

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 创建线索
   */
  async create(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        company: dto.company,
        source: dto.source,
        contact: dto.contact,
        assignedTo: dto.assignedTo,
        status: dto.status || LeadStatus.NEW,
      },
    })

    this.logger.log(`创建线索：${lead.name}`)
    return lead
  }

  /**
   * 获取线索详情
   */
  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    })
    if (!lead) {
      throw new NotFoundException('线索不存在')
    }
    return lead
  }

  /**
   * 获取线索列表
   */
  async findAll(query: LeadQueryDto) {
    const { page = 1, pageSize = 10, keyword, status } = query
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { phone: { contains: keyword } },
        { company: { contains: keyword } },
      ]
    }
    if (status) {
      where.status = status
    }

    const [list, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  /**
   * 更新线索
   */
  async update(id: string, dto: UpdateLeadDto) {
    const lead = await this.findOne(id)

    const updated = await this.prisma.lead.update({
      where: { id },
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        company: dto.company,
        source: dto.source,
        contact: dto.contact,
        assignedTo: dto.assignedTo,
        status: dto.status,
      },
    })

    this.logger.log(`更新线索：${lead.name}`)
    return updated
  }

  /**
   * 删除线索
   */
  async delete(id: string) {
    const lead = await this.findOne(id)
    await this.prisma.lead.delete({
      where: { id },
    })
    this.logger.log(`删除线索：${lead.name}`)
  }

  /**
   * 转换为客户
   */
  async convertToCustomer(id: string) {
    const lead = await this.findOne(id)

    if (lead.status !== LeadStatus.QUALIFIED) {
      throw new BadRequestException('只有合格状态的线索可以转换为客户')
    }

    // 创建客户
    const customer = await this.prisma.customer.create({
      data: {
        customerNo: `CUS-${Date.now()}`,
        name: lead.company || lead.name,
        contactName: lead.contact || lead.name,
        phone: lead.phone,
        email: lead.email,
        source: lead.source,
        tenantId: 'default', // 需要从上下文获取
      },
    })

    // 更新线索状态
    await this.prisma.lead.update({
      where: { id },
      data: { status: LeadStatus.CONVERTED },
    })

    this.logger.log(`线索转客户：${lead.name} -> ${customer.name}`)
    return customer
  }

  /**
   * 批量分配
   */
  async assignBatch(ids: string[], assignedTo: string) {
    await this.prisma.lead.updateMany({
      where: { id: { in: ids } },
      data: { assignedTo },
    })
    this.logger.log(`批量分配线索：${ids.length} 个`)
  }

  /**
   * 获取线索统计
   */
  async getStats() {
    const [total, newLeads, contacted, qualified, converted] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({ where: { status: LeadStatus.NEW } }),
      this.prisma.lead.count({ where: { status: LeadStatus.CONTACTED } }),
      this.prisma.lead.count({ where: { status: LeadStatus.QUALIFIED } }),
      this.prisma.lead.count({ where: { status: LeadStatus.CONVERTED } }),
    ])

    return { total, newLeads, contacted, qualified, converted }
  }
}
