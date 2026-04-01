/**
 * 营销自动化服务
 * 营销活动、邮件营销、短信营销、活动跟踪、营销分析
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum CampaignStatus {
  DRAFT = 'DRAFT', // 草稿
  SCHEDULED = 'SCHEDULED', // 已排期
  RUNNING = 'RUNNING', // 进行中
  PAUSED = 'PAUSED', // 已暂停
  COMPLETED = 'COMPLETED', // 已完成
  CANCELLED = 'CANCELLED', // 已取消
}

export enum CampaignType {
  EMAIL = 'EMAIL', // 邮件营销
  SMS = 'SMS', // 短信营销
  WECHAT = 'WECHAT', // 微信营销
  EVENT = 'EVENT', // 活动营销
  CONTENT = 'CONTENT', // 内容营销
  SOCIAL = 'SOCIAL', // 社交媒体
}

export enum AudienceType {
  ALL = 'ALL', // 全部客户
  SEGMENT = 'SEGMENT', // 客户分群
  LEADS = 'LEADS', // 线索
  CUSTOMERS = 'CUSTOMERS', // 客户
  VIP = 'VIP', // VIP客户
  NEW = 'NEW', // 新客户
  CUSTOM = 'CUSTOM', // 自定义
}

export enum EmailStatus {
  PENDING = 'PENDING', // 待发送
  SENT = 'SENT', // 已发送
  DELIVERED = 'DELIVERED', // 已送达
  OPENED = 'OPENED', // 已打开
  CLICKED = 'CLICKED', // 已点击
  BOUNCED = 'BOUNCED', // 退信
  FAILED = 'FAILED', // 发送失败
}

// ========== 导出接口类型 ==========

export interface MarketingCampaign {
  id: string
  campaignCode: string // 活动编号
  campaignName: string // 活动名称
  campaignType: CampaignType // 活动类型

  // 目标受众
  audienceType: AudienceType
  audienceSegment?: string // 客户分群ID
  targetCount: number // 目标人数

  // 内容
  subject?: string // 邮件主题
  content: string // 内容
  templateId?: string // 模板ID

  // 时间
  scheduledAt?: Date // 计划发送时间
  startedAt?: Date // 实际开始时间
  completedAt?: Date // 完成时间

  // 状态
  status: CampaignStatus

  // 统计
  stats: {
    sent: number // 已发送
    delivered: number // 已送达
    opened: number // 已打开
    clicked: number // 已点击
    bounced: number // 退信
    unsubscribed: number // 退订
    converted: number // 转化
  }

  // 预算
  budget?: number // 预算
  cost?: number // 实际成本

  // 标签
  tags?: string[]

  // A/B测试
  abTest?: {
    enabled: boolean
    variants: {
      id: string
      name: string
      content: string
      percentage: number
      stats: any
    }[]
    winner?: string
  }

  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface EmailRecord {
  id: string
  campaignId: string
  campaignName: string

  // 收件人
  recipientId: string // 客户/线索ID
  recipientEmail: string // 邮箱
  recipientName?: string // 姓名

  // 状态
  status: EmailStatus
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date

  // 追踪
  openCount: number // 打开次数
  clickCount: number // 点击次数
  clickedLinks?: string[] // 点击的链接

  // 错误
  errorMessage?: string

  createdAt: Date
}

export interface MarketingTemplate {
  id: string
  templateCode: string
  templateName: string
  type: CampaignType

  subject?: string // 邮件主题模板
  content: string // 内容模板
  variables: string[] // 变量列表

  thumbnail?: string // 缩略图
  category?: string // 分类

  usageCount: number // 使用次数

  isSystem: boolean // 系统模板
  status: 'ACTIVE' | 'INACTIVE'

  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CustomerSegment {
  id: string
  segmentCode: string
  segmentName: string
  description?: string

  // 条件
  conditions: {
    field: string // 字段
    operator: string // 操作符
    value: any // 值
  }[]

  // 统计
  memberCount: number // 成员数量
  lastUpdated?: Date

  // 动态更新
  isDynamic: boolean
  updateFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY'

  status: 'ACTIVE' | 'INACTIVE'

  tenantId: string
  createdBy: string
  createdAt: Date
}

export interface MarketingWorkflow {
  id: string
  workflowCode: string
  workflowName: string
  description?: string

  // 触发条件
  trigger: {
    type: 'EVENT' | 'TIME' | 'CONDITION' // 事件触发/定时触发/条件触发
    event?: string // 事件名称
    schedule?: string // cron表达式
    conditions?: any[] // 条件
  }

  // 流程节点
  nodes: {
    id: string
    type: 'ACTION' | 'CONDITION' | 'DELAY' | 'END'
    name: string
    config: any
    nextNodes?: string[]
  }[]

  // 统计
  executionCount: number
  successCount: number

  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT'

  tenantId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class MarketingAutomationService {
  // 活动存储
  private campaigns: Map<string, MarketingCampaign> = new Map()

  // 邮件记录存储
  private emailRecords: Map<string, EmailRecord> = new Map()

  // 模板存储
  private templates: Map<string, MarketingTemplate> = new Map()

  // 客户分群存储
  private segments: Map<string, CustomerSegment> = new Map()

  // 营销工作流存储
  private workflows: Map<string, MarketingWorkflow> = new Map()

  constructor() {
    this.initSampleData()
  }

  private initSampleData() {
    // 示例营销活动
    const sampleCampaigns: Partial<MarketingCampaign>[] = [
      {
        id: 'campaign-001',
        campaignCode: 'CAMP-2026-001',
        campaignName: '2026春季新品推广',
        campaignType: CampaignType.EMAIL,
        audienceType: AudienceType.CUSTOMERS,
        targetCount: 5000,
        subject: '🌸 春季新品上市，限时优惠！',
        content: '<h1>新品发布</h1><p>亲爱的客户...</p>',
        status: CampaignStatus.RUNNING,
        stats: {
          sent: 4500,
          delivered: 4300,
          opened: 1500,
          clicked: 450,
          bounced: 200,
          unsubscribed: 15,
          converted: 85,
        },
        budget: 10000,
        cost: 2500,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'campaign-002',
        campaignCode: 'CAMP-2026-002',
        campaignName: 'VIP客户专属优惠',
        campaignType: CampaignType.EMAIL,
        audienceType: AudienceType.VIP,
        targetCount: 200,
        subject: '尊贵的VIP会员，专属福利等你来',
        content: '<h1>VIP专属</h1><p>尊敬的VIP客户...</p>',
        status: CampaignStatus.COMPLETED,
        stats: {
          sent: 200,
          delivered: 198,
          opened: 150,
          clicked: 80,
          bounced: 2,
          unsubscribed: 0,
          converted: 35,
        },
        budget: 5000,
        cost: 500,
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date(),
      },
    ]

    sampleCampaigns.forEach((campaign) => {
      this.campaigns.set(campaign.id!, campaign as MarketingCampaign)
    })

    // 示例模板
    const sampleTemplates: Partial<MarketingTemplate>[] = [
      {
        id: 'template-001',
        templateCode: 'TPL-001',
        templateName: '产品推广模板',
        type: CampaignType.EMAIL,
        subject: '{{product_name}} - 限时优惠',
        content: '<h1>{{headline}}</h1><p>{{content}}</p><a href="{{cta_url}}">{{cta_text}}</a>',
        variables: ['product_name', 'headline', 'content', 'cta_url', 'cta_text'],
        usageCount: 45,
        isSystem: false,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'template-002',
        templateCode: 'TPL-002',
        templateName: '生日祝福模板',
        type: CampaignType.EMAIL,
        subject: '祝您生日快乐！',
        content: '<h1>亲爱的{{customer_name}}</h1><p>祝您生日快乐！为您准备了专属生日礼...</p>',
        variables: ['customer_name', 'birthday_gift'],
        usageCount: 128,
        isSystem: true,
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    sampleTemplates.forEach((template) => {
      this.templates.set(template.id!, template as MarketingTemplate)
    })

    // 示例客户分群
    const sampleSegments: Partial<CustomerSegment>[] = [
      {
        id: 'segment-001',
        segmentCode: 'SEG-001',
        segmentName: '高价值客户',
        description: '年消费额超过10万的客户',
        conditions: [
          { field: 'annual_spending', operator: 'gt', value: 100000 },
          { field: 'status', operator: 'eq', value: 'active' },
        ],
        memberCount: 356,
        isDynamic: true,
        updateFrequency: 'DAILY',
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
      },
      {
        id: 'segment-002',
        segmentCode: 'SEG-002',
        segmentName: '流失风险客户',
        description: '超过90天未购买的活跃客户',
        conditions: [
          { field: 'last_purchase_days', operator: 'gt', value: 90 },
          { field: 'status', operator: 'eq', value: 'active' },
        ],
        memberCount: 120,
        isDynamic: true,
        updateFrequency: 'WEEKLY',
        status: 'ACTIVE',
        tenantId: 'tenant-001',
        createdBy: 'admin',
        createdAt: new Date(),
      },
    ]

    sampleSegments.forEach((segment) => {
      this.segments.set(segment.id!, segment as CustomerSegment)
    })
  }

  // ========== 营销活动管理 ==========

  async getCampaigns(params?: {
    campaignType?: CampaignType
    status?: CampaignStatus
    keyword?: string
    page?: number
    pageSize?: number
  }) {
    let list = Array.from(this.campaigns.values())

    if (params?.campaignType) {
      list = list.filter((c) => c.campaignType === params.campaignType)
    }
    if (params?.status) {
      list = list.filter((c) => c.status === params.status)
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (c) =>
          c.campaignCode.toLowerCase().includes(kw) || c.campaignName.toLowerCase().includes(kw),
      )
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = list.length
    const start = (page - 1) * pageSize
    const data = list.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  }

  async getCampaign(id: string): Promise<MarketingCampaign | null> {
    return this.campaigns.get(id) || null
  }

  async createCampaign(campaign: Partial<MarketingCampaign>): Promise<MarketingCampaign> {
    const id = `campaign-${Date.now()}`
    const campaignCode = `CAMP-${new Date().getFullYear()}-${String(this.campaigns.size + 1).padStart(3, '0')}`

    const newCampaign: MarketingCampaign = {
      id,
      campaignCode,
      campaignName: campaign.campaignName!,
      campaignType: campaign.campaignType || CampaignType.EMAIL,
      audienceType: campaign.audienceType || AudienceType.ALL,
      audienceSegment: campaign.audienceSegment,
      targetCount: campaign.targetCount || 0,
      subject: campaign.subject,
      content: campaign.content!,
      templateId: campaign.templateId,
      scheduledAt: campaign.scheduledAt,
      status: CampaignStatus.DRAFT,
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0,
        converted: 0,
      },
      budget: campaign.budget,
      tags: campaign.tags || [],
      tenantId: campaign.tenantId || 'tenant-001',
      createdBy: campaign.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.campaigns.set(id, newCampaign)
    return newCampaign
  }

  async updateCampaign(
    id: string,
    updates: Partial<MarketingCampaign>,
  ): Promise<MarketingCampaign | null> {
    const campaign = this.campaigns.get(id)
    if (!campaign) return null

    const updated = { ...campaign, ...updates, updatedAt: new Date() }
    this.campaigns.set(id, updated)
    return updated
  }

  async launchCampaign(id: string): Promise<MarketingCampaign | null> {
    const campaign = this.campaigns.get(id)
    if (!campaign) return null

    campaign.status = CampaignStatus.RUNNING
    campaign.startedAt = new Date()
    campaign.updatedAt = new Date()
    this.campaigns.set(id, campaign)
    return campaign
  }

  async pauseCampaign(id: string): Promise<MarketingCampaign | null> {
    const campaign = this.campaigns.get(id)
    if (!campaign) return null

    campaign.status = CampaignStatus.PAUSED
    campaign.updatedAt = new Date()
    this.campaigns.set(id, campaign)
    return campaign
  }

  async completeCampaign(id: string): Promise<MarketingCampaign | null> {
    const campaign = this.campaigns.get(id)
    if (!campaign) return null

    campaign.status = CampaignStatus.COMPLETED
    campaign.completedAt = new Date()
    campaign.updatedAt = new Date()
    this.campaigns.set(id, campaign)
    return campaign
  }

  // ========== 模板管理 ==========

  async getTemplates(params?: { type?: CampaignType; status?: string }) {
    let list = Array.from(this.templates.values())
    if (params?.type) {
      list = list.filter((t) => t.type === params.type)
    }
    if (params?.status) {
      list = list.filter((t) => t.status === params.status)
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getTemplate(id: string): Promise<MarketingTemplate | null> {
    return this.templates.get(id) || null
  }

  async createTemplate(template: Partial<MarketingTemplate>): Promise<MarketingTemplate> {
    const id = `template-${Date.now()}`
    const templateCode = `TPL-${String(this.templates.size + 1).padStart(3, '0')}`

    const newTemplate: MarketingTemplate = {
      id,
      templateCode,
      templateName: template.templateName!,
      type: template.type || CampaignType.EMAIL,
      subject: template.subject,
      content: template.content!,
      variables: template.variables || [],
      thumbnail: template.thumbnail,
      category: template.category,
      usageCount: 0,
      isSystem: false,
      status: 'ACTIVE',
      tenantId: template.tenantId || 'tenant-001',
      createdBy: template.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.templates.set(id, newTemplate)
    return newTemplate
  }

  // ========== 客户分群管理 ==========

  async getSegments() {
    return Array.from(this.segments.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
  }

  async getSegment(id: string): Promise<CustomerSegment | null> {
    return this.segments.get(id) || null
  }

  async createSegment(segment: Partial<CustomerSegment>): Promise<CustomerSegment> {
    const id = `segment-${Date.now()}`
    const segmentCode = `SEG-${String(this.segments.size + 1).padStart(3, '0')}`

    const newSegment: CustomerSegment = {
      id,
      segmentCode,
      segmentName: segment.segmentName!,
      description: segment.description,
      conditions: segment.conditions || [],
      memberCount: 0,
      isDynamic: segment.isDynamic ?? true,
      updateFrequency: segment.updateFrequency || 'WEEKLY',
      status: 'ACTIVE',
      tenantId: segment.tenantId || 'tenant-001',
      createdBy: segment.createdBy || 'admin',
      createdAt: new Date(),
    }

    this.segments.set(id, newSegment)
    return newSegment
  }

  async refreshSegment(id: string): Promise<CustomerSegment | null> {
    const segment = this.segments.get(id)
    if (!segment) return null

    // 模拟刷新分群数据
    segment.memberCount = Math.floor(Math.random() * 500) + 100
    segment.lastUpdated = new Date()
    this.segments.set(id, segment)
    return segment
  }

  // ========== 邮件记录管理 ==========

  async getEmailRecords(
    campaignId: string,
    params?: { status?: EmailStatus; page?: number; pageSize?: number },
  ) {
    let list = Array.from(this.emailRecords.values()).filter((r) => r.campaignId === campaignId)

    if (params?.status) {
      list = list.filter((r) => r.status === params.status)
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 50
    const total = list.length
    const start = (page - 1) * pageSize
    const data = list.slice(start, start + pageSize)

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  }

  // ========== 营销分析 ==========

  async getCampaignAnalytics(id: string) {
    const campaign = this.campaigns.get(id)
    if (!campaign) return null

    const stats = campaign.stats
    const deliveryRate = stats.sent > 0 ? (stats.delivered / stats.sent) * 100 : 0
    const openRate = stats.delivered > 0 ? (stats.opened / stats.delivered) * 100 : 0
    const clickRate = stats.opened > 0 ? (stats.clicked / stats.opened) * 100 : 0
    const conversionRate = stats.clicked > 0 ? (stats.converted / stats.clicked) * 100 : 0
    const bounceRate = stats.sent > 0 ? (stats.bounced / stats.sent) * 100 : 0
    const unsubscribeRate = stats.delivered > 0 ? (stats.unsubscribed / stats.delivered) * 100 : 0

    return {
      campaign: {
        id: campaign.id,
        code: campaign.campaignCode,
        name: campaign.campaignName,
        type: campaign.campaignType,
        status: campaign.status,
      },
      metrics: {
        sent: stats.sent,
        delivered: stats.delivered,
        opened: stats.opened,
        clicked: stats.clicked,
        converted: stats.converted,
        bounced: stats.bounced,
        unsubscribed: stats.unsubscribed,
      },
      rates: {
        deliveryRate: deliveryRate.toFixed(2),
        openRate: openRate.toFixed(2),
        clickRate: clickRate.toFixed(2),
        conversionRate: conversionRate.toFixed(2),
        bounceRate: bounceRate.toFixed(2),
        unsubscribeRate: unsubscribeRate.toFixed(2),
      },
      cost: {
        budget: campaign.budget || 0,
        spent: campaign.cost || 0,
        costPerEmail: stats.sent > 0 ? ((campaign.cost || 0) / stats.sent).toFixed(4) : 0,
        costPerConversion:
          stats.converted > 0 ? ((campaign.cost || 0) / stats.converted).toFixed(2) : 0,
      },
    }
  }

  // ========== 统计 ==========

  async getStats() {
    const campaigns = Array.from(this.campaigns.values())
    const templates = Array.from(this.templates.values())
    const segments = Array.from(this.segments.values())

    const runningCampaigns = campaigns.filter((c) => c.status === CampaignStatus.RUNNING)
    const completedCampaigns = campaigns.filter((c) => c.status === CampaignStatus.COMPLETED)

    return {
      campaigns: {
        total: campaigns.length,
        running: runningCampaigns.length,
        completed: completedCampaigns.length,
        totalSent: campaigns.reduce((sum, c) => sum + c.stats.sent, 0),
        totalOpened: campaigns.reduce((sum, c) => sum + c.stats.opened, 0),
        totalClicked: campaigns.reduce((sum, c) => sum + c.stats.clicked, 0),
        totalConverted: campaigns.reduce((sum, c) => sum + c.stats.converted, 0),
      },
      templates: {
        total: templates.length,
        systemTemplates: templates.filter((t) => t.isSystem).length,
        totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
      },
      segments: {
        total: segments.length,
        active: segments.filter((s) => s.status === 'ACTIVE').length,
        dynamic: segments.filter((s) => s.isDynamic).length,
        totalMembers: segments.reduce((sum, s) => sum + s.memberCount, 0),
      },
      performance: {
        avgOpenRate: this.calculateAvgRate(campaigns, 'opened', 'delivered'),
        avgClickRate: this.calculateAvgRate(campaigns, 'clicked', 'opened'),
        avgConversionRate: this.calculateAvgRate(campaigns, 'converted', 'clicked'),
      },
    }
  }

  private calculateAvgRate(
    campaigns: MarketingCampaign[],
    numerator: string,
    denominator: string,
  ): number {
    let totalNum = 0
    let totalDen = 0
    campaigns.forEach((c) => {
      totalNum += (c.stats as any)[numerator] || 0
      totalDen += (c.stats as any)[denominator] || 0
    })
    return totalDen > 0 ? (totalNum / totalDen) * 100 : 0
  }
}
