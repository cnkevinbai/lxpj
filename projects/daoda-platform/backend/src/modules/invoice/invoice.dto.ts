/**
 * 发票模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min, Max, IsDate } from 'class-validator'
import { InvoiceType, InvoiceStatus } from '@prisma/client'
import { Type } from 'class-transformer'

/**
 * 创建发票 DTO
 */
export class CreateInvoiceDto {
  @ApiProperty({ description: '发票类型', enum: InvoiceType })
  @IsEnum(InvoiceType)
  type: InvoiceType

  @ApiProperty({ description: '发票金额' })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiProperty({ description: '税额' })
  @IsNumber()
  @Min(0)
  taxAmount: number

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '订单 ID' })
  @IsOptional()
  @IsString()
  orderId?: string

  @ApiPropertyOptional({ description: '采购 ID' })
  @IsOptional()
  @IsString()
  purchaseId?: string

  @ApiPropertyOptional({ description: '供应商 ID' })
  @IsOptional()
  @IsString()
  supplierId?: string

  @ApiPropertyOptional({ description: '开票日期' })
  @IsOptional()
  issueDate?: Date

  @ApiPropertyOptional({ description: '到期日期' })
  @IsOptional()
  dueDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新发票 DTO
 */
export class UpdateInvoiceDto {
  @ApiPropertyOptional({ description: '发票类型', enum: InvoiceType })
  @IsOptional()
  @IsEnum(InvoiceType)
  type?: InvoiceType

  @ApiPropertyOptional({ description: '发票状态', enum: InvoiceStatus })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus

  @ApiPropertyOptional({ description: '发票金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '订单 ID' })
  @IsOptional()
  @IsString()
  orderId?: string

  @ApiPropertyOptional({ description: '税额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number

  @ApiPropertyOptional({ description: '开票日期' })
  @IsOptional()
  issueDate?: Date

  @ApiPropertyOptional({ description: '到期日期' })
  @IsOptional()
  dueDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 发票查询 DTO
 */
export class InvoiceQueryDto {
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

  @ApiPropertyOptional({ description: '搜索关键词（发票号/客户名）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '发票类型', enum: InvoiceType })
  @IsOptional()
  @IsEnum(InvoiceType)
  type?: InvoiceType

  @ApiPropertyOptional({ description: '发票状态', enum: InvoiceStatus })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '订单 ID' })
  @IsOptional()
  @IsString()
  orderId?: string
}

/**
 * 发票列表响应接口
 */
export interface InvoiceListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
