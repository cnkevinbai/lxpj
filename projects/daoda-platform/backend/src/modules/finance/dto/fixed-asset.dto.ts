/**
 * 固定资产管理 DTO
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Min, IsDate } from 'class-validator'

export enum AssetCategory {
  LAND = 'LAND',
  BUILDING = 'BUILDING',
  MACHINERY = 'MACHINERY',
  VEHICLE = 'VEHICLE',
  ELECTRONIC = 'ELECTRONIC',
  FURNITURE = 'FURNITURE',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

export enum AssetStatus {
  IN_USE = 'IN_USE',
  IDLE = 'IDLE',
  MAINTENANCE = 'MAINTENANCE',
  DISPOSED = 'DISPOSED',
  SCRAPPED = 'SCRAPPED',
}

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DOUBLE_DECLINING = 'DOUBLE_DECLINING',
  SUM_OF_YEARS = 'SUM_OF_YEARS',
  UNITS_OF_PRODUCTION = 'UNITS_OF_PRODUCTION',
}

export class CreateFixedAssetDto {
  @ApiProperty({ description: '资产名称', example: 'Dell 服务器' })
  @IsString()
  assetName: string

  @ApiProperty({ description: '资产分类', enum: AssetCategory, example: AssetCategory.ELECTRONIC })
  @IsEnum(AssetCategory)
  category: AssetCategory

  @ApiPropertyOptional({ description: '规格型号' })
  @IsOptional()
  @IsString()
  specification?: string

  @ApiPropertyOptional({ description: '品牌' })
  @IsOptional()
  @IsString()
  brand?: string

  @ApiPropertyOptional({ description: '型号' })
  @IsOptional()
  @IsString()
  model?: string

  @ApiProperty({ description: '原值', example: 150000 })
  @IsNumber()
  @Min(0)
  originalValue: number

  @ApiProperty({ description: '残值', example: 15000 })
  @IsNumber()
  @Min(0)
  residualValue: number

  @ApiProperty({ description: '使用年限（月）', example: 60 })
  @IsNumber()
  @Min(1)
  usefulLife: number

  @ApiProperty({
    description: '折旧方法',
    enum: DepreciationMethod,
    example: DepreciationMethod.STRAIGHT_LINE,
  })
  @IsEnum(DepreciationMethod)
  depreciationMethod: DepreciationMethod

  @ApiPropertyOptional({ description: '购置日期' })
  @IsOptional()
  purchaseDate?: Date

  @ApiPropertyOptional({ description: '使用部门ID' })
  @IsOptional()
  @IsString()
  departmentId?: string

  @ApiPropertyOptional({ description: '存放地点' })
  @IsOptional()
  @IsString()
  location?: string
}

export class UpdateFixedAssetDto {
  @ApiPropertyOptional({ description: '资产名称' })
  @IsOptional()
  @IsString()
  assetName?: string

  @ApiPropertyOptional({ description: '存放地点' })
  @IsOptional()
  @IsString()
  location?: string

  @ApiPropertyOptional({ description: '使用部门ID' })
  @IsOptional()
  @IsString()
  departmentId?: string
}

export class CreateDisposeDto {
  @ApiProperty({ description: '资产ID' })
  @IsString()
  assetId: string

  @ApiProperty({ description: '处置方式', enum: ['SALE', 'TRANSFER', 'SCRAP', 'DONATION', 'LOSS'] })
  @IsString()
  disposeType: string

  @ApiProperty({ description: '处置原因' })
  @IsString()
  disposeReason: string

  @ApiPropertyOptional({ description: '处置价值' })
  @IsOptional()
  @IsNumber()
  disposeValue?: number
}
