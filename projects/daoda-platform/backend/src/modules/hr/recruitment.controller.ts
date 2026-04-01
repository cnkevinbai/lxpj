/**
 * 招聘管理控制器
 * 招聘职位与简历管理 API
 */
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import { RecruitmentService, JobStatus, ResumeStatus, InterviewResult } from './recruitment.service'

@Controller('api/hr/recruitment')
export class RecruitmentController {
  constructor(private readonly service: RecruitmentService) {}

  // ========== 职位管理 ==========

  @Get('jobs')
  async getAllJobs(
    @Query('status') status?: JobStatus,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.service.getAllJobs(status, departmentId)
  }

  @Get('jobs/:id')
  async getJobById(@Param('id') id: string) {
    return this.service.getJobById(id)
  }

  @Post('jobs')
  async createJob(
    @Body()
    data: Partial<{
      title: string
      departmentId: string
      location: string
      type: string
      salaryMin: number
      salaryMax: number
      description: string
      requirements: string
      headcount: number
    }>,
  ) {
    return this.service.createJob(data as any)
  }

  @Post('jobs/:id')
  async updateJob(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      title: string
      location: string
      type: string
      salaryMin: number
      salaryMax: number
      description: string
      requirements: string
      headcount: number
    }>,
  ) {
    return this.service.updateJob(id, data as any)
  }

  @Post('jobs/:id/publish')
  async publishJob(@Param('id') id: string) {
    return this.service.publishJob(id)
  }

  @Post('jobs/:id/close')
  async closeJob(@Param('id') id: string) {
    return this.service.closeJob(id)
  }

  @Delete('jobs/:id')
  async deleteJob(@Param('id') id: string) {
    return this.service.deleteJob(id)
  }

  // ========== 简历管理 ==========

  @Get('resumes')
  async getAllResumes(@Query('status') status?: ResumeStatus, @Query('jobId') jobId?: string) {
    return this.service.getAllResumes(status, jobId)
  }

  @Get('resumes/:id')
  async getResumeById(@Param('id') id: string) {
    return this.service.getResumeById(id)
  }

  @Post('resumes')
  async createResume(
    @Body()
    data: Partial<{
      jobId: string
      name: string
      phone: string
      email: string
      education: string
      experience: number
      currentCompany?: string
      expectedSalary?: number
      skills?: string[]
      resumeUrl?: string
    }>,
  ) {
    return this.service.createResume(data as any)
  }

  @Post('resumes/:id/screen')
  async screenResume(
    @Param('id') id: string,
    @Body() body: { score: number; notes: string; passed: boolean },
  ) {
    return this.service.screenResume(id, body.score, body.notes, body.passed)
  }

  @Post('resumes/:id/reject')
  async rejectResume(@Param('id') id: string) {
    return this.service.rejectResume(id)
  }

  // ========== 面试管理 ==========

  @Post('interviews/schedule')
  async scheduleInterview(
    @Body()
    body: {
      resumeId: string
      round: number
      interviewerId: string
      interviewerName: string
      scheduledAt: string
      location?: string
      type?: string
      notes?: string
    },
  ) {
    return this.service.scheduleInterview(body.resumeId, {
      round: body.round,
      interviewerId: body.interviewerId,
      interviewerName: body.interviewerName,
      scheduledAt: new Date(body.scheduledAt),
      type: body.type as any,
    } as any)
  }

  @Post('interviews/:id/complete')
  async completeInterview(
    @Param('id') id: string,
    @Body() body: { result: InterviewResult; feedback: string; rating: number },
  ) {
    return this.service.completeInterview(id, body.result, body.feedback, body.rating)
  }

  @Post('interviews/:id/cancel')
  async cancelInterview(@Param('id') id: string) {
    return this.service.cancelInterview(id)
  }

  // ========== Offer 管理 ==========

  @Post('offers/send')
  async sendOffer(@Body() body: { resumeId: string; salary: number; startDate: string }) {
    return this.service.sendOffer(body.resumeId, body.salary, new Date(body.startDate))
  }

  @Post('offers/:resumeId/accept')
  async acceptOffer(@Param('resumeId') resumeId: string) {
    return this.service.acceptOffer(resumeId)
  }

  @Post('offers/:resumeId/reject')
  async rejectOffer(@Param('resumeId') resumeId: string) {
    return this.service.rejectOffer(resumeId)
  }

  // ========== 统计 ==========

  @Get('stats/overview')
  async getStats() {
    return this.service.getStats()
  }
}
