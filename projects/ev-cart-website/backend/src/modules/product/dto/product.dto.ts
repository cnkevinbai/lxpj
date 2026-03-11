import { IsString, IsOptional, IsNumber, IsArray, IsEnum, Min, Max } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  model: string

  @IsString()
  category: string

  @IsNumber()
  passengerCapacity: number

  @IsOptional()
  @IsString()
  batteryType?: string

  @IsOptional()
  @IsNumber()
  rangeKm?: number

  @IsOptional()
  @IsNumber()
  maxSpeed?: number

  @IsOptional()
  @IsString()
  chargeTime?: string

  @IsOptional()
  @IsString()
  motorPower?: string

  @IsOptional()
  dimensions?: { length: number; width: number; height: number }

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsString()
  priceRange?: string

  @IsOptional()
  @IsEnum(['active', 'discontinued'])
  status?: string

  @IsOptional()
  @IsArray()
  images?: string[]

  @IsOptional()
  @IsArray()
  features?: string[]
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  model?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsNumber()
  passengerCapacity?: number

  @IsOptional()
  @IsString()
  batteryType?: string

  @IsOptional()
  @IsNumber()
  rangeKm?: number

  @IsOptional()
  @IsNumber()
  maxSpeed?: number

  @IsOptional()
  @IsString()
  chargeTime?: string

  @IsOptional()
  @IsString()
  motorPower?: string

  @IsOptional()
  dimensions?: { length: number; width: number; height: number }

  @IsOptional()
  @IsNumber()
  weight?: number

  @IsOptional()
  @IsString()
  priceRange?: string

  @IsOptional()
  @IsEnum(['active', 'discontinued'])
  status?: string

  @IsOptional()
  @IsArray()
  images?: string[]

  @IsOptional()
  @IsArray()
  features?: string[]
}
