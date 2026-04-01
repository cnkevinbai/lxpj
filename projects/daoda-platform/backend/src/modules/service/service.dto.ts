/**
 * 售后服务模块 DTO 定义
 * 用于数据传输和验证
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsArray,
  IsDateString,
} from 'class-validator'
import { Priority, TicketStatus } from '@prisma/client'

// ==================== 创建工单 DTO ====================

export class CreateServiceTicketDto {
  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string

  @ApiProperty({ description: '工单类型', example: '安装' })
  @IsString()
  type: string

  @ApiPropertyOptional({
    description: '优先级',
    enum: Priority,
    default: Priority.NORMAL,
    example: 'NORMAL',
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @ApiProperty({ description: '问题描述' })
  @IsString()
  description: string

  @ApiPropertyOptional({ description: '图片 URL 列表' })
  @IsOptional()
  @IsString({ each: true })
  images?: string[]
}

// ==================== 更新工单 DTO ====================

export class UpdateServiceTicketDto {
  @ApiPropertyOptional({ description: '优先级', enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @ApiPropertyOptional({ description: '状态', enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus

  @ApiPropertyOptional({ description: '处理方案' })
  @IsOptional()
  @IsString()
  solution?: string

  @ApiPropertyOptional({ description: '图片 URL 列表' })
  @IsOptional()
  @IsString({ each: true })
  images?: string[]
}

// ==================== 分配工单 DTO ====================

export class AssignTicketDto {
  @ApiProperty({ description: '技术人员 ID' })
  @IsString()
  assigneeId: string
}

// ==================== 查询参数 DTO ====================

export class ServiceTicketQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10

  @ApiPropertyOptional({ description: '搜索关键词（工单号）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '工单状态筛选', enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus

  @ApiPropertyOptional({ description: '优先级筛选', enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority

  @ApiPropertyOptional({ description: '客户 ID 筛选' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '技术人员 ID 筛选' })
  @IsOptional()
  @IsString()
  assigneeId?: string

  @ApiPropertyOptional({ description: '开始日期', example: '2024-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string

  @ApiPropertyOptional({ description: '结束日期', example: '2024-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string
}

// ==================== 响应类型 ====================

export class ServiceTicketResponse {
  id: string
  ticketNo: string
  type: string
  priority: Priority
  status: TicketStatus
  description: string
  solution: string | null
  images: string | null
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
  customerId: string
  assigneeId: string | null
  customer: {
    id: string
    name: string
    contact: string | null
    phone: string | null
  }
  assignee?: {
    id: string
    name: string
    email?: string // 改为可选，兼容不同查询场景
  } | null
}

export interface ServiceTicketListResponse {
  list: ServiceTicketResponse[]
  total: number
  page: number
  pageSize: number
}

export interface ServiceTicketStatsResponse {
  totalTickets: number
  pendingTickets: number
  processingTickets: number
  completedTickets: number
  closedTickets: number
  highPriorityTickets: number
  urgentPriorityTickets: number
}

export interface ServiceTicketByStatus {
  [key: string]: number
}

export interface ServiceTicketByPriority {
  [key: string]: number
}
