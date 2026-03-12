import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator'

export class CreatePurchaseRequestDto {
  @IsString()
  @IsNotEmpty()
  department_id: string

  @IsString()
  @IsNotEmpty()
  applicant_id: string

  @IsOptional()
  items?: any[]

  @IsOptional()
  remark?: string
}

export class CreatePurchaseOrderDto {
  @IsString()
  @IsNotEmpty()
  supplier_id: string

  @IsOptional()
  request_id?: string

  @IsOptional()
  items?: any[]

  @IsOptional()
  @IsDateString()
  delivery_date?: string
}
