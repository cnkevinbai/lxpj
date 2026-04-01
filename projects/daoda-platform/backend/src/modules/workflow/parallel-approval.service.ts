/**
 * 并行审批服务
 * 并行审批节点管理、投票机制、结果聚合
 */
import { Injectable } from '@nestjs/common'

// 并行类型
export enum ParallelType {
  ALL_REQUIRED = 'ALL_REQUIRED', // 全部必须审批
  ANY_ONE = 'ANY_ONE', // 任一审批即可
  MAJORITY = 'MAJORITY', // 多数通过
  PERCENTAGE = 'PERCENTAGE', // 百分比通过
  QUORUM = 'QUORUM', // 定额通过
  SEQUENTIAL = 'SEQUENTIAL', // 顺序审批（伪并行）
}

// 投票结果
export enum VoteResult {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ABSTAINED = 'ABSTAINED',
  PENDING = 'PENDING',
}

// 并行节点状态
export enum ParallelNodeStatus {
  INITIALIZING = 'INITIALIZING',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_MERGE = 'WAITING_MERGE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}

// 并行审批节点接口
export interface ParallelApprovalNode {
  id: string
  nodeId: string
  nodeName: string
  processInstanceId?: string
  parallelType: ParallelType
  requiredApprovals: number // 必须审批人数
  approvalThreshold?: number // 通过阈值（百分比类型）
  timeoutMinutes?: number // 超时时间（分钟）
  status: ParallelNodeStatus
  participants: ParallelParticipant[]
  results: ParallelResult[]
  mergeNodeId?: string // 合并节点ID
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
}

// 并行参与者
export interface ParallelParticipant {
  id: string
  nodeId: string
  userId: string
  userName: string
  department?: string
  role?: string
  status: VoteResult
  votedAt?: Date
  comments?: string
  order?: number // 顺序审批时的顺序
  isMandatory?: boolean // 是否必须参与
}

// 并行审批结果
export interface ParallelResult {
  id: string
  nodeId: string
  participantId: string
  userId: string
  userName: string
  result: VoteResult
  votedAt: Date
  comments?: string
  attachments?: string[]
  duration: number // 审批耗时（分钟）
}

// 并行聚合结果
export interface ParallelAggregation {
  nodeId: string
  nodeName: string
  parallelType: ParallelType
  totalParticipants: number
  approvedCount: number
  rejectedCount: number
  abstainedCount: number
  pendingCount: number
  finalResult: VoteResult
  passRate?: number // 通过率
  reason: string
  completedAt?: Date
  nextNodeId?: string // 下一步节点
}

// 并行节点配置
export interface ParallelNodeConfig {
  id: string
  name: string
  parallelType: ParallelType
  participantSource: 'MANUAL' | 'ROLE' | 'DEPARTMENT' | 'DYNAMIC'
  participantRoles?: string[]
  participantDepartments?: string[]
  participantUserIds?: string[]
  requiredApprovals?: number
  approvalThreshold?: number
  timeoutMinutes?: number
  enableReminder?: boolean
  reminderInterval?: number // 提醒间隔（分钟）
  enableEscalation?: boolean // 超时升级
  escalationTo?: string // 升级给谁
}

@Injectable()
export class ParallelApprovalService {
  private parallelNodes: Map<string, ParallelApprovalNode> = new Map()
  private parallelConfigs: Map<string, ParallelNodeConfig> = new Map()
  private parallelResults: Map<string, ParallelResult[]> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化并行节点配置
    const mockConfigs: ParallelNodeConfig[] = [
      {
        id: 'PNC-001',
        name: '采购审批委员会',
        parallelType: ParallelType.MAJORITY,
        participantSource: 'ROLE',
        participantRoles: ['财务经理', '采购经理', '技术经理'],
        requiredApprovals: 3,
        timeoutMinutes: 120,
        enableReminder: true,
        reminderInterval: 30,
        enableEscalation: true,
        escalationTo: '总经理',
      },
      {
        id: 'PNC-002',
        name: '合同评审',
        parallelType: ParallelType.ALL_REQUIRED,
        participantSource: 'DEPARTMENT',
        participantDepartments: ['法务部', '财务部', '商务部'],
        requiredApprovals: 3,
        timeoutMinutes: 480,
        enableReminder: true,
        reminderInterval: 60,
      },
      {
        id: 'PNC-003',
        name: '紧急事项审批',
        parallelType: ParallelType.ANY_ONE,
        participantSource: 'ROLE',
        participantRoles: ['值班经理', '主管', '总监'],
        requiredApprovals: 1,
        timeoutMinutes: 30,
      },
      {
        id: 'PNC-004',
        name: '预算审批',
        parallelType: ParallelType.PERCENTAGE,
        participantSource: 'MANUAL',
        participantUserIds: ['U-001', 'U-002', 'U-003', 'U-004', 'U-005'],
        requiredApprovals: 5,
        approvalThreshold: 60, // 60%通过
        timeoutMinutes: 240,
      },
      {
        id: 'PNC-005',
        name: '重要决策投票',
        parallelType: ParallelType.QUORUM,
        participantSource: 'DYNAMIC',
        requiredApprovals: 7, // 至少7人投票
        timeoutMinutes: 1440,
      },
    ]

