import { IsString, IsOptional, IsUUID, IsDateString, IsEnum, IsNumber, Min, Max } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateInterviewDto {
  @ApiProperty({ description: '简历 ID' })
  @IsUUID()
  resumeId: string

  @ApiProperty({ description: '职位 ID', required: false })
  @IsOptional()
  @IsUUID()
  jobId?: string

  @ApiProperty({ description: '候选人姓名' })
  @IsString()
  candidateName: string

  @ApiProperty({ description: '候选人电话', required: false })
  @IsOptional()
  @IsString()
  candidatePhone?: string

  @ApiProperty({ description: '候选人邮箱', required: false })
  @IsOptional()
  @IsString()
  candidateEmail?: string

  @ApiProperty({ description: '面试类型', enum: ['phone', 'video', 'onsite'] })
  @IsEnum(['phone', 'video', 'onsite'])
  interviewType: string

  @ApiProperty({ description: '面试时间' })
  @IsDateString()
  scheduledAt: string

  @ApiProperty({ description: '预计时长（分钟）', default: 60 })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(180)
  duration?: number

  @ApiProperty({ description: '面试官' })
  @IsString()
  interviewer: string

  @ApiProperty({ description: '面试官邮箱', required: false })
  @IsOptional()
  @IsString()
  interviewerEmail?: string

  @ApiProperty({ description: '面试地点', required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ description: '会议链接', required: false })
  @IsOptional()
  @IsString()
  meetingLink?: string
}

export class UpdateInterviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  interviewer?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  meetingLink?: string

  @ApiProperty({ required: false, enum: ['scheduled', 'completed', 'cancelled', 'no_show'] })
  @IsOptional()
  @IsEnum(['scheduled', 'completed', 'cancelled', 'no_show'])
  status?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedback?: string

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number

  @ApiProperty({ required: false, enum: ['pass', 'fail', 'pending'] })
  @IsOptional()
  @IsEnum(['pass', 'fail', 'pending'])
  result?: string
}

export class InterviewFeedbackDto {
  @ApiProperty({ description: '面试官' })
  @IsString()
  interviewer: string

  @ApiProperty({ description: '综合评分', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ApiProperty({ description: '技术评分', required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  technicalScore?: number

  @ApiProperty({ description: '沟通评分', required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  communicationScore?: number

  @ApiProperty({ description: '文化匹配评分', required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  cultureFitScore?: number

  @ApiProperty({ description: '面试评语', required: false })
  @IsOptional()
  @IsString()
  comments?: string

  @ApiProperty({ description: '推荐意见', enum: ['strong_yes', 'yes', 'maybe', 'no', 'strong_no'], required: false })
  @IsOptional()
  @IsEnum(['strong_yes', 'yes', 'maybe', 'no', 'strong_no'])
  recommendation?: string
}
