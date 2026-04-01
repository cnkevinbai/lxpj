/**
 * 用户控制器
 * 处理用户管理的 HTTP 请求
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { UserService, CreateUserDto, UpdateUserDto, UserQueryDto } from './user.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserStatus } from '@prisma/client'

@ApiTags('用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   * POST /users
   */
  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: '创建用户', description: '管理员创建新用户' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  /**
   * 获取用户列表
   * GET /users
   */
  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取用户列表', description: '分页查询用户列表' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'keyword', required: false, description: '搜索关键词' })
  @ApiQuery({ name: 'role', required: false, description: '角色筛选' })
  @ApiQuery({ name: 'status', required: false, description: '状态筛选' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: UserQueryDto) {
    return this.userService.findAll(query)
  }

  /**
   * 获取用户详情
   * GET /users/:id
   */
  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取用户详情', description: '根据ID获取用户详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  /**
   * 更新用户
   * PUT /users/:id
   */
  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '更新用户', description: '更新用户信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto)
  }

  /**
   * 删除用户
   * DELETE /users/:id
   */
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '删除用户', description: '软删除用户' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async delete(@Param('id') id: string) {
    await this.userService.delete(id)
    return { message: '删除成功' }
  }

  /**
   * 批量更新用户状态
   * POST /users/batch/status
   */
  @Post('batch/status')
  @Roles('ADMIN')
  @ApiOperation({ summary: '批量更新状态', description: '批量更新用户状态' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async batchUpdateStatus(@Body() body: { ids: string[]; status: UserStatus }) {
    const count = await this.userService.batchUpdateStatus(body.ids, body.status)
    return { message: `成功更新 ${count} 条记录` }
  }

  /**
   * 重置用户密码
   * POST /users/:id/reset-password
   */
  @Post(':id/reset-password')
  @Roles('ADMIN')
  @ApiOperation({ summary: '重置密码', description: '重置用户密码' })
  @ApiResponse({ status: 200, description: '重置成功' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async resetPassword(@Param('id') id: string, @Body() body: { newPassword: string }) {
    await this.userService.resetPassword(id, body.newPassword)
    return { message: '密码重置成功' }
  }
}
