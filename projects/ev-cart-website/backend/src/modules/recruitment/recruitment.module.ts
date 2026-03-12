import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Job } from './entities/job.entity'
import { Resume } from './entities/resume.entity'
import { Interview } from './entities/interview.entity'
import { JobService } from './services/job.service'
import { ResumeService } from './services/resume.service'
import { InterviewService } from './services/interview.service'
import { JobController } from './controllers/job.controller'
import { ResumeController } from './controllers/resume.controller'
import { InterviewController } from './controllers/interview.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Job, Resume, Interview])],
  controllers: [JobController, ResumeController, InterviewController],
  providers: [JobService, ResumeService, InterviewService],
  exports: [JobService, ResumeService, InterviewService],
})
export class RecruitmentModule {}
