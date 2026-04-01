/**
 * 流程监控服务
 * 流程执行监控、性能分析、瓶颈识别
 */
import { Injectable } from '@nestjs/common'

// 流程状态
export enum ProcessStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  TIMEOUT = 'TIMEOUT',
}

// 节点状态
export enum NodeStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

// 节点类型
export enum NodeType {
  START = 'START',
  END = 'END',
  APPROVAL = 'APPROVAL',
  CONDITION = 'CONDITION',
  PARALLEL = 'PARALLEL',
  MERGE = 'MERGE',
  AUTOMATION = 'AUTOMATION',
  SUBPROCESS = 'SUBPROCESS',
}

// 流程执行实例
export interface ProcessInstance {
  id: string
  definitionId: string
  definitionName: string
  status: ProcessStatus
  initiatorId: string
  initiatorName: string
  startTime: Date
  endTime?: Date
  duration?: number // 毫秒
  currentNode?: string
  progress: number // 百分比
  nodes: NodeInstance[]
  variables: Record<string, any>
  logs: ProcessLog[]
}

// 节点执行实例
export interface NodeInstance {
  id: string
  nodeId: string
  nodeName: string
  nodeType: NodeType
  status: NodeStatus
  assigneeId?: string
  assigneeName?: string
  startTime?: Date
  endTime?: Date
  duration?: number
  comments?: string
  result?: string
  retryCount?: number
}

// 流程日志
export interface ProcessLog {
  id: string
  processId: string
  nodeId?: string
  action: string
  actorId?: string
  actorName?: string
  timestamp: Date
  details?: string
}

// 流程性能指标
export interface ProcessMetrics {
  definitionId: string
  definitionName: string
  totalInstances: number
  completedInstances: number
  failedInstances: number
  avgDuration: number
  maxDuration: number
  minDuration: number
  avgNodeDurations: Record<string, number>
  bottleneckNodes: string[]
  successRate: number
  timeoutRate: number
}

