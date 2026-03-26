import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AnalyticsService } from './services/analytics.service'

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('sensors/track')
  @ApiOperation({ summary: '神策数据 - 追踪事件' })
  sensorsTrack(@Body('event') event: string, @Body('properties') properties: Record<string, any>) {
    return this.analyticsService.sensorsTrack(event, properties)
  }

  @Post('sensors/profile')
  @ApiOperation({ summary: '神策数据 - 设置用户属性' })
  sensorsProfileSet(@Body('distinctId') distinctId: string, @Body('properties') properties: Record<string, any>) {
    return this.analyticsService.sensorsProfileSet(distinctId, properties)
  }

  @Post('growingio/track')
  @ApiOperation({ summary: 'GrowingIO - 追踪事件' })
  growingioTrack(@Body('event') event: string, @Body('data') data: Record<string, any>) {
    return this.analyticsService.growingioTrack(event, data)
  }

  @Post('growingio/visitor')
  @ApiOperation({ summary: 'GrowingIO - 设置访问用户属性' })
  growingioVisitorSet(@Body('visitorId') visitorId: string, @Body('data') data: Record<string, any>) {
    return this.analyticsService.growingioVisitorSet(visitorId, data)
  }

  @Get('report')
  @ApiOperation({ summary: '获取分析报表' })
  getReport(
    @Query('type') type: 'traffic' | 'conversion' | 'retention',
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getReport(type, startDate, endDate)
  }
}
