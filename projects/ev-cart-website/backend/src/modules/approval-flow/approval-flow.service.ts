/**
 * 审批流服务 - 内部审批 + 第三方集成
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApprovalFlow } from './entities/approval-flow.entity'
import { ApprovalNode } from './entities/approval-node.entity'
import { ApprovalRecord, ApprovalStatus } from './entities/approval-record.entity'
import { ApprovalIntegrationService, ApprovalPlatform } from '../integration/approval-integration.service'

@Injectable()
export class ApprovalFlowService {
  constructor(
    @InjectRepository(ApprovalFlow)
    private flowRepository: Repository<ApprovalFlow>,
    @InjectRepository(ApprovalNode)
    private nodeRepository: Repository<ApprovalNode>,
    @InjectRepository(ApprovalRecord)
    private recordRepository: Repository<ApprovalRecord>,
    private integrationService: ApprovalIntegrationService,
  ) {}

  /**
   * 创建审批流程
   */
  async createFlow(data: Partial<ApprovalFlow>): Promise<ApprovalFlow> {
    const flow = this.flowRepository.create(data)
    return this.flowRepository.save(flow)
  }

  /**
   * 获取审批流程
   */
  async getFlow(id: string): Promise<ApprovalFlow> {
    const flow = await this.flowRepository.findOne({
      where: { id },
      relations: ['nodes'],
      order: { nodes: { order: 'ASC' } },
    })
    if (!flow) {
      throw new NotFoundException('审批流程不存在')
    }
    return flow
  }

  /**
   * 获取流程列表
   */
  async getFlows(type?: string, status?: string) {
    const query = this.flowRepository.createQueryBuilder('flow')
      .orderBy('flow.createdAt', 'DESC')

    if (type) {
      query.andWhere('flow.type = :type', { type })
    }
    if (status) {
      query.andWhere('flow.status = :status', { status })
    }

    return query.getMany()
  }

  /**
   * 提交审批
   */
  async submitApproval(
    flowId: string,
    applicantId: string,
    applicantName: string,
    entityType: string,
    entityId: string,
    formData: Record<string, any>,
    platform: 'internal' | 'dingtalk' | 'wechat' = 'internal',
  ): Promise<ApprovalRecord> {
    const flow = await this.getFlow(flowId)

    // 创建审批记录
    const record = this.recordRepository.create({
      flowId,
      flowName: flow.name,
      entityType,
      entityId,
      status: 'pending',
      platform,
      applicantId,
      applicantName,
      formData,
      submittedAt: new Date(),
    })

    await this.recordRepository.save(record)

    // 根据平台创建审批
    if (platform === 'internal') {
      // 内部审批 - 移动到第一个审批节点
      await this.moveToNextNode(record.id)
    } else {
      // 第三方审批
      await this.createThirdPartyApproval(record, flow, platform as ApprovalPlatform)
    }

    return record
  }

  /**
   * 创建第三方审批
   */
  private async createThirdPartyApproval(
    record: ApprovalRecord,
    flow: ApprovalFlow,
    platform: ApprovalPlatform,
  ): Promise<void> {
    // 获取审批节点
    const nodes = await this.nodeRepository.find({
      where: { flowId: flow.id },
      order: { order: 'ASC' },
    })

    // 获取审批人
    const approverIds = await this.getApproversForNode(nodes[0])

    // 创建第三方审批实例
    const result = await this.integrationService.createApproval({
      platform,
      processCode: `PROC-${flow.type.toUpperCase()}`,
      title: `${flow.name} - ${record.entityId}`,
      applicantId: record.applicantId,
      applicantName: record.applicantName,
      approverIds,
      formData: record.formData,
      remarks: record.remarks,
    })

    // 更新记录
    record.thirdPartyInstanceId = result.instanceId
    record.status = 'approving'
    await this.recordRepository.save(record)
  }

  /**
   * 审批操作
   */
  async approve(
    recordId: string,
    approverId: string,
    approverName: string,
    approved: boolean,
    comments?: string,
  ): Promise<ApprovalRecord> {
    const record = await this.recordRepository.findOne({ where: { id: recordId } })
    if (!record) {
      throw new NotFoundException('审批记录不存在')
    }

    if (record.platform === 'internal') {
      // 内部审批
      if (approved) {
        await this.moveToNextNode(recordId)
      } else {
        record.status = 'rejected'
        record.completedAt = new Date()
      }
    } else {
      // 第三方审批 - 同步状态
      await this.integrationService.syncApprovalStatus(
        record.platform as ApprovalPlatform,
        record.thirdPartyInstanceId,
      )
    }

    record.currentApproverId = approverId
    record.currentApproverName = approverName
    await this.recordRepository.save(record)

    return record
  }

  /**
   * 移动到下一个节点
   */
  private async moveToNextNode(recordId: string): Promise<void> {
    const record = await this.recordRepository.findOne({ where: { id: recordId } })
    const flow = await this.getFlow(record.flowId)
    const nodes = flow.nodes.sort((a, b) => a.order - b.order)

    const currentIndex = record.currentNodeIndex
    const nextIndex = currentIndex + 1

    if (nextIndex >= nodes.length) {
      // 所有节点完成
      record.status = 'approved'
      record.completedAt = new Date()
    } else {
      // 移动到下一个节点
      const nextNode = nodes[nextIndex]
      const approvers = await this.getApproversForNode(nextNode)

      record.currentNodeIndex = nextIndex
      record.currentApproverId = approvers[0]
      record.status = 'approving'

      // 通知下一个审批人
      await this.notifyApprover(record, approvers[0], nextNode)
    }

    await this.recordRepository.save(record)
  }

  /**
   * 获取节点审批人
   */
  private async getApproversForNode(node: ApprovalNode): Promise<string[]> {
    if (!node.approvers) {
      return []
    }

    // 根据审批人类型获取
    switch (node.approverType) {
      case 'user':
        return node.approvers
      case 'role':
        // TODO: 查询角色下的用户
        return node.approvers
      case 'department':
        // TODO: 查询部门下的用户
        return node.approvers
      case 'manager':
        // TODO: 查询上级
        return node.approvers
      default:
        return node.approvers
    }
  }

  /**
   * 通知审批人
   */
  private async notifyApprover(
    record: ApprovalRecord,
    approverId: string,
    node: ApprovalNode,
  ): Promise<void> {
    // TODO: 发送站内通知/邮件/短信
    console.log(`通知审批人 ${approverId}: ${record.flowName}`)
  }

  /**
   * 获取审批记录
   */
  async getRecord(id: string): Promise<ApprovalRecord> {
    const record = await this.recordRepository.findOne({ where: { id } })
    if (!record) {
      throw new NotFoundException('审批记录不存在')
    }
    return record
  }

  /**
   * 获取审批记录列表
   */
  async getRecords(
    page: number = 1,
    limit: number = 20,
    filters?: {
      applicantId?: string
      currentApproverId?: string
      status?: string
      flowId?: string
    },
  ) {
    const query = this.recordRepository.createQueryBuilder('record')
      .orderBy('record.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    if (filters?.applicantId) {
      query.andWhere('record.applicantId = :applicantId', { applicantId: filters.applicantId })
    }
    if (filters?.currentApproverId) {
      query.andWhere('record.currentApproverId = :currentApproverId', { currentApproverId: filters.currentApproverId })
    }
    if (filters?.status) {
      query.andWhere('record.status = :status', { status: filters.status })
    }
    if (filters?.flowId) {
      query.andWhere('record.flowId = :flowId', { flowId: filters.flowId })
    }

    const [data, total] = await query.getManyAndCount()
    return { data, total, page, limit }
  }

  /**
   * 撤销审批
   */
  async cancel(recordId: string, applicantId: string): Promise<ApprovalRecord> {
    const record = await this.getRecord(recordId)
    if (record.applicantId !== applicantId) {
      throw new Error('只有申请人才能撤销审批')
    }
    if (record.status !== 'pending' && record.status !== 'approving') {
      throw new Error('当前状态不能撤销')
    }

    record.status = 'cancelled'
    record.completedAt = new Date()
    return this.recordRepository.save(record)
  }

  /**
   * 获取待我审批
   */
  async getPendingApprovals(userId: string) {
    return this.recordRepository
      .createQueryBuilder('record')
      .where('record.currentApproverId = :userId', { userId })
      .andWhere('record.status = :status', { status: 'approving' })
      .orderBy('record.createdAt', 'ASC')
      .getMany()
  }

  /**
   * 获取我的审批
   */
  async getMyApprovals(userId: string) {
    return this.recordRepository
      .createQueryBuilder('record')
      .where('record.applicantId = :userId', { userId })
      .orderBy('record.createdAt', 'DESC')
      .getMany()
  }
}
