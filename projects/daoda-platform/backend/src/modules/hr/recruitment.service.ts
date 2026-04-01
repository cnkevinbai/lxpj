/**
 * 招聘管理服务
 * 招聘需求、职位发布、简历筛选、面试安排
 */
import { Injectable } from '@nestjs/common'

// 职位状态枚举
export enum JobStatus {
  DRAFT = 'DRAFT', // 草稿
  PUBLISHED = 'PUBLISHED', // 已发布
  CLOSED = 'CLOSED', // 已关闭
  FILLED = 'FILLED', // 已招满
}

// 招聘类型枚举
export enum JobType {
  FULL_TIME = 'FULL_TIME', // 全职
  PART_TIME = 'PART_TIME', //兼职
  INTERN = 'INTERN', // 实习
  CONTRACT = 'CONTRACT', // 合同制
}

// 简历状态枚举
export enum ResumeStatus {
  NEW = 'NEW', // 新投递
  SCREENING = 'SCREENING', // 筛选中
  PASSED = 'PASSED', // 通过筛选
  FAILED = 'FAILED', // 未通过
  INTERVIEW = 'INTERVIEW', // 待面试
  OFFERED = 'OFFERED', // 已发offer
  REJECTED = 'REJECTED', // 已拒绝
  HIRED = 'HIRED', // 已入职
}

// 面试状态枚举
export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED', // 已安排
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
}

// 面试结果枚举
export enum InterviewResult {
  PASS = 'PASS', // 通过
  FAIL = 'FAIL', // 未通过
  PENDING = 'PENDING', // 待定
}

// 职位接口
export interface Job {
  id: string
  title: string // 职位名称
  code?: string // 职位编码
  departmentId: string // 所属部门
  departmentName: string // 部门名称

  // 职位信息
  type: JobType // 招聘类型
  level?: string // 职位级别 P4/P5/P6
  location?: string // 工作地点
  salaryMin?: number // 薪资范围下限
  salaryMax?: number // 薪资范围上限
  headcount: number // 招聘人数
  filledCount: number // 已招人数

  // 职位要求
  requirements?: string // 岗位要求
  responsibilities?: string // 工作职责
  education?: string // 学历要求
  experience?: number // 经验要求(年)
  skills?: string[] // 技能要求

  // 状态和时间
  status: JobStatus
  publishDate?: Date // 发布日期
  deadline?: Date // 截止日期

  // 统计
  totalApplications?: number // 总投递数
  screeningPassed?: number // 筛选通过数
  interviewScheduled?: number // 面试安排数

  createdAt: Date
  updatedAt: Date
}

// 简历/候选人接口
export interface Resume {
  id: string
  jobId: string // 投递职位
  jobTitle: string // 职位名称

  // 基本信息候选人姓名
  name: string
  phone?: string // 电话
  email?: string // 邮箱
  gender?: 'male' | 'female' // 性别
  age?: number // 年龄
  avatar?: string // 头像

  // 教育背景
  education?: {
    degree: string // 学位
    school: string // 学校
    major: string // 专业
    year: number // 毕业年份
  }

  // 工作经验
  experience?: {
    years: number // 工作年限
    currentCompany?: string // 当前公司
    currentPosition?: string // 当前职位
  }

  // 简历信息
  resumeUrl?: string // 简历链接
  resumeFile?: string // 简历文件

  // 状态
  status: ResumeStatus
  source?: string // 来源渠道

  // 筛选信息
  screeningScore?: number // 筛选评分 0-100
  screeningNotes?: string // 筛选备注
  screenedBy?: string // 筛筛选人

  // 面试信息
  interviews?: Interview[] // 面试记录

  // offer信息
  offer?: {
    salary: number // offer薪资
    startDate: Date // 入职日期
    sentAt?: Date // 发送时间
    acceptedAt?: Date // 接受时间
  }

  createdAt: Date
  updatedAt: Date
}

// 面试接口
export interface Interview {
  id: string
  resumeId: string // 关联简历
  jobId: string // 关联职位

