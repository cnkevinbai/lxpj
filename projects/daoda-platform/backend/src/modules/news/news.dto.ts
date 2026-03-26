/**
 * 新闻模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator'
import { NewsStatus } from '@prisma/client'

/**
 * 创建新闻 DTO
 */
export class CreateNewsDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  title: string

  @ApiPropertyOptional({ description: '摘要' })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiProperty({ description: '内容（HTML）' })
  @IsString()
  content: string

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsOptional()
  @IsString()
  cover?: string

  @ApiPropertyOptional({ description: '作者' })
  @IsOptional()
  @IsString()
  author?: string

  @ApiPropertyOptional({ description: '状态', enum: NewsStatus, default: NewsStatus.DRAFT })
  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus
}

/**
 * 更新新闻 DTO
 */
export class UpdateNewsDto {
  @ApiPropertyOptional({ description: '标题' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: '摘要' })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiPropertyOptional({ description: '内容（HTML）' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsOptional()
  @IsString()
  cover?: string

  @ApiPropertyOptional({ description: '作者' })
  @IsOptional()
  @IsString()
  author?: string

  @ApiPropertyOptional({ description: '状态', enum: NewsStatus })
  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus
}

/**
 * 新闻查询 DTO
 */
export class NewsQueryDto {
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

  @ApiPropertyOptional({ description: '状态', enum: NewsStatus })
  @IsOptional()
  @IsEnum(NewsStatus)
  status?: NewsStatus
}

/**
 * 新闻列表响应接口
 */
export interface NewsListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
