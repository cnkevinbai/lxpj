/**
 * BOM 模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator'

export type BomStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE'

export class CreateBomDto {
  @ApiProperty({ description: 'BOM 编号' })
  @IsString()
  bomNo: string

  @ApiProperty({ description: '产品 ID' })
  @IsUUID()
  productId: string

  @ApiPropertyOptional({ description: '版本号', default: '1.0' })
  @IsOptional()
  @IsString()
  version?: string = '1.0'

  @ApiPropertyOptional({ description: '状态', enum: ['DRAFT', 'ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  @IsOptional()
  status?: BomStatus = 'ACTIVE'

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdateBomDto {
  @ApiPropertyOptional({ description: 'BOM 编号' })
  @IsOptional()
  @IsString()
  bomNo?: string

  @ApiPropertyOptional({ description: '产品 ID' })
  @IsOptional()
  @IsUUID()
  productId?: string

  @ApiPropertyOptional({ description: '版本号' })
  @IsOptional()
  @IsString()
  version?: string

  @ApiPropertyOptional({ description: '状态', enum: ['DRAFT', 'ACTIVE', 'INACTIVE'] })
  @IsOptional()
  status?: BomStatus

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class CreateBomItemDto {
  @ApiProperty({ description: '产品 ID (物料)' })
  @IsUUID()
  productId: string

  @ApiPropertyOptional({ description: '物料 ID (可选，用于引用其他 BOM)' })
  @IsOptional()
  @IsUUID()
  materialId?: string

  @ApiProperty({ description: '数量' })
  @IsNumber()
  quantity: number

  @ApiPropertyOptional({ description: '单位' })
  @IsOptional()
  @IsString()
  unit?: string

  @ApiPropertyOptional({ description: '损耗率 (%)', example: 5.0 })
  @IsOptional()
  @IsNumber()
  scrapRate?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdateBomItemDto {
  @ApiPropertyOptional({ description: '数量' })
  @IsOptional()
  @IsNumber()
  quantity?: number

  @ApiPropertyOptional({ description: '单位' })
  @IsOptional()
  @IsString()
  unit?: string

  @ApiPropertyOptional({ description: '损耗率 (%)' })
  @IsOptional()
  @IsNumber()
  scrapRate?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class BomQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  pageSize?: number = 10

  @ApiPropertyOptional({ description: 'BOM 编号' })
  @IsOptional()
  @IsString()
  bomNo?: string

  @ApiPropertyOptional({ description: '产品 ID' })
  @IsOptional()
  @IsUUID()
  productId?: string

  @ApiPropertyOptional({ description: '状态', enum: ['DRAFT', 'ACTIVE', 'INACTIVE'] })
  @IsOptional()
  status?: BomStatus
}

export interface BomListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
