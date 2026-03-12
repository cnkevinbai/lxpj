import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  private users: any[] = [
    { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
    { id: '2', username: 'user', password: 'user123', role: 'user' },
  ]

  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    )
    if (user) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user,
    }
  }
}
