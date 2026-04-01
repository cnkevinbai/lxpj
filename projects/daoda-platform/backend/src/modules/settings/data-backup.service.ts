/**
 * 数据备份恢复服务
 * 定时备份、一键恢复、备份下载、备份管理
 */
import { Injectable } from '@nestjs/common'

// 备份类型枚举
export enum BackupType {
  FULL = 'FULL', // 全量备份
  INCREMENTAL = 'INCREMENTAL', // 增量备份
  DIFFERENTIAL = 'DIFFERENTIAL', // 差异备份
  SCHEMA = 'SCHEMA', // 结构备份
  DATA = 'DATA', // 数据备份
}

// 备份状态枚举
export enum BackupStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  VERIFYING = 'VERIFYING',
  VERIFIED = 'VERIFIED',
}

// 备份范围枚举
export enum BackupScope {
  ALL = 'ALL',
  CRM = 'CRM',
  ERP = 'ERP',
  Finance = 'Finance',
  HR = 'HR',
  CMS = 'CMS',
  Workflow = 'Workflow',
  Settings = 'Settings',
  Logs = 'Logs',
}

// 恢复状态枚举
export enum RestoreStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ROLLBACK = 'ROLLBACK',
}

// 备份存储类型枚举
export enum StorageType {
  LOCAL = 'LOCAL',
  S3 = 'S3',
  FTP = 'FTP',
  NAS = 'NAS',
  CLOUD = 'CLOUD',
}

// 备份计划接口
export interface BackupSchedule {
  id: string
  name: string
  backupType: BackupType
  scope: BackupScope[]
  storageType: StorageType
  storagePath: string
  schedule: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'HOURLY'
    time: string
    dayOfWeek?: number
    dayOfMonth?: number
  }
  retentionDays: number
  compression: boolean
  encryption: boolean
  enabled: boolean
  lastRunTime?: Date
  nextRunTime?: Date
  createdAt: Date
  updatedAt: Date
}

// 备份记录接口
export interface BackupRecord {
  id: string
  scheduleId?: string
  name: string
  backupType: BackupType
  scope: BackupScope[]
  storageType: StorageType
  storagePath: string
  fileName: string
  fileSize: number
  recordCount: number
  duration: number
  status: BackupStatus
  verifyStatus?: 'PENDING' | 'PASS' | 'FAIL'
  checksum?: string
  errorMessage?: string
  startedAt: Date
  completedAt?: Date
  createdBy?: string
  createdAt: Date
}

// 恢复记录接口
export interface RestoreRecord {
  id: string
  backupId: string
  backupName: string
  scope: BackupScope[]
  targetDatabase?: string
  overwrite: boolean
  status: RestoreStatus
  progress: number
  errorMessage?: string
  startedAt: Date
  completedAt?: Date
  restoredBy: string
  rollbackBackupId?: string
  createdAt: Date
}

// 备份存储接口
export interface BackupStorage {
  id: string
  name: string
  storageType: StorageType
  config: {
    path?: string
    endpoint?: string
    bucket?: string
    accessKey?: string
    secretKey?: string
    ftpHost?: string
    ftpUser?: string
    ftpPort?: number
  }
  totalSize: number
  usedSize: number
  availableSize: number
  backupCount: number
  status: 'ONLINE' | 'OFFLINE' | 'ERROR'
  lastCheckTime: Date
  createdAt: Date
}

@Injectable()
export class DataBackupService {
  private schedules: Map<string, BackupSchedule> = new Map()
  private records: Map<string, BackupRecord> = new Map()
  private restores: Map<string, RestoreRecord> = new Map()
  private storages: Map<string, BackupStorage> = new Map()

  constructor() {
    this.initMockData()
  }

