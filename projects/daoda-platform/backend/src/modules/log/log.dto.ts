/**
 * 操作日志模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator'
import { LogStatus } from '@prisma/client'

/**
 * 日志查询 DTO
 */
export class LogQueryDto {
  @ApiPropertyOptional({ description: '操作人姓名' })
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional({ description: '操作动作' })
  @IsOptional()
  @IsString()
  action?: string

  @ApiPropertyOptional({ description: '请求方法' })
  @IsOptional()
  @IsString()
  method?: string

  @ApiPropertyOptional({ description: '状态筛选', enum: LogStatus })
  @IsOptional()
  @IsEnum(LogStatus)
  status?: LogStatus

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @IsString()
  startTime?: string

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @IsString()
  endTime?: string

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  page?: number

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsInt()
  pageSize?: number

  @ApiPropertyOptional({ description: '是否包含参数' })
  @IsOptional()
  includeParams?: boolean
}

/**
 * 操作日志响应 DTO
 */
export class LogResponse {
  @ApiProperty({ description: '日志 ID' })
  id: string

  @ApiPropertyOptional({ description: '用户 ID' })
  userId: string | null

  @ApiPropertyOptional({ description: '用户名' })
  username: string | null

  @ApiProperty({ description: '操作动作' })
  action: string

  @ApiProperty({ description: '请求方法' })
  method: string

  @ApiProperty({ description: '请求路径' })
  path: string

  @ApiPropertyOptional({ description: 'IP 地址' })
  ip: string | null

  @ApiPropertyOptional({ description: 'User-Agent' })
  userAgent: string | null

  @ApiPropertyOptional({ description: '请求参数' })
  params: string | null

  @ApiPropertyOptional({ description: '返回结果' })
  result: string | null

  @ApiPropertyOptional({ description: '耗时（毫秒）' })
  duration: number | null

  @ApiProperty({ description: '操作状态', enum: LogStatus })
  status: LogStatus

  @ApiProperty({ description: '创建时间' })
  createdAt: Date
}

/**
 * 操作日志列表响应 DTO
 */
export class LogListResponse {
  @ApiProperty({ description: '日志列表' })
  list: LogResponse[]

  @ApiProperty({ description: '总数' })
  total: number

  @ApiProperty({ description: '当前页码' })
  page: number

  @ApiProperty({ description: '每页数量' })
  pageSize: number
}
