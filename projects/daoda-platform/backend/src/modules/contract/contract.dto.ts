/**
 * 合同模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max, IsDateString, IsArray, IsBoolean } from 'class-validator'

/**
 * 合同状态枚举
 */
export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING_RENEWAL = 'PENDING_RENEWAL',
  TERMINATED = 'TERMINATED',
}

export class CreateContractDto {
  @ApiProperty({ description: '合同编号' })
  @IsOptional()
  @IsString()
  contractNo?: string

  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string

  @ApiProperty({ description: '合同标题' })
  @IsString()
  title: string

  @ApiProperty({ description: '合同金额' })
  @IsNumber()
  @Min(0)
  amount: number

  @ApiProperty({ description: '开始日期' })
  @IsDateString()
  startDate: string

  @ApiProperty({ description: '结束日期' })
  @IsDateString()
  endDate: string

  @ApiPropertyOptional({ description: '签订日期', default: null })
  @IsOptional()
  @IsDateString()
  signDate?: string

  @ApiPropertyOptional({ description: '状态', enum: ContractStatus, default: ContractStatus.DRAFT })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus

  @ApiPropertyOptional({ description: '附件', type: [String] })
  @IsOptional()
  @IsArray()
  attachments?: string[]

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class UpdateContractDto {
  @ApiPropertyOptional({ description: '合同编号' })
  @IsOptional()
  @IsString()
  contractNo?: string

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '合同标题' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: '合同金额' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsDateString()
  startDate?: string

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsDateString()
  endDate?: string

  @ApiPropertyOptional({ description: '签订日期' })
  @IsOptional()
  @IsDateString()
  signDate?: string

  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus

  @ApiPropertyOptional({ description: '附件' })
  @IsOptional()
  @IsArray()
  attachments?: string[]

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string
}

export class ContractQueryDto {
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

  @ApiPropertyOptional({ description: '合同状态', enum: ContractStatus })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string

  @ApiPropertyOptional({ description: '是否即将到期', default: false })
  @IsOptional()
  @IsBoolean()
  upcoming?: boolean
}

export interface ContractListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}

export interface Contract {
  id: string
  contractNo: string
  customerId: string
  customerName: string
  customerContact: string | null
  customerPhone: string | null
  title: string
  amount: number
  startDate: string
  endDate: string
  status: ContractStatus
  signDate: string | null
  attachments: string[] | null
  remark: string | null
  createdAt: string
  updatedAt: string
}
