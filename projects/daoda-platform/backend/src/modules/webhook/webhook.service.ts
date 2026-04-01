import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../common/prisma/prisma.service'
import { Webhook, WebhookLog } from '@prisma/client'
import { CreateWebhookDto, UpdateWebhookDto } from './webhook.dto'
import * as crypto from 'crypto'

@Injectable()
export class WebhookService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWebhookDto, tenantId: string): Promise<Webhook> {
    const webhook = await this.prisma.webhook.create({
      data: {
        ...dto,
        tenantId,
      },
    })
    return webhook
  }

  async findAll(tenantId: string) {
    return this.prisma.webhook.findMany({
      where: { tenantId, enabled: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string, tenantId: string): Promise<Webhook | null> {
    const webhook = await this.prisma.webhook.findFirst({
      where: { id, tenantId },
    })
    if (!webhook) {
      throw new NotFoundException('Webhook 不存在')
    }
    return webhook
  }

  async update(id: string, tenantId: string, dto: UpdateWebhookDto): Promise<Webhook> {
    await this.findOne(id, tenantId)
    return this.prisma.webhook.update({
      where: { id },
      data: dto,
    })
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.findOne(id, tenantId)
    await this.prisma.webhook.delete({
      where: { id },
    })
  }

  async test(id: string, tenantId: string): Promise<{ success: boolean; log: WebhookLog }> {
    const webhook = await this.findOne(id, tenantId)

    if (!webhook) {
      throw new NotFoundException('Webhook 不存在')
    }

    const payload = {
      test: true,
      timestamp: new Date().toISOString(),
      message: '测试 Webhook',
    }

    const result = await this.sendWebhook(webhook, 'webhook.test', payload)

    const log = await this.prisma.webhookLog.create({
      data: {
        webhookId: webhook.id,
        event: 'webhook.test',
        payload: payload,
        response: result.response,
        statusCode: result.statusCode,
        success: result.success,
        duration: result.duration,
      },
    })

    return { success: result.success, log }
  }

  async trigger(event: string, payload: any): Promise<void> {
    const webhooks = await this.prisma.webhook.findMany({
      where: {
        enabled: true,
        events: {
          has: event,
        },
      },
    })

    for (const webhook of webhooks) {
      try {
        await this.sendWebhook(webhook, event, payload)
      } catch (error) {
        // 记录失败但不中断其他 webhook
        console.error(`Webhook ${webhook.id} 发送失败:`, error)
      }
    }
  }

  private async sendWebhook(
    webhook: Webhook,
    event: string,
    payload: any,
  ): Promise<{
    success: boolean
    statusCode?: number
    response?: any
    duration?: number
  }> {
    const startTime = Date.now()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Event': event,
    }

    if (webhook.secret) {
      const signature = this.signPayload(webhook.secret, payload)
      headers['X-Webhook-Signature'] = signature
    }

    try {
      // 使用 AbortController 实现超时
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const duration = Date.now() - startTime
      const responseText = await response.text()
      let responseBody: any = null

      try {
        responseBody = responseText ? JSON.parse(responseText) : null
      } catch {
        responseBody = responseText
      }

      const success = response.ok
      return {
        success,
        statusCode: response.status,
        response: responseBody,
        duration,
      }
    } catch (error) {
      const duration = Date.now() - startTime
      return {
        success: false,
        duration,
        response: { error: error.message },
      }
    }
  }

  private signPayload(secret: string, payload: any): string {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload)
    return crypto.createHmac('sha256', secret).update(data).digest('hex')
  }

  async getLogs(webhookId: string, tenantId: string) {
    await this.findOne(webhookId, tenantId)
    return this.prisma.webhookLog.findMany({
      where: { webhookId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }
}
