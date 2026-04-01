/**
 * 营销自动化 DTO
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsEnum, IsOptional, IsArray, Min, IsBoolean } from 'class-validator'

export enum CampaignType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WECHAT = 'WECHAT',
  EVENT = 'EVENT',
  CONTENT = 'CONTENT',
  SOCIAL = 'SOCIAL',
}

export enum AudienceType {
  ALL = 'ALL',
  SEGMENT = 'SEGMENT',
  LEADS = 'LEADS',
  CUSTOMERS = 'CUSTOMERS',
  VIP = 'VIP',
  NEW = 'NEW',
  CUSTOM = 'CUSTOM',
}

export class CreateCampaignDto {
  @ApiProperty({ description: '活动名称', example: '2026春季新品推广' })
  @IsString()
  campaignName: string

  @ApiProperty({ description: '活动类型', enum: CampaignType, example: CampaignType.EMAIL })
  @IsEnum(CampaignType)
  campaignType: CampaignType

  @ApiProperty({ description: '受众类型', enum: AudienceType, example: AudienceType.CUSTOMERS })
  @IsEnum(AudienceType)
  audienceType: AudienceType

  @ApiPropertyOptional({ description: '目标人数' })
  @IsOptional()
  @IsNumber()
  targetCount?: number

  @ApiPropertyOptional({ description: '邮件主题' })
  @IsOptional()
  @IsString()
  subject?: string

  @ApiProperty({ description: '内容' })
  @IsString()
  content: string

  @ApiPropertyOptional({ description: '模板ID' })
  @IsOptional()
  @IsString()
  templateId?: string

  @ApiPropertyOptional({ description: '预算' })
  @IsOptional()
  @IsNumber()
  budget?: number

  @ApiPropertyOptional({ description: '标签', isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]
}

export class CreateSegmentDto {
  @ApiProperty({ description: '分群名称', example: '高价值客户' })
  @IsString()
  segmentName: string

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: '条件列表', isArray: true })
  @IsArray()
  conditions: {
    field: string
    operator: string
    value: any
  }[]

  @ApiPropertyOptional({ description: '是否动态更新' })
  @IsOptional()
  @IsBoolean()
  isDynamic?: boolean

  @ApiPropertyOptional({ description: '更新频率' })
  @IsOptional()
  @IsString()
  updateFrequency?: string
}

export class CreateTemplateDto {
  @ApiProperty({ description: '模板名称', example: '产品推广模板' })
  @IsString()
  templateName: string

  @ApiProperty({ description: '模板类型', enum: CampaignType })
  @IsEnum(CampaignType)
  type: CampaignType

  @ApiPropertyOptional({ description: '邮件主题模板' })
  @IsOptional()
  @IsString()
  subject?: string

  @ApiProperty({ description: '内容模板' })
  @IsString()
  content: string

  @ApiPropertyOptional({ description: '变量列表', isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[]
}
