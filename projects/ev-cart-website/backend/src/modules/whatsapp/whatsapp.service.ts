import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface WhatsAppMessageDto {
  to: string // 接收者手机号（带国家码，如 +8613800138000）
  content: string
  templateName?: string // 模板消息名称
  language?: string // 模板语言
}

export interface WhatsAppTemplateDto {
  name: string
  language: string
  components?: Array<{
    type: string
    parameters: Array<{
      type: string
      text?: string
    }>
  }>
}

@Injectable()
export class WhatsAppService {
  private readonly apiUrl: string
  private readonly accessToken: string
  private readonly phoneNumberId: string

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get('WHATSAPP_API_URL', 'https://graph.facebook.com/v18.0')
    this.accessToken = this.configService.get('WHATSAPP_ACCESS_TOKEN', '')
    this.phoneNumberId = this.configService.get('WHATSAPP_PHONE_NUMBER_ID', '')
  }

  /**
   * 发送文本消息
   */
  async sendTextMessage(to: string, content: string): Promise<any> {
    if (!this.accessToken) {
      throw new BadRequestException('WhatsApp Access Token 未配置')
    }

    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(to),
      type: 'text',
      text: {
        body: content,
      },
    }

    return this.sendRequest(url, payload)
  }

  /**
   * 发送模板消息
   */
  async sendTemplateMessage(dto: WhatsAppTemplateDto, to: string): Promise<any> {
    if (!this.accessToken) {
      throw new BadRequestException('WhatsApp Access Token 未配置')
    }

    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(to),
      type: 'template',
      template: {
        name: dto.name,
        language: {
          code: dto.language || 'en',
        },
        components: dto.components || [],
      },
    }

    return this.sendRequest(url, payload)
  }

  /**
   * 发送媒体消息（图片/视频/文档）
   */
  async sendMediaMessage(
    to: string,
    mediaType: 'image' | 'video' | 'document',
    mediaUrl: string,
    caption?: string,
  ): Promise<any> {
    if (!this.accessToken) {
      throw new BadRequestException('WhatsApp Access Token 未配置')
    }

    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.formatPhoneNumber(to),
      type: mediaType,
      [mediaType]: {
        link: mediaUrl,
        ...(caption && { caption }),
      },
    }

    return this.sendRequest(url, payload)
  }

  /**
   * 发送订单确认消息
   */
  async sendOrderConfirmation(
    to: string,
    orderNo: string,
    customerName: string,
    totalAmount: number,
    currency: string,
  ): Promise<any> {
    const content = `
🎉 订单确认

尊敬的 ${customerName}，

您的订单已确认：
📦 订单号：${orderNo}
💰 总金额：${currency} ${totalAmount.toFixed(2)}

我们将尽快安排发货，感谢您的订购！

如有任何问题，请随时联系我们。
    `.trim()

    return this.sendTextMessage(to, content)
  }

  /**
   * 发送跟进提醒
   */
  async sendFollowUpReminder(
    to: string,
    customerName: string,
    followUpContent: string,
    followUpDate: string,
  ): Promise<any> {
    const content = `
📅 跟进提醒

${customerName} 您好，

${followUpContent}

预计跟进时间：${followUpDate}

如有任何问题，请随时回复此消息。
    `.trim()

    return this.sendTextMessage(to, content)
  }

  /**
   * 格式化电话号码
   */
  private formatPhoneNumber(phone: string): string {
    // 移除所有非数字字符（除了 +）
    let formatted = phone.replace(/[^\d+]/g, '')
    
    // 确保以 + 开头
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted
    }
    
    return formatted
  }

  /**
   * 发送 HTTP 请求
   */
  private async sendRequest(url: string, payload: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new BadRequestException(
        `WhatsApp API 错误：${data.error?.message || '未知错误'}`,
      )
    }

    return data
  }

  /**
   * 验证 Webhook
   */
  verifyWebhook(mode: string, token: string, verifyToken: string): boolean {
    return mode === 'subscribe' && token === verifyToken
  }

  /**
   * 处理 Webhook 消息
   */
  async handleWebhookMessage(payload: any): Promise<void> {
    // 处理接收到的消息
    if (payload.object === 'whatsapp_business_account') {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const message = change.value.messages?.[0]
            if (message) {
              console.log('收到 WhatsApp 消息:', message)
              // 可以在这里添加消息处理逻辑
            }
          }
        }
      }
    }
  }
}
