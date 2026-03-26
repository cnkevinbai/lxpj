import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto) {
    // 检查邮箱是否已存在
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingEmail) {
      throw new BadRequestException('邮箱已被注册');
    }

    // 检查用户名是否已存在
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUsername) {
      throw new BadRequestException('用户名已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        name: registerDto.name,
        phone: registerDto.phone,
        role: registerDto.role as any || 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
      },
    });

    return user;
  }

  /**
   * 验证用户
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
      throw new UnauthorizedException('用户不存在');
    }

    return user;
  }
}
