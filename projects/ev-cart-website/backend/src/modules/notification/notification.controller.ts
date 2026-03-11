import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { NotificationService } from './notification.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: '获取通知列表' })
  getNotifications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    // userId 从 JWT token 获取
    return this.notificationService.getUserNotifications('user-id', page, limit)
  }

  @Get('unread-count')
  @ApiOperation({ summary: '获取未读通知数' })
  getUnreadCount() {
    return this.notificationService.getUnreadCount('user-id')
  }

  @Post(':id/read')
  @ApiOperation({ summary: '标记为已读' })
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id, 'user-id')
  }

  @Post('read-all')
  @ApiOperation({ summary: '全部标记为已读' })
  markAllAsRead() {
    return this.notificationService.markAllAsRead('user-id')
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除通知' })
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id, 'user-id')
  }
}
