import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface CreateOpportunityDto {
  name: string;
  customerId: string;
  amount: number;
  stage: 'INITIAL_CONTACT' | 'NEEDS_ANALYSIS' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  probability: number;
  closeDate?: string;
  ownerId?: string;
}

@Injectable()
export class OpportunityService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 获取商机列表
   */
  async findAll(params: {
    page?: number;
    pageSize?: number;
    customerId?: string;
    stage?: string;
    ownerId?: string;
    status?: string;
  }) {
    const { page = 1, pageSize = 20, ...filters } = params;

    const where: any = {};

    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.stage) where.stage = filters.stage;
    if (filters.ownerId) where.ownerId = filters.ownerId;
    if (filters.status) where.status = filters.status;

    const [total, opportunities] = await Promise.all([
      this.prisma.opportunity.count({ where }),
      this.prisma.opportunity.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      data: opportunities,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取商机详情
   */
  async findOne(id: string) {
    const opportunity = await this.prisma.opportunity.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            type: true,
            level: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!opportunity) {
      throw new NotFoundException(`商机 ${id} 不存在`);
    }

    return opportunity;
  }

  /**
   * 创建商机
   */
  async create(data: CreateOpportunityDto) {
    const opportunity = await this.prisma.opportunity.create({
      data: {
        ...data,
        amount: data.amount,
        closeDate: data.closeDate ? new Date(data.closeDate) : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return opportunity;
  }

  /**
   * 更新商机
   */
  async update(id: string, data: Partial<CreateOpportunityDto>) {
    const opportunity = await this.prisma.opportunity.update({
      where: { id },
      data: {
        ...data,
        closeDate: data.closeDate ? new Date(data.closeDate) : null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return opportunity;
  }

  /**
   * 删除商机
   */
  async remove(id: string) {
    await this.prisma.opportunity.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * 更新商机阶段
   */
  async updateStage(id: string, stage: string) {
    const opportunity = await this.prisma.opportunity.update({
      where: { id },
      data: { stage: stage as any },
    });

    return opportunity;
  }

  /**
   * 赢单
   */
  async win(id: string) {
    const opportunity = await this.prisma.opportunity.update({
      where: { id },
      data: {
        stage: 'CLOSED_WON',
        status: 'WON',
      },
    });

    return opportunity;
  }

  /**
   * 输单
   */
  async lose(id: string, reason?: string) {
    const opportunity = await this.prisma.opportunity.update({
      where: { id },
      data: {
        stage: 'CLOSED_LOST',
        status: 'LOST',
      },
    });

    return opportunity;
  }

  /**
   * 获取商机统计
   */
  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
    ownerId?: string;
  }) {
    const where: any = {};

    if (params?.ownerId) {
      where.ownerId = params.ownerId;
    }

    const total = await this.prisma.opportunity.count({ where });
    const won = await this.prisma.opportunity.count({
      where: { ...where, status: 'WON' },
    });
    const lost = await this.prisma.opportunity.count({
      where: { ...where, status: 'LOST' },
    });
    const open = await this.prisma.opportunity.count({
      where: { ...where, status: 'OPEN' },
    });

    const byStage = await this.prisma.opportunity.groupBy({
      by: ['stage'],
      where,
      _count: true,
      _sum: {
        amount: true,
      },
    });

    const winRate = total > 0 ? (won / total) * 100 : 0;

    return {
      total,
      won,
      lost,
      open,
      winRate: Math.round(winRate * 100) / 100,
      byStage: byStage.map((item) => ({
        stage: item.stage,
        count: item._count,
        totalAmount: item._sum.amount || 0,
      })),
    };
  }
}
