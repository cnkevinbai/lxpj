/**
 * Common 模块
 * 跨模块通用功能：报表中心、消息中心、数据字典、API文档中心、系统监控仪表盘
 */
import { Module } from '@nestjs/common'
import { ReportCenterController } from './report-center.controller'
import { ReportCenterService } from './report-center.service'
import { MessageCenterController } from './message-center.controller'
import { MessageCenterService } from './message-center.service'
import { DataDictionaryController } from './data-dictionary.controller'
import { DataDictionaryService } from './data-dictionary.service'
import { ApiDocCenterController } from './api-doc-center.controller'
import { ApiDocCenterService } from './api-doc-center.service'
import { SystemMonitorDashboardController } from './system-monitor-dashboard.controller'
import { SystemMonitorDashboardService } from './system-monitor-dashboard.service'

@Module({
  controllers: [
    ReportCenterController,
    MessageCenterController,
    DataDictionaryController,
    ApiDocCenterController,
    SystemMonitorDashboardController,
  ],
  providers: [
    ReportCenterService,
    MessageCenterService,
    DataDictionaryService,
    ApiDocCenterService,
    SystemMonitorDashboardService,
  ],
  exports: [
    ReportCenterService,
    MessageCenterService,
    DataDictionaryService,
    ApiDocCenterService,
    SystemMonitorDashboardService,
  ],
})
export class CommonModule {}
