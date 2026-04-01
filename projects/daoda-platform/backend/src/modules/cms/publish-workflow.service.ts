/**
 * 发布工作流服务
 * 内容发布审批、定时发布、发布队列管理
 */
import { Injectable } from '@nestjs/common'

// 发布状态
export enum PublishStatus {
  PENDING = 'PENDING', // 待发布
  APPROVED = 'APPROVED', // 已审核
  SCHEDULED = 'SCHEDULED', // 定时发布
  PUBLISHING = 'PUBLISHING', // 发布中
  PUBLISHED = 'PUBLISHED', // 已发布
  FAILED = 'FAILED', // 发布失败
  CANCELLED = 'CANCELLED', // 已取消
  UNPUBLISHING = 'UNPUBLISHING', // 下线中
  UNPUBLISHED = 'UNPUBLISHED', // 已下线
}

// 发布类型
export enum PublishType {
  IMMEDIATE = 'IMMEDIATE', // 立即发布
  SCHEDULED = 'SCHEDULED', // 定时发布
  BATCH = 'BATCH', // 批量发布
  UPDATE = 'UPDATE', // 更新发布
  UNPUBLISH = 'UNPUBLISH', // 下线
}

// 审核状态
export enum ReviewStatus {
  PENDING = 'PENDING', // 待审核
  IN_REVIEW = 'IN_REVIEW', // 审核中
  APPROVED = 'APPROVED', // 通过
  REJECTED = 'REJECTED', // 拒绝
  NEEDS_REVISION = 'NEEDS_REVISION', // 需修改
}

// 发布任务接口
export interface PublishTask {
  id: string
  contentId: string
  contentTitle: string
  contentType: string
  versionId: string
  versionNumber: string
  siteId: string
  siteName: string
  publishType: PublishType
  status: PublishStatus
  scheduledAt?: Date // 定时发布时间
  publishedAt?: Date // 实际发布时间
  unpublishedAt?: Date // 下线时间
  reviewStatus: ReviewStatus
  reviewer?: string
  reviewerName?: string
  reviewedAt?: Date
  reviewComments?: string
  author?: string
  authorName?: string
  priority?: number // 发布优先级
  retryCount?: number // 重试次数
  error?: string // 错误信息
  createdAt: Date
}

// 发布队列接口
export interface PublishQueue {
  id: string
  name: string
  siteId?: string // 站点ID（全局队列可不指定）
  totalTasks: number
  pendingTasks: number
  scheduledTasks: number
  completedTasks: number
  failedTasks: number
  avgProcessingTime?: number // 平均处理时间（秒）
  createdAt: Date
}

// 审核规则接口
export interface ReviewRule {
  id: string
  name: string
  contentType?: string // 内容类型（文章、新闻等）
  siteId?: string // 站点ID
  requireReview: boolean // 是否需要审核
  reviewers?: string[] // 审核人列表
  reviewLevels?: number // 审核层级数
  autoApproveConditions?: {
    // 自动通过条件
    authorLevel?: string[] // 作者级别
    trustedAuthor?: string[] // 信任作者
    contentTags?: string[] // 内容标签
  }
  enabled: boolean
  createdAt: Date
}

// 发布历史记录
export interface PublishHistory {
  id: string
  taskId: string
  contentId: string
  action: 'PUBLISH' | 'UNPUBLISH' | 'UPDATE' | 'SCHEDULE' | 'CANCEL'
  previousStatus?: string
  newStatus: string
  performer?: string
  performerName?: string
  performedAt: Date
  notes?: string
}

