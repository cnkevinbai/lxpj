import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'

@ApiTags('认证授权')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password)
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  register(@Body() body: { username: string; email: string; password: string; realName: string }) {
    return this.authService.register(body.username, body.email, body.password, body.realName)
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@Request() req: any) {
    return this.authService.getCurrentUser(req.user.userId)
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  logout(@Request() req: any) {
    // 这里可以将 token 加入黑名单
    return { message: '登出成功' }
  }
}
