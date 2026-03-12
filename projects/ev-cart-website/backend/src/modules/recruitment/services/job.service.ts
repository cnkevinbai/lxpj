import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, Between } from 'typeorm'
import { Job } from './entities/job.entity'
import { CreateJobDto, UpdateJobDto } from './dto/job.dto'

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  /**
   * 创建职位
   */
  async create(createJobDto: CreateJobDto, userId: string, userName: string): Promise<Job> {
    const jobCode = `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const job = this.jobRepo.create({
      ...createJobDto,
      jobCode,
      createdBy: userId,
      createdByName: userName,
      publishedAt: createJobDto.status === 'published' ? new Date() : null,
    })

    return this.jobRepo.save(job)
  }

  /**
   * 获取职位列表
   */
  async findAll(params: {
    page?: number
    limit?: number
    search?: string
    department?: string
    location?: string
    status?: string
  }) {
    const { page = 1, limit = 20, search, department, location, status } = params

    const query = this.jobRepo.createQueryBuilder('job')

    if (search) {
      query.andWhere('(job.title ILIKE :search OR job.jobCode ILIKE :search)', { search: `%${search}%` })
    }
    if (department) {
      query.andWhere('job.department = :department', { department })
    }
    if (location) {
      query.andWhere('job.location = :location', { location })
    }
    if (status) {
      query.andWhere('job.status = :status', { status })
    }

    query.orderBy('job.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return { data, total, page, limit }
  }

  /**
   * 获取职位详情
   */
  async findOne(id: string): Promise<Job> {
    const job = await this.jobRepo.findOne({
      where: { id },
      relations: ['resumes'],
    })
    if (!job) {
      throw new NotFoundException('职位不存在')
    }
    return job
  }

  /**
   * 更新职位
   */
  async update(id: string, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id)
    
    // 如果状态从草稿变为发布，设置发布时间
    if (updateJobDto.status === 'published' && job.status === 'draft') {
      updateJobDto.publishedAt = new Date().toISOString()
    }

    Object.assign(job, updateJobDto)
    return this.jobRepo.save(job)
  }

  /**
   * 发布职位
   */
  async publish(id: string): Promise<Job> {
    const job = await this.findOne(id)
    job.status = 'published'
    job.publishedAt = new Date()
    return this.jobRepo.save(job)
  }

  /**
   * 关闭职位
   */
  async close(id: string): Promise<Job> {
    const job = await this.findOne(id)
    job.status = 'closed'
    return this.jobRepo.save(job)
  }

  /**
   * 删除职位
   */
  async remove(id: string): Promise<void> {
    const job = await this.findOne(id)
    if (job.status === 'published') {
      throw new BadRequestException('请先关闭正在招聘的职位')
    }
    await this.jobRepo.delete(id)
  }

  /**
   * 获取统计数据
   */
  async getStatistics() {
    const total = await this.jobRepo.count()
    const published = await this.jobRepo.count({ where: { status: 'published' } })
    const draft = await this.jobRepo.count({ where: { status: 'draft' } })
    const closed = await this.jobRepo.count({ where: { status: 'closed' } })

    // 本月新增
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const newThisMonth = await this.jobRepo.count({
      where: { createdAt: Between(startOfMonth, new Date()) },
    })

    // 获取简历统计
    const totalResumes = await this.jobRepo
      .createQueryBuilder('job')
      .leftJoin('job.resumes', 'resumes')
      .select('COUNT(resumes.id)', 'count')
      .getRawOne()

    return {
      total,
      published,
      draft,
      closed,
      newThisMonth,
      totalResumes: parseInt(totalResumes?.count) || 0,
    }
  }

  /**
   * 获取招聘分析数据
   */
  async getAnalytics(department?: string) {
    const query = this.jobRepo.createQueryBuilder('job')
      .leftJoin('job.resumes', 'resumes')
      .select([
        'job.id',
        'job.title',
        'job.department',
        'COUNT(resumes.id) as appliedCount',
      ])
      .groupBy('job.id')

    if (department) {
      query.andWhere('job.department = :department', { department })
    }

    const jobs = await query.getRawMany()

    return {
      jobs,
      byDepartment: this.groupByDepartment(jobs),
    }
  }

  /**
   * 按部门分组统计
   */
  private groupByDepartment(jobs: any[]) {
    const result = {}
    jobs.forEach(job => {
      const dept = job.department
      if (!result[dept]) {
        result[dept] = { jobs: 0, resumes: 0 }
      }
      result[dept].jobs += 1
      result[dept].resumes += parseInt(job.appliedcount) || 0
    })
    return result
  }
}
