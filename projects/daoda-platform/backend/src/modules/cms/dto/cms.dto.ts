/**
 * CMS 内容管理系统 DTO
 * 内容版本、多站点、发布工作流、SEO 相关数据传输对象
 *
 * @version 1.0.0
 * @since 2026-04-01
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsDate, IsEnum, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'

// ============================================
// 内容版本 DTO
// ============================================

/** 内容状态枚举 */
export enum ContentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/** 创建内容版本请求 */
export class CreateContentVersionDto {
  @ApiProperty({ description: '内容标题' })
  @IsString()
  title: string

  @ApiPropertyOptional({ description: '内容正文' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ description: '内容摘要' })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiPropertyOptional({ description: '作者ID' })
  @IsOptional()
  @IsString()
  authorId?: string

  @ApiPropertyOptional({ description: '所属站点ID' })
  @IsOptional()
  @IsString()
  siteId?: string

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsString()
  categoryId?: string

  @ApiPropertyOptional({ description: '标签列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiPropertyOptional({ description: '封面图片URL' })
  @IsOptional()
  @IsString()
  coverImage?: string

  @ApiPropertyOptional({ description: '附件列表' })
  @IsOptional()
  @IsArray()
  attachments?: string[]
}

/** 更新内容版本请求 */
export class UpdateContentVersionDto {
  @ApiPropertyOptional({ description: '内容标题' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: '内容正文' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ description: '内容摘要' })
  @IsOptional()
  @IsString()
  summary?: string

  @ApiPropertyOptional({ description: '标签列表' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiPropertyOptional({ description: '封面图片URL' })
  @IsOptional()
  @IsString()
  coverImage?: string
}

/** 内容版本查询参数 */
export class ContentVersionQueryDto {
  @ApiPropertyOptional({ description: '站点ID' })
  @IsOptional()
  @IsString()
  siteId?: string

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsString()
  categoryId?: string

  @ApiPropertyOptional({ description: '作者ID' })
  @IsOptional()
  @IsString()
  authorId?: string

  @ApiPropertyOptional({ description: '状态', enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus

  @ApiPropertyOptional({ description: '关键词搜索' })
  @IsOptional()
  @IsString()
  keyword?: string

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
// 多站点管理 DTO
// ============================================

/** 站点状态枚举 */
export enum SiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

/** 创建站点请求 */
export class CreateSiteDto {
  @ApiProperty({ description: '站点名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '站点域名' })
  @IsString()
  domain: string

  @ApiPropertyOptional({ description: '站点描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '站点Logo URL' })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional({ description: '主题配置' })
  @IsOptional()
  themeConfig?: Record<string, unknown>

  @ApiPropertyOptional({ description: '语言设置', default: 'zh-CN' })
  @IsOptional()
  @IsString()
  language?: string = 'zh-CN'

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true
}

/** 更新站点请求 */
export class UpdateSiteDto {
  @ApiPropertyOptional({ description: '站点名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '站点域名' })
  @IsOptional()
  @IsString()
  domain?: string

  @ApiPropertyOptional({ description: '站点描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '站点Logo URL' })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional({ description: '主题配置' })
  @IsOptional()
  themeConfig?: Record<string, unknown>

  @ApiPropertyOptional({ description: '语言设置' })
  @IsOptional()
  @IsString()
  language?: string

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

// ============================================
// 发布工作流 DTO
// ============================================

/** 发布动作枚举 */
export enum PublishAction {
  SUBMIT = 'submit',
  APPROVE = 'approve',
  REJECT = 'reject',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  ARCHIVE = 'archive',
}

/** 提交发布请求 */
export class SubmitPublishDto {
  @ApiProperty({ description: '内容ID' })
  @IsString()
  contentId: string

  @ApiPropertyOptional({ description: '发布备注' })
  @IsOptional()
  @IsString()
  notes?: string

  @ApiPropertyOptional({ description: '计划发布时间' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledPublishAt?: Date

  @ApiPropertyOptional({ description: '计划下线时间' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledUnpublishAt?: Date
}

/** 审核发布请求 */
export class ReviewPublishDto {
  @ApiProperty({ description: '内容ID' })
  @IsString()
  contentId: string

  @ApiProperty({ description: '审核动作', enum: PublishAction })
  @IsEnum(PublishAction)
  action: PublishAction

  @ApiPropertyOptional({ description: '审核意见' })
  @IsOptional()
  @IsString()
  comments?: string
}

// ============================================
// SEO 管理 DTO
// ============================================

/** 创建 SEO 配置请求 */
export class CreateSeoConfigDto {
  @ApiProperty({ description: '页面路径' })
  @IsString()
  path: string

  @ApiPropertyOptional({ description: 'SEO标题' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: 'SEO描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'SEO关键词' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[]

  @ApiPropertyOptional({ description: 'OG标题' })
  @IsOptional()
  @IsString()
  ogTitle?: string

  @ApiPropertyOptional({ description: 'OG描述' })
  @IsOptional()
  @IsString()
  ogDescription?: string

  @ApiPropertyOptional({ description: 'OG图片URL' })
  @IsOptional()
  @IsString()
  ogImage?: string

  @ApiPropertyOptional({ description: 'Canonical URL' })
  @IsOptional()
  @IsString()
  canonicalUrl?: string

  @ApiPropertyOptional({ description: '是否允许索引', default: true })
  @IsOptional()
  @IsBoolean()
  indexable?: boolean = true
}

/** 更新 SEO 配置请求 */
export class UpdateSeoConfigDto {
  @ApiPropertyOptional({ description: 'SEO标题' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: 'SEO描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'SEO关键词' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[]

  @ApiPropertyOptional({ description: 'OG标题' })
  @IsOptional()
  @IsString()
  ogTitle?: string

  @ApiPropertyOptional({ description: 'OG描述' })
  @IsOptional()
  @IsString()
  ogDescription?: string

  @ApiPropertyOptional({ description: 'OG图片URL' })
  @IsOptional()
  @IsString()
  ogImage?: string

  @ApiPropertyOptional({ description: 'Canonical URL' })
  @IsOptional()
  @IsString()
  canonicalUrl?: string

  @ApiPropertyOptional({ description: '是否允许索引' })
  @IsOptional()
  @IsBoolean()
  indexable?: boolean
}