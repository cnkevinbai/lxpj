import { IsString, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * DealerAssessment DTO
 */
export class CreateDealerAssessmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateDealerAssessmentDto extends CreateDealerAssessmentDto {}

export class DealerAssessmentQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string
}
