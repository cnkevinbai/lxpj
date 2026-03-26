import { IsString, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Resume DTO
 */
export class CreateResumeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateResumeDto extends CreateResumeDto {}

export class ResumeQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string
}
