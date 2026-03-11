import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsDateString } from 'class-validator'

export class CreateDealerDto {
  @IsString()
  companyName: string

  @IsString()
  contactPerson: string

  @IsString()
  contactPhone: string

  @IsString()
  contactEmail: string

  @IsString()
  province: string

  @IsString()
  city: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsNumber()
  latitude?: number

  @IsOptional()
  @IsNumber()
  longitude?: number

  @IsOptional()
  @IsEnum(['standard', 'gold', 'platinum'])
  level?: string

  @IsOptional()
  @IsString()
  authorizedArea?: string

  @IsOptional()
  @IsArray()
  authorizedProducts?: string[]

  @IsOptional()
  @IsDateString()
  contractStart?: string

  @IsOptional()
  @IsDateString()
  contractEnd?: string

  @IsOptional()
  @IsNumber()
  salesTarget?: number
}

export class UpdateDealerDto {
  @IsOptional()
  @IsString()
  contactPerson?: string

  @IsOptional()
  @IsString()
  contactPhone?: string

  @IsOptional()
  @IsString()
  contactEmail?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsNumber()
  latitude?: number

  @IsOptional()
  @IsNumber()
  longitude?: number

  @IsOptional()
  @IsEnum(['standard', 'gold', 'platinum'])
  level?: string

  @IsOptional()
  @IsString()
  authorizedArea?: string

  @IsOptional()
  @IsArray()
  authorizedProducts?: string[]

  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string

  @IsOptional()
  @IsDateString()
  contractStart?: string

  @IsOptional()
  @IsDateString()
  contractEnd?: string

  @IsOptional()
  @IsNumber()
  salesTarget?: number

  @IsOptional()
  @IsNumber()
  salesActual?: number
}
