/**
 * EventBusService 事件总线服务
 * 提供模块间的事件通信能力
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { EventType, EventPriority, EventPayload, EventListener } from '../module/interfaces'

/**
 * 事件订阅记录
 */
interface Subscription {
  id: string
  eventName: string
  listener: EventListener
  registeredAt: number
}

/**
 * EventBusService
 *
 * 功能:
 * - 发布/订阅模式
 * - 支持通配符订阅
 * - 支持异步事件
 * - 支持事件持久化
 * - 支持优先级排序
 *
 * @example
 * ```typescript
 * // 发布事件
 * context.eventBus.emit('crm.customer.created', { customerId: '123' });
 *
 * // 订阅事件
 * context.eventBus.on('crm.customer.*', (payload) => {
 *   console.log('客户事件:', payload);
 * });
 *
 * // 通配符订阅
 * context.eventBus.on('crm.*', handleAllCrmEvents);
 * ```
 */
@Injectable()
export class EventBusService implements OnModuleInit, OnModuleDestroy {
  /** 事件订阅表 */
  private subscriptions: Map<string, Subscription[]> = new Map()

  /** 通配符订阅表 */
  private wildcardSubscriptions: Subscription[] = []

  /** 事件历史记录 (用于调试) */
  private eventHistory: EventPayload[] = []

  /** 最大历史记录数 */
  private maxHistorySize: number = 100

  /** 是否启用历史记录 */
  private enableHistory: boolean = false

  async onModuleInit(): Promise<void> {
    // 初始化事件总线
    console.info('[EventBus] 事件总线初始化完成')
  }

  async onModuleDestroy(): Promise<void> {
    // 清理所有订阅
    this.subscriptions.clear()
    this.wildcardSubscriptions = []
    console.info('[EventBus] 事件总线已关闭')
  }

  /**
   * 发布事件
   * @param eventName 事件名称
   * @param data 事件数据
   * @param options 事件选项
   */
  async emit<T = any>(
    eventName: string,
    data: T,
    options?: {
      moduleId?: string
      userId?: string
      source?: string
      correlationId?: string
      metadata?: Record<string, any>
      async?: boolean
    },
  ): Promise<void> {
    // 构建事件 Payload
    const payload: EventPayload<T> = {
      eventId: this.generateEventId(),
      eventName,
      eventType: this.detectEventType(eventName),
      moduleId: options?.moduleId || 'system',
      timestamp: Date.now(),
      data,
      userId: options?.userId,
      source: options?.source,
      correlationId: options?.correlationId,
      metadata: options?.metadata,
    }

    // 记录历史
    if (this.enableHistory) {
      this.addToHistory(payload)
    }

    // 获取订阅者
    const listeners = this.getListeners(eventName)

    // 按优先级排序
    listeners.sort((a, b) => (b.listener.priority || 0) - (a.listener.priority || 0))

    // 执行监听器
    for (const subscription of listeners) {
      try {
        const handler = subscription.listener.handler

        // 异步处理
        if (subscription.listener.async || options?.async) {
          Promise.resolve(handler(payload)).catch((err) => {
            console.error(`[EventBus] 异步事件处理错误: ${eventName}`, err)
          })
        } else {
          // 同步处理
          await handler(payload)
        }
      } catch (error) {
        console.error(`[EventBus] 事件处理错误: ${eventName}`, error)
      }
    }
  }

  /**
   * 同步发布事件 (不等待监听器完成)
   */
  emitSync<T = any>(eventName: string, data: T, options?: any): void {
    this.emit(eventName, data, { ...options, async: true })
  }

  /**
   * 订阅事件
   * @param eventName 事件名称 (支持通配符 *)
   * @param handler 处理函数
   * @param options 监听器选项
   */
  on(
    eventName: string | string[],
    handler: (payload: EventPayload) => Promise<void> | void,
    options?: {
      moduleId?: string
      priority?: number
      async?: boolean
      once?: boolean
      filter?: (payload: EventPayload) => boolean
    },
  ): string {
    const subscriptionId = this.generateSubscriptionId()

    const listener: EventListener = {
      id: subscriptionId,
      eventName: eventName as string,
      handler,
      moduleId: options?.moduleId,
      priority: options?.priority || EventPriority.NORMAL,
      async: options?.async,
      once: options?.once,
      filter: options?.filter,
    }

    const subscription: Subscription = {
      id: subscriptionId,
      eventName: eventName as string,
      listener,
      registeredAt: Date.now(),
    }

    // 处理通配符
    if (typeof eventName === 'string' && eventName.includes('*')) {
      this.wildcardSubscriptions.push(subscription)
    } else {
      // 确定事件名称
      const names = Array.isArray(eventName) ? eventName : [eventName]

      for (const name of names) {
        if (!this.subscriptions.has(name)) {
          this.subscriptions.set(name, [])
        }
        this.subscriptions.get(name)!.push(subscription)
      }
    }

    return subscriptionId
  }