@Injectable()
export class PublishWorkflowService {
  private publishTasks: Map<string, PublishTask> = new Map()
  private publishQueues: Map<string, PublishQueue> = new Map()
  private reviewRules: Map<string, ReviewRule> = new Map()
  private publishHistory: Map<string, PublishHistory[]> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化发布队列
    const mockQueues: PublishQueue[] = [
      {
        id: 'PQ-001',
        name: '主站发布队列',
        siteId: 'SITE-001',
        totalTasks: 45,
        pendingTasks: 3,
        scheduledTasks: 2,
        completedTasks: 38,
        failedTasks: 2,
        avgProcessingTime: 12,
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'PQ-002',
        name: '英文站发布队列',
        siteId: 'SITE-002',
        totalTasks: 30,
        pendingTasks: 2,
        scheduledTasks: 1,
        completedTasks: 25,
        failedTasks: 2,
        avgProcessingTime: 15,
        createdAt: new Date('2026-02-01'),
      },
      {
        id: 'PQ-003',
        name: '产品站发布队列',
        siteId: 'SITE-003',
        totalTasks: 20,
        pendingTasks: 1,
        scheduledTasks: 0,
        completedTasks: 19,
        failedTasks: 0,
        avgProcessingTime: 10,
        createdAt: new Date('2026-02-15'),
      },
      {
        id: 'PQ-004',
        name: '全局紧急发布队列',
        totalTasks: 10,
        pendingTasks: 0,
        scheduledTasks: 0,
        completedTasks: 10,
        failedTasks: 0,
        avgProcessingTime: 5,
        createdAt: new Date('2026-03-01'),
      },
    ]

    mockQueues.forEach((queue) => {
      this.publishQueues.set(queue.id, queue)
    })

    // 初始化审核规则
    const mockRules: ReviewRule[] = [
      {
        id: 'RR-001',
        name: '新闻审核规则',
        contentType: 'NEWS',
        siteId: 'SITE-001',
        requireReview: true,
        reviewers: ['U-001', 'U-002'],
        reviewLevels: 1,
        enabled: true,
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'RR-002',
        name: '产品审核规则',
        contentType: 'PRODUCT',
        siteId: 'SITE-001',
        requireReview: true,
        reviewers: ['U-003'],
        reviewLevels: 2,
        autoApproveConditions: { authorLevel: ['经理', '总监'] },
        enabled: true,
        createdAt: new Date('2026-01-15'),
      },
      {
        id: 'RR-003',
        name: '案例免审规则',
        contentType: 'CASE',
        siteId: 'SITE-001',
        requireReview: false,
        autoApproveConditions: { trustedAuthor: ['U-004'] },
        enabled: true,
        createdAt: new Date('2026-02-01'),
      },
      {
        id: 'RR-004',
        name: 'Banner审核规则',
        contentType: 'BANNER',
        requireReview: true,
        reviewers: ['U-005', 'U-006'],
        reviewLevels: 1,
        enabled: true,
        createdAt: new Date('2026-02-15'),
      },
      {
        id: 'RR-005',
        name: '英文站审核规则',
        siteId: 'SITE-002',
        requireReview: true,
        reviewers: ['U-007'],
        reviewLevels: 1,
        enabled: true,
        createdAt: new Date('2026-03-01'),
      },
    ]

    mockRules.forEach((rule) => {
      this.reviewRules.set(rule.id, rule)
    })

