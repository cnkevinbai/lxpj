import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { UserHandover, HandoverItem } from './entities/handover.entity'
import { Customer } from '../customer/entities/customer.entity'
import { Lead } from '../lead/entities/lead.entity'
import { Opportunity } from '../opportunity/entities/opportunity.entity'
import { Order } from '../order/entities/order.entity'
import { AuditLogService } from '../audit-log/audit-log.service'

export interface CreateHandoverDto {
  leavingUserId: string
  leavingUserName: string
  receiverUserId: string
  receiverUserName: string
  handoverType: 'resignation' | 'transfer' | 'temporary'
  description?: string
  approverId?: string
  approverName?: string
}

@Injectable()
export class UserHandoverService {
  constructor(
    @InjectRepository(UserHandover)
    private handoverRepository: Repository<UserHandover>,
    @InjectRepository(HandoverItem)
    private handoverItemRepository: Repository<HandoverItem>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private dataSource: DataSource,
    private auditLogService: AuditLogService,
  ) {}

  /**
   * 创建离职交接单
   */
  async createHandover(dto: CreateHandoverDto, ip: string): Promise<UserHandover> {
    // 统计待交接资源数量
    const stats = await this.countLeavingUserResources(dto.leavingUserId)

    const handover = this.handoverRepository.create({
      ...dto,
      customerCount: stats.customerCount,
      leadCount: stats.leadCount,
      opportunityCount: stats.opportunityCount,
      orderCount: stats.orderCount,
      todoCount: stats.todoCount,
      status: dto.approverId ? 'pending' : 'in_progress',
      approverId: dto.approverId,
      approverName: dto.approverName,
    })

    const saved = await this.handoverRepository.save(handover)

    // 创建交接清单项
    await this.createHandoverItems(saved.id, dto.leavingUserId)

    // 记录审计日志
    await this.auditLogService.recordSensitiveAction(
      'CREATE',
      'user' as any,
      dto.leavingUserId,
      dto.leavingUserName,
      ip,
      { handoverId: saved.id, receiverUserId: dto.receiverUserId },
      `创建离职交接单，接收人：${dto.receiverUserName}`,
    )

    return saved
  }

  /**
   * 统计离职人资源
   */
  private async countLeavingUserResources(userId: string) {
    const customerCount = await this.customerRepository.count({ where: { ownerId: userId as any } })
    const leadCount = await this.leadRepository.count({ where: { ownerId: userId as any } })
    const opportunityCount = await this.opportunityRepository.count({ where: { ownerId: userId as any } })
    const orderCount = await this.orderRepository.count({ where: { salesId: userId as any } })
    const todoCount = customerCount + leadCount + opportunityCount

    return { customerCount, leadCount, opportunityCount, orderCount, todoCount }
  }

  /**
   * 创建交接清单
   */
  private async createHandoverItems(handoverId: string, userId: string) {
    const items: Partial<HandoverItem>[] = []

    // 客户
    const customers = await this.customerRepository.find({
      where: { ownerId: userId as any },
      select: ['id', 'name'],
    })
    items.push(
      ...customers.map((c) => ({
        handoverId,
        itemType: 'customer' as const,
        itemId: c.id,
        itemName: c.name,
      })),
    )

    // 线索
    const leads = await this.leadRepository.find({
      where: { ownerId: userId as any },
      select: ['id', 'name'],
    })
    items.push(
      ...leads.map((l) => ({
        handoverId,
        itemType: 'lead' as const,
        itemId: l.id,
        itemName: l.name,
      })),
    )

    // 商机
    const opportunities = await this.opportunityRepository.find({
      where: { ownerId: userId as any },
      select: ['id', 'name'],
    })
    items.push(
      ...opportunities.map((o) => ({
        handoverId,
        itemType: 'opportunity' as const,
        itemId: o.id,
        itemName: o.name,
      })),
    )

    if (items.length > 0) {
      await this.handoverItemRepository.save(items as HandoverItem[])
    }
  }

  /**
   * 审批交接单
   */
  async approveHandover(
    handoverId: string,
    approved: boolean,
    rejectReason?: string,
  ): Promise<UserHandover> {
    const handover = await this.handoverRepository.findOne({ where: { id: handoverId } })
    if (!handover) {
      throw new BadRequestException('交接单不存在')
    }

    if (handover.status !== 'pending') {
      throw new BadRequestException('交接单状态不允许审批')
    }

    if (approved) {
      handover.status = 'in_progress'
      handover.approvedAt = new Date()

      // 执行资源转移
      await this.transferResources(handover)
    } else {
      handover.status = 'cancelled'
      handover.cancelReason = rejectReason
    }

    return this.handoverRepository.save(handover)
  }

  /**
   * 执行资源转移（事务）
   */
  private async transferResources(handover: UserHandover) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // 转移客户
      await queryRunner.manager.update(
        Customer,
        { ownerId: handover.leavingUserId as any },
        { ownerId: handover.receiverUserId as any },
      )

      // 转移线索
      await queryRunner.manager.update(
        Lead,
        { ownerId: handover.leavingUserId as any },
        { ownerId: handover.receiverUserId as any },
      )

      // 转移商机
      await queryRunner.manager.update(
        Opportunity,
        { ownerId: handover.leavingUserId as any },
        { ownerId: handover.receiverUserId as any },
      )

      // 转移订单
      await queryRunner.manager.update(
        Order,
        { salesId: handover.leavingUserId as any },
        { salesId: handover.receiverUserId as any },
      )

      // 更新交接清单项状态
      await queryRunner.manager.update(
        HandoverItem,
        { handoverId: handover.id },
        { status: 'transferred' },
      )

      // 标记交接单完成
      handover.status = 'completed'
      handover.completedAt = new Date()
      await queryRunner.manager.save(UserHandover, handover)

      await queryRunner.commitTransaction()

      // 记录审计日志
      await this.auditLogService.recordSensitiveAction(
        'ASSIGN',
        'user' as any,
        handover.leavingUserId,
        handover.leavingUserName,
        'system',
        {
          receiverUserId: handover.receiverUserId,
          receiverUserName: handover.receiverUserName,
          handoverId: handover.id,
        },
        `离职交接完成，资源已转移给 ${handover.receiverUserName}`,
      )
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  /**
   * 获取交接单列表
   */
  async getHandovers(
    page: number = 1,
    limit: number = 20,
    filters?: {
      leavingUserId?: string
      receiverUserId?: string
      status?: string
      handoverType?: string
    },
  ) {
    const query = this.handoverRepository.createQueryBuilder('handover')
      .orderBy('handover.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.leavingUserId) {
      query.andWhere('handover.leavingUserId = :leavingUserId', { leavingUserId: filters.leavingUserId })
    }
    if (filters?.receiverUserId) {
      query.andWhere('handover.receiverUserId = :receiverUserId', { receiverUserId: filters.receiverUserId })
    }
    if (filters?.status) {
      query.andWhere('handover.status = :status', { status: filters.status })
    }
    if (filters?.handoverType) {
      query.andWhere('handover.handoverType = :handoverType', { handoverType: filters.handoverType })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 获取交接单详情
   */
  async getHandoverDetail(handoverId: string) {
    const handover = await this.handoverRepository.findOne({ where: { id: handoverId } })
    if (!handover) {
      throw new BadRequestException('交接单不存在')
    }

    const items = await this.handoverItemRepository.find({
      where: { handoverId },
      order: { createdAt: 'ASC' },
    })

    return { ...handover, items }
  }
}
