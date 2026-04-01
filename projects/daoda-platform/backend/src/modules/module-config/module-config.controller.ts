import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { ModuleConfigService } from './module-config.service'
import {
  CreateModuleConfigDto,
  UpdateModuleConfigDto,
  ModuleConfigQueryDto,
} from './module-config.dto'

@ApiTags('模块配置')
@Controller('module-configs')
@ApiBearerAuth()
export class ModuleConfigController {
  constructor(private readonly moduleConfigService: ModuleConfigService) {}

  /**
   * 获取所有模块配置
   * GET /module-configs
   */
  @Get()
  @ApiOperation({ summary: '获取所有模块配置', description: '查询所有模块配置，支持启用状态筛选' })
  @ApiQuery({ name: 'enabled', required: false, description: '启用状态筛选' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async findAll(@Query() query: ModuleConfigQueryDto) {
    return this.moduleConfigService.findAll(query)
  }

  /**
   * 获取所有启用的模块
   * GET /module-configs/enabled
   */
  @Get('enabled')
  @ApiOperation({ summary: '获取启用的模块', description: '只返回已启用的模块配置' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getEnabledModules() {
    return this.moduleConfigService.getEnabledModules()
  }

  /**
   * 根据模块代码获取配置
   * GET /module-configs/:code
   */
  @Get(':code')
  @ApiOperation({ summary: '获取模块配置详情', description: '根据模块代码获取配置' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '模块配置不存在' })
  async findByCode(@Param('code') code: string) {
    return this.moduleConfigService.findByCode(code)
  }

  /**
   * 创建模块配置
   * POST /module-configs
   */
  @Post()
  @ApiOperation({ summary: '创建模块配置', description: '添加新的模块配置' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 409, description: '模块已存在' })
  async create(@Body() dto: CreateModuleConfigDto) {
    return this.moduleConfigService.create(dto)
  }

  /**
   * 更新模块配置
   * PUT /module-configs/:code
   */
  @Put(':code')
  @ApiOperation({ summary: '更新模块配置', description: '更新模块配置信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '模块配置不存在' })
  async update(@Param('code') code: string, @Body() dto: UpdateModuleConfigDto) {
    return this.moduleConfigService.update(code, dto)
  }

  /**
   * 切换模块启用状态
   * PUT /module-configs/:code/toggle
   */
  @Put(':code/toggle')
  @ApiOperation({ summary: '切换模块启用状态', description: '启用或禁用指定模块' })
  @ApiResponse({ status: 200, description: '切换成功' })
  @ApiResponse({ status: 404, description: '模块配置不存在' })
  async toggle(@Param('code') code: string) {
    return this.moduleConfigService.toggle(code, true)
  }

  /**
   * 更新模块配置（部分更新）
   * PATCH /module-configs/:code
   */
  @Put(':code')
  @ApiOperation({ summary: '部分更新模块配置', description: '更新模块配置的指定字段' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '模块配置不存在' })
  async patch(@Param('code') code: string, @Body() dto: UpdateModuleConfigDto) {
    return this.moduleConfigService.update(code, dto)
  }

  /**
   * 删除模块配置
   * DELETE /module-configs/:code
   */
  @Delete(':code')
  @ApiOperation({ summary: '删除模块配置', description: '删除模块配置' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '模块配置不存在' })
  async delete(@Param('code') code: string) {
    return this.moduleConfigService.delete(code)
  }
}
