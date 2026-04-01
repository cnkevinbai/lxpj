/**
 * 考勤模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum, Min, Max } from 'class-validator'
import { AttendanceStatus } from '@prisma/client'
import { Type } from 'class-transformer'

/**
 * 创建考勤记录 DTO
 */
export class CreateAttendanceDto {
  @ApiProperty({ description: '员工 ID' })
  @IsString()
  employeeId: string

  @ApiProperty({ description: '考勤日期' })
  @Type(() => Date)
  date: Date

  @ApiPropertyOptional({ description: '签到时间' })
  @IsOptional()
  @Type(() => Date)
  checkIn?: Date

  @ApiPropertyOptional({ description: '签退时间' })
  @IsOptional()
  @Type(() => Date)
  checkOut?: Date

  @ApiPropertyOptional({
    description: '考勤状态',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 打卡 DTO
 */
export class CheckInDto {
  @ApiPropertyOptional({ description: '员工 ID（可选，管理员代打卡时使用）' })
  @IsOptional()
  @IsString()
  employeeId?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class CheckOutDto {
  @ApiPropertyOptional({ description: '员工 ID（可选，管理员代签退时使用）' })
  @IsOptional()
  @IsString()
  employeeId?: string

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 更新考勤 DTO
 */
export class UpdateAttendanceDto {
  @ApiPropertyOptional({ description: '签到时间' })
  @IsOptional()
  @Type(() => Date)
  checkIn?: Date

  @ApiPropertyOptional({ description: '签退时间' })
  @IsOptional()
  @Type(() => Date)
  checkOut?: Date

  @ApiPropertyOptional({ description: '考勤状态', enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

/**
 * 考勤查询 DTO
 */
export class AttendanceQueryDto {
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

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date

  @ApiPropertyOptional({ description: '考勤状态', enum: AttendanceStatus })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus
}

/**
 * 考勤列表响应接口
 */
export interface AttendanceListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
