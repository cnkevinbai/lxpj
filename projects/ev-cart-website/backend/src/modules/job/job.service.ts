import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Job } from './entities/job.entity'
import { JobApplication } from './entities/job-application.entity'
import { CreateJobDto, UpdateJobDto, CreateApplicationDto } from './dto/job.dto'

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JobApplication)
    private applicationRepository: Repository<JobApplication>,
  ) {}

  // Job 相关
  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create(createJobDto)
    return this.jobRepository.save(job)
  }

  async findAllJobs(status?: string) {
    const query = this.jobRepository.createQueryBuilder('job')
    if (status) {
      query.where('job.status = :status', { status })
    }
    query.orderBy('job.createdAt', 'DESC')
    return query.getMany()
  }

  async findOneJob(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id } })
    if (!job) {
      throw new NotFoundException('Job not found')
    }
    // 增加浏览量
    job.viewCount += 1
    await this.jobRepository.save(job)
    return job
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOneJob(id)
    Object.assign(job, updateJobDto)
    return this.jobRepository.save(job)
  }

  async removeJob(id: string): Promise<void> {
    await this.findOneJob(id)
    await this.jobRepository.delete(id)
  }

  // Application 相关
  async createApplication(jobId: string, createApplicationDto: CreateApplicationDto): Promise<JobApplication> {
    const job = await this.findOneJob(jobId)
    const application = this.applicationRepository.create({
      ...createApplicationDto,
      jobId,
    })
    // 增加申请数
    job.applyCount += 1
    await this.jobRepository.save(job)
    return this.applicationRepository.save(application)
  }

  async findApplicationsByJob(jobId: string, status?: string) {
    const query = this.applicationRepository.createQueryBuilder('application')
      .where('application.jobId = :jobId', { jobId })
    if (status) {
      query.andWhere('application.status = :status', { status })
    }
    query.orderBy('application.createdAt', 'DESC')
    return query.getMany()
  }

  async updateApplicationStatus(id: string, status: string, comment?: string): Promise<JobApplication> {
    const application = await this.applicationRepository.findOne({ where: { id } })
    if (!application) {
      throw new NotFoundException('Application not found')
    }
    application.status = status
    if (comment) {
      application.reviewComment = comment
    }
    return this.applicationRepository.save(application)
  }
}
