/**
 * Notification 通知提醒系统 DTO
 * 站内消息、邮件通知、钉钉通知、消息模板相关数据传输对象
 *
 * @version 1.0.0
 * @since 2026-04-01
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsDate, IsEnum, IsObject, Min, Max, IsEmail } from 'class-validator'
import { Type } from 'class-transformer'

// ============================================
// 消息 DTO
// ============================================

/** 消息类型枚举 */
export enum MessageType {
  SYSTEM = 'system',
  APPROVAL = 'approval',
  REMINDER = 'reminder',
  NOTICE = 'notice',
  TASK = 'task',
}

/** 消息分类枚举 */
export enum MessageCategory {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

/** 消息状态枚举 */
export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  READ = 'read',
  FAILED = 'failed',
}

/** 通知渠道枚举 */
export enum NotifyChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  DINGTALK = 'dingtalk',
  BROWSER = 'browser',
  SMS = 'sms',
}

/** 创建消息请求 */
export class CreateMessageDto {
  @ApiProperty({ description: '消息标题' })
  @IsString()
  title: string

  @ApiPropertyOptional({ description: '消息内容' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiProperty({ description: '消息类型', enum: MessageType })
  @IsEnum(MessageType)
  type: MessageType

  @ApiPropertyOptional({ description: '消息分类', enum: MessageCategory })
  @IsOptional()
  @IsEnum(MessageCategory)
  category?: MessageCategory = MessageCategory.INFO

  @ApiPropertyOptional({ description: '发送渠道列表', enum: NotifyChannel, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(NotifyChannel, { each: true })
  channels?: NotifyChannel[]

  @ApiPropertyOptional({ description: '接收人ID列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  receiverIds?: string[]

  @ApiPropertyOptional({ description: '接收人邮箱列表 (邮件通知)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  receiverEmails?: string[]

  @ApiPropertyOptional({ description: '接收人钉钉ID列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  receiverDingtalkIds?: string[]

  @ApiPropertyOptional({ description: '接收人手机号列表 (短信通知)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  receiverPhones?: string[]

  @ApiPropertyOptional({ description: '关联业务ID' })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiPropertyOptional({ description: '关联业务类型' })
  @IsOptional()
  @IsString()
  businessType?: string

  @ApiPropertyOptional({ description: '跳转链接' })
  @IsOptional()
  @IsString()
  link?: string

  @ApiPropertyOptional({ description: '附加数据' })
  @IsOptional()
  @IsObject()
  extraData?: Record<string, unknown>

  @ApiPropertyOptional({ description: '计划发送时间' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledAt?: Date

  @ApiPropertyOptional({ description: '过期时间' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date

  @ApiPropertyOptional({ description: '紧急程度', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(3)
  priority?: number = 0
}

/** 消息查询参数 */
export class MessageQueryDto {
  @ApiPropertyOptional({ description: '接收人ID' })
  @IsOptional()
  @IsString()
  receiverId?: string

  @ApiPropertyOptional({ description: '消息类型', enum: MessageType })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType

  @ApiPropertyOptional({ description: '消息状态', enum: MessageStatus })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus

  @ApiPropertyOptional({ description: '是否已读' })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean

  @ApiPropertyOptional({ description: '业务ID' })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiPropertyOptional({ description: '关键词搜索' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date

  @ApiPropertyOptional({ description: '结束时间' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date

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

/** 标记消息已读请求 */
export class MarkReadDto {
  @ApiPropertyOptional({ description: '消息ID列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  messageIds?: string[]

  @ApiPropertyOptional({ description: '标记全部已读' })
  @IsOptional()
  @IsBoolean()
  markAll?: boolean = false
}

// ============================================
// 消息模板 DTO
// ============================================

/** 创建消息模板请求 */
export class CreateTemplateDto {
  @ApiProperty({ description: '模板名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '模板编码 (唯一标识)' })
  @IsString()
  code: string

  @ApiPropertyOptional({ description: '模板描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: '模板类型', enum: MessageType })
  @IsEnum(MessageType)
  type: MessageType

  @ApiProperty({ description: '模板标题 (支持变量如 ${name})' })
  @IsString()
  titleTemplate: string

  @ApiPropertyOptional({ description: '模板内容 (支持变量)' })
  @IsOptional()
  @IsString()
  contentTemplate?: string

  @ApiPropertyOptional({ description: '支持的通知渠道', enum: NotifyChannel, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(NotifyChannel, { each: true })
  supportedChannels?: NotifyChannel[]

  @ApiPropertyOptional({ description: '变量定义列表' })
  @IsOptional()
  @IsArray()
  variables?: TemplateVariableDto[]

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true
}

/** 模板变量定义 */
export class TemplateVariableDto {
  @ApiProperty({ description: '变量名' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '变量描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '默认值' })
  @IsOptional()
  @IsString()
  defaultValue?: string

  @ApiPropertyOptional({ description: '是否必填' })
  @IsOptional()
  @IsBoolean()
  required?: boolean = false
}

/** 使用模板发送消息请求 */
export class SendTemplateMessageDto {
  @ApiProperty({ description: '模板编码' })
  @IsString()
  templateCode: string

  @ApiPropertyOptional({ description: '变量值' })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>

  @ApiPropertyOptional({ description: '接收人ID列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  receiverIds?: string[]

  @ApiPropertyOptional({ description: '接收人邮箱列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  receiverEmails?: string[]

  @ApiPropertyOptional({ description: '业务ID' })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiPropertyOptional({ description: '跳转链接' })
  @IsOptional()
  @IsString()
  link?: string
}

// ============================================
// 用户通知偏好 DTO
// ============================================

/** 创建/更新通知偏好请求 */
export class NotificationPreferenceDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  userId: string

  @ApiPropertyOptional({ description: '消息类型偏好设置' })
  @IsOptional()
  typePreferences?: Record<MessageType, boolean>

  @ApiPropertyOptional({ description: '渠道偏好设置' })
  @IsOptional()
  channelPreferences?: Record<NotifyChannel, boolean>

  @ApiPropertyOptional({ description: '免打扰时间段' })
  @IsOptional()
  quietHours?: QuietHoursDto

  @ApiPropertyOptional({ description: '是否接收汇总消息' })
  @IsOptional()
  @IsBoolean()
  receiveDigest?: boolean = true

  @ApiPropertyOptional({ description: '汇总发送频率 (天)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  digestFrequencyDays?: number = 1
}

/** 免打扰时间段配置 */
export class QuietHoursDto {
  @ApiPropertyOptional({ description: '开始时间 (HH:mm格式)' })
  @IsOptional()
  @IsString()
  startTime?: string = '22:00'

  @ApiPropertyOptional({ description: '结束时间 (HH:mm格式)' })
  @IsOptional()
  @IsString()
  endTime?: string = '08:00'

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = false
}

// ============================================
// 钉钉通知 DTO
// ============================================

/** 发送钉钉通知请求 */
export class SendDingtalkDto {
  @ApiPropertyOptional({ description: '接收人钉钉ID列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userIds?: string[]

  @ApiPropertyOptional({ description: '接收人手机号列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[]

  @ApiProperty({ description: '消息标题' })
  @IsString()
  title: string

  @ApiPropertyOptional({ description: '消息内容' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ description: '消息链接' })
  @IsOptional()
  @IsString()
  link?: string

  @ApiPropertyOptional({ description: '消息类型', enum: ['text', 'link', 'markdown'] })
  @IsOptional()
  @IsString()
  msgType?: string = 'text'
}