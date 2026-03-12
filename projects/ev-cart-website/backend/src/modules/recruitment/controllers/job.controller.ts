import { Controller, Get, Post, Body, Param, Put, Delete, Query, ParseUUIDPipe, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JobService } from './job.service'
import { CreateJobDto, UpdateJobDto } from './dto/job.dto'

@ApiTags('职位管理')
@ApiBearerAuth()
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @ApiOperation({ summary: '创建职位' })
  create(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const userName = req.user?.name || 'System'
    return this.jobService.create(createJobDto, userId, userName)
  }

  @Get()
  @ApiOperation({ summary: '获取职位列表' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('location') location?: string,
    @Query('status') status?: string,
  ) {
    return this.jobService.findAll({ page, limit, search, department, location, status })
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取职位统计' })
  getStatistics() {
    return this.jobService.getStatistics()
  }

  @Get('analytics')
  @ApiOperation({ summary: '获取招聘分析' })
  getAnalytics(@Query('department') department?: string) {
    return this.jobService.getAnalytics(department)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取职位详情' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新职位' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.update(id, updateJobDto)
  }

  @Post(':id/publish')
  @ApiOperation({ summary: '发布职位' })
  publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobService.publish(id)
  }

  @Post(':id/close')
  @ApiOperation({ summary: '关闭职位' })
  close(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobService.close(id)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除职位' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.jobService.remove(id)
  }
}
