/**
 * 案例模块 Controller
 * 提供案例管理的 RESTful API 接口
 */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CaseService } from './case.service'
import { CreateCaseDto, UpdateCaseDto, CaseQueryDto } from './case.dto'

@ApiTags('案例管理')
@Controller('case')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  /**
   * 创建案例
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建案例' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() dto: CreateCaseDto) {
    return this.caseService.create(dto)
  }

  /**
   * 获取案例列表
   */
  @Get()
  @ApiOperation({ summary: '获取案例列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: CaseQueryDto) {
    return this.caseService.findAll(query)
  }

  /**
   * 根据 ID 获取案例详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取案例详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  async findOne(@Param('id') id: string) {
    // 增加浏览量
    this.caseService.incrementViews(id).catch(() => {})
    return this.caseService.findOne(id)
  }

  /**
   * 更新案例
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新案例' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateCaseDto) {
    return this.caseService.update(id, dto)
  }

  /**
   * 发布案例
   */
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布案例' })
  @ApiResponse({ status: 200, description: '发布成功' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  publish(@Param('id') id: string) {
    return this.caseService.publish(id)
  }

  /**
   * 归档案例
   */
  @Post(':id/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '归档案例' })
  @ApiResponse({ status: 200, description: '归档成功' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  archive(@Param('id') id: string) {
    return this.caseService.archive(id)
  }

  /**
   * 删除案例
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除案例' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '案例不存在' })
  delete(@Param('id') id: string) {
    return this.caseService.delete(id)
  }
}
