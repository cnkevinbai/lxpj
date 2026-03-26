/**
 * 采购模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min, Max, IsArray, ValidateNested } from 'class-validator'
import { PurchaseStatus, PaymentStatus } from '@prisma/client'
import { Type } from 'class-transformer'

/**
 * 采购项 DTO
 */
export class PurchaseItemDto {
  @ApiProperty({ description: '产品 ID' })
  @IsString()
  productId: string

  @ApiProperty({ description: '产品名称' })
  @IsString()
  productName: string

  @ApiProperty({ description: '采购数量' })
  @IsInt()
  @Min(1)
  quantity: number

  @ApiProperty({ description: '单价' })
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 创建采购单 DTO
 */
export class CreatePurchaseDto {
  @ApiPropertyOptional({ description: '供应商 ID' })
  @IsOptional()
  @IsString()
  supplierId?: string

  @ApiProperty({ description: '供应商名称' })
  @IsString()
  supplierName: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ description: '采购项列表', type: [PurchaseItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[]

  @ApiPropertyOptional({ description: '预计到货日期' })
  @IsOptional()
  expectedDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新采购单 DTO
 */
export class UpdatePurchaseDto {
  @ApiPropertyOptional({ description: '供应商 ID' })
  @IsOptional()
  @IsString()
  supplierId?: string

  @ApiPropertyOptional({ description: '供应商名称' })
  @IsOptional()
  @IsString()
  supplierName?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: '采购状态', enum: PurchaseStatus })
  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus

  @ApiPropertyOptional({ description: '已付金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number

  @ApiPropertyOptional({ description: '付款状态', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @ApiPropertyOptional({ description: '预计到货日期' })
  @IsOptional()
  expectedDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 采购单查询 DTO
 */
export class PurchaseQueryDto {
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

  @ApiPropertyOptional({ description: '搜索关键词（单号/供应商）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '采购状态', enum: PurchaseStatus })
  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus

  @ApiPropertyOptional({ description: '付款状态', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus
}

/**
 * 采购单列表响应接口
 */
export interface PurchaseListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
