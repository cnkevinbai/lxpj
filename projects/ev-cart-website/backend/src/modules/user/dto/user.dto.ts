import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  username: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEnum(['admin', 'manager', 'sales', 'support'])
  role?: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsOptional()
  @IsEnum(['admin', 'manager', 'sales', 'support'])
  role?: string

  @IsOptional()
  @IsEnum(['active', 'inactive', 'locked'])
  status?: string
}
