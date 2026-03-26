/**
 * 系统配置模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ConfigType } from '@prisma/client'

/**
 * 创建系统配置 DTO
 */
export class CreateSystemConfigDto {
  @ApiProperty({ description: '配置键' })
  @IsString()
  key: string

  @ApiProperty({ description: '配置值' })
  @IsString()
  value: string

  @ApiPropertyOptional({ description: '配置类型', enum: ConfigType, default: ConfigType.TEXT })
  @IsOptional()
  @IsEnum(ConfigType)
  type?: ConfigType

  @ApiPropertyOptional({ description: '配置分组' })
  @IsOptional()
  @IsString()
  group?: string

  @ApiPropertyOptional({ description: '显示名称' })
  @IsOptional()
  @IsString()
  label?: string

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  desc?: string
}

/**
 * 更新系统配置 DTO
 */
export class UpdateSystemConfigDto {
  @ApiPropertyOptional({ description: '配置值' })
  @IsOptional()
  @IsString()
  value?: string

  @ApiPropertyOptional({ description: '配置类型', enum: ConfigType })
  @IsOptional()
  @IsEnum(ConfigType)
  type?: ConfigType

  @ApiPropertyOptional({ description: '配置分组' })
  @IsOptional()
  @IsString()
  group?: string

  @ApiPropertyOptional({ description: '显示名称' })
  @IsOptional()
  @IsString()
  label?: string

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  desc?: string
}

/**
 * 系统配置查询 DTO
 */
export class SystemConfigQueryDto {
  @ApiPropertyOptional({ description: '配置分组' })
  @IsOptional()
  @IsString()
  group?: string

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string
}
