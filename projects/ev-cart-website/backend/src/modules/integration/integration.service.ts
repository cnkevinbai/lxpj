import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class IntegrationService {
  constructor(private configService: ConfigService) {}

  // 钉钉机器人消息推送
  async sendDingTalkMessage(webhook: string, content: any) {
    const payload = {
      msgtype: 'markdown',
      markdown: {
        title: content.title,
        text: this.formatDingTalkMarkdown(content),
      },
      at: {
        isAtAll: true,
      },
    }

    try {
      const response = await axios.post(webhook, payload)
      return { success: true, data: response.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // 企业微信机器人消息推送
  async sendWeComMessage(webhook: string, content: any) {
    const payload = {
      msgtype: 'markdown',
      markdown: {
        content: this.formatWeComMarkdown(content),
      },
    }

    try {
      const response = await axios.post(webhook, payload)
      return { success: true, data: response.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // 飞书机器人消息推送
  async sendFeishuMessage(webhook: string, content: any) {
    const payload = {
      msg_type: 'interactive',
      card: {
        header: {
          title: {
            tag: 'plain_text',
            content: content.title,
          },
        },
        elements: [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: content.content,
            },
          },
        ],
      },
    }

    try {
      const response = await axios.post(webhook, payload)
      return { success: true, data: response.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // 格式化钉钉 Markdown
  private formatDingTalkMarkdown(content: any) {
    return `## ${content.title}
    
${content.content}

${content.footer ? `> ${content.footer}` : ''}`
  }

  // 格式化企业微信 Markdown
  private formatWeComMarkdown(content: any) {
    return `## ${content.title}
    
${content.content}

${content.footer ? `> ${content.footer}` : ''}`
  }

  // 创建线索通知
  async notifyNewLead(lead: any, platform: 'dingtalk' | 'wecom' | 'feishu', webhook: string) {
    const content = {
      title: '🔔 新线索通知',
      content: `**姓名**: ${lead.name}
**手机**: ${lead.phone}
**公司**: ${lead.company || '-'}
**意向产品**: ${lead.productInterest || '-'}
**来源**: ${lead.source || '官网'}`,
      footer: `创建时间：${new Date().toLocaleString()}`,
    }

    if (platform === 'dingtalk') {
      return this.sendDingTalkMessage(webhook, content)
    } else if (platform === 'wecom') {
      return this.sendWeComMessage(webhook, content)
    } else if (platform === 'feishu') {
      return this.sendFeishuMessage(webhook, content)
    }
  }

  // 订单状态变更通知
  async notifyOrderStatusChange(order: any, platform: 'dingtalk' | 'wecom' | 'feishu', webhook: string) {
    const content = {
      title: '📦 订单状态变更',
      content: `**订单号**: ${order.orderNo}
**客户**: ${order.customer?.name || '-'}
**金额**: ¥${order.totalAmount}
**新状态**: ${order.status}`,
      footer: `更新时间：${new Date().toLocaleString()}`,
    }

    if (platform === 'dingtalk') {
      return this.sendDingTalkMessage(webhook, content)
    } else if (platform === 'wecom') {
      return this.sendWeComMessage(webhook, content)
    } else if (platform === 'feishu') {
      return this.sendFeishuMessage(webhook, content)
    }
  }
}
