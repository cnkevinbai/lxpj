// 工作流类型定义

export type WorkflowStatus = 'draft' | 'active' | 'suspended' | 'deleted'
export type InstanceStatus = 'running' | 'completed' | 'failed' | 'suspended' | 'cancelled'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
export type NodeType = 'start' | 'end' | 'approval' | 'condition' | 'parallel' | 'task' | 'subprocess'
export type ApprovalType = 'sequential' | 'parallel' | 'or'

/**
 * 工作流定义
 */
export interface WorkflowDefinition {
  id: string
  key: string
  name: string
  description?: string
  version: number
  status: WorkflowStatus
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  variables: VariableDefinition[]
  triggers?: Trigger[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

/**
 * 流程节点
 */
export interface WorkflowNode {
  id: string
  key: string
  name: string
  type: NodeType
  config: NodeConfig
  position: {
    x: number
    y: number
  }
  incomingEdges: string[]
  outgoingEdges: string[]
}

/**
 * 节点配置
 */
export interface NodeConfig {
  // 审批节点配置
  approvalType?: ApprovalType
  approvers?: ApproverConfig[]
  timeout?: number
  timeoutAction?: 'auto_approve' | 'auto_reject' | 'escalate'
  
  // 条件节点配置
  condition?: string
  
  // 任务节点配置
  taskType?: string
  handler?: string
  
  // 子流程配置
  subprocessKey?: string
  
  // 通用配置
  allowSkip?: boolean
  allowReject?: boolean
  allowDelegate?: boolean
  allowAddApprover?: boolean
  ccUsers?: string[]
}

/**
 * 审批人配置
 */
export type ApproverConfig = 
  | { type: 'user'; userId: string }
  | { type: 'role'; roleId: string }
  | { type: 'department'; departmentId: string }
  | { type: 'variable'; variableName: string }
  | { type: 'manager'; level: number }

/**
 * 流程边
 */
export interface WorkflowEdge {
  id: string
  sourceNodeId: string
  targetNodeId: string
  condition?: string
  label?: string
}

/**
 * 变量定义
 */
export interface VariableDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array'
  required: boolean
  defaultValue?: any
  description?: string
}

/**
 * 触发器
 */
export interface Trigger {
  type: 'manual' | 'auto' | 'schedule' | 'event'
  eventType?: string
  cronExpression?: string
  condition?: string
}

/**
 * 流程实例
 */
export interface WorkflowInstance {
  id: string
  definitionId: string
  definitionKey: string
  definitionName: string
  status: InstanceStatus
  businessKey?: string
  businessType?: string
  variables: Record<string, any>
  currentNodeIds: string[]
  startTime: Date
  endTime?: Date
  duration?: number
  createdBy: string
  completedBy?: string
}

/**
 * 流程任务
 */
export interface WorkflowTask {
  id: string
  instanceId: string
  nodeId: string
  nodeName: string
  definitionId: string
  status: TaskStatus
  assignee?: string
  candidates?: string[]
  approvers?: TaskApprover[]
  variables: Record<string, any>
  startTime: Date
  endTime?: Date
  dueDate?: Date
  priority: number
  comment?: string
  actions?: TaskAction[]
}

/**
 * 任务审批人
 */
export interface TaskApprover {
  userId: string
  userName: string
  status: 'pending' | 'approved' | 'rejected'
  actionTime?: Date
  comment?: string
}

/**
 * 任务操作
 */
export interface TaskAction {
  type: 'approve' | 'reject' | 'delegate' | 'add_approver' | 'skip'
  userId: string
  userName: string
  comment?: string
  actionTime: Date
}

/**
 * 流程日志
 */
export interface WorkflowLog {
  id: string
  instanceId: string
  type: 'system' | 'user' | 'error'
  action: string
  userId?: string
  userName?: string
  nodeId?: string
  nodeName?: string
  variables?: Record<string, any>
  message: string
  timestamp: Date
}

/**
 * 流程监控数据
 */
export interface ProcessMonitor {
  totalInstances: number
  runningInstances: number
  completedInstances: number
  failedInstances: number
  suspendedInstances: number
  avgCompletionTime: number
  tasksByStatus: {
    pending: number
    in_progress: number
    completed: number
  }
  tasksByUser: Array<{
    userId: string
    userName: string
    pendingTasks: number
    completedTasks: number
  }>
}
