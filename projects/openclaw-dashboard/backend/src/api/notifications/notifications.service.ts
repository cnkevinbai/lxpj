/**
 * 通知服务 - 管理系统通知
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取通知列表
   */
  async getNotifications(options: { limit?: number; unreadOnly?: boolean } = {}) {
    const { limit = 20, unreadOnly = false } = options;

    const where = unreadOnly ? { read: false } : {};

    const notifications = await this.prisma.notification.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { read: false },
    });

    return {
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        actionUrl: n.actionUrl,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    };
  }

  /**
   * 创建通知
   */
  async createNotification(data: {
    type: string;
    title: string;
    message?: string;
    actionUrl?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
      },
    });

    this.logger.log(`通知创建: [${data.type}] ${data.title}`);

    return notification;
  }

  /**
   * 标记为已读
   */
  async markAsRead(id: string) {
    const notification = await this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return notification;
  }

  /**
   * 标记所有为已读
   */
  async markAllAsRead() {
    const result = await this.prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });

    this.logger.log(`标记 ${result.count} 条通知为已读`);

    return { success: true, count: result.count };
  }

  /**
   * 删除通知
   */
  async deleteNotification(id: string) {
    await this.prisma.notification.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * 清空所有通知
   */
  async clearAll() {
    const result = await this.prisma.notification.deleteMany({});

    return { success: true, count: result.count };
  }

  /**
   * 获取未读数量
   */
  async getUnreadCount() {
    const count = await this.prisma.notification.count({
      where: { read: false },
    });

    return { count };
  }
}