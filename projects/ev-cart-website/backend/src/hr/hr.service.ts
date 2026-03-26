import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class HrService {
  constructor(private readonly prisma: PrismaClient) {}
  async findAll(params: any) {
    const { page = 1, pageSize = 20 } = params;
    const [total, data] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.findMany({ skip: (page-1)*pageSize, take: pageSize, orderBy: { createdAt: 'desc' }}),
    ]);
    return { data, total, page, pageSize };
  }
  async create(data: any) { return this.prisma.employee.create({ data }); }
  async update(id: string, data: any) { return this.prisma.employee.update({ where: { id }, data }); }
  async remove(id: string) { await this.prisma.employee.delete({ where: { id } }); return { success: true }; }
}
