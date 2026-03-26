import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface CreateServiceTicketDto {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  productId?: string;
  productName?: string;
  productModel?: string;
  serialNumber?: string;
  warrantyStatus?: boolean;
  type: 'INSTALLATION' | 'MAINTENANCE' | 'REPAIR' | 'COMPLAINT' | 'CONSULTATION';
  source: 'CUSTOMER' | 'SALES' | 'HOTLINE' | 'ONLINE' | 'WECHAT' | 'EMAIL';
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';
  subject: string;
  problemDescription: string;
  problemPhotos?: string[];
  expectedResolution?: string;
}

export interface ReceiveTicketDto {
  preliminaryAssessment: string;
}

export interface AssessTicketDto {
  technicalDifficulty: 'SIMPLE' | 'NORMAL' | 'COMPLEX' | 'EXPERT';
  requiredSkills?: string[];
  productCondition: 'GOOD' | 'NORMAL' | 'DAMAGED' | 'UNKNOWN';
  needParts: boolean;
  estimatedParts?: any[];
  estimatedHours: number;
  estimatedCost: number;
  assessmentNotes?: string;
}

export interface DecideServiceTypeDto {
  serviceType: 'ONSITE' | 'MAIL' | 'REMOTE';
  serviceTypeReason: string;
}

@Injectable()
export class ServiceTicketService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 创建工单
   */
  async create(data: CreateServiceTicketDto) {
    const ticketNumber = await this.generateTicketNumber();

    const ticket = await this.prisma.serviceTicket.create({
      data: {
        ...data,
        ticketNumber,
        warrantyStatus: data.warrantyStatus || false,
        status: 'PENDING_RECEPTION',
      },
    });

    return ticket;
  }

  /**
   * 获取工单列表
   */
  async findAll(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    type?: string;
    priority?: string;
    assigneeId?: string;
    customerId?: string;
  }) {
    const { page = 1, pageSize = 20, ...filters } = params;

    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters.customerId) where.customerId = filters.customerId;

    const [total, tickets] = await Promise.all([
      this.prisma.serviceTicket.count({ where }),
      this.prisma.serviceTicket.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return {
      data: tickets,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取工单详情
   */
  async findOne(id: string) {
    const ticket = await this.prisma.serviceTicket.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        assessedByUser: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
        mail: true,
        remoteSupport: true,
        partsUsed: true,
        logs: {
          take: 50,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`工单 ${id} 不存在`);
    }

    return ticket;
  }

  /**
   * 客服接待
   */
  async receive(ticketId: string, userId: string, data: ReceiveTicketDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const ticket = await this.prisma.serviceTicket.update({
      where: { id: ticketId },
      data: {
        receivedBy: userId,
        receivedByName: user.name,
        receivedAt: new Date(),
        preliminaryAssessment: data.preliminaryAssessment,
        status: 'PENDING_ASSESSMENT',
      },
    });

    // 添加日志
    await this.addLog(ticketId, 'USER', 'TICKET_RECEIVED', userId, user.name, {
      preliminaryAssessment: data.preliminaryAssessment,
    });

    return ticket;
  }

  /**
   * 主管评估
   */
  async assess(ticketId: string, userId: string, data: AssessTicketDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const ticket = await this.prisma.serviceTicket.update({
      where: { id: ticketId },
      data: {
        assessedBy: userId,
        assessedByName: user.name,
        assessedAt: new Date(),
        technicalDifficulty: data.technicalDifficulty,
        requiredSkills: data.requiredSkills || [],
        productCondition: data.productCondition,
        needParts: data.needParts,
        estimatedParts: data.estimatedParts as any,
        estimatedHours: data.estimatedHours,
        estimatedCost: data.estimatedCost,
        assessmentNotes: data.assessmentNotes,
      },
    });

    // 添加日志
    await this.addLog(ticketId, 'USER', 'TICKET_ASSESSED', userId, user.name, {
      technicalDifficulty: data.technicalDifficulty,
      needParts: data.needParts,
    });

    return ticket;
  }

  /**
   * 决策服务方式
   */
  async decideServiceType(ticketId: string, userId: string, data: DecideServiceTypeDto) {
    const ticket = await this.prisma.serviceTicket.update({
      where: { id: ticketId },
      data: {
        serviceType: data.serviceType,
        serviceTypeReason: data.serviceTypeReason,
        decidedBy: userId,
        decidedAt: new Date(),
        status: this.mapServiceTypeToStatus(data.serviceType),
      },
    });

    // 添加日志
    await this.addLog(ticketId, 'USER', 'SERVICE_TYPE_DECIDED', userId, 'SYSTEM', {
      serviceType: data.serviceType,
      reason: data.serviceTypeReason,
    });

    return ticket;
  }

  /**
   * 指派工程师
   */
  async assignEngineer(ticketId: string, userId: string, assigneeId: string, scheduledTime: Date) {
    const assignee = await this.prisma.user.findUnique({
      where: { id: assigneeId },
    });

    if (!assignee) {
      throw new NotFoundException('工程师不存在');
    }

    const ticket = await this.prisma.serviceTicket.update({
      where: { id: ticketId },
      data: {
        assigneeId,
        assigneeName: assignee.name,
        scheduledTime,
        status: 'ONSITE_SERVICE',
      },
    });

    // 添加日志
    await this.addLog(ticketId, 'USER', 'ENGINEER_ASSIGNED', userId, 'SYSTEM', {
      assigneeId,
      assigneeName: assignee.name,
      scheduledTime,
    });

    return ticket;
  }

  /**
   * 完成工单
   */
  async complete(ticketId: string, userId: string, data: {
    resolution: string;
    laborFee?: number;
    partsFee?: number;
    otherFee?: number;
    discount?: number;
    totalAmount?: number;
  }) {
    const ticket = await this.prisma.serviceTicket.update({
      where: { id: ticketId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        closedBy: userId,
        ...data,
      },
    });

    // 添加日志
    await this.addLog(ticketId, 'USER', 'TICKET_COMPLETED', userId, 'SYSTEM', {
      resolution: data.resolution,
      totalAmount: data.totalAmount,
    });

    return ticket;
  }

  /**
   * 关闭工单
   */
  async close(ticketId: string, userId: string, reason?: string) {
    const ticket = await this.prisma.serviceTicket.update({
      where: { id: ticketId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        closedBy: userId,
        closedReason: reason,
      },
    });

    // 添加日志
    await this.addLog(ticketId, 'USER', 'TICKET_CLOSED', userId, 'SYSTEM', {
      reason,
    });

    return ticket;
  }

  /**
   * 添加日志
   */
  private async addLog(
    ticketId: string,
    type: 'SYSTEM' | 'USER' | 'CUSTOMER' | 'ERROR',
    action: string,
    userId: string | null,
    userName: string | null,
    data?: any,
  ) {
    await this.prisma.serviceTicketLog.create({
      data: {
        ticketId,
        type,
        action,
        userId,
        userName,
        message: `${action} - ${JSON.stringify(data || {})}`,
        newValue: data,
      },
    });
  }

  /**
   * 生成工单号
   */
  private async generateTicketNumber(): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.prisma.serviceTicket.count({
      where: {
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
        },
      },
    });
    return `ST${dateStr}${String(count + 1).padStart(4, '0')}`;
  }

  /**
   * 映射服务方式到状态
   */
  private mapServiceTypeToStatus(serviceType: string): string {
    const map: Record<string, string> = {
      'ONSITE': 'ONSITE_SERVICE',
      'MAIL': 'MAIL_SERVICE',
      'REMOTE': 'REMOTE_SUPPORT',
    };
    return map[serviceType] || 'PENDING_ASSESSMENT';
  }
}
