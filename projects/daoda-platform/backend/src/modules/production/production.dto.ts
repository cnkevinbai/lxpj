/**
 * 生产模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min, Max, IsUUID } from 'class-validator'
import { ProductionStatus } from '@prisma/client'

/**
 * 创建生产单 DTO
 */
export class CreateProductionDto {
  @ApiPropertyOptional({ description: '生产计划 ID' })
  @IsOptional()
  @IsUUID()
  planId?: string

  @ApiProperty({ description: '产品 ID' })
  @IsUUID()
  productId: string

  @ApiProperty({ description: '计划生产数量' })
  @IsInt()
  @Min(1)
  quantity: number

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  startDate?: Date

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  endDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新生产单 DTO
 */
export class UpdateProductionDto {
  @ApiPropertyOptional({ description: '计划生产数量' })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  startDate?: Date

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  endDate?: Date

  @ApiPropertyOptional({ description: '生产状态', enum: ProductionStatus })
  @IsOptional()
  @IsEnum(ProductionStatus)
  status?: ProductionStatus

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 生产单查询 DTO
 */
export class ProductionQueryDto {
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

  @ApiPropertyOptional({ description: '搜索关键词（单号/产品名称）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '产品 ID' })
  @IsOptional()
  @IsUUID()
  productId?: string

  @ApiPropertyOptional({ description: '生产状态', enum: ProductionStatus })
  @IsOptional()
  @IsEnum(ProductionStatus)
  status?: ProductionStatus
}

/**
 * 开始生产 DTO
 */
export class StartProductionDto {
  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  startDate?: Date
}

/**
 * 完成生产 DTO
 */
export class CompleteProductionDto {
  @ApiPropertyOptional({ description: '完成数量' })
  @IsOptional()
  @IsInt()
  @Min(1)
  completedQty?: number

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  endDate?: Date
}

/**
 * 生产单列表响应接口
 */
export interface ProductionListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
