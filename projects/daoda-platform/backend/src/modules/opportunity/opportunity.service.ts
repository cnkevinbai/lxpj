/**
 * 商机服务
 * 注意：Opportunity 模型有 closeDate (非 expectedCloseDate), assignedTo (非 userId), 无 user 关系
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Opportunity, OpportunityStage } from '@prisma/client'
import { CreateOpportunityDto, UpdateOpportunityDto, OpportunityQueryDto } from './opportunity.dto'

@Injectable()
export class OpportunityService {
  private readonly logger = new Logger(OpportunityService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOpportunityDto): Promise<Opportunity> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    const opportunity = await this.prisma.opportunity.create({
      data: {
        name: dto.name,
        customerId: dto.customerId,
        amount: dto.amount,
        stage: dto.stage || OpportunityStage.LEAD,
        probability: dto.probability || 10,
        closeDate: dto.closeDate ? new Date(dto.closeDate) : null,
        assignedTo: dto.assignedTo,
      },
    })

    this.logger.log(`创建商机：${opportunity.name}`)
    return opportunity
  }

  async update(id: string, dto: UpdateOpportunityDto): Promise<Opportunity> {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
    })
    if (!opportunity) {
      throw new NotFoundException('商机不存在')
    }

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        name: dto.name,
        amount: dto.amount,
        stage: dto.stage,
        probability: dto.probability,
        closeDate: dto.closeDate ? new Date(dto.closeDate) : undefined,
        assignedTo: dto.assignedTo,
      },
    })

    this.logger.log(`更新商机：${updated.name}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
    })
    if (!opportunity) {
      throw new NotFoundException('商机不存在')
    }

    await this.prisma.opportunity.delete({
      where: { id },
    })

    this.logger.log(`删除商机：${opportunity.name}`)
  }

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    })
    if (!opportunity) {
      throw new NotFoundException('商机不存在')
    }
    return opportunity
  }

  async findAll(query: OpportunityQueryDto) {
    const { page = 1, pageSize = 10, keyword, stage, customerId } = query
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (keyword) {
      where.name = { contains: keyword }
    }
    if (stage) {
      where.stage = stage
    }
    if (customerId) {
      where.customerId = customerId
    }

    const [list, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
        },
      }),
      this.prisma.opportunity.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  async win(id: string): Promise<Opportunity> {
    const opportunity = await this.findOne(id)

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        stage: OpportunityStage.WON,
        probability: 100,
      },
    })

    this.logger.log(`商机赢单：${opportunity.name}`)
    return updated
  }

  async lose(id: string): Promise<Opportunity> {
    const opportunity = await this.findOne(id)

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: {
        stage: OpportunityStage.LOST,
        probability: 0,
      },
    })

    this.logger.log(`商机输单：${opportunity.name}`)
    return updated
  }

  async assign(id: string, assignedTo: string): Promise<Opportunity> {
    const opportunity = await this.findOne(id)

    const updated = await this.prisma.opportunity.update({
      where: { id },
      data: { assignedTo },
    })

    this.logger.log(`分配商机：${opportunity.name} -> ${assignedTo}`)
    return updated
  }

  async getStats() {
    const [total, lead, contacted, proposal, negotiation, won, lost] = await Promise.all([
      this.prisma.opportunity.count(),
      this.prisma.opportunity.count({ where: { stage: OpportunityStage.LEAD } }),
      this.prisma.opportunity.count({ where: { stage: OpportunityStage.CONTACTED } }),
      this.prisma.opportunity.count({ where: { stage: OpportunityStage.PROPOSAL } }),
      this.prisma.opportunity.count({ where: { stage: OpportunityStage.NEGOTIATION } }),
      this.prisma.opportunity.count({ where: { stage: OpportunityStage.WON } }),
      this.prisma.opportunity.count({ where: { stage: OpportunityStage.LOST } }),
    ])

    return { total, lead, contacted, proposal, negotiation, won, lost }
  }
}
