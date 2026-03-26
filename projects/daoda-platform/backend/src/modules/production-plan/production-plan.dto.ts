/**
 * 生产计划模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber, IsUUID, IsDate } from 'class-validator'

export type PlanStatus = 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export class CreateProductionPlanDto {
  @ApiProperty({ description: '计划编号' })
  @IsString()
  planNo: string

  @ApiProperty({ description: '产品 ID' })
  @IsUUID()
  productId: string

  @ApiProperty({ description: '数量' })
  @IsNumber()
  quantity: number

  @ApiPropertyOptional({ description: '计划状态', enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'PLANNED' })
  @IsOptional()
  status?: string = 'PLANNED'

  @ApiProperty({ description: '开始日期' })
  @IsDate()
  startDate: Date

  @ApiProperty({ description: '结束日期' })
  @IsDate()
  endDate: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdateProductionPlanDto {
  @ApiPropertyOptional({ description: '计划编号' })
  @IsOptional()
  @IsString()
  planNo?: string

  @ApiPropertyOptional({ description: '产品 ID' })
  @IsOptional()
  @IsUUID()
  productId?: string

  @ApiPropertyOptional({ description: '数量' })
  @IsOptional()
  @IsNumber()
  quantity?: number

  @ApiPropertyOptional({ description: '计划状态', enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  status?: string

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsDate()
  startDate?: Date

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsDate()
  endDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class CreateProductionPlanItemDto {
  @ApiProperty({ description: '产品 ID' })
  @IsUUID()
  productId: string

  @ApiProperty({ description: '数量' })
  @IsNumber()
  quantity: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdateProductionPlanItemDto {
  @ApiPropertyOptional({ description: '数量' })
  @IsOptional()
  @IsNumber()
  quantity?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class ProductionPlanQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  pageSize?: number = 10

  @ApiPropertyOptional({ description: '计划编号' })
  @IsOptional()
  @IsString()
  planNo?: string

  @ApiPropertyOptional({ description: '计划状态', enum: ['DRAFT', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  status?: PlanStatus

  @ApiPropertyOptional({ description: '开始日期范围 (开始)' })
  @IsOptional()
  startDateStart?: Date

  @ApiPropertyOptional({ description: '开始日期范围 (结束)' })
  @IsOptional()
  startDateEnd?: Date
}

export interface ProductionPlanListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
