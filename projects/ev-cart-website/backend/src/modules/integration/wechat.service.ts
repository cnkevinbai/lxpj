/**
 * 企业微信集成服务 - 审批/消息
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'

export interface WeChatConfig {
  corpId: string
  corpSecret: string
  agentId: string
}

@Injectable()
export class WeChatService {
  private readonly logger = new Logger(WeChatService.name)
  private config: WeChatConfig
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.config = {
      corpId: this.configService.get('WECHAT_CORP_ID', ''),
      corpSecret: this.configService.get('WECHAT_CORP_SECRET', ''),
      agentId: this.configService.get('WECHAT_AGENT_ID', ''),
    }
  }

  /**
   * 获取 AccessToken
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
          params: {
            corpid: this.config.corpId,
            corpsecret: this.config.corpSecret,
          },
        }),
      )

      const data = response.data
      if (data.errcode === 0) {
        this.accessToken = data.access_token
        this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
        this.logger.log('企业微信 AccessToken 刷新成功')
        return this.accessToken
      } else {
        throw new Error(`获取 AccessToken 失败：${data.errmsg}`)
      }
    } catch (error) {
      this.logger.error('获取 AccessToken 失败', error)
      throw error
    }
  }

  /**
   * 发送消息
   */
  async sendMessage(userId: string, content: any): Promise<void> {
    const accessToken = await this.getAccessToken()

    try {
      await firstValueFrom(
        this.httpService.post(
          `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`,
          {
            touser: userId,
            msgtype: 'markdown',
            agentid: parseInt(this.config.agentId),
            markdown: {
              content: content,
            },
          },
        ),
      )

      this.logger.log(`企业微信消息发送成功：${userId}`)
    } catch (error) {
      this.logger.error('发送消息失败', error)
      throw error
    }
  }

  /**
   * 发送审批通知
   */
  async sendApprovalNotification(
    userId: string,
    title: string,
    applicant: string,
    amount: number,
  ): Promise<void> {
    const content = `## 审批通知
> 您有一个新的审批待处理

**标题**: ${title}
**申请人**: ${applicant}
**金额**: ¥${amount.toLocaleString()}

请点击企业微信 APP 查看详情`

    await this.sendMessage(userId, content)
  }
}
