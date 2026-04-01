/**
 * 菜单管理模块 DTO 定义
 * 注意：Menu 模型字段: sortOrder (映射为 order), permission (映射为 permission), 无 component/code
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator'
import { MenuStatus, MenuType } from '@prisma/client'

/**
 * 创建菜单 DTO
 */
export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称' })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: '菜单编码' })
  @IsOptional()
  @IsString()
  code?: string

  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  @IsString()
  path?: string

  @ApiPropertyOptional({ description: '父菜单 ID' })
  @IsOptional()
  @IsString()
  parentId?: string

  @ApiPropertyOptional({ description: '排序', default: 0 })
  @IsOptional()
  @IsInt()
  order?: number

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional({ description: '类型：菜单/按钮', enum: MenuType, default: MenuType.MENU })
  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType

  @ApiPropertyOptional({ description: '权限标识' })
  @IsOptional()
  @IsString()
  permission?: string

  @ApiPropertyOptional({ description: '菜单状态', enum: MenuStatus, default: MenuStatus.ACTIVE })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus
}

/**
 * 更新菜单 DTO
 */
export class UpdateMenuDto {
  @ApiPropertyOptional({ description: '菜单名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '菜单编码' })
  @IsOptional()
  @IsString()
  code?: string

  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  @IsString()
  path?: string

  @ApiPropertyOptional({ description: '父菜单 ID' })
  @IsOptional()
  @IsString()
  parentId?: string

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsInt()
  order?: number

  @ApiPropertyOptional({ description: '图标' })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional({ description: '类型', enum: MenuType })
  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType

  @ApiPropertyOptional({ description: '权限标识' })
  @IsOptional()
  @IsString()
  permission?: string

  @ApiPropertyOptional({ description: '菜单状态', enum: MenuStatus })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus
}

/**
 * 菜单查询 DTO
 */
export class MenuQueryDto {
  @ApiPropertyOptional({ description: '状态筛选', enum: MenuStatus })
  @IsOptional()
  @IsEnum(MenuStatus)
  status?: MenuStatus
}

/**
 * 菜单树节点
 */
export class MenuTreeNode {
  id: string
  name: string
  code: string
  path: string
  parentId?: string
  order: number
  icon?: string
  type: MenuType
  permission?: string
  status: MenuStatus
  children: MenuTreeNode[]
  createdAt: Date
  updatedAt: Date
}
