/**
 * 系统配置模块 Service
 * 负责系统配置数据的 CRUD 操作和业务逻辑
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateSystemConfigDto, UpdateSystemConfigDto, SystemConfigQueryDto } from './system-config.dto'

@Injectable()
export class SystemConfigService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建系统配置
   * @param dto 创建系统配置 DTO
   * @returns 创建的系统配置
   */
  async create(dto: CreateSystemConfigDto) {
    // 检查配置键是否已存在
    const existing = await this.prisma.systemConfig.findUnique({
      where: { key: dto.key },
    })

    if (existing) {
      throw new ConflictException('配置键已存在')
    }

    // 创建系统配置
    return this.prisma.systemConfig.create({
      data: {
        key: dto.key,
        value: dto.value,
        type: dto.type || 'TEXT',
        group: dto.group,
        label: dto.label,
        desc: dto.desc,
      },
    })
  }

  /**
   * 根据 ID 查找系统配置
   * @param id 系统配置 ID
   * @returns 系统配置详情
   */
  async findOne(id: string) {
    const config = await this.prisma.systemConfig.findUnique({
      where: { id },
    })

    if (!config) {
      throw new NotFoundException('系统配置不存在')
    }

    return config
  }

  /**
   * 根据键查找系统配置
   * @param key 配置键
   * @returns 系统配置详情
   */
  async findByKey(key: string) {
    return this.prisma.systemConfig.findUnique({
      where: { key },
    })
  }

  /**
   * 获取系统配置列表
   * @param query 查询参数
   * @returns 系统配置列表
   */
  async findAll(query: SystemConfigQueryDto) {
    const { group, keyword } = query

    // 构建查询条件
    const where: any = {}

    // 分组筛选
    if (group) {
      where.group = group
    }

    // 关键词搜索（键、标签、描述）
    if (keyword) {
      where.OR = [
        { key: { contains: keyword } },
        { label: { contains: keyword } },
        { desc: { contains: keyword } },
      ]
    }

    // 查询数据
    const list = await this.prisma.systemConfig.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    })

    return {
      list,
      total: list.length,
    }
  }

  /**
   * 获取配置值（便捷方法）
   * @param key 配置键
   * @param defaultValue 默认值
   * @returns 配置值
   */
  async getValue(key: string, defaultValue?: string): Promise<string | undefined> {
    const config = await this.findByKey(key)
    return config ? config.value : defaultValue
  }

  /**
   * 更新系统配置
   * @param id 系统配置 ID
   * @param dto 更新 DTO
   * @returns 更新后的系统配置
   */
  async update(id: string, dto: UpdateSystemConfigDto) {
    // 检查系统配置是否存在
    const existing = await this.prisma.systemConfig.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('系统配置不存在')
    }

    // 更新系统配置
    return this.prisma.systemConfig.update({
      where: { id },
      data: {
        value: dto.value,
        type: dto.type,
        group: dto.group,
        label: dto.label,
        desc: dto.desc,
      },
    })
  }

  /**
   * 根据键更新配置值（便捷方法）
   * @param key 配置键
   * @param value 配置值
   * @returns 更新后的系统配置
   */
  async updateValue(key: string, value: string) {
    const existing = await this.findByKey(key)

    if (!existing) {
      throw new NotFoundException('系统配置不存在')
    }

    return this.prisma.systemConfig.update({
      where: { id: existing.id },
      data: { value },
    })
  }

  /**
   * 删除系统配置
   * @param id 系统配置 ID
   */
  async delete(id: string) {
    // 检查系统配置是否存在
    const existing = await this.prisma.systemConfig.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new NotFoundException('系统配置不存在')
    }

    // 删除系统配置
    await this.prisma.systemConfig.delete({
      where: { id },
    })

    return { message: '系统配置已删除' }
  }

  /**
   * 批量获取配置（按分组）
   * @param group 配置分组
   * @returns 配置列表
   */
  async getByGroup(group: string) {
    return this.prisma.systemConfig.findMany({
      where: { group },
      orderBy: { key: 'asc' },
    })
  }
}
