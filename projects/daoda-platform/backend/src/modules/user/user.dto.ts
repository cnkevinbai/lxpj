import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator'
import { UserRole } from '../../common/enums/user-role.enum'
import { UserStatus } from '@prisma/client'

export class CreateUserDto {
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

  @IsString()
  @IsOptional()
  phone?: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus
}

export class UserQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number

  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus
}
