/**
 * 角色服务
 * 处理角色管理的 CRUD 操作
 */
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Role, RoleStatus } from '@prisma/client'
import { CreateRoleDto, UpdateRoleDto, UpdateRolePermissionsDto, RoleQueryDto } from './role.dto'

// 导出 DTO 供控制器使用
export { CreateRoleDto, UpdateRoleDto, UpdateRolePermissionsDto, RoleQueryDto } from './role.dto'

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * 创建角色
   */
  async create(dto: CreateRoleDto): Promise<Role> {
    // 检查角色编码是否已存在
    const existingCode = await this.prisma.role.findUnique({
      where: { code: dto.code },
    })
    if (existingCode) {
      throw new BadRequestException('角色编码已存在')
    }

    // 处理权限：确保是数组格式
    const permissions: string[] = Array.isArray(dto.permissions)
      ? dto.permissions
      : typeof dto.permissions === 'string'
        ? (dto.permissions as string).split(',').map((p: string) => p.trim())
        : []

    // 创建角色
    const role = await this.prisma.role.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        permissions,
        status: dto.status || RoleStatus.ACTIVE,
      },
    })

    this.logger.log(`创建角色成功: ${role.name}`)
    return role
  }

  /**
   * 更新角色
   */
  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    // 检查角色是否存在
    const role = await this.prisma.role.findUnique({
      where: { id },
    })
    if (!role) {
      throw new NotFoundException('角色不存在')
    }

    // 检查角色编码是否已被其他角色使用
    if (dto.code && dto.code !== role.code) {
      const existingCode = await this.prisma.role.findUnique({
        where: { code: dto.code },
      })
      if (existingCode) {
        throw new BadRequestException('角色编码已存在')
      }
    }

    // 更新角色
    const roleData: any = {
      name: dto.name,
      code: dto.code,
      description: dto.description,
      status: dto.status,
    };

    if (dto.permissions !== undefined) {
      roleData.permissions = Array.isArray(dto.permissions)
        ? dto.permissions
        : typeof dto.permissions === 'string'
          ? (dto.permissions as string).split(',').map((p: string) => p.trim())
          : [];
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data: roleData,
    })

    this.logger.log(`更新角色成功: ${updated.name}`)
    return updated
  }

  /**
   * 删除角色（软删除）
   */
  async delete(id: string): Promise<void> {
    // 检查角色是否存在
    const role = await this.prisma.role.findUnique({
      where: { id },
    })
    if (!role) {
      throw new NotFoundException('角色不存在')
    }

    // 软删除
    await this.prisma.role.update({
      where: { id },
      data: { status: "INACTIVE" },
    })

    this.logger.log(`删除角色成功: ${role.name}`)
  }

  /**
   * 获取角色详情
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    })
    if (!role) {
      throw new NotFoundException('角色不存在')
    }
    return role
  }

  /**
   * 获取角色列表（分页）
   */
  async findAll(query: RoleQueryDto): Promise<any> {
    const { page = 1, pageSize = 10, keyword, status } = query

    // 构建查询条件
    const where: any = {}

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { code: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    // 查询总数
    const total = await this.prisma.role.count({ where })

    // 查询列表
    const list = await this.prisma.role.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    return { list, total, page, pageSize }
  }

  /**
   * 更新角色权限
   */
  async updatePermissions(id: string, dto: UpdateRolePermissionsDto): Promise<any> {
    // 检查角色是否存在
    const role = await this.prisma.role.findUnique({
      where: { id },
    })
    if (!role) {
      throw new NotFoundException('角色不存在')
    }

    // 更新权限 - 确保是数组格式
    const permissions: string[] = Array.isArray(dto.permissions)
      ? dto.permissions
      : typeof dto.permissions === 'string'
        ? (dto.permissions as string).split(',').map((p: string) => p.trim())
        : []

    const updated = await this.prisma.role.update({
      where: { id },
      data: { permissions },
    })

    this.logger.log(`更新角色权限成功: ${updated.name}`)
    return {
      id: updated.id,
      name: updated.name,
      permissions: updated.permissions,
    }
  }

  /**
   * 获取角色权限
   */
  async getPermissions(id: string): Promise<any> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    })
    if (!role) {
      throw new NotFoundException('角色不存在')
    }

    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions || [],
    }
  }

  /**
   * 获取角色详情（包含用户数量）
   */
  async getDetail(id: string): Promise<any> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    if (!role) {
      throw new NotFoundException('角色不存在')
    }

    return {
      ...role,
      userCount: role.users.length,
    }
  }
}
