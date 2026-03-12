/**
 * 操作日志记录器
 * 渔晓白 ⚙️ · 专业交付
 */

export interface ActionLog {
  id: string
  action: string
  module: string
  userId: string
  userName: string
  details?: Record<string, any>
  ip?: string
  userAgent?: string
  createdAt: Date
}

class ActionLoggerClass {
  private logs: ActionLog[] = []
  private maxLogs = 1000

  /**
   * 记录操作日志
   */
  log(action: string, module: string, details?: Record<string, any>) {
    const log: ActionLog = {
      id: this.generateId(),
      action,
      module,
      userId: this.getCurrentUserId(),
      userName: this.getCurrentUserName(),
      details,
      ip: this.getIP(),
      userAgent: navigator.userAgent,
      createdAt: new Date()
    }

    this.logs.unshift(log)

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // 异步发送到后端
    this.sendToServer(log)

    return log
  }

  /**
   * 获取日志列表
   */
  getLogs(filters?: {
    module?: string
    action?: string
    userId?: string
    startDate?: Date
    endDate?: Date
  }): ActionLog[] {
    let logs = [...this.logs]

    if (filters?.module) {
      logs = logs.filter(log => log.module === filters.module)
    }

    if (filters?.action) {
      logs = logs.filter(log => log.action === filters.action)
    }

    if (filters?.userId) {
      logs = logs.filter(log => log.userId === filters.userId)
    }

    if (filters?.startDate) {
      logs = logs.filter(log => log.createdAt >= filters.startDate!)
    }

    if (filters?.endDate) {
      logs = logs.filter(log => log.createdAt <= filters.endDate!)
    }

    return logs
  }

  /**
   * 导出日志
   */
  exportLogs(format: 'json' | 'csv' = 'csv'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2)
    }

    // CSV 格式
    const headers = ['ID', '操作', '模块', '用户', '时间', '详情']
    const rows = this.logs.map(log => [
      log.id,
      log.action,
      log.module,
      log.userName,
      log.createdAt.toISOString(),
      JSON.stringify(log.details || {})
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  /**
   * 清空日志
   */
  clear() {
    this.logs = []
  }

  /**
   * 生成 ID
   */
  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  }

  /**
   * 获取当前用户 ID
   */
  private getCurrentUserId(): string {
    // TODO: 从用户状态获取
    return 'unknown'
  }

  /**
   * 获取当前用户名
   */
  private getCurrentUserName(): string {
    // TODO: 从用户状态获取
    return '未知用户'
  }

  /**
   * 获取 IP 地址
   */
  private getIP(): string {
    // TODO: 从后端获取
    return 'unknown'
  }

  /**
   * 发送到后端
   */
  private async sendToServer(log: ActionLog) {
    try {
      // TODO: 发送到后端 API
      console.log('Action log:', log)
    } catch (error) {
      console.error('Send log error:', error)
    }
  }
}

// 导出单例
export const ActionLogger = new ActionLoggerClass()
export default ActionLogger

// 快捷方法
export function logAction(action: string, module: string, details?: Record<string, any>) {
  return ActionLogger.log(action, module, details)
}
