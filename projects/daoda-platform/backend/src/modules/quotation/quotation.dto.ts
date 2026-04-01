/**
 * 报价单模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDecimal,
  Min,
  Max,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { QuotationStatus } from '@prisma/client'

export class CreateQuotationItemDto {
  @ApiProperty({ description: '产品 ID' })
  @IsString()
  productId: string

  @ApiProperty({ description: '产品名称' })
  @IsString()
  productName: string

  @ApiProperty({ description: '数量' })
  @IsNumber()
  @Min(1)
  quantity: number

  @ApiProperty({ description: '单价' })
  @IsNumber()
  @Min(0)
  unitPrice: number

  @ApiPropertyOptional({ description: '折扣 (%)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class CreateQuotationDto {
  @ApiPropertyOptional({ description: '关联商机 ID' })
  @IsOptional()
  @IsString()
  opportunityId?: string

  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string

  @ApiPropertyOptional({ description: '有效期限' })
  @IsOptional()
  @IsDateString()
  validUntil?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string

  @ApiProperty({ description: '报价单Items', type: [CreateQuotationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items: CreateQuotationItemDto[]
}

export class UpdateQuotationDto {
  @ApiPropertyOptional({ description: '关联商机 ID' })
  @IsOptional()
  @IsString()
  opportunityId?: string

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '有效期限' })
  @IsOptional()
  @IsDateString()
  validUntil?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsEnum(QuotationStatus)
  status?: QuotationStatus

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string

  @ApiPropertyOptional({ description: '报价单Items', type: [CreateQuotationItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuotationItemDto)
  items?: CreateQuotationItemDto[]
}

export class QuotationQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 10

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '报价单状态', enum: QuotationStatus })
  @IsOptional()
  @IsEnum(QuotationStatus)
  status?: QuotationStatus

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '商机 ID' })
  @IsOptional()
  @IsString()
  opportunityId?: string
}

export interface QuotationListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

export interface QuotationItem {
  id: string
  productId: string
  productName: string
  productCode: string
  quantity: number
  unitPrice: number
  discount: number
  amount: number
  remark: string | null
}

export interface Quotation {
  id: string
  quotationNo: string
  opportunityId: string | null
  opportunityName: string | null
  customerId: string
  customerName: string
  customerContact: string | null
  customerPhone: string | null
  status: QuotationStatus
  validUntil: string | null
  totalAmount: number
  items: QuotationItem[]
  remark: string | null
  createdBy: string | null
  createdByName: string | null
  updatedBy: string | null
  updatedByName: string | null
  createdAt: string
  updatedAt: string
}
