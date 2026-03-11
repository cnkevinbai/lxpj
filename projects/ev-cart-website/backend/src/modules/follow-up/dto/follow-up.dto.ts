import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator'

/**
 * 创建跟进记录 DTO
 */
export class CreateFollowUpDto {
  @IsString()
  targetType: string // 'lead' or 'customer'

  @IsString()
  targetId: string

  @IsString()
  userId: string

  @IsEnum(['phone', 'visit', 'wechat', 'email', 'other'])
  followType: string

  @IsString()
  content: string

  @IsOptional()
  @IsDateString()
  nextFollowupDate?: string

  @IsOptional()
  @IsString()
  nextFollowupPlan?: string
}

/**
 * 更新跟进记录 DTO
 */
export class UpdateFollowUpDto {
  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsDateString()
  nextFollowupDate?: string

  @IsOptional()
  @IsString()
  nextFollowupPlan?: string

  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled'])
  status?: string
}

/**
 * 跟进统计 DTO
 */
export class FollowUpStatsDto {
  @IsDateString()
  startDate: string

  @IsDateString()
  endDate: string
}
