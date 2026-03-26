/**
 * 视频模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator'
import { VideoSource, VideoStatus } from '@prisma/client'

/**
 * 创建视频 DTO
 */
export class CreateVideoDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string

  @ApiPropertyOptional({ description: '摘要' })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({ description: '视频 URL' })
  @IsString()
  url: string

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsOptional()
  @IsString()
  cover?: string

  @ApiPropertyOptional({ description: '时长（秒）' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number

  @ApiPropertyOptional({ description: '来源', enum: VideoSource, default: VideoSource.LOCAL })
  @IsOptional()
  @IsEnum(VideoSource)
  source?: VideoSource

  @ApiPropertyOptional({ description: '状态', enum: VideoStatus, default: VideoStatus.DRAFT })
  @IsOptional()
  @IsEnum(VideoStatus)
  status?: VideoStatus
}

/**
 * 更新视频 DTO
 */
export class UpdateVideoDto {
  @ApiPropertyOptional({ description: '标题' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: '摘要' })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiPropertyOptional({ description: '视频 URL' })
  @IsOptional()
  @IsString()
  url?: string

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsOptional()
  @IsString()
  cover?: string

  @ApiPropertyOptional({ description: '时长（秒）' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number

  @ApiPropertyOptional({ description: '来源', enum: VideoSource })
  @IsOptional()
  @IsEnum(VideoSource)
  source?: VideoSource

  @ApiPropertyOptional({ description: '状态', enum: VideoStatus })
  @IsOptional()
  @IsEnum(VideoStatus)
  status?: VideoStatus
}

/**
 * 视频查询 DTO
 */
export class VideoQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '来源', enum: VideoSource })
  @IsOptional()
  @IsEnum(VideoSource)
  source?: VideoSource

  @ApiPropertyOptional({ description: '状态', enum: VideoStatus })
  @IsOptional()
  @IsEnum(VideoStatus)
  status?: VideoStatus
}

/**
 * 视频列表响应接口
 */
export interface VideoListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