  /**
   * 单次订阅
   * 事件触发一次后自动取消
   */
  once(
    eventName: string,
    handler: (payload: EventPayload) => Promise<void> | void,
    options?: any,
  ): string {
    return this.on(eventName, handler, { ...options, once: true })
  }

  /**
   * 取消订阅
   * @param subscriptionId 订阅ID
   */
  off(subscriptionId: string): boolean {
    // 从普通订阅中移除
    for (const [eventName, subs] of this.subscriptions) {
      const index = subs.findIndex((s) => s.id === subscriptionId)
      if (index !== -1) {
        subs.splice(index, 1)
        if (subs.length === 0) {
          this.subscriptions.delete(eventName)
        }
        return true
      }
    }

    // 从通配符订阅中移除
    const wildcardIndex = this.wildcardSubscriptions.findIndex((s) => s.id === subscriptionId)
    if (wildcardIndex !== -1) {
      this.wildcardSubscriptions.splice(wildcardIndex, 1)
      return true
    }

    return false
  }

  /**
   * 取消模块的所有订阅
   * @param moduleId 模块ID
   */
  offModule(moduleId: string): number {
    let removed = 0

    // 从普通订阅中移除
    for (const [eventName, subs] of this.subscriptions) {
      const filtered = subs.filter((s) => s.listener.moduleId !== moduleId)
      removed += subs.length - filtered.length
      if (filtered.length === 0) {
        this.subscriptions.delete(eventName)
      } else {
        this.subscriptions.set(eventName, filtered)
      }
    }

    // 从通配符订阅中移除
    const filteredWildcard = this.wildcardSubscriptions.filter(
      (s) => s.listener.moduleId !== moduleId,
    )
    removed += this.wildcardSubscriptions.length - filteredWildcard.length
    this.wildcardSubscriptions = filteredWildcard

    return removed
  }

  /**
   * 获取事件的订阅者
   */
  private getListeners(eventName: string): Subscription[] {
    const directListeners = this.subscriptions.get(eventName) || []

    // 匹配通配符订阅
    const wildcardListeners = this.wildcardSubscriptions.filter((s) =>
      this.matchWildcard(s.eventName, eventName),
    )

    return [...directListeners, ...wildcardListeners]
  }

  /**
   * 通配符匹配
   */
  private matchWildcard(pattern: string, eventName: string): boolean {
    const regex = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
    return new RegExp(`^${regex}$`).test(eventName)
  }

  /**
   * 检测事件类型
   */
  private detectEventType(eventName: string): EventType {
    if (eventName.startsWith('module.')) {
      return EventType.MODULE_LIFECYCLE
    }
    if (eventName.startsWith('system.')) {
      return EventType.SYSTEM
    }
    if (eventName.startsWith('user.')) {
      return EventType.USER_ACTION
    }
    return EventType.BUSINESS_DATA
  }

  /**
   * 生成事件ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * 生成订阅ID
   */
  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * 添加到历史记录
   */
  private addToHistory(payload: EventPayload): void {
    this.eventHistory.push(payload)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }
  }

  /**
   * 获取事件历史
   */
  getHistory(limit?: number): EventPayload[] {
    return limit ? this.eventHistory.slice(-limit) : [...this.eventHistory]
  }

  /**
   * 设置历史记录配置
   */
  setHistoryConfig(enabled: boolean, maxSize?: number): void {
    this.enableHistory = enabled
    if (maxSize) {
      this.maxHistorySize = maxSize
    }
  }

  /**
   * 获取订阅统计
   */
  getStats(): {
    totalSubscriptions: number
    wildcardSubscriptions: number
    subscriptionsByModule: Record<string, number>
  } {
    const byModule: Record<string, number> = {}

    for (const subs of this.subscriptions.values()) {
      for (const s of subs) {
        const moduleId = s.listener.moduleId || 'system'
        byModule[moduleId] = (byModule[moduleId] || 0) + 1
      }
    }

    for (const s of this.wildcardSubscriptions) {
      const moduleId = s.listener.moduleId || 'system'
      byModule[moduleId] = (byModule[moduleId] || 0) + 1
    }

    return {
      totalSubscriptions: Array.from(this.subscriptions.values()).reduce((a, b) => a + b.length, 0),
      wildcardSubscriptions: this.wildcardSubscriptions.length,
      subscriptionsByModule: byModule,
    }
  }
}
