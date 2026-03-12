import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Between } from 'typeorm'
import { Interview } from './entities/interview.entity'
import { CreateInterviewDto, UpdateInterviewDto } from './dto/interview.dto'

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private interviewRepo: Repository<Interview>,
  ) {}

  /**
   * 创建面试
   */
  async create(createInterviewDto: CreateInterviewDto, userId: string): Promise<Interview> {
    const interviewCode = `INT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const interview = this.interviewRepo.create({
      ...createInterviewDto,
      interviewCode,
      scheduledAt: new Date(createInterviewDto.scheduledAt),
      createdBy: userId,
    })

    return this.interviewRepo.save(interview)
  }

  /**
   * 获取面试列表
   */
  async findAll(params: {
    page?: number
    limit?: number
    jobId?: string
    resumeId?: string
    status?: string
    interviewer?: string
    dateFrom?: string
    dateTo?: string
  }) {
    const { page = 1, limit = 20, jobId, resumeId, status, interviewer, dateFrom, dateTo } = params

    const query = this.interviewRepo.createQueryBuilder('interview')
      .leftJoinAndSelect('interview.resume', 'resume')
      .leftJoinAndSelect('interview.job', 'job')

    if (jobId) {
      query.andWhere('interview.jobId = :jobId', { jobId })
    }
    if (resumeId) {
      query.andWhere('interview.resumeId = :resumeId', { resumeId })
    }
    if (status) {
      query.andWhere('interview.status = :status', { status })
    }
    if (interviewer) {
      query.andWhere('interview.interviewer ILIKE :interviewer', { interviewer: `%${interviewer}%` })
    }
    if (dateFrom && dateTo) {
      query.andWhere('interview.scheduledAt BETWEEN :from AND :to', { 
        from: new Date(dateFrom), 
        to: new Date(dateTo) 
      })
    }

    query.orderBy('interview.scheduledAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return { data, total, page, limit }
  }

  /**
   * 获取面试详情
   */
  async findOne(id: string): Promise<Interview> {
    const interview = await this.interviewRepo.findOne({
      where: { id },
      relations: ['resume', 'job'],
    })
    if (!interview) {
      throw new NotFoundException('面试不存在')
    }
    return interview
  }

  /**
   * 更新面试
   */
  async update(id: string, updateInterviewDto: UpdateInterviewDto): Promise<Interview> {
    const interview = await this.findOne(id)
    
    if (updateInterviewDto.scheduledAt) {
      interview.scheduledAt = new Date(updateInterviewDto.scheduledAt)
    }
    
    Object.assign(interview, updateInterviewDto)
    return this.interviewRepo.save(interview)
  }

  /**
   * 取消面试
   */
  async cancel(id: string, reason?: string): Promise<Interview> {
    const interview = await this.findOne(id)
    interview.status = 'cancelled'
    interview.feedback = reason || interview.feedback
    return this.interviewRepo.save(interview)
  }

  /**
   * 完成面试
   */
  async complete(id: string, feedback: string, rating: number, result: string): Promise<Interview> {
    const interview = await this.findOne(id)
    interview.status = 'completed'
    interview.feedback = feedback
    interview.rating = rating
    interview.result = result
    return this.interviewRepo.save(interview)
  }

  /**
   * 删除面试
   */
  async remove(id: string): Promise<void> {
    const interview = await this.findOne(id)
    if (interview.status === 'completed') {
      throw new NotFoundException('已完成的面试不能删除')
    }
    await this.interviewRepo.delete(id)
  }

  /**
   * 获取统计数据
   */
  async getStatistics() {
    const total = await this.interviewRepo.count()
    const scheduled = await this.interviewRepo.count({ where: { status: 'scheduled' } })
    const completed = await this.interviewRepo.count({ where: { status: 'completed' } })
    const cancelled = await this.interviewRepo.count({ where: { status: 'cancelled' } })

    // 本周面试
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const thisWeek = await this.interviewRepo.count({
      where: { scheduledAt: Between(startOfWeek, new Date()) },
    })

    return {
      total,
      scheduled,
      completed,
      cancelled,
      thisWeek,
    }
  }

  /**
   * 获取面试安排（日历视图）
   */
  async getCalendar(date: string, interviewer?: string) {
    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    const query = this.interviewRepo.createQueryBuilder('interview')
      .leftJoinAndSelect('interview.resume', 'resume')
      .leftJoinAndSelect('interview.job', 'job')
      .where('interview.scheduledAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })

    if (interviewer) {
      query.andWhere('interview.interviewer ILIKE :interviewer', { interviewer: `%${interviewer}%` })
    }

    return query.getMany()
  }
}
