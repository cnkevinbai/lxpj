/**
 * 生产计划模块服务
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import {
  CreateProductionPlanDto,
  UpdateProductionPlanDto,
  CreateProductionPlanItemDto,
  UpdateProductionPlanItemDto,
  ProductionPlanQueryDto,
  ProductionPlanListResponse,
} from './production-plan.dto'

@Injectable()
export class ProductionPlanService {
  private readonly logger = new Logger(ProductionPlanService.name)

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductionPlanDto): Promise<any> {
    const existing = await this.prisma.productionPlan.findUnique({ where: { planNo: dto.planNo } })
    if (existing) {
      throw new BadRequestException('计划编号已存在')
    }

    const plan = await this.prisma.productionPlan.create({
      data: {
        planNo: dto.planNo,
        productId: dto.productId,
        quantity: dto.quantity,
        status: dto.status || 'PLANNED',
        startDate: dto.startDate,
        endDate: dto.endDate,
        remark: dto.remark,
      },
    })

    this.logger.log(`创建生产计划：${plan.planNo}`)
    return plan
  }

  async update(id: string, dto: UpdateProductionPlanDto): Promise<any> {
    const plan = await this.prisma.productionPlan.findUnique({
      where: { id },
    })
    if (!plan) {
      throw new NotFoundException('生产计划不存在')
    }

    if (dto.planNo && dto.planNo !== plan.planNo) {
      const existing = await this.prisma.productionPlan.findUnique({ where: { planNo: dto.planNo } })
      if (existing && existing.id !== id) {
        throw new BadRequestException('计划编号已被使用')
      }
    }

    const data: any = {}
    if (dto.planNo) data.planNo = dto.planNo
    if (dto.productId) data.productId = dto.productId
    if (dto.quantity !== undefined) data.quantity = dto.quantity
    if (dto.status) data.status = dto.status
    if (dto.startDate) data.startDate = dto.startDate
    if (dto.endDate) data.endDate = dto.endDate
    if (dto.remark !== undefined) data.remark = dto.remark

    const updated = await this.prisma.productionPlan.update({ where: { id }, data })
    this.logger.log(`更新生产计划：${updated.planNo}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const plan = await this.prisma.productionPlan.findUnique({
      where: { id },
    })
    if (!plan) {
      throw new NotFoundException('生产计划不存在')
    }

    // 检查是否已审批或进行中
    if (plan.status !== 'DRAFT') {
      throw new BadRequestException('仅能删除草稿状态的计划')
    }

    await this.prisma.productionPlan.delete({ where: { id } })
    this.logger.log(`删除生产计划：${plan.planNo}`)
  }

  async findOne(id: string, includeItems: boolean = false): Promise<any> {
    const plan = await this.prisma.productionPlan.findUnique({
      where: { id },
      include: includeItems ? { items: true } : undefined,
    })
    if (!plan) {
      throw new NotFoundException('生产计划不存在')
    }
    return plan
  }

  async findAll(query: ProductionPlanQueryDto): Promise<ProductionPlanListResponse> {
    const { page = 1, pageSize = 10, planNo, status, startDateStart, startDateEnd } = query
    const where: any = {}

    if (planNo) where.planNo = { contains: planNo, mode: 'insensitive' }
    if (status) where.status = status

    if (startDateStart || startDateEnd) {
      where.startDate = {}
      if (startDateStart) where.startDate.gte = startDateStart
      if (startDateEnd) where.startDate.lte = startDateEnd
    }

    const total = await this.prisma.productionPlan.count({ where })
    const list = await this.prisma.productionPlan.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return { list, total, page, pageSize }
  }

  async addItem(planId: string, dto: CreateProductionPlanItemDto): Promise<any> {
    const plan = await this.prisma.productionPlan.findUnique({ where: { id: planId } })
    if (!plan) {
      throw new NotFoundException('生产计划不存在')
    }

    // 检查物料是否已存在
    const existingItem = await this.prisma.productionPlanItem.findFirst({
      where: { planId: planId, productId: dto.productId },
    })
    if (existingItem) {
      throw new BadRequestException('产品已存在于计划中')
    }

    const item = await this.prisma.productionPlanItem.create({
      data: {
        planId: planId,
        productId: dto.productId,
        quantity: dto.quantity,
        remark: dto.remark,
      },
    })

    this.logger.log(`添加生产计划项：计划 ${plan.planNo} - 产品 ${dto.productId}`)
    return item
  }

  async updateItem(itemId: string, dto: UpdateProductionPlanItemDto): Promise<any> {
    const item = await this.prisma.productionPlanItem.findUnique({
      where: { id: itemId },
    })
    if (!item) {
      throw new NotFoundException('生产计划项不存在')
    }

    const data: any = {}
    if (dto.quantity !== undefined) data.quantity = dto.quantity
    if (dto.remark !== undefined) data.remark = dto.remark

    const updated = await this.prisma.productionPlanItem.update({ where: { id: itemId }, data })
    this.logger.log(`更新生产计划项：${itemId}`)
    return updated
  }

  async removeItem(itemId: string): Promise<void> {
    const item = await this.prisma.productionPlanItem.findUnique({
      where: { id: itemId },
    })
    if (!item) {
      throw new NotFoundException('生产计划项不存在')
    }

    await this.prisma.productionPlanItem.delete({ where: { id: itemId } })
    this.logger.log(`删除生产计划项：${itemId}`)
  }

  async approve(id: string): Promise<any> {
    const plan = await this.prisma.productionPlan.findUnique({
      where: { id },
    })
    if (!plan) {
      throw new NotFoundException('生产计划不存在')
    }

    if (plan.status !== 'DRAFT') {
      throw new BadRequestException('仅能审批草稿状态的计划')
    }

    const updated = await this.prisma.productionPlan.update({
      where: { id },
      data: { status: 'APPROVED' },
    })

    this.logger.log(`审批生产计划：${updated.planNo}`)
    return updated
  }

  async cancel(id: string): Promise<any> {
    const plan = await this.prisma.productionPlan.findUnique({
      where: { id },
    })
    if (!plan) {
      throw new NotFoundException('生产计划不存在')
    }

    if (plan.status === 'CANCELLED') {
      throw new BadRequestException('计划已取消')
    }

    const updated = await this.prisma.productionPlan.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })

    this.logger.log(`取消生产计划：${updated.planNo}`)
    return updated
  }

  async generateOrders(planId: string): Promise<{ message: string; count: number }> {
    const plan = await this.prisma.productionPlan.findUnique({
      where: { id: planId },
      include: { items: true },
    })
    if (!plan) {
      throw new NotFoundException('生产计划不存在')
    }

    if (plan.status !== 'APPROVED') {
      throw new BadRequestException('仅已审批的计划可以生成工单')
    }

    const orders = []
    for (const item of plan.items) {
      orders.push(
        this.prisma.production.create({
          data: {
            planId: planId,
            productId: item.productId,
            quantity: item.quantity,
            startDate: plan.startDate,
            endDate: plan.endDate,
          },
        }),
      )
    }

    await this.prisma.$transaction(orders)
    await this.prisma.productionPlan.update({
      where: { id: planId },
      data: { status: 'IN_PROGRESS' },
    })

    this.logger.log(`生成生产工单：计划 ${plan.planNo} - 共 ${orders.length} 条`)
    return { message: '成功生成生产工单', count: orders.length }
  }

  async getCountByStatus(): Promise<{ status: string; count: number }[]> {
    const stats = await this.prisma.productionPlan.groupBy({
      by: ['status'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    return stats.map((s: any) => ({ status: s.status, count: s._count.id }))
  }

  async getPlanByProduct(productId: string): Promise<any[]> {
    const plans = await this.prisma.productionPlan.findMany({
      where: {
        items: {
          some: { productId: productId },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return plans
  }
}
