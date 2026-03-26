import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './services/auth.service'
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '用户登录' })
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user)
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新 Token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken)
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  async logout(@Request() req) {
    // TODO: 将 token 加入黑名单
    return { message: 'Logout successful' }
  }
}