    // 初始化发布任务
    const mockTasks: PublishTask[] = [
      {
        id: 'PT-001',
        contentId: 'CE-001',
        contentTitle: '公司简介',
        contentType: 'PAGE',
        versionId: 'CV-003',
        versionNumber: 'v2.0',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.UPDATE,
        status: PublishStatus.PUBLISHED,
        reviewStatus: ReviewStatus.APPROVED,
        authorName: '张三',
        publishedAt: new Date('2026-03-01'),
        createdAt: new Date('2026-02-28'),
      },
      {
        id: 'PT-002',
        contentId: 'CE-002',
        contentTitle: '产品发布新闻',
        contentType: 'NEWS',
        versionId: 'CV-006',
        versionNumber: 'v2.0',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.IMMEDIATE,
        status: PublishStatus.PUBLISHED,
        reviewStatus: ReviewStatus.APPROVED,
        reviewerName: '李审核',
        reviewedAt: new Date('2026-03-01'),
        authorName: '李四',
        publishedAt: new Date('2026-03-01'),
        createdAt: new Date('2026-03-01'),
      },
      {
        id: 'PT-003',
        contentId: 'CE-003',
        contentTitle: 'IOV平台介绍',
        contentType: 'PRODUCT',
        versionId: 'CV-009',
        versionNumber: 'v2.0-beta',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.IMMEDIATE,
        status: PublishStatus.PENDING,
        reviewStatus: ReviewStatus.IN_REVIEW,
        reviewerName: '王审核',
        authorName: '王五',
        createdAt: new Date('2026-03-15'),
      },
      {
        id: 'PT-004',
        contentId: 'CE-004',
        contentTitle: '客户案例',
        contentType: 'CASE',
        versionId: 'CV-012',
        versionNumber: 'v2.0',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.IMMEDIATE,
        status: PublishStatus.PENDING,
        reviewStatus: ReviewStatus.APPROVED,
        authorName: '赵六',
        createdAt: new Date('2026-03-20'),
      },
      {
        id: 'PT-005',
        contentId: 'CE-005',
        contentTitle: '技术白皮书',
        contentType: 'ARTICLE',
        versionId: 'CV-015',
        versionNumber: 'v1.0-draft',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.IMMEDIATE,
        status: PublishStatus.PENDING,
        reviewStatus: ReviewStatus.PENDING,
        authorName: '钱七',
        createdAt: new Date('2026-03-15'),
      },
      {
        id: 'PT-006',
        contentId: 'CE-006',
        contentTitle: '首页Banner',
        contentType: 'BANNER',
        versionId: 'CV-018',
        versionNumber: 'v2.0',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.SCHEDULED,
        status: PublishStatus.SCHEDULED,
        scheduledAt: new Date('2026-04-01'),
        reviewStatus: ReviewStatus.APPROVED,
        reviewerName: '周审核',
        reviewedAt: new Date('2026-03-20'),
        authorName: '周八',
        createdAt: new Date('2026-03-20'),
      },
      {
        id: 'PT-007',
        contentId: 'CE-003',
        contentTitle: 'IOV平台介绍(英文)',
        contentType: 'PRODUCT',
        versionId: 'CV-009-EN',
        versionNumber: 'v2.0-en',
        siteId: 'SITE-002',
        siteName: '英文站',
        publishType: PublishType.IMMEDIATE,
        status: PublishStatus.PENDING,
        reviewStatus: ReviewStatus.PENDING,
        authorName: '王五',
        createdAt: new Date('2026-03-18'),
      },
      {
        id: 'PT-008',
        contentId: 'CE-007',
        contentTitle: '产品演示视频',
        contentType: 'VIDEO',
        versionId: 'CV-021',
        versionNumber: 'v2.0',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.UNPUBLISH,
        status: PublishStatus.UNPUBLISHED,
        reviewStatus: ReviewStatus.APPROVED,
        unpublishedAt: new Date('2026-03-01'),
        createdAt: new Date('2026-02-28'),
      },
      {
        id: 'PT-009',
        contentId: 'CE-001',
        contentTitle: '公司简介(更新)',
        contentType: 'PAGE',
        versionId: 'CV-004',
        versionNumber: 'v3.0',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.IMMEDIATE,
        status: PublishStatus.FAILED,
        reviewStatus: ReviewStatus.APPROVED,
        error: '服务器超时',
        retryCount: 3,
        authorName: '张三',
        createdAt: new Date('2026-03-25'),
      },
      {
        id: 'PT-010',
        contentId: 'CE-002',
        contentTitle: '产品发布新闻(下线)',
        contentType: 'NEWS',
        versionId: 'CV-006',
        versionNumber: 'v1.0',
        siteId: 'SITE-001',
        siteName: '主站',
        publishType: PublishType.UNPUBLISH,
        status: PublishStatus.CANCELLED,
        reviewStatus: ReviewStatus.APPROVED,
        createdAt: new Date('2026-03-20'),
      },
    ]

