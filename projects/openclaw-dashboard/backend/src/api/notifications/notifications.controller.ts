/**
 * 通知控制器
 */

import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * 获取通知列表
   */
  @Get()
  @Public()
  async getNotifications(
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.notificationsService.getNotifications({
      limit: limit ? parseInt(limit) : 20,
      unreadOnly: unreadOnly === 'true',
    });
  }

  /**
   * 获取未读数量
   */
  @Get('unread-count')
  @Public()
  async getUnreadCount() {
    return this.notificationsService.getUnreadCount();
  }

  /**
   * 创建通知 (内部使用)
   */
  @Post()
  @Public()
  async createNotification(
    @Body() body: { type: string; title: string; message?: string; actionUrl?: string },
  ) {
    return this.notificationsService.createNotification(body);
  }

  /**
   * 标记为已读
   */
  @Post(':id/read')
  @Public()
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  /**
   * 标记所有为已读
   */
  @Post('read-all')
  @Public()
  async markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }

  /**
   * 删除通知
   */
  @Delete(':id')
  @Public()
  async deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  /**
   * 清空所有通知
   */
  @Delete()
  @Public()
  async clearAll() {
    return this.notificationsService.clearAll();
  }
}