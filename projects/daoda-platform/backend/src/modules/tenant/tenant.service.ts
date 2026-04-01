/**
 * 租户管理 Service
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { CreateTenantDto, UpdateTenantDto, TenantQueryDto, TenantStatus } from './tenant.dto'

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建租户
   */
  async create(dto: CreateTenantDto) {
    // 检查租户代码是否已存在
    const existing = await this.prisma.tenant.findUnique({
      where: { code: dto.code },
    })

    if (existing) {
      throw new BadRequestException('租户代码已存在')
    }

    return this.prisma.tenant.create({
      data: {
        code: dto.code,
        name: dto.name,
        logo: dto.logo,
        status: dto.status || TenantStatus.ACTIVE,
        plan: dto.plan,
        maxUsers: dto.maxUsers || 100,
        expireAt: dto.expireAt ? new Date(dto.expireAt) : null,
        config: dto.config,
      },
    })
  }

  /**
   * 获取租户列表
   */
  async findAll(query: TenantQueryDto) {
    const { keyword, status, page = 1, pageSize = 10 } = query
    const skip = (page - 1) * pageSize

    const where: any = {}

    // 关键词搜索
    if (keyword) {
      where.OR = [
        { code: { contains: keyword, mode: 'insensitive' } },
        { name: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    // 状态筛选
    if (status) {
      where.status = status
    }

    const [list, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ])

    return {
      list,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 获取租户详情
   */
  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    })

    if (!tenant) {
      throw new NotFoundException('租户不存在')
    }

    return tenant
  }

  /**
   * 更新租户
   */
  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    })

    if (!tenant) {
      throw new NotFoundException('租户不存在')
    }

    return this.prisma.tenant.update({
      where: { id },
      data: {
        name: dto.name,
        logo: dto.logo,
        status: dto.status,
        plan: dto.plan,
        maxUsers: dto.maxUsers,
        expireAt: dto.expireAt ? new Date(dto.expireAt) : null,
        config: dto.config,
      },
    })
  }

  /**
   * 删除租户
   */
  async delete(id: string) {
    // 不允许删除默认租户
    if (id === 'default-tenant-id') {
      throw new BadRequestException('不能删除默认租户')
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    })

    if (!tenant) {
      throw new NotFoundException('租户不存在')
    }

    if (tenant._count.users > 0) {
      throw new BadRequestException('租户下还有用户，不能删除')
    }

    await this.prisma.tenant.delete({
      where: { id },
    })

    return { message: '租户已删除' }
  }

  /**
   * 暂停租户
   */
  async suspend(id: string) {
    if (id === 'default-tenant-id') {
      throw new BadRequestException('不能暂停默认租户')
    }

    return this.prisma.tenant.update({
      where: { id },
      data: { status: TenantStatus.SUSPENDED },
    })
  }

  /**
   * 激活租户
   */
  async activate(id: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { status: TenantStatus.ACTIVE },
    })
  }

  /**
   * 获取所有活跃租户
   */
  async getActiveTenants() {
    return this.prisma.tenant.findMany({
      where: { status: TenantStatus.ACTIVE },
      orderBy: { name: 'asc' },
    })
  }
}
