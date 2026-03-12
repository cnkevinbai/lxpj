import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuditLog } from './entities/audit-log.entity'
import { ExportLimit, ExportRecord } from './entities/export-limit.entity'
import { AuditLogService } from './audit-log.service'
import { AuditLogController } from './audit-log.controller'

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog, ExportLimit, ExportRecord])],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
