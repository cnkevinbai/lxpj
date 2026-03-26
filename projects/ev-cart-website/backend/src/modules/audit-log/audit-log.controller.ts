import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { Roles } from '../../common/decorators/roles.decorator'
import { AuditLogService } from './services/audit-log.service'
import { ActionType, EntityType } from './entities/audit-log.entity'

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles('admin', 'manager')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('userId') userId?: string,
    @Query('entityType') entityType?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditLogService.findAll(page, limit, {
      userId,
      entityType,
      action,
      startDate,
      endDate,
    })
  }

  @Get('entity/:type/:id')
  async findByEntity(
    @Param('type') entityType: EntityType,
    @Param('id') entityId: string,
  ) {
    return this.auditLogService.findByEntity(entityType, entityId)
  }

  @Get('export-records')
  async getExportRecords(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('dataType') dataType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditLogService.getExportRecords(page, limit, {
      userId,
      status,
      dataType,
      startDate,
      endDate,
    })
  }

  @Post('export-records/:id/approve')
  @Roles('admin', 'manager')
  async approveExport(
    @Param('id') recordId: string,
    @Body('approved') approved: boolean,
    @Body('rejectReason') rejectReason?: string,
    @Request() req: any,
  ) {
    return this.auditLogService.approveExport(
      recordId,
      req.user.id,
      req.user.name,
      approved,
      rejectReason,
    )
  }

  @Post('export')
  async export(
    @Body() filters: any,
  ) {
    const data = await this.auditLogService.export(filters)
    return { success: true, data }
  }
}
