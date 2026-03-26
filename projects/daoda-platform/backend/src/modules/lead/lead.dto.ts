/**
 * 线索模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsEmail, IsInt, Min, Max } from 'class-validator'
import { LeadStatus } from '@prisma/client'

export class CreateLeadDto {
  @ApiProperty({ description: '线索名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '联系人' })
  @IsString()
  contact: string

  @ApiProperty({ description: '联系电话' })
  @IsString()
  phone: string

  @ApiPropertyOptional({ description: '电子邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ description: '公司名称' })
  @IsOptional()
  @IsString()
  company?: string

  @ApiPropertyOptional({ description: '线索来源' })
  @IsOptional()
  @IsString()
  source?: string

  @ApiPropertyOptional({ description: '线索状态', enum: LeadStatus, default: LeadStatus.NEW })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus

  @ApiPropertyOptional({ description: '分配给用户 ID' })
  @IsOptional()
  @IsString()
  assignedTo?: string

  @ApiPropertyOptional({ description: '线索评分', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdateLeadDto {
  @ApiPropertyOptional({ description: '线索名称' })
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

  @ApiPropertyOptional({ description: '公司名称' })
  @IsOptional()
  @IsString()
  company?: string

  @ApiPropertyOptional({ description: '线索来源' })
  @IsOptional()
  @IsString()
  source?: string

  @ApiPropertyOptional({ description: '线索状态', enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus

  @ApiPropertyOptional({ description: '分配给用户 ID' })
  @IsOptional()
  @IsString()
  assignedTo?: string

  @ApiPropertyOptional({ description: '线索评分' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  score?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class LeadQueryDto {
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

  @ApiPropertyOptional({ description: '线索状态', enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus

  @ApiPropertyOptional({ description: '线索来源' })
  @IsOptional()
  @IsString()
  source?: string
}

export interface LeadListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

export class ImportLeadDto {
  @ApiProperty({ description: '线索名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '联系人' })
  @IsString()
  contact: string

  @ApiProperty({ description: '联系电话' })
  @IsString()
  phone: string

  @ApiPropertyOptional({ description: '电子邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ description: '公司名称' })
  @IsOptional()
  @IsString()
  company?: string

  @ApiPropertyOptional({ description: '线索来源' })
  @IsOptional()
  @IsString()
  source?: string
}
