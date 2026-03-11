import { IsString, IsOptional, IsArray, IsNumber, IsDateString } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  customerId: string

  @IsOptional()
  @IsString()
  opportunityId?: string

  @IsArray()
  products: Array<{ productId: string; quantity: number; price: number; config: string }>

  @IsNumber()
  totalAmount: number

  @IsOptional()
  @IsString()
  deliveryAddress?: string

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string

  @IsOptional()
  notes?: string
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsString()
  paymentStatus?: string

  @IsOptional()
  @IsNumber()
  paidAmount?: number

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string

  @IsOptional()
  @IsDateString()
  actualDeliveryDate?: string

  @IsOptional()
  notes?: string
}
