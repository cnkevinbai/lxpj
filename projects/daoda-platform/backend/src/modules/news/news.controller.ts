/**
 * 新闻模块 Controller
 * 提供新闻管理的 RESTful API 接口
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
import { NewsService } from './news.service'
import { CreateNewsDto, UpdateNewsDto, NewsQueryDto } from './news.dto'

@ApiTags('新闻管理')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * 创建新闻
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建新闻' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto)
  }

  /**
   * 获取新闻列表
   */
  @Get()
  @ApiOperation({ summary: '获取新闻列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: NewsQueryDto) {
    return this.newsService.findAll(query)
  }

  /**
   * 根据 ID 获取新闻详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取新闻详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '新闻不存在' })
  async findOne(@Param('id') id: string) {
    // 增加浏览量
    this.newsService.incrementViews(id).catch(() => {})
    return this.newsService.findOne(id)
  }

  /**
   * 更新新闻
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新新闻' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '新闻不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto)
  }

  /**
   * 发布新闻
   */
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布新闻' })
  @ApiResponse({ status: 200, description: '发布成功' })
  @ApiResponse({ status: 404, description: '新闻不存在' })
  publish(@Param('id') id: string) {
    return this.newsService.publish(id)
  }

  /**
   * 归档新闻
   */
  @Post(':id/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '归档新闻' })
  @ApiResponse({ status: 200, description: '归档成功' })
  @ApiResponse({ status: 404, description: '新闻不存在' })
  archive(@Param('id') id: string) {
    return this.newsService.archive(id)
  }

  /**
   * 删除新闻
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除新闻' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '新闻不存在' })
  delete(@Param('id') id: string) {
    return this.newsService.delete(id)
  }
}
