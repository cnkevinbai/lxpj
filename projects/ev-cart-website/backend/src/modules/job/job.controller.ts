import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JobService } from './services/job.service'
import { CreateJobDto, UpdateJobDto, CreateApplicationDto } from './dto/job.dto'

@ApiTags('jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // Job 接口
  @Post()
  @ApiOperation({ summary: '创建职位' })
  createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto)
  }

  @Get()
  @ApiOperation({ summary: '获取职位列表' })
  findAllJobs(@Query('status') status?: string) {
    return this.jobService.findAllJobs(status)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取职位详情' })
  findOneJob(@Param('id') id: string) {
    return this.jobService.findOneJob(id)
  }

  @Put(':id')
  @ApiOperation({ summary: '更新职位' })
  updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobService.updateJob(id, updateJobDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除职位' })
  removeJob(@Param('id') id: string) {
    return this.jobService.removeJob(id)
  }

  // Application 接口
  @Post(':id/apply')
  @ApiOperation({ summary: '申请职位' })
  createApplication(@Param('id') id: string, @Body() createApplicationDto: CreateApplicationDto) {
    return this.jobService.createApplication(id, createApplicationDto)
  }

  @Get(':id/applications')
  @ApiOperation({ summary: '获取职位申请列表' })
  findApplications(@Param('id') id: string, @Query('status') status?: string) {
    return this.jobService.findApplicationsByJob(id, status)
  }

  @Put('applications/:id/status')
  @ApiOperation({ summary: '更新申请状态' })
  updateApplicationStatus(@Param('id') id: string, @Body('status') status: string, @Body('comment') comment?: string) {
    return this.jobService.updateApplicationStatus(id, status, comment)
  }
}
