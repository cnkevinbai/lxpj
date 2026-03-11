import { IsString, IsOptional, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator'

export class CreateOpportunityDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  customerId: string

  @IsOptional()
  @IsString()
  stage?: string

  @IsOptional()
  @IsArray()
  products?: Array<{ productId: string; quantity: number; config: string }>

  @IsOptional()
  @IsNumber()
  estimatedAmount?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number

  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string

  @IsOptional()
  ownerId?: string
}

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  stage?: string

  @IsOptional()
  @IsArray()
  products?: Array<{ productId: string; quantity: number; config: string }>

  @IsOptional()
  @IsNumber()
  estimatedAmount?: number

  @IsOptional()
  @IsNumber()
  actualAmount?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number

  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string

  @IsOptional()
  @IsDateString()
  actualCloseDate?: string
}
