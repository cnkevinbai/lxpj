/**
 * 数据备份恢复控制器
 * 定时备份、一键恢复、备份下载、备份管理 API
 */
import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common'
import {
  DataBackupService,
  BackupType,
  BackupStatus,
  RestoreStatus,
  BackupScope,
  StorageType,
} from './data-backup.service'

@Controller('api/settings/data-backup')
export class DataBackupController {
  constructor(private readonly service: DataBackupService) {}

  // ========== 备份计划 ==========

  @Get('schedules')
  async getSchedules(@Query('enabled') enabled?: string) {
    return this.service.getSchedules({ enabled: enabled === 'true' })
  }

  @Post('schedules')
  async createSchedule(
    @Body()
    data: {
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
    },
  ) {
    return this.service.createSchedule(data)
  }

  @Post('schedules/:id')
  async updateSchedule(
    @Param('id') id: string,
    @Body()
    data: Partial<{
      name: string
      backupType: BackupType
      scope: BackupScope[]
      storageType: StorageType
      storagePath: string
      schedule: any
      retentionDays: number
      compression: boolean
      encryption: boolean
      enabled: boolean
    }>,
  ) {
    return this.service.updateSchedule(id, data)
  }

  // ========== 备份记录 ==========

  @Get('records')
  async getRecords(
    @Query('status') status?: BackupStatus,
    @Query('backupType') backupType?: BackupType,
    @Query('scope') scope?: BackupScope,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.service.getRecords({
      status,
      backupType,
      scope,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      page,
      pageSize,
    })
  }

  // ========== 手动备份 ==========

  @Post('manual')
  async createManualBackup(
    @Body()
    params: {
      name: string
      backupType: BackupType
      scope: BackupScope[]
      storageType: StorageType
      storagePath: string
      createdBy: string
      compression?: boolean
      encryption?: boolean
    },
  ) {
    return this.service.createManualBackup(params)
  }

  @Post('records/:id/cancel')
  async cancelBackup(@Param('id') id: string) {
    return this.service.cancelBackup(id)
  }

  @Post('records/:id/verify')
  async verifyBackup(@Param('id') id: string) {
    return this.service.verifyBackup(id)
  }

  @Post('records/:id/download')
  async downloadBackup(@Param('id') id: string) {
    return this.service.downloadBackup(id)
  }

  @Delete('records/:id')
  async deleteBackup(@Param('id') id: string) {
    return this.service.deleteBackup(id)
  }

  // ========== 恢复记录 ==========

  @Get('restore-records')
  async getRestoreRecords(
    @Query('status') status?: RestoreStatus,
    @Query('backupId') backupId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.getRestoreRecords({
      status,
      backupId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    })
  }

  @Post('restore')
  async createRestore(
    @Body()
    params: {
      backupId: string
      scope?: BackupScope[]
      overwrite?: boolean
      restoredBy: string
    },
  ) {
    return this.service.createRestore(params)
  }

  @Post('restore-records/:id/cancel')
  async cancelRestore(@Param('id') id: string) {
    return this.service.cancelRestore(id)
  }

  // ========== 存储管理 ==========

  @Get('storages')
  async getStorages() {
    return this.service.getStorages()
  }

  @Post('storages')
  async createStorage(
    @Body()
    data: {
      name: string
      storageType: StorageType
      config: Record<string, any>
      path: string
      status: string
      totalSize: number
      availableSize: number
    },
  ) {
    return this.service.createStorage(data as any)
  }

  // ========== 统计 ==========

  @Get('statistics')
  async getBackupStatistics() {
    return this.service.getBackupStatistics()
  }
}
