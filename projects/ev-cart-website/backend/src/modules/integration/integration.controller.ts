import { Controller, Post, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { IntegrationService } from './integration.service'

@ApiTags('integration')
@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('dingtalk/send')
  @ApiOperation({ summary: '发送钉钉消息' })
  sendDingTalk(@Body('webhook') webhook: string, @Body('content') content: any) {
    return this.integrationService.sendDingTalkMessage(webhook, content)
  }

  @Post('wecom/send')
  @ApiOperation({ summary: '发送企业微信消息' })
  sendWeCom(@Body('webhook') webhook: string, @Body('content') content: any) {
    return this.integrationService.sendWeComMessage(webhook, content)
  }

  @Post('feishu/send')
  @ApiOperation({ summary: '发送飞书消息' })
  sendFeishu(@Body('webhook') webhook: string, @Body('content') content: any) {
    return this.integrationService.sendFeishuMessage(webhook, content)
  }

  @Post('notify/lead')
  @ApiOperation({ summary: '新线索通知' })
  notifyLead(
    @Body('lead') lead: any,
    @Query('platform') platform: 'dingtalk' | 'wecom' | 'feishu',
    @Query('webhook') webhook: string,
  ) {
    return this.integrationService.notifyNewLead(lead, platform, webhook)
  }

  @Post('notify/order')
  @ApiOperation({ summary: '订单状态变更通知' })
  notifyOrder(
    @Body('order') order: any,
    @Query('platform') platform: 'dingtalk' | 'wecom' | 'feishu',
    @Query('webhook') webhook: string,
  ) {
    return this.integrationService.notifyOrderStatusChange(order, platform, webhook)
  }
}
