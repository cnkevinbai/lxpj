import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: '客户名称', example: 'XX 有限公司' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '客户类型', enum: ['ENTERPRISE', 'INDIVIDUAL', 'GOVERNMENT'] })
  @IsEnum(['ENTERPRISE', 'INDIVIDUAL', 'GOVERNMENT'])
  @IsNotEmpty()
  type: 'ENTERPRISE' | 'INDIVIDUAL' | 'GOVERNMENT';

  @ApiProperty({ description: '行业', required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ description: '客户等级', enum: ['A', 'B', 'C'], required: false })
  @IsEnum(['A', 'B', 'C'])
  @IsOptional()
  level?: 'A' | 'B' | 'C';

  @ApiProperty({ description: '电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: '地址', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: '联系人', required: false })
  @IsString()
  @IsOptional()
  contactName?: string;

  @ApiProperty({ description: '联系人电话', required: false })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiProperty({ description: '负责人 ID', required: false })
  @IsString()
  @IsOptional()
  ownerId?: string;
}

export class UpdateCustomerDto {
  @ApiProperty({ description: '客户名称', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '客户类型', required: false })
  @IsEnum(['ENTERPRISE', 'INDIVIDUAL', 'GOVERNMENT'])
  @IsOptional()
  type?: 'ENTERPRISE' | 'INDIVIDUAL' | 'GOVERNMENT';

  @ApiProperty({ description: '行业', required: false })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty({ description: '客户等级', required: false })
  @IsEnum(['A', 'B', 'C'])
  @IsOptional()
  level?: 'A' | 'B' | 'C';

  @ApiProperty({ description: '电话', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: '邮箱', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}
