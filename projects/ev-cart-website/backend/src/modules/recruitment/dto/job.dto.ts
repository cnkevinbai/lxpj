import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, Min, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateJobDto {
  @ApiProperty({ description: '职位名称' })
  @IsString()
  title: string

  @ApiProperty({ description: '所属部门' })
  @IsString()
  department: string

  @ApiProperty({ description: '工作地点' })
  @IsString()
  location: string

  @ApiProperty({ description: '职位类型', enum: ['full_time', 'part_time', 'intern', 'contract'] })
  @IsEnum(['full_time', 'part_time', 'intern', 'contract'])
  jobType: string

  @ApiProperty({ description: '经验要求' })
  @IsString()
  experience: string

  @ApiProperty({ description: '学历要求' })
  @IsString()
  education: string

  @ApiProperty({ description: '最低薪资' })
  @IsNumber()
  @Min(0)
  salaryMin: number

  @ApiProperty({ description: '最高薪资' })
  @IsNumber()
  @Min(0)
  salaryMax: number

  @ApiProperty({ description: '招聘人数' })
  @IsNumber()
  @Min(1)
  headcount: number

  @ApiProperty({ description: '岗位职责', required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ description: '任职要求', required: false })
  @IsOptional()
  @IsString()
  requirements?: string

  @ApiProperty({ description: '福利待遇', required: false })
  @IsOptional()
  @IsString()
  benefits?: string

  @ApiProperty({ description: '发布状态', enum: ['draft', 'published'], default: 'draft' })
  @IsEnum(['draft', 'published'])
  status?: string
}

export class UpdateJobDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  department?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experience?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  education?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMin?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryMax?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  headcount?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  requirements?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  benefits?: string

  @ApiProperty({ required: false, enum: ['draft', 'published', 'closed'] })
  @IsOptional()
  @IsEnum(['draft', 'published', 'closed'])
  status?: string
}

export class PublishJobDto {
  @ApiProperty({ description: '发布时间', required: false })
  @IsOptional()
  @IsDateString()
  publishedAt?: string
}
