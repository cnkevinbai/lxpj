/**
 * 钉钉集成服务 - 审批/消息/通讯录
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'

export interface DingTalkConfig {
  appKey: string
  appSecret: string
  agentId: string
}

export interface ApprovalInstance {
  processCode: string
  approverUserIds: string[]
  formComponents: Array<{
    name: string
    value: string
  }>
}

@Injectable()
export class DingTalkService {
  private readonly logger = new Logger(DingTalkService.name)
  private config: DingTalkConfig
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.config = {
      appKey: this.configService.get('DINGTALK_APP_KEY', ''),
      appSecret: this.configService.get('DINGTALK_APP_SECRET', ''),
      agentId: this.configService.get('DINGTALK_AGENT_ID', ''),
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
        this.httpService.get('https://oapi.dingtalk.com/gettoken', {
          params: {
            appkey: this.config.appKey,
            appsecret: this.config.appSecret,
          },
        }),
      )

      const data = response.data
      if (data.errcode === 0) {
        this.accessToken = data.access_token
        this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
        this.logger.log('钉钉 AccessToken 刷新成功')
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
   * 创建审批实例
   */
  async createApprovalInstance(data: ApprovalInstance): Promise<string> {
    const accessToken = await this.getAccessToken()

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://oapi.dingtalk.com/topapi/processinstance/create?access_token=${accessToken}`,
          {
            process_code: data.processCode,
            approver_userids: data.approverUserIds.join(','),
            form_component_values: data.formComponents,
          },
        ),
      )

      const result = response.data
      if (result.errcode === 0) {
        this.logger.log(`钉钉审批实例创建成功：${result.processInstanceId}`)
        return result.processInstanceId
      } else {
        throw new Error(`创建审批实例失败：${result.errmsg}`)
      }
    } catch (error) {
      this.logger.error('创建审批实例失败', error)
      throw error
    }
  }

  /**
   * 获取审批实例状态
   */
  async getApprovalInstance(processInstanceId: string): Promise<any> {
    const accessToken = await this.getAccessToken()

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://oapi.dingtalk.com/topapi/processinstance/get?access_token=${accessToken}`,
          {
            processInstanceId,
          },
        ),
      )

      const result = response.data
      if (result.errcode === 0) {
        return result.processInstance
      } else {
        throw new Error(`获取审批实例失败：${result.errmsg}`)
      }
    } catch (error) {
      this.logger.error('获取审批实例失败', error)
      throw error
    }
  }

  /**
   * 发送工作通知
   */
  async sendMessage(userId: string, content: any): Promise<void> {
    const accessToken = await this.getAccessToken()

    try {
      await firstValueFrom(
        this.httpService.post(
          `https://oapi.dingtalk.com/topapi/message/send?access_token=${accessToken}`,
          {
            agent_id: this.config.agentId,
            userid_list: userId,
            msg: {
              msgtype: 'markdown',
              markdown: {
                title: '审批通知',
                text: content,
              },
            },
          },
        ),
      )

      this.logger.log(`钉钉消息发送成功：${userId}`)
    } catch (error) {
      this.logger.error('发送消息失败', error)
      throw error
    }
  }

  /**
   * 发送审批待办通知
   */
  async sendApprovalNotification(
    userId: string,
    title: string,
    applicant: string,
    amount: number,
    processInstanceId: string,
  ): Promise<void> {
    const content = `## 审批通知
> 您有一个新的审批待处理

**标题**: ${title}
**申请人**: ${applicant}
**金额**: ¥${amount.toLocaleString()}

[点击查看详情](https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm#/${processInstanceId})`

    await this.sendMessage(userId, content)
  }

  /**
   * 获取用户 ID
   */
  async getUserIdByUnionId(unionId: string): Promise<string> {
    const accessToken = await this.getAccessToken()

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=${accessToken}`,
          {
            params: { unionId },
          },
        ),
      )

      const result = response.data
      if (result.errcode === 0) {
        return result.user_result.userid
      } else {
        throw new Error(`获取用户 ID 失败：${result.errmsg}`)
      }
    } catch (error) {
      this.logger.error('获取用户 ID 失败', error)
      throw error
    }
  }

  /**
   * 验证回调签名
   */
  verifyCallbackSignature(
    signature: string,
    timestamp: number,
    nonce: string,
    encrypt: string,
  ): boolean {
    // TODO: 实现钉钉回调签名验证
    return true
  }

  /**
   * 处理回调事件
   */
  handleCallback(event: any): { eventType: string; data: any } {
    const eventType = event.eventType
    const data = event.data

    this.logger.log(`收到钉钉回调事件：${eventType}`)

    return { eventType, data }
  }
}
