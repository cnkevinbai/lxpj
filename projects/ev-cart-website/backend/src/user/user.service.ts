import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
  departmentId?: string;
}

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  avatar?: string;
  departmentId?: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * 获取用户列表
   */
  async findAll(params: {
    page?: number;
    pageSize?: number;
    role?: string;
    departmentId?: string;
    keyword?: string;
  }) {
    const { page = 1, pageSize = 20, ...filters } = params;

    const where: any = {};

    if (filters.role) where.role = filters.role;
    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.keyword) {
      where.OR = [
        { name: { contains: filters.keyword } },
        { username: { contains: filters.keyword } },
        { email: { contains: filters.keyword } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          phone: true,
          avatar: true,
          role: true,
          departmentId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取用户详情
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`用户 ${id} 不存在`);
    }

    return user;
  }

  /**
   * 创建用户
   */
  async create(data: CreateUserDto) {
    // 检查邮箱是否已存在
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new BadRequestException('邮箱已被注册');
    }

    // 检查用户名是否已存在
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new BadRequestException('用户名已被注册');
    }

    const user = await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * 更新用户
   */
  async update(id: string, data: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        departmentId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * 删除用户
   */
  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * 获取工程师列表
   */
  async getEngineers(params?: {
    page?: number;
    pageSize?: number;
    available?: boolean;
  }) {
    const { page = 1, pageSize = 20 } = params || {};

    const users = await this.prisma.user.findMany({
      where: {
        role: 'ENGINEER',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    const total = await this.prisma.user.count({
      where: { role: 'ENGINEER' },
    });

    return {
      data: users,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 获取主管列表
   */
  async getSupervisors(params?: {
    page?: number;
    pageSize?: number;
  }) {
    const { page = 1, pageSize = 20 } = params || {};

    const users = await this.prisma.user.findMany({
      where: {
        role: 'SUPERVISOR',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    const total = await this.prisma.user.count({
      where: { role: 'SUPERVISOR' },
    });

    return {
      data: users,
      total,
      page,
      pageSize,
    };
  }

  /**
   * 获取客服列表
   */
  async getCustomerServices(params?: {
    page?: number;
    pageSize?: number;
  }) {
    const { page = 1, pageSize = 20 } = params || {};

    const users = await this.prisma.user.findMany({
      where: {
        role: 'CUSTOMER_SERVICE',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    const total = await this.prisma.user.count({
      where: { role: 'CUSTOMER_SERVICE' },
    });

    return {
      data: users,
      total,
      page,
      pageSize,
    };
  }
}
