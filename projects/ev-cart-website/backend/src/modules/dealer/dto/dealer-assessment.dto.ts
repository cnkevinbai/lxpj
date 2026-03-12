import { IsString, IsOptional, IsNumber, IsObject, IsEnum, IsDateString, IsUUID, IsArray, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDealerAssessmentDto {
  @ApiProperty({ description: '经销商 ID' })
  @IsUUID()
  dealerId: string

  @ApiProperty({ description: '考核期间，如 2026-Q1' })
  @IsString()
  period: string

  @ApiProperty({ description: '考核周期类型', enum: ['monthly', 'quarterly', 'yearly'] })
  @IsEnum(['monthly', 'quarterly', 'yearly'])
  periodType: string

  @ApiProperty({ description: '各项得分', required: false })
  @IsOptional()
  @IsObject()
  scores?: Record<string, number>

  @ApiProperty({ description: '销售目标', required: false })
  @IsOptional()
  @IsNumber()
  salesTarget?: number

  @ApiProperty({ description: '实际销售', required: false })
  @IsOptional()
  @IsNumber()
  salesActual?: number

  @ApiProperty({ description: '新客户数量', required: false })
  @IsOptional()
  @IsNumber()
  newCustomersCount?: number

  @ApiProperty({ description: '客户满意度', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  customerSatisfaction?: number

  @ApiProperty({ description: '合规分数', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  complianceScore?: number

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  comments?: string
}

export class UpdateDealerAssessmentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  scores?: Record<string, number>

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalScore?: number

  @ApiProperty({ required: false, enum: ['S', 'A', 'B', 'C', 'D'] })
  @IsOptional()
  @IsEnum(['S', 'A', 'B', 'C', 'D'])
  grade?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comments?: string

  @ApiProperty({ required: false, enum: ['draft', 'submitted', 'approved', 'rejected'] })
  @IsOptional()
  @IsEnum(['draft', 'submitted', 'approved', 'rejected'])
  status?: string
}

export class ApproveAssessmentDto {
  @ApiProperty({ description: '审批意见', required: false })
  @IsOptional()
  @IsString()
  comments?: string
}

export class CalculateAssessmentDto {
  @ApiProperty({ description: '经销商 ID 列表', required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  dealerIds?: string[]

  @ApiProperty({ description: '考核期间' })
  @IsString()
  period: string

  @ApiProperty({ description: '考核周期类型', enum: ['monthly', 'quarterly', 'yearly'] })
  @IsEnum(['monthly', 'quarterly', 'yearly'])
  periodType: string
}
