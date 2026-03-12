import { IsString, IsOptional, IsObject, IsEnum, IsIP } from 'class-validator'
import { ActionType, EntityType } from '../entities/audit-log.entity'

export class CreateAuditLogDto {
  @IsEnum(ActionType)
  action: ActionType

  @IsEnum(EntityType)
  entityType: EntityType

  @IsOptional()
  @IsString()
  entityId?: string

  @IsString()
  userId: string

  @IsString()
  userName: string

  @IsOptional()
  @IsObject()
  changes?: Record<string, any>

  @IsOptional()
  @IsString()
  remark?: string

  @IsIP()
  ip: string

  @IsOptional()
  @IsString()
  userAgent?: string
}

export class ExportLimitDto {
  @IsString()
  userId: string

  @IsString()
  dataType: 'customer' | 'lead' | 'opportunity' | 'order' | 'dealer' | 'all'

  @IsOptional()
  startDate?: string

  @IsOptional()
  endDate?: string

  recordCount?: number
}
