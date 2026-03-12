import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DealerAssessmentService } from './dealer-assessment.service'
import { CreateDealerAssessmentDto, UpdateDealerAssessmentDto, CalculateAssessmentDto } from './dto/dealer-assessment.dto'

@ApiTags('经销商考核')
@ApiBearerAuth()
@Controller('dealer-assessments')
export class DealerAssessmentController {
  constructor(private readonly assessmentService: DealerAssessmentService) {}

  @Post()
  @ApiOperation({ summary: '创建考核记录' })
  create(@Body() dto: CreateDealerAssessmentDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.assessmentService.create(dto, userId, userName)
  }

  @Get()
  @ApiOperation({ summary: '获取考核列表' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('dealerId') dealerId?: string,
    @Query('period') period?: string,
    @Query('periodType') periodType?: string,
    @Query('grade') grade?: string,
    @Query('status') status?: string,
  ) {
    return this.assessmentService.findAll({ page, limit, dealerId, period, periodType, grade, status })
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取考核统计' })
  getStatistics(@Query('period') period?: string, @Query('periodType') periodType?: string) {
    return this.assessmentService.getStatistics(period, periodType)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取考核详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.findOne(id)
  }

  @Get('dealer/:dealerId')
  @ApiOperation({ summary: '获取经销商考核历史' })
  findByDealer(
    @Param('dealerId', ParseUUIDPipe) dealerId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.assessmentService.findByDealer(dealerId, limit)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新考核' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDealerAssessmentDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.assessmentService.update(id, dto, userId, userName)
  }

  @Post(':id/submit')
  @ApiOperation({ summary: '提交考核' })
  submit(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.submit(id)
  }

  @Post(':id/approve')
  @ApiOperation({ summary: '审批考核' })
  approve(@Param('id', ParseUUIDPipe) id: string, @Body('comments') comments: string, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.assessmentService.approve(id, userId, userName, comments)
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '拒绝考核' })
  reject(@Param('id', ParseUUIDPipe) id: string, @Body('reason') reason: string, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.assessmentService.reject(id, userId, userName, reason)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除考核' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.remove(id)
  }

  @Post('calculate')
  @ApiOperation({ summary: '自动计算考核' })
  calculate(@Body() dto: CalculateAssessmentDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.assessmentService.calculate(dto, userId, userName)
  }
}
