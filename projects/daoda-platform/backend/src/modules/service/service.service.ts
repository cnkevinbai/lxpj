/**
 * 售后服务服务
 * 处理售后服务工单的 CRUD 操作、状态流转和统计
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { ServiceTicket, Priority, TicketStatus } from '@prisma/client'
import {
  CreateServiceTicketDto,
  UpdateServiceTicketDto,
  ServiceTicketQueryDto,
  ServiceTicketListResponse,
  ServiceTicketStatsResponse,
  ServiceTicketByStatus,
  ServiceTicketByPriority,
} from './service.dto'

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name)

  constructor(private prisma: PrismaService) {}

  // ==================== 工单号生成 ====================

  /**
   * 生成工单号
   * 格式：SRV-YYYYMMDD-XXXX
   */
  private async generateTicketNo(): Promise<string> {
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')

    // 查询当天已有工单数量
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    const count = await this.prisma.serviceTicket.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    })

    // 生成序号（4 位数字）
    const seq = (count + 1).toString().padStart(4, '0')
    return `SRV-${dateStr}-${seq}`
  }

  // ==================== 工单 CRUD 操作 ====================

  /**
   * 创建售后服务工单
   * @param dto 工单信息
   * @param userId 创建者 ID
   */
  async create(dto: CreateServiceTicketDto, userId?: string): Promise<ServiceTicket> {
    // 检查客户是否存在
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    })
    if (!customer) {
      throw new NotFoundException('客户不存在')
    }

    // 生成工单号
    const ticketNo = await this.generateTicketNo()

    // 创建工单
    const ticket = await this.prisma.serviceTicket.create({
      data: {
        ticketNo,
        customerId: dto.customerId,
        type: dto.type,
        priority: dto.priority || Priority.NORMAL,
        status: TicketStatus.PENDING,
        description: dto.description,
        solution: null,
        images: dto.images ? JSON.stringify(dto.images) : null,
        assigneeId: null,
        createdAt: new Date(),
      },
      include: {
        customer: {
          select: { id: true, name: true, contact: true, phone: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    this.logger.log(`创建售后服务工单成功：${ticket.ticketNo}`)
    return ticket
  }

  /**
   * 更新售后服务工单
   * @param id 工单 ID
   * @param dto 更新内容
   */
  async update(id: string, dto: UpdateServiceTicketDto): Promise<ServiceTicket> {
    // 检查工单是否存在
    const ticket = await this.prisma.serviceTicket.findUnique({
      where: { id },
    })
    if (!ticket) {
      throw new NotFoundException('售后服务工单不存在')
    }

    // 更新工单
    const updated = await this.prisma.serviceTicket.update({
      where: { id },
      data: {
        ...dto,
        images: dto.images ? JSON.stringify(dto.images) : undefined,
      },
      include: {
        customer: {
          select: { id: true, name: true, contact: true, phone: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    this.logger.log(`更新售后服务工单成功：${updated.ticketNo}`)
    return updated
  }

  /**
   * 删除工单（软删除）
   * @param id 工单 ID
   */
  async delete(id: string): Promise<void> {
    const ticket = await this.prisma.serviceTicket.findUnique({
      where: { id },
    })
    if (!ticket) {
      throw new NotFoundException('售后服务工单不存在')
    }

    await this.prisma.serviceTicket.delete({
      where: { id },
    })

    this.logger.log(`删除售后服务工单成功：${ticket.ticketNo}`)
  }

  /**
   * 获取工单详情
   * @param id 工单 ID
   */
  async findOne(id: string): Promise<ServiceTicket> {
    const ticket = await this.prisma.serviceTicket.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            contact: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        assignee: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })
    if (!ticket) {
      throw new NotFoundException('售后服务工单不存在')
    }
    return ticket
  }

  /**
   * 获取工单列表（分页、筛选、搜索）
   * @param query 查询参数
   * @param userId 当前用户 ID（用于 technicians 筛选自己的工单）
   */
  async findAll(query: ServiceTicketQueryDto, userId?: string): Promise<ServiceTicketListResponse> {
    const { page = 1, pageSize = 10, keyword, status, priority, customerId, assigneeId, startDate, endDate } = query

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（工单号）
    if (keyword) {
      where.ticketNo = { contains: keyword, mode: 'insensitive' }
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (customerId) {
      where.customerId = customerId
    }

    // 如果是技术人员，只能看到分配给自己的工单
    if (assigneeId) {
      where.assigneeId = assigneeId
    } else if (userId) {
      // 获取用户角色
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      })
      // 技术人员只能看到分配给自己的工单
      if (user?.role === 'TECHNICIAN') {
        where.assigneeId = userId
      }
    }

    // 日期范围筛选
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        // 包含结束日期当天
        const end = new Date(endDate)
        end.setDate(end.getDate() + 1)
        where.createdAt.lt = end
      }
    }

    // 查询总数
    const total = await this.prisma.serviceTicket.count({ where })

    // 查询列表
    const list = await this.prisma.serviceTicket.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, name: true, contact: true, phone: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return { list, total, page, pageSize }
  }

  // ==================== 工单操作 ====================

  /**
   * 分配工单给技术人员
   * @param id 工单 ID
   * @param assigneeId 技术人员 ID
   */
  async assign(id: string, assigneeId: string): Promise<ServiceTicket> {
    const ticket = await this.prisma.serviceTicket.findUnique({
      where: { id },
    })
    if (!ticket) {
      throw new NotFoundException('售后服务工单不存在')
    }

    // 检查技术人员是否存在
    const assignee = await this.prisma.user.findFirst({
      where: {
        id: assigneeId, 
        role: 'TECHNICIAN',
        deletedAt: null 
      },
    })
    if (!assignee) {
      throw new NotFoundException('技术人员不存在')
    }

    // 更新工单
    const updated = await this.prisma.serviceTicket.update({
      where: { id },
      data: {
        assigneeId,
        status: TicketStatus.ASSIGNED,
      },
      include: {
        customer: {
          select: { id: true, name: true, contact: true, phone: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    this.logger.log(`分配售后服务工单：${ticket.ticketNo} 分配给 ${assignee.name}`)
    return updated
  }

  /**
   * 更新工单状态
   * 状态流转：PENDING → ASSIGNED → PROCESSING → COMPLETED → CLOSED
   * @param id 工单 ID
   * @param status 新状态
   * @param solution 解决方案
   */
  async updateStatus(id: string, status: TicketStatus, solution?: string): Promise<ServiceTicket> {
    const ticket = await this.prisma.serviceTicket.findUnique({
      where: { id },
    })
    if (!ticket) {
      throw new NotFoundException('售后服务工单不存在')
    }

    // 验证状态流转
    const validTransitions: Record<TicketStatus, TicketStatus[]> = {
      [TicketStatus.PENDING]: [TicketStatus.ASSIGNED],
      [TicketStatus.ASSIGNED]: [TicketStatus.PROCESSING],
      [TicketStatus.PROCESSING]: [TicketStatus.COMPLETED],
      [TicketStatus.COMPLETED]: [TicketStatus.CLOSED],
      [TicketStatus.CLOSED]: [],
    }

    const allowedStatuses = validTransitions[ticket.status]
    if (!allowedStatuses?.includes(status)) {
      throw new BadRequestException(
        `工单状态不能从 ${ticket.status} 变更为 ${status}`,
      )
    }

    // 更新工单
    const data: any = {
      status,
    }

    if (solution) {
      data.solution = solution
      data.updatedAt = new Date()
    }

    const updated = await this.prisma.serviceTicket.update({
      where: { id },
      data,
      include: {
        customer: {
          select: { id: true, name: true, contact: true, phone: true },
        },
        assignee: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    this.logger.log(`工单状态更新：${ticket.ticketNo} ${ticket.status} -> ${status}`)
    return updated
  }

  /**
   * 关闭工单
   * @param id 工单 ID
   * @param solution 解决方案
   */
  async close(id: string, solution: string): Promise<void> {
    const ticket = await this.prisma.serviceTicket.findUnique({
      where: { id },
    })
    if (!ticket) {
      throw new NotFoundException('售后服务工单不存在')
    }

    // 只有已完成的工单可以关闭
    if (ticket.status !== TicketStatus.COMPLETED) {
      throw new BadRequestException('只有已完成的工单可以关闭')
    }

    // 关闭工单
    await this.prisma.serviceTicket.update({
      where: { id },
      data: {
        status: TicketStatus.CLOSED,
        solution,
        closedAt: new Date(),
      },
    })

    this.logger.log(`关闭售后服务工单：${ticket.ticketNo}`)
  }

  // ==================== 统计接口 ====================

  /**
   * 获取售后服务工单统计
   */
  async getStats(): Promise<ServiceTicketStatsResponse> {
    // 总工单数
    const totalResult = await this.prisma.serviceTicket.aggregate({
      _count: { id: true },
    })

    // 按状态统计（需要 orderBy，Prisma 新版本要求）
    const statusStats = await this.prisma.serviceTicket.groupBy({
      by: ['status'],
      orderBy: { _count: { id: 'desc' } },
      _count: { id: true },
    })

    // 按优先级统计
    const priorityStats = await this.prisma.serviceTicket.groupBy({
      by: ['priority'],
      orderBy: { _count: { id: 'desc' } },
      _count: { id: true },
    })

    const byStatus: ServiceTicketByStatus = {}
    statusStats.forEach((s) => {
      byStatus[s.status] = s._count.id
    })

    const byPriority: ServiceTicketByPriority = {}
    priorityStats.forEach((s) => {
      byPriority[s.priority] = s._count.id
    })

    return {
      totalTickets: totalResult._count.id,
      pendingTickets: byStatus[TicketStatus.PENDING] || 0,
      processingTickets: byStatus[TicketStatus.PROCESSING] || 0,
      completedTickets: byStatus[TicketStatus.COMPLETED] || 0,
      closedTickets: byStatus[TicketStatus.CLOSED] || 0,
      highPriorityTickets: byPriority[Priority.HIGH] || 0,
      urgentPriorityTickets: byPriority[Priority.URGENT] || 0,
    }
  }

  /**
   * 获取客户售后服务统计
   * @param customerId 客户 ID
   */
  async getCustomerStats(customerId: string): Promise<{ ticketCount: number; completedCount: number; pendingCount: number }> {
    const stats = await this.prisma.serviceTicket.groupBy({
      by: ['status'],
      where: { customerId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    const byStatus: ServiceTicketByStatus = {}
    stats.forEach((s) => {
      byStatus[s.status] = s._count.id
    })

    return {
      ticketCount: Object.values(byStatus).reduce((acc, count) => acc + count, 0) as number,
      completedCount: byStatus[TicketStatus.COMPLETED] || 0,
      pendingCount: byStatus[TicketStatus.PENDING] || 0,
    }
  }
}
