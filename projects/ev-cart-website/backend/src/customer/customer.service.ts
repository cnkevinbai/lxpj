import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface CreateCustomerDto {
  name: string;
  type: 'ENTERPRISE' | 'INDIVIDUAL' | 'GOVERNMENT';
  industry?: string;
  level?: 'A' | 'B' | 'C';
  phone?: string;
  email?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  ownerId?: string;
}

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 获取客户列表
   */
  async findAll(params: {
    page?: number;
    pageSize?: number;
    type?: string;
    level?: string;
    industry?: string;
    keyword?: string;
    ownerId?: string;
  }) {
    const { page = 1, pageSize = 20, ...filters } = params;

    const where: any = {};

    if (filters.type) where.type = filters.type;
    if (filters.level) where.level = filters.level;
    if (filters.industry) where.industry = filters.industry;
    if (filters.ownerId) where.ownerId = filters.ownerId;
    if (filters.keyword) {
      where.OR = [
        { name: { contains: filters.keyword } },
        { phone: { contains: filters.keyword } },
        { email: { contains: filters.keyword } },
      ];
    }

    const [total, customers] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
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
      data: customers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取客户详情
   */
  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        opportunities: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`客户 ${id} 不存在`);
    }

    return customer;
  }

  /**
   * 创建客户
   */
  async create(data: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return customer;
  }

  /**
   * 更新客户
   */
  async update(id: string, data: Partial<CreateCustomerDto>) {
    const customer = await this.prisma.customer.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return customer;
  }

  /**
   * 删除客户
   */
  async remove(id: string) {
    await this.prisma.customer.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * 获取客户统计
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

    const total = await this.prisma.customer.count({ where });

    const byType = await this.prisma.customer.groupBy({
      by: ['type'],
      where,
      _count: true,
    });

    const byLevel = await this.prisma.customer.groupBy({
      by: ['level'],
      where,
      _count: true,
    });

    const byIndustry = await this.prisma.customer.groupBy({
      by: ['industry'],
      where,
      _count: true,
    });

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
      byLevel: byLevel.reduce((acc, item) => {
        acc[item.level] = item._count;
        return acc;
      }, {}),
      byIndustry: byIndustry.reduce((acc, item) => {
        acc[item.industry || '未知'] = item._count;
        return acc;
      }, {}),
    };
  }
}
