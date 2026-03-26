/**
 * 工资模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min, Max } from 'class-validator'
import { SalaryStatus } from '@prisma/client'

/**
 * 创建工资记录 DTO
 */
export class CreateSalaryDto {
  @ApiProperty({ description: '员工 ID' })
  @IsString()
  employeeId: string

  @ApiProperty({ description: '工资月份 (YYYY-MM)' })
  @IsString()
  month: string

  @ApiProperty({ description: '基本工资' })
  @IsNumber()
  @Min(0)
  baseSalary: number

  @ApiPropertyOptional({ description: '奖金', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number = 0

  @ApiPropertyOptional({ description: '扣款', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deduction?: number = 0

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新工资 DTO
 */
export class UpdateSalaryDto {
  @ApiPropertyOptional({ description: '基本工资' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseSalary?: number

  @ApiPropertyOptional({ description: '奖金' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonus?: number

  @ApiPropertyOptional({ description: '扣款' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deduction?: number

  @ApiPropertyOptional({ description: '工资状态', enum: SalaryStatus })
  @IsOptional()
  @IsEnum(SalaryStatus)
  status?: SalaryStatus

  @ApiPropertyOptional({ description: '发放日期' })
  @IsOptional()
  paidDate?: Date

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 发放工资 DTO
 */
export class PaySalaryDto {
  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 工资查询 DTO
 */
export class SalaryQueryDto {
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

  @ApiPropertyOptional({ description: '员工 ID' })
  @IsOptional()
  @IsString()
  employeeId?: string

  @ApiPropertyOptional({ description: '工资月份 (YYYY-MM)' })
  @IsOptional()
  @IsString()
  month?: string

  @ApiPropertyOptional({ description: '工资状态', enum: SalaryStatus })
  @IsOptional()
  @IsEnum(SalaryStatus)
  status?: SalaryStatus
}

/**
 * 工资列表响应接口
 */
export interface SalaryListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
