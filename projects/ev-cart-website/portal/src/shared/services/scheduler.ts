import api from './api'

/**
 * 定时任务调度服务
 */
export const schedulerService = {
  // ==================== 任务管理 ====================
  
  /**
   * 创建定时任务
   */
  createTask: async (data: {
    name: string
    description?: string
    cronExpression: string
    handler: string
    params?: Record<string, any>
    enabled: boolean
    priority?: number
  }) => {
    return api.post('/scheduler/tasks', data)
  },

  /**
   * 获取定时任务列表
   */
  getTasks: async (params?: {
    page?: number
    pageSize?: number
    enabled?: boolean
    keyword?: string
  }) => {
    return api.get('/scheduler/tasks', { params })
  },

  /**
   * 获取定时任务详情
   */
  getTaskById: async (id: string) => {
    return api.get(`/scheduler/tasks/${id}`)
  },

  /**
   * 更新定时任务
   */
  updateTask: async (id: string, data: Partial<any>) => {
    return api.put(`/scheduler/tasks/${id}`, data)
  },

  /**
   * 启用定时任务
   */
  enableTask: async (id: string) => {
    return api.post(`/scheduler/tasks/${id}/enable`)
  },

  /**
   * 禁用定时任务
   */
  disableTask: async (id: string) => {
    return api.post(`/scheduler/tasks/${id}/disable`)
  },

  /**
   * 删除定时任务
   */
  deleteTask: async (id: string) => {
    return api.delete(`/scheduler/tasks/${id}`)
  },

  /**
   * 立即执行任务
   */
  runNow: async (id: string) => {
    return api.post(`/scheduler/tasks/${id}/run`)
  },

  /**
   * 获取下次执行时间
   */
  getNextRunTime: async (id: string) => {
    return api.get(`/scheduler/tasks/${id}/next-run`)
  },

  // ==================== 任务日志 ====================
  
  /**
   * 获取任务执行日志
   */
  getTaskLogs: async (taskId: string, params?: {
    page?: number
    pageSize?: number
    status?: 'success' | 'failed'
  }) => {
    return api.get(`/scheduler/tasks/${taskId}/logs`, { params })
  },

  /**
   * 获取任务执行统计
   */
  getTaskStatistics: async (taskId: string, params?: {
    startTime?: string
    endTime?: string
  }) => {
    return api.get(`/scheduler/tasks/${taskId}/statistics`, { params })
  },

  // ==================== 预设任务 ====================
  
  /**
   * 创建数据同步任务
   */
  createDataSyncTask: async (cronExpression: string, source: string, target: string) => {
    return schedulerService.createTask({
      name: `数据同步：${source} → ${target}`,
      description: `定时从 ${source} 同步数据到 ${target}`,
      cronExpression,
      handler: 'dataSyncHandler',
      params: { source, target },
      enabled: true,
    })
  },

  /**
   * 创建报表生成任务
   */
  createReportTask: async (cronExpression: string, reportType: string, recipients: string[]) => {
    return schedulerService.createTask({
      name: `报表生成：${reportType}`,
      description: `定时生成 ${reportType} 报表`,
      cronExpression,
      handler: 'reportHandler',
      params: { reportType, recipients },
      enabled: true,
    })
  },

  /**
   * 创建库存检查任务
   */
  createInventoryCheckTask: async (cronExpression: string) => {
    return schedulerService.createTask({
      name: '库存检查',
      description: '定时检查库存，生成预警',
      cronExpression,
      handler: 'inventoryCheckHandler',
      params: {},
      enabled: true,
    })
  },

  /**
   * 创建提醒通知任务
   */
  createReminderTask: async (cronExpression: string, reminderType: string, recipients: string[]) => {
    return schedulerService.createTask({
      name: `提醒通知：${reminderType}`,
      description: `定时发送 ${reminderType} 提醒`,
      cronExpression,
      handler: 'reminderHandler',
      params: { reminderType, recipients },
      enabled: true,
    })
  },

  /**
   * 创建数据备份任务
   */
  createBackupTask: async (cronExpression: string, backupType: 'full' | 'incremental') => {
    return schedulerService.createTask({
      name: `数据备份：${backupType}`,
      description: `定时执行 ${backupType} 备份`,
      cronExpression,
      handler: 'backupHandler',
      params: { backupType },
      enabled: true,
      priority: 10,
    })
  },
}

/**
 * Cron 表达式生成器
 */
export const CronExpression = {
  /**
   * 每天执行
   */
  daily: (hour: number = 0, minute: number = 0) => {
    return `${minute} ${hour} * * *`
  },

  /**
   * 每周执行
   */
  weekly: (dayOfWeek: number = 0, hour: number = 0, minute: number = 0) => {
    return `${minute} ${hour} * * ${dayOfWeek}`
  },

  /**
   * 每月执行
   */
  monthly: (dayOfMonth: number = 1, hour: number = 0, minute: number = 0) => {
    return `${minute} ${hour} ${dayOfMonth} * *`
  },

  /**
   * 每小时执行
   */
  hourly: (minute: number = 0) => {
    return `${minute} * * * *`
  },

  /**
   * 每 N 分钟执行
   */
  everyNMinutes: (minutes: number) => {
    return `*/${minutes} * * * *`
  },

  /**
   * 工作日执行
   */
  workdays: (hour: number = 9, minute: number = 0) => {
    return `${minute} ${hour} * * 1-5`
  },
}

/**
 * 常用定时任务配置
 */
export const CommonTasks = {
  /**
   * 每天凌晨 2 点数据同步
   */
  dailyDataSync: () => ({
    name: '每日数据同步',
    cronExpression: CronExpression.daily(2, 0),
    handler: 'dataSyncHandler',
  }),

  /**
   * 每天早上 8 点生成日报
   */
  dailyReport: () => ({
    name: '每日日报',
    cronExpression: CronExpression.daily(8, 0),
    handler: 'reportHandler',
    params: { reportType: 'daily' },
  }),

  /**
   * 每周一早上 9 点生成周报
   */
  weeklyReport: () => ({
    name: '每周周报',
    cronExpression: CronExpression.weekly(1, 9, 0),
    handler: 'reportHandler',
    params: { reportType: 'weekly' },
  }),

  /**
   * 每月 1 号生成月报
   */
  monthlyReport: () => ({
    name: '每月月报',
    cronExpression: CronExpression.monthly(1, 9, 0),
    handler: 'reportHandler',
    params: { reportType: 'monthly' },
  }),

  /**
   * 每 30 分钟检查库存
   */
  inventoryCheck: () => ({
    name: '库存检查',
    cronExpression: CronExpression.everyNMinutes(30),
    handler: 'inventoryCheckHandler',
  }),

  /**
   * 每天下午 5 点发送待办提醒
   */
  taskReminder: () => ({
    name: '待办提醒',
    cronExpression: CronExpression.daily(17, 0),
    handler: 'reminderHandler',
    params: { reminderType: 'task' },
  }),

  /**
   * 每周日凌晨 3 点全量备份
   */
  weeklyFullBackup: () => ({
    name: '每周全量备份',
    cronExpression: CronExpression.weekly(0, 3, 0),
    handler: 'backupHandler',
    params: { backupType: 'full' },
  }),

  /**
   * 每天凌晨 4 点增量备份
   */
  dailyIncrementalBackup: () => ({
    name: '每日增量备份',
    cronExpression: CronExpression.daily(4, 0),
    handler: 'backupHandler',
    params: { backupType: 'incremental' },
  }),
}

export default schedulerService
