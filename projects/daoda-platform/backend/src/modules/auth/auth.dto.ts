import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @IsOptional()
  name?: string
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string
}
