import { IsString, IsOptional, IsUUID } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

/**
 * DealerRebate DTO
 */
export class CreateDealerRebateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateDealerRebateDto extends CreateDealerRebateDto {}

export class DealerRebateQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string
}
