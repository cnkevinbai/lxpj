import { IsString, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * Interview DTO
 */
export class CreateInterviewDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateInterviewDto extends CreateInterviewDto {}

export class InterviewQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string
}
