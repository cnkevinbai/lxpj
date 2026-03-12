import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like } from 'typeorm'
import { Resume } from './entities/resume.entity'
import { CreateResumeDto, UpdateResumeDto } from './dto/resume.dto'

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private resumeRepo: Repository<Resume>,
  ) {}

  /**
   * 创建简历
   */
  async create(createResumeDto: CreateResumeDto): Promise<Resume> {
    const resumeCode = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const resume = this.resumeRepo.create({
      ...createResumeDto,
      resumeCode,
    })

    return this.resumeRepo.save(resume)
  }

  /**
   * 获取简历列表
   */
  async findAll(params: {
    page?: number
    limit?: number
    search?: string
    jobId?: string
    status?: string
    source?: string
  }) {
    const { page = 1, limit = 20, search, jobId, status, source } = params

    const query = this.resumeRepo.createQueryBuilder('resume')
      .leftJoinAndSelect('resume.job', 'job')

    if (search) {
      query.andWhere('(resume.candidateName ILIKE :search OR resume.currentCompany ILIKE :search)', { search: `%${search}%` })
    }
    if (jobId) {
      query.andWhere('resume.jobId = :jobId', { jobId })
    }
    if (status) {
      query.andWhere('resume.status = :status', { status })
    }
    if (source) {
      query.andWhere('resume.source = :source', { source })
    }

    query.orderBy('resume.appliedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await query.getManyAndCount()

    return { data, total, page, limit }
  }

  /**
   * 获取简历详情
   */
  async findOne(id: string): Promise<Resume> {
    const resume = await this.resumeRepo.findOne({
      where: { id },
      relations: ['job', 'interviews'],
    })
    if (!resume) {
      throw new NotFoundException('简历不存在')
    }
    return resume
  }

  /**
   * 更新简历
   */
  async update(id: string, updateResumeDto: UpdateResumeDto): Promise<Resume> {
    const resume = await this.findOne(id)
    Object.assign(resume, updateResumeDto)
    return this.resumeRepo.save(resume)
  }

  /**
   * 删除简历
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.resumeRepo.delete(id)
  }

  /**
   * 导入简历（解析文件）
   */
  async import(fileContent: string, fileName: string, source: string = 'website'): Promise<Resume> {
    // 这里应该解析 PDF/Word 文件，提取候选人信息
    // 简化处理，创建一个基本简历
    return this.create({
      candidateName: fileName.replace(/\.[^/.]+$/, ''),
      phone: '',
      email: '',
      source,
      resumeContent: fileContent,
    })
  }

  /**
   * 获取统计数据
   */
  async getStatistics() {
    const total = await this.resumeRepo.count()
    const newResumes = await this.resumeRepo.count({ where: { status: 'new' } })
    const screening = await this.resumeRepo.count({ where: { status: 'screening' } })
    const interview = await this.resumeRepo.count({ where: { status: 'interview' } })
    const offer = await this.resumeRepo.count({ where: { status: 'offer' } })
    const hired = await this.resumeRepo.count({ where: { status: 'hired' } })
    const rejected = await this.resumeRepo.count({ where: { status: 'rejected' } })

    // 按来源统计
    const bySource = await this.resumeRepo
      .createQueryBuilder('resume')
      .select('resume.source', 'source')
      .addSelect('COUNT(*)', 'count')
      .groupBy('resume.source')
      .getRawMany()

    return {
      total,
      newResumes,
      screening,
      interview,
      offer,
      hired,
      rejected,
      bySource,
    }
  }
}
