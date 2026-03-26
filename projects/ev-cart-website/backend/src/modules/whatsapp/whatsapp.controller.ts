import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { WhatsAppService } from './services/whatsapp.service'
import { Request, Response } from 'express'

@ApiTags('whatsapp')
@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @Post('send')
  @ApiOperation({ summary: '发送 WhatsApp 消息' })
  async sendMessage(
    @Body() dto: {
      to: string
      content: string
      type?: 'text' | 'template' | 'image' | 'video' | 'document'
      templateName?: string
      language?: string
      mediaUrl?: string
      caption?: string
    },
  ) {
    if (dto.type === 'template') {
      return this.whatsappService.sendTemplateMessage(
        {
          name: dto.templateName || '',
          language: dto.language || 'en',
        },
        dto.to,
      )
    } else if (dto.type && ['image', 'video', 'document'].includes(dto.type)) {
      return this.whatsappService.sendMediaMessage(
        dto.to,
        dto.type as any,
        dto.mediaUrl || '',
        dto.caption,
      )
    } else {
      return this.whatsappService.sendTextMessage(dto.to, dto.content)
    }
  }

  @Post('send/order-confirmation')
  @ApiOperation({ summary: '发送订单确认' })
  async sendOrderConfirmation(
    @Body() dto: {
      to: string
      orderNo: string
      customerName: string
      totalAmount: number
      currency: string
    },
  ) {
    return this.whatsappService.sendOrderConfirmation(
      dto.to,
      dto.orderNo,
      dto.customerName,
      dto.totalAmount,
      dto.currency,
    )
  }

  @Post('send/followup')
  @ApiOperation({ summary: '发送跟进提醒' })
  async sendFollowUp(
    @Body() dto: {
      to: string
      customerName: string
      followUpContent: string
      followUpDate: string
    },
  ) {
    return this.whatsappService.sendFollowUpReminder(
      dto.to,
      dto.customerName,
      dto.followUpContent,
      dto.followUpDate,
    )
  }

  // Webhook 相关（无需 JWT 验证）
  @Get('webhook')
  async verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN
    if (this.whatsappService.verifyWebhook(mode, token, verifyToken || '')) {
      return parseInt(challenge)
    }
    return 'Forbidden'
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.whatsappService.handleWebhookMessage(req.body)
    res.status(200).send('EVENT_RECEIVED')
  }
}
