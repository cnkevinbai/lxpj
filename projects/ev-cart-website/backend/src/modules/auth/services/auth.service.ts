import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SystemUser } from './entities/system-user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SystemUser)
    private userRepo: Repository<SystemUser>,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   */
  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['role'],
      select: ['id', 'username', 'email', 'realName', 'avatarUrl', 'department', 'position', 'roleId', 'isActive', 'lastLoginAt', 'passwordHash', 'role'],
    })

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('账户已被禁用')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date()
    await this.userRepo.save(user)

    const payload = { sub: user.id, username: user.username, role: user.role?.roleCode }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        realName: user.realName,
        avatarUrl: user.avatarUrl,
        department: user.department,
        position: user.position,
        role: user.role,
      },
    }
  }

  /**
   * 用户注册
   */
  async register(username: string, email: string, password: string, realName: string) {
    // 检查用户名是否存在
    const existingUser = await this.userRepo.findOne({ where: { username } })
    if (existingUser) {
      throw new ConflictException('用户名已存在')
    }

    // 检查邮箱是否存在
    const existingEmail = await this.userRepo.findOne({ where: { email } })
    if (existingEmail) {
      throw new ConflictException('邮箱已被使用')
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10)

    const user = this.userRepo.create({
      username,
      email,
      passwordHash,
      realName,
    })

    await this.userRepo.save(user)

    return { id: user.id, username: user.username, email: user.email }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role'],
      select: ['id', 'username', 'email', 'realName', 'avatarUrl', 'department', 'position', 'roleId', 'role'],
    })

    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    return user
  }

  /**
   * 验证 Token
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      return payload
    } catch (error) {
      throw new UnauthorizedException('Token 无效或已过期')
    }
  }
}
