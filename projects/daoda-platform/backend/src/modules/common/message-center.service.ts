/**
 * 消息中心服务
 * 统一消息管理、通知推送、任务提醒、消息订阅
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum MessageType {
  SYSTEM = 'SYSTEM', // 系统消息
  TASK = 'TASK', // 任务提醒
  NOTIFICATION = 'NOTIFICATION', // 通知消息
  ALERT = 'ALERT', // 告警消息
  APPROVAL = 'APPROVAL', // 审批消息
  CHAT = 'CHAT', // 聊天消息
  ANNOUNCEMENT = 'ANNOUNCEMENT', // 公告消息
  REMINDER = 'REMINDER', // 日程提醒
  WORKFLOW = 'WORKFLOW', // 流程消息
  REPORT = 'REPORT', // 报表消息
}

export enum MessagePriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MessageStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  PROCESSED = 'PROCESSED',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  DINGTALK = 'DINGTALK',
  FEISHU = 'FEISHU',
  WECHAT = 'WECHAT',
  WEBHOOK = 'WEBHOOK',
}

// 消息模板接口
export interface MessageTemplate {
  id: string
  name: string
  type: MessageType
  titleTemplate: string
  contentTemplate: string
  channels: NotificationChannel[]
  variables: string[]
  isSystem: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// 消息接口
export interface Message {
  id: string
  type: MessageType
  priority: MessagePriority
  title: string
  content: string
  sender: string
  senderName: string
  senderAvatar?: string
  recipients: string[]
  channels: NotificationChannel[]
  status: MessageStatus
  metadata?: any
  actionType?: string
  actionUrl?: string
  actionData?: any
  readAt?: Date
  processedAt?: Date
  createdAt: Date
  expiresAt?: Date
  relatedId?: string
  relatedType?: string
}

// 消息订阅接口
export interface MessageSubscription {
  id: string
  userId: string
  types: MessageType[]
  channels: NotificationChannel[]
  priorityFilter: MessagePriority[]
  enabled: boolean
  quietHours: { start: string; end: string }
  createdAt: Date
  updatedAt: Date
}

// 通知规则接口
export interface NotificationRule {
  id: string
  name: string
  type: MessageType
  conditions: any
  channels: NotificationChannel[]
  recipients: string[]
  templateId: string
  enabled: boolean
  priority: MessagePriority
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// 任务提醒接口
export interface TaskReminder {
  id: string
  taskId: string
  taskName: string
  taskType: string
  userId: string
  remindAt: Date
  remindType: 'START' | 'DUE' | 'OVERDUE' | 'CUSTOM'
  channels: NotificationChannel[]
  status: 'PENDING' | 'SENT' | 'CANCELLED'
  createdAt: Date
}

// 消息统计接口
export interface MessageStats {
  userId: string
  total: number
  unread: number
  read: number
  archived: number
  byType: Record<MessageType, number>
  byPriority: Record<MessagePriority, number>
  lastReadAt?: Date
}

@Injectable()
export class MessageCenterService {
  // 消息模板存储
  private templates: Map<string, MessageTemplate> = new Map()

  // 消息存储
  private messages: Map<string, Message> = new Map()

  // 用户消息索引
  private userMessages: Map<string, Set<string>> = new Map()

  // 消息订阅存储
  private subscriptions: Map<string, MessageSubscription> = new Map()

  // 通知规则存储
  private rules: Map<string, NotificationRule> = new Map()

  // 任务提醒存储
  private reminders: Map<string, TaskReminder> = new Map()

  // 消息统计存储
  private stats: Map<string, MessageStats> = new Map()

  constructor() {
    this.initDefaultTemplates()
    this.initDefaultRules()
    this.initSampleMessages()
    this.initSampleSubscriptions()
    this.initSampleReminders()
    this.initSampleStats()
  }

  // 初始化默认模板
  private initDefaultTemplates() {
    const defaultTemplates: MessageTemplate[] = [
      {
        id: 'TPL-SYS-001',
        name: '系统通知模板',
        type: MessageType.SYSTEM,
        titleTemplate: '系统通知：{{title}}',
        contentTemplate: '{{content}}',
        channels: [NotificationChannel.IN_APP],
        variables: ['title', 'content'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-TASK-001',
        name: '任务提醒模板',
        type: MessageType.TASK,
        titleTemplate: '任务提醒：{{taskName}}',
        contentTemplate: '您有一个任务「{{taskName}}」将于 {{dueDate}} 到期，请及时处理。',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        variables: ['taskName', 'dueDate'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-APPROVAL-001',
        name: '审批通知模板',
        type: MessageType.APPROVAL,
        titleTemplate: '审批通知：{{title}}',
        contentTemplate: '{{applicant}} 提交的 {{approvalType}} 需要您审批，请点击查看详情。',
        channels: [
          NotificationChannel.IN_APP,
          NotificationChannel.EMAIL,
          NotificationChannel.DINGTALK,
        ],
        variables: ['title', 'applicant', 'approvalType'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-ALERT-001',
        name: '告警通知模板',
        type: MessageType.ALERT,
        titleTemplate: '告警：{{alertType}}',
        contentTemplate: '检测到 {{alertType}} 告警：{{alertContent}}。请及时处理。',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.SMS],
        variables: ['alertType', 'alertContent'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-ANNOUNCEMENT-001',
        name: '公告模板',
        type: MessageType.ANNOUNCEMENT,
        titleTemplate: '公告：{{title}}',
        contentTemplate: '{{content}}',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        variables: ['title', 'content'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-REMINDER-001',
        name: '日程提醒模板',
        type: MessageType.REMINDER,
        titleTemplate: '日程提醒：{{event}}',
        contentTemplate: '您预约的 {{event}} 将于 {{eventTime}} 开始，地点：{{location}}。',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        variables: ['event', 'eventTime', 'location'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-WORKFLOW-001',
        name: '流程通知模板',
        type: MessageType.WORKFLOW,
        titleTemplate: '流程通知：{{processName}}',
        contentTemplate: '流程「{{processName}}」状态更新：{{status}}。当前节点：{{currentNode}}。',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        variables: ['processName', 'status', 'currentNode'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-REPORT-001',
        name: '报表通知模板',
        type: MessageType.REPORT,
        titleTemplate: '报表通知：{{reportName}}',
        contentTemplate: '报表「{{reportName}}」已生成完成，请点击查看或下载。',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        variables: ['reportName'],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]

    defaultTemplates.forEach((t) => this.templates.set(t.id, t))
  }

  // 初始化默认规则
  private initDefaultRules() {
    const defaultRules: NotificationRule[] = [
      {
        id: 'RULE-001',
        name: '审批消息规则',
        type: MessageType.APPROVAL,
        conditions: { actionType: 'APPROVAL_REQUIRED' },
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        recipients: ['approver'],
        templateId: 'TPL-APPROVAL-001',
        enabled: true,
        priority: MessagePriority.HIGH,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-002',
        name: '任务到期提醒规则',
        type: MessageType.TASK,
        conditions: { hoursBeforeDue: 24 },
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        recipients: ['assignee'],
        templateId: 'TPL-TASK-001',
        enabled: true,
        priority: MessagePriority.NORMAL,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-003',
        name: '系统告警规则',
        type: MessageType.ALERT,
        conditions: { severity: ['HIGH', 'URGENT'] },
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.SMS],
        recipients: ['admin', 'operator'],
        templateId: 'TPL-ALERT-001',
        enabled: true,
        priority: MessagePriority.URGENT,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'RULE-004',
        name: '流程状态变更规则',
        type: MessageType.WORKFLOW,
        conditions: { statusChange: true },
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        recipients: ['applicant', 'approver'],
        templateId: 'TPL-WORKFLOW-001',
        enabled: true,
        priority: MessagePriority.NORMAL,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]

    defaultRules.forEach((r) => this.rules.set(r.id, r))
  }

  // 初始化示例消息
  private initSampleMessages() {
    const sampleMessages: Message[] = [
      // 系统消息
      {
        id: 'MSG-001',
        type: MessageType.SYSTEM,
        priority: MessagePriority.NORMAL,
        title: '系统维护通知',
        content:
          '系统将于今晚22:00-24:00进行维护升级，届时部分功能可能无法使用，请提前安排好工作。',
        sender: 'system',
        senderName: '系统管理员',
        recipients: ['U-001', 'U-002', 'U-003', 'U-004'],
        channels: [NotificationChannel.IN_APP],
        status: MessageStatus.UNREAD,
        createdAt: new Date('2026-03-31 09:00'),
      },
      {
        id: 'MSG-002',
        type: MessageType.ANNOUNCEMENT,
        priority: MessagePriority.HIGH,
        title: '公司公告：2026年第一季度总结大会',
        content:
          '公司将于4月5日下午14:00召开第一季度总结大会，请各部门负责人准备汇报材料。会议地点：二楼会议室。',
        sender: 'HR-001',
        senderName: '人力资源部',
        recipients: ['ALL'],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: MessageStatus.UNREAD,
        createdAt: new Date('2026-03-31 10:00'),
      },
      // 任务消息
      {
        id: 'MSG-003',
        type: MessageType.TASK,
        priority: MessagePriority.NORMAL,
        title: '任务提醒：跟进眉山市交通局项目',
        content: '您有一个任务「跟进眉山市交通局项目」将于明天到期，请及时处理。',
        sender: 'CRM',
        senderName: 'CRM系统',
        recipients: ['U-001'],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: MessageStatus.UNREAD,
        actionType: 'VIEW_TASK',
        actionUrl: '/crm/tasks/T-001',
        relatedId: 'T-001',
        relatedType: 'TASK',
        createdAt: new Date('2026-03-31 11:00'),
      },
      {
        id: 'MSG-004',
        type: MessageType.TASK,
        priority: MessagePriority.HIGH,
        title: '紧急任务：处理客户投诉',
        content: '客户「眉山机械厂」投诉产品质量问题，请尽快联系客户并处理。',
        sender: 'SERVICE',
        senderName: '售后服务系统',
        recipients: ['U-002'],
        channels: [
          NotificationChannel.IN_APP,
          NotificationChannel.EMAIL,
          NotificationChannel.DINGTALK,
        ],
        status: MessageStatus.UNREAD,
        actionType: 'VIEW_TICKET',
        actionUrl: '/service/tickets/TK-001',
        relatedId: 'TK-001',
        relatedType: 'TICKET',
        createdAt: new Date('2026-03-31 12:00'),
      },
      // 审批消息
      {
        id: 'MSG-005',
        type: MessageType.APPROVAL,
        priority: MessagePriority.HIGH,
        title: '审批通知：采购申请单',
        content: '赵六 提交的采购申请单需要您审批，金额：50000元，请点击查看详情。',
        sender: 'WF-001',
        senderName: '流程审批系统',
        recipients: ['U-003'],
        channels: [
          NotificationChannel.IN_APP,
          NotificationChannel.EMAIL,
          NotificationChannel.DINGTALK,
        ],
        status: MessageStatus.UNREAD,
        actionType: 'APPROVE',
        actionUrl: '/workflow/approve/WF-001',
        actionData: { workflowId: 'WF-001', stepId: 'STEP-002' },
        relatedId: 'WF-001',
        relatedType: 'WORKFLOW',
        createdAt: new Date('2026-03-31 13:00'),
      },
      {
        id: 'MSG-006',
        type: MessageType.APPROVAL,
        priority: MessagePriority.NORMAL,
        title: '审批通知：请假申请',
        content: '周八 提交的请假申请需要您审批，请假天数：3天，请点击查看详情。',
        sender: 'WF-002',
        senderName: '流程审批系统',
        recipients: ['U-001'],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: MessageStatus.UNREAD,
        actionType: 'APPROVE',
        actionUrl: '/workflow/approve/WF-002',
        relatedId: 'WF-002',
        relatedType: 'WORKFLOW',
        createdAt: new Date('2026-03-31 14:00'),
      },
      // 流程消息
      {
        id: 'MSG-007',
        type: MessageType.WORKFLOW,
        priority: MessagePriority.NORMAL,
        title: '流程通知：采购申请单审批完成',
        content: '流程「采购申请单」已审批完成，状态：已通过。请查看详情。',
        sender: 'WF-001',
        senderName: '流程审批系统',
        recipients: ['U-004'],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: MessageStatus.READ,
        readAt: new Date('2026-03-31 15:00'),
        actionType: 'VIEW_WORKFLOW',
        actionUrl: '/workflow/instances/WF-001',
        relatedId: 'WF-001',
        relatedType: 'WORKFLOW',
        createdAt: new Date('2026-03-31 14:30'),
      },
      // 告警消息
      {
        id: 'MSG-008',
        type: MessageType.ALERT,
        priority: MessagePriority.URGENT,
        title: '告警：库存预警',
        content:
          '检测到库存告警：产品「电机配件」库存低于安全线，当前库存：50件，安全库存：100件。',
        sender: 'ERP',
        senderName: 'ERP系统',
        recipients: ['U-004', 'U-005'],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.SMS],
        status: MessageStatus.UNREAD,
        actionType: 'VIEW_INVENTORY',
        actionUrl: '/erp/inventory/INV-001',
        relatedId: 'INV-001',
        relatedType: 'INVENTORY',
        createdAt: new Date('2026-03-31 15:00'),
      },
      // 日程提醒
      {
        id: 'MSG-009',
        type: MessageType.REMINDER,
        priority: MessagePriority.NORMAL,
        title: '日程提醒：客户拜访',
        content: '您预约的客户拜访将于明天上午10:00开始，客户：眉山市交通局，地点：眉山市东坡区。',
        sender: 'CRM',
        senderName: 'CRM系统',
        recipients: ['U-001'],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: MessageStatus.UNREAD,
        actionType: 'VIEW_EVENT',
        actionUrl: '/crm/events/E-001',
        relatedId: 'E-001',
        relatedType: 'EVENT',
        createdAt: new Date('2026-03-31 16:00'),
      },
      // 报表消息
      {
        id: 'MSG-010',
        type: MessageType.REPORT,
        priority: MessagePriority.NORMAL,
        title: '报表通知：CRM业务汇总报表',
        content: '报表「CRM业务汇总报表-2026年3月」已生成完成，请点击查看或下载。',
        sender: 'REPORT',
        senderName: '报表中心',
        recipients: ['U-001'],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: MessageStatus.UNREAD,
        actionType: 'VIEW_REPORT',
        actionUrl: '/reports/RPT-001',
        relatedId: 'RPT-001',
        relatedType: 'REPORT',
        createdAt: new Date('2026-03-31 17:00'),
      },
    ]

    sampleMessages.forEach((m) => {
      this.messages.set(m.id, m)
      // 建立用户消息索引
      m.recipients.forEach((r) => {
        if (!this.userMessages.has(r)) this.userMessages.set(r, new Set())
        this.userMessages.get(r)!.add(m.id)
      })
    })
  }

  // 初始化示例订阅
  private initSampleSubscriptions() {
    const sampleSubs: MessageSubscription[] = [
      {
        id: 'SUB-001',
        userId: 'U-001',
        types: [MessageType.TASK, MessageType.APPROVAL, MessageType.WORKFLOW, MessageType.REMINDER],
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        priorityFilter: [MessagePriority.NORMAL, MessagePriority.HIGH, MessagePriority.URGENT],
        enabled: true,
        quietHours: { start: '22:00', end: '08:00' },
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'SUB-002',
        userId: 'U-002',
        types: [MessageType.TASK, MessageType.APPROVAL, MessageType.ALERT],
        channels: [
          NotificationChannel.IN_APP,
          NotificationChannel.EMAIL,
          NotificationChannel.DINGTALK,
        ],
        priorityFilter: [MessagePriority.HIGH, MessagePriority.URGENT],
        enabled: true,
        quietHours: { start: '23:00', end: '07:00' },
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'SUB-003',
        userId: 'U-003',
        types: [
          MessageType.APPROVAL,
          MessageType.WORKFLOW,
          MessageType.SYSTEM,
          MessageType.ANNOUNCEMENT,
        ],
        channels: [
          NotificationChannel.IN_APP,
          NotificationChannel.EMAIL,
          NotificationChannel.DINGTALK,
        ],
        priorityFilter: [MessagePriority.NORMAL, MessagePriority.HIGH, MessagePriority.URGENT],
        enabled: true,
        quietHours: { start: '22:00', end: '08:00' },
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]

    sampleSubs.forEach((s) => this.subscriptions.set(s.id, s))
  }

  // 初始化示例任务提醒
  private initSampleReminders() {
    const sampleReminders: TaskReminder[] = [
      {
        id: 'REM-001',
        taskId: 'T-001',
        taskName: '跟进眉山市交通局项目',
        taskType: 'CRM_TASK',
        userId: 'U-001',
        remindAt: new Date('2026-04-01 09:00'),
        remindType: 'DUE',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: 'PENDING',
        createdAt: new Date('2026-03-31'),
      },
      {
        id: 'REM-002',
        taskId: 'T-002',
        taskName: '处理客户投诉',
        taskType: 'SERVICE_TICKET',
        userId: 'U-002',
        remindAt: new Date('2026-03-31 18:00'),
        remindType: 'OVERDUE',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.SMS],
        status: 'PENDING',
        createdAt: new Date('2026-03-31'),
      },
      {
        id: 'REM-003',
        taskId: 'T-003',
        taskName: '审核采购申请',
        taskType: 'APPROVAL',
        userId: 'U-003',
        remindAt: new Date('2026-03-31 20:00'),
        remindType: 'CUSTOM',
        channels: [NotificationChannel.IN_APP, NotificationChannel.DINGTALK],
        status: 'PENDING',
        createdAt: new Date('2026-03-31'),
      },
      {
        id: 'REM-004',
        taskId: 'E-001',
        taskName: '客户拜访',
        taskType: 'EVENT',
        userId: 'U-001',
        remindAt: new Date('2026-04-01 09:30'),
        remindType: 'START',
        channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
        status: 'PENDING',
        createdAt: new Date('2026-03-31'),
      },
    ]

    sampleReminders.forEach((r) => this.reminders.set(r.id, r))
  }

  // 初始化示例统计
  private initSampleStats() {
    const sampleStats: MessageStats[] = [
      {
        userId: 'U-001',
        total: 5,
        unread: 4,
        read: 1,
        archived: 0,
        byType: {
          SYSTEM: 1,
          TASK: 1,
          APPROVAL: 1,
          WORKFLOW: 0,
          ALERT: 0,
          REMINDER: 1,
          REPORT: 1,
          ANNOUNCEMENT: 1,
          NOTIFICATION: 0,
          CHAT: 0,
        },
        byPriority: {
          LOW: 0,
          NORMAL: 3,
          HIGH: 1,
          URGENT: 0,
        },
        lastReadAt: new Date('2026-03-31 12:00'),
      },
      {
        userId: 'U-002',
        total: 2,
        unread: 2,
        read: 0,
        archived: 0,
        byType: {
          SYSTEM: 1,
          TASK: 1,
          APPROVAL: 0,
          WORKFLOW: 0,
          ALERT: 0,
          REMINDER: 0,
          REPORT: 0,
          ANNOUNCEMENT: 1,
          NOTIFICATION: 0,
          CHAT: 0,
        },
        byPriority: {
          LOW: 0,
          NORMAL: 1,
          HIGH: 1,
          URGENT: 0,
        },
      },
      {
        userId: 'U-003',
        total: 4,
        unread: 3,
        read: 1,
        archived: 0,
        byType: {
          SYSTEM: 1,
          TASK: 0,
          APPROVAL: 1,
          WORKFLOW: 0,
          ALERT: 0,
          REMINDER: 0,
          REPORT: 0,
          ANNOUNCEMENT: 1,
          NOTIFICATION: 1,
          CHAT: 0,
        },
        byPriority: {
          LOW: 0,
          NORMAL: 2,
          HIGH: 1,
          URGENT: 0,
        },
        lastReadAt: new Date('2026-03-31 15:00'),
      },
    ]

    sampleStats.forEach((s) => this.stats.set(s.userId, s))
  }

  // ========== 消息模板管理 ==========

  async getTemplates(params?: { type?: MessageType }) {
    let templates = Array.from(this.templates.values())
    if (params?.type) templates = templates.filter((t) => t.type === params.type)
    return templates
  }

  async getTemplate(id: string) {
    return this.templates.get(id)
  }

  async createTemplate(template: MessageTemplate) {
    template.id = `TPL-${Date.now()}`
    template.createdAt = new Date()
    template.updatedAt = new Date()
    template.isSystem = false
    this.templates.set(template.id, template)
    return template
  }

  async updateTemplate(id: string, updates: Partial<MessageTemplate>) {
    const template = this.templates.get(id)
    if (!template) return null
    if (template.isSystem) throw new Error('系统模板不可修改')
    Object.assign(template, updates, { updatedAt: new Date() })
    this.templates.set(id, template)
    return template
  }

  async deleteTemplate(id: string) {
    const template = this.templates.get(id)
    if (!template) return false
    if (template.isSystem) throw new Error('系统模板不可删除')
    return this.templates.delete(id)
  }

  // ========== 消息发送 ==========

  async sendMessage(params: {
    type: MessageType
    priority?: MessagePriority
    title: string
    content: string
    sender: string
    senderName: string
    recipients: string[]
    channels?: NotificationChannel[]
    metadata?: any
    actionType?: string
    actionUrl?: string
    actionData?: any
    relatedId?: string
    relatedType?: string
    expiresAt?: Date
  }) {
    const message: Message = {
      id: `MSG-${Date.now()}`,
      type: params.type,
      priority: params.priority || MessagePriority.NORMAL,
      title: params.title,
      content: params.content,
      sender: params.sender,
      senderName: params.senderName,
      recipients: params.recipients,
      channels: params.channels || [NotificationChannel.IN_APP],
      status: MessageStatus.UNREAD,
      metadata: params.metadata,
      actionType: params.actionType,
      actionUrl: params.actionUrl,
      actionData: params.actionData,
      relatedId: params.relatedId,
      relatedType: params.relatedType,
      expiresAt: params.expiresAt,
      createdAt: new Date(),
    }

    this.messages.set(message.id, message)

    // 建立用户消息索引
    params.recipients.forEach((r) => {
      if (!this.userMessages.has(r)) this.userMessages.set(r, new Set())
      this.userMessages.get(r)!.add(message.id)
    })

    // 更新统计
    params.recipients.forEach((r) => {
      const stat = this.stats.get(r)
      if (stat) {
        stat.total++
        stat.unread++
        stat.byType[params.type] = (stat.byType[params.type] || 0) + 1
        stat.byPriority[message.priority] = (stat.byPriority[message.priority] || 0) + 1
        this.stats.set(r, stat)
      } else {
        // 创建新统计
        this.stats.set(r, {
          userId: r,
          total: 1,
          unread: 1,
          read: 0,
          archived: 0,
          byType: { [params.type]: 1 } as any,
          byPriority: { [message.priority]: 1 } as any,
        })
      }
    })

    return message
  }

  async sendTemplateMessage(params: {
    templateId: string
    variables: Record<string, string>
    recipients: string[]
    sender: string
    senderName: string
    metadata?: any
    relatedId?: string
    relatedType?: string
  }) {
    const template = this.templates.get(params.templateId)
    if (!template) throw new Error('模板不存在')

    // 替换变量
    let title = template.titleTemplate
    let content = template.contentTemplate
    template.variables.forEach((v) => {
      title = title.replace(`{{${v}}}`, params.variables[v] || '')
      content = content.replace(`{{${v}}}`, params.variables[v] || '')
    })

    return this.sendMessage({
      type: template.type,
      title,
      content,
      sender: params.sender,
      senderName: params.senderName,
      recipients: params.recipients,
      channels: template.channels,
      metadata: params.metadata,
      relatedId: params.relatedId,
      relatedType: params.relatedType,
    })
  }

  async broadcastMessage(params: {
    type: MessageType
    priority?: MessagePriority
    title: string
    content: string
    sender: string
    senderName: string
    channels?: NotificationChannel[]
  }) {
    // 广播给所有用户
    const allUsers = ['U-001', 'U-002', 'U-003', 'U-004', 'U-005', 'U-006']
    return this.sendMessage({
      ...params,
      recipients: allUsers,
    })
  }

  // ========== 消息查询 ==========

  async getUserMessages(params: {
    userId: string
    type?: MessageType
    status?: MessageStatus
    priority?: MessagePriority
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    const userMsgIds = this.userMessages.get(params.userId) || new Set()
    let messages = Array.from(userMsgIds)
      .map((id) => this.messages.get(id))
      .filter((m) => m !== undefined)

    // 筛选
    if (params.type) messages = messages.filter((m) => m!.type === params.type)
    if (params.status) messages = messages.filter((m) => m!.status === params.status)
    if (params.priority) messages = messages.filter((m) => m!.priority === params.priority)
    if (params.startDate) messages = messages.filter((m) => m!.createdAt >= params.startDate!)
    if (params.endDate) messages = messages.filter((m) => m!.createdAt <= params.endDate!)

    // 排序：未读优先，然后按时间倒序
    messages.sort((a, b) => {
      if (a!.status === MessageStatus.UNREAD && b!.status !== MessageStatus.UNREAD) return -1
      if (a!.status !== MessageStatus.UNREAD && b!.status === MessageStatus.UNREAD) return 1
      return b!.createdAt.getTime() - a!.createdAt.getTime()
    })

    const page = params.page || 1
    const pageSize = params.pageSize || 20
    const total = messages.length
    const list = messages.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  async getMessage(id: string) {
    return this.messages.get(id)
  }

  // ========== 消息操作 ==========

  async markAsRead(userId: string, messageIds: string[]) {
    messageIds.forEach((id) => {
      const message = this.messages.get(id)
      if (message && message.recipients.includes(userId)) {
        message.status = MessageStatus.READ
        message.readAt = new Date()
        this.messages.set(id, message)
      }
    })

    // 更新统计
    const stat = this.stats.get(userId)
    if (stat) {
      stat.unread -= messageIds.length
      stat.read += messageIds.length
      stat.lastReadAt = new Date()
      this.stats.set(userId, stat)
    }

    return { success: true, count: messageIds.length }
  }

  async markAllAsRead(userId: string) {
    const userMsgIds = this.userMessages.get(userId) || new Set()
    const unreadIds = Array.from(userMsgIds)
      .map((id) => this.messages.get(id))
      .filter((m) => m && m.status === MessageStatus.UNREAD)
      .map((m) => m!.id)

    return this.markAsRead(userId, unreadIds)
  }

  async archiveMessage(userId: string, messageIds: string[]) {
    messageIds.forEach((id) => {
      const message = this.messages.get(id)
      if (message && message.recipients.includes(userId)) {
        message.status = MessageStatus.ARCHIVED
        this.messages.set(id, message)
      }
    })

    // 更新统计
    const stat = this.stats.get(userId)
    if (stat) {
      stat.archived += messageIds.length
      if (stat.unread > 0)
        stat.unread -= messageIds.filter(
          (id) => this.messages.get(id)?.status === MessageStatus.UNREAD,
        ).length
      this.stats.set(userId, stat)
    }

    return { success: true, count: messageIds.length }
  }

  async deleteMessage(userId: string, messageIds: string[]) {
    messageIds.forEach((id) => {
      const message = this.messages.get(id)
      if (message) {
        message.status = MessageStatus.DELETED
        this.messages.set(id, message)
      }
    })

    // 从用户索引移除
    const userMsgIds = this.userMessages.get(userId)
    if (userMsgIds) {
      messageIds.forEach((id) => userMsgIds.delete(id))
    }

    // 更新统计
    const stat = this.stats.get(userId)
    if (stat) {
      stat.total -= messageIds.length
      if (stat.unread > 0)
        stat.unread -= messageIds.filter(
          (id) => this.messages.get(id)?.status === MessageStatus.UNREAD,
        ).length
      this.stats.set(userId, stat)
    }

    return { success: true, count: messageIds.length }
  }

  async processMessage(userId: string, messageId: string, actionResult: any) {
    const message = this.messages.get(messageId)
    if (!message) throw new Error('消息不存在')

    message.status = MessageStatus.PROCESSED
    message.processedAt = new Date()
    message.metadata = { ...message.metadata, actionResult }
    this.messages.set(messageId, message)

    // 更新统计
    const stat = this.stats.get(userId)
    if (stat && stat.unread > 0) {
      stat.unread--
      this.stats.set(userId, stat)
    }

    return message
  }

  // ========== 消息订阅管理 ==========

  async getSubscriptions(userId?: string) {
    let subs = Array.from(this.subscriptions.values())
    if (userId) subs = subs.filter((s) => s.userId === userId)
    return subs
  }

  async getSubscription(id: string) {
    return this.subscriptions.get(id)
  }

  async createSubscription(sub: MessageSubscription) {
    sub.id = `SUB-${Date.now()}`
    sub.createdAt = new Date()
    sub.updatedAt = new Date()
    this.subscriptions.set(sub.id, sub)
    return sub
  }

  async updateSubscription(id: string, updates: Partial<MessageSubscription>) {
    const sub = this.subscriptions.get(id)
    if (!sub) return null
    Object.assign(sub, updates, { updatedAt: new Date() })
    this.subscriptions.set(id, sub)
    return sub
  }

  async deleteSubscription(id: string) {
    return this.subscriptions.delete(id)
  }

  // ========== 通知规则管理 ==========

  async getRules(params?: { type?: MessageType; enabled?: boolean }) {
    let rules = Array.from(this.rules.values())
    if (params?.type) rules = rules.filter((r) => r.type === params.type)
    if (params?.enabled !== undefined) rules = rules.filter((r) => r.enabled === params.enabled)
    return rules
  }

  async getRule(id: string) {
    return this.rules.get(id)
  }

  async createRule(rule: NotificationRule) {
    rule.id = `RULE-${Date.now()}`
    rule.createdAt = new Date()
    rule.updatedAt = new Date()
    this.rules.set(rule.id, rule)
    return rule
  }

  async updateRule(id: string, updates: Partial<NotificationRule>) {
    const rule = this.rules.get(id)
    if (!rule) return null
    Object.assign(rule, updates, { updatedAt: new Date() })
    this.rules.set(id, rule)
    return rule
  }

  async deleteRule(id: string) {
    return this.rules.delete(id)
  }

  async toggleRule(id: string, enabled: boolean) {
    const rule = this.rules.get(id)
    if (!rule) return null
    rule.enabled = enabled
    rule.updatedAt = new Date()
    this.rules.set(id, rule)
    return rule
  }

  // ========== 任务提醒管理 ==========

  async getReminders(userId?: string, status?: 'PENDING' | 'SENT' | 'CANCELLED') {
    let reminders = Array.from(this.reminders.values())
    if (userId) reminders = reminders.filter((r) => r.userId === userId)
    if (status) reminders = reminders.filter((r) => r.status === status)
    return reminders
  }

  async createReminder(reminder: TaskReminder) {
    reminder.id = `REM-${Date.now()}`
    reminder.createdAt = new Date()
    reminder.status = 'PENDING'
    this.reminders.set(reminder.id, reminder)
    return reminder
  }

  async cancelReminder(id: string) {
    const reminder = this.reminders.get(id)
    if (!reminder) return null
    reminder.status = 'CANCELLED'
    this.reminders.set(id, reminder)
    return reminder
  }

  // ========== 消息统计 ==========

  async getStats(userId: string) {
    return (
      this.stats.get(userId) || {
        userId,
        total: 0,
        unread: 0,
        read: 0,
        archived: 0,
        byType: {} as any,
        byPriority: {} as any,
      }
    )
  }

  async getOverallStats() {
    const allStats = Array.from(this.stats.values())
    return {
      totalMessages: this.messages.size,
      totalTemplates: this.templates.size,
      totalRules: this.rules.size,
      totalReminders: Array.from(this.reminders.values()).filter((r) => r.status === 'PENDING')
        .length,
      totalUnread: allStats.reduce((sum, s) => sum + s.unread, 0),
      avgReadRate:
        allStats.length > 0
          ? Math.round(
              (allStats.reduce((sum, s) => sum + s.read / s.total, 0) / allStats.length) * 100,
            )
          : 0,
    }
  }

  // ========== 批量操作 ==========

  async batchMarkAsRead(
    userId: string,
    params: {
      type?: MessageType
      priority?: MessagePriority
      beforeDate?: Date
    },
  ) {
    const userMsgIds = this.userMessages.get(userId) || new Set()
    let targetIds = Array.from(userMsgIds)
      .map((id) => this.messages.get(id))
      .filter((m) => m && m.status === MessageStatus.UNREAD)
      .map((m) => m!.id)

    if (params.type)
      targetIds = targetIds.filter((id) => this.messages.get(id)?.type === params.type)
    if (params.priority)
      targetIds = targetIds.filter((id) => this.messages.get(id)?.priority === params.priority)
    if (params.beforeDate)
      targetIds = targetIds.filter((id) => {
        const msg = this.messages.get(id)
        return msg && msg.createdAt < params.beforeDate!
      })

    return this.markAsRead(userId, targetIds)
  }
}
