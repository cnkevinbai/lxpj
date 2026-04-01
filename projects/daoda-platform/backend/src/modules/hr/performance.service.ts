/**
 * 绩效评估服务
 * KPI设置、绩效考核、绩效面谈、绩效改进
 */
import { Injectable } from '@nestjs/common'

// 评估周期枚举
export enum EvaluationCycle {
  MONTHLY = 'MONTHLY', // 月度评估
  QUARTERLY = 'QUARTERLY', // 季度评估
  HALF_YEAR = 'HALF_YEAR', // 半年评估
  YEARLY = 'YEARLY', // 年度评估
}

// 评估状态枚举
export enum EvaluationStatus {
  DRAFT = 'DRAFT', // 草稿
  SELF_EVALUATED = 'SELF_EVALUATED', // 已自评
  MANAGER_EVALUATED = 'MANAGER_EVALUATED', // 已主管评
  COMPLETED = 'COMPLETED', // 已完成
  REJECTED = 'REJECTED', // 已驳回
}

// KPI类型枚举
export enum KPIType {
  QUANTITATIVE = 'QUANTITATIVE', // 定量指标
  QUALITATIVE = 'QUALITATIVE', // 定性指标
}

// 评分等级枚举
export enum RatingLevel {
  EXCELLENT = 'EXCELLENT', // 优秀 S级 90-100
  GOOD = 'GOOD', // 良好 A级 80-89
  AVERAGE = 'AVERAGE', // 一般 B级 70-79
  BELOW = 'BELOW', // 较差 C级 60-69
  POOR = 'POOR', // 不合格 D级 <60
}

// KPI指标接口
export interface KPI {
  id: string
  name: string // 指标名称
  code?: string // 指标编码
  category?: string // 指标分类
  type: KPIType // 指标类型

  // 权重和目标
  weight: number // 权重百分比
  target?: number // 目标值(定量)
  unit?: string // 单位

  // 评分标准
  scoringCriteria?: string // 评分标准描述

  // 适用范围
  applicableRoles?: string[] // 适用角色
  applicableDepartments?: string[] // 适用部门

  createdAt: Date
  updatedAt: Date
}

// 绩效评估模板接口
export interface EvaluationTemplate {
  id: string
  name: string // 模板名称
  cycle: EvaluationCycle // 评估周期

  // 指标组成
  kpis: KPI[] // 包含的KPI指标

  // 权重分配
  weights: {
    selfEvaluation: number // 自评权重
    managerEvaluation: number // 主管评权重
  }

  // 适用范围
  applicableRoles?: string[]
  applicableDepartments?: string[]

  status: 'active' | 'inactive'
  createdAt: Date
}

// 员工绩效评估接口
export interface PerformanceEvaluation {
  id: string
  employeeId: string // 员工ID
  employeeName: string // 员工姓名
  departmentId?: string // 部门ID
  departmentName?: string // 部门名称
  position?: string // 职位

  // 评估周期
  cycle: EvaluationCycle
  period: string // 如: 2026-Q1, 2026-03

  // KPI评估明细
  kpiEvaluations: KPIEvaluation[]

  // 自评
  selfEvaluation?: {
    score: number
    comments?: string
    submittedAt?: Date
  }

  // 主管评估
  managerEvaluation?: {
    score: number
    comments?: string
    evaluatorId?: string
    evaluatorName?: string
    submittedAt?: Date
  }

  // 最终评分
  finalScore?: number // 最终得分
  rating?: RatingLevel // 评级

  // 绩效面谈
  reviewMeeting?: {
    scheduledAt?: Date
    completedAt?: Date
    feedback?: string
    improvementPlan?: string
    agreedGoals?: string
  }

  // 状态
  status: EvaluationStatus

  createdAt: Date
  updatedAt: Date
}

// KPI评估明细接口
export interface KPIEvaluation {
  kpiId: string
  kpiName: string
  weight: number
  type: KPIType

  // 目标和实际
  target?: number
  actual?: number
  unit?: string

  // 自评分
  selfScore?: number
  selfComments?: string

  // 主管评分
  managerScore?: number
  managerComments?: string

  // 加权得分
  weightedScore?: number
}

// 绩效统计接口
export interface PerformanceStats {
  totalEvaluations: number
  completedEvaluations: number
  pendingEvaluations: number

  // 评级分布
  ratingDistribution: {
    excellent: number
    good: number
    average: number
    below: number
    poor: number
  }

