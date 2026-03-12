/**
 * 全局错误处理
 * 渔晓白 ⚙️ · 专业交付
 */

import { message } from 'antd'

export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical'

export interface AppError extends Error {
  code?: string
  requestId?: string
  level?: ErrorLevel
  details?: any
}

/**
 * 错误日志服务
 */
class ErrorLogger {
  private errorQueue: AppError[] = []
  private maxQueueSize = 100

  /**
   * 记录错误
   */
  log(error: AppError) {
    const errorWithMeta = {
      ...error,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    // 添加到队列
    this.errorQueue.push(errorWithMeta)
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }

    // 发送到错误收集服务
    this.sendToServer(errorWithMeta)

    // 控制台输出
    console.error('[App Error]', errorWithMeta)
  }

  /**
   * 发送到服务器
   */
  private async sendToServer(error: AppError & { timestamp: string; url: string; userAgent: string }) {
    try {
      // 使用 sendBeacon 保证错误日志发送
      const blob = new Blob([JSON.stringify(error)], { type: 'application/json' })
      navigator.sendBeacon('/api/error-log', blob)
    } catch (e) {
      // 降级处理
      this.saveToLocalStorage(error)
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToLocalStorage(error: any) {
    try {
      const key = 'error_logs'
      const logs = JSON.parse(localStorage.getItem(key) || '[]')
      logs.push(error)
      // 只保留最近 50 条
      localStorage.setItem(key, JSON.stringify(logs.slice(-50)))
    } catch (e) {
      // 忽略存储失败
    }
  }

  /**
   * 获取错误队列
   */
  getQueue(): AppError[] {
    return [...this.errorQueue]
  }

  /**
   * 清空队列
   */
  clear() {
    this.errorQueue = []
  }
}

/**
 * 全局错误处理器
 */
class ErrorHandler {
  private logger = new ErrorLogger()

  /**
   * 处理错误
   */
  handle(error: any, level: ErrorLevel = 'error') {
    const appError: AppError = {
      name: error.name || 'UnknownError',
      message: error.message || '未知错误',
      stack: error.stack,
      code: error.code,
      requestId: error.requestId,
      level,
      details: error.details,
    }

    // 记录错误
    this.logger.log(appError)

    // 用户提示
    this.showNotification(appError, level)

    // 严重错误上报
    if (level === 'critical') {
      this.reportCriticalError(appError)
    }
  }

  /**
   * 显示通知
   */
  private showNotification(error: AppError, level: ErrorLevel) {
    const config = {
      info: { duration: 3 },
      warning: { duration: 5 },
      error: { duration: 8 },
      critical: { duration: 10 },
    }

    const duration = config[level]?.duration || 5

    message[level === 'info' ? 'info' : level === 'warning' ? 'warning' : 'error'](
      {
        content: error.message,
        duration,
      },
    )
  }

  /**
   * 上报严重错误
   */
  private async reportCriticalError(error: AppError) {
    // 发送到告警系统
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'critical_error',
          error,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (e) {
      // 忽略上报失败
    }
  }

  /**
   * 获取错误统计
   */
  getStats() {
    const queue = this.logger.getQueue()
    const stats = {
      total: queue.length,
      byLevel: {
        info: queue.filter((e) => e.level === 'info').length,
        warning: queue.filter((e) => e.level === 'warning').length,
        error: queue.filter((e) => e.level === 'error').length,
        critical: queue.filter((e) => e.level === 'critical').length,
      },
      recent: queue.slice(-10),
    }
    return stats
  }
}

// 导出单例
export const errorHandler = new ErrorHandler()
export const errorLogger = new ErrorLogger()

/**
 * 捕获全局错误
 */
export function setupGlobalErrorHandler() {
  // 未捕获的异常
  window.addEventListener('error', (event) => {
    event.preventDefault()
    errorHandler.handle(event.error, 'critical')
  })

  // 未捕获的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault()
    errorHandler.handle(event.reason, 'error')
  })

  console.log('✅ 全局错误处理器已启动')
}

export default errorHandler
