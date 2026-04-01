/**
 * JWT 认证策略
 * 用于验证和解析 JWT Token
 */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma/prisma.service'

/**
 * JWT Payload 接口
 */
export interface JwtPayload {
  sub: string // 用户 ID
  role: string // 用户角色代码
  iat?: number // 签发时间
  exp?: number // 过期时间
}

/**
 * JWT 策略实现
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // 从 Authorization Header 提取 Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 不忽略过期时间
      ignoreExpiration: false,
      // JWT 密钥
      secretOrKey: configService.get<string>('JWT_SECRET') || 'daoda-platform-secret-key-2026',
    })
  }

  /**
   * 验证 JWT Payload
   * 返回值会被注入到 Request.user 中
   */
  async validate(payload: JwtPayload): Promise<{ sub: string; role: string }> {
    // 验证用户是否存在且未被删除
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, status: true, deletedAt: true },
    })

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('用户不存在')
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('账户已被禁用')
    }

    // 返回用户信息，注入到 Request.user
    return {
      sub: payload.sub,
      role: payload.role || 'USER',
    }
  }
}
