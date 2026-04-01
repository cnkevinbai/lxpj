/**
 * Workflow 工作流引擎 DTO
 * 条件分支、并行审批、流程监控、流程版本相关数据传输对象
 *
 * @version 1.0.0
 * @since 2026-04-01
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsDate, IsEnum, IsObject, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

// ============================================
// 流程定义 DTO
// ============================================

/** 流程状态枚举 */
export enum ProcessStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

/** 流程实例状态 */
export enum InstanceStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

/** 任务状态 */
export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  TIMEOUT = 'timeout',
}

/** 创建流程定义请求 */
export class CreateProcessDefinitionDto {
  @ApiProperty({ description: '流程名称' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '流程描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '流程类型' })
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional({ description: '流程版本', default: '1.0.0' })
  @IsOptional()
  @IsString()
  version?: string = '1.0.0'

  @ApiProperty({ description: '流程定义JSON' })
  @IsObject()
  definition: Record<string, unknown>

  @ApiPropertyOptional({ description: '表单配置' })
  @IsOptional()
  formConfig?: Record<string, unknown>

  @ApiPropertyOptional({ description: '审批人配置' })
  @IsOptional()
  approverConfig?: Record<string, unknown>

  @ApiPropertyOptional({ description: '超时配置(分钟)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  timeoutMinutes?: number

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true
}

/** 更新流程定义请求 */
export class UpdateProcessDefinitionDto {
  @ApiPropertyOptional({ description: '流程名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '流程描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '流程定义JSON' })
  @IsOptional()
  @IsObject()
  definition?: Record<string, unknown>

  @ApiPropertyOptional({ description: '表单配置' })
  @IsOptional()
  formConfig?: Record<string, unknown>

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

// ============================================
// 流程实例 DTO
// ============================================

/** 启动流程请求 */
export class StartProcessDto {
  @ApiProperty({ description: '流程定义ID' })
  @IsString()
  processDefinitionId: string

  @ApiPropertyOptional({ description: '业务ID' })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiPropertyOptional({ description: '业务类型' })
  @IsOptional()
  @IsString()
  businessType?: string

  @ApiProperty({ description: '流程变量' })
  @IsObject()
  variables: Record<string, unknown>

  @ApiPropertyOptional({ description: '发起人ID' })
  @IsOptional()
  @IsString()
  initiatorId?: string

  @ApiPropertyOptional({ description: '紧急程度', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(3)
  priority?: number = 0
}

/** 流程实例查询参数 */
export class ProcessInstanceQueryDto {
  @ApiPropertyOptional({ description: '流程定义ID' })
  @IsOptional()
  @IsString()
  processDefinitionId?: string

  @ApiPropertyOptional({ description: '发起人ID' })
  @IsOptional()
  @IsString()
  initiatorId?: string

  @ApiPropertyOptional({ description: '实例状态', enum: InstanceStatus })
  @IsOptional()
  @IsEnum(InstanceStatus)
  status?: InstanceStatus

  @ApiPropertyOptional({ description: '业务ID' })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiPropertyOptional({ description: '业务类型' })
  @IsOptional()
  @IsString()
  businessType?: string

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 10
}

// ============================================
// 审批任务 DTO
// ============================================

/** 审批动作枚举 */
export enum ApprovalAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  RETURN = 'return',
  DELEGATE = 'delegate',
  CANCEL = 'cancel',
}

/** 完成任务请求 */
export class CompleteTaskDto {
  @ApiProperty({ description: '任务ID' })
  @IsString()
  taskId: string

  @ApiProperty({ description: '审批动作', enum: ApprovalAction })
  @IsEnum(ApprovalAction)
  action: ApprovalAction

  @ApiPropertyOptional({ description: '审批意见' })
  @IsOptional()
  @IsString()
  comments?: string

  @ApiPropertyOptional({ description: '审批变量' })
  @IsOptional()
  @IsObject()
  variables?: Record<string, unknown>

  @ApiPropertyOptional({ description: '委派人ID (委派时使用)' })
  @IsOptional()
  @IsString()
  delegateTo?: string
}

/** 任务查询参数 */
export class TaskQueryDto {
  @ApiPropertyOptional({ description: '流程实例ID' })
  @IsOptional()
  @IsString()
  instanceId?: string

  @ApiPropertyOptional({ description: '处理人ID' })
  @IsOptional()
  @IsString()
  assigneeId?: string

  @ApiPropertyOptional({ description: '任务状态', enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus

  @ApiPropertyOptional({ description: '任务名称' })
  @IsOptional()
  @IsString()
  taskName?: string

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 10
}

// ============================================
// 条件分支 DTO
// ============================================

/** 条件类型枚举 */
export enum ConditionType {
  SIMPLE = 'simple',
  COMPLEX = 'complex',
  SCRIPT = 'script',
}

/** 创建条件分支请求 */
export class CreateConditionBranchDto {
  @ApiProperty({ description: '分支名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '所属流程ID' })
  @IsString()
  processId: string

  @ApiPropertyOptional({ description: '条件类型', enum: ConditionType })
  @IsOptional()
  @IsEnum(ConditionType)
  conditionType?: ConditionType = ConditionType.SIMPLE

  @ApiProperty({ description: '条件表达式' })
  @IsObject()
  condition: Record<string, unknown>

  @ApiPropertyOptional({ description: '目标节点ID' })
  @IsOptional()
  @IsString()
  targetNodeId?: string

  @ApiPropertyOptional({ description: '优先级', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priority?: number = 0
}

// ============================================
// 并行审批 DTO
// ============================================

/** 并行类型枚举 */
export enum ParallelType {
  ALL = 'all',       // 全部完成
  ANY = 'any',       // 任一完成
  PERCENTAGE = 'percentage', // 按比例
}

/** 创建并行审批请求 */
export class CreateParallelApprovalDto {
  @ApiProperty({ description: '审批节点名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '所属流程ID' })
  @IsString()
  processId: string

  @ApiPropertyOptional({ description: '并行类型', enum: ParallelType })
  @IsOptional()
  @IsEnum(ParallelType)
  parallelType?: ParallelType = ParallelType.ALL

  @ApiPropertyOptional({ description: '完成比例 (percentage类型时使用)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  completionPercentage?: number

  @ApiPropertyOptional({ description: '审批人列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  approvers?: string[]

  @ApiPropertyOptional({ description: '审批组列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  approverGroups?: string[]
}

// ============================================
// 流程版本 DTO
// ============================================

/** 创建新版本请求 */
export class CreateProcessVersionDto {
  @ApiProperty({ description: '原流程ID' })
  @IsString()
  processId: string

  @ApiPropertyOptional({ description: '版本号' })
  @IsOptional()
  @IsString()
  version?: string

  @ApiPropertyOptional({ description: '变更说明' })
  @IsOptional()
  @IsString()
  changeNotes?: string

  @ApiPropertyOptional({ description: '新流程定义' })
  @IsOptional()
  @IsObject()
  definition?: Record<string, unknown>
}

/** 版本查询参数 */
export class ProcessVersionQueryDto {
  @ApiProperty({ description: '流程ID' })
  @IsString()
  processId: string

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 10
}