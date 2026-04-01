/**
 * Notification NestJS 包装器
 * 将热插拔模块包装为 NestJS 模块
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import {
  Module,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
} from '@nestjs/common'
import {
  NotificationModule,
  NOTIFICATION_MODULE_MANIFEST,
  MessageType,
} from './notification.module'
import {
  SendNotificationDto,
  BatchNotificationDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  PreferenceDto,
  MessageFilterDto,
} from './notification.module'

// ============================================
// 通知消息控制器
// ============================================

@Controller('api/v1/notification')
class NotificationController {
  constructor(private readonly notificationModule: NotificationModule) {}

  @Post('send')
  async send(@Body() body: SendNotificationDto, @Request() req: any) {
    return this.notificationModule.send({ ...body, senderId: req.user?.id })
  }

  @Post('batch')
  async sendBatch(@Body() body: BatchNotificationDto) {
    return this.notificationModule.sendBatch(body)
  }

  @Get('messages')
  async list(@Query() query: MessageFilterDto, @Request() req: any) {
    return this.notificationModule.getMyMessages(req.user?.id, query)
  }

  @Get('unread-count')
  async unreadCount(@Request() req: any) {
    const count = this.notificationModule.getUnreadCount(req.user?.id)
    return { count }
  }

  @Post('read/:id')
  async markRead(@Param('id') id: string, @Request() req: any) {
    this.notificationModule.markAsRead(id, req.user?.id)
    return { success: true }
  }

  @Post('read-all')
  async markAllRead(@Request() req: any) {
    this.notificationModule.markAllAsRead(req.user?.id)
    return { success: true }
  }

  @Delete('messages/:id')
  async delete(@Param('id') id: string, @Request() req: any) {
    this.notificationModule.deleteMessage(id, req.user?.id)
    return { success: true }
  }
}

// ============================================
// 模板管理控制器
// ============================================

@Controller('api/v1/notification/templates')
class TemplateController {
  constructor(private readonly notificationModule: NotificationModule) {}

  @Get()
  async list(@Query() query: { type?: string; isActive?: boolean }) {
    // 将 string 类型转换为 MessageType
    const filter = {
      ...query,
      type: query.type as MessageType | undefined,
    }
    return this.notificationModule.listTemplates(filter)
  }

  @Post()
  async create(@Body() body: CreateTemplateDto) {
    return this.notificationModule.createTemplate(body)
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.notificationModule.getTemplate(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTemplateDto) {
    return this.notificationModule.updateTemplate(id, body)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    // TODO: 实现删除逻辑
    return { success: true }
  }
}

// ============================================
// 偏好管理控制器
// ============================================

@Controller('api/v1/notification/preference')
class PreferenceController {
  constructor(private readonly notificationModule: NotificationModule) {}

  @Get()
  async get(@Request() req: any) {
    return this.notificationModule.getPreference(req.user?.id)
  }

  @Put()
  async update(@Body() body: PreferenceDto, @Request() req: any) {
    return this.notificationModule.setPreference(req.user?.id, body)
  }
}

// ============================================
// NestJS 模块定义
// ============================================

@Module({
  controllers: [NotificationController, TemplateController, PreferenceController],
  providers: [NotificationModule],
  exports: [NotificationModule],
})
export class NotificationNestModule {
  readonly manifest = NOTIFICATION_MODULE_MANIFEST
}