    mockTasks.forEach((task) => {
      this.publishTasks.set(task.id, task)
    })

    // 初始化发布历史
    const mockHistory: PublishHistory[] = [
      {
        id: 'PH-001',
        taskId: 'PT-001',
        contentId: 'CE-001',
        action: 'PUBLISH',
        previousStatus: 'DRAFT',
        newStatus: 'PUBLISHED',
        performerName: '张三',
        performedAt: new Date('2026-03-01'),
        notes: '首次发布',
      },
      {
        id: 'PH-002',
        taskId: 'PT-002',
        contentId: 'CE-002',
        action: 'PUBLISH',
        newStatus: 'PUBLISHED',
        performerName: '李审核',
        performedAt: new Date('2026-03-01'),
      },
      {
        id: 'PH-003',
        taskId: 'PT-003',
        contentId: 'CE-003',
        action: 'SCHEDULE',
        newStatus: 'PENDING',
        performerName: '王五',
        performedAt: new Date('2026-03-15'),
        notes: '提交审核',
      },
      {
        id: 'PH-004',
        taskId: 'PT-006',
        contentId: 'CE-006',
        action: 'SCHEDULE',
        newStatus: 'SCHEDULED',
        performerName: '周八',
        performedAt: new Date('2026-03-20'),
        notes: '定时发布：2026-04-01',
      },
      {
        id: 'PH-005',
        taskId: 'PT-008',
        contentId: 'CE-007',
        action: 'UNPUBLISH',
        previousStatus: 'PUBLISHED',
        newStatus: 'UNPUBLISHED',
        performerName: '吴九',
        performedAt: new Date('2026-03-01'),
        notes: '内容过期下线',
      },
      {
        id: 'PH-006',
        taskId: 'PT-009',
        contentId: 'CE-001',
        action: 'PUBLISH',
        newStatus: 'FAILED',
        performerName: '系统',
        performedAt: new Date('2026-03-25'),
        notes: '服务器超时',
      },
    ]

