import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface CreateOrderDto {
  customerId: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus?: 'UNPAID' | 'PARTIAL' | 'PAID';
  deliveryStatus?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
}

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 获取订单列表
   */
  async findAll(params: {
    page?: number;
    pageSize?: number;
    customerId?: string;
    status?: string;
    paymentStatus?: string;
  }) {
    const { page = 1, pageSize = 20, ...filters } = params;

    const where: any = {};

    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
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
        },
      }),
    ]);

    return {
      data: orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取订单详情
   */
  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
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
      },
    });

    if (!order) {
      throw new NotFoundException(`订单 ${id} 不存在`);
    }

    return order;
  }

  /**
   * 创建订单
   */
  async create(data: CreateOrderDto) {
    const orderNumber = await this.generateOrderNumber();

    const order = await this.prisma.order.create({
      data: {
        ...data,
        orderNumber,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return order;
  }

  /**
   * 更新订单
   */
  async update(id: string, data: Partial<CreateOrderDto>) {
    const order = await this.prisma.order.update({
      where: { id },
      data,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return order;
  }

  /**
   * 删除订单
   */
  async remove(id: string) {
    await this.prisma.order.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * 确认订单
   */
  async confirm(id: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
      },
    });

    return order;
  }

  /**
   * 取消订单
   */
  async cancel(id: string, reason?: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    return order;
  }

  /**
   * 获取订单统计
   */
  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
    customerId?: string;
  }) {
    const where: any = {};

    if (params?.customerId) {
      where.customerId = params.customerId;
    }

    const total = await this.prisma.order.count({ where });
    const totalAmount = await this.prisma.order.aggregate({
      where,
      _sum: { amount: true },
    });

    const byStatus = await this.prisma.order.groupBy({
      by: ['status'],
      where,
      _count: true,
      _sum: {
        amount: true,
      },
    });

    const byPaymentStatus = await this.prisma.order.groupBy({
      by: ['paymentStatus'],
      where,
      _count: true,
    });

    return {
      total,
      totalAmount: totalAmount._sum.amount || 0,
      byStatus: byStatus.map((item) => ({
        status: item.status,
        count: item._count,
        totalAmount: item._sum.amount || 0,
      })),
      byPaymentStatus: byPaymentStatus.map((item) => ({
        paymentStatus: item.paymentStatus,
        count: item._count,
      })),
    };
  }

  /**
   * 生成订单号
   */
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
        },
      },
    });
    return `ORD${dateStr}${String(count + 1).padStart(4, '0')}`;
  }
}
