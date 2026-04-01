/**
 * 客户满意度 DTO
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator'

export enum SurveyType {
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
  OVERALL = 'OVERALL',
  NPS = 'NPS',
  CSAT = 'CSAT',
  CES = 'CES',
}

export enum QuestionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
  SCALE = 'SCALE',
  TEXT = 'TEXT',
  NPS = 'NPS',
  RATING = 'RATING',
}

export enum ComplaintLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateSurveyDto {
  @ApiProperty({ description: '调查名称', example: '2026年Q1客户满意度调查' })
  @IsString()
  surveyName: string

  @ApiProperty({ description: '调查类型', enum: SurveyType, example: SurveyType.OVERALL })
  @IsEnum(SurveyType)
  surveyType: SurveyType

  @ApiProperty({ description: '问题列表', isArray: true })
  @IsArray()
  questions: {
    questionText: string
    questionType: QuestionType
    required: boolean
    options?: { value: string; label: string; score?: number }[]
    scaleMin?: number
    scaleMax?: number
  }[]

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsString()
  startDate?: string

  @ApiPropertyOptional({ description: '结束日期' })
  @IsOptional()
  @IsString()
  endDate?: string
}

export class SubmitResponseDto {
  @ApiProperty({ description: '受访者类型', enum: ['CUSTOMER', 'CONTACT'] })
  @IsString()
  respondentType: string

  @ApiProperty({ description: '受访者ID' })
  @IsString()
  respondentId: string

  @ApiProperty({ description: '受访者姓名' })
  @IsString()
  respondentName: string

  @ApiProperty({ description: '答案列表', isArray: true })
  @IsArray()
  answers: {
    questionId: string
    questionText: string
    answerType: QuestionType
    answer: any
    score?: number
  }[]

  @ApiPropertyOptional({ description: '文本反馈' })
  @IsOptional()
  @IsString()
  feedback?: string

  @ApiPropertyOptional({ description: '是否需要跟进' })
  @IsOptional()
  @IsBoolean()
  needsFollowUp?: boolean
}

export class CreateComplaintDto {
  @ApiProperty({ description: '客户ID' })
  @IsString()
  customerId: string

  @ApiProperty({ description: '客户姓名' })
  @IsString()
  customerName: string

  @ApiPropertyOptional({ description: '客户电话' })
  @IsOptional()
  @IsString()
  customerPhone?: string

  @ApiProperty({ description: '投诉类型' })
  @IsString()
  complaintType: string

  @ApiProperty({ description: '投诉级别', enum: ComplaintLevel })
  @IsEnum(ComplaintLevel)
  complaintLevel: ComplaintLevel

  @ApiProperty({ description: '投诉标题' })
  @IsString()
  title: string

  @ApiProperty({ description: '投诉描述' })
  @IsString()
  description: string
}

export class ResolveComplaintDto {
  @ApiProperty({ description: '解决方案' })
  @IsString()
  resolution: string

  @ApiPropertyOptional({ description: '赔偿金额' })
  @IsOptional()
  @IsNumber()
  compensation?: number
}

export class CloseComplaintDto {
  @ApiProperty({ description: '满意度评分', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  satisfactionScore: number

  @ApiPropertyOptional({ description: '满意度反馈' })
  @IsOptional()
  @IsString()
  feedback?: string
}
