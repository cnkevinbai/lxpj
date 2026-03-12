/**
 * 审批流程可视化服务 - 流程图生成
 * 渔晓白 ⚙️ · 专业交付
 */

import { Injectable } from '@nestjs/common'
import { ApprovalFlow } from './entities/approval-flow.entity'
import { ApprovalNode } from './entities/approval-node.entity'

export interface FlowVisualData {
  nodes: VisualNode[]
  edges: VisualEdge[]
  width: number
  height: number
}

export interface VisualNode {
  id: string
  type: 'start' | 'approver' | 'cc' | 'condition' | 'end'
  name: string
  x: number
  y: number
  width: number
  height: number
  data?: any
}

export interface VisualEdge {
  source: string
  target: string
  label?: string
}

@Injectable()
export class ApprovalFlowVisualizerService {
  /**
   * 生成流程图数据
   */
  generateFlowData(flow: ApprovalFlow & { nodes: ApprovalNode[] }): FlowVisualData {
    const nodes: VisualNode[] = []
    const edges: VisualEdge[] = []

    // 起始节点
    nodes.push({
      id: 'start',
      type: 'start',
      name: '开始',
      x: 400,
      y: 50,
      width: 120,
      height: 60,
    })

    // 审批节点
    const nodeYStep = 120
    flow.nodes.forEach((node, index) => {
      const visualNode: VisualNode = {
        id: node.id,
        type: this.mapNodeType(node.type),
        name: node.name,
        x: 400,
        y: 150 + index * nodeYStep,
        width: 200,
        height: 80,
        data: {
          approverType: node.approverType,
          approvers: node.approvers,
          approveMode: node.approveMode,
          timeoutHours: node.timeoutHours,
        },
      }
      nodes.push(visualNode)

      // 连接边
      const sourceId = index === 0 ? 'start' : flow.nodes[index - 1].id
      edges.push({
        source: sourceId,
        target: node.id,
      })
    })

    // 结束节点
    const lastNodeId = flow.nodes.length > 0 ? flow.nodes[flow.nodes.length - 1].id : 'start'
    const endY = 150 + flow.nodes.length * nodeYStep

    nodes.push({
      id: 'end',
      type: 'end',
      name: '结束',
      x: 400,
      y: endY,
      width: 120,
      height: 60,
    })

    edges.push({
      source: lastNodeId,
      target: 'end',
    })

    return {
      nodes,
      edges,
      width: 1000,
      height: endY + 150,
    }
  }

  /**
   * 映射节点类型
   */
  private mapNodeType(type: string): VisualNode['type'] {
    const map: Record<string, VisualNode['type']> = {
      start: 'start',
      approver: 'approver',
      cc: 'cc',
      condition: 'condition',
      end: 'end',
    }
    return map[type] || 'approver'
  }

  /**
   * 生成流程预览图 (ASCII)
   */
  generateAsciiPreview(flow: ApprovalFlow & { nodes: ApprovalNode[] }): string {
    let preview = '┌────────┐\n'
    preview += '│  开始  │\n'
    preview += '└───┬────┘\n'
    preview += '    │\n'

    flow.nodes.forEach((node, index) => {
      const icon = this.getNodeIcon(node.type)
      const name = node.name.padEnd(16, ' ')
      
      preview += `┌──────────────────┐\n`
      preview += `│ ${icon} ${name}│\n`
      preview += `└────────┬─────────┘\n`
      
      if (index < flow.nodes.length - 1) {
        preview += '         │\n'
      }
    })

    preview += '    │\n'
    preview += '┌───┴────┐\n'
    preview += '│  结束  │\n'
    preview += '└────────┘'

    return preview
  }

  /**
   * 获取节点图标
   */
  private getNodeIcon(type: string): string {
    const icons: Record<string, string> = {
      start: '🚀',
      approver: '✍️',
      cc: '📧',
      condition: '❓',
      end: '✅',
    }
    return icons[type] || '📍'
  }

  /**
   * 计算预计审批时间
   */
  calculateEstimatedTime(nodes: ApprovalNode[]): number {
    const totalHours = nodes.reduce((sum, node) => {
      return sum + (node.timeoutHours || 24)
    }, 0)

    return totalHours
  }

  /**
   * 获取流程复杂度评分 (1-10)
   */
  getComplexityScore(nodes: ApprovalNode[]): number {
    let score = 0

    // 节点数量
    score += Math.min(nodes.length * 2, 6)

    // 会签节点
    const multiNodes = nodes.filter(n => n.approveMode === 'and')
    score += multiNodes.length

    // 超时设置
    const longTimeout = nodes.filter(n => n.timeoutHours > 48)
    score += longTimeout.length

    return Math.min(score, 10)
  }
}