    mockConfigs.forEach((config) => {
      this.parallelConfigs.set(config.id, config)
    })

    // 初始化并行审批节点实例
    const mockNodes: ParallelApprovalNode[] = [
      {
        id: 'PAN-001',
        nodeId: 'N-PARALLEL-001',
        nodeName: '采购审批委员会',
        processInstanceId: 'PI-001',
        parallelType: ParallelType.MAJORITY,
        requiredApprovals: 3,
        timeoutMinutes: 120,
        status: ParallelNodeStatus.IN_PROGRESS,
        participants: [
          {
            id: 'PP-001',
            nodeId: 'N-PARALLEL-001',
            userId: 'U-002',
            userName: '李四',
            department: '财务部',
            role: '财务经理',
            status: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 60 * 60 * 1000),
            comments: '同意采购',
            isMandatory: true,
          },
          {
            id: 'PP-002',
            nodeId: 'N-PARALLEL-001',
            userId: 'U-003',
            userName: '王五',
            department: '采购部',
            role: '采购经理',
            status: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 30 * 60 * 1000),
            comments: '价格合理，同意',
            isMandatory: true,
          },
          {
            id: 'PP-003',
            nodeId: 'N-PARALLEL-001',
            userId: 'U-004',
            userName: '赵六',
            department: '技术部',
            role: '技术经理',
            status: VoteResult.PENDING,
            isMandatory: true,
          },
        ],
        results: [
          {
            id: 'PR-001',
            nodeId: 'N-PARALLEL-001',
            participantId: 'PP-001',
            userId: 'U-002',
            userName: '李四',
            result: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 60 * 60 * 1000),
            comments: '同意采购',
            duration: 30,
          },
          {
            id: 'PR-002',
            nodeId: 'N-PARALLEL-001',
            participantId: 'PP-002',
            userId: 'U-003',
            userName: '王五',
            result: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 30 * 60 * 1000),
            comments: '价格合理，同意',
            duration: 45,
          },
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        mergeNodeId: 'N-MERGE-001',
      },
      {
        id: 'PAN-002',
        nodeId: 'N-PARALLEL-002',
        nodeName: '合同评审',
        processInstanceId: 'PI-002',
        parallelType: ParallelType.ALL_REQUIRED,
        requiredApprovals: 3,
        timeoutMinutes: 480,
        status: ParallelNodeStatus.IN_PROGRESS,
        participants: [
          {
            id: 'PP-004',
            nodeId: 'N-PARALLEL-002',
            userId: 'U-007',
            userName: '周九',
            department: '法务部',
            status: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            comments: '合同条款合法',
            isMandatory: true,
          },
          {
            id: 'PP-005',
            nodeId: 'N-PARALLEL-002',
            userId: 'U-008',
            userName: '吴十',
            department: '财务部',
            status: VoteResult.PENDING,
            isMandatory: true,
          },
          {
            id: 'PP-006',
            nodeId: 'N-PARALLEL-002',
            userId: 'U-009',
            userName: '郑一',
            department: '商务部',
            status: VoteResult.PENDING,
            isMandatory: true,
          },
        ],
        results: [
          {
            id: 'PR-003',
            nodeId: 'N-PARALLEL-002',
            participantId: 'PP-004',
            userId: 'U-007',
            userName: '周九',
            result: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            comments: '合同条款合法',
            duration: 480,
          },
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: 'PAN-003',
        nodeId: 'N-PARALLEL-003',
        nodeName: '紧急事项审批',
        processInstanceId: 'PI-003',
        parallelType: ParallelType.ANY_ONE,
        requiredApprovals: 1,
        timeoutMinutes: 30,
        status: ParallelNodeStatus.COMPLETED,
        participants: [
          {
            id: 'PP-007',
            nodeId: 'N-PARALLEL-003',
            userId: 'U-010',
            userName: '值班经理A',
            status: VoteResult.PENDING,
          },
          {
            id: 'PP-008',
            nodeId: 'N-PARALLEL-003',
            userId: 'U-011',
            userName: '值班经理B',
            status: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 30 * 60 * 1000),
            comments: '紧急同意',
          },
        ],
        results: [
          {
            id: 'PR-004',
            nodeId: 'N-PARALLEL-003',
            participantId: 'PP-008',
            userId: 'U-011',
            userName: '值班经理B',
            result: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 30 * 60 * 1000),
            comments: '紧急同意',
            duration: 5,
          },
        ],
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 'PAN-004',
        nodeId: 'N-PARALLEL-004',
        nodeName: '预算审批投票',
        processInstanceId: 'PI-004',
        parallelType: ParallelType.PERCENTAGE,
        requiredApprovals: 5,
        approvalThreshold: 60,
        timeoutMinutes: 240,
        status: ParallelNodeStatus.WAITING_MERGE,
        participants: [
          {
            id: 'PP-009',
            nodeId: 'N-PARALLEL-004',
            userId: 'U-001',
            userName: '张三',
            status: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          },
          {
            id: 'PP-010',
            nodeId: 'N-PARALLEL-004',
            userId: 'U-002',
            userName: '李四',
            status: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: 'PP-011',
            nodeId: 'N-PARALLEL-004',
            userId: 'U-003',
            userName: '王五',
            status: VoteResult.REJECTED,
            votedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            comments: '预算偏高',
          },
          {
            id: 'PP-012',
            nodeId: 'N-PARALLEL-004',
            userId: 'U-004',
            userName: '赵六',
            status: VoteResult.APPROVED,
            votedAt: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            id: 'PP-013',
            nodeId: 'N-PARALLEL-004',
            userId: 'U-005',
            userName: '钱七',
            status: VoteResult.ABSTAINED,
            votedAt: new Date(Date.now() - 15 * 60 * 1000),
            comments: '不了解详情',
          },
        ],
        results: [],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ]

    mockNodes.forEach((node) => {
      this.parallelNodes.set(node.id, node)
    })
  }

  // 获取并行节点配置列表
  async getParallelConfigs(): Promise<ParallelNodeConfig[]> {
    return Array.from(this.parallelConfigs.values())
  }

  // 获取并行节点配置详情
  async getParallelConfig(id: string): Promise<ParallelNodeConfig | null> {
    return this.parallelConfigs.get(id) || null
  }

  // 获取并行审批节点列表
  async getParallelNodes(query?: {
    status?: ParallelNodeStatus
    parallelType?: ParallelType
    processInstanceId?: string
  }): Promise<ParallelApprovalNode[]> {
    let nodes = Array.from(this.parallelNodes.values())

    if (query) {
      if (query.status) {
        nodes = nodes.filter((n) => n.status === query.status)
      }
      if (query.parallelType) {
        nodes = nodes.filter((n) => n.parallelType === query.parallelType)
      }
      if (query.processInstanceId) {
        nodes = nodes.filter((n) => n.processInstanceId === query.processInstanceId)
      }
    }

    return nodes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // 获取并行审批节点详情
  async getParallelNode(id: string): Promise<ParallelApprovalNode | null> {
    return this.parallelNodes.get(id) || null
  }

  // 获取参与者列表
  async getParticipants(nodeId: string): Promise<ParallelParticipant[]> {
    const node = this.parallelNodes.get(nodeId)
    return node?.participants || []
  }

  // 获取审批结果列表
  async getParallelResults(nodeId: string): Promise<ParallelResult[]> {
    const node = this.parallelNodes.get(nodeId)
    return node?.results || []
  }

  // 执行投票
  async vote(
    nodeId: string,
    participantId: string,
    result: VoteResult,
    comments?: string,
  ): Promise<ParallelResult | null> {
    const node = this.parallelNodes.get(nodeId)
    if (!node) return null

    const participant = node.participants.find((p) => p.id === participantId)
    if (!participant) return null

    // 更新参与者状态
    participant.status = result
    participant.votedAt = new Date()
    participant.comments = comments

    // 创建结果记录
    const parallelResult: ParallelResult = {
      id: `PR-${Date.now()}`,
      nodeId,
      participantId,
      userId: participant.userId,
      userName: participant.userName,
      result,
      votedAt: new Date(),
      comments,
      duration: Math.round(
        (new Date().getTime() - (node.startedAt?.getTime() || node.createdAt.getTime())) /
          (60 * 1000),
      ),
    }

    node.results.push(parallelResult)

    // 检查是否需要聚合
    const aggregation = this.checkAggregation(node)
    if (aggregation.finalResult !== VoteResult.PENDING) {
      node.status = ParallelNodeStatus.COMPLETED
      node.completedAt = new Date()
    }

    return parallelResult
  }

  // 检查聚合条件
  private checkAggregation(node: ParallelApprovalNode): ParallelAggregation {
    const approvedCount = node.participants.filter((p) => p.status === VoteResult.APPROVED).length
    const rejectedCount = node.participants.filter((p) => p.status === VoteResult.REJECTED).length
    const abstainedCount = node.participants.filter((p) => p.status === VoteResult.ABSTAINED).length
    const pendingCount = node.participants.filter((p) => p.status === VoteResult.PENDING).length

    let finalResult: VoteResult = VoteResult.PENDING
    let reason: string = ''
    let passRate: number | undefined

    const totalParticipants = node.participants.length
    const votedCount = totalParticipants - pendingCount

    switch (node.parallelType) {
      case ParallelType.ALL_REQUIRED:
        // 全部必须审批：所有人必须同意
        if (approvedCount === totalParticipants) {
          finalResult = VoteResult.APPROVED
          reason = '全部参与者同意'
        } else if (rejectedCount > 0) {
          finalResult = VoteResult.REJECTED
          reason = '有人拒绝'
        } else if (pendingCount === 0 && approvedCount < totalParticipants) {
          finalResult = VoteResult.REJECTED
          reason = '未获全员同意'
        }
        break

      case ParallelType.ANY_ONE:
        // 任一审批：只需一人同意
        if (approvedCount >= 1) {
          finalResult = VoteResult.APPROVED
          reason = '获得批准'
        } else if (rejectedCount === totalParticipants) {
          finalResult = VoteResult.REJECTED
          reason = '所有人拒绝'
        }
        break

      case ParallelType.MAJORITY:
        // 多数通过：超过半数同意
        passRate = (approvedCount / totalParticipants) * 100
        if (approvedCount > totalParticipants / 2) {
          finalResult = VoteResult.APPROVED
          reason = `多数同意 (${approvedCount}/${totalParticipants})`
        } else if (votedCount > totalParticipants / 2 && approvedCount <= totalParticipants / 2) {
          finalResult = VoteResult.REJECTED
          reason = '未达多数'
        }
        break

      case ParallelType.PERCENTAGE:
        // 百分比通过：达到阈值
        passRate = (approvedCount / totalParticipants) * 100
        const threshold = node.approvalThreshold || 50
        if (passRate >= threshold) {
          finalResult = VoteResult.APPROVED
          reason = `通过率 ${passRate.toFixed(1)}% >= ${threshold}%`
        } else if (votedCount === totalParticipants) {
          finalResult = VoteResult.REJECTED
          reason = `通过率 ${passRate.toFixed(1)}% < ${threshold}%`
        }
        break

      case ParallelType.QUORUM:
        // 定额通过：达到定额人数
        if (approvedCount >= node.requiredApprovals) {
          finalResult = VoteResult.APPROVED
          reason = `达到定额 ${approvedCount} >= ${node.requiredApprovals}`
        } else if (votedCount === totalParticipants) {
          finalResult = VoteResult.REJECTED
          reason = `未达定额 ${approvedCount} < ${node.requiredApprovals}`
        }
        break
    }

    return {
      nodeId: node.nodeId,
      nodeName: node.nodeName,
      parallelType: node.parallelType,
      totalParticipants,
      approvedCount,
      rejectedCount,
      abstainedCount,
      pendingCount,
      finalResult,
      passRate,
      reason,
      completedAt: finalResult !== VoteResult.PENDING ? new Date() : undefined,
    }
  }

  // 获取聚合结果
  async getAggregation(nodeId: string): Promise<ParallelAggregation | null> {
    const node = this.parallelNodes.get(nodeId)
    if (!node) return null
    return this.checkAggregation(node)
  }

  // 获取并行审批统计
  async getParallelStats(): Promise<{
    totalNodes: number
    inProgressNodes: number
    completedNodes: number
    avgCompletionTime: number
    byType: Record<ParallelType, number>
    approvalRate: number
  }> {
    const nodes = Array.from(this.parallelNodes.values())
    const completedNodes = nodes.filter((n) => n.status === ParallelNodeStatus.COMPLETED)

    const byType: Record<ParallelType, number> = {} as any
    nodes.forEach((n) => {
      byType[n.parallelType] = (byType[n.parallelType] || 0) + 1
    })

    const avgCompletionTime =
      completedNodes.length > 0
        ? completedNodes.reduce((sum, n) => {
            const duration = n.completedAt!.getTime() - n.startedAt!.getTime()
            return sum + duration
          }, 0) / completedNodes.length
        : 0

    const approvedNodes = completedNodes.filter(
      (n) => this.checkAggregation(n).finalResult === VoteResult.APPROVED,
    )

    return {
      totalNodes: nodes.length,
      inProgressNodes: nodes.filter((n) => n.status === ParallelNodeStatus.IN_PROGRESS).length,
      completedNodes: completedNodes.length,
      avgCompletionTime: avgCompletionTime / (60 * 1000), // 转换为分钟
      byType,
      approvalRate:
        completedNodes.length > 0 ? (approvedNodes.length / completedNodes.length) * 100 : 0,
    }
  }

  // 检查超时
  async checkTimeout(): Promise<
    { nodeId: string; nodeName: string; minutesElapsed: number; timeoutMinutes: number }[]
  > {
    const nodes = Array.from(this.parallelNodes.values()).filter(
      (n) => n.status === ParallelNodeStatus.IN_PROGRESS && n.timeoutMinutes,
    )

    const now = new Date()
    const timeoutNodes: any[] = []

    for (const node of nodes) {
      const elapsed =
        (now.getTime() - (node.startedAt?.getTime() || node.createdAt.getTime())) / (60 * 1000)
      if (elapsed > node.timeoutMinutes!) {
        timeoutNodes.push({
          nodeId: node.nodeId,
          nodeName: node.nodeName,
          minutesElapsed: Math.round(elapsed),
          timeoutMinutes: node.timeoutMinutes,
        })
        // 更新状态
        node.status = ParallelNodeStatus.TIMEOUT
      }
    }

    return timeoutNodes
  }
}