  private initMockData() {
    // 初始化备份计划
    const mockSchedules: BackupSchedule[] = [
      {
        id: 'BS-001',
        name: '每日全量备份',
        backupType: BackupType.FULL,
        scope: [BackupScope.ALL],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/daily',
        schedule: { frequency: 'DAILY', time: '03:00' },
        retentionDays: 30,
        compression: true,
        encryption: true,
        enabled: true,
        lastRunTime: new Date('2026-03-31 03:00'),
        nextRunTime: new Date('2026-04-01 03:00'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'BS-002',
        name: 'CRM模块增量备份',
        backupType: BackupType.INCREMENTAL,
        scope: [BackupScope.CRM],
        storageType: StorageType.S3,
        storagePath: 's3://daoda-backup/crm',
        schedule: { frequency: 'HOURLY', time: '00' },
        retentionDays: 7,
        compression: true,
        encryption: false,
        enabled: true,
        lastRunTime: new Date('2026-03-31 12:00'),
        nextRunTime: new Date('2026-03-31 13:00'),
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date(),
      },
      {
        id: 'BS-003',
        name: '财务数据每日备份',
        backupType: BackupType.DATA,
        scope: [BackupScope.Finance],
        storageType: StorageType.NAS,
        storagePath: '/nas/finance-backup',
        schedule: { frequency: 'DAILY', time: '04:00' },
        retentionDays: 90,
        compression: true,
        encryption: true,
        enabled: true,
        lastRunTime: new Date('2026-03-31 04:00'),
        nextRunTime: new Date('2026-04-01 04:00'),
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date(),
      },
      {
        id: 'BS-004',
        name: '系统日志每周备份',
        backupType: BackupType.DATA,
        scope: [BackupScope.Logs],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/logs',
        schedule: { frequency: 'WEEKLY', time: '02:00', dayOfWeek: 0 },
        retentionDays: 365,
        compression: true,
        encryption: false,
        enabled: true,
        lastRunTime: new Date('2026-03-30 02:00'),
        nextRunTime: new Date('2026-04-06 02:00'),
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date(),
      },
      {
        id: 'BS-005',
        name: '数据库结构备份',
        backupType: BackupType.SCHEMA,
        scope: [BackupScope.ALL],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/schema',
        schedule: { frequency: 'MONTHLY', time: '01:00', dayOfMonth: 1 },
        retentionDays: 365,
        compression: false,
        encryption: false,
        enabled: true,
        lastRunTime: new Date('2026-03-01 01:00'),
        nextRunTime: new Date('2026-04-01 01:00'),
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'BS-006',
        name: 'CMS内容备份',
        backupType: BackupType.DATA,
        scope: [BackupScope.CMS],
        storageType: StorageType.CLOUD,
        storagePath: '/cloud/cms-backup',
        schedule: { frequency: 'DAILY', time: '05:00' },
        retentionDays: 60,
        compression: true,
        encryption: false,
        enabled: false,
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date(),
      },
    ]
    mockSchedules.forEach((s) => this.schedules.set(s.id, s))

    // 初始化备份记录
    const mockRecords: BackupRecord[] = [
      {
        id: 'BR-001',
        scheduleId: 'BS-001',
        name: '全量备份-2026-03-31',
        backupType: BackupType.FULL,
        scope: [BackupScope.ALL],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/daily',
        fileName: 'backup_20260331_030000.tar.gz',
        fileSize: 2048,
        recordCount: 50000,
        duration: 180,
        status: BackupStatus.COMPLETED,
        verifyStatus: 'PASS',
        checksum: 'sha256:abc123',
        startedAt: new Date('2026-03-31 03:00'),
        completedAt: new Date('2026-03-31 03:03'),
        createdBy: 'system',
        createdAt: new Date('2026-03-31 03:00'),
      },
      {
        id: 'BR-002',
        scheduleId: 'BS-002',
        name: 'CRM增量备份-2026-03-31-12',
        backupType: BackupType.INCREMENTAL,
        scope: [BackupScope.CRM],
        storageType: StorageType.S3,
        storagePath: 's3://daoda-backup/crm',
        fileName: 'crm_incremental_20260331_120000.tar.gz',
        fileSize: 128,
        recordCount: 500,
        duration: 30,
        status: BackupStatus.COMPLETED,
        verifyStatus: 'PASS',
        checksum: 'sha256:def456',
        startedAt: new Date('2026-03-31 12:00'),
        completedAt: new Date('2026-03-31 12:00:30'),
        createdBy: 'system',
        createdAt: new Date('2026-03-31 12:00'),
      },
      {
        id: 'BR-003',
        scheduleId: 'BS-003',
        name: '财务备份-2026-03-31',
        backupType: BackupType.DATA,
        scope: [BackupScope.Finance],
        storageType: StorageType.NAS,
        storagePath: '/nas/finance-backup',
        fileName: 'finance_20260331_040000.tar.gz',
        fileSize: 512,
        recordCount: 2000,
        duration: 60,
        status: BackupStatus.COMPLETED,
        verifyStatus: 'PASS',
        checksum: 'sha256:ghi789',
        startedAt: new Date('2026-03-31 04:00'),
        completedAt: new Date('2026-03-31 04:01'),
        createdBy: 'system',
        createdAt: new Date('2026-03-31 04:00'),
      },
      {
        id: 'BR-004',
        scheduleId: 'BS-001',
        name: '全量备份-2026-03-30',
        backupType: BackupType.FULL,
        scope: [BackupScope.ALL],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/daily',
        fileName: 'backup_20260330_030000.tar.gz',
        fileSize: 1980,
        recordCount: 48000,
        duration: 175,
        status: BackupStatus.COMPLETED,
        verifyStatus: 'PASS',
        checksum: 'sha256:jkl012',
        startedAt: new Date('2026-03-30 03:00'),
        completedAt: new Date('2026-03-30 03:02:55'),
        createdBy: 'system',
        createdAt: new Date('2026-03-30 03:00'),
      },
      {
        id: 'BR-005',
        name: '手动备份-CRM客户数据',
        backupType: BackupType.DATA,
        scope: [BackupScope.CRM],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/manual',
        fileName: 'manual_crm_customers_20260331.tar.gz',
        fileSize: 256,
        recordCount: 1000,
        duration: 45,
        status: BackupStatus.COMPLETED,
        verifyStatus: 'PASS',
        checksum: 'sha256:mno345',
        startedAt: new Date('2026-03-31 10:00'),
        completedAt: new Date('2026-03-31 10:00:45'),
        createdBy: 'U-001',
        createdAt: new Date('2026-03-31 10:00'),
      },
      {
        id: 'BR-006',
        scheduleId: 'BS-004',
        name: '日志备份-2026-03-30',
        backupType: BackupType.DATA,
        scope: [BackupScope.Logs],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/logs',
        fileName: 'logs_20260330_020000.tar.gz',
        fileSize: 1024,
        recordCount: 15000,
        duration: 90,
        status: BackupStatus.COMPLETED,
        verifyStatus: 'PASS',
        checksum: 'sha256:pqr678',
        startedAt: new Date('2026-03-30 02:00'),
        completedAt: new Date('2026-03-30 02:01:30'),
        createdBy: 'system',
        createdAt: new Date('2026-03-30 02:00'),
      },
      {
        id: 'BR-007',
        name: '手动备份-失败',
        backupType: BackupType.FULL,
        scope: [BackupScope.ALL],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/manual',
        fileName: 'manual_full_20260331_failed.tar.gz',
        fileSize: 0,
        recordCount: 0,
        duration: 15,
        status: BackupStatus.FAILED,
        errorMessage: '磁盘空间不足',
        startedAt: new Date('2026-03-31 11:00'),
        createdBy: 'U-002',
        createdAt: new Date('2026-03-31 11:00'),
      },
      {
        id: 'BR-008',
        scheduleId: 'BS-001',
        name: '全量备份-验证中',
        backupType: BackupType.FULL,
        scope: [BackupScope.ALL],
        storageType: StorageType.LOCAL,
        storagePath: '/backup/daily',
        fileName: 'backup_20260329_030000.tar.gz',
        fileSize: 1900,
        recordCount: 47000,
        duration: 170,
        status: BackupStatus.VERIFYING,
        startedAt: new Date('2026-03-29 03:00'),
        completedAt: new Date('2026-03-29 03:02:50'),
        createdBy: 'system',
        createdAt: new Date('2026-03-29 03:00'),
      },
    ]
    mockRecords.forEach((r) => this.records.set(r.id, r))

    // 初始化恢复记录
    const mockRestores: RestoreRecord[] = [
      {
        id: 'RR-001',
        backupId: 'BR-004',
        backupName: '全量备份-2026-03-30',
        scope: [BackupScope.CRM],
        overwrite: true,
        status: RestoreStatus.COMPLETED,
        progress: 100,
        startedAt: new Date('2026-03-31 08:00'),
        completedAt: new Date('2026-03-31 08:05'),
        restoredBy: 'U-003',
        createdAt: new Date('2026-03-31 08:00'),
      },
      {
        id: 'RR-002',
        backupId: 'BR-003',
        backupName: '财务备份-2026-03-31',
        scope: [BackupScope.Finance],
        overwrite: false,
        status: RestoreStatus.COMPLETED,
        progress: 100,
        startedAt: new Date('2026-03-31 09:00'),
        completedAt: new Date('2026-03-31 09:02'),
        restoredBy: 'U-004',
        createdAt: new Date('2026-03-31 09:00'),
      },
      {
        id: 'RR-003',
        backupId: 'BR-005',
        backupName: '手动备份-CRM客户数据',
        scope: [BackupScope.CRM],
        overwrite: true,
        status: RestoreStatus.RUNNING,
        progress: 60,
        startedAt: new Date('2026-03-31 14:00'),
        restoredBy: 'U-001',
        createdAt: new Date('2026-03-31 14:00'),
      },
      {
        id: 'RR-004',
        backupId: 'BR-007',
        backupName: '手动备份-失败',
        scope: [BackupScope.ALL],
        overwrite: false,
        status: RestoreStatus.FAILED,
        progress: 0,
        errorMessage: '备份文件损坏',
        startedAt: new Date('2026-03-31 12:00'),
        restoredBy: 'U-002',
        createdAt: new Date('2026-03-31 12:00'),
      },
    ]
    mockRestores.forEach((r) => this.restores.set(r.id, r))

    // 初始化存储配置
    const mockStorages: BackupStorage[] = [
      {
        id: 'ST-001',
        name: '本地存储',
        storageType: StorageType.LOCAL,
        config: { path: '/backup' },
        totalSize: 500,
        usedSize: 150,
        availableSize: 350,
        backupCount: 30,
        status: 'ONLINE',
        lastCheckTime: new Date(),
        createdAt: new Date('2026-01-01'),
      },
      {
        id: 'ST-002',
        name: 'AWS S3存储',
        storageType: StorageType.S3,
        config: {
          endpoint: 'https://s3.amazonaws.com',
          bucket: 'daoda-backup',
          accessKey: 'AKIA***',
          secretKey: '***',
        },
        totalSize: 1000,
        usedSize: 50,
        availableSize: 950,
        backupCount: 12,
        status: 'ONLINE',
        lastCheckTime: new Date(),
        createdAt: new Date('2026-02-01'),
      },
      {
        id: 'ST-003',
        name: 'NAS存储',
        storageType: StorageType.NAS,
        config: { path: '/nas/backup' },
        totalSize: 2000,
        usedSize: 200,
        availableSize: 1800,
        backupCount: 15,
        status: 'ONLINE',
        lastCheckTime: new Date(),
        createdAt: new Date('2026-02-15'),
      },
      {
        id: 'ST-004',
        name: '云存储',
        storageType: StorageType.CLOUD,
        config: { endpoint: 'https://cloud.storage.com', bucket: 'daoda-cloud-backup' },
        totalSize: 500,
        usedSize: 0,
        availableSize: 500,
        backupCount: 0,
        status: 'OFFLINE',
        lastCheckTime: new Date(),
        createdAt: new Date('2026-03-01'),
      },
    ]
    mockStorages.forEach((s) => this.storages.set(s.id, s))
  }

  // 获取备份计划列表
  async getSchedules(params?: { enabled?: boolean }) {
    let schedules = Array.from(this.schedules.values())
    if (params?.enabled !== undefined)
      schedules = schedules.filter((s) => s.enabled === params.enabled)
    return schedules.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  // 创建备份计划
  async createSchedule(data: Omit<BackupSchedule, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = `BS-${String(this.schedules.size + 1).padStart(3, '0')}`
    const schedule: BackupSchedule = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.schedules.set(id, schedule)
    return schedule
  }

  // 更新备份计划
  async updateSchedule(id: string, data: Partial<BackupSchedule>) {
    const schedule = this.schedules.get(id)
    if (!schedule) throw new Error('备份计划不存在')
    Object.assign(schedule, data, { updatedAt: new Date() })
    return schedule
  }

  // 获取备份记录列表
  async getRecords(params?: {
    scheduleId?: string
    backupType?: BackupType
    scope?: BackupScope
    status?: BackupStatus
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    let records = Array.from(this.records.values())

    if (params?.scheduleId) records = records.filter((r) => r.scheduleId === params.scheduleId)
    if (params?.backupType) records = records.filter((r) => r.backupType === params.backupType)
    if (params?.scope) records = records.filter((r) => r.scope.includes(params.scope!))
    if (params?.status) records = records.filter((r) => r.status === params.status)
    if (params?.startDate) records = records.filter((r) => r.createdAt >= params.startDate!)
    if (params?.endDate) records = records.filter((r) => r.createdAt <= params.endDate!)

    records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = records.length
    const list = records.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  // 创建手动备份
  async createManualBackup(params: {
    name: string
    backupType: BackupType
    scope: BackupScope[]
    storageType: StorageType
    storagePath: string
    createdBy: string
  }) {
    const id = `BR-${String(this.records.size + 1).padStart(3, '0')}`
    const record: BackupRecord = {
      id,
      name: params.name,
      backupType: params.backupType,
      scope: params.scope,
      storageType: params.storageType,
      storagePath: params.storagePath,
      fileName: `manual_${params.name}_${Date.now()}.tar.gz`,
      fileSize: 0,
      recordCount: 0,
      duration: 0,
      status: BackupStatus.PENDING,
      startedAt: new Date(),
      createdBy: params.createdBy,
      createdAt: new Date(),
    }
    this.records.set(id, record)

    // 模拟备份过程
    setTimeout(() => {
      record.status = BackupStatus.RUNNING
      setTimeout(() => {
        record.status = BackupStatus.COMPLETED
        record.fileSize = Math.floor(Math.random() * 500) + 100
        record.recordCount = Math.floor(Math.random() * 1000) + 100
        record.duration = Math.floor(Math.random() * 60) + 30
        record.completedAt = new Date()
        record.verifyStatus = 'PASS'
        record.checksum = `sha256:${Math.random().toString(36).substring(7)}`
      }, 2000)
    }, 1000)

    return record
  }

  // 取消备份
  async cancelBackup(id: string) {
    const record = this.records.get(id)
    if (!record) throw new Error('备份记录不存在')
    if (record.status === BackupStatus.COMPLETED) throw new Error('已完成的备份无法取消')
    record.status = BackupStatus.CANCELLED
    return record
  }

  // 验证备份
  async verifyBackup(id: string) {
    const record = this.records.get(id)
    if (!record) throw new Error('备份记录不存在')
    if (record.status !== BackupStatus.COMPLETED) throw new Error('只能验证已完成的备份')
    record.status = BackupStatus.VERIFYING
    // 模拟验证
    setTimeout(() => {
      record.verifyStatus = 'PASS'
      record.status = BackupStatus.VERIFIED
    }, 1000)
    return record
  }

  // 获取恢复记录列表
  async getRestoreRecords(params?: {
    backupId?: string
    status?: RestoreStatus
    startDate?: Date
    endDate?: Date
  }) {
    let restores = Array.from(this.restores.values())

    if (params?.backupId) restores = restores.filter((r) => r.backupId === params.backupId)
    if (params?.status) restores = restores.filter((r) => r.status === params.status)
    if (params?.startDate) restores = restores.filter((r) => r.createdAt >= params.startDate!)
    if (params?.endDate) restores = restores.filter((r) => r.createdAt <= params.endDate!)

    restores.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    return restores
  }

  // 创建恢复任务
  async createRestore(params: {
    backupId: string
    scope?: BackupScope[]
    overwrite?: boolean
    restoredBy: string
  }) {
    const backup = this.records.get(params.backupId)
    if (!backup) throw new Error('备份记录不存在')
    if (backup.status !== BackupStatus.COMPLETED && backup.status !== BackupStatus.VERIFIED) {
      throw new Error('备份文件未完成验证')
    }

    const id = `RR-${String(this.restores.size + 1).padStart(3, '0')}`
    const restore: RestoreRecord = {
      id,
      backupId: params.backupId,
      backupName: backup.name,
      scope: params.scope || backup.scope,
      overwrite: params.overwrite || false,
      status: RestoreStatus.PENDING,
      progress: 0,
      startedAt: new Date(),
      restoredBy: params.restoredBy,
      createdAt: new Date(),
    }
    this.restores.set(id, restore)

    // 模拟恢复过程
    setTimeout(() => {
      restore.status = RestoreStatus.RUNNING
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        restore.progress = progress
        if (progress >= 100) {
          clearInterval(interval)
          restore.status = RestoreStatus.COMPLETED
          restore.completedAt = new Date()
        }
      }, 500)
    }, 500)

    return restore
  }

  // 取消恢复
  async cancelRestore(id: string) {
    const restore = this.restores.get(id)
    if (!restore) throw new Error('恢复记录不存在')
    if (restore.status === RestoreStatus.COMPLETED) throw new Error('已完成的恢复无法取消')
    restore.status = RestoreStatus.FAILED
    restore.errorMessage = '用户取消'
    return restore
  }

  // 获取存储配置列表
  async getStorages() {
    return Array.from(this.storages.values())
  }

  // 创建存储配置
  async createStorage(
    data: Omit<BackupStorage, 'id' | 'usedSize' | 'backupCount' | 'lastCheckTime' | 'createdAt'>,
  ) {
    const id = `ST-${String(this.storages.size + 1).padStart(3, '0')}`
    const storage: BackupStorage = {
      id,
      ...data,
      usedSize: 0,
      backupCount: 0,
      lastCheckTime: new Date(),
      createdAt: new Date(),
    }
    this.storages.set(id, storage)
    return storage
  }

  // 获取备份统计
  async getBackupStatistics() {
    const records = Array.from(this.records.values())
    const schedules = Array.from(this.schedules.values())
    const storages = Array.from(this.storages.values())

    return {
      totalBackups: records.length,
      completedBackups: records.filter((r) => r.status === BackupStatus.COMPLETED).length,
      failedBackups: records.filter((r) => r.status === BackupStatus.FAILED).length,
      pendingBackups: records.filter(
        (r) => r.status === BackupStatus.PENDING || r.status === BackupStatus.RUNNING,
      ).length,
      totalSize: records
        .filter((r) => r.status === BackupStatus.COMPLETED)
        .reduce((sum, r) => sum + r.fileSize, 0),
      totalRecords: records
        .filter((r) => r.status === BackupStatus.COMPLETED)
        .reduce((sum, r) => sum + r.recordCount, 0),
      activeSchedules: schedules.filter((s) => s.enabled).length,
      totalSchedules: schedules.length,
      storageUsed: storages.reduce((sum, s) => sum + s.usedSize, 0),
      storageAvailable: storages.reduce((sum, s) => sum + s.availableSize, 0),
      lastBackupTime: records
        .filter((r) => r.status === BackupStatus.COMPLETED)
        .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0]?.completedAt,
    }
  }

  // 下载备份
  async downloadBackup(id: string) {
    const record = this.records.get(id)
    if (!record) throw new Error('备份记录不存在')
    if (record.status !== BackupStatus.COMPLETED) throw new Error('备份文件未完成')

    return {
      fileName: record.fileName,
      fileSize: record.fileSize,
      downloadUrl: `${record.storagePath}/${record.fileName}`,
      checksum: record.checksum,
    }
  }

  // 删除备份记录
  async deleteBackup(id: string) {
    const record = this.records.get(id)
    if (!record) throw new Error('备份记录不存在')
    // 检查是否有恢复任务在使用此备份
    const restores = Array.from(this.restores.values()).filter(
      (r) => r.backupId === id && r.status === RestoreStatus.RUNNING,
    )
    if (restores.length > 0) throw new Error('有恢复任务正在使用此备份')
    this.records.delete(id)
    return { deleted: true, id }
  }
}
