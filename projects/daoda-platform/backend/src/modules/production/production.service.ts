/**
 * 生产模块 Service
 * 负责生产数据的 CRUD 操作和业务逻辑
 * 注意：Production 模型没有 productionNo, completedQty, userId, user, product 关系
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import {
  CreateProductionDto,
  UpdateProductionDto,
  ProductionQueryDto,
  StartProductionDto,
  CompleteProductionDto,
} from './production.dto'
import { ProductionStatus } from '@prisma/client'

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建生产单
   * @param dto 创建生产单 DTO
   * @returns 创建的生产单
   */
  async create(dto: CreateProductionDto) {
    return this.prisma.production.create({
      data: {
        productId: dto.productId,
        quantity: dto.quantity,
        status: ProductionStatus.PLANNED,
        startDate: dto.startDate,
        endDate: dto.endDate,
        remark: dto.remark,
        planId: dto.planId,
      },
    })
  }

  /**
   * 根据 ID 查找生产单
   * @param id 生产单 ID
   * @returns 生产单详情
   */
  async findOne(id: string) {
    const production = await this.prisma.production.findUnique({
      where: { id },
    })

    if (!production) {
      throw new NotFoundException('生产单不存在')
    }

    return production
  }

  /**
   * 获取生产单列表（分页）
   * @param query 查询参数
   * @returns 生产单列表和总数
   */
  async findAll(query: ProductionQueryDto) {
    const { page = 1, pageSize = 10, status, productId } = query
    const skip = (page - 1) * pageSize

    const where: any = {}
    if (status) {
      where.status = status
    }
    if (productId) {
      where.productId = productId
    }

    const [list, total] = await Promise.all([
      this.prisma.production.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.production.count({ where }),
    ])

    return { list, total, page, pageSize }
  }

  /**
   * 更新生产单
   * @param id 生产单 ID
   * @param dto 更新内容
   * @returns 更新后的生产单
   */
  async update(id: string, dto: UpdateProductionDto) {
    const existing = await this.findOne(id)

    // 只有 PLANNED 状态可以修改
    if (existing.status !== ProductionStatus.PLANNED) {
      throw new BadRequestException('只有计划中的生产单可以修改')
    }

    return this.prisma.production.update({
      where: { id },
      data: {
        quantity: dto.quantity,
        startDate: dto.startDate,
        endDate: dto.endDate,
        remark: dto.remark,
      },
    })
  }

  /**
   * 删除生产单
   * @param id 生产单 ID
   */
  async delete(id: string) {
    const production = await this.findOne(id)

    // 只有 PLANNED 状态可以删除
    if (production.status !== ProductionStatus.PLANNED) {
      throw new BadRequestException('只有计划中的生产单可以删除')
    }

    await this.prisma.production.delete({
      where: { id },
    })
  }

  /**
   * 开始生产
   * @param id 生产单 ID
   * @param dto 开始生产 DTO
   * @returns 更新后的生产单
   */
  async start(id: string, dto?: StartProductionDto) {
    const production = await this.findOne(id)

    if (production.status !== ProductionStatus.PLANNED) {
      throw new BadRequestException('只有计划中的生产单可以开始')
    }

    return this.prisma.production.update({
      where: { id },
      data: {
        status: ProductionStatus.IN_PROGRESS,
        startDate: dto?.startDate || new Date(),
      },
    })
  }

  /**
   * 完成生产
   * @param id 生产单 ID
   * @param dto 完成生产 DTO
   * @returns 更新后的生产单
   */
  async complete(id: string, dto?: CompleteProductionDto) {
    const production = await this.findOne(id)

    if (production.status !== ProductionStatus.IN_PROGRESS) {
      throw new BadRequestException('只有进行中的生产单可以完成')
    }

    return this.prisma.production.update({
      where: { id },
      data: {
        status: ProductionStatus.COMPLETED,
        endDate: dto?.endDate || new Date(),
      },
    })
  }

  /**
   * 取消生产单
   * @param id 生产单 ID
   * @returns 更新后的生产单
   */
  async cancel(id: string) {
    const production = await this.findOne(id)

    if (production.status === ProductionStatus.COMPLETED) {
      throw new BadRequestException('已完成的生产单不能取消')
    }

    return this.prisma.production.update({
      where: { id },
      data: { status: ProductionStatus.CANCELLED },
    })
  }

  /**
   * 获取生产统计
   * @returns 统计数据
   */
  async getStats() {
    const [total, planned, inProgress, completed, cancelled] = await Promise.all([
      this.prisma.production.count(),
      this.prisma.production.count({ where: { status: ProductionStatus.PLANNED } }),
      this.prisma.production.count({ where: { status: ProductionStatus.IN_PROGRESS } }),
      this.prisma.production.count({ where: { status: ProductionStatus.COMPLETED } }),
      this.prisma.production.count({ where: { status: ProductionStatus.CANCELLED } }),
    ])

    return { total, planned, inProgress, completed, cancelled }
  }
}
