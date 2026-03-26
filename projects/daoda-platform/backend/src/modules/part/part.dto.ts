/**
 * 配件管理模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, IsInt, Min, Max } from 'class-validator'
import { PartStatus, PartLogType } from '@prisma/client'

export class CreatePartDto {
  @ApiProperty({ description: '配件编号' })
  @IsString()
  partNo: string

  @ApiProperty({ description: '配件名称' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '分类' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ description: '规格' })
  @IsOptional()
  @IsString()
  specification?: string

  @ApiPropertyOptional({ description: '单位' })
  @IsOptional()
  @IsString()
  unit?: string

  @ApiPropertyOptional({ description: '单价' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiPropertyOptional({ description: '成本' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number

  @ApiPropertyOptional({ description: '库存数量', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number

  @ApiPropertyOptional({ description: '最低库存' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number

  @ApiPropertyOptional({ description: '状态', enum: PartStatus, default: PartStatus.ACTIVE })
  @IsOptional()
  @IsEnum(PartStatus)
  status?: PartStatus

  @ApiPropertyOptional({ description: '供应商' })
  @IsOptional()
  @IsString()
  supplier?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdatePartDto {
  @ApiPropertyOptional({ description: '配件编号' })
  @IsOptional()
  @IsString()
  partNo?: string

  @ApiPropertyOptional({ description: '配件名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '分类' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ description: '规格' })
  @IsOptional()
  @IsString()
  specification?: string

  @ApiPropertyOptional({ description: '单位' })
  @IsOptional()
  @IsString()
  unit?: string

  @ApiPropertyOptional({ description: '单价' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiPropertyOptional({ description: '成本' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number

  @ApiPropertyOptional({ description: '库存数量' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number

  @ApiPropertyOptional({ description: '最低库存' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number

  @ApiPropertyOptional({ description: '状态', enum: PartStatus })
  @IsOptional()
  @IsEnum(PartStatus)
  status?: PartStatus

  @ApiPropertyOptional({ description: '供应商' })
  @IsOptional()
  @IsString()
  supplier?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class PartQueryDto {
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

  @ApiPropertyOptional({ description: '分类' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ description: '状态', enum: PartStatus })
  @IsOptional()
  @IsEnum(PartStatus)
  status?: PartStatus

  @ApiPropertyOptional({ description: '供应商' })
  @IsOptional()
  @IsString()
  supplier?: string

  @ApiPropertyOptional({ description: '最低库存' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock?: number
}

export class PartListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

export class PartInventoryDto {
  @ApiProperty({ description: '操作类型' })
  @IsEnum(PartLogType)
  type: PartLogType

  @ApiProperty({ description: '操作数量' })
  @IsNumber()
  @Min(0)
  qty: number

  @ApiPropertyOptional({ description: '原因' })
  @IsOptional()
  @IsString()
  reason?: string

  @ApiPropertyOptional({ description: '参考类型' })
  @IsOptional()
  @IsString()
  refType?: string

  @ApiPropertyOptional({ description: '参考ID' })
  @IsOptional()
  @IsString()
  refId?: string
}

export class PartCategoryStats {
  category: string
  count: number
}

export class PartStatusStats {
  status: PartStatus
  count: number
}

export class PartSummary {
  totalParts: number
  totalValue: number
  lowStockCount: number
  outOfStockCount: number
  byCategory: PartCategoryStats[]
  byStatus: PartStatusStats[]
}
