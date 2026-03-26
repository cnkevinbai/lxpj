/**
 * 案例模块 Service
 * 负责案例数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateCaseDto, UpdateCaseDto, CaseQueryDto } from './case.dto'
import { CaseStatus } from '@prisma/client'

@Injectable()
export class CaseService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建案例
   * @param dto 创建案例 DTO
   * @returns 创建的案例
   */
  async create(dto: CreateCaseDto) {
    // 生成案例编号
    const caseNo = `CASE-${Date.now().toString(36).toUpperCase()}`

    return this.prisma.case.create({
      data: {
        caseNo,
        title: dto.title,
        summary: dto.summary,
        content: dto.content,
        cover: dto.cover,
        images: dto.images,
        type: dto.type,
        status: dto.status || CaseStatus.DRAFT,
        views: 0,
      },
    })
  }

  /**
   * 根据 ID 查找案例
   * @param id 案例 ID
   * @returns 案例详情
   */
  async findOne(id: string) {
    const caseItem = await this.prisma.case.findUnique({
      where: { id },
    })

    if (!caseItem) {
      throw new NotFoundException('案例不存在')
    }

    return caseItem
  }

  /**
   * 获取案例列表（分页）
   * @param query 查询参数
   * @returns 案例列表和总数
   */
  async findAll(query: CaseQueryDto) {
    const { page = 1, pageSize = 10, keyword, type, status } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（标题或摘要）
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { summary: { contains: keyword } },
      ]
    }

    // 类型筛选
    if (type) {
      where.type = type
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.case.count({ where })

    // 查询数据
    const list = await this.prisma.case.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 更新案例
   * @param id 案例 ID
   * @param dto 更新 DTO
   * @returns 更新后的案例
   */
  async update(id: string, dto: UpdateCaseDto) {
    // 检查案例是否存在
    const existing = await this.prisma.case.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('案例不存在')
    }

    // 更新案例
    return this.prisma.case.update({
      where: { id },
      data: { ...dto },
    })
  }

  /**
   * 发布案例
   * @param id 案例 ID
   * @returns 更新后的案例
   */
  async publish(id: string) {
    return this.prisma.case.update({
      where: { id },
      data: { status: CaseStatus.PUBLISHED },
    })
  }

  /**
   * 归档案例
   * @param id 案例 ID
   * @returns 更新后的案例
   */
  async archive(id: string) {
    return this.prisma.case.update({
      where: { id },
      data: { status: CaseStatus.ARCHIVED },
    })
  }

  /**
   * 增加浏览量
   * @param id 案例 ID
   * @returns 更新后的案例
   */
  async incrementViews(id: string) {
    return this.prisma.case.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  }

  /**
   * 删除案例
   * @param id 案例 ID
   */
  async delete(id: string) {
    // 检查案例是否存在
    const existing = await this.prisma.case.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('案例不存在')
    }

    // 删除案例
    await this.prisma.case.delete({
      where: { id },
    })

    return { message: '案例已删除' }
  }
}