  // 面试信息
  round: number // 面试轮次 1/2/3
  type: 'phone' | 'video' | 'onsite' // 面试类型

  // 时间安排
  scheduledAt: Date // 面试时间
  durationMinutes: number // 面试时长

  // 面试官
  interviewerId: string // 面试官ID
  interviewerName: string // 面试官姓名

  // 状态和结果
  status: InterviewStatus
  result?: InterviewResult

  // 评价
  rating?: number // 评分 1-5
  feedback?: string // 面试反馈
  strengths?: string // 优点
  weaknesses?: string // 缺点

  createdAt: Date
}

// 招聘统计接口
export interface RecruitmentStats {
  totalJobs: number
  activeJobs: number
  closedJobs: number

  totalApplications: number
  newApplications: number
  screeningPassed: number
  interviewScheduled: number
  offered: number
  hired: number

  avgScreeningScore: number
  conversionRate: number // 转化率

  avgDaysToHire: number // 平均招聘周期(天)
}

@Injectable()
export class RecruitmentService {
  private jobs: Map<string, Job> = new Map()
  private resumes: Map<string, Resume> = new Map()
  private interviews: Map<string, Interview> = new Map()

  constructor() {
    this.initDefaultJobs()
    this.initDefaultResumes()
  }

  // 初始化默认职位
  private initDefaultJobs() {
    const defaultJobs: Partial<Job>[] = [
      {
        title: '高级前端工程师',
        code: 'FE-SENG',
        departmentId: 'ORG-009',
        departmentName: '前端开发组',
        type: JobType.FULL_TIME,
        level: 'P5',
        location: '成都',
        salaryMin: 20000,
        salaryMax: 35000,
        headcount: 2,
        requirements: '3年以上前端开发经验，精通React/Vue',
        responsibilities: '负责核心产品前端架构设计和开发',
        education: '本科及以上',
        experience: 3,
        skills: ['React', 'TypeScript', 'Webpack', 'NodeJS'],
        status: JobStatus.PUBLISHED,
      },
      {
        title: '后端开发工程师',
        code: 'BE-ENG',
        departmentId: 'ORG-010',
        departmentName: '后端开发组',
        type: JobType.FULL_TIME,
        level: 'P4',
        location: '成都',
        salaryMin: 15000,
        salaryMax: 25000,
        headcount: 3,
        requirements: '2年以上后端开发经验，熟悉Spring/NestJS',
        responsibilities: '负责业务模块开发和维护',
        education: '本科及以上',
        experience: 2,
        skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
        status: JobStatus.PUBLISHED,
      },
      {
        title: '产品经理',
        code: 'PM',
        departmentId: 'ORG-004',
        departmentName: '市场部',
        type: JobType.FULL_TIME,
        level: 'P5',
        location: '成都',
        salaryMin: 18000,
        salaryMax: 30000,
        headcount: 1,
        requirements: '3年以上产品经验，有B端产品经验优先',
        responsibilities: '负责产品规划和需求管理',
        education: '本科及以上',
        experience: 3,
        skills: ['需求分析', '原型设计', '数据分析'],
        status: JobStatus.PUBLISHED,
      },
      {
        title: '销售代表',
        code: 'SALES-REP',
        departmentId: 'ORG-013',
        departmentName: '华北销售组',
        type: JobType.FULL_TIME,
        level: 'S3',
        location: '北京',
        salaryMin: 8000,
        salaryMax: 15000,
        headcount: 5,
        requirements: '有销售热情，沟通能力强',
        responsibilities: '负责区域客户开发和维护',
        education: '大专及以上',
        experience: 1,
        skills: ['沟通能力', '客户关系'],
        status: JobStatus.PUBLISHED,
      },
      {
        title: '实习生-前端开发',
        code: 'FE-INTERN',
        departmentId: 'ORG-009',
        departmentName: '前端开发组',
        type: JobType.INTERN,
        location: '成都',
        salaryMin: 3000,
        salaryMax: 5000,
        headcount: 2,
        requirements: '计算机相关专业，熟悉HTML/CSS/JS',
        responsibilities: '协助前端开发工作',
        education: '本科在读',
        status: JobStatus.PUBLISHED,
      },
    ]

    defaultJobs.forEach((job, index) => {
      const id = `JOB-${(index + 1).toString().padStart(3, '0')}`
      const fullJob: Job = {
        id,
        title: job.title!,
        code: job.code,
        departmentId: job.departmentId!,
        departmentName: job.departmentName!,
        type: job.type!,
        level: job.level,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        headcount: job.headcount!,
        filledCount: 0,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        education: job.education,
        experience: job.experience,
        skills: job.skills,
        status: job.status!,
        publishDate: new Date(),
        totalApplications: Math.floor(Math.random() * 50) + 10,
        screeningPassed: Math.floor(Math.random() * 20) + 5,
        interviewScheduled: Math.floor(Math.random() * 10) + 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.jobs.set(id, fullJob)
    })
  }

  // 初始化默认简历
  private initDefaultResumes() {
    const candidates = [
      { name: '张三', jobIndex: 0, status: ResumeStatus.INTERVIEW },
      { name: '李四', jobIndex: 0, status: ResumeStatus.SCREENING },
      { name: '王五', jobIndex: 1, status: ResumeStatus.INTERVIEW },
      { name: '赵六', jobIndex: 1, status: ResumeStatus.NEW },
      { name: '钱七', jobIndex: 2, status: ResumeStatus.OFFERED },
      { name: '孙八', jobIndex: 3, status: ResumeStatus.HIRED },
      { name: '周九', jobIndex: 4, status: ResumeStatus.PASSED },
    ]

    candidates.forEach((c, index) => {
      const id = `RES-${(index + 1).toString().padStart(3, '0')}`
      const jobs = Array.from(this.jobs.values())
      const job = jobs[c.jobIndex]

      const resume: Resume = {
        id,
        jobId: job.id,
        jobTitle: job.title,
        name: c.name,
        phone: `138${Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, '0')}`,
        email: `${c.name.toLowerCase()}@example.com`,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        age: Math.floor(Math.random() * 15) + 22,
        education: {
          degree: '本科',
          school: '四川大学',
          major: '计算机科学',
          year: 2020 + Math.floor(Math.random() * 5),
        },
        experience: {
          years: Math.floor(Math.random() * 5) + 1,
          currentCompany: '某科技公司',
          currentPosition: '开发工程师',
        },
        status: c.status,
        source: '招聘网站',
        screeningScore: Math.floor(Math.random() * 30) + 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.resumes.set(id, resume)
    })
  }

  // 职位管理
  async getAllJobs(status?: JobStatus, departmentId?: string): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values())

    if (status) jobs = jobs.filter((j) => j.status === status)
    if (departmentId) jobs = jobs.filter((j) => j.departmentId === departmentId)

    return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.jobs.get(id) || null
  }

