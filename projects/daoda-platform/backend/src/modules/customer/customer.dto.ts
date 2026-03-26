/**
 * 客户模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsEmail, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { CustomerLevel, CustomerStatus } from '@prisma/client'

export class CreateCustomerDto {
  @ApiPropertyOptional({ description: '客户编号（不填则自动生成）' })
  @IsOptional()
  @IsString()
  customerNo?: string

  @ApiProperty({ description: '客户名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '联系人姓名' })
  @IsString()
  contactName: string

  @ApiPropertyOptional({ description: '联系人' })
  @IsOptional()
  @IsString()
  contact?: string

  @ApiProperty({ description: '联系电话' })
  @IsString()
  phone: string

  @ApiPropertyOptional({ description: '电子邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ description: '地址' })
  @IsOptional()
  @IsString()
  address?: string

  @ApiPropertyOptional({ description: '客户等级', enum: CustomerLevel, default: CustomerLevel.B })
  @IsOptional()
  @IsEnum(CustomerLevel)
  level?: CustomerLevel

  @ApiPropertyOptional({ description: '客户来源' })
  @IsOptional()
  @IsString()
  source?: string

  @ApiPropertyOptional({ description: '所属行业' })
  @IsOptional()
  @IsString()
  industry?: string

  @ApiPropertyOptional({ description: '省份' })
  @IsOptional()
  @IsString()
  province?: string

  @ApiPropertyOptional({ description: '城市' })
  @IsOptional()
  @IsString()
  city?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: '客户名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '联系人' })
  @IsOptional()
  @IsString()
  contact?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: '电子邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ description: '地址' })
  @IsOptional()
  @IsString()
  address?: string

  @ApiPropertyOptional({ description: '客户等级', enum: CustomerLevel })
  @IsOptional()
  @IsEnum(CustomerLevel)
  level?: CustomerLevel

  @ApiPropertyOptional({ description: '客户状态', enum: CustomerStatus })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus

  @ApiPropertyOptional({ description: '客户来源' })
  @IsOptional()
  @IsString()
  source?: string

  @ApiPropertyOptional({ description: '所属行业' })
  @IsOptional()
  @IsString()
  industry?: string

  @ApiPropertyOptional({ description: '省份' })
  @IsOptional()
  @IsString()
  province?: string

  @ApiPropertyOptional({ description: '城市' })
  @IsOptional()
  @IsString()
  city?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class CustomerQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '客户等级', enum: CustomerLevel })
  @IsOptional()
  @IsEnum(CustomerLevel)
  level?: CustomerLevel

  @ApiPropertyOptional({ description: '客户状态', enum: CustomerStatus })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus

  @ApiPropertyOptional({ description: '客户来源' })
  @IsOptional()
  @IsString()
  source?: string

  @ApiPropertyOptional({ description: '行业' })
  @IsOptional()
  @IsString()
  industry?: string
}

export class CreateFollowUpDto {
  @ApiProperty({ description: '跟进内容' })
  @IsString()
  content: string

  @ApiPropertyOptional({ description: '下次跟进时间' })
  @IsOptional()
  nextTime?: Date
}

export class FollowUpQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10
}

export interface CustomerListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

export interface FollowUpListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}