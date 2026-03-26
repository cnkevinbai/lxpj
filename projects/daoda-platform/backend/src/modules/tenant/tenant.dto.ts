/**
 * 租户管理 DTO
 */
import { IsString, IsBoolean, IsOptional, IsInt, IsEnum, IsDateString, Min } from 'class-validator'

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

export class CreateTenantDto {
  @IsString()
  code: string

  @IsString()
  name: string

  @IsString()
  @IsOptional()
  logo?: string

  @IsEnum(TenantStatus)
  @IsOptional()
  status?: TenantStatus

  @IsString()
  @IsOptional()
  plan?: string

  @IsInt()
  @Min(1)
  @IsOptional()
  maxUsers?: number

  @IsDateString()
  @IsOptional()
  expireAt?: string

  @IsOptional()
  config?: any
}

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  logo?: string

  @IsEnum(TenantStatus)
  @IsOptional()
  status?: TenantStatus

  @IsString()
  @IsOptional()
  plan?: string

  @IsInt()
  @Min(1)
  @IsOptional()
  maxUsers?: number

  @IsDateString()
  @IsOptional()
  expireAt?: string

  @IsOptional()
  config?: any
}

export class TenantQueryDto {
  @IsOptional()
  keyword?: string

  @IsEnum(TenantStatus)
  @IsOptional()
  status?: TenantStatus

  @IsInt()
  @IsOptional()
  page?: number

  @IsInt()
  @IsOptional()
  pageSize?: number
}