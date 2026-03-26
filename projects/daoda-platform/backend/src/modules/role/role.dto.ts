/**
 * 角色管理模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsEnum, IsBoolean } from 'class-validator'
import { RoleStatus } from '@prisma/client'

/**
 * 创建角色 DTO
 */
export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '角色编码' })
  @IsString()
  code: string

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '权限列表', type: [String], default: [] })
  @IsOptional()
  @IsArray()
  permissions?: string[]

  @ApiPropertyOptional({ description: '角色状态', enum: RoleStatus, default: RoleStatus.ACTIVE })
  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus
}

/**
 * 更新角色 DTO
 */
export class UpdateRoleDto {
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '角色编码' })
  @IsOptional()
  @IsString()
  code?: string

  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '权限列表', type: [String] })
  @IsOptional()
  @IsArray()
  permissions?: string[]

  @ApiPropertyOptional({ description: '角色状态', enum: RoleStatus })
  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus
}

/**
 * 角色权限更新 DTO
 */
export class UpdateRolePermissionsDto {
  @ApiProperty({ description: '权限列表' })
  @IsArray()
  permissions: string[]
}

/**
 * 角色查询 DTO
 */
export class RoleQueryDto {
  @ApiPropertyOptional({ description: '搜索关键词（名称或编码）' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '状态筛选', enum: RoleStatus })
  @IsOptional()
  @IsEnum(RoleStatus)
  status?: RoleStatus

  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  pageSize?: number
}

/**
 * 角色列表响应 DTO
 */
export class RoleListResponse {
  @ApiProperty({ description: '角色列表' })
  list: any[]

  @ApiProperty({ description: '总数' })
  total: number

  @ApiProperty({ description: '当前页码' })
  page: number

  @ApiProperty({ description: '每页数量' })
  pageSize: number
}

/**
 * 角色权限响应 DTO
 */
export class RolePermissionsResponse {
  @ApiProperty({ description: '角色 ID' })
  id: string

  @ApiProperty({ description: '角色名称' })
  name: string

  @ApiProperty({ description: '权限列表' })
  permissions: string[]
}
