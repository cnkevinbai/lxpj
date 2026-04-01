/**
 * 视频模块 Service
 * 负责视频数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateVideoDto, UpdateVideoDto, VideoQueryDto } from './video.dto'
import { VideoStatus, VideoSource } from '@prisma/client'

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建视频
   * @param dto 创建视频 DTO
   * @returns 创建的视频
   */
  async create(dto: CreateVideoDto) {
    return this.prisma.video.create({
      data: {
        title: dto.title,
        summary: dto.summary,
        url: dto.url,
        cover: dto.cover,
        duration: dto.duration,
        source: dto.source || VideoSource.LOCAL,
        status: dto.status || VideoStatus.DRAFT,
        views: 0,
      },
    })
  }

  /**
   * 根据 ID 查找视频
   * @param id 视频 ID
   * @returns 视频详情
   */
  async findOne(id: string) {
    const video = await this.prisma.video.findUnique({
      where: { id },
    })

    if (!video) {
      throw new NotFoundException('视频不存在')
    }

    return video
  }

  /**
   * 获取视频列表（分页）
   * @param query 查询参数
   * @returns 视频列表和总数
   */
  async findAll(query: VideoQueryDto) {
    const { page = 1, pageSize = 10, keyword, source, status } = query
    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: any = {}

    // 关键词搜索（标题或摘要）
    if (keyword) {
      where.OR = [{ title: { contains: keyword } }, { summary: { contains: keyword } }]
    }

    // 来源筛选
    if (source) {
      where.source = source
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.video.count({ where })

    // 查询数据
    const list = await this.prisma.video.findMany({
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
   * 更新视频
   * @param id 视频 ID
   * @param dto 更新 DTO
   * @returns 更新后的视频
   */
  async update(id: string, dto: UpdateVideoDto) {
    // 检查视频是否存在
    const existing = await this.prisma.video.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('视频不存在')
    }

    // 更新视频
    return this.prisma.video.update({
      where: { id },
      data: { ...dto },
    })
  }

  /**
   * 发布视频
   * @param id 视频 ID
   * @returns 更新后的视频
   */
  async publish(id: string) {
    return this.prisma.video.update({
      where: { id },
      data: { status: VideoStatus.PUBLISHED },
    })
  }

  /**
   * 归档视频
   * @param id 视频 ID
   * @returns 更新后的视频
   */
  async archive(id: string) {
    return this.prisma.video.update({
      where: { id },
      data: { status: VideoStatus.ARCHIVED },
    })
  }

  /**
   * 增加浏览量
   * @param id 视频 ID
   * @returns 更新后的视频
   */
  async incrementViews(id: string) {
    return this.prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  }

  /**
   * 删除视频
   * @param id 视频 ID
   */
  async delete(id: string) {
    // 检查视频是否存在
    const existing = await this.prisma.video.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('视频不存在')
    }

    // 删除视频
    await this.prisma.video.delete({
      where: { id },
    })

    return { message: '视频已删除' }
  }
}
