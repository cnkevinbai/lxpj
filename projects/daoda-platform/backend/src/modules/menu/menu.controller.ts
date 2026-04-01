/**
 * 菜单控制器
 * 处理菜单管理的 HTTP 请求
 */
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { MenuService } from './menu.service'
import { CreateMenuDto, UpdateMenuDto, MenuQueryDto } from './menu.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { MenuStatus } from '@prisma/client'

@ApiTags('菜单管理')
@Controller('menus')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 创建菜单
   * POST /menus
   */
  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: '创建菜单', description: '创建新菜单，需要管理员权限' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误或父菜单不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  async create(@Body() dto: CreateMenuDto) {
    return this.menuService.create(dto)
  }

  /**
   * 获取菜单树
   * GET /menus
   */
  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取菜单树', description: '获取菜单树形结构' })
  @ApiQuery({ name: 'status', required: false, enum: MenuStatus, description: '状态筛选' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findTree(@Query() query?: MenuQueryDto) {
    return this.menuService.getTree()
  }

  /**
   * 获取菜单列表
   * GET /menus/list
   */
  @Get('list')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取菜单列表', description: '获取平铺的菜单列表' })
  @ApiQuery({ name: 'status', required: false, enum: MenuStatus, description: '状态筛选' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: MenuQueryDto) {
    return this.menuService.findAll(query || {})
  }

  /**
   * 获取菜单详情
   * GET /menus/:id
   */
  @Get(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: '获取菜单详情', description: '根据ID获取菜单详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  async findOne(@Param('id') id: string) {
    return this.menuService.findOne(id)
  }

  /**
   * 更新菜单
   * PUT /menus/:id
   */
  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '更新菜单', description: '更新菜单信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  @ApiResponse({ status: 400, description: '参数错误' })
  async update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menuService.update(id, dto)
  }

  /**
   * 删除菜单
   * DELETE /menus/:id
   */
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: '删除菜单', description: '软删除菜单，需先删除子菜单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '菜单不存在' })
  @ApiResponse({ status: 400, description: '有子菜单，无法删除' })
  async delete(@Param('id') id: string) {
    await this.menuService.delete(id)
    return { message: '删除成功' }
  }
}
