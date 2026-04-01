/**
 * Notification 通知提醒系统模块
 * 热插拔核心模块 - 多通道消息推送
 *
 * 功能范围:
 * - 站内消息中心 (未读/已读管理)
 * - 邮件通知 (SMTP发送)
 * - 钉钉通知 (工作通知推送)
 * - 浏览器通知 (Web Notification)
 * - 消息模板管理
 * - 用户通知偏好
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { BaseModule } from '../../core/module/base-module'
import {
  ModuleManifest,
  ModuleContext,
  HotUpdateStrategy,
  ModuleMenuItem,
  ModulePermission,
  PermissionType,
  ModuleRoute,
  HttpMethod,
  ModuleEvent,
  EventType,
} from '../../core/module/interfaces'

// ============================================
// 类型定义导出
// ============================================

// 消息类型
export enum MessageType {
  SYSTEM = 'system',
  APPROVAL = 'approval',
  REMINDER = 'reminder',
  NOTICE = 'notice',
  TASK = 'task',
}

// 消息分类
export enum MessageCategory {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

// 消息状态
export enum MessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  READ = 'read',
  FAILED = 'failed',
}

// 通知渠道
export enum NotifyChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  DINGTALK = 'dingtalk',
  BROWSER = 'browser',
  SMS = 'sms',
}

// ============================================
// 数据接口导出
// ============================================

// 接收人信息
export interface ReceiverInfo {
  userId: string
  name?: string
  email?: string
  phone?: string
  dingtalkUserId?: string
}

// 通知消息
export interface NotificationMessage {
  id: string
  type: MessageType
  title: string
  content: string
  category: MessageCategory
  senderId?: string
  senderName?: string
  receiverIds: string[]
  channels: NotifyChannel[]
  businessType?: string
  businessId?: string
  workflowInstanceId?: string
  status: MessageStatus
  sentAt?: Date
  readAt?: Date
  templateId?: string
  templateData?: Record<string, any>
  link?: string
  priority?: number
  expiresAt?: Date
  createdAt: Date
  updatedAt?: Date
}

// 发送结果
export interface SendResult {
  channel: NotifyChannel
  success: boolean
  messageId?: string
  error?: string
  sentAt: Date
}

// 消息模板
export interface MessageTemplate {
  id: string
  code: string
  name: string
  type: MessageType
  titleTemplate: string
  contentTemplate: string
  emailTemplate?: string
  dingtalkTemplate?: string
  variables: TemplateVariable[]
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}

// 模板变量
export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
  required: boolean
  defaultValue?: any
  description?: string
}

// 用户通知偏好
export interface UserNotifyPreference {
  userId: string
  enabledChannels: NotifyChannel[]
  disabledTypes?: MessageType[]
  quietHours?: QuietHours
  emailEnabled: boolean
  dingtalkEnabled: boolean
  browserEnabled: boolean
  updatedAt: Date
}

// 免打扰时段
export interface QuietHours {
  start: string
  end: string
  enabled: boolean
}

// 渠道配置
export interface ChannelConfig {
  channel: NotifyChannel
  enabled: boolean
  config?: Record<string, any>
}

// ============================================
// DTO 接口导出
// ============================================

// 发送通知DTO
export interface SendNotificationDto {
  type: MessageType
  title?: string
  content?: string
  category?: MessageCategory
  receiverIds: string[]
  channels?: NotifyChannel[]
  templateId?: string
  templateData?: Record<string, any>
  businessType?: string
  businessId?: string
  workflowInstanceId?: string
  link?: string
  priority?: number
  senderId?: string
}

// 批量发送DTO
export interface BatchNotificationDto {
  messages: SendNotificationDto[]
}

// 创建模板DTO
export interface CreateTemplateDto {
  code: string
  name: string
  type: MessageType
  titleTemplate: string
  contentTemplate: string
  emailTemplate?: string
  dingtalkTemplate?: string
  variables?: TemplateVariable[]
}

// 更新模板DTO
export interface UpdateTemplateDto {
  name?: string
  titleTemplate?: string
  contentTemplate?: string
  emailTemplate?: string
  dingtalkTemplate?: string
  variables?: TemplateVariable[]
  isActive?: boolean
}

// 用户偏好DTO
export interface PreferenceDto {
  enabledChannels?: NotifyChannel[]
  disabledTypes?: MessageType[]
  quietHours?: QuietHours
  emailEnabled?: boolean
  dingtalkEnabled?: boolean
  browserEnabled?: boolean
}

// 消息筛选DTO
export interface MessageFilterDto {
  type?: MessageType
  status?: MessageStatus
  businessType?: string
  isRead?: boolean
  startDate?: Date
  endDate?: Date
  page?: number
  pageSize?: number
}

// ============================================
// 通道适配器接口
// ============================================

interface INotifyChannelAdapter {
  channel: NotifyChannel
  send(message: NotificationMessage, receiver: ReceiverInfo): Promise<SendResult>
  isConfigured(): boolean
  getConfig(): ChannelConfig
}

// ============================================
// 模块清单定义
// ============================================

export const NOTIFICATION_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/notification',
  name: '通知提醒系统',
  version: '1.0.0',
  description: '多通道消息推送系统，支持站内消息、邮件、钉钉、浏览器通知',
  category: 'core',
  tags: ['notification', 'message', 'email', 'dingtalk', 'push'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
    { id: '@daoda/dingtalk', version: '>=1.0.0', optional: true },
  ],
  permissions: [
    'notification:message:view',
    'notification:message:send',
    'notification:message:delete',
    'notification:template:view',
    'notification:template:create',
    'notification:template:update',
    'notification:template:delete',
    'notification:preference:view',
    'notification:preference:update',
    'notification:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
}

// ============================================
// Notification 模块实现
// ============================================

export class NotificationModule extends BaseModule {
  readonly manifest = NOTIFICATION_MODULE_MANIFEST

  // 存储服务
  private messages: Map<string, NotificationMessage> = new Map()
  private templates: Map<string, MessageTemplate> = new Map()
  private preferences: Map<string, UserNotifyPreference> = new Map()
  private userMessages: Map<string, Set<string>> = new Map() // userId -> messageIds

  // 通道适配器
  private adapters: Map<NotifyChannel, INotifyChannelAdapter> = new Map()

  // WebSocket 连接池 (站内消息实时推送)
  private wsConnections: Map<string, any> = new Map()

  // ============================================
  // 生命周期钩子
  // ============================================

  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('Notification 模块安装开始...')

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      defaultChannels: ['in_app', 'dingtalk'],
      emailEnabled: false,
      browserEnabled: true,
      retentionDays: 30, // 消息保留30天
      maxBatchSize: 100,
    })

    // 初始化默认消息模板
    await this.initDefaultTemplates()

    // 初始化通道适配器
    this.initChannelAdapters(context)

    this.logger?.info('Notification 模块安装完成')
  }

  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('Notification 模块启动...')

    // 注册 WebSocket 推送服务
    this.registerWebSocketService()

    // 发送模块启动事件
    await this._context?.eventBus.emit('notification.module.started', {
      moduleId: this.manifest.id,
      timestamp: Date.now(),
    })

    this.logger?.info('Notification 模块已启动')
  }

  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('Notification 模块停止...')

    // 关闭所有 WebSocket 连接
    this.closeAllWebSocketConnections()

    // 发送模块停止事件
    await this._context?.eventBus.emit('notification.module.stopped', {
      moduleId: this.manifest.id,
      timestamp: Date.now(),
    })
  }

  // ============================================
  // 通知发送服务
  // ============================================

  /**
   * 发送单个通知
   */
  async send(dto: SendNotificationDto): Promise<NotificationMessage> {
    // 验证接收人
    if (!dto.receiverIds || dto.receiverIds.length === 0) {
      throw new Error('缺少接收人')
    }

    // 使用模板渲染消息
    let title = dto.title || ''
    let content = dto.content || ''

    if (dto.templateId) {
      const template = this.templates.get(dto.templateId)
      if (template) {
        title = this.renderTemplate(template.titleTemplate, dto.templateData || {})
        content = this.renderTemplate(template.contentTemplate, dto.templateData || {})
      }
    }

    // 确定发送渠道
    const channels = dto.channels || this.getDefaultChannels(dto.type)

    // 创建消息
    const message: NotificationMessage = {
      id: `msg-${dto.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: dto.type,
      title,
      content,
      category: dto.category || MessageCategory.INFO,
      senderId: dto.senderId,
      receiverIds: dto.receiverIds,
      channels,
      businessType: dto.businessType,
      businessId: dto.businessId,
      workflowInstanceId: dto.workflowInstanceId,
      status: MessageStatus.PENDING,
      templateId: dto.templateId,
      templateData: dto.templateData,
      link: dto.link,
      priority: dto.priority || 0,
      createdAt: new Date(),
    }

    // 存储
    this.messages.set(message.id, message)

    // 关联用户消息
    for (const userId of dto.receiverIds) {
      this.addUserMessage(userId, message.id)
    }

    // 发送到各渠道
    const results = await this.sendToChannels(message, dto.receiverIds)

    // 更新状态
    const allSuccess = results.every((r) => r.success)
    message.status = allSuccess ? MessageStatus.SENT : MessageStatus.FAILED
    message.sentAt = allSuccess ? new Date() : undefined
    message.updatedAt = new Date()

    this.messages.set(message.id, message)

    this.logger?.info(`通知发送完成: ${message.id}`, {
      channels,
      success: allSuccess,
      receiverCount: dto.receiverIds.length,
    })

    // 发送事件
    await this._context?.eventBus.emit('notification.message.sent', {
      messageId: message.id,
      type: message.type,
      channels,
      receiverIds: dto.receiverIds,
    })

    return message
  }

  /**
   * 批量发送通知
   */
  async sendBatch(dto: BatchNotificationDto): Promise<NotificationMessage[]> {
    const results: NotificationMessage[] = []

    for (const msgDto of dto.messages) {
      try {
        const result = await this.send(msgDto)
        results.push(result)
      } catch (error) {
        this.logger?.error('批量发送失败', { error, dto: msgDto })
      }
    }

    return results
  }

  /**
   * 发送到各渠道
   */
  private async sendToChannels(
    message: NotificationMessage,
    receiverIds: string[],
  ): Promise<SendResult[]> {
    const results: SendResult[] = []

    for (const channel of message.channels) {
      const adapter = this.adapters.get(channel)
      if (!adapter || !adapter.isConfigured()) {
        this.logger?.warn(`通道未配置: ${channel}`)
        continue
      }

      for (const userId of receiverIds) {
        // 检查用户偏好
        if (!this.shouldSendToUser(userId, channel, message.type)) {
          this.logger?.debug(`用户禁用该渠道: ${userId} - ${channel}`)
          continue
        }

        // 检查免打扰时段
        if (this.isQuietHours(userId)) {
          this.logger?.debug(`用户处于免打扰时段: ${userId}`)
          continue
        }

        try {
          const receiver = await this.getReceiverInfo(userId)
          const result = await adapter.send(message, receiver)
          results.push(result)
        } catch (error) {
          results.push({
            channel,
            success: false,
            error: String(error),
            sentAt: new Date(),
          })
        }
      }
    }

    return results
  }

  // ============================================
  // 消息管理服务
  // ============================================

  /**
   * 获取用户消息列表
   */
  getMyMessages(userId: string, filter?: MessageFilterDto): NotificationMessage[] {
    const messageIds = this.userMessages.get(userId) || new Set()
    let messages = Array.from(messageIds)
      .map((id) => this.messages.get(id))
      .filter(Boolean) as NotificationMessage[]

    // 筛选
    if (filter) {
      messages = messages.filter((msg) => {
        if (filter.type && msg.type !== filter.type) return false
        if (filter.status && msg.status !== filter.status) return false
        if (filter.businessType && msg.businessType !== filter.businessType) return false
        if (filter.isRead !== undefined) {
          const isRead = msg.readAt !== undefined
          if (filter.isRead !== isRead) return false
        }
        if (filter.startDate && msg.createdAt < filter.startDate) return false
        if (filter.endDate && msg.createdAt > filter.endDate) return false
        return true
      })
    }

    // 排序 (按优先级和创建时间)
    messages.sort((a, b) => {
      const aPriority = a.priority ?? 0
      const bPriority = b.priority ?? 0
      if (aPriority !== bPriority) return bPriority - aPriority
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    // 分页
    if (filter?.page && filter?.pageSize) {
      const start = (filter.page - 1) * filter.pageSize
      messages = messages.slice(start, start + filter.pageSize)
    }

    return messages
  }

  /**
   * 获取未读数量
   */
  getUnreadCount(userId: string): number {
    const messageIds = this.userMessages.get(userId) || new Set()
    return Array.from(messageIds)
      .map((id) => this.messages.get(id))
      .filter((msg) => msg && !msg.readAt).length
  }

  /**
   * 标记已读
   */
  markAsRead(messageId: string, userId: string): void {
    const message = this.messages.get(messageId)
    if (!message) {
      throw new Error(`消息不存在: ${messageId}`)
    }

    if (!message.receiverIds.includes(userId)) {
      throw new Error('用户无权访问该消息')
    }

    message.readAt = new Date()
    message.status = MessageStatus.READ
    message.updatedAt = new Date()

    this.messages.set(messageId, message)

    this.logger?.debug(`消息已读: ${messageId}`, { userId })
  }

  /**
   * 标记全部已读
   */
  markAllAsRead(userId: string): void {
    const messageIds = this.userMessages.get(userId) || new Set()

    for (const messageId of messageIds) {
      const message = this.messages.get(messageId)
      if (message && !message.readAt) {
        message.readAt = new Date()
        message.status = MessageStatus.READ
        message.updatedAt = new Date()
        this.messages.set(messageId, message)
      }
    }

    this.logger?.info(`用户全部消息已读: ${userId}`)
  }

  /**
   * 删除消息
   */
  deleteMessage(messageId: string, userId: string): void {
    const message = this.messages.get(messageId)
    if (!message) {
      throw new Error(`消息不存在: ${messageId}`)
    }

    // 从用户消息列表移除
    const userMessageIds = this.userMessages.get(userId)
    if (userMessageIds) {
      userMessageIds.delete(messageId)
    }

    // 如果消息没有接收人了，则完全删除
    message.receiverIds = message.receiverIds.filter((id) => id !== userId)
    if (message.receiverIds.length === 0) {
      this.messages.delete(messageId)
    }

    this.logger?.debug(`消息已删除: ${messageId}`, { userId })
  }

  // ============================================
  // 模板管理服务
  // ============================================

  /**
   * 创建模板
   */
  createTemplate(dto: CreateTemplateDto): MessageTemplate {
    const template: MessageTemplate = {
      id: `tpl-${dto.code}-${Date.now()}`,
      code: dto.code,
      name: dto.name,
      type: dto.type,
      titleTemplate: dto.titleTemplate,
      contentTemplate: dto.contentTemplate,
      emailTemplate: dto.emailTemplate,
      dingtalkTemplate: dto.dingtalkTemplate,
      variables: dto.variables || [],
      isActive: true,
      createdAt: new Date(),
    }

    this.templates.set(template.id, template)

    this.logger?.info(`模板创建成功: ${template.id}`, { code: dto.code })

    return template
  }

  /**
   * 更新模板
   */
  updateTemplate(id: string, dto: UpdateTemplateDto): MessageTemplate {
    const template = this.templates.get(id)
    if (!template) {
      throw new Error(`模板不存在: ${id}`)
    }

    if (dto.name) template.name = dto.name
    if (dto.titleTemplate) template.titleTemplate = dto.titleTemplate
    if (dto.contentTemplate) template.contentTemplate = dto.contentTemplate
    if (dto.emailTemplate) template.emailTemplate = dto.emailTemplate
    if (dto.dingtalkTemplate) template.dingtalkTemplate = dto.dingtalkTemplate
    if (dto.variables) template.variables = dto.variables
    if (dto.isActive !== undefined) template.isActive = dto.isActive

    template.updatedAt = new Date()

    this.templates.set(id, template)

    this.logger?.info(`模板更新成功: ${id}`)

    return template
  }

  /**
   * 获取模板
   */
  getTemplate(id: string): MessageTemplate | undefined {
    return this.templates.get(id)
  }

  /**
   * 根据编码获取模板
   */
  getTemplateByCode(code: string): MessageTemplate | undefined {
    for (const template of this.templates.values()) {
      if (template.code === code && template.isActive) {
        return template
      }
    }
    return undefined
  }

  /**
   * 获取模板列表
   */
  listTemplates(filter?: { type?: MessageType; isActive?: boolean }): MessageTemplate[] {
    const list = Array.from(this.templates.values())
    if (filter) {
      return list.filter((tpl) => {
        if (filter.type && tpl.type !== filter.type) return false
        if (filter.isActive !== undefined && tpl.isActive !== filter.isActive) return false
        return true
      })
    }
    return list
  }

  /**
   * 渲染模板
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match
    })
  }

  // ============================================
  // 用户偏好服务
  // ============================================

  /**
   * 获取用户偏好
   */
  getPreference(userId: string): UserNotifyPreference {
    const preference = this.preferences.get(userId)
    if (preference) return preference

    // 默认偏好
    return {
      userId,
      enabledChannels: [NotifyChannel.IN_APP, NotifyChannel.DINGTALK],
      emailEnabled: false,
      dingtalkEnabled: true,
      browserEnabled: true,
      updatedAt: new Date(),
    }
  }

  /**
   * 设置用户偏好
   */
  setPreference(userId: string, dto: PreferenceDto): UserNotifyPreference {
    const current = this.getPreference(userId)

    const preference: UserNotifyPreference = {
      userId,
      enabledChannels: dto.enabledChannels || current.enabledChannels,
      disabledTypes: dto.disabledTypes || current.disabledTypes,
      quietHours: dto.quietHours || current.quietHours,
      emailEnabled: dto.emailEnabled ?? current.emailEnabled,
      dingtalkEnabled: dto.dingtalkEnabled ?? current.dingtalkEnabled,
      browserEnabled: dto.browserEnabled ?? current.browserEnabled,
      updatedAt: new Date(),
    }

    this.preferences.set(userId, preference)

    this.logger?.info(`用户偏好更新: ${userId}`)

    return preference
  }

  // ============================================
  // WebSocket 实时推送
  // ============================================

  /**
   * 注册 WebSocket 连接
   */
  registerWebSocketConnection(userId: string, connection: any): void {
    this.wsConnections.set(userId, connection)
    this.logger?.debug(`WebSocket 连接注册: ${userId}`)
  }

  /**
   * 移除 WebSocket 连接
   */
  removeWebSocketConnection(userId: string): void {
    this.wsConnections.delete(userId)
    this.logger?.debug(`WebSocket 连接移除: ${userId}`)
  }

  /**
   * 推送站内消息
   */
  private pushInAppMessage(userId: string, message: NotificationMessage): void {
    const connection = this.wsConnections.get(userId)
    if (connection) {
      connection.send(
        JSON.stringify({
          type: 'notification',
          data: {
            id: message.id,
            title: message.title,
            content: message.content,
            category: message.category,
            businessType: message.businessType,
            link: message.link,
            createdAt: message.createdAt,
          },
        }),
      )
    }
  }

  // ============================================
  // 内部辅助方法
  // ============================================

  /**
   * 添加用户消息
   */
  private addUserMessage(userId: string, messageId: string): void {
    if (!this.userMessages.has(userId)) {
      this.userMessages.set(userId, new Set())
    }
    this.userMessages.get(userId)!.add(messageId)
  }

  /**
   * 获取接收人信息
   */
  private async getReceiverInfo(userId: string): Promise<ReceiverInfo> {
    const user = this._context?.serviceRegistry.get<any>('user')
    if (user) {
      const userInfo = await user.findById(userId)
      return {
        userId,
        name: userInfo?.name,
        email: userInfo?.email,
        phone: userInfo?.phone,
        dingtalkUserId: userInfo?.dingtalkUserId,
      }
    }
    return { userId }
  }

  /**
   * 判断是否应该发送给用户
   */
  private shouldSendToUser(userId: string, channel: NotifyChannel, type: MessageType): boolean {
    const preference = this.getPreference(userId)

    // 检查渠道是否启用
    if (!preference.enabledChannels.includes(channel)) return false

    // 检查类型是否禁用
    if (preference.disabledTypes?.includes(type)) return false

    // 检查具体渠道开关
    if (channel === NotifyChannel.EMAIL && !preference.emailEnabled) return false
    if (channel === NotifyChannel.DINGTALK && !preference.dingtalkEnabled) return false
    if (channel === NotifyChannel.BROWSER && !preference.browserEnabled) return false

    return true
  }

  /**
   * 判断是否在免打扰时段
   */
  private isQuietHours(userId: string): boolean {
    const preference = this.getPreference(userId)
    if (!preference.quietHours?.enabled) return false

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    return currentTime >= preference.quietHours.start && currentTime <= preference.quietHours.end
  }

  /**
   * 获取默认渠道
   */
  private getDefaultChannels(type: MessageType): NotifyChannel[] {
    // 根据消息类型确定默认渠道
    switch (type) {
      case MessageType.APPROVAL:
        return [NotifyChannel.IN_APP, NotifyChannel.DINGTALK]
      case MessageType.REMINDER:
        return [NotifyChannel.IN_APP, NotifyChannel.DINGTALK, NotifyChannel.BROWSER]
      case MessageType.SYSTEM:
        return [NotifyChannel.IN_APP]
      case MessageType.NOTICE:
        return [NotifyChannel.IN_APP, NotifyChannel.EMAIL]
      case MessageType.TASK:
        return [NotifyChannel.IN_APP, NotifyChannel.DINGTALK]
      default:
        return [NotifyChannel.IN_APP]
    }
  }

  /**
   * 初始化默认模板
   */
  private async initDefaultTemplates(): Promise<void> {
    // 审批待办模板
    this.createTemplate({
      code: 'approval-pending',
      name: '审批待办通知',
      type: MessageType.APPROVAL,
      titleTemplate: '待审批: {{title}}',
      contentTemplate:
        '您有一条待审批事项 "{{title}}"，请及时处理。\n\n审批类型: {{businessType}}\n发起人: {{initiatorName}}\n\n点击查看详情。',
      dingtalkTemplate:
        '## 待审批通知\n\n**标题**: {{title}}\n\n**类型**: {{businessType}}\n\n**发起人**: {{initiatorName}}\n\n请及时处理审批事项。',
      variables: [
        { name: 'title', type: 'string', required: true },
        { name: 'businessType', type: 'string', required: true },
        { name: 'initiatorName', type: 'string', required: false },
      ],
    })

    // 审批结果模板
    this.createTemplate({
      code: 'approval-result',
      name: '审批结果通知',
      type: MessageType.APPROVAL,
      titleTemplate: '审批结果: {{title}}',
      contentTemplate:
        '您的审批申请 "{{title}}" 已{{result}}。\n\n审批人: {{approverName}}\n审批意见: {{comment}}',
      dingtalkTemplate:
        '## 审批结果\n\n**标题**: {{title}}\n\n**结果**: {{result}}\n\n**审批人**: {{approverName}}\n\n**意见**: {{comment}}',
      variables: [
        { name: 'title', type: 'string', required: true },
        { name: 'result', type: 'string', required: true },
        { name: 'approverName', type: 'string', required: false },
        { name: 'comment', type: 'string', required: false },
      ],
    })

    // 任务提醒模板
    this.createTemplate({
      code: 'task-reminder',
      name: '任务提醒通知',
      type: MessageType.REMINDER,
      titleTemplate: '任务提醒: {{taskName}}',
      contentTemplate: '任务 "{{taskName}}" 将在 {{dueTime}} 到期，请及时处理。',
      variables: [
        { name: 'taskName', type: 'string', required: true },
        { name: 'dueTime', type: 'string', required: true },
      ],
    })

    this.logger?.info('默认消息模板已创建')
  }

  /**
   * 初始化通道适配器
   */
  private initChannelAdapters(context: ModuleContext): void {
    // 站内消息适配器
    this.adapters.set(NotifyChannel.IN_APP, {
      channel: NotifyChannel.IN_APP,
      isConfigured: () => true,
      getConfig: () => ({ channel: NotifyChannel.IN_APP, enabled: true }),
      send: async (message, receiver) => {
        this.pushInAppMessage(receiver.userId, message)
        return { channel: NotifyChannel.IN_APP, success: true, sentAt: new Date() }
      },
    })

    // 钉钉适配器
    const dingtalk = context.serviceRegistry.get<any>('dingtalk')
    if (dingtalk) {
      this.adapters.set(NotifyChannel.DINGTALK, {
        channel: NotifyChannel.DINGTALK,
        isConfigured: () => true,
        getConfig: () => ({ channel: NotifyChannel.DINGTALK, enabled: true }),
        send: async (message, receiver) => {
          if (!receiver.dingtalkUserId) {
            return {
              channel: NotifyChannel.DINGTALK,
              success: false,
              error: '无钉钉用户ID',
              sentAt: new Date(),
            }
          }
          await dingtalk.sendWorkNotification({
            agentId: dingtalk.config.agentId,
            userIdList: [receiver.dingtalkUserId],
            msg: {
              msgtype: 'markdown',
              markdown: {
                title: message.title,
                text: message.content,
              },
            },
          })
          return { channel: NotifyChannel.DINGTALK, success: true, sentAt: new Date() }
        },
      })
    }

    // 邮件适配器 (需要配置SMTP)
    // TODO: 实现邮件适配器

    // 浏览器通知适配器
    this.adapters.set(NotifyChannel.BROWSER, {
      channel: NotifyChannel.BROWSER,
      isConfigured: () => true,
      getConfig: () => ({ channel: NotifyChannel.BROWSER, enabled: true }),
      send: async (message, receiver) => {
        // 浏览器通知通过WebSocket推送触发
        const connection = this.wsConnections.get(receiver.userId)
        if (connection) {
          connection.send(
            JSON.stringify({
              type: 'browser-notification',
              data: {
                title: message.title,
                body: message.content,
                icon: '/logo.png',
              },
            }),
          )
        }
        return { channel: NotifyChannel.BROWSER, success: true, sentAt: new Date() }
      },
    })

    this.logger?.info('通道适配器已初始化')
  }

  /**
   * 注册 WebSocket 服务
   */
  private registerWebSocketService(): void {
    // TODO: 注册WebSocket服务端点
    this.logger?.info('WebSocket 服务已注册')
  }

  /**
   * 关闭所有 WebSocket 连接
   */
  private closeAllWebSocketConnections(): void {
    for (const [userId, connection] of this.wsConnections) {
      try {
        connection.close()
      } catch (error) {
        this.logger?.error(`关闭WebSocket失败: ${userId}`, { error })
      }
    }
    this.wsConnections.clear()
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getRoutes(): ModuleRoute[] {
    return [
      // 消息发送
      {
        path: '/api/v1/notification/send',
        method: HttpMethod.POST,
        handler: 'notification.send',
        permission: 'notification:message:send',
        description: '发送通知消息',
      },
      {
        path: '/api/v1/notification/batch',
        method: HttpMethod.POST,
        handler: 'notification.sendBatch',
        permission: 'notification:message:send',
        description: '批量发送通知',
      },

      // 消息管理
      {
        path: '/api/v1/notification/messages',
        method: HttpMethod.GET,
        handler: 'notification.list',
        permission: 'notification:message:view',
        description: '获取我的消息',
      },
      {
        path: '/api/v1/notification/unread-count',
        method: HttpMethod.GET,
        handler: 'notification.unreadCount',
        permission: 'notification:message:view',
        description: '获取未读数量',
      },
      {
        path: '/api/v1/notification/read/:id',
        method: HttpMethod.POST,
        handler: 'notification.markRead',
        permission: 'notification:message:view',
        description: '标记已读',
      },
      {
        path: '/api/v1/notification/read-all',
        method: HttpMethod.POST,
        handler: 'notification.markAllRead',
        permission: 'notification:message:view',
        description: '全部已读',
      },
      {
        path: '/api/v1/notification/messages/:id',
        method: HttpMethod.DELETE,
        handler: 'notification.delete',
        permission: 'notification:message:delete',
        description: '删除消息',
      },

      // 模板管理
      {
        path: '/api/v1/notification/templates',
        method: HttpMethod.GET,
        handler: 'template.list',
        permission: 'notification:template:view',
        description: '获取模板列表',
      },
      {
        path: '/api/v1/notification/templates',
        method: HttpMethod.POST,
        handler: 'template.create',
        permission: 'notification:template:create',
        description: '创建模板',
      },
      {
        path: '/api/v1/notification/templates/:id',
        method: HttpMethod.GET,
        handler: 'template.get',
        permission: 'notification:template:view',
        description: '获取模板详情',
      },
      {
        path: '/api/v1/notification/templates/:id',
        method: HttpMethod.PUT,
        handler: 'template.update',
        permission: 'notification:template:update',
        description: '更新模板',
      },
      {
        path: '/api/v1/notification/templates/:id',
        method: HttpMethod.DELETE,
        handler: 'template.delete',
        permission: 'notification:template:delete',
        description: '删除模板',
      },

      // 偏好管理
      {
        path: '/api/v1/notification/preference',
        method: HttpMethod.GET,
        handler: 'preference.get',
        permission: 'notification:preference:view',
        description: '获取通知偏好',
      },
      {
        path: '/api/v1/notification/preference',
        method: HttpMethod.PUT,
        handler: 'preference.update',
        permission: 'notification:preference:update',
        description: '更新通知偏好',
      },
    ]
  }

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'notification:message:view',
        name: '查看消息',
        type: PermissionType.RESOURCE,
        resource: 'notification-message',
        action: 'view',
      },
      {
        id: 'notification:message:send',
        name: '发送消息',
        type: PermissionType.ACTION,
        resource: 'notification-message',
        action: 'send',
      },
      {
        id: 'notification:message:delete',
        name: '删除消息',
        type: PermissionType.RESOURCE,
        resource: 'notification-message',
        action: 'delete',
      },
      {
        id: 'notification:template:view',
        name: '查看模板',
        type: PermissionType.RESOURCE,
        resource: 'notification-template',
        action: 'view',
      },
      {
        id: 'notification:template:create',
        name: '创建模板',
        type: PermissionType.RESOURCE,
        resource: 'notification-template',
        action: 'create',
      },
      {
        id: 'notification:template:update',
        name: '编辑模板',
        type: PermissionType.RESOURCE,
        resource: 'notification-template',
        action: 'edit',
      },
      {
        id: 'notification:template:delete',
        name: '删除模板',
        type: PermissionType.RESOURCE,
        resource: 'notification-template',
        action: 'delete',
      },
      {
        id: 'notification:preference:view',
        name: '查看偏好',
        type: PermissionType.RESOURCE,
        resource: 'notification-preference',
        action: 'view',
      },
      {
        id: 'notification:preference:update',
        name: '更新偏好',
        type: PermissionType.RESOURCE,
        resource: 'notification-preference',
        action: 'edit',
      },
      {
        id: 'notification:admin',
        name: '通知管理员',
        type: PermissionType.ADMIN,
        resource: 'notification',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'notification',
        title: '消息中心',
        path: '/notification',
        icon: 'bell',
        order: 1,
        children: [
          {
            id: 'notification-messages',
            title: '我的消息',
            path: '/notification/messages',
            icon: 'mail',
            permissions: ['notification:message:view'],
            order: 1,
          },
          {
            id: 'notification-templates',
            title: '消息模板',
            path: '/notification/templates',
            icon: 'file-text',
            permissions: ['notification:template:view'],
            order: 2,
          },
          {
            id: 'notification-preference',
            title: '通知设置',
            path: '/notification/preference',
            icon: 'setting',
            permissions: ['notification:preference:view'],
            order: 3,
          },
        ],
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'notification.message.sent',
        type: EventType.BUSINESS_DATA,
        description: '消息发送事件',
      },
      {
        name: 'notification.message.read',
        type: EventType.USER_ACTION,
        description: '消息阅读事件',
      },
      {
        name: 'notification.template.created',
        type: EventType.BUSINESS_DATA,
        description: '模板创建事件',
      },
      {
        name: 'notification.preference.updated',
        type: EventType.USER_ACTION,
        description: '偏好更新事件',
      },
      {
        name: 'notification.module.started',
        type: EventType.MODULE_LIFECYCLE,
        description: 'Notification模块启动',
      },
      {
        name: 'notification.module.stopped',
        type: EventType.MODULE_LIFECYCLE,
        description: 'Notification模块停止',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export { NOTIFICATION_MODULE_MANIFEST as NOTIFICATION_MANIFEST }
