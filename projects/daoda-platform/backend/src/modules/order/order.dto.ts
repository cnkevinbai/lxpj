/**
 * 订单模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested, IsInt, Min, Max } from 'class-validator'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { Type } from 'class-transformer'

export class OrderItemDto {
  @ApiProperty({ description: '产品 ID' })
  @IsString()
  productId: string

  @ApiProperty({ description: '数量' })
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

export class CreateOrderDto {
  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string

  @ApiProperty({ description: '订单项', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string

  @ApiPropertyOptional({ description: '支付方式' })
  @IsOptional()
  @IsString()
  paymentMethod?: string
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string

  @ApiPropertyOptional({ description: '支付方式' })
  @IsOptional()
  @IsString()
  paymentMethod?: string
}

export class UpdateOrderStatusDto {
  @ApiProperty({ description: '订单状态', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class PaymentDto {
  @ApiProperty({ description: '支付金额' })
  @IsNumber()
  @Min(0.01)
  amount: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class OrderQueryDto {
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

  @ApiPropertyOptional({ description: '订单状态', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus

  @ApiPropertyOptional({ description: '支付状态', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '负责人 ID' })
  @IsOptional()
  @IsString()
  userId?: string

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsString()
  startDate?: string

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsString()
  endDate?: string
}

export interface OrderListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

export interface OrderStatsResponse {
  totalOrders: number
  totalAmount: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  unpaidAmount: number
  paidAmount: number
}
