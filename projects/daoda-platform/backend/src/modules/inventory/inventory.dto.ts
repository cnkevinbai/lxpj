/**
 * 库存模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, Min, Max, IsUUID } from 'class-validator'
import { InventoryLogType } from '@prisma/client'

/**
 * 创建库存记录 DTO
 */
export class CreateInventoryDto {
  @ApiProperty({ description: '产品 ID' })
  @IsUUID()
  productId: string

  @ApiPropertyOptional({ description: '仓库', example: 'default' })
  @IsOptional()
  @IsString()
  warehouse?: string = 'default'

  @ApiPropertyOptional({ description: '初始库存数量', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number = 0

  @ApiPropertyOptional({ description: '预警库存数量', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  warningQty?: number = 10

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新库存 DTO
 */
export class UpdateInventoryDto {
  @ApiPropertyOptional({ description: '仓库' })
  @IsOptional()
  @IsString()
  warehouse?: string

  @ApiPropertyOptional({ description: '库存数量' })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number

  @ApiPropertyOptional({ description: '预警库存数量' })
  @IsOptional()
  @IsInt()
  @Min(0)
  warningQty?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 库存查询 DTO
 */
export class InventoryQueryDto {
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

  @ApiPropertyOptional({ description: '搜索关键词（产品名称/编码）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '产品 ID' })
  @IsOptional()
  @IsUUID()
  productId?: string

  @ApiPropertyOptional({ description: '仓库' })
  @IsOptional()
  @IsString()
  warehouse?: string

  @ApiPropertyOptional({ description: '产品分类' })
  @IsOptional()
  @IsString()
  category?: string
}

/**
 * 库存变动 DTO（入库/出库/调整）
 */
export class InventoryChangeDto {
  @ApiProperty({ description: '库存 ID' })
  @IsUUID()
  inventoryId: string

  @ApiProperty({ description: '变动类型', enum: InventoryLogType })
  @IsEnum(InventoryLogType)
  type: InventoryLogType

  @ApiProperty({ description: '变动数量（正数）' })
  @IsInt()
  @Min(1)
  quantity: number

  @ApiProperty({ description: '变动原因' })
  @IsString()
  reason: string

  @ApiPropertyOptional({ description: '关联类型（采购/生产/销售等）' })
  @IsOptional()
  @IsString()
  refType?: string

  @ApiPropertyOptional({ description: '关联 ID' })
  @IsOptional()
  @IsString()
  refId?: string
}

/**
 * 库存日志查询 DTO
 */
export class InventoryLogQueryDto {
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

  @ApiPropertyOptional({ description: '变动类型', enum: InventoryLogType })
  @IsOptional()
  @IsEnum(InventoryLogType)
  type?: InventoryLogType

  @ApiPropertyOptional({ description: '库存 ID' })
  @IsOptional()
  @IsUUID()
  inventoryId?: string
}

/**
 * 库存列表响应接口
 */
export interface InventoryListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

/**
 * 库存日志列表响应接口
 */
export interface InventoryLogListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
