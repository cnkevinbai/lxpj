/**
 * API Key DTO
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean, IsDateString, IsInt, Min, IsArray, Max } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateApiKeyDto {
  @ApiProperty({ description: 'API Key 名称' })
  @IsString()
  name: string

  @ApiPropertyOptional({
    description: '权限列表',
    type: [String],
    example: ['read', 'write'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[]

  @ApiPropertyOptional({
    description: '每小时请求限制',
    minimum: 1,
    default: 1000,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  rateLimit?: number

  @ApiPropertyOptional({
    description: '过期时间',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  expireAt?: string

  @ApiPropertyOptional({
    description: '是否启用',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  enabled?: boolean
}

export class UpdateApiKeyDto {
  @ApiPropertyOptional({ description: 'API Key 名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description: '权限列表',
    type: [String],
    example: ['read', 'write'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[]

  @ApiPropertyOptional({
    description: '每小时请求限制',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  rateLimit?: number

  @ApiPropertyOptional({
    description: '过期时间',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  expireAt?: string

  @ApiPropertyOptional({
    description: '是否启用',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  enabled?: boolean
}

export class ApiKeyQueryDto {
  @ApiPropertyOptional({ description: '关键词搜索' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  enabled?: boolean

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10
}