    mockHistory.forEach((history) => {
      const taskHistory = this.publishHistory.get(history.taskId) || []
      taskHistory.push(history)
      this.publishHistory.set(history.taskId, taskHistory)
    })
  }

  // 获取发布任务列表
  async getPublishTasks(query?: {
    siteId?: string
    status?: PublishStatus
    reviewStatus?: ReviewStatus
    contentType?: string
  }): Promise<PublishTask[]> {
    let tasks = Array.from(this.publishTasks.values())
    if (query) {
      if (query.siteId) tasks = tasks.filter((t) => t.siteId === query.siteId)
      if (query.status) tasks = tasks.filter((t) => t.status === query.status)
      if (query.reviewStatus) tasks = tasks.filter((t) => t.reviewStatus === query.reviewStatus)
      if (query.contentType) tasks = tasks.filter((t) => t.contentType === query.contentType)
    }
    return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // 获取发布任务详情
  async getPublishTask(id: string): Promise<PublishTask | null> {
    return this.publishTasks.get(id) || null
  }

  // 创建发布任务
  async createPublishTask(task: Partial<PublishTask>): Promise<PublishTask> {
    const newTask: PublishTask = {
      id: `PT-${Date.now()}`,
      contentId: task.contentId || '',
      contentTitle: task.contentTitle || '',
      contentType: task.contentType || '',
      versionId: task.versionId || '',
      versionNumber: task.versionNumber || '',
      siteId: task.siteId || '',
      siteName: task.siteName || '',
      publishType: task.publishType || PublishType.IMMEDIATE,
      status: task.scheduledAt ? PublishStatus.SCHEDULED : PublishStatus.PENDING,
      scheduledAt: task.scheduledAt,
      reviewStatus: ReviewStatus.PENDING,
      author: task.author,
      authorName: task.authorName,
      priority: task.priority || 0,
      createdAt: new Date(),
    }

    // 检查审核规则
    const rule = await this.getReviewRuleForContent(task.contentType, task.siteId)
    if (rule && !rule.requireReview) {
      // 免审核，直接进入已审核状态
      newTask.reviewStatus = ReviewStatus.APPROVED
      if (!task.scheduledAt) {
        newTask.status = PublishStatus.APPROVED
      }
    }

    this.publishTasks.set(newTask.id, newTask)

    // 更新队列统计
    this.updateQueueStats(newTask.siteId)

    return newTask
  }

  // 提交审核
  async submitForReview(taskId: string): Promise<PublishTask | null> {
    const task = this.publishTasks.get(taskId)
    if (!task) return null

    task.reviewStatus = ReviewStatus.IN_REVIEW
    return task
  }

  // 审核通过
  async approveTask(
    taskId: string,
    reviewer?: string,
    reviewerName?: string,
    comments?: string,
  ): Promise<PublishTask | null> {
    const task = this.publishTasks.get(taskId)
    if (!task) return null

    task.reviewStatus = ReviewStatus.APPROVED
    task.reviewer = reviewer
    task.reviewerName = reviewerName
    task.reviewedAt = new Date()
    task.reviewComments = comments

    // 如果是立即发布，更新状态为已审核
    if (task.publishType === PublishType.IMMEDIATE && task.status === PublishStatus.PENDING) {
      task.status = PublishStatus.APPROVED
    }

    // 记录历史
    this.addHistory(taskId, taskId, 'PUBLISH', task.status, 'APPROVED', reviewerName, '审核通过')

    return task
  }

  // 审核拒绝
  async rejectTask(
    taskId: string,
    reviewer?: string,
    reviewerName?: string,
    comments?: string,
  ): Promise<PublishTask | null> {
    const task = this.publishTasks.get(taskId)
    if (!task) return null

    task.reviewStatus = ReviewStatus.REJECTED
    task.reviewer = reviewer
    task.reviewerName = reviewerName
    task.reviewedAt = new Date()
    task.reviewComments = comments

    return task
  }

  // 执行发布
  async executePublish(taskId: string): Promise<PublishTask | null> {
    const task = this.publishTasks.get(taskId)
    if (!task || task.reviewStatus !== ReviewStatus.APPROVED) return null

    task.status = PublishStatus.PUBLISHING

    // 模拟发布过程
    // 实际应调用内容版本服务的发布方法
    task.status = PublishStatus.PUBLISHED
    task.publishedAt = new Date()

    // 记录历史
    this.addHistory(
      taskId,
      task.contentId,
      'PUBLISH',
      'PUBLISHING',
      'PUBLISHED',
      task.authorName,
      '发布成功',
    )

    // 更新队列统计
    this.updateQueueStats(task.siteId)

    return task
  }

  // 取消发布
  async cancelPublish(taskId: string): Promise<PublishTask | null> {
    const task = this.publishTasks.get(taskId)
    if (!task) return null

    task.status = PublishStatus.CANCELLED

    // 记录历史
    this.addHistory(
      taskId,
      task.contentId,
      'CANCEL',
      task.status,
      'CANCELLED',
      undefined,
      '取消发布',
    )

    return task
  }

  // 下线内容
  async unpublishContent(taskId: string): Promise<PublishTask | null> {
    const task = this.publishTasks.get(taskId)
    if (!task) return null

    task.status = PublishStatus.UNPUBLISHING

    // 模拟下线过程
    task.status = PublishStatus.UNPUBLISHED
    task.unpublishedAt = new Date()

    // 记录历史
    this.addHistory(
      taskId,
      task.contentId,
      'UNPUBLISH',
      'UNPUBLISHING',
      'UNPUBLISHED',
      undefined,
      '内容下线',
    )

    return task
  }

  // 重试失败任务
  async retryFailedTask(taskId: string): Promise<PublishTask | null> {
    const task = this.publishTasks.get(taskId)
    if (!task || task.status !== PublishStatus.FAILED) return null

    task.status = PublishStatus.PENDING
    task.retryCount = (task.retryCount || 0) + 1
    task.error = undefined

    return task
  }

  // 获取发布队列列表
  async getPublishQueues(): Promise<PublishQueue[]> {
    return Array.from(this.publishQueues.values())
  }

  // 获取审核规则列表
  async getReviewRules(): Promise<ReviewRule[]> {
    return Array.from(this.reviewRules.values())
  }

  // 获取审核规则详情
  async getReviewRule(id: string): Promise<ReviewRule | null> {
    return this.reviewRules.get(id) || null
  }

  // 获取适合内容的审核规则
  async getReviewRuleForContent(contentType?: string, siteId?: string): Promise<ReviewRule | null> {
    const rules = Array.from(this.reviewRules.values())
    return (
      rules.find(
        (r) =>
          r.enabled &&
          (!contentType || r.contentType === contentType) &&
          (!siteId || r.siteId === siteId),
      ) || null
    )
  }

  // 获取发布历史
  async getPublishHistory(taskId?: string): Promise<PublishHistory[]> {
    if (taskId) return this.publishHistory.get(taskId) || []
    // 返回所有历史
    const allHistory: PublishHistory[] = []
    for (const history of this.publishHistory.values()) {
      allHistory.push(...history)
    }
    return allHistory.sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())
  }

  // 获取发布统计
  async getPublishStats(): Promise<{
    totalTasks: number
    pendingTasks: number
    scheduledTasks: number
    publishedTasks: number
    failedTasks: number
    avgPublishTime: number
    approvalRate: number
  }> {
    const tasks = Array.from(this.publishTasks.values())
    const publishedTasks = tasks.filter((t) => t.status === PublishStatus.PUBLISHED)
    const reviewedTasks = tasks.filter(
      (t) => t.reviewStatus === ReviewStatus.APPROVED || t.reviewStatus === ReviewStatus.REJECTED,
    )

    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => t.status === PublishStatus.PENDING).length,
      scheduledTasks: tasks.filter((t) => t.status === PublishStatus.SCHEDULED).length,
      publishedTasks: publishedTasks.length,
      failedTasks: tasks.filter((t) => t.status === PublishStatus.FAILED).length,
      avgPublishTime: 12, // 模拟平均发布时间
      approvalRate:
        reviewedTasks.length > 0
          ? (reviewedTasks.filter((t) => t.reviewStatus === ReviewStatus.APPROVED).length /
              reviewedTasks.length) *
            100
          : 0,
    }
  }

  // 内部方法：添加历史记录
  private addHistory(
    historyId: string,
    taskId: string,
    contentId: string,
    action: any,
    newStatus: string,
    performerName?: string,
    notes?: string,
  ) {
    const history: PublishHistory = {
      id: historyId,
      taskId,
      contentId,
      action,
      newStatus,
      performerName,
      performedAt: new Date(),
      notes,
    }
    const taskHistory = this.publishHistory.get(taskId) || []
    taskHistory.push(history)
    this.publishHistory.set(taskId, taskHistory)
  }

  // 内部方法：更新队列统计
  private updateQueueStats(siteId?: string) {
    const queues = Array.from(this.publishQueues.values())
    for (const queue of queues) {
      if (queue.siteId === siteId || !queue.siteId) {
        const tasks = Array.from(this.publishTasks.values()).filter(
          (t) => (queue.siteId && t.siteId === queue.siteId) || !queue.siteId,
        )
        queue.totalTasks = tasks.length
        queue.pendingTasks = tasks.filter((t) => t.status === PublishStatus.PENDING).length
        queue.scheduledTasks = tasks.filter((t) => t.status === PublishStatus.SCHEDULED).length
        queue.completedTasks = tasks.filter(
          (t) => t.status === PublishStatus.PUBLISHED || t.status === PublishStatus.UNPUBLISHED,
        ).length
        queue.failedTasks = tasks.filter((t) => t.status === PublishStatus.FAILED).length
      }
    }
  }
}