  avgScore: number
  avgCompletionRate: number

  // 部门绩效排名
  topDepartments: { name: string; avgScore: number }[]

  // 个人绩效排名
  topEmployees: { name: string; score: number; rating: string }[]
}

@Injectable()
export class PerformanceService {
  private kpis: Map<string, KPI> = new Map()
  private templates: Map<string, EvaluationTemplate> = new Map()
  private evaluations: Map<string, PerformanceEvaluation> = new Map()

  constructor() {
    this.initDefaultKPIs()
    this.initDefaultTemplates()
    this.initDefaultEvaluations()
  }

  // 初始化默认KPI指标
  private initDefaultKPIs() {
    const defaultKPIs: Partial<KPI>[] = [
      {
        name: '销售收入',
        code: 'KPI-REV',
        category: '销售',
        type: KPIType.QUANTITATIVE,
        weight: 30,
        target: 100000,
        unit: '元',
        scoringCriteria: '达成率>=100%满分',
      },
      {
        name: '客户满意度',
        code: 'KPI-CSAT',
        category: '服务',
        type: KPIType.QUANTITATIVE,
        weight: 20,
        target: 90,
        unit: '%',
        scoringCriteria: '>=90%满分',
      },
      {
        name: '赢单率',
        code: 'KPI-WIN',
        category: '销售',
        type: KPIType.QUANTITATIVE,
        weight: 15,
        target: 70,
        unit: '%',
        scoringCriteria: '>=70%满分',
      },
      {
        name: '项目完成率',
        code: 'KPI-PROJ',
        category: '研发',
        type: KPIType.QUANTITATIVE,
        weight: 25,
        target: 100,
        unit: '%',
        scoringCriteria: '100%满分',
      },
      {
        name: '代码质量',
        code: 'KPI-CODE',
        category: '研发',
        type: KPIType.QUALITATIVE,
        weight: 15,
        scoringCriteria: '代码规范、测试覆盖率',
      },
      {
        name: '团队协作',
        code: 'KPI-TEAM',
        category: '通用',
        type: KPIType.QUALITATIVE,
        weight: 10,
        scoringCriteria: '协作态度、沟通效率',
      },
      {
        name: '创新贡献',
        code: 'KPI-INNO',
        category: '通用',
        type: KPIType.QUALITATIVE,
        weight: 10,
        scoringCriteria: '创新想法、专利申请',
      },
      {
        name: '工单处理量',
        code: 'KPI-TICKET',
        category: '售后',
        type: KPIType.QUANTITATIVE,
        weight: 30,
        target: 50,
        unit: '件',
        scoringCriteria: '>=50件满分',
      },
      {
        name: 'SLA达标率',
        code: 'KPI-SLA',
        category: '售后',
        type: KPIType.QUANTITATIVE,
        weight: 25,
        target: 95,
        unit: '%',
        scoringCriteria: '>=95%满分',
      },
    ]

    defaultKPIs.forEach((kpi, index) => {
      const id = `KPI-${(index + 1).toString().padStart(3, '0')}`
      const fullKPI: KPI = {
        id,
        name: kpi.name!,
        code: kpi.code,
        category: kpi.category,
        type: kpi.type!,
        weight: kpi.weight!,
        target: kpi.target,
        unit: kpi.unit,
        scoringCriteria: kpi.scoringCriteria,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.kpis.set(id, fullKPI)
    })
  }

  // 初始化默认评估模板
  private initDefaultTemplates() {
    const salesTemplate: EvaluationTemplate = {
      id: 'TPL-001',
      name: '销售人员绩效模板',
      cycle: EvaluationCycle.QUARTERLY,
      kpis: [
        this.kpis.get('KPI-001')!,
        this.kpis.get('KPI-002')!,
        this.kpis.get('KPI-003')!,
        this.kpis.get('KPI-006')!,
      ],
      weights: { selfEvaluation: 30, managerEvaluation: 70 },
      applicableRoles: ['销售代表', '销售经理'],
      applicableDepartments: ['ORG-003', 'ORG-013', 'ORG-014'],
      status: 'active',
      createdAt: new Date(),
    }
    this.templates.set(salesTemplate.id, salesTemplate)

    const devTemplate: EvaluationTemplate = {
      id: 'TPL-002',
      name: '开发人员绩效模板',
      cycle: EvaluationCycle.QUARTERLY,
      kpis: [
        this.kpis.get('KPI-004')!,
        this.kpis.get('KPI-005')!,
        this.kpis.get('KPI-006')!,
        this.kpis.get('KPI-007')!,
      ],
      weights: { selfEvaluation: 30, managerEvaluation: 70 },
      applicableRoles: ['工程师', '架构师'],
      applicableDepartments: ['ORG-002'],
      status: 'active',
      createdAt: new Date(),
    }
    this.templates.set(devTemplate.id, devTemplate)

    const serviceTemplate: EvaluationTemplate = {
      id: 'TPL-003',
      name: '售后人员绩效模板',
      cycle: EvaluationCycle.MONTHLY,
      kpis: [
        this.kpis.get('KPI-002')!,
        this.kpis.get('KPI-008')!,
        this.kpis.get('KPI-009')!,
        this.kpis.get('KPI-006')!,
      ],
      weights: { selfEvaluation: 30, managerEvaluation: 70 },
      applicableRoles: ['售后工程师'],
      applicableDepartments: ['ORG-008'],
      status: 'active',
      createdAt: new Date(),
    }
    this.templates.set(serviceTemplate.id, serviceTemplate)
  }

  // 初始化默认评估记录
  private initDefaultEvaluations() {
    const employees = [
      {
        id: 'EMP-001',
        name: '张三',
        dept: '华北销售组',
        position: '销售经理',
        cycle: EvaluationCycle.QUARTERLY,
        period: '2026-Q1',
        score: 92,
      },
      {
        id: 'EMP-002',
        name: '李四',
        dept: '前端开发组',
        position: '高级前端工程师',
        cycle: EvaluationCycle.QUARTERLY,
        period: '2026-Q1',
        score: 88,
      },
      {
        id: 'EMP-003',
        name: '王五',
        dept: '后端开发组',
        position: '后端工程师',
        cycle: EvaluationCycle.QUARTERLY,
        period: '2026-Q1',
        score: 85,
      },
      {
        id: 'EMP-004',
        name: '赵六',
        dept: '售后服务部',
        position: '售后工程师',
        cycle: EvaluationCycle.MONTHLY,
        period: '2026-03',
        score: 78,
      },
      {
        id: 'EMP-005',
        name: '钱七',
        dept: '华南销售组',
        position: '销售代表',
        cycle: EvaluationCycle.QUARTERLY,
        period: '2026-Q1',
        score: 75,
      },
      {
        id: 'EMP-006',
        name: '孙八',
        dept: '测试组',
        position: '测试工程师',
        cycle: EvaluationCycle.QUARTERLY,
        period: '2026-Q1',
        score: 82,
      },
    ]

    employees.forEach((emp, index) => {
      const id = `EVAL-${(index + 1).toString().padStart(3, '0')}`
      const rating =
        emp.score >= 90
          ? RatingLevel.EXCELLENT
          : emp.score >= 80
            ? RatingLevel.GOOD
            : emp.score >= 70
              ? RatingLevel.AVERAGE
              : RatingLevel.BELOW

      const evaluation: PerformanceEvaluation = {
        id,
        employeeId: emp.id,
        employeeName: emp.name,
        departmentName: emp.dept,
        position: emp.position,
        cycle: emp.cycle,
        period: emp.period,
        kpiEvaluations: [
          {
            kpiId: 'KPI-001',
            kpiName: '销售收入',
            weight: 30,
            type: KPIType.QUANTITATIVE,
            target: 100000,
            actual: 120000,
            selfScore: 95,
            managerScore: 92,
          },
          {
            kpiId: 'KPI-006',
            kpiName: '团队协作',
            weight: 10,
            type: KPIType.QUALITATIVE,
            selfScore: 90,
            managerScore: 85,
          },
        ],
        selfEvaluation: {
          score: emp.score + 3,
          comments: '本季度超额完成销售目标',
          submittedAt: new Date(),
        },
        managerEvaluation: {
          score: emp.score,
          comments: '整体表现良好，继续保持',
          evaluatorId: 'MGR-001',
          evaluatorName: '部门经理',
          submittedAt: new Date(),
        },
        finalScore: emp.score,
        rating,
        status: EvaluationStatus.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.evaluations.set(id, evaluation)
    })
  }

  // KPI管理
  async getAllKPIs(category?: string): Promise<KPI[]> {
    let kpis = Array.from(this.kpis.values())
    if (category) kpis = kpis.filter((k) => k.category === category)
    return kpis.sort((a, b) => b.weight - a.weight)
  }

  async getKPIById(id: string): Promise<KPI | null> {
    return this.kpis.get(id) || null
  }

  async createKPI(data: Partial<KPI>): Promise<KPI> {
    const id = `KPI-${Date.now().toString(36).toUpperCase()}`
    const kpi: KPI = {
      id,
      name: data.name || '',
      code: data.code,
      category: data.category,
      type: data.type || KPIType.QUANTITATIVE,
      weight: data.weight || 10,
      target: data.target,
      unit: data.unit,
      scoringCriteria: data.scoringCriteria,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.kpis.set(id, kpi)
    return kpi
  }

  // 模板管理
  async getAllTemplates(): Promise<EvaluationTemplate[]> {
    return Array.from(this.templates.values()).filter((t) => t.status === 'active')
  }

  async getTemplateById(id: string): Promise<EvaluationTemplate | null> {
    return this.templates.get(id) || null
  }

  async createTemplate(data: Partial<EvaluationTemplate>): Promise<EvaluationTemplate> {
    const id = `TPL-${Date.now().toString(36).toUpperCase()}`
    const template: EvaluationTemplate = {
      id,
      name: data.name || '',
      cycle: data.cycle || EvaluationCycle.QUARTERLY,
      kpis: data.kpis || [],
      weights: data.weights || { selfEvaluation: 30, managerEvaluation: 70 },
      applicableRoles: data.applicableRoles,
      applicableDepartments: data.applicableDepartments,
      status: 'active',
      createdAt: new Date(),
    }
    this.templates.set(id, template)
    return template
  }

  // 评估管理
  async getAllEvaluations(
    status?: EvaluationStatus,
    employeeId?: string,
  ): Promise<PerformanceEvaluation[]> {
    let evaluations = Array.from(this.evaluations.values())
    if (status) evaluations = evaluations.filter((e) => e.status === status)
    if (employeeId) evaluations = evaluations.filter((e) => e.employeeId === employeeId)
    return evaluations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getEvaluationById(id: string): Promise<PerformanceEvaluation | null> {
    return this.evaluations.get(id) || null
  }

  async createEvaluation(
    templateId: string,
    employeeId: string,
    period: string,
  ): Promise<PerformanceEvaluation> {
    const template = this.templates.get(templateId)
    if (!template) throw new Error('模板不存在')

    const id = `EVAL-${Date.now().toString(36).toUpperCase()}`

    const kpiEvaluations: KPIEvaluation[] = template.kpis.map((kpi) => ({
      kpiId: kpi.id,
      kpiName: kpi.name,
      weight: kpi.weight,
      type: kpi.type,
      target: kpi.target,
      unit: kpi.unit,
    }))

    const evaluation: PerformanceEvaluation = {
      id,
      employeeId,
      employeeName: '员工',
      cycle: template.cycle,
      period,
      kpiEvaluations,
      status: EvaluationStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.evaluations.set(id, evaluation)
    return evaluation
  }

  async submitSelfEvaluation(
    id: string,
    scores: { kpiId: string; score: number; comments?: string }[],
    overallComments?: string,
  ): Promise<PerformanceEvaluation | null> {
    const evaluation = this.evaluations.get(id)
    if (!evaluation) return null

    // 更新KPI自评分
    for (const score of scores) {
      const kpiEval = evaluation.kpiEvaluations.find((k) => k.kpiId === score.kpiId)
      if (kpiEval) {
        kpiEval.selfScore = score.score
        kpiEval.selfComments = score.comments
      }
    }

    // 计算自评总分
    const selfTotal = evaluation.kpiEvaluations.reduce(
      (sum, k) => sum + ((k.selfScore || 0) * k.weight) / 100,
      0,
    )

    evaluation.selfEvaluation = {
      score: selfTotal,
      comments: overallComments,
      submittedAt: new Date(),
    }
    evaluation.status = EvaluationStatus.SELF_EVALUATED
    evaluation.updatedAt = new Date()
    return evaluation
  }

  async submitManagerEvaluation(
    id: string,
    scores: { kpiId: string; score: number; comments?: string }[],
    evaluatorId: string,
    evaluatorName: string,
    overallComments?: string,
  ): Promise<PerformanceEvaluation | null> {
    const evaluation = this.evaluations.get(id)
    if (!evaluation || evaluation.status !== EvaluationStatus.SELF_EVALUATED) return null

    // 更新KPI主管评分
    for (const score of scores) {
      const kpiEval = evaluation.kpiEvaluations.find((k) => k.kpiId === score.kpiId)
      if (kpiEval) {
        kpiEval.managerScore = score.score
        kpiEval.managerComments = score.comments
        // 计算加权得分
        kpiEval.weightedScore = (score.score * kpiEval.weight) / 100
      }
    }

    // 获取模板权重
    const template = this.templates.get('TPL-001')
    const selfWeight = template?.weights.selfEvaluation || 30
    const managerWeight = template?.weights.managerEvaluation || 70

    // 计算最终得分
    const selfScore = evaluation.selfEvaluation?.score || 0
    const managerTotal = evaluation.kpiEvaluations.reduce(
      (sum, k) => sum + ((k.managerScore || 0) * k.weight) / 100,
      0,
    )
    const finalScore = (selfScore * selfWeight) / 100 + (managerTotal * managerWeight) / 100

    evaluation.managerEvaluation = {
      score: managerTotal,
      comments: overallComments,
      evaluatorId,
      evaluatorName,
      submittedAt: new Date(),
    }
    evaluation.finalScore = finalScore
    evaluation.rating = this.getRatingLevel(finalScore)
    evaluation.status = EvaluationStatus.MANAGER_EVALUATED
    evaluation.updatedAt = new Date()
    return evaluation
  }

  private getRatingLevel(score: number): RatingLevel {
    if (score >= 90) return RatingLevel.EXCELLENT
    if (score >= 80) return RatingLevel.GOOD
    if (score >= 70) return RatingLevel.AVERAGE
    if (score >= 60) return RatingLevel.BELOW
    return RatingLevel.POOR
  }

  async completeEvaluation(
    id: string,
    reviewFeedback?: string,
    improvementPlan?: string,
  ): Promise<PerformanceEvaluation | null> {
    const evaluation = this.evaluations.get(id)
    if (!evaluation || evaluation.status !== EvaluationStatus.MANAGER_EVALUATED) return null

    evaluation.reviewMeeting = {
      completedAt: new Date(),
      feedback: reviewFeedback,
      improvementPlan,
    }
    evaluation.status = EvaluationStatus.COMPLETED
    evaluation.updatedAt = new Date()
    return evaluation
  }

  // 统计
  async getStats(): Promise<PerformanceStats> {
    const evaluations = Array.from(this.evaluations.values())

    const completed = evaluations.filter((e) => e.status === EvaluationStatus.COMPLETED)
    const ratings = {
      excellent: completed.filter((e) => e.rating === RatingLevel.EXCELLENT).length,
      good: completed.filter((e) => e.rating === RatingLevel.GOOD).length,
      average: completed.filter((e) => e.rating === RatingLevel.AVERAGE).length,
      below: completed.filter((e) => e.rating === RatingLevel.BELOW).length,
      poor: completed.filter((e) => e.rating === RatingLevel.POOR).length,
    }

    const avgScore =
      completed.length > 0
        ? completed.reduce((sum, e) => sum + (e.finalScore || 0), 0) / completed.length
        : 0

    const topEmployees = completed
      .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
      .slice(0, 5)
      .map((e) => ({
        name: e.employeeName,
        score: e.finalScore || 0,
        rating: e.rating || 'N/A',
      }))

    return {
      totalEvaluations: evaluations.length,
      completedEvaluations: completed.length,
      pendingEvaluations: evaluations.filter((e) => e.status !== EvaluationStatus.COMPLETED).length,
      ratingDistribution: ratings,
      avgScore: Math.round(avgScore * 10) / 10,
      avgCompletionRate: evaluations.length > 0 ? (completed.length / evaluations.length) * 100 : 0,
      topDepartments: [
        { name: '华北销售组', avgScore: 92 },
        { name: '前端开发组', avgScore: 88 },
        { name: '后端开发组', avgScore: 85 },
      ],
      topEmployees,
    }
  }

  async getEmployeeEvaluations(employeeId: string): Promise<PerformanceEvaluation[]> {
    return Array.from(this.evaluations.values())
      .filter((e) => e.employeeId === employeeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getDepartmentEvaluations(departmentId: string): Promise<PerformanceEvaluation[]> {
    return Array.from(this.evaluations.values())
      .filter((e) => e.departmentId === departmentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}
