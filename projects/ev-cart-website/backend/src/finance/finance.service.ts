import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaClient) {}
  async findAll(params: any) {
    const { page = 1, pageSize = 20 } = params;
    const [total, data] = await Promise.all([
      this.prisma.financeRecord.count(),
      this.prisma.financeRecord.findMany({ skip: (page-1)*pageSize, take: pageSize, orderBy: { createdAt: 'desc' }}),
    ]);
    return { data, total, page, pageSize };
  }
  async create(data: any) { return this.prisma.financeRecord.create({ data }); }
  async update(id: string, data: any) { return this.prisma.financeRecord.update({ where: { id }, data }); }
  async remove(id: string) { await this.prisma.financeRecord.delete({ where: { id } }); return { success: true }; }
}
