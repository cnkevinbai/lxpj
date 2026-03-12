/**
 * 审批流集成服务 - 统一抽象层
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, Logger } from '@nestjs/common'
import { DingTalkService } from './dingtalk.service'
import { WeChatService } from './wechat.service'

export type ApprovalPlatform = 'dingtalk' | 'wechat' | 'feishu' | 'internal'

export interface ApprovalRequest {
  platform: ApprovalPlatform
  processCode: string
  title: string
  applicantId: string
  applicantName: string
  approverIds: string[]
  formData: Record<string, any>
  amount?: number
  remarks?: string
}

export interface ApprovalResult {
  instanceId: string
  status: 'pending' | 'approved' | 'rejected'
  approvedAt?: Date
  approvedBy?: string
  comments?: string
}

@Injectable()
export class ApprovalIntegrationService {
  private readonly logger = new Logger(ApprovalIntegrationService.name)

  constructor(
    private dingTalkService: DingTalkService,
    private weChatService: WeChatService,
  ) {}

  /**
   * 创建审批实例
   */
  async createApproval(request: ApprovalRequest): Promise<ApprovalResult> {
    this.logger.log(`创建审批实例：${request.platform} - ${request.title}`)

    switch (request.platform) {
      case 'dingtalk':
        return this.createDingTalkApproval(request)
      case 'wechat':
        return this.createWeChatApproval(request)
      case 'feishu':
        // TODO: 飞书集成
        throw new Error('飞书审批暂未实现')
      case 'internal':
        return this.createInternalApproval(request)
      default:
        throw new Error(`不支持的审批平台：${request.platform}`)
    }
  }

  /**
   * 创建钉钉审批
   */
  private async createDingTalkApproval(
    request: ApprovalRequest,
  ): Promise<ApprovalResult> {
    // 构建表单数据
    const formComponents = [
      { name: '标题', value: request.title },
      { name: '申请人', value: request.applicantName },
      { name: '申请日期', value: new Date().toISOString().slice(0, 10) },
    ]

    if (request.amount) {
      formComponents.push({ name: '金额', value: request.amount.toString() })
    }

    if (request.remarks) {
      formComponents.push({ name: '备注', value: request.remarks })
    }

    // 添加自定义表单字段
    for (const [key, value] of Object.entries(request.formData)) {
      formComponents.push({ name: key, value: String(value) })
    }

    // 创建审批实例
    const instanceId = await this.dingTalkService.createApprovalInstance({
      processCode: request.processCode,
      approverUserIds: request.approverIds,
      formComponents,
    })

    // 发送通知给审批人
    for (const approverId of request.approverIds) {
      await this.dingTalkService.sendApprovalNotification(
        approverId,
        request.title,
        request.applicantName,
        request.amount || 0,
        instanceId,
      )
    }

    return {
      instanceId,
      status: 'pending',
    }
  }

  /**
   * 创建企业微信审批
   */
  private async createWeChatApproval(
    request: ApprovalRequest,
  ): Promise<ApprovalResult> {
    // 发送审批通知
    for (const approverId of request.approverIds) {
      await this.weChatService.sendApprovalNotification(
        approverId,
        request.title,
        request.applicantName,
        request.amount || 0,
      )
    }

    // 生成内部审批 ID
    const instanceId = `WX-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    return {
      instanceId,
      status: 'pending',
    }
  }

  /**
   * 创建内部审批
   */
  private async createInternalApproval(
    request: ApprovalRequest,
  ): Promise<ApprovalResult> {
    // 内部审批逻辑
    const instanceId = `INT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    return {
      instanceId,
      status: 'pending',
    }
  }

  /**
   * 同步审批状态
   */
  async syncApprovalStatus(
    platform: ApprovalPlatform,
    instanceId: string,
  ): Promise<ApprovalResult> {
    this.logger.log(`同步审批状态：${platform} - ${instanceId}`)

    switch (platform) {
      case 'dingtalk':
        return this.syncDingTalkStatus(instanceId)
      case 'wechat':
        // TODO: 同步企业微信状态
        return { instanceId, status: 'pending' }
      default:
        throw new Error(`不支持的审批平台：${platform}`)
    }
  }

  /**
   * 同步钉钉审批状态
   */
  private async syncDingTalkStatus(
    instanceId: string,
  ): Promise<ApprovalResult> {
    const instance = await this.dingTalkService.getApprovalInstance(instanceId)

    const statusMap: Record<string, ApprovalResult['status']> = {
      1: 'pending',
      2: 'approved',
      3: 'rejected',
    }

    return {
      instanceId,
      status: statusMap[instance.status] || 'pending',
      approvedAt: instance.finishTime ? new Date(instance.finishTime) : undefined,
      approvedBy: instance.operatorUserId,
      comments: instance.comments,
    }
  }

  /**
   * 处理回调事件
   */
  async handleCallback(platform: ApprovalPlatform, event: any): Promise<void> {
    this.logger.log(`处理审批回调：${platform}`)

    switch (platform) {
      case 'dingtalk':
        await this.handleDingTalkCallback(event)
        break
      case 'wechat':
        await this.handleWeChatCallback(event)
        break
    }
  }

  /**
   * 处理钉钉回调
   */
  private async handleDingTalkCallback(event: any): Promise<void> {
    const { eventType, data } = this.dingTalkService.handleCallback(event)

    if (eventType === 'bpms_instance_finish') {
      // 审批完成
      this.logger.log(`钉钉审批完成：${data.processInstanceId}`)
      // TODO: 更新内部审批状态
    }
  }

  /**
   * 处理企业微信回调
   */
  private async handleWeChatCallback(event: any): Promise<void> {
    // TODO: 实现企业微信回调处理
  }
}
