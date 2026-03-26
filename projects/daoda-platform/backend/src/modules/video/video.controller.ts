/**
 * 视频模块 Controller
 * 提供视频管理的 RESTful API 接口
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
import { VideoService } from './video.service'
import { CreateVideoDto, UpdateVideoDto, VideoQueryDto } from './video.dto'

@ApiTags('视频管理')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  /**
   * 创建视频
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建视频' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  create(@Body() dto: CreateVideoDto) {
    return this.videoService.create(dto)
  }

  /**
   * 获取视频列表
   */
  @Get()
  @ApiOperation({ summary: '获取视频列表' })
  @ApiResponse({ status: 200, description: '查询成功' })
  findAll(@Query() query: VideoQueryDto) {
    return this.videoService.findAll(query)
  }

  /**
   * 根据 ID 获取视频详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取视频详情' })
  @ApiResponse({ status: 200, description: '查询成功' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  async findOne(@Param('id') id: string) {
    // 增加浏览量
    this.videoService.incrementViews(id).catch(() => {})
    return this.videoService.findOne(id)
  }

  /**
   * 更新视频
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新视频' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  update(@Param('id') id: string, @Body() dto: UpdateVideoDto) {
    return this.videoService.update(id, dto)
  }

  /**
   * 发布视频
   */
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布视频' })
  @ApiResponse({ status: 200, description: '发布成功' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  publish(@Param('id') id: string) {
    return this.videoService.publish(id)
  }

  /**
   * 归档视频
   */
  @Post(':id/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '归档视频' })
  @ApiResponse({ status: 200, description: '归档成功' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  archive(@Param('id') id: string) {
    return this.videoService.archive(id)
  }

  /**
   * 删除视频
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除视频' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '视频不存在' })
  delete(@Param('id') id: string) {
    return this.videoService.delete(id)
  }
}
