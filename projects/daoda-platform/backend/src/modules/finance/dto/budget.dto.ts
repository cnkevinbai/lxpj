/**
 * 预算管理 DTO
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsEnum, IsOptional, Min, IsDate } from 'class-validator'

export enum BudgetType {
  ANNUAL = 'ANNUAL',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  PROJECT = 'PROJECT',
  DEPARTMENT = 'DEPARTMENT',
}

export enum BudgetCategory {
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
  CAPEX = 'CAPEX',
  OPEX = 'OPEX',
  HR = 'HR',
  MARKETING = 'MARKETING',
  R_D = 'R_D',
  ADMIN = 'ADMIN',
  PRODUCTION = 'PRODUCTION',
  OTHER = 'OTHER',
}

export enum ControlLevel {
  NONE = 'NONE',
  SOFT = 'SOFT',
  HARD = 'HARD',
  APPROVAL = 'APPROVAL',
}

export class CreateBudgetDto {
  @ApiProperty({ description: '预算名称', example: '2026年度运营预算' })
  @IsString()
  budgetName: string

  @ApiProperty({ description: '预算类型', enum: BudgetType, example: BudgetType.ANNUAL })
  @IsEnum(BudgetType)
  budgetType: BudgetType

  @ApiProperty({ description: '预算分类', enum: BudgetCategory, example: BudgetCategory.OPEX })
  @IsEnum(BudgetCategory)
  category: BudgetCategory

  @ApiProperty({ description: '预算金额', example: 5000000 })
  @IsNumber()
  @Min(0)
  budgetAmount: number

  @ApiProperty({ description: '财年', example: 2026 })
  @IsNumber()
  fiscalYear: number

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  startDate?: Date

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  endDate?: Date

  @ApiPropertyOptional({ description: '部门ID' })
  @IsOptional()
  @IsString()
  departmentId?: string

  @ApiProperty({ description: '控制级别', enum: ControlLevel, example: ControlLevel.SOFT })
  @IsEnum(ControlLevel)
  controlLevel: ControlLevel

  @ApiPropertyOptional({ description: '预警阈值（百分比）', example: 80 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  alertThreshold?: number
}

export class ExecuteBudgetDto {
  @ApiProperty({ description: '预算ID' })
  @IsString()
  budgetId: string

  @ApiProperty({ description: '执行金额' })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiProperty({ description: '业务类型' })
  @IsString()
  businessType: string

  @ApiProperty({ description: '业务ID' })
  @IsString()
  businessId: string

  @ApiProperty({ description: '业务单号' })
  @IsString()
  businessCode: string

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string
}
