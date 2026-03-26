import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductionService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(params: any) {
    const { page = 1, pageSize = 20 } = params;
    const [total, data] = await Promise.all([
      this.prisma.productionOrder.count(),
      this.prisma.productionOrder.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { data, total, page, pageSize };
  }

  async create(data: any) {
    return this.prisma.productionOrder.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.productionOrder.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.productionOrder.delete({ where: { id } });
    return { success: true };
  }
}
