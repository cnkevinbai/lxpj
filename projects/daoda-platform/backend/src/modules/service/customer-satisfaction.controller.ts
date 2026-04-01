/**
 * 客户满意度控制器
 * API 接口：满意度调查、投诉管理、客户反馈、满意度分析
 */
import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import {
  CustomerSatisfactionService,
  SurveyType,
  SurveyStatus,
  QuestionType,
  ComplaintStatus,
  ComplaintLevel,
  FeedbackType,
} from './customer-satisfaction.service'
import {
  CreateSurveyDto,
  SubmitResponseDto,
  CreateComplaintDto,
  ResolveComplaintDto,
  CloseComplaintDto,
} from './dto/satisfaction.dto'

@ApiTags('客户满意度')
@ApiBearerAuth()
@Controller('api/service/satisfaction')
export class CustomerSatisfactionController {
  constructor(private readonly service: CustomerSatisfactionService) {}

  // ========== 满意度调查管理 ==========

  @Get('surveys')
  @ApiOperation({ summary: '获取调查列表', description: '查询满意度调查列表' })
  getSurveys(@Query() params?: any) {
    return this.service.getSurveys(params)
  }

  @Get('surveys/:id')
  @ApiOperation({ summary: '获取调查详情', description: '根据ID获取满意度调查详细信息' })
  getSurvey(@Param('id') id: string) {
    return this.service.getSurvey(id)
  }

  @Post('surveys')
  @ApiOperation({ summary: '创建调查', description: '创建新的满意度调查' })
  createSurvey(@Body() survey: CreateSurveyDto) {
    return this.service.createSurvey(survey as any)
  }

  @Post('surveys/:id/publish')
  @ApiOperation({ summary: '发布调查', description: '发布满意度调查，开始收集回复' })
  publishSurvey(@Param('id') id: string) {
    return this.service.publishSurvey(id)
  }

  // ========== 调查回复管理 ==========

  @Post('surveys/:surveyId/responses')
  @ApiOperation({ summary: '提交回复', description: '提交满意度调查回复' })
  submitResponse(@Param('surveyId') surveyId: string, @Body() response: SubmitResponseDto) {
    return this.service.submitResponse(surveyId, response as any)
  }

  @Get('surveys/:surveyId/responses')
  @ApiOperation({ summary: '获取回复列表', description: '查询满意度调查回复列表' })
  getResponses(@Param('surveyId') surveyId: string, @Query() params?: any) {
    return this.service.getResponses(surveyId, params)
  }

  // ========== 投诉管理 ==========

  @Get('complaints')
  @ApiOperation({ summary: '获取投诉列表', description: '查询客户投诉列表' })
  getComplaints(@Query() params?: any) {
    return this.service.getComplaints(params)
  }

  @Get('complaints/:id')
  @ApiOperation({ summary: '获取投诉详情', description: '根据ID获取投诉详细信息' })
  getComplaint(@Param('id') id: string) {
    return this.service.getComplaint(id)
  }

  @Post('complaints')
  @ApiOperation({ summary: '创建投诉', description: '创建新的客户投诉' })
  createComplaint(@Body() complaint: CreateComplaintDto) {
    return this.service.createComplaint(complaint as any)
  }

  @Post('complaints/:id/assign')
  @ApiOperation({ summary: '分配投诉', description: '将投诉分配给处理人' })
  assignComplaint(
    @Param('id') id: string,
    @Body('handlerId') handlerId: string,
    @Body('handlerName') handlerName: string,
  ) {
    return this.service.assignComplaint(id, handlerId, handlerName)
  }

  @Post('complaints/:id/resolve')
  @ApiOperation({ summary: '解决投诉', description: '标记投诉为已解决' })
  resolveComplaint(@Param('id') id: string, @Body() body: ResolveComplaintDto) {
    return this.service.resolveComplaint(id, body.resolution, body.compensation)
  }

  @Post('complaints/:id/close')
  @ApiOperation({ summary: '关闭投诉', description: '关闭投诉并记录满意度' })
  closeComplaint(@Param('id') id: string, @Body() body: CloseComplaintDto) {
    return this.service.closeComplaint(id, body.satisfactionScore, body.feedback)
  }

  // ========== 客户反馈管理 ==========

  @Get('feedbacks')
  @ApiOperation({ summary: '获取反馈列表', description: '查询客户反馈列表' })
  getFeedbacks(@Query() params?: any) {
    return this.service.getFeedbacks(params)
  }

  @Post('feedbacks')
  @ApiOperation({ summary: '创建反馈', description: '创建新的客户反馈' })
  createFeedback(@Body() feedback: any) {
    return this.service.createFeedback(feedback)
  }

  // ========== 统计分析 ==========

  @Get('stats')
  @ApiOperation({ summary: '满意度统计', description: '获取客户满意度统计数据' })
  getStats() {
    return this.service.getStats()
  }
}
