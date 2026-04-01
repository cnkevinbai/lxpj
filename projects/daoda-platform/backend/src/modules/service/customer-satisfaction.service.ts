/**
 * 客户满意度服务
 * 满意度调查、评分管理、投诉处理、反馈分析
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum SurveyStatus {
  DRAFT = 'DRAFT', // 草稿
  PUBLISHED = 'PUBLISHED', // 已发布
  IN_PROGRESS = 'IN_PROGRESS', // 进行中
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
}

export enum SurveyType {
  SERVICE = 'SERVICE', // 服务满意度
  PRODUCT = 'PRODUCT', // 产品满意度
  OVERALL = 'OVERALL', // 整体满意度
  NPS = 'NPS', // 净推荐值
  CSAT = 'CSAT', // 客户满意度评分
  CES = 'CES', // 客户费力指数
}

export enum QuestionType {
  SINGLE = 'SINGLE', // 单选
  MULTIPLE = 'MULTIPLE', // 多选
  SCALE = 'SCALE', // 量表（1-5, 1-10）
  TEXT = 'TEXT', // 文本
  NPS = 'NPS', // NPS评分
  RATING = 'RATING', // 星级评分
}

export enum ComplaintStatus {
  PENDING = 'PENDING', // 待处理
  PROCESSING = 'PROCESSING', // 处理中
  RESOLVED = 'RESOLVED', // 已解决
  CLOSED = 'CLOSED', // 已关闭
  ESCALATED = 'ESCALATED', // 已升级
}

export enum ComplaintLevel {
  LOW = 'LOW', // 低
  MEDIUM = 'MEDIUM', // 中
  HIGH = 'HIGH', // 高
  CRITICAL = 'CRITICAL', // 严重
}

export enum FeedbackType {
  PRAISE = 'PRAISE', // 表扬
  SUGGESTION = 'SUGGESTION', // 建议
  COMPLAINT = 'COMPLAINT', // 投诉
  QUESTION = 'QUESTION', // 咨询
  OTHER = 'OTHER', // 其他
}

// ========== 导出接口类型 ==========

export interface SatisfactionSurvey {
  id: string
  surveyCode: string // 调查编号
  surveyName: string // 调查名称
  surveyType: SurveyType // 调查类型

  // 关联
  relatedType?: 'TICKET' | 'ORDER' | 'CONTRACT' | 'GENERAL' // 关联类型
  relatedId?: string // 关联ID

  // 问题列表
  questions: SurveyQuestion[]

  // 时间
  startDate?: Date
  endDate?: Date

  // 统计
  totalSent: number // 发送数量
  totalResponses: number // 回复数量
  responseRate: number // 回复率

  // 状态
  status: SurveyStatus

  // 结果
  averageScore?: number // 平均分
  npsScore?: number // NPS分数

  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface SurveyQuestion {
  id: string
  questionText: string // 问题文本
  questionType: QuestionType // 问题类型
  required: boolean // 是否必填

  // 选项
  options?: {
    value: string
    label: string
    score?: number // 分数
  }[]

  // 量表设置
  scaleMin?: number // 最小值
  scaleMax?: number // 最大值
  scaleLabels?: {
    // 标签
    min: string
    max: string
  }

  sortOrder: number // 排序
}

export interface SurveyResponse {
  id: string
  surveyId: string
  surveyCode: string
  surveyName: string

  // 受访者
  respondentType: 'CUSTOMER' | 'CONTACT' // 受访者类型
  respondentId: string // 受访者ID
  respondentName: string // 受访者姓名

  // 关联
  relatedType?: string
  relatedId?: string

  // 答案
  answers: {
    questionId: string
    questionText: string
    answerType: QuestionType
    answer: any // 答案内容
    score?: number // 得分
  }[]

  // 总分
  totalScore?: number
  averageScore?: number

  // NPS分类
  npsCategory?: 'PROMOTER' | 'PASSIVE' | 'DETRACTOR' // 推荐/中立/贬损

  // 文本反馈
  feedback?: string

  // 标签
  tags?: string[]

  // 跟进
  needsFollowUp: boolean // 是否需要跟进
  followUpStatus?: 'PENDING' | 'COMPLETED'
  followUpNote?: string

  respondedAt: Date
  createdAt: Date
}

export interface CustomerComplaint {
  id: string
  complaintCode: string // 投诉编号

  // 投诉人
  customerId: string
  customerName: string
  customerPhone?: string
  customerEmail?: string

  // 投诉内容
  complaintType: string // 投诉类型
  complaintLevel: ComplaintLevel // 投诉级别
  title: string // 投诉标题
  description: string // 投诉描述

  // 关联
  relatedType?: 'TICKET' | 'ORDER' | 'SERVICE' | 'PRODUCT'
  relatedId?: string

  // 时间
  complaintDate: Date // 投诉日期
  expectedResolveDate?: Date // 期望解决日期
  actualResolveDate?: Date // 实际解决日期

  // 处理
  status: ComplaintStatus
  handlerId?: string // 处理人ID
  handlerName?: string // 处理人姓名
  assignedAt?: Date // 分配时间

  // 解决
  resolution?: string // 解决方案
  compensation?: number // 赔偿金额

  // 满意度
  satisfactionScore?: number // 满意度评分
  satisfactionFeedback?: string // 满意度反馈

  // 附件
  attachments?: string[]

  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CustomerFeedback {
  id: string
  feedbackCode: string

  // 反馈人
  customerId: string
  customerName: string

  // 反馈内容
  feedbackType: FeedbackType
  title: string
  content: string

  // 关联
  relatedType?: string
  relatedId?: string

  // 处理
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED'
  handlerId?: string
  handlerName?: string
  response?: string // 回复内容

  // 评分
  rating?: number // 评分 1-5

  // 标签
  tags?: string[]

  attachments?: string[]

  tenantId: string
  createdAt: Date
  updatedAt: Date
}

export interface SatisfactionMetric {
  id: string
  metricCode: string
  metricName: string

  // 类型
  metricType: 'CSAT' | 'NPS' | 'CES' | 'CUSTOM'

  // 计算方式
  calculationMethod: 'AVERAGE' | 'SUM' | 'COUNT'

  // 目标
  targetValue?: number

  // 频率
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY'

  // 历史
  history: {
    period: string
    value: number
    target?: number
  }[]

  status: 'ACTIVE' | 'INACTIVE'
  tenantId: string
  createdAt: Date
}

@Injectable()
export class CustomerSatisfactionService {
  // 调查存储
  private surveys: Map<string, SatisfactionSurvey> = new Map()

  // 调查回复存储
  private responses: Map<string, SurveyResponse> = new Map()

  // 投诉存储
  private complaints: Map<string, CustomerComplaint> = new Map()

  // 反馈存储
  private feedbacks: Map<string, CustomerFeedback> = new Map()

  // 指标存储
  private metrics: Map<string, SatisfactionMetric> = new Map()

  constructor() {
    this.initSampleData()
  }

  private initSampleData() {
    // 示例调查
    const sampleSurveys: Partial<SatisfactionSurvey>[] = [
      {
        id: 'survey-001',
        surveyCode: 'SURV-2026-001',
        surveyName: '2026年Q1客户满意度调查',
        surveyType: SurveyType.OVERALL,
        questions: [
          {
            id: 'q1',
            questionText: '您对我们服务的整体满意度如何？',
            questionType: QuestionType.SCALE,
            required: true,
            scaleMin: 1,
            scaleMax: 5,
            sortOrder: 1,
          },
          {
            id: 'q2',
            questionText: '您是否愿意向他人推荐我们的服务？',
            questionType: QuestionType.NPS,
            required: true,
            sortOrder: 2,
          },
          {
            id: 'q3',
            questionText: '您有什么建议或意见？',
            questionType: QuestionType.TEXT,
            required: false,
            sortOrder: 3,
          },
        ],
        totalSent: 500,
        totalResponses: 320,
        responseRate: 64,
        status: SurveyStatus.COMPLETED,
        averageScore: 4.2,
        npsScore: 35,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleSurveys.forEach((survey) => {
      this.surveys.set(survey.id!, survey as SatisfactionSurvey)
    })

    // 示例投诉
    const sampleComplaints: Partial<CustomerComplaint>[] = [
      {
        id: 'complaint-001',
        complaintCode: 'COMP-2026-001',
        customerId: 'customer-001',
        customerName: '张三',
        customerPhone: '138****8888',
        complaintType: '服务态度',
        complaintLevel: ComplaintLevel.MEDIUM,
        title: '服务人员态度不佳',
        description: '在办理业务时，服务人员态度冷漠，回复不耐烦。',
        status: ComplaintStatus.RESOLVED,
        handlerId: 'user-001',
        handlerName: '李四',
        resolution: '已对该员工进行培训，并向客户致歉。',
        satisfactionScore: 4,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleComplaints.forEach((complaint) => {
      this.complaints.set(complaint.id!, complaint as CustomerComplaint)
    })
  }

  // ========== 满意度调查管理 ==========

  async getSurveys(params?: { surveyType?: SurveyType; status?: SurveyStatus }) {
    let list = Array.from(this.surveys.values())
    if (params?.surveyType) {
      list = list.filter((s) => s.surveyType === params.surveyType)
    }
    if (params?.status) {
      list = list.filter((s) => s.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getSurvey(id: string): Promise<SatisfactionSurvey | null> {
    return this.surveys.get(id) || null
  }

  async createSurvey(survey: Partial<SatisfactionSurvey>): Promise<SatisfactionSurvey> {
    const id = `survey-${Date.now()}`
    const surveyCode = `SURV-${new Date().getFullYear()}-${String(this.surveys.size + 1).padStart(3, '0')}`

    const newSurvey: SatisfactionSurvey = {
      id,
      surveyCode,
      surveyName: survey.surveyName!,
      surveyType: survey.surveyType || SurveyType.OVERALL,
      relatedType: survey.relatedType,
      relatedId: survey.relatedId,
      questions: survey.questions || [],
      startDate: survey.startDate,
      endDate: survey.endDate,
      totalSent: 0,
      totalResponses: 0,
      responseRate: 0,
      status: SurveyStatus.DRAFT,
      tenantId: survey.tenantId || 'tenant-001',
      createdBy: survey.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.surveys.set(id, newSurvey)
    return newSurvey
  }

  async publishSurvey(id: string): Promise<SatisfactionSurvey | null> {
    const survey = this.surveys.get(id)
    if (!survey) return null

    survey.status = SurveyStatus.PUBLISHED
    survey.updatedAt = new Date()
    this.surveys.set(id, survey)
    return survey
  }

  // ========== 调查回复管理 ==========

  async submitResponse(
    surveyId: string,
    response: Partial<SurveyResponse>,
  ): Promise<SurveyResponse> {
    const survey = this.surveys.get(surveyId)
    if (!survey) throw new Error('调查不存在')

    const id = `response-${Date.now()}`

    // 计算分数
    let totalScore = 0
    let scoreCount = 0
    response.answers?.forEach((a) => {
      if (a.score !== undefined) {
        totalScore += a.score
        scoreCount++
      }
    })
    const averageScore = scoreCount > 0 ? totalScore / scoreCount : undefined

    // NPS分类
    let npsCategory: 'PROMOTER' | 'PASSIVE' | 'DETRACTOR' | undefined
    if (response.answers?.some((a) => a.answerType === QuestionType.NPS)) {
      const npsAnswer = response.answers.find((a) => a.answerType === QuestionType.NPS)
      if (npsAnswer) {
        const score = npsAnswer.score || 0
        npsCategory = score >= 9 ? 'PROMOTER' : score >= 7 ? 'PASSIVE' : 'DETRACTOR'
      }
    }

    const newResponse: SurveyResponse = {
      id,
      surveyId,
      surveyCode: survey.surveyCode,
      surveyName: survey.surveyName,
      respondentType: response.respondentType || 'CUSTOMER',
      respondentId: response.respondentId!,
      respondentName: response.respondentName!,
      relatedType: response.relatedType,
      relatedId: response.relatedId,
      answers: response.answers || [],
      totalScore,
      averageScore,
      npsCategory,
      feedback: response.feedback,
      tags: response.tags,
      needsFollowUp: response.needsFollowUp ?? false,
      respondedAt: new Date(),
      createdAt: new Date(),
    }

    this.responses.set(id, newResponse)

    // 更新调查统计
    survey.totalResponses++
    survey.responseRate =
      survey.totalSent > 0 ? (survey.totalResponses / survey.totalSent) * 100 : 0
    this.surveys.set(surveyId, survey)

    return newResponse
  }

  async getResponses(surveyId: string, params?: { npsCategory?: string }) {
    let list = Array.from(this.responses.values()).filter((r) => r.surveyId === surveyId)
    if (params?.npsCategory) {
      list = list.filter((r) => r.npsCategory === params.npsCategory)
    }
    return list.sort((a, b) => b.respondedAt.getTime() - a.respondedAt.getTime())
  }

  // ========== 投诉管理 ==========

  async getComplaints(params?: { status?: ComplaintStatus; level?: ComplaintLevel }) {
    let list = Array.from(this.complaints.values())
    if (params?.status) {
      list = list.filter((c) => c.status === params.status)
    }
    if (params?.level) {
      list = list.filter((c) => c.complaintLevel === params.level)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getComplaint(id: string): Promise<CustomerComplaint | null> {
    return this.complaints.get(id) || null
  }

  async createComplaint(complaint: Partial<CustomerComplaint>): Promise<CustomerComplaint> {
    const id = `complaint-${Date.now()}`
    const complaintCode = `COMP-${new Date().getFullYear()}-${String(this.complaints.size + 1).padStart(3, '0')}`

    const newComplaint: CustomerComplaint = {
      id,
      complaintCode,
      customerId: complaint.customerId!,
      customerName: complaint.customerName!,
      customerPhone: complaint.customerPhone,
      customerEmail: complaint.customerEmail,
      complaintType: complaint.complaintType!,
      complaintLevel: complaint.complaintLevel || ComplaintLevel.MEDIUM,
      title: complaint.title!,
      description: complaint.description!,
      relatedType: complaint.relatedType,
      relatedId: complaint.relatedId,
      complaintDate: complaint.complaintDate || new Date(),
      expectedResolveDate: complaint.expectedResolveDate,
      status: ComplaintStatus.PENDING,
      attachments: complaint.attachments || [],
      tenantId: complaint.tenantId || 'tenant-001',
      createdBy: complaint.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.complaints.set(id, newComplaint)
    return newComplaint
  }

  async assignComplaint(
    id: string,
    handlerId: string,
    handlerName: string,
  ): Promise<CustomerComplaint | null> {
    const complaint = this.complaints.get(id)
    if (!complaint) return null

    complaint.status = ComplaintStatus.PROCESSING
    complaint.handlerId = handlerId
    complaint.handlerName = handlerName
    complaint.assignedAt = new Date()
    complaint.updatedAt = new Date()
    this.complaints.set(id, complaint)
    return complaint
  }

  async resolveComplaint(
    id: string,
    resolution: string,
    compensation?: number,
  ): Promise<CustomerComplaint | null> {
    const complaint = this.complaints.get(id)
    if (!complaint) return null

    complaint.status = ComplaintStatus.RESOLVED
    complaint.resolution = resolution
    complaint.compensation = compensation
    complaint.actualResolveDate = new Date()
    complaint.updatedAt = new Date()
    this.complaints.set(id, complaint)
    return complaint
  }

  async closeComplaint(
    id: string,
    satisfactionScore: number,
    feedback?: string,
  ): Promise<CustomerComplaint | null> {
    const complaint = this.complaints.get(id)
    if (!complaint) return null

    complaint.status = ComplaintStatus.CLOSED
    complaint.satisfactionScore = satisfactionScore
    complaint.satisfactionFeedback = feedback
    complaint.updatedAt = new Date()
    this.complaints.set(id, complaint)
    return complaint
  }

  // ========== 客户反馈管理 ==========

  async getFeedbacks(params?: { feedbackType?: FeedbackType; status?: string }) {
    let list = Array.from(this.feedbacks.values())
    if (params?.feedbackType) {
      list = list.filter((f) => f.feedbackType === params.feedbackType)
    }
    if (params?.status) {
      list = list.filter((f) => f.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async createFeedback(feedback: Partial<CustomerFeedback>): Promise<CustomerFeedback> {
    const id = `feedback-${Date.now()}`
    const feedbackCode = `FB-${new Date().getFullYear()}-${String(this.feedbacks.size + 1).padStart(4, '0')}`

    const newFeedback: CustomerFeedback = {
      id,
      feedbackCode,
      customerId: feedback.customerId!,
      customerName: feedback.customerName!,
      feedbackType: feedback.feedbackType || FeedbackType.OTHER,
      title: feedback.title!,
      content: feedback.content!,
      relatedType: feedback.relatedType,
      relatedId: feedback.relatedId,
      status: 'PENDING',
      rating: feedback.rating,
      tags: feedback.tags || [],
      attachments: feedback.attachments || [],
      tenantId: feedback.tenantId || 'tenant-001',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.feedbacks.set(id, newFeedback)
    return newFeedback
  }

  // ========== 统计分析 ==========

  async getStats() {
    const surveys = Array.from(this.surveys.values())
    const responses = Array.from(this.responses.values())
    const complaints = Array.from(this.complaints.values())
    const feedbacks = Array.from(this.feedbacks.values())

    // 计算NPS
    const npsResponses = responses.filter((r) => r.npsCategory)
    const promoters = npsResponses.filter((r) => r.npsCategory === 'PROMOTER').length
    const detractors = npsResponses.filter((r) => r.npsCategory === 'DETRACTOR').length
    const npsScore =
      npsResponses.length > 0
        ? Math.round(((promoters - detractors) / npsResponses.length) * 100)
        : 0

    // 计算平均满意度
    const scoredResponses = responses.filter((r) => r.averageScore !== undefined)
    const avgSatisfaction =
      scoredResponses.length > 0
        ? scoredResponses.reduce((sum, r) => sum + (r.averageScore || 0), 0) /
          scoredResponses.length
        : 0

    return {
      surveys: {
        total: surveys.length,
        published: surveys.filter(
          (s) => s.status === SurveyStatus.PUBLISHED || s.status === SurveyStatus.COMPLETED,
        ).length,
        totalResponses: responses.length,
        avgResponseRate:
          surveys.length > 0
            ? surveys.reduce((sum, s) => sum + s.responseRate, 0) / surveys.length
            : 0,
      },
      satisfaction: {
        avgScore: avgSatisfaction.toFixed(2),
        npsScore,
        promoters: promoters,
        passives: npsResponses.filter((r) => r.npsCategory === 'PASSIVE').length,
        detractors,
      },
      complaints: {
        total: complaints.length,
        pending: complaints.filter((c) => c.status === ComplaintStatus.PENDING).length,
        processing: complaints.filter((c) => c.status === ComplaintStatus.PROCESSING).length,
        resolved: complaints.filter(
          (c) => c.status === ComplaintStatus.RESOLVED || c.status === ComplaintStatus.CLOSED,
        ).length,
        avgSatisfaction:
          complaints
            .filter((c) => c.satisfactionScore)
            .reduce((sum, c) => sum + (c.satisfactionScore || 0), 0) /
            complaints.filter((c) => c.satisfactionScore).length || 0,
      },
      feedbacks: {
        total: feedbacks.length,
        praise: feedbacks.filter((f) => f.feedbackType === FeedbackType.PRAISE).length,
        suggestion: feedbacks.filter((f) => f.feedbackType === FeedbackType.SUGGESTION).length,
        complaint: feedbacks.filter((f) => f.feedbackType === FeedbackType.COMPLAINT).length,
      },
    }
  }
}
