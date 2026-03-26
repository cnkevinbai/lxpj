import { IsString, IsBoolean, IsOptional, IsInt, IsJSON } from 'class-validator'

export class CreateModuleConfigDto {
  @IsString()
  moduleCode: string

  @IsString()
  moduleName: string

  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  config?: any

  @IsInt()
  @IsOptional()
  sortOrder?: number
}

export class UpdateModuleConfigDto {
  @IsString()
  @IsOptional()
  moduleName?: string

  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  config?: any

  @IsInt()
  @IsOptional()
  sortOrder?: number
}

export class ModuleConfigQueryDto {
  @IsOptional()
  enabled?: boolean
}
