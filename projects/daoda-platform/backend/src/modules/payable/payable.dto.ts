/**
 * 应付模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min, Max, IsDate } from 'class-validator'
import { PayableStatus } from '@prisma/client'
import { Type } from 'class-transformer'

// 导出枚举类型供 Controller 使用
export { PayableStatus }

/**
 * 创建应付账款 DTO
 */
export class CreatePayableDto {
  @ApiProperty({ description: '应付金额' })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiPropertyOptional({ description: '已付金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number

  @ApiPropertyOptional({ description: '采购单 ID' })
  @IsOptional()
  @IsString()
  purchaseId?: string

  @ApiPropertyOptional({ description: '供应商 ID' })
  @IsOptional()
  @IsString()
  supplierId?: string

  @ApiPropertyOptional({ description: '供应商名称' })
  @IsOptional()
  @IsString()
  supplierName?: string

  @ApiPropertyOptional({ description: '应付原因' })
  @IsOptional()
  @IsString()
  reason?: string

  @ApiPropertyOptional({ description: '到期日期' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date

  @ApiPropertyOptional({ description: '付款日期' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  paidDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新应付账款 DTO
 */
export class UpdatePayableDto {
  @ApiPropertyOptional({ description: '应付金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number

  @ApiPropertyOptional({ description: '已付金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number

  @ApiPropertyOptional({ description: '付款状态', enum: PayableStatus })
  @IsOptional()
  @IsEnum(PayableStatus)
  status?: PayableStatus

  @ApiPropertyOptional({ description: '付款日期' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  paidDate?: Date

  @ApiPropertyOptional({ description: '到期日期' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 付款 DTO
 */
export class MakePaymentDto {
  @ApiProperty({ description: '付款金额' })
  @IsNumber()
  @Min(0.01)
  amount: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 应付账款查询 DTO
 */
export class PayableQueryDto {
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

  @ApiPropertyOptional({ description: '搜索关键词（单号）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '付款状态', enum: PayableStatus })
  @IsOptional()
  @IsEnum(PayableStatus)
  status?: PayableStatus

  @ApiPropertyOptional({ description: '采购单 ID' })
  @IsOptional()
  @IsString()
  purchaseId?: string
}

/**
 * 应付账款列表响应接口
 */
export interface PayableListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
