/**
 * 案例模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator'
import { CaseStatus } from '@prisma/client'

/**
 * 创建案例 DTO
 */
export class CreateCaseDto {
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

  @ApiPropertyOptional({ description: '图片列表（逗号分隔）' })
  @IsOptional()
  @IsString()
  images?: string

  @ApiPropertyOptional({ description: '类型' })
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional({ description: '状态', enum: CaseStatus, default: CaseStatus.DRAFT })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus
}

/**
 * 更新案例 DTO
 */
export class UpdateCaseDto {
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

  @ApiPropertyOptional({ description: '图片列表（逗号分隔）' })
  @IsOptional()
  @IsString()
  images?: string

  @ApiPropertyOptional({ description: '类型' })
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional({ description: '状态', enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus
}

/**
 * 案例查询 DTO
 */
export class CaseQueryDto {
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

  @ApiPropertyOptional({ description: '类型' })
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional({ description: '状态', enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus
}

/**
 * 案例列表响应接口
 */
export interface CaseListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
