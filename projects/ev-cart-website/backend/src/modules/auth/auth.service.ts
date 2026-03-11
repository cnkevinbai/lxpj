import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../user/entities/user.entity'
import { LoginDto, RegisterDto } from './dto/auth.dto'

/**
 * 认证服务
 * 支持部门自动判定
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 用户登录
   * 根据用户部门返回不同的业务类型
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date()
    await this.userRepository.save(user)

    // 根据部门确定业务类型
    const businessType = user.department === 'foreign' ? 'foreign' : 'domestic'

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      businessType, // 自动判定业务类型
      avatarUrl: user.avatarUrl,
    }
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      businessType: user.businessType,
    }

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '2h'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '7d'),
      }),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        businessType: user.businessType,
        avatarUrl: user.avatarUrl,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
    })

    if (existing) {
      throw new ConflictException('User already exists')
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10)
    const user = await this.userRepository.save({
      ...registerDto,
      passwordHash,
      department: registerDto.department || 'domestic', // 默认内贸
    })

    return this.login({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      department: user.department,
      businessType: user.department === 'foreign' ? 'foreign' : 'domestic',
    })
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.userRepository.findOne({ where: { id: payload.sub } })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return this.login({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        businessType: user.department === 'foreign' ? 'foreign' : 'domestic',
      })
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
