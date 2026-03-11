import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, LessThanOrEqual } from 'typeorm'
import { Notification } from './entities/notification.entity'

/**
 * 通知服务
 * 支持多渠道通知
 */
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private repository: Repository<Notification>,
  ) {}

  /**
   * 创建站内通知
   */
  async createInternal(userId: string, title: string, content: string, link?: string) {
    const notification = this.repository.create({
      userId,
      type: 'internal',
      title,
      content,
      link,
    })
    return this.repository.save(notification)
  }

  /**
   * 获取用户通知列表
   */
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const [data, total] = await this.repository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return { data, total, page, limit }
  }

  /**
   * 获取未读通知数
   */
  async getUnreadCount(userId: string) {
    return this.repository.count({
      where: { userId, status: 'unread' },
    })
  }

  /**
   * 标记为已读
   */
  async markAsRead(id: string, userId: string) {
    await this.repository.update(
      { id, userId },
      { status: 'read', readAt: new Date() },
    )
  }

  /**
   * 全部标记为已读
   */
  async markAllAsRead(userId: string) {
    await this.repository.update(
      { userId, status: 'unread' },
      { status: 'read', readAt: new Date() },
    )
  }

  /**
   * 删除通知
   */
  async remove(id: string, userId: string) {
    await this.repository.delete({ id, userId })
  }

  /**
   * 清理 30 天前的通知
   */
  async cleanupOldNotifications() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await this.repository.delete({
      createdAt: LessThanOrEqual(thirtyDaysAgo),
      status: 'read',
    })
  }

  /**
   * 发送待跟进提醒
   */
  async sendFollowupReminder(userId: string, followupCount: number) {
    return this.createInternal(
      userId,
      '待跟进提醒',
      `您有 ${followupCount} 条待跟进记录，请及时处理`,
      '/crm/follow-up-logs',
    )
  }

  /**
   * 发送新询盘提醒
   */
  async sendNewInquiryAlert(userId: string, inquiryNo: string, customerName: string) {
    return this.createInternal(
      userId,
      '新询盘通知',
      `收到来自 ${customerName} 的新询盘 (${inquiryNo})`,
      `/crm/foreign-inquiries/${inquiryNo}`,
    )
  }

  /**
   * 发送订单状态变更提醒
   */
  async sendOrderStatusAlert(userId: string, orderNo: string, status: string) {
    return this.createInternal(
      userId,
      '订单状态变更',
      `订单 ${orderNo} 状态已更新为 ${status}`,
      `/crm/orders/${orderNo}`,
    )
  }
}
