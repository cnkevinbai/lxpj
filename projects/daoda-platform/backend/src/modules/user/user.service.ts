/**
 * 用户服务
 * 处理用户的 CRUD 操作
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { User, UserStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { UserRole } from '../../common/enums/user-role.enum'

// ==================== DTO 定义 ====================

export interface CreateUserDto {
  email: string
  phone?: string
  password: string
  name: string
  roleId?: string | null
  avatar?: string
}

export interface UpdateUserDto {
  name?: string
  phone?: string
  avatar?: string
  roleId?: string | null
  status?: UserStatus
}

export interface UserQueryDto {
  page?: number
  pageSize?: number
  keyword?: string
  roleId?: string | null
  status?: UserStatus
}

export interface UserListResponse {
  list: User[]
  total: number
  page: number
  pageSize: number
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 创建用户
   */
  async create(dto: CreateUserDto): Promise<User> {
    // 检查邮箱是否已存在
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (existingEmail) {
      throw new BadRequestException('邮箱已被使用')
    }

    // 检查手机号是否已存在
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      })
      if (existingPhone) {
        throw new BadRequestException('手机号已被使用')
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
        roleId: dto.roleId || null,
        avatar: dto.avatar,
      },
    })

    this.logger.log(`创建用户成功: ${user.email}`)
    return user
  }

  /**
   * 更新用户
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 检查手机号是否已被其他用户使用
    if (dto.phone && dto.phone !== user.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      })
      if (existingPhone) {
        throw new BadRequestException('手机号已被使用')
      }
    }

    // 更新用户
    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    })

    this.logger.log(`更新用户成功: ${updated.email}`)
    return updated
  }

  /**
   * 删除用户（软删除）
   */
  async delete(id: string): Promise<void> {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 软删除
    await this.prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' },
    })

    this.logger.log(`删除用户成功: ${user.email}`)
  }

  /**
   * 获取用户详情
   */
  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return user
  }

  /**
   * 获取用户列表（分页）
   */
  async findAll(query: UserQueryDto): Promise<UserListResponse> {
    const { page = 1, pageSize = 10, keyword, roleId, status } = query

    // 构建查询条件
    const where: any = { deletedAt: null }

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword } },
      ]
    }

    if (roleId !== undefined && roleId !== null) {
      where.roleId = roleId
    }

    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.user.count({ where })

    // 查询列表
    const list = await this.prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: { roleRel: true },
    })

    return { list, total, page, pageSize }
  }

  /**
   * 批量更新用户状态
   */
  async batchUpdateStatus(ids: string[], status: UserStatus): Promise<number> {
    const result = await this.prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { status },
    })

    this.logger.log(`批量更新用户状态: ${result.count} 条记录`)
    return result.count
  }

  /**
   * 重置用户密码
   */
  async resetPassword(id: string, newPassword: string): Promise<void> {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    })

    this.logger.log(`重置用户密码: ${user.email}`)
  }

  /**
   * 更新用户头像
   */
  async updateAvatar(id: string, avatar: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return this.prisma.user.update({
      where: { id },
      data: { avatar },
    })
  }
}