// 流程告警
export interface ProcessAlert {
  id: string
  type: 'TIMEOUT' | 'FAILED' | 'BOTTLENECK' | 'STUCK'
  processId?: string
  definitionId?: string
  nodeId?: string
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: Date
  resolved?: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

@Injectable()
export class ProcessMonitoringService {
  private processInstances: Map<string, ProcessInstance> = new Map()
  private processLogs: Map<string, ProcessLog[]> = new Map()
  private processMetrics: Map<string, ProcessMetrics> = new Map()
  private processAlerts: Map<string, ProcessAlert> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化模拟流程实例
    const mockInstances: ProcessInstance[] = [
      {
        id: 'PI-001',
        definitionId: 'WF-001',
        definitionName: '采购审批流程',
        status: ProcessStatus.RUNNING,
        initiatorId: 'U-001',
        initiatorName: '张三',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        currentNode: '部门经理审批',
        progress: 60,
        nodes: [
          {
            id: 'NI-001',
            nodeId: 'N-001',
            nodeName: '开始',
            nodeType: NodeType.START,
            status: NodeStatus.COMPLETED,
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            duration: 0,
          },
          {
            id: 'NI-002',
            nodeId: 'N-002',
            nodeName: '提交申请',
            nodeType: NodeType.AUTOMATION,
            status: NodeStatus.COMPLETED,
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000),
            duration: 5000,
          },
          {
            id: 'NI-003',
            nodeId: 'N-003',
            nodeName: '部门经理审批',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.RUNNING,
            assigneeId: 'U-002',
            assigneeName: '李四',
            startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          },
          {
            id: 'NI-004',
            nodeId: 'N-004',
            nodeName: '财务审批',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.PENDING,
            assigneeId: 'U-003',
            assigneeName: '王五',
          },
          {
            id: 'NI-005',
            nodeId: 'N-005',
            nodeName: '总经理审批',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.PENDING,
          },
          {
            id: 'NI-006',
            nodeId: 'N-006',
            nodeName: '结束',
            nodeType: NodeType.END,
            status: NodeStatus.PENDING,
          },
        ],
        variables: { amount: 50000, department: '研发部' },
        logs: [],
      },
      {
        id: 'PI-002',
        definitionId: 'WF-002',
        definitionName: '请假审批流程',
        status: ProcessStatus.COMPLETED,
        initiatorId: 'U-004',
        initiatorName: '赵六',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 20 * 60 * 60 * 1000),
        duration: 4 * 60 * 60 * 1000,
        progress: 100,
        nodes: [
          {
            id: 'NI-007',
            nodeId: 'N-001',
            nodeName: '开始',
            nodeType: NodeType.START,
            status: NodeStatus.COMPLETED,
            duration: 0,
          },
          {
            id: 'NI-008',
            nodeId: 'N-002',
            nodeName: '提交申请',
            nodeType: NodeType.AUTOMATION,
            status: NodeStatus.COMPLETED,
            duration: 3000,
          },
          {
            id: 'NI-009',
            nodeId: 'N-003',
            nodeName: '部门主管审批',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.COMPLETED,
            assigneeId: 'U-002',
            assigneeName: '李四',
            duration: 2 * 60 * 60 * 1000,
            result: 'approved',
            comments: '同意请假',
          },
          {
            id: 'NI-010',
            nodeId: 'N-004',
            nodeName: '人事备案',
            nodeType: NodeType.AUTOMATION,
            status: NodeStatus.COMPLETED,
            duration: 60000,
          },
          {
            id: 'NI-011',
            nodeId: 'N-005',
            nodeName: '结束',
            nodeType: NodeType.END,
            status: NodeStatus.COMPLETED,
            duration: 0,
          },
        ],
        variables: { leaveDays: 3, leaveType: '年假' },
        logs: [],
      },
      {
        id: 'PI-003',
        definitionId: 'WF-001',
        definitionName: '采购审批流程',
        status: ProcessStatus.FAILED,
        initiatorId: 'U-005',
        initiatorName: '钱七',
        startTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 44 * 60 * 60 * 1000),
        duration: 4 * 60 * 60 * 1000,
        progress: 40,
        nodes: [
          {
            id: 'NI-012',
            nodeId: 'N-001',
            nodeName: '开始',
            nodeType: NodeType.START,
            status: NodeStatus.COMPLETED,
            duration: 0,
          },
          {
            id: 'NI-013',
            nodeId: 'N-002',
            nodeName: '提交申请',
            nodeType: NodeType.AUTOMATION,
            status: NodeStatus.COMPLETED,
            duration: 5000,
          },
          {
            id: 'NI-014',
            nodeId: 'N-003',
            nodeName: '部门经理审批',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.FAILED,
            assigneeId: 'U-002',
            assigneeName: '李四',
            duration: 4 * 60 * 60 * 1000,
            result: 'rejected',
            comments: '预算不足，请重新申请',
          },
          {
            id: 'NI-015',
            nodeId: 'N-006',
            nodeName: '结束',
            nodeType: NodeType.END,
            status: NodeStatus.COMPLETED,
            duration: 0,
          },
        ],
        variables: { amount: 100000, department: '市场部' },
        logs: [],
      },
      {
        id: 'PI-004',
        definitionId: 'WF-003',
        definitionName: '合同审批流程',
        status: ProcessStatus.RUNNING,
        initiatorId: 'U-006',
        initiatorName: '孙八',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        currentNode: '法务审核',
        progress: 30,
        nodes: [
          {
            id: 'NI-016',
            nodeId: 'N-001',
            nodeName: '开始',
            nodeType: NodeType.START,
            status: NodeStatus.COMPLETED,
            duration: 0,
          },
          {
            id: 'NI-017',
            nodeId: 'N-002',
            nodeName: '提交合同',
            nodeType: NodeType.AUTOMATION,
            status: NodeStatus.COMPLETED,
            duration: 2000,
          },
          {
            id: 'NI-018',
            nodeId: 'N-003',
            nodeName: '法务审核',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.RUNNING,
            assigneeId: 'U-007',
            assigneeName: '周九',
            startTime: new Date(Date.now() - 25 * 60 * 1000),
          },
          {
            id: 'NI-019',
            nodeId: 'N-004',
            nodeName: '商务审批',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.PENDING,
          },
          {
            id: 'NI-020',
            nodeId: 'N-005',
            nodeName: '总经理审批',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.PENDING,
          },
          {
            id: 'NI-021',
            nodeId: 'N-006',
            nodeName: '签署归档',
            nodeType: NodeType.AUTOMATION,
            status: NodeStatus.PENDING,
          },
          {
            id: 'NI-022',
            nodeId: 'N-007',
            nodeName: '结束',
            nodeType: NodeType.END,
            status: NodeStatus.PENDING,
          },
        ],
        variables: { contractAmount: 500000, partner: 'ABC公司' },
        logs: [],
      },
      {
        id: 'PI-005',
        definitionId: 'WF-004',
        definitionName: '报销审批流程',
        status: ProcessStatus.TIMEOUT,
        initiatorId: 'U-008',
        initiatorName: '吴十',
        startTime: new Date(Date.now() - 72 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
        duration: 24 * 60 * 60 * 1000,
        progress: 50,
        nodes: [
          {
            id: 'NI-023',
            nodeId: 'N-001',
            nodeName: '开始',
            nodeType: NodeType.START,
            status: NodeStatus.COMPLETED,
            duration: 0,
          },
          {
            id: 'NI-024',
            nodeId: 'N-002',
            nodeName: '提交报销',
            nodeType: NodeType.AUTOMATION,
            status: NodeStatus.COMPLETED,
            duration: 3000,
          },
          {
            id: 'NI-025',
            nodeId: 'N-003',
            nodeName: '财务审核',
            nodeType: NodeType.APPROVAL,
            status: NodeStatus.FAILED,
            assigneeId: 'U-003',
            assigneeName: '王五',
            duration: 24 * 60 * 60 * 1000,
            retryCount: 3,
          },
          {
            id: 'NI-026',
            nodeId: 'N-006',
            nodeName: '结束',
            nodeType: NodeType.END,
            status: NodeStatus.COMPLETED,
            duration: 0,
          },
        ],
        variables: { expenseAmount: 3000, expenseType: '差旅费' },
        logs: [],
      },
    ]

    mockInstances.forEach((instance) => {
      this.processInstances.set(instance.id, instance)
    })

    // 初始化性能指标
    const mockMetrics: ProcessMetrics[] = [
      {
        definitionId: 'WF-001',
        definitionName: '采购审批流程',
        totalInstances: 50,
        completedInstances: 35,
        failedInstances: 5,
        avgDuration: 6 * 60 * 60 * 1000,
        maxDuration: 24 * 60 * 60 * 1000,
        minDuration: 1 * 60 * 60 * 1000,
        avgNodeDurations: {
          部门经理审批: 2 * 60 * 60 * 1000,
          财务审批: 3 * 60 * 60 * 1000,
          总经理审批: 1 * 60 * 60 * 1000,
        },
        bottleneckNodes: ['财务审批'],
        successRate: 70,
        timeoutRate: 10,
      },
      {
        definitionId: 'WF-002',
        definitionName: '请假审批流程',
        totalInstances: 100,
        completedInstances: 95,
        failedInstances: 2,
        avgDuration: 2 * 60 * 60 * 1000,
        maxDuration: 8 * 60 * 60 * 1000,
        minDuration: 30 * 60 * 1000,
        avgNodeDurations: {
          部门主管审批: 1.5 * 60 * 60 * 1000,
          人事备案: 30 * 60 * 1000,
        },
        bottleneckNodes: [],
        successRate: 95,
        timeoutRate: 0,
      },
      {
        definitionId: 'WF-003',
        definitionName: '合同审批流程',
        totalInstances: 30,
        completedInstances: 20,
        failedInstances: 3,
        avgDuration: 48 * 60 * 60 * 1000,
        maxDuration: 72 * 60 * 60 * 1000,
        minDuration: 24 * 60 * 60 * 1000,
        avgNodeDurations: {
          法务审核: 24 * 60 * 60 * 1000,
          商务审批: 12 * 60 * 60 * 1000,
          总经理审批: 12 * 60 * 60 * 1000,
        },
        bottleneckNodes: ['法务审核'],
        successRate: 66.7,
        timeoutRate: 10,
      },
      {
        definitionId: 'WF-004',
        definitionName: '报销审批流程',
        totalInstances: 200,
        completedInstances: 180,
        failedInstances: 10,
        avgDuration: 4 * 60 * 60 * 1000,
        maxDuration: 48 * 60 * 60 * 1000,
        minDuration: 30 * 60 * 1000,
        avgNodeDurations: {
          财务审核: 3 * 60 * 60 * 1000,
        },
        bottleneckNodes: ['财务审核'],
        successRate: 90,
        timeoutRate: 5,
      },
    ]

    mockMetrics.forEach((metrics) => {
      this.processMetrics.set(metrics.definitionId, metrics)
    })

    // 初始化告警
    const mockAlerts: ProcessAlert[] = [
      {
        id: 'AL-001',
        type: 'TIMEOUT',
        processId: 'PI-005',
        definitionId: 'WF-004',
        nodeId: 'N-003',
        message: '报销审批流程超时，财务审核节点超过24小时未处理',
        severity: 'HIGH',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        resolved: false,
      },
      {
        id: 'AL-002',
        type: 'BOTTLENECK',
        definitionId: 'WF-001',
        nodeId: 'N-004',
        message: '采购审批流程中财务审批节点平均耗时3小时，建议优化',
        severity: 'MEDIUM',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        resolved: false,
      },
      {
        id: 'AL-003',
        type: 'STUCK',
        processId: 'PI-001',
        nodeId: 'N-003',
        message: '采购审批流程在部门经理审批节点停留超过2小时',
        severity: 'LOW',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        resolved: false,
      },
    ]

    mockAlerts.forEach((alert) => {
      this.processAlerts.set(alert.id, alert)
    })
  }

  // 获取流程实例列表
  async getProcessInstances(query?: {
    definitionId?: string
    status?: ProcessStatus
    initiatorId?: string
    startDate?: Date
    endDate?: Date
  }): Promise<ProcessInstance[]> {
    let instances = Array.from(this.processInstances.values())

    if (query) {
      if (query.definitionId) {
        instances = instances.filter((i) => i.definitionId === query.definitionId)
      }
      if (query.status) {
        instances = instances.filter((i) => i.status === query.status)
      }
      if (query.initiatorId) {
        instances = instances.filter((i) => i.initiatorId === query.initiatorId)
      }
      if (query.startDate) {
        instances = instances.filter((i) => i.startTime >= query.startDate!)
      }
      if (query.endDate) {
        instances = instances.filter((i) => i.startTime <= query.endDate!)
      }
    }

    return instances.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
  }

  // 获取流程实例详情
  async getProcessInstance(id: string): Promise<ProcessInstance | null> {
    return this.processInstances.get(id) || null
  }

  // 获取流程性能指标
  async getProcessMetrics(definitionId?: string): Promise<ProcessMetrics[]> {
    if (definitionId) {
      const metrics = this.processMetrics.get(definitionId)
      return metrics ? [metrics] : []
    }
    return Array.from(this.processMetrics.values())
  }

  // 获取流程告警
  async getProcessAlerts(query?: {
    type?: string
    severity?: string
    resolved?: boolean
  }): Promise<ProcessAlert[]> {
    let alerts = Array.from(this.processAlerts.values())

    if (query) {
      if (query.type) {
        alerts = alerts.filter((a) => a.type === query.type)
      }
      if (query.severity) {
        alerts = alerts.filter((a) => a.severity === query.severity)
      }
      if (query.resolved !== undefined) {
        alerts = alerts.filter((a) => a.resolved === query.resolved)
      }
    }

    return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // 解决告警
  async resolveAlert(id: string, resolvedBy: string): Promise<ProcessAlert | null> {
    const alert = this.processAlerts.get(id)
    if (!alert) return null

    alert.resolved = true
    alert.resolvedAt = new Date()
    alert.resolvedBy = resolvedBy

    return alert
  }

  // 获取实时监控统计
  async getMonitoringStats(): Promise<{
    runningInstances: number
    completedToday: number
    failedToday: number
    avgDurationToday: number
    pendingAlerts: number
    criticalAlerts: number
  }> {
    const instances = Array.from(this.processInstances.values())
    const alerts = Array.from(this.processAlerts.values())
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayInstances = instances.filter((i) => i.startTime >= today)
    const completedToday = todayInstances.filter((i) => i.status === ProcessStatus.COMPLETED)
    const failedToday = todayInstances.filter(
      (i) => i.status === ProcessStatus.FAILED || i.status === ProcessStatus.TIMEOUT,
    )

    return {
      runningInstances: instances.filter((i) => i.status === ProcessStatus.RUNNING).length,
      completedToday: completedToday.length,
      failedToday: failedToday.length,
      avgDurationToday:
        completedToday.length > 0
          ? completedToday.reduce((sum, i) => sum + (i.duration || 0), 0) / completedToday.length
          : 0,
      pendingAlerts: alerts.filter((a) => !a.resolved).length,
      criticalAlerts: alerts.filter((a) => !a.resolved && a.severity === 'CRITICAL').length,
    }
  }

  // 获取瓶颈分析
  async getBottleneckAnalysis(): Promise<{
    bottlenecks: { nodeId: string; nodeName: string; avgDuration: number; impactScore: number }[]
    recommendations: string[]
  }> {
    const metrics = Array.from(this.processMetrics.values())
    const bottlenecks: any[] = []

    metrics.forEach((m) => {
      m.bottleneckNodes.forEach((nodeName) => {
        const avgDuration = m.avgNodeDurations[nodeName] || 0
        bottlenecks.push({
          nodeId: `${m.definitionId}-${nodeName}`,
          nodeName,
          definitionName: m.definitionName,
          avgDuration,
          impactScore: (avgDuration / m.avgDuration) * 100,
        })
      })
    })

    const recommendations = [
      '财务审批节点平均耗时较长，建议增加并行审批或自动化初审',
      '法务审核节点建议设置自动提醒和超时升级机制',
      '部门经理审批节点建议使用移动端审批提升效率',
      '建议为关键节点设置SLA时限和超时告警',
    ]

    return {
      bottlenecks: bottlenecks.sort((a, b) => b.impactScore - a.impactScore),
      recommendations,
    }
  }

  // 获取节点执行详情
  async getNodeExecutionDetails(processId: string, nodeId: string): Promise<NodeInstance | null> {
    const instance = this.processInstances.get(processId)
    if (!instance) return null

    return instance.nodes.find((n) => n.nodeId === nodeId) || null
  }
}
