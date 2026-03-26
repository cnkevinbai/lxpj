/**
 * 认证控制器
 * 处理登录、注册、刷新令牌等 HTTP 请求
 */
import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { AuthService, LoginDto, RegisterDto, LoginResponse, UserInfo } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录', description: '使用邮箱/手机号和密码登录' })
  @ApiResponse({ status: 200, description: '登录成功', type: Object })
  @ApiResponse({ status: 401, description: '认证失败' })
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto)
  }

  /**
   * 用户注册
   * POST /auth/register
   */
  @Post('register')
  @ApiOperation({ summary: '用户注册', description: '注册新用户账号' })
  @ApiResponse({ status: 201, description: '注册成功', type: Object })
  @ApiResponse({ status: 400, description: '参数错误或邮箱已存在' })
  async register(@Body() dto: RegisterDto): Promise<LoginResponse> {
    return this.authService.register(dto)
  }

  /**
   * 刷新令牌
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '刷新令牌', description: '使用当前令牌获取新的令牌' })
  @ApiResponse({ status: 200, description: '刷新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async refreshToken(@Request() req: any) {
    return this.authService.refreshToken(req.user.sub)
  }

  /**
   * 获取当前用户信息
   * GET /auth/me
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户', description: '获取当前登录用户的详细信息' })
  @ApiResponse({ status: 200, description: '成功', type: Object })
  @ApiResponse({ status: 401, description: '未授权' })
  async getCurrentUser(@Request() req: any): Promise<UserInfo> {
    return this.authService.getCurrentUser(req.user.sub)
  }

  /**
   * 修改密码
   * POST /auth/change-password
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '修改密码', description: '修改当前用户密码' })
  @ApiResponse({ status: 200, description: '修改成功' })
  @ApiResponse({ status: 401, description: '旧密码错误或未授权' })
  async changePassword(
    @Request() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    await this.authService.changePassword(
      req.user.sub,
      body.oldPassword,
      body.newPassword,
    )
    return { message: '密码修改成功' }
  }

  /**
   * 登出（前端清除 Token 即可，后端无状态）
   * POST /auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '登出', description: '用户登出（前端清除 Token）' })
  @ApiResponse({ status: 200, description: '登出成功' })
  async logout(): Promise<{ message: string }> {
    // JWT 无状态，前端清除 Token 即可
    return { message: '登出成功' }
  }
}