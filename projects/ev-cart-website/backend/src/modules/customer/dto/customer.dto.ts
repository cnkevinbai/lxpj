import { IsString, IsOptional, IsEmail, IsEnum, IsNotEmpty } from 'class-validator'

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(['company', 'individual', 'government'])
  type: string

  @IsOptional()
  @IsString()
  industry?: string

  @IsOptional()
  @IsString()
  contactPerson?: string

  @IsOptional()
  @IsString()
  contactPhone?: string

  @IsOptional()
  @IsEmail()
  contactEmail?: string

  @IsOptional()
  address?: string

  @IsOptional()
  @IsString()
  province?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  source?: string

  @IsOptional()
  @IsEnum(['A', 'B', 'C'])
  level?: string

  @IsOptional()
  ownerId?: string
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEnum(['company', 'individual', 'government'])
  type?: string

  @IsOptional()
  @IsString()
  industry?: string

  @IsOptional()
  @IsString()
  contactPerson?: string

  @IsOptional()
  @IsString()
  contactPhone?: string

  @IsOptional()
  @IsEmail()
  contactEmail?: string

  @IsOptional()
  address?: string

  @IsOptional()
  @IsString()
  province?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsEnum(['potential', 'following', '成交', 'lost'])
  status?: string

  @IsOptional()
  @IsEnum(['A', 'B', 'C'])
  level?: string

  @IsOptional()
  ownerId?: string
}
