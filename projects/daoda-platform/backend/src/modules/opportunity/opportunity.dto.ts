/**
 * 商机模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsDateString } from 'class-validator'
import { OpportunityStage } from '@prisma/client'

export class CreateOpportunityDto {
  @ApiProperty({ description: '商机名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string

  @ApiProperty({ description: '商机金额' })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiPropertyOptional({ description: '商机阶段', enum: OpportunityStage, default: OpportunityStage.LEAD })
  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage

  @ApiPropertyOptional({ description: '成功概率 (0-100)', default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number

  @ApiPropertyOptional({ description: '预计成交日期' })
  @IsOptional()
  @IsDateString()
  closeDate?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
  @ApiPropertyOptional({ description: '分配给' })
  @IsOptional()
  @IsString()
  assignedTo?: string
}

export class UpdateOpportunityDto {
  @ApiPropertyOptional({ description: '商机名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '商机金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number

  @ApiPropertyOptional({ description: '商机阶段', enum: OpportunityStage })
  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage

  @ApiPropertyOptional({ description: '成功概率 (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number

  @ApiPropertyOptional({ description: '预计成交日期' })
  @IsOptional()
  @IsDateString()
  closeDate?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
  @ApiPropertyOptional({ description: '分配给' })
  @IsOptional()
  @IsString()
  assignedTo?: string
}

export class OpportunityQueryDto {
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

  @ApiPropertyOptional({ description: '商机阶段', enum: OpportunityStage })
  @IsOptional()
  @IsEnum(OpportunityStage)
  stage?: OpportunityStage

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string
}

export interface OpportunityListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
