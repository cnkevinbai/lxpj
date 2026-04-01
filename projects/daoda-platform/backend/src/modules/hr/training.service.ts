/**
 * 培训管理服务
 * 培训计划、课程管理、培训记录、培训评估
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum TrainingStatus {
  DRAFT = 'DRAFT', // 草稿
  PUBLISHED = 'PUBLISHED', // 已发布
  IN_PROGRESS = 'IN_PROGRESS', // 进行中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
}

export enum CourseType {
  INTERNAL = 'INTERNAL', // 内部课程
  EXTERNAL = 'EXTERNAL', // 外部课程
  ONLINE = 'ONLINE', // 在线课程
  OFFLINE = 'OFFLINE', // 线下课程
  MIXED = 'MIXED', // 混合课程
}

export enum TrainingCategory {
  INDUCTION = 'INDUCTION', // 入职培训
  SKILL = 'SKILL', // 技能培训
  MANAGEMENT = 'MANAGEMENT', // 管理培训
  SAFETY = 'SAVETY', // 安全培训
  COMPLIANCE = 'COMPLIANCE', // 合规培训
  PROFESSIONAL = 'PROFESSIONAL', // 专业培训
  OTHER = 'OTHER', // 其他
}

export enum RecordStatus {
  REGISTERED = 'REGISTERED', // 已报名
  ATTENDING = 'ATTENDING', // 参训中
  COMPLETED = 'COMPLETED', // 已完成
  ABSENT = 'ABSENT', // 缺席
  FAILED = 'FAILED', // 未通过
}

// ========== 导出接口类型 ==========

export interface Course {
  id: string
  courseCode: string // 课程编号
  courseName: string // 课程名称
  courseType: CourseType // 课程类型
  category: TrainingCategory // 培训分类

  // 基本信息
  description?: string // 课程描述
  objectives?: string // 培训目标
  targetAudience?: string // 目标人群
  prerequisites?: string // 前置要求

  // 时长信息
  duration: number // 时长（小时）
  credits?: number // 学分

  // 讲师信息
  instructorId?: string // 讲师ID
  instructorName?: string // 讲师姓名
  instructorType?: 'INTERNAL' | 'EXTERNAL' // 讲师类型

  // 费用信息
  cost?: number // 费用

  // 资源
  materials?: string[] // 培训资料
  videoUrl?: string // 视频链接

  // 统计
  totalTrainings: number // 总培训次数
  totalParticipants: number // 总参与人数

  status: 'ACTIVE' | 'INACTIVE' // 状态
  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TrainingPlan {
  id: string
  planCode: string // 计划编号
  planName: string // 计划名称
  courseId: string
  courseCode: string
  courseName: string

  // 时间信息
  startDate: Date // 开始日期
  endDate: Date // 结束日期
  registrationDeadline?: Date // 报名截止

  // 地点信息
  location?: string // 培训地点
  onlineLink?: string // 在线链接

  // 容量信息
  maxParticipants: number // 最大人数
  currentParticipants: number // 当前人数

  // 讲师
  instructorId?: string
  instructorName?: string

  // 状态
  status: TrainingStatus

  // 费用
  cost?: number // 人均费用

  // 备注
  notes?: string

  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface TrainingRecord {
  id: string
  recordCode: string // 记录编号
  planId: string
  planCode: string
  planName: string
  courseId: string
  courseCode: string
  courseName: string

  // 学员信息
  employeeId: string // 员工ID
  employeeNo: string // 工号
  employeeName: string // 姓名
  departmentId?: string // 部门ID
  departmentName?: string // 部门名称

  // 时间信息
  registeredAt: Date // 报名时间
  startedAt?: Date // 开始时间
  completedAt?: Date // 完成时间

  // 状态
  status: RecordStatus

  // 评估信息
  attendance?: number // 出勤率（%）
  score?: number // 成绩
  passed?: boolean // 是否通过
  certificateId?: string // 证书ID

  // 评估
  evaluation?: {
    // 培训评估
    content?: number // 内容评分 1-5
    instructor?: number // 讲师评分 1-5
    organization?: number // 组织评分 1-5
    overall?: number // 总体评分 1-5
    comment?: string // 评价
  }

  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Certificate {
  id: string
  certificateCode: string // 证书编号
  certificateName: string // 证书名称
  employeeId: string
  employeeName: string
  courseId: string
  courseName: string

  issueDate: Date // 发证日期
  expiryDate?: Date // 有效期至

  score?: number // 成绩
  issuer?: string // 发证机构

  status: 'VALID' | 'EXPIRED' // 状态

  createdAt: Date
}

@Injectable()
export class TrainingService {
  // 课程存储
  private courses: Map<string, Course> = new Map()

  // 培训计划存储
  private plans: Map<string, TrainingPlan> = new Map()

  // 培训记录存储
  private records: Map<string, TrainingRecord> = new Map()

  // 证书存储
  private certificates: Map<string, Certificate> = new Map()

  constructor() {
    this.initSampleData()
  }

  private initSampleData() {
    // 示例课程
    const sampleCourses: Partial<Course>[] = [
      {
        id: 'course-001',
        courseCode: 'CRS-001',
        courseName: '新员工入职培训',
        courseType: CourseType.INTERNAL,
        category: TrainingCategory.INDUCTION,
        description: '公司文化、规章制度、职业素养等基础培训',
        objectives: '帮助新员工快速融入公司',
        targetAudience: '新入职员工',
        duration: 8,
        credits: 2,
        cost: 0,
        totalTrainings: 12,
        totalParticipants: 150,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'course-002',
        courseCode: 'CRS-002',
        courseName: '安全生产培训',
        courseType: CourseType.INTERNAL,
        category: TrainingCategory.SAFETY,
        description: '安全生产法规、安全操作规程、应急处理',
        objectives: '提高员工安全意识',
        targetAudience: '全体员工',
        duration: 4,
        credits: 1,
        cost: 0,
        totalTrainings: 24,
        totalParticipants: 500,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'course-003',
        courseCode: 'CRS-003',
        courseName: '管理技能提升培训',
        courseType: CourseType.EXTERNAL,
        category: TrainingCategory.MANAGEMENT,
        description: '领导力、沟通技巧、团队管理等',
        objectives: '提升中层管理人员管理能力',
        targetAudience: '中层管理人员',
        duration: 16,
        credits: 4,
        cost: 2000,
        totalTrainings: 4,
        totalParticipants: 40,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleCourses.forEach((course) => {
      this.courses.set(course.id!, course as Course)
    })

    // 示例培训计划
    const samplePlans: Partial<TrainingPlan>[] = [
      {
        id: 'plan-001',
        planCode: 'TP-2026-001',
        planName: '2026年4月新员工入职培训',
        courseId: 'course-001',
        courseCode: 'CRS-001',
        courseName: '新员工入职培训',
        startDate: new Date('2026-04-15'),
        endDate: new Date('2026-04-16'),
        registrationDeadline: new Date('2026-04-10'),
        location: '公司培训室',
        maxParticipants: 30,
        currentParticipants: 15,
        status: TrainingStatus.PUBLISHED,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    samplePlans.forEach((plan) => {
      this.plans.set(plan.id!, plan as TrainingPlan)
    })
  }

  // ========== 课程管理 ==========

  async getCourses(params?: {
    courseType?: CourseType
    category?: TrainingCategory
    status?: string
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    let list = Array.from(this.courses.values())

    if (params?.courseType) {
      list = list.filter((c) => c.courseType === params.courseType)
    }
    if (params?.category) {
      list = list.filter((c) => c.category === params.category)
    }
    if (params?.status) {
      list = list.filter((c) => c.status === params.status)
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (c) => c.courseCode.toLowerCase().includes(kw) || c.courseName.toLowerCase().includes(kw),
      )
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = list.length
    const start = (page - 1) * pageSize
    const data = list.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  }

  async getCourse(id: string): Promise<Course | null> {
    return this.courses.get(id) || null
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    const id = `course-${Date.now()}`
    const courseCode = course.courseCode || `CRS-${String(this.courses.size + 1).padStart(3, '0')}`

    const newCourse: Course = {
      id,
      courseCode,
      courseName: course.courseName!,
      courseType: course.courseType || CourseType.INTERNAL,
      category: course.category || TrainingCategory.OTHER,
      description: course.description,
      objectives: course.objectives,
      targetAudience: course.targetAudience,
      prerequisites: course.prerequisites,
      duration: course.duration || 0,
      credits: course.credits,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      instructorType: course.instructorType,
      cost: course.cost,
      materials: course.materials || [],
      videoUrl: course.videoUrl,
      totalTrainings: 0,
      totalParticipants: 0,
      status: 'ACTIVE',
      tenantId: course.tenantId || 'tenant-001',
      createdBy: course.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.courses.set(id, newCourse)
    return newCourse
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const course = this.courses.get(id)
    if (!course) return null

    const updated = { ...course, ...updates, updatedAt: new Date() }
    this.courses.set(id, updated)
    return updated
  }

  async deleteCourse(id: string): Promise<boolean> {
    return this.courses.delete(id)
  }

  // ========== 培训计划管理 ==========

  async getPlans(params?: { courseId?: string; status?: TrainingStatus }) {
    let list = Array.from(this.plans.values())
    if (params?.courseId) {
      list = list.filter((p) => p.courseId === params.courseId)
    }
    if (params?.status) {
      list = list.filter((p) => p.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getPlan(id: string): Promise<TrainingPlan | null> {
    return this.plans.get(id) || null
  }

  async createPlan(plan: Partial<TrainingPlan>): Promise<TrainingPlan> {
    const course = this.courses.get(plan.courseId!)
    if (!course) throw new Error('课程不存在')

    const id = `plan-${Date.now()}`
    const planCode = `TP-${new Date().getFullYear()}-${String(this.plans.size + 1).padStart(3, '0')}`

    const newPlan: TrainingPlan = {
      id,
      planCode,
      planName: plan.planName || `${course.courseName} 培训计划`,
      courseId: plan.courseId!,
      courseCode: course.courseCode,
      courseName: course.courseName,
      startDate: plan.startDate || new Date(),
      endDate: plan.endDate || new Date(),
      registrationDeadline: plan.registrationDeadline,
      location: plan.location,
      onlineLink: plan.onlineLink,
      maxParticipants: plan.maxParticipants || 50,
      currentParticipants: 0,
      instructorId: plan.instructorId || course.instructorId,
      instructorName: plan.instructorName || course.instructorName,
      status: TrainingStatus.DRAFT,
      cost: plan.cost || course.cost,
      notes: plan.notes,
      tenantId: plan.tenantId || 'tenant-001',
      createdBy: plan.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.plans.set(id, newPlan)
    return newPlan
  }

  async publishPlan(id: string): Promise<TrainingPlan | null> {
    const plan = this.plans.get(id)
    if (!plan) return null

    plan.status = TrainingStatus.PUBLISHED
    plan.updatedAt = new Date()
    this.plans.set(id, plan)

    // 更新课程统计
    const course = this.courses.get(plan.courseId)
    if (course) {
      course.totalTrainings += 1
      course.updatedAt = new Date()
      this.courses.set(course.id, course)
    }

    return plan
  }

  // ========== 培训记录管理 ==========

  async register(params: {
    planId: string
    employeeId: string
    employeeNo: string
    employeeName: string
    departmentId?: string
    departmentName?: string
  }): Promise<TrainingRecord> {
    const plan = this.plans.get(params.planId)
    if (!plan) throw new Error('培训计划不存在')

    if (plan.currentParticipants >= plan.maxParticipants) {
      throw new Error('报名人数已满')
    }

    const id = `record-${Date.now()}`
    const recordCode = `TR-${new Date().getFullYear()}-${String(this.records.size + 1).padStart(4, '0')}`

    const record: TrainingRecord = {
      id,
      recordCode,
      planId: params.planId,
      planCode: plan.planCode,
      planName: plan.planName,
      courseId: plan.courseId,
      courseCode: plan.courseCode,
      courseName: plan.courseName,
      employeeId: params.employeeId,
      employeeNo: params.employeeNo,
      employeeName: params.employeeName,
      departmentId: params.departmentId,
      departmentName: params.departmentName,
      registeredAt: new Date(),
      status: RecordStatus.REGISTERED,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.records.set(id, record)

    // 更新计划参与人数
    plan.currentParticipants += 1
    plan.updatedAt = new Date()
    this.plans.set(plan.id, plan)

    return record
  }

  async getRecords(params?: { planId?: string; employeeId?: string; status?: RecordStatus }) {
    let list = Array.from(this.records.values())
    if (params?.planId) {
      list = list.filter((r) => r.planId === params.planId)
    }
    if (params?.employeeId) {
      list = list.filter((r) => r.employeeId === params.employeeId)
    }
    if (params?.status) {
      list = list.filter((r) => r.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async completeTraining(
    id: string,
    result: { attendance: number; score?: number; passed?: boolean },
  ): Promise<TrainingRecord | null> {
    const record = this.records.get(id)
    if (!record) return null

    record.status = RecordStatus.COMPLETED
    record.completedAt = new Date()
    record.attendance = result.attendance
    record.score = result.score
    record.passed = result.passed
    record.updatedAt = new Date()
    this.records.set(id, record)

    // 更新课程统计
    const course = this.courses.get(record.courseId)
    if (course) {
      course.totalParticipants += 1
      course.updatedAt = new Date()
      this.courses.set(course.id, course)
    }

    return record
  }

  async evaluateTraining(
    id: string,
    evaluation: TrainingRecord['evaluation'],
  ): Promise<TrainingRecord | null> {
    const record = this.records.get(id)
    if (!record) return null

    record.evaluation = evaluation
    record.updatedAt = new Date()
    this.records.set(id, record)
    return record
  }

  // ========== 统计 ==========

  async getStats() {
    const courses = Array.from(this.courses.values())
    const plans = Array.from(this.plans.values())
    const records = Array.from(this.records.values())

    return {
      courses: {
        total: courses.length,
        active: courses.filter((c) => c.status === 'ACTIVE').length,
        totalTrainings: courses.reduce((sum, c) => sum + c.totalTrainings, 0),
        totalParticipants: courses.reduce((sum, c) => sum + c.totalParticipants, 0),
      },
      plans: {
        total: plans.length,
        published: plans.filter((p) => p.status === TrainingStatus.PUBLISHED).length,
        inProgress: plans.filter((p) => p.status === TrainingStatus.IN_PROGRESS).length,
        completed: plans.filter((p) => p.status === TrainingStatus.COMPLETED).length,
      },
      records: {
        total: records.length,
        completed: records.filter((r) => r.status === RecordStatus.COMPLETED).length,
        passed: records.filter((r) => r.passed).length,
        avgScore:
          records.filter((r) => r.score).reduce((sum, r) => sum + (r.score || 0), 0) /
            records.filter((r) => r.score).length || 0,
      },
      byCategory: this.groupBy(courses, 'category'),
    }
  }

  private groupBy(items: any[], key: string) {
    const result: Record<string, number> = {}
    items.forEach((item) => {
      const k = item[key] || '未分类'
      result[k] = (result[k] || 0) + 1
    })
    return result
  }
}
