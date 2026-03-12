import { IsString, IsOptional, IsEmail, IsEnum, IsUUID, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateResumeDto {
  @ApiProperty({ description: '候选人姓名' })
  @IsString()
  candidateName: string

  @ApiProperty({ description: '联系电话' })
  @IsString()
  phone: string

  @ApiProperty({ description: '联系邮箱' })
  @IsEmail()
  email: string

  @ApiProperty({ description: '学历', required: false })
  @IsOptional()
  @IsString()
  education?: string

  @ApiProperty({ description: '专业', required: false })
  @IsOptional()
  @IsString()
  major?: string

  @ApiProperty({ description: '工作经验', required: false })
  @IsOptional()
  @IsString()
  experience?: string

  @ApiProperty({ description: '当前公司', required: false })
  @IsOptional()
  @IsString()
  currentCompany?: string

  @ApiProperty({ description: '当前职位', required: false })
  @IsOptional()
  @IsString()
  position?: string

  @ApiProperty({ description: '期望薪资', required: false })
  @IsOptional()
  @IsString()
  expectedSalary?: string

  @ApiProperty({ description: '应聘职位 ID', required: false })
  @IsOptional()
  @IsUUID()
  jobId?: string

  @ApiProperty({ description: '简历来源', required: false, enum: ['website', 'zhilian', '51job', 'boss', 'liepin', 'linkedin', 'referral', 'campus'] })
  @IsOptional()
  @IsEnum(['website', 'zhilian', '51job', 'boss', 'liepin', 'linkedin', 'referral', 'campus'])
  source?: string

  @ApiProperty({ description: '简历文件 URL', required: false })
  @IsOptional()
  @IsString()
  resumeUrl?: string

  @ApiProperty({ description: '简历内容', required: false })
  @IsOptional()
  @IsString()
  resumeContent?: string
}

export class UpdateResumeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  candidateName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  education?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  major?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experience?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currentCompany?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  position?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expectedSalary?: string

  @ApiProperty({ required: false, enum: ['new', 'screening', 'interview', 'offer', 'rejected', 'hired'] })
  @IsOptional()
  @IsEnum(['new', 'screening', 'interview', 'offer', 'rejected', 'hired'])
  status?: string
}

export class ImportResumeDto {
  @ApiProperty({ description: '简历文件内容（Base64）' })
  @IsString()
  fileContent: string

  @ApiProperty({ description: '文件名' })
  @IsString()
  fileName: string

  @ApiProperty({ description: '来源', required: false })
  @IsOptional()
  @IsString()
  source?: string
}
