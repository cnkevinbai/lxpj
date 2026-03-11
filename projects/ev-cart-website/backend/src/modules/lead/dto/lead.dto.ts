import { IsString, IsOptional, IsEmail, IsEnum, IsNotEmpty } from 'class-validator'

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  company?: string

  @IsOptional()
  @IsString()
  productInterest?: string

  @IsOptional()
  @IsString()
  budget?: string

  @IsOptional()
  @IsEnum(['website', 'exhibition', 'referral', 'ad'])
  source?: string

  @IsOptional()
  ownerId?: string
}

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  company?: string

  @IsOptional()
  @IsString()
  productInterest?: string

  @IsOptional()
  @IsEnum(['new', 'contacted', 'qualified', 'converted', 'lost'])
  status?: string

  @IsOptional()
  ownerId?: string
}

export class ConvertLeadDto {
  @IsString()
  @IsNotEmpty()
  customerId: string
}
