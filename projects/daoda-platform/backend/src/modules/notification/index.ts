/**
 * Notification 通知提醒系统模块导出
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

// 模块导出
export { NotificationModule, NOTIFICATION_MANIFEST } from './notification.module'
export { NotificationNestModule } from './notification.nest.module'

// 类型导出
export {
  // 枚举
  MessageType,
  MessageCategory,
  MessageStatus,
  NotifyChannel,

  // 接口
  ReceiverInfo,
  NotificationMessage,
  SendResult,
  MessageTemplate,
  TemplateVariable,
  UserNotifyPreference,
  QuietHours,
  ChannelConfig,

  // DTO
  SendNotificationDto,
  BatchNotificationDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  PreferenceDto,
  MessageFilterDto,
} from './notification.module'
