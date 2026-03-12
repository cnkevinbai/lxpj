/**
 * 审批流程模板服务 - 预设模板 + 快速配置
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApprovalFlow } from './entities/approval-flow.entity'
import { ApprovalNode } from './entities/approval-node.entity'

/**
 * 预设审批模板
 */
export interface ApprovalTemplate {
  id: string
  name: string
  type: string
  description: string
  icon: string
  nodes: TemplateNode[]
  recommended: boolean
}

export interface TemplateNode {
  name: string
  type: 'approver' | 'cc'
  approverType: 'manager' | 'role' | 'user' | 'department'
  approvers?: string[]
  approveMode?: 'or' | 'and'
  timeoutHours?: number
  required: boolean
}

@Injectable()
export class ApprovalFlowTemplateService {
  constructor(
    @InjectRepository(ApprovalFlow)
    private flowRepository: Repository<ApprovalFlow>,
    @InjectRepository(ApprovalNode)
    private nodeRepository: Repository<ApprovalNode>,
  ) {}

  /**
   * 获取预设模板列表
   */
  getTemplates(): ApprovalTemplate[] {
    return [
      {
        id: 'contract-simple',
        name: '简易合同审批',
        type: 'contract',
        description: '适用于 10 万以下的小额合同',
        icon: 'file-text',
        recommended: true,
        nodes: [
          {
            name: '部门经理审批',
            type: 'approver',
            approverType: 'manager',
            approveMode: 'or',
            timeoutHours: 24,
            required: true,
          },
          {
            name: '财务备案',
            type: 'cc',
            approverType: 'role',
            approvers: ['finance'],
            required: false,
          },
        ],
      },
      {
        id: 'contract-standard',
        name: '标准合同审批',
        type: 'contract',
        description: '适用于 10-50 万的合同',
        icon: 'file-text',
        recommended: true,
        nodes: [
          {
            name: '部门经理审批',
            type: 'approver',
            approverType: 'manager',
            approveMode: 'or',
            timeoutHours: 24,
            required: true,
          },
          {
            name: '财务经理审批',
            type: 'approver',
            approverType: 'role',
            approvers: ['finance_manager'],
            approveMode: 'or',
            timeoutHours: 24,
            required: true,
          },
        ],
      },
      {
        id: 'contract-large',
        name: '大额合同审批',
        type: 'contract',
        description: '适用于 50 万以上的大额合同',
        icon: 'file-text',
        recommended: false,
        nodes: [
          {
            name: '部门经理审批',
            type: 'approver',
            approverType: 'manager',
            approveMode: 'or',
            timeoutHours: 24,
            required: true,
          },
          {
            name: '财务经理审批',
            type: 'approver',
            approverType: 'role',
            approvers: ['finance_manager'],
            approveMode: 'or',
            timeoutHours: 24,
            required: true,
          },
          {
            name: '总监审批',
            type: 'approver',
            approverType: 'role',
            approvers: ['director'],
            approveMode: 'and',
            timeoutHours: 48,
            required: true,
          },
        ],
      },
      {
        id: 'purchase-simple',
        name: '简易采购审批',
        type: 'purchase',
        description: '适用于小额采购',
        icon: 'shopping-cart',
        recommended: true,
        nodes: [
          {
            name: '采购经理审批',
            type: 'approver',
            approverType: 'manager',
            approveMode: 'or',
            timeoutHours: 24,
            required: true,
          },
        ],
      },
      {
        id: 'expense-standard',
        name: '标准费用报销',
        type: 'expense',
        description: '适用于员工费用报销',
        icon: 'money',
        recommended: true,
        nodes: [
          {
            name: '部门经理审批',
            type: 'approver',
            approverType: 'manager',
            approveMode: 'or',
            timeoutHours: 24,
            required: true,
          },
          {
            name: '财务审批',
            type: 'approver',
            approverType: 'role',
            approvers: ['finance'],
            approveMode: 'or',
            timeoutHours: 48,
            required: true,
          },
        ],
      },
      {
        id: 'leave-simple',
        name: '简易请假审批',
        type: 'leave',
        description: '适用于 3 天以内请假',
        icon: 'user',
        recommended: true,
        nodes: [
          {
            name: '直属上级审批',
            type: 'approver',
            approverType: 'manager',
            approveMode: 'or',
            timeoutHours: 12,
            required: true,
          },
        ],
      },
    ]
  }

  /**
   * 从模板创建审批流程
   */
  async createFromTemplate(
    templateId: string,
    createdBy: string,
    createdByName: string,
  ): Promise<ApprovalFlow> {
    const templates = this.getTemplates()
    const template = templates.find(t => t.id === templateId)

    if (!template) {
      throw new Error('模板不存在')
    }

    // 创建流程
    const flow = this.flowRepository.create({
      name: template.name,
      type: template.type as any,
      status: 'active',
      platform: 'internal',
      description: template.description,
      createdBy,
      createdByName,
    })

    await this.flowRepository.save(flow)

    // 创建节点
    const nodes = template.nodes.map((node, index) =>
      this.nodeRepository.create({
        flowId: flow.id,
        name: node.name,
        type: node.type,
        order: index + 1,
        approverType: node.approverType as any,
        approvers: node.approvers,
        approveMode: node.approveMode || 'or',
        timeoutHours: node.timeoutHours || 24,
        allowEmpty: !node.required,
      }),
    )

    await this.nodeRepository.save(nodes)

    return this.flowRepository.findOne({
      where: { id: flow.id },
      relations: ['nodes'],
    })
  }

  /**
   * 获取推荐模板
   */
  getRecommendedTemplates(type?: string): ApprovalTemplate[] {
    let templates = this.getTemplates().filter(t => t.recommended)

    if (type) {
      templates = templates.filter(t => t.type === type)
    }

    return templates
  }

  /**
   * 验证流程配置
   */
  validateFlowConfig(nodes: Partial<ApprovalNode>[]): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // 检查节点数量
    if (nodes.length === 0) {
      errors.push('至少需要一个审批节点')
    }

    // 检查节点顺序
    const orders = nodes.map(n => n.order)
    if (new Set(orders).size !== orders.length) {
      errors.push('节点顺序不能重复')
    }

    // 检查审批人配置
    nodes.forEach((node, index) => {
      if (node.type === 'approver') {
        if (!node.approverType) {
          errors.push(`节点${index + 1}：需要指定审批人类型`)
        }
        if (!node.approvers || node.approvers.length === 0) {
          warnings.push(`节点${index + 1}：未指定审批人`)
        }
      }

      // 检查超时设置
      if (node.timeoutHours && node.timeoutHours > 720) {
        warnings.push(`节点${index + 1}：审批超时超过 30 天`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    }
  }
}
