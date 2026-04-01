/**
 * 角色控制器
 * 处理角色管理的 HTTP 请求
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { CreateRoleDto, UpdateRoleDto, UpdateRolePermissionsDto, RoleQueryDto } from './role.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { RoleStatus } from '@prisma/client'

@ApiTags('角色管理')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建角色
   * POST /roles
   */
  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: '创建角色', description: '创建新角色，需要管理员权限' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误或角色编码已存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto)
  }

  /**
   * 获取角色列表
   * GET /roles
   */
  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取角色列表', description: '分页查询角色列表' })
  @ApiQuery({ name: 'keyword', required: false, description: '搜索关键词（名称或编码）' })
  @ApiQuery({ name: 'status', required: false, enum: RoleStatus, description: '状态筛选' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: RoleQueryDto) {
    return this.roleService.findAll(query)
  }

  /**
   * 获取角色详情
   * GET /roles/:id
   */
  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取角色详情', description: '根据ID获取角色详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  async findOne(@Param('id') id: string) {
    return this.roleService.getDetail(id)
  }

  /**
   * 更新角色
   * PUT /roles/:id
   */
  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '更新角色', description: '更新角色信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto)
  }

  /**
   * 删除角色
   * DELETE /roles/:id
   */
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '删除角色', description: '软删除角色' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  async delete(@Param('id') id: string) {
    await this.roleService.delete(id)
    return { message: '删除成功' }
  }

  /**
   * 更新角色权限
   * PUT /roles/:id/permissions
   */
  @Put(':id/permissions')
  @Roles('ADMIN')
  @ApiOperation({ summary: '更新角色权限', description: '更新角色的权限列表' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async updatePermissions(@Param('id') id: string, @Body() dto: UpdateRolePermissionsDto) {
    return this.roleService.updatePermissions(id, dto)
  }

  /**
   * 获取角色权限
   * GET /roles/:id/permissions
   */
  @Get(':id/permissions')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取角色权限', description: '获取角色的权限列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '角色不存在' })
  async getPermissions(@Param('id') id: string) {
    return this.roleService.getPermissions(id)
  }
}
