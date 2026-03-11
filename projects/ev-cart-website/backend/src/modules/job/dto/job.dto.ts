import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsDateString } from 'class-validator'

export class CreateJobDto {
  @IsString()
  title: string

  @IsString()
  department: string

  @IsString()
  location: string

  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'intern'])
  type?: string

  @IsOptional()
  @IsString()
  level?: string

  @IsOptional()
  @IsString()
  salaryRange?: string

  @IsString()
  description: string

  @IsArray()
  requirements: string[]

  @IsOptional()
  @IsArray()
  benefits?: string[]

  @IsOptional()
  @IsEnum(['active', 'closed'])
  status?: string

  @IsOptional()
  @IsDateString()
  applyDeadline?: string
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  department?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  requirements?: string[]

  @IsOptional()
  @IsArray()
  benefits?: string[]

  @IsOptional()
  @IsEnum(['active', 'closed'])
  status?: string

  @IsOptional()
  @IsDateString()
  applyDeadline?: string
}

export class CreateApplicationDto {
  @IsString()
  name: string

  @IsString()
  phone: string

  @IsString()
  email: string

  @IsOptional()
  @IsString()
  resumeUrl?: string

  @IsOptional()
  @IsString()
  education?: string

  @IsOptional()
  @IsString()
  major?: string

  @IsOptional()
  @IsNumber()
  experienceYears?: number

  @IsOptional()
  @IsString()
  currentCompany?: string

  @IsOptional()
  @IsString()
  expectedSalary?: string

  @IsOptional()
  @IsString()
  message?: string
}
