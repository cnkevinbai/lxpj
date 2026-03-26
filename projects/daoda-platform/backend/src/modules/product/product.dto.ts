/**
 * 产品模块 DTO 定义
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsEnum, IsNumber, IsInt, Min, Max } from 'class-validator'
import { ProductStatus } from '@prisma/client'

export class CreateProductDto {
  @ApiProperty({ description: '产品名称' })
  @IsString()
  name: string

  @ApiProperty({ description: '产品编码' })
  @IsString()
  code: string

  @ApiProperty({ description: '产品分类' })
  @IsString()
  category: string

  @ApiProperty({ description: '产品系列' })
  @IsString()
  series: string

  @ApiProperty({ description: '产品价格' })
  @IsNumber()
  @Min(0)
  price: number

  @ApiPropertyOptional({ description: '产品描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '产品图片（JSON 数组）' })
  @IsOptional()
  @IsString()
  images?: string

  @ApiPropertyOptional({ description: '产品规格（JSON 对象）' })
  @IsOptional()
  @IsString()
  specs?: string

  @ApiPropertyOptional({ description: '产品状态', enum: ProductStatus, default: ProductStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus
}

export class UpdateProductDto {
  @ApiPropertyOptional({ description: '产品名称' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ description: '产品编码' })
  @IsOptional()
  @IsString()
  code?: string

  @ApiPropertyOptional({ description: '产品分类' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ description: '产品系列' })
  @IsOptional()
  @IsString()
  series?: string

  @ApiPropertyOptional({ description: '产品价格' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiPropertyOptional({ description: '产品描述' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: '产品图片（JSON 数组）' })
  @IsOptional()
  @IsString()
  images?: string

  @ApiPropertyOptional({ description: '产品规格（JSON 对象）' })
  @IsOptional()
  @IsString()
  specs?: string

  @ApiPropertyOptional({ description: '产品状态', enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus
}

export class ProductQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10

  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string

  @ApiPropertyOptional({ description: '分类' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ description: '系列' })
  @IsOptional()
  @IsString()
  series?: string

  @ApiPropertyOptional({ description: '状态', enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus

  @ApiPropertyOptional({ description: '最低价格' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number

  @ApiPropertyOptional({ description: '最高价格' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number
}

export interface ProductListResponse {
  list: any[]
  total: number
  page: number
  pageSize: number
}
