import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RemoteSupportService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(ticketId: string, engineerId: string) {
    const engineer = await this.prisma.user.findUnique({
      where: { id: engineerId },
    });

    if (!engineer) {
      throw new NotFoundException('工程师不存在');
    }

    const support = await this.prisma.remoteSupport.create({
      data: {
        ticketId,
        engineerId,
        engineerName: engineer.name,
        engineerPhone: engineer.phone || '',
        customerId: '', // TODO: 从工单获取
        customerName: '',
        customerPhone: '',
        status: 'PENDING',
      },
    });

    return support;
  }

  async findOne(id: string) {
    const support = await this.prisma.remoteSupport.findUnique({
      where: { id },
      include: {
        messages: {
          take: 100,
          orderBy: { createdAt: 'asc' },
        },
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            customerName: true,
            customerPhone: true,
          },
        },
        engineer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!support) {
      throw new NotFoundException(`远程指导 ${id} 不存在`);
    }

    return support;
  }

  async sendMessage(supportId: string, data: {
    senderId: string;
    senderName: string;
    senderType: 'ENGINEER' | 'CUSTOMER';
    type: 'TEXT' | 'IMAGE' | 'FILE';
    content: string;
    fileName?: string;
  }) {
    const message = await this.prisma.remoteMessage.create({
      data: {
        supportId,
        ticketId: '', // TODO: 从 support 获取
        ...data,
      },
    });

    return message;
  }

  async getMessages(supportId: string) {
    return this.prisma.remoteMessage.findMany({
      where: { supportId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async complete(supportId: string, data: {
    resolved: boolean;
    resolutionNotes: string;
    customerSatisfaction?: number;
    duration?: number;
  }) {
    const support = await this.prisma.remoteSupport.update({
      where: { supportId },
      data: {
        ...data,
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return support;
  }
}
