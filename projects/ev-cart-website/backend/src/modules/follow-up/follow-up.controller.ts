import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { FollowUpService } from './follow-up.service'
import { CreateFollowUpDto, UpdateFollowUpDto, FollowUpStatsDto } from './dto/follow-up.dto'

@ApiTags('follow-up')
@Controller('follow-up')
export class FollowUpController {
  constructor(private readonly followUpService: FollowUpService) {}

  @Post()
  @ApiOperation({ summary: '创建跟进记录' })
  create(@Body() createFollowUpDto: CreateFollowUpDto) {
    return this.followUpService.create(createFollowUpDto)
  }

  @Get('target/:targetType/:targetId')
  @ApiOperation({ summary: '获取目标的跟进记录' })
  findByTarget(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.followUpService.findByTarget(targetType, targetId, page, limit)
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '获取业务员的跟进记录' })
  findByUser(
    @Param('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.followUpService.findByUser(userId, startDate, endDate)
  }

  @Get('pending/:userId')
  @ApiOperation({ summary: '获取待跟进记录' })
  getPendingFollowups(
    @Param('userId') userId: string,
    @Query('days') days: number = 7,
  ) {
    return this.followUpService.getPendingFollowups(userId, days)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新跟进记录' })
  update(@Param('id') id: string, @Body() updateFollowUpDto: UpdateFollowUpDto) {
    return this.followUpService.update(id, updateFollowUpDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除跟进记录' })
  remove(@Param('id') id: string) {
    return this.followUpService.remove(id)
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: '获取跟进统计' })
  getStats(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.followUpService.getStats(userId, startDate, endDate)
  }

  @Get('team-stats')
  @ApiOperation({ summary: '获取团队跟进统计' })
  getTeamStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.followUpService.getTeamStats(startDate, endDate)
  }
}