  async createJob(data: Partial<Job>): Promise<Job> {
    const id = `JOB-${Date.now().toString(36).toUpperCase()}`

    const job: Job = {
      id,
      title: data.title || '',
      code: data.code,
      departmentId: data.departmentId || '',
      departmentName: data.departmentName || '',
      type: data.type || JobType.FULL_TIME,
      level: data.level,
      location: data.location,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      headcount: data.headcount || 1,
      filledCount: 0,
      requirements: data.requirements,
      responsibilities: data.responsibilities,
      education: data.education,
      experience: data.experience,
      skills: data.skills,
      status: JobStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.jobs.set(id, job)
    return job
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job | null> {
    const job = this.jobs.get(id)
    if (!job) return null

    const updated: Job = {
      ...job,
      ...data,
      updatedAt: new Date(),
    }

    this.jobs.set(id, updated)
    return updated
  }

  async publishJob(id: string): Promise<Job | null> {
    const job = this.jobs.get(id)
    if (!job || job.status !== JobStatus.DRAFT) return null

    job.status = JobStatus.PUBLISHED
    job.publishDate = new Date()
    job.updatedAt = new Date()
    return job
  }

  async closeJob(id: string): Promise<Job | null> {
    const job = this.jobs.get(id)
    if (!job) return null

    job.status = JobStatus.CLOSED
    job.updatedAt = new Date()
    return job
  }

  async deleteJob(id: string): Promise<{ success: boolean; message: string }> {
    const job = this.jobs.get(id)
    if (!job) return { success: false, message: '职位不存在' }

    if (job.status === JobStatus.PUBLISHED) {
      return { success: false, message: '已发布职位无法删除，请先关闭' }
    }

    this.jobs.delete(id)
    return { success: true, message: '删除成功' }
  }

  // 简历管理
  async getAllResumes(status?: ResumeStatus, jobId?: string): Promise<Resume[]> {
    let resumes = Array.from(this.resumes.values())

    if (status) resumes = resumes.filter((r) => r.status === status)
    if (jobId) resumes = resumes.filter((r) => r.jobId === jobId)

    return resumes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getResumeById(id: string): Promise<Resume | null> {
    return this.resumes.get(id) || null
  }

  async createResume(data: Partial<Resume>): Promise<Resume> {
    const id = `RES-${Date.now().toString(36).toUpperCase()}`

    const job = this.jobs.get(data.jobId || '')

    const resume: Resume = {
      id,
      jobId: data.jobId || '',
      jobTitle: job?.title || '',
      name: data.name || '',
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      age: data.age,
      education: data.education,
      experience: data.experience,
      resumeUrl: data.resumeUrl,
      resumeFile: data.resumeFile,
      status: ResumeStatus.NEW,
      source: data.source,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.resumes.set(id, resume)

    // 更新职位统计
    if (job) {
      job.totalApplications = (job.totalApplications || 0) + 1
    }

    return resume
  }

  async screenResume(
    id: string,
    score: number,
    notes: string,
    passed: boolean,
  ): Promise<Resume | null> {
    const resume = this.resumes.get(id)
    if (!resume) return null

    resume.screeningScore = score
    resume.screeningNotes = notes
    resume.screenedBy = 'admin'
    resume.status = passed ? ResumeStatus.PASSED : ResumeStatus.FAILED
    resume.updatedAt = new Date()

    // 更新职位统计
    const job = this.jobs.get(resume.jobId)
    if (job) {
      if (passed) {
        job.screeningPassed = (job.screeningPassed || 0) + 1
      }
    }

    return resume
  }

  async rejectResume(id: string): Promise<Resume | null> {
    const resume = this.resumes.get(id)
    if (!resume) return null

    resume.status = ResumeStatus.REJECTED
    resume.updatedAt = new Date()
    return resume
  }

  // 面试管理
  async scheduleInterview(resumeId: string, data: Partial<Interview>): Promise<Interview | null> {
    const resume = this.resumes.get(resumeId)
    if (!resume) return null

    const id = `INT-${Date.now().toString(36).toUpperCase()}`

    const interview: Interview = {
      id,
      resumeId,
      jobId: resume.jobId,
      round: data.round || 1,
      type: data.type || 'onsite',
      scheduledAt: data.scheduledAt || new Date(),
      durationMinutes: data.durationMinutes || 60,
      interviewerId: data.interviewerId || 'EMP-001',
      interviewerName: data.interviewerName || '面试官',
      status: InterviewStatus.SCHEDULED,
      createdAt: new Date(),
    }

    this.interviews.set(id, interview)

    // 更新简历状态
    resume.status = ResumeStatus.INTERVIEW
    resume.interviews = resume.interviews || []
    resume.interviews.push(interview)
    resume.updatedAt = new Date()

    // 更新职位统计
    const job = this.jobs.get(resume.jobId)
    if (job) {
      job.interviewScheduled = (job.interviewScheduled || 0) + 1
    }

    return interview
  }

  async completeInterview(
    id: string,
    result: InterviewResult,
    feedback: string,
    rating: number,
  ): Promise<Interview | null> {
    const interview = this.interviews.get(id)
    if (!interview) return null

    interview.status = InterviewStatus.COMPLETED
    interview.result = result
    interview.feedback = feedback
    interview.rating = rating
    interview.strengths = '技术能力强'
    interview.weaknesses = '沟通有待提升'

    // 更新简历状态
    const resume = this.resumes.get(interview.resumeId)
    if (resume) {
      if (result === InterviewResult.PASS) {
        // 多轮面试，检查是否还有下一轮
        const nextRound = interview.round + 1
        if (nextRound <= 3) {
          // 等待安排下一轮
        } else {
          // 所有轮次通过，准备发offer
          resume.status = ResumeStatus.INTERVIEW
        }
      } else {
        resume.status = ResumeStatus.REJECTED
      }
      resume.updatedAt = new Date()
    }

    return interview
  }

  async cancelInterview(id: string): Promise<Interview | null> {
    const interview = this.interviews.get(id)
    if (!interview) return null

    interview.status = InterviewStatus.CANCELLED

    const resume = this.resumes.get(interview.resumeId)
    if (resume) {
      resume.status = ResumeStatus.PASSED
      resume.updatedAt = new Date()
    }

    return interview
  }

  // Offer管理
  async sendOffer(resumeId: string, salary: number, startDate: Date): Promise<Resume | null> {
    const resume = this.resumes.get(resumeId)
    if (!resume) return null

    resume.status = ResumeStatus.OFFERED
    resume.offer = {
      salary,
      startDate,
      sentAt: new Date(),
    }
    resume.updatedAt = new Date()

    return resume
  }

  async acceptOffer(resumeId: string): Promise<Resume | null> {
    const resume = this.resumes.get(resumeId)
    if (!resume || !resume.offer) return null

    resume.status = ResumeStatus.HIRED
    resume.offer.acceptedAt = new Date()
    resume.updatedAt = new Date()

    // 更新职位招聘人数
    const job = this.jobs.get(resume.jobId)
    if (job) {
      job.filledCount = (job.filledCount || 0) + 1

      if (job.filledCount >= job.headcount) {
        job.status = JobStatus.FILLED
      }
    }

    return resume
  }

  async rejectOffer(resumeId: string): Promise<Resume | null> {
    const resume = this.resumes.get(resumeId)
    if (!resume) return null

    resume.status = ResumeStatus.REJECTED
    resume.updatedAt = new Date()

    return resume
  }

  // 统计
  async getStats(): Promise<RecruitmentStats> {
    const jobs = Array.from(this.jobs.values())
    const resumes = Array.from(this.resumes.values())

    const screeningScores = resumes.filter((r) => r.screeningScore).map((r) => r.screeningScore!)

    const avgScore =
      screeningScores.length > 0
        ? screeningScores.reduce((sum, s) => sum + s, 0) / screeningScores.length
        : 0

    const hiredCount = resumes.filter((r) => r.status === ResumeStatus.HIRED).length
    const conversionRate = resumes.length > 0 ? (hiredCount / resumes.length) * 100 : 0

    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((j) => j.status === JobStatus.PUBLISHED).length,
      closedJobs: jobs.filter((j) => j.status === JobStatus.CLOSED || j.status === JobStatus.FILLED)
        .length,
      totalApplications: resumes.length,
      newApplications: resumes.filter((r) => r.status === ResumeStatus.NEW).length,
      screeningPassed: resumes.filter(
        (r) => r.status === ResumeStatus.PASSED || r.status === ResumeStatus.INTERVIEW,
      ).length,
      interviewScheduled: resumes.filter((r) => r.status === ResumeStatus.INTERVIEW).length,
      offered: resumes.filter((r) => r.status === ResumeStatus.OFFERED).length,
      hired: hiredCount,
      avgScreeningScore: Math.round(avgScore),
      conversionRate: Math.round(conversionRate * 10) / 10,
      avgDaysToHire: 21,
    }
  }
}
