/**
 * LoggerService 日志服务
 * 提供模块级别的日志记录能力
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { Injectable, Scope } from '@nestjs/common'

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * 日志条目结构
 */
export interface LogEntry {
  /** 日志级别 */
  level: LogLevel
  /** 日志消息 */
  message: string
  /** 模块ID */
  moduleId?: string
  /** 时间戳 */
  timestamp: number
  /** 附加数据 */
  data?: Record<string, any>
  /** 错误信息 */
  error?: Error
  /** 请求ID */
  requestId?: string
  /** 用户ID */
  userId?: string
  /** 执行时间 (ms) */
  duration?: number
}

/**
 * LoggerService
 *
 * 支持模块级别的日志记录:
 * - 自动添加模块标识
 * - 支持结构化日志
 * - 支持日志分级
 * - 支持请求追踪
 *
 * @example
 * ```typescript
 * // 在模块中使用
 * context.logger.info('客户创建成功', { customerId: '123' });
 * context.logger.error('数据库连接失败', error);
 * context.logger.debug('查询参数', { params: req.query });
 * ```
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private moduleId: string = 'core'
  private minLevel: LogLevel = LogLevel.INFO
  private requestId?: string
  private userId?: string

  /**
   * 设置模块ID
   */
  setModuleId(moduleId: string): void {
    this.moduleId = moduleId
  }

  /**
   * 设置请求ID (用于追踪)
   */
  setRequestId(requestId: string): void {
    this.requestId = requestId
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string): void {
    this.userId = userId
  }

  /**
   * 设置最小日志级别
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level
  }

  /**
   * 创建日志条目
   */
  private createEntry(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      level,
      message,
      moduleId: this.moduleId,
      timestamp: Date.now(),
      data,
      error,
      requestId: this.requestId,
      userId: this.userId,
    }
  }

  /**
   * 输出日志
   */
  private output(entry: LogEntry): void {
    // 根据级别过滤
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL]
    if (levels.indexOf(entry.level) < levels.indexOf(this.minLevel)) {
      return
    }

    // 格式化输出
    const prefix = `[${entry.timestamp}] [${entry.moduleId}] [${entry.level.toUpperCase()}]`
    const message = entry.message

    // 根据级别选择输出方式
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, entry.data || '')
        break
      case LogLevel.INFO:
        console.info(prefix, message, entry.data || '')
        break
      case LogLevel.WARN:
        console.warn(prefix, message, entry.data || '')
        break
      case LogLevel.ERROR:
        console.error(prefix, message, entry.error || entry.data || '')
        break
      case LogLevel.FATAL:
        console.error(prefix, '[FATAL]', message, entry.error || entry.data || '')
        break
    }
  }

  /**
   * Debug 级别日志
   * 仅在开发环境输出详细调试信息
   */
  debug(message: string, data?: Record<string, any>): void {
    this.output(this.createEntry(LogLevel.DEBUG, message, data))
  }

  /**
   * Info 级别日志
   * 记录正常的业务操作信息
   */
  info(message: string, data?: Record<string, any>): void {
    this.output(this.createEntry(LogLevel.INFO, message, data))
  }

  /**
   * Warn 级别日志
   * 记录警告信息，不影响系统运行但需要注意
   */
  warn(message: string, data?: Record<string, any>): void {
    this.output(this.createEntry(LogLevel.WARN, message, data))
  }

  /**
   * Error 级别日志
   * 记录错误信息，需要关注和处理
   */
  error(message: string, error?: Error | Record<string, any>): void {
    const isError = error instanceof Error
    this.output(
      this.createEntry(
        LogLevel.ERROR,
        message,
        isError ? undefined : error,
        isError ? error : undefined,
      ),
    )
  }

  /**
   * Fatal 级别日志
   * 记录致命错误，系统可能无法继续运行
   */
  fatal(message: string, error?: Error | Record<string, any>): void {
    const isError = error instanceof Error
    this.output(
      this.createEntry(
        LogLevel.FATAL,
        message,
        isError ? undefined : error,
        isError ? error : undefined,
      ),
    )
  }

  /**
   * 记录操作开始
   * 返回一个函数用于记录结束和耗时
   */
  startOperation(operation: string, data?: Record<string, any>): () => void {
    const startTime = Date.now()
    this.debug(`${operation} - 开始`, data)

    return () => {
      const duration = Date.now() - startTime
      this.debug(`${operation} - 完成`, { ...data, duration: `${duration}ms` })
    }
  }

  /**
   * 创建子日志器
   * 用于特定模块或功能的日志记录
   */
  createChildLogger(moduleId: string): LoggerService {
    const child = new LoggerService()
    child.setModuleId(moduleId)
    child.setMinLevel(this.minLevel)
    return child
  }
}
