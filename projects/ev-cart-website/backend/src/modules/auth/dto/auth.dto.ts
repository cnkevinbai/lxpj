import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}

export class RegisterDto {
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

export class RefreshTokenDto {
  @IsString()
  refreshToken: string
}
