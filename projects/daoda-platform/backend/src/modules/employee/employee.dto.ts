/**
 * 员工模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, IsNumber, Min, Max, IsEmail } from 'class-validator'
import { EmployeeStatus } from '@prisma/client'
import { Type } from 'class-transformer'

/**
 * 创建员工 DTO
 */
export class CreateEmployeeDto {
  @ApiPropertyOptional({ description: '用户 ID（关联系统账号）' })
  @IsOptional()
  @IsString()
  userId?: string

  @ApiProperty({ description: '员工编号' })
  @IsString()
  employeeNo: string

  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: '部门' })
  @IsOptional()
  @IsString()
  department?: string

  @ApiPropertyOptional({ description: '职位' })
  @IsOptional()
  @IsString()
  position?: string

  @ApiPropertyOptional({ description: '入职日期' })
  @IsOptional()
  @Type(() => Date)
  entryDate?: Date

  @ApiPropertyOptional({ description: '基本工资' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseSalary?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新员工 DTO
 */
export class UpdateEmployeeDto {
  @ApiPropertyOptional({ description: '员工编号' })
  @IsOptional()
  @IsString()
  employeeNo?: string

  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ description: '部门' })
  @IsOptional()
  @IsString()
  department?: string

  @ApiPropertyOptional({ description: '职位' })
  @IsOptional()
  @IsString()
  position?: string

  @ApiPropertyOptional({ description: '离职日期' })
  @IsOptional()
  @Type(() => Date)
  leaveDate?: Date

  @ApiPropertyOptional({ description: '员工状态', enum: EmployeeStatus })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus

  @ApiPropertyOptional({ description: '基本工资' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseSalary?: number

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 员工查询 DTO
 */
export class EmployeeQueryDto {
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

  @ApiPropertyOptional({ description: '搜索关键词（姓名/编号/手机）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '部门' })
  @IsOptional()
  @IsString()
  department?: string

  @ApiPropertyOptional({ description: '员工状态', enum: EmployeeStatus })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus
}

/**
 * 员工列表响应接口
 */
export interface EmployeeListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
