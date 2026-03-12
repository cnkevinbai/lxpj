import { Controller, Get, Post, Body, Param, Put, Delete, Query, ParseUUIDPipe, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { InterviewService } from './interview.service'
import { CreateInterviewDto, UpdateInterviewDto } from './dto/interview.dto'

@ApiTags('面试管理')
@ApiBearerAuth()
@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post()
  @ApiOperation({ summary: '创建面试' })
  create(@Body() createInterviewDto: CreateInterviewDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    return this.interviewService.create(createInterviewDto, userId)
  }

  @Get()
  @ApiOperation({ summary: '获取面试列表' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('jobId') jobId?: string,
    @Query('resumeId') resumeId?: string,
    @Query('status') status?: string,
    @Query('interviewer') interviewer?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.interviewService.findAll({ page, limit, jobId, resumeId, status, interviewer, dateFrom, dateTo })
  }

  @Get('calendar')
  @ApiOperation({ summary: '获取日历视图' })
  getCalendar(@Query('date') date: string, @Query('interviewer') interviewer?: string) {
    return this.interviewService.getCalendar(date, interviewer)
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取面试统计' })
  getStatistics() {
    return this.interviewService.getStatistics()
  }

  @Get(':id')
  @ApiOperation({ summary: '获取面试详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.interviewService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新面试' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewService.update(id, updateInterviewDto)
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '取消面试' })
  cancel(@Param('id', ParseUUIDPipe) id: string, @Body('reason') reason?: string) {
    return this.interviewService.cancel(id, reason)
  }

  @Post(':id/complete')
  @ApiOperation({ summary: '完成面试' })
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('feedback') feedback: string,
    @Body('rating') rating: number,
    @Body('result') result: string,
  ) {
    return this.interviewService.complete(id, feedback, rating, result)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除面试' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.interviewService.remove(id)
  }
}
