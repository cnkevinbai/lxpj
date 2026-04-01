/**
 * 认证服务
 * 负责用户登录、注册、Token 管理等核心认证逻辑
 */
import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../common/prisma/prisma.service'
import * as bcrypt from 'bcrypt'

// ==================== DTO 定义 ====================

export interface LoginDto {
  email?: string
  phone?: string
  password: string
}

export interface RegisterDto {
  email: string
  phone?: string
  password: string
  name: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserInfo
}

export interface UserInfo {
  id: string
  email: string
  phone: string | null
  name: string
  avatar: string | null
  roleId: string | null
  role?: string
}

// ==================== 服务实现 ====================

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   * @param dto 登录参数（邮箱/手机号 + 密码）
   * @returns 登录响应（Token + 用户信息）
   */
  async login(dto: LoginDto): Promise<LoginResponse> {
    // 1. 查找用户（包含角色信息）
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
        deletedAt: null,
      },
      include: {
        roleRel: true,
      },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误')
    }

    // 3. 检查用户状态
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账户已被禁用')
    }

    // 4. 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // 5. 获取角色代码
    const roleCode = user.roleRel?.code || 'USER'

    // 6. 生成 Token
    const tokens = await this.generateTokens(user.id, roleCode)

    this.logger.log(`用户登录成功: ${user.email}, 角色: ${roleCode}`)

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        roleId: user.roleId || null,
        role: roleCode,
      },
    }
  }

  /**
   * 用户注册
   * @param dto 注册参数
   * @returns 登录响应（注册后自动登录）
   */
  async register(dto: RegisterDto): Promise<LoginResponse> {
    // 1. 检查邮箱是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existingUser) {
      throw new BadRequestException('邮箱已被注册')
    }

    // 2. 检查手机号是否已存在（如果提供）
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      })
      if (existingPhone) {
        throw new BadRequestException('手机号已被注册')
      }
    }

    // 3. 加密密码
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    // 4. 创建用户
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        name: dto.name,
      },
    })

    // 5. 生成 Token（新用户默认 USER 角色）
    const tokens = await this.generateTokens(user.id, 'USER')

    this.logger.log(`新用户注册成功: ${user.email}`)

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        roleId: null,
        role: 'USER',
      },
    }
  }

  /**
   * 刷新 Token
   * @param userId 用户ID
   * @returns 新的 Token 对
   */
  async refreshToken(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roleRel: true },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账户已被禁用')
    }

    const roleCode = user.roleRel?.code || 'USER'
    return this.generateTokens(user.id, roleCode)
  }

  /**
   * 获取当前用户信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  async getCurrentUser(userId: string): Promise<UserInfo> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roleRel: true },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      avatar: user.avatar,
      roleId: user.roleId || null,
      role: user.roleRel?.code || 'USER',
    }
  }

  /**
   * 修改密码
   * @param userId 用户ID
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('旧密码错误')
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    this.logger.log(`用户修改密码成功: ${user.email}`)
  }

  // ==================== 私有方法 ====================

  /**
   * 生成访问令牌和刷新令牌
   * @param userId 用户ID
   * @param role 角色代码（如 ADMIN, USER 等）
   */
  private async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '2h', // 访问令牌 2 小时有效
    })

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // 刷新令牌 7 天有效
    })

    return { accessToken, refreshToken }
  }
}
