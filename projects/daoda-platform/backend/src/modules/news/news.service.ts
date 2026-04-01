/**
 * 新闻模块 Service
 * 负责新闻数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateNewsDto, UpdateNewsDto, NewsQueryDto } from './news.dto'
import { NewsStatus } from '@prisma/client'

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建新闻
   * @param dto 创建新闻 DTO
   * @returns 创建的新闻
   */
  async create(dto: CreateNewsDto) {
    return this.prisma.news.create({
      data: {
        title: dto.title,
        summary: dto.summary,
        content: dto.content,
        cover: dto.cover,
        authorId: 'system',
        status: dto.status || NewsStatus.DRAFT,
        views: 0,
      },
    })
  }

  /**
   * 根据 ID 查找新闻
   * @param id 新闻 ID
   * @returns 新闻详情
   */
  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    })

    if (!news) {
      throw new NotFoundException('新闻不存在')
    }

    return news
  }

  /**
   * 获取新闻列表（分页）
   * @param query 查询参数
   * @returns 新闻列表和总数
   */
  async findAll(query: NewsQueryDto) {
    const { page = 1, pageSize = 10, keyword, status } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（标题或摘要）
    if (keyword) {
      where.OR = [{ title: { contains: keyword } }, { summary: { contains: keyword } }]
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.news.count({ where })

    // 查询数据
    const list = await this.prisma.news.findMany({
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
   * 更新新闻
   * @param id 新闻 ID
   * @param dto 更新 DTO
   * @returns 更新后的新闻
   */
  async update(id: string, dto: UpdateNewsDto) {
    // 检查新闻是否存在
    const existing = await this.prisma.news.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('新闻不存在')
    }

    // 如果是发布操作，设置发布时间
    const data: any = { ...dto }
    if (dto.status === NewsStatus.PUBLISHED && existing.status !== NewsStatus.PUBLISHED) {
      data.publishedAt = new Date()
    }

    // 更新新闻
    return this.prisma.news.update({
      where: { id },
      data,
    })
  }

  /**
   * 发布新闻
   * @param id 新闻 ID
   * @returns 更新后的新闻
   */
  async publish(id: string) {
    return this.prisma.news.update({
      where: { id },
      data: {
        status: NewsStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    })
  }

  /**
   * 归档新闻
   * @param id 新闻 ID
   * @returns 更新后的新闻
   */
  async archive(id: string) {
    return this.prisma.news.update({
      where: { id },
      data: { status: NewsStatus.ARCHIVED },
    })
  }

  /**
   * 增加浏览量
   * @param id 新闻 ID
   * @returns 更新后的新闻
   */
  async incrementViews(id: string) {
    return this.prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  }

  /**
   * 删除新闻
   * @param id 新闻 ID
   */
  async delete(id: string) {
    // 检查新闻是否存在
    const existing = await this.prisma.news.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('新闻不存在')
    }

    // 删除新闻
    await this.prisma.news.delete({
      where: { id },
    })

    return { message: '新闻已删除' }
  }
}
