import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MailServiceService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(ticketId: string, data: any) {
    const mail = await this.prisma.mailService.create({
      data: {
        ticketId,
        ...data,
        status: 'PREPARING',
      },
    });

    return mail;
  }

  async findOne(id: string) {
    const mail = await this.prisma.mailService.findUnique({
      where: { id },
      include: {
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            customerName: true,
            customerPhone: true,
          },
        },
      },
    });

    if (!mail) {
      throw new NotFoundException(`邮寄单 ${id} 不存在`);
    }

    return mail;
  }

  async findByTicketId(ticketId: string) {
    return this.prisma.mailService.findUnique({
      where: { ticketId },
    });
  }

  async ship(id: string, data: {
    courierCompany: string;
    trackingNumber: string;
    shippingCost: number;
  }) {
    const mail = await this.prisma.mailService.update({
      where: { id },
      data: {
        ...data,
        shippedAt: new Date(),
        status: 'SHIPPED',
      },
    });

    return mail;
  }

  async confirmDelivery(id: string) {
    return this.prisma.mailService.update({
      where: { id },
      data: {
        receivedAt: new Date(),
        status: 'DELIVERED',
      },
    });
  }
}
