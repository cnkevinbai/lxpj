/**
 * 应收模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min, IsDate } from 'class-validator'
import { ReceivableStatus } from '@prisma/client'
import { Type } from 'class-transformer'

export { ReceivableStatus }

/**
 * 创建应收账款 DTO
 */
export class CreateReceivableDto {
  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string

  @ApiProperty({ description: '应收金额' })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiPropertyOptional({ description: '订单 ID' })
  @IsOptional()
  @IsString()
  orderId?: string

  @ApiPropertyOptional({ description: '已收金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number

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
 * 更新应收账款 DTO
 */
export class UpdateReceivableDto {
  @ApiPropertyOptional({ description: '已收金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number

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
 * 应收账款查询 DTO
 */
export class ReceivableQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ description: '每页条数', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '状态筛选', enum: ReceivableStatus })
  @IsOptional()
  @IsEnum(ReceivableStatus)
  status?: ReceivableStatus

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string
}

/**
 * 收款记录 DTO
 */
export class PaymentRecordDto {
  @ApiProperty({ description: '收款金额' })
  @IsNumber()
  @Min(0.01)
  amount: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 应收账款列表响应
 */
export class ReceivableListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}