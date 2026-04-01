/**
 * 消息中心控制器
 * API 接口：消息管理、通知推送、任务提醒、消息订阅
 */
import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common'
import { MessageCenterService, MessageType } from './message-center.service'

@Controller('api/common/message-center')
export class MessageCenterController {
  constructor(private readonly service: MessageCenterService) {}

  // ========== 消息模板 ==========

  @Get('templates')
  getTemplates(@Query('type') type?: string) {
    const typedType = type ? (type as MessageType) : undefined
    return this.service.getTemplates(typedType ? { type: typedType } : undefined)
  }

  @Get('templates/:id')
  getTemplate(@Param('id') id: string) {
    return this.service.getTemplate(id)
  }

  @Post('templates')
  createTemplate(@Body() template: any) {
    return this.service.createTemplate(template)
  }

  @Post('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateTemplate(id, updates)
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.service.deleteTemplate(id)
  }

  // ========== 消息发送 ==========

  @Post('send')
  sendMessage(@Body() params: any) {
    return this.service.sendMessage(params)
  }

  @Post('send-template')
  sendTemplateMessage(@Body() params: any) {
    return this.service.sendTemplateMessage(params)
  }

  @Post('broadcast')
  broadcastMessage(@Body() params: any) {
    return this.service.broadcastMessage(params)
  }

  // ========== 用户消息 ==========

  @Get('messages')
  getUserMessages(@Query() params: any) {
    return this.service.getUserMessages(params)
  }

  @Get('messages/:id')
  getMessage(@Param('id') id: string) {
    return this.service.getMessage(id)
  }

  @Post('messages/mark-read')
  markAsRead(@Body('userId') userId: string, @Body('messageIds') messageIds: string[]) {
    return this.service.markAsRead(userId, messageIds)
  }

  @Post('messages/mark-all-read')
  markAllAsRead(@Body('userId') userId: string) {
    return this.service.markAllAsRead(userId)
  }

  @Post('messages/archive')
  archiveMessage(@Body('userId') userId: string, @Body('messageIds') messageIds: string[]) {
    return this.service.archiveMessage(userId, messageIds)
  }

  @Delete('messages')
  deleteMessage(@Body('userId') userId: string, @Body('messageIds') messageIds: string[]) {
    return this.service.deleteMessage(userId, messageIds)
  }

  @Post('messages/:id/process')
  processMessage(
    @Param('id') messageId: string,
    @Body('userId') userId: string,
    @Body('actionResult') actionResult: any,
  ) {
    return this.service.processMessage(userId, messageId, actionResult)
  }

  // ========== 消息订阅 ==========

  @Get('subscriptions')
  getSubscriptions(@Query('userId') userId?: string) {
    return this.service.getSubscriptions(userId)
  }

  @Get('subscriptions/:id')
  getSubscription(@Param('id') id: string) {
    return this.service.getSubscription(id)
  }

  @Post('subscriptions')
  createSubscription(@Body() sub: any) {
    return this.service.createSubscription(sub)
  }

  @Post('subscriptions/:id')
  updateSubscription(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateSubscription(id, updates)
  }

  @Delete('subscriptions/:id')
  deleteSubscription(@Param('id') id: string) {
    return this.service.deleteSubscription(id)
  }

  // ========== 通知规则 ==========

  @Get('rules')
  getRules(@Query() params?: { type?: string; enabled?: boolean }) {
    const typedParams = params?.type ? { ...params, type: params.type as MessageType } : params
    return this.service.getRules(typedParams as any)
  }

  @Get('rules/:id')
  getRule(@Param('id') id: string) {
    return this.service.getRule(id)
  }

  @Post('rules')
  createRule(@Body() rule: any) {
    return this.service.createRule(rule)
  }

  @Post('rules/:id')
  updateRule(@Param('id') id: string, @Body() updates: any) {
    return this.service.updateRule(id, updates)
  }

  @Delete('rules/:id')
  deleteRule(@Param('id') id: string) {
    return this.service.deleteRule(id)
  }

  @Post('rules/:id/toggle')
  toggleRule(@Param('id') id: string, @Body('enabled') enabled: boolean) {
    return this.service.toggleRule(id, enabled)
  }

  // ========== 任务提醒 ==========

  @Get('reminders')
  getReminders(@Query('userId') userId?: string, @Query('status') status?: string) {
    return this.service.getReminders(userId, status as any)
  }

  @Post('reminders')
  createReminder(@Body() reminder: any) {
    return this.service.createReminder(reminder)
  }

  @Post('reminders/:id/cancel')
  cancelReminder(@Param('id') id: string) {
    return this.service.cancelReminder(id)
  }

  // ========== 统计 ==========

  @Get('stats')
  getStats(@Query('userId') userId: string) {
    return this.service.getStats(userId)
  }
}
