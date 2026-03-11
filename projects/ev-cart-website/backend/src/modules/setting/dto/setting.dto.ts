import { IsString, IsOptional, IsEnum } from 'class-validator'

export class CreateSettingDto {
  @IsString()
  key: string

  @IsString()
  value: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateSettingDto {
  @IsOptional()
  @IsString()
  value?: string

  @IsOptional()
  @IsString()
  description?: string
}
