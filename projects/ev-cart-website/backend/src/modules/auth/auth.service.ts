import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../user/entities/user.entity'
import { LoginDto, RegisterDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } })
    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return null
    }

    return user
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    }
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.repository.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
    })

    if (existing) {
      throw new ConflictException('User already exists')
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10)
    const user = await this.repository.save({
      ...registerDto,
      passwordHash,
    })

    return this.login(user)
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.repository.findOne({ where: { id: payload.sub } })
      
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return this.login(user)
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
