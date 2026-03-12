import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, IsUUID, IsObject, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateDealerRebateDto {
  @ApiProperty({ description: '经销商 ID' })
  @IsUUID()
  dealerId: string

  @ApiProperty({ description: '返利类型', enum: ['sales', 'growth', 'market', 'special'] })
  @IsEnum(['sales', 'growth', 'market', 'special'])
  rebateType: string

  @ApiProperty({ description: '返利期间，如 2026-Q1' })
  @IsString()
  period: string

  @ApiProperty({ description: '返利金额' })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiProperty({ description: '计算基数', required: false })
  @IsOptional()
  @IsNumber()
  basisAmount?: number

  @ApiProperty({ description: '返点比例', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  rebateRate?: number

  @ApiProperty({ description: '计算公式', required: false })
  @IsOptional()
  @IsString()
  calculationFormula?: string

  @ApiProperty({ description: '备注', required: false })
  @IsOptional()
  @IsString()
  notes?: string
}

export class UpdateDealerRebateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  amount?: number

  @ApiProperty({ required: false, enum: ['pending', 'approved', 'paid', 'cancelled'] })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'paid', 'cancelled'])
  status?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  paidAt?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentRef?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string
}

export class ApproveRebateDto {
  @ApiProperty({ description: '审批意见', required: false })
  @IsOptional()
  @IsString()
  comments?: string
}

export class PayRebateDto {
  @ApiProperty({ description: '支付方式', enum: ['bank_transfer', 'check', 'credit_note'] })
  @IsEnum(['bank_transfer', 'check', 'credit_note'])
  paymentMethod: string

  @ApiProperty({ description: '支付参考号', required: false })
  @IsOptional()
  @IsString()
  paymentRef?: string
}

export class CalculateRebateDto {
  @ApiProperty({ description: '经销商 ID 列表', required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  dealerIds?: string[]

  @ApiProperty({ description: '返利期间' })
  @IsString()
  period: string

  @ApiProperty({ description: '返利类型', required: false, enum: ['sales', 'growth', 'market', 'all'] })
  @IsOptional()
  @IsEnum(['sales', 'growth', 'market', 'all'])
  rebateType?: string
}
