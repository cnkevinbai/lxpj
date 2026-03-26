/**
 * 系统配置模块 Controller
 * 提供系统配置管理的 RESTful API 接口
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { SystemConfigService } from './system-config.service'
import { CreateSystemConfigDto, UpdateSystemConfigDto, SystemConfigQueryDto } from './system-config.dto'

@ApiTags('系统配置管理')
@Controller('system-configs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  /**
   * 创建系统配置
   */
  @Post()
  @ApiOperation({ summary: '创建系统配置' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '配置键已存在' })
  create(@Body() dto: CreateSystemConfigDto) {
    return this.systemConfigService.create(dto)
  }

  /**
   * 获取系统配置列表
   */
  @Get()
  @ApiOperation({ summary: '获取系统配置列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: SystemConfigQueryDto) {
    return this.systemConfigService.findAll(query)
  }

  /**
   * 根据 ID 获取系统配置详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取系统配置详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '系统配置不存在' })
  findOne(@Param('id') id: string) {
    return this.systemConfigService.findOne(id)
  }

  /**
   * 根据键获取系统配置
   */
  @Get('key/:key')
  @ApiOperation({ summary: '根据键获取系统配置' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '系统配置不存在' })
  findByKey(@Param('key') key: string) {
    return this.systemConfigService.findByKey(key)
  }

  /**
   * 获取配置值
   */
  @Get('key/:key/value')
  @ApiOperation({ summary: '获取配置值' })
  @ApiResponse({ status: 200, description: '查询成功' })
  async getValue(@Param('key') key: string) {
    const value = await this.systemConfigService.getValue(key)
    return { key, value }
  }

  /**
   * 更新系统配置
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新系统配置' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '系统配置不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateSystemConfigDto) {
    return this.systemConfigService.update(id, dto)
  }

  /**
   * 更新配置值
   */
  @Patch('key/:key')
  @ApiOperation({ summary: '更新配置值' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '系统配置不存在' })
  updateValue(@Param('key') key: string, @Body() body: { value: string }) {
    return this.systemConfigService.updateValue(key, body.value)
  }

  /**
   * 根据分组获取配置
   */
  @Get('group/:group')
  @ApiOperation({ summary: '根据分组获取配置' })
  @ApiResponse({ status: 200, description: '查询成功' })
  getByGroup(@Param('group') group: string) {
    return this.systemConfigService.getByGroup(group)
  }

  /**
   * 删除系统配置
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除系统配置' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '系统配置不存在' })
  delete(@Param('id') id: string) {
    return this.systemConfigService.delete(id)
  }
}
