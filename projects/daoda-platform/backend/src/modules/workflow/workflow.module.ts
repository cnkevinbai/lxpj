/**
 * Workflow 审批流程引擎模块
 * 热插拔核心模块 - 支持钉钉审批双向同步
 *
 * 功能范围:
 * - 流程定义管理 (创建/编辑/激活/停用)
 * - 流程实例运行 (启动/审批/流转)
 * - 钉钉审批同步 (推送/回调)
 * - 审批历史记录 (完整可追溯)
 *
 * @version 1.0.0
 * @since 2026-03-30
 */

import { BaseModule } from '../../core/module/base-module'
import {
  ModuleManifest,
  ModuleContext,
  HotUpdateStrategy,
  ModuleMenuItem,
  ModulePermission,
  PermissionType,
  ModuleRoute,
  HttpMethod,
  ModuleEvent,
  EventType,
} from '../../core/module/interfaces'

// ============================================
// 类型定义导出
// ============================================

// 节点类型
export enum NodeType {
  START = 'start',
  APPROVE = 'approve',
  CONDITION = 'condition',
  PARALLEL = 'parallel',
  END = 'end',
}

// 审批人类型
export enum ApproverType {
  USER = 'user',
  ROLE = 'role',
  DEPT_HEAD = 'dept_head',
  INITIATOR = 'initiator',
  FORM_FIELD = 'form_field',
}

// 审批模式
export enum ApproveMode {
  SINGLE = 'single',
  ALL = 'all',
  ANY = 'any',
  SEQUENCE = 'sequence',
}

// 实例状态
export enum InstanceStatus {
  RUNNING = 'running',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  TIMEOUT = 'timeout',
}

// 审批动作
export enum ApprovalAction {
  APPROVE = 'approve',
  REJECT = 'reject',
  TRANSFER = 'transfer',
  RETURN = 'return',
  CANCEL = 'cancel',
}

// 审批来源
export enum ApprovalSource {
  SYSTEM = 'system',
  DINGTALK = 'dingtalk',
}

// 同步方向
export enum SyncDirection {
  TO_DINGTALK = 'to_dingtalk',
  BIDIRECTIONAL = 'bidirectional',
}

// 钉钉状态
export enum DingTalkStatus {
  NEW = 'NEW',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

// 钉钉结果
export enum DingTalkResult {
  AGREE = 'agree',
  REFUSE = 'refuse',
  REDIRECT = 'redirect',
}

// ============================================
// 数据接口导出
// ============================================

// 分支条件
export interface BranchCondition {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains'
  value: any
  targetNodeId: string
}

// 超时动作
export type TimeoutAction = 'auto_approve' | 'auto_reject' | 'notify' | 'transfer'

// 流程节点
export interface WorkflowNode {
  id: string
  name: string
  type: NodeType
  order: number
  approverType?: ApproverType
  approverId?: string
  approverRole?: string
  approveMode?: ApproveMode
  conditions?: BranchCondition[]
  dingtalkSync?: boolean
  dingtalkProcessCode?: string
  timeout?: number
  timeoutAction?: TimeoutAction
}

// 流程定义
export interface WorkflowDefinition {
  id: string
  name: string
  code: string
  category: string
  version: number
  description?: string
  nodes: WorkflowNode[]
  isActive: boolean
  dingtalkEnabled?: boolean
  dingtalkProcessCode?: string
  syncDirection?: SyncDirection
  createdBy: string
  createdAt: Date
  updatedAt?: Date
}

// 流程实例
export interface WorkflowInstance {
  id: string
  definitionId: string
  definitionCode: string
  businessType: string
  businessId: string
  title: string
  content?: string
  formData?: Record<string, any>
  initiatorId: string
  initiatorName?: string
  status: InstanceStatus
  currentNodeId: string
  currentNodeName?: string
  currentApproverIds?: string[]
  dingtalkInstanceId?: string
  dingtalkStatus?: DingTalkStatus
  createdAt: Date
  updatedAt: Date
  finishedAt?: Date
  result?: ApprovalAction
}

// 审批记录
export interface ApprovalRecord {
  id: string
  instanceId: string
  nodeId: string
  nodeName: string
  approverId: string
  approverName: string
  action: ApprovalAction
  comment?: string
  attachments?: string[]
  approvedAt: Date
  source: ApprovalSource
  transferToId?: string
  transferToName?: string
}

// ============================================
// DTO 接口导出
// ============================================

// 创建流程定义DTO
export interface CreateWorkflowDefinitionDto {
  name: string
  code: string
  category: string
  description?: string
  nodes: WorkflowNode[]
  dingtalkEnabled?: boolean
  dingtalkProcessCode?: string
  syncDirection?: SyncDirection
}

// 更新流程定义DTO
export interface UpdateWorkflowDefinitionDto {
  name?: string
  description?: string
  nodes?: WorkflowNode[]
  dingtalkEnabled?: boolean
  dingtalkProcessCode?: string
  syncDirection?: SyncDirection
}

// 启动流程DTO
export interface StartWorkflowDto {
  definitionCode: string
  businessType: string
  businessId: string
  title: string
  content?: string
  formData?: Record<string, any>
  initiatorId: string
  dingtalkSync?: boolean
}

// 审批操作DTO
export interface ApproveDto {
  instanceId: string
  approverId: string
  comment?: string
  attachments?: string[]
}

// 拒绝DTO
export interface RejectDto {
  instanceId: string
  approverId: string
  comment: string
  attachments?: string[]
}

// 转交DTO
export interface TransferDto {
  instanceId: string
  approverId: string
  transferToId: string
  comment?: string
}

// 退回DTO
export interface ReturnDto {
  instanceId: string
  approverId: string
  returnToNodeId?: string
  comment: string
}

// 撤销DTO
export interface CancelDto {
  instanceId: string
  initiatorId: string
  reason: string
}

// 钉钉回调DTO
export interface DingTalkCallbackDto {
  processInstanceId: string
  result: DingTalkResult
  approverUserId: string
  comment?: string
  timestamp: number
  businessId?: string
}

// ============================================
// 模块清单定义
// ============================================

export const WORKFLOW_MODULE_MANIFEST: ModuleManifest = {
  id: '@daoda/workflow',
  name: '审批流程引擎',
  version: '1.0.0',
  description: '审批流程管理引擎，支持钉钉审批双向同步',
  category: 'core',
  tags: ['workflow', 'approval', 'dingtalk', 'bpm'],
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
    { id: '@daoda/notification', version: '>=1.0.0', optional: true },
    { id: '@daoda/dingtalk', version: '>=1.0.0', optional: true },
  ],
  permissions: [
    'workflow:definition:view',
    'workflow:definition:create',
    'workflow:definition:update',
    'workflow:definition:delete',
    'workflow:instance:view',
    'workflow:instance:start',
    'workflow:instance:approve',
    'workflow:instance:cancel',
    'workflow:dingtalk:sync',
    'workflow:admin',
  ],
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },
}

// ============================================
// Workflow 模块实现
// ============================================

export class WorkflowModule extends BaseModule {
  readonly manifest = WORKFLOW_MODULE_MANIFEST

  // 存储服务
  private definitions: Map<string, WorkflowDefinition> = new Map()
  private instances: Map<string, WorkflowInstance> = new Map()
  private records: Map<string, ApprovalRecord[]> = new Map()

  // ============================================
  // 生命周期钩子
  // ============================================

  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('Workflow 模块安装开始...')

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      defaultTimeout: 48, // 默认超时48小时
      timeoutAction: 'notify',
      dingtalkCallbackUrl: '/api/v1/workflow/dingtalk/callback',
      enableAutoNotify: true,
    })

    // 创建默认审批流程模板
    await this.createDefaultTemplates()

    this.logger?.info('Workflow 模块安装完成')
  }

  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('Workflow 模块启动...')

    // 注册钉钉回调监听
    const dingtalk = this._context?.serviceRegistry.get<any>('dingtalk')
    if (dingtalk) {
      dingtalk.registerCallback('workflow_approval', this.handleDingTalkCallback.bind(this))
      this.logger?.info('钉钉审批回调已注册')
    }

    // 启动超时检查定时任务
    this.startTimeoutChecker()

    // 发送模块启动事件
    await this._context?.eventBus.emit('workflow.module.started', {
      moduleId: this.manifest.id,
      timestamp: Date.now(),
    })

    this.logger?.info('Workflow 模块已启动')
  }

  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('Workflow 模块停止...')

    // 停止超时检查
    this.stopTimeoutChecker()

    // 发送模块停止事件
    await this._context?.eventBus.emit('workflow.module.stopped', {
      moduleId: this.manifest.id,
      timestamp: Date.now(),
    })
  }

  // ============================================
  // 流程定义服务
  // ============================================

  /**
   * 创建流程定义
   */
  async createDefinition(
    dto: CreateWorkflowDefinitionDto,
    userId: string,
  ): Promise<WorkflowDefinition> {
    const definition: WorkflowDefinition = {
      id: `wf-${dto.code}-${Date.now()}`,
      name: dto.name,
      code: dto.code,
      category: dto.category,
      version: 1,
      description: dto.description,
      nodes: dto.nodes,
      isActive: false, // 新建默认不激活
      dingtalkEnabled: dto.dingtalkEnabled || false,
      dingtalkProcessCode: dto.dingtalkProcessCode,
      syncDirection: dto.syncDirection || SyncDirection.TO_DINGTALK,
      createdBy: userId,
      createdAt: new Date(),
    }

    // 验证节点结构
    this.validateNodes(definition.nodes)

    // 存储
    this.definitions.set(definition.id, definition)

    this.logger?.info(`流程定义创建成功: ${definition.id}`, { code: dto.code })

    // 发送事件
    await this._context?.eventBus.emit('workflow.definition.created', {
      definitionId: definition.id,
      code: definition.code,
      createdBy: userId,
    })

    return definition
  }

  /**
   * 更新流程定义
   */
  async updateDefinition(
    id: string,
    dto: UpdateWorkflowDefinitionDto,
  ): Promise<WorkflowDefinition> {
    const definition = this.definitions.get(id)
    if (!definition) {
      throw new Error(`流程定义不存在: ${id}`)
    }

    // 更新字段
    if (dto.name) definition.name = dto.name
    if (dto.description) definition.description = dto.description
    if (dto.nodes) {
      this.validateNodes(dto.nodes)
      definition.nodes = dto.nodes
    }
    if (dto.dingtalkEnabled !== undefined) definition.dingtalkEnabled = dto.dingtalkEnabled
    if (dto.dingtalkProcessCode) definition.dingtalkProcessCode = dto.dingtalkProcessCode
    if (dto.syncDirection) definition.syncDirection = dto.syncDirection

    definition.updatedAt = new Date()
    definition.version += 1

    this.definitions.set(id, definition)

    this.logger?.info(`流程定义更新成功: ${id}`, { version: definition.version })

    await this._context?.eventBus.emit('workflow.definition.updated', {
      definitionId: id,
      version: definition.version,
    })

    return definition
  }

  /**
   * 激活流程定义
   */
  async activateDefinition(id: string): Promise<void> {
    const definition = this.definitions.get(id)
    if (!definition) {
      throw new Error(`流程定义不存在: ${id}`)
    }

    definition.isActive = true
    definition.updatedAt = new Date()

    this.definitions.set(id, definition)

    this.logger?.info(`流程定义已激活: ${id}`)

    await this._context?.eventBus.emit('workflow.definition.activated', {
      definitionId: id,
      code: definition.code,
    })
  }

  /**
   * 停用流程定义
   */
  async deactivateDefinition(id: string): Promise<void> {
    const definition = this.definitions.get(id)
    if (!definition) {
      throw new Error(`流程定义不存在: ${id}`)
    }

    definition.isActive = false
    definition.updatedAt = new Date()

    this.definitions.set(id, definition)

    this.logger?.info(`流程定义已停用: ${id}`)

    await this._context?.eventBus.emit('workflow.definition.deactivated', {
      definitionId: id,
      code: definition.code,
    })
  }

  /**
   * 获取流程定义
   */
  getDefinition(id: string): WorkflowDefinition | undefined {
    return this.definitions.get(id)
  }

  /**
   * 根据编码获取激活的流程定义
   */
  getActiveDefinitionByCode(code: string): WorkflowDefinition | undefined {
    for (const def of this.definitions.values()) {
      if (def.code === code && def.isActive) {
        return def
      }
    }
    return undefined
  }

  /**
   * 获取流程定义列表
   */
  listDefinitions(filter?: { category?: string; isActive?: boolean }): WorkflowDefinition[] {
    const list = Array.from(this.definitions.values())
    if (filter) {
      return list.filter((def) => {
        if (filter.category && def.category !== filter.category) return false
        if (filter.isActive !== undefined && def.isActive !== filter.isActive) return false
        return true
      })
    }
    return list
  }

  // ============================================
  // 流程运行服务
  // ============================================

  /**
   * 启动流程
   */
  async startWorkflow(dto: StartWorkflowDto): Promise<WorkflowInstance> {
    // 获取流程定义
    const definition = this.getActiveDefinitionByCode(dto.definitionCode)
    if (!definition) {
      throw new Error(`未找到激活的流程定义: ${dto.definitionCode}`)
    }

    // 找到开始节点后的第一个审批节点
    const startNode = definition.nodes.find((n) => n.type === NodeType.START)
    if (!startNode) {
      throw new Error('流程定义缺少开始节点')
    }

    const firstApproveNode = definition.nodes.find(
      (n) => n.type === NodeType.APPROVE && n.order > startNode.order,
    )

    if (!firstApproveNode) {
      throw new Error('流程定义缺少审批节点')
    }

    // 创建流程实例
    const instance: WorkflowInstance = {
      id: `wi-${dto.businessType}-${dto.businessId}-${Date.now()}`,
      definitionId: definition.id,
      definitionCode: definition.code,
      businessType: dto.businessType,
      businessId: dto.businessId,
      title: dto.title,
      content: dto.content,
      formData: dto.formData,
      initiatorId: dto.initiatorId,
      status: InstanceStatus.RUNNING,
      currentNodeId: firstApproveNode.id,
      currentNodeName: firstApproveNode.name,
      currentApproverIds: this.resolveApproverIds(firstApproveNode, dto),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // 存储实例
    this.instances.set(instance.id, instance)
    this.records.set(instance.id, [])

    this.logger?.info(`流程实例创建成功: ${instance.id}`, {
      definition: definition.code,
      business: dto.businessId,
    })

    // 钉钉同步（如果配置）
    if (
      definition.dingtalkEnabled &&
      (dto.dingtalkSync || definition.syncDirection === SyncDirection.BIDIRECTIONAL)
    ) {
      await this.syncToDingTalk(instance, definition)
    }

    // 发送审批通知
    await this.sendApprovalNotification(instance, firstApproveNode)

    // 发送事件
    await this._context?.eventBus.emit('workflow.instance.started', {
      instanceId: instance.id,
      definitionCode: definition.code,
      businessType: dto.businessType,
      businessId: dto.businessId,
      initiatorId: dto.initiatorId,
    })

    return instance
  }

  /**
   * 审批同意
   */
  async approve(dto: ApproveDto): Promise<WorkflowInstance> {
    const instance = this.instances.get(dto.instanceId)
    if (!instance) {
      throw new Error(`流程实例不存在: ${dto.instanceId}`)
    }

    if (instance.status !== InstanceStatus.RUNNING) {
      throw new Error(`流程实例状态不允许审批: ${instance.status}`)
    }

    const definition = this.getDefinition(instance.definitionId)
    if (!definition) {
      throw new Error('流程定义不存在')
    }

    const currentNode = definition.nodes.find((n) => n.id === instance.currentNodeId)
    if (!currentNode) {
      throw new Error('当前节点不存在')
    }

    // 记录审批
    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      instanceId: instance.id,
      nodeId: currentNode.id,
      nodeName: currentNode.name,
      approverId: dto.approverId,
      approverName: await this.getUserName(dto.approverId),
      action: ApprovalAction.APPROVE,
      comment: dto.comment,
      attachments: dto.attachments,
      approvedAt: new Date(),
      source: ApprovalSource.SYSTEM,
    }

    this.addRecord(instance.id, record)

    // 推进到下一个节点
    await this.advanceToNextNode(instance, definition, currentNode)

    this.logger?.info(`审批同意: ${instance.id}`, { approver: dto.approverId })

    await this._context?.eventBus.emit('workflow.instance.approved', {
      instanceId: instance.id,
      nodeId: currentNode.id,
      approverId: dto.approverId,
    })

    return instance
  }

  /**
   * 审批拒绝
   */
  async reject(dto: RejectDto): Promise<WorkflowInstance> {
    const instance = this.instances.get(dto.instanceId)
    if (!instance) {
      throw new Error(`流程实例不存在: ${dto.instanceId}`)
    }

    const definition = this.getDefinition(instance.definitionId)
    const currentNode = definition?.nodes.find((n) => n.id === instance.currentNodeId)

    // 记录审批
    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      instanceId: instance.id,
      nodeId: currentNode?.id || '',
      nodeName: currentNode?.name || '',
      approverId: dto.approverId,
      approverName: await this.getUserName(dto.approverId),
      action: ApprovalAction.REJECT,
      comment: dto.comment,
      attachments: dto.attachments,
      approvedAt: new Date(),
      source: ApprovalSource.SYSTEM,
    }

    this.addRecord(instance.id, record)

    // 更新实例状态
    instance.status = InstanceStatus.REJECTED
    instance.result = ApprovalAction.REJECT
    instance.finishedAt = new Date()
    instance.updatedAt = new Date()

    this.instances.set(instance.id, instance)

    this.logger?.info(`审批拒绝: ${instance.id}`, { approver: dto.approverId })

    // 发送通知
    await this.sendResultNotification(instance, ApprovalAction.REJECT)

    await this._context?.eventBus.emit('workflow.instance.rejected', {
      instanceId: instance.id,
      approverId: dto.approverId,
      comment: dto.comment,
    })

    return instance
  }

  /**
   * 转交审批
   */
  async transfer(dto: TransferDto): Promise<WorkflowInstance> {
    const instance = this.instances.get(dto.instanceId)
    if (!instance) {
      throw new Error(`流程实例不存在: ${dto.instanceId}`)
    }

    const currentNode = this.getCurrentNode(instance)

    // 记录转交
    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      instanceId: instance.id,
      nodeId: currentNode.id,
      nodeName: currentNode.name,
      approverId: dto.approverId,
      approverName: await this.getUserName(dto.approverId),
      action: ApprovalAction.TRANSFER,
      comment: dto.comment,
      approvedAt: new Date(),
      source: ApprovalSource.SYSTEM,
      transferToId: dto.transferToId,
      transferToName: await this.getUserName(dto.transferToId),
    }

    this.addRecord(instance.id, record)

    // 更新当前审批人
    instance.currentApproverIds = [dto.transferToId]
    instance.updatedAt = new Date()

    this.instances.set(instance.id, instance)

    this.logger?.info(`审批转交: ${instance.id}`, {
      from: dto.approverId,
      to: dto.transferToId,
    })

    // 发送通知给新审批人
    await this.sendApprovalNotification(instance, currentNode, dto.transferToId)

    await this._context?.eventBus.emit('workflow.instance.transferred', {
      instanceId: instance.id,
      fromUserId: dto.approverId,
      toUserId: dto.transferToId,
    })

    return instance
  }

  /**
   * 撤销流程
   */
  async cancel(dto: CancelDto): Promise<WorkflowInstance> {
    const instance = this.instances.get(dto.instanceId)
    if (!instance) {
      throw new Error(`流程实例不存在: ${dto.instanceId}`)
    }

    if (instance.initiatorId !== dto.initiatorId) {
      throw new Error('只有发起人可以撤销流程')
    }

    if (instance.status !== InstanceStatus.RUNNING) {
      throw new Error(`流程状态不允许撤销: ${instance.status}`)
    }

    instance.status = InstanceStatus.CANCELLED
    instance.result = ApprovalAction.CANCEL
    instance.finishedAt = new Date()
    instance.updatedAt = new Date()

    this.instances.set(instance.id, instance)

    this.logger?.info(`流程已撤销: ${instance.id}`, { reason: dto.reason })

    await this._context?.eventBus.emit('workflow.instance.cancelled', {
      instanceId: instance.id,
      initiatorId: dto.initiatorId,
      reason: dto.reason,
    })

    return instance
  }

  /**
   * 获取我的待审批
   */
  getMyPending(userId: string): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter(
      (inst) => inst.status === InstanceStatus.RUNNING && inst.currentApproverIds?.includes(userId),
    )
  }

  /**
   * 获取我发起的
   */
  getMyInitiated(userId: string): WorkflowInstance[] {
    return Array.from(this.instances.values()).filter((inst) => inst.initiatorId === userId)
  }

  /**
   * 获取审批详情
   */
  getInstance(id: string): WorkflowInstance | undefined {
    return this.instances.get(id)
  }

  /**
   * 获取审批历史
   */
  getHistory(instanceId: string): ApprovalRecord[] {
    return this.records.get(instanceId) || []
  }

  // ============================================
  // 钉钉同步服务
  // ============================================

  /**
   * 同步审批到钉钉
   */
  async syncToDingTalk(instance: WorkflowInstance, definition: WorkflowDefinition): Promise<void> {
    const dingtalk = this._context?.serviceRegistry.get<any>('dingtalk')
    if (!dingtalk) {
      this.logger?.warn('钉钉服务未注册，跳过同步')
      return
    }

    try {
      // 构建钉钉审批表单
      const formData = this.buildDingTalkFormData(instance, definition)

      // 调用钉钉API创建审批实例
      const dingtalkInstance = await dingtalk.createApprovalInstance({
        processCode: definition.dingtalkProcessCode || '',
        originatorUserId: await this.getDingTalkUserId(instance.initiatorId),
        formComponentValues: formData,
        businessId: instance.businessId,
      })

      // 更新实例钉钉ID
      instance.dingtalkInstanceId = dingtalkInstance.processInstanceId
      instance.dingtalkStatus = DingTalkStatus.RUNNING
      instance.updatedAt = new Date()

      this.instances.set(instance.id, instance)

      this.logger?.info(`钉钉审批同步成功: ${instance.id}`, {
        dingtalkInstanceId: dingtalkInstance.processInstanceId,
      })
    } catch (error) {
      this.logger?.error('钉钉审批同步失败', { error, instanceId: instance.id })
    }
  }

  /**
   * 处理钉钉审批回调
   */
  async handleDingTalkCallback(callback: DingTalkCallbackDto): Promise<void> {
    this.logger?.info('收到钉钉审批回调', { callback })

    // 根据钉钉实例ID查找系统实例
    const instance = this.findInstanceByDingTalkId(callback.processInstanceId)
    if (!instance) {
      this.logger?.warn(`未找到对应的审批实例: ${callback.processInstanceId}`)
      return
    }

    const definition = this.getDefinition(instance.definitionId)
    const currentNode = definition?.nodes.find((n) => n.id === instance.currentNodeId)

    // 映射钉钉结果到系统审批动作
    const action = this.mapDingTalkResult(callback.result)

    // 记录审批
    const systemUserId = await this.getSystemUserId(callback.approverUserId)
    const record: ApprovalRecord = {
      id: `ar-${Date.now()}`,
      instanceId: instance.id,
      nodeId: currentNode?.id || '',
      nodeName: currentNode?.name || '',
      approverId: systemUserId,
      approverName: await this.getUserName(systemUserId),
      action,
      comment: callback.comment,
      approvedAt: new Date(callback.timestamp),
      source: ApprovalSource.DINGTALK,
    }

    this.addRecord(instance.id, record)

    // 根据动作更新实例
    if (action === ApprovalAction.APPROVE) {
      await this.advanceToNextNode(instance, definition!, currentNode!)
    } else if (action === ApprovalAction.REJECT) {
      instance.status = InstanceStatus.REJECTED
      instance.result = ApprovalAction.REJECT
      instance.finishedAt = new Date()
      instance.dingtalkStatus = DingTalkStatus.COMPLETED
    }

    instance.updatedAt = new Date()
    this.instances.set(instance.id, instance)

    this.logger?.info(`钉钉回调处理完成: ${instance.id}`, { action })

    // 发送通知
    await this.sendResultNotification(instance, action)

    await this._context?.eventBus.emit('workflow.dingtalk.callback', {
      instanceId: instance.id,
      dingtalkInstanceId: callback.processInstanceId,
      action,
      approverId: systemUserId,
    })
  }

  // ============================================
  // 内部辅助方法
  // ============================================

  /**
   * 验证节点结构
   */
  private validateNodes(nodes: WorkflowNode[]): void {
    // 必须有开始节点
    const startNode = nodes.find((n) => n.type === NodeType.START)
    if (!startNode) {
      throw new Error('流程必须包含开始节点')
    }

    // 必须有结束节点
    const endNode = nodes.find((n) => n.type === NodeType.END)
    if (!endNode) {
      throw new Error('流程必须包含结束节点')
    }

    // 审批节点必须有审批人配置
    for (const node of nodes) {
      if (node.type === NodeType.APPROVE) {
        if (!node.approverType) {
          throw new Error(`审批节点 ${node.name} 缺少审批人类型`)
        }
      }
    }
  }

  /**
   * 解析审批人ID列表
   */
  private resolveApproverIds(node: WorkflowNode, dto: StartWorkflowDto): string[] {
    switch (node.approverType) {
      case ApproverType.USER:
        return [node.approverId || '']
      case ApproverType.ROLE:
        // 从角色获取用户列表
        return this.getUsersByRole(node.approverRole || '')
      case ApproverType.DEPT_HEAD:
        // 获取发起人部门主管
        return this.getDeptHead(dto.initiatorId)
      case ApproverType.INITIATOR:
        // 发起人自选，暂时返回空，等待选择
        return []
      default:
        return []
    }
  }

  /**
   * 推进到下一个节点
   */
  private async advanceToNextNode(
    instance: WorkflowInstance,
    definition: WorkflowDefinition,
    currentNode: WorkflowNode,
  ): Promise<void> {
    // 找下一个节点
    const nextNode = definition.nodes.find(
      (n) => n.order > currentNode.order && n.type !== NodeType.CONDITION,
    )

    if (!nextNode || nextNode.type === NodeType.END) {
      // 流程结束
      instance.status = InstanceStatus.APPROVED
      instance.result = ApprovalAction.APPROVE
      instance.finishedAt = new Date()
      instance.currentNodeId = nextNode?.id || 'end'
      instance.currentNodeName = '流程结束'

      this.logger?.info(`流程审批通过: ${instance.id}`)

      await this.sendResultNotification(instance, ApprovalAction.APPROVE)

      await this._context?.eventBus.emit('workflow.instance.finished', {
        instanceId: instance.id,
        result: ApprovalAction.APPROVE,
      })
    } else {
      // 推进到下一个审批节点
      instance.currentNodeId = nextNode.id
      instance.currentNodeName = nextNode.name
      instance.currentApproverIds = this.resolveApproverIds(nextNode, {
        definitionCode: instance.definitionCode,
        businessType: instance.businessType,
        businessId: instance.businessId,
        title: instance.title,
        initiatorId: instance.initiatorId,
      } as StartWorkflowDto)
      instance.updatedAt = new Date()

      // 发送审批通知
      await this.sendApprovalNotification(instance, nextNode)

      await this._context?.eventBus.emit('workflow.instance.advanced', {
        instanceId: instance.id,
        fromNodeId: currentNode.id,
        toNodeId: nextNode.id,
      })
    }

    this.instances.set(instance.id, instance)
  }

  /**
   * 添加审批记录
   */
  private addRecord(instanceId: string, record: ApprovalRecord): void {
    const records = this.records.get(instanceId) || []
    records.push(record)
    this.records.set(instanceId, records)
  }

  /**
   * 获取当前节点
   */
  private getCurrentNode(instance: WorkflowInstance): WorkflowNode {
    const definition = this.getDefinition(instance.definitionId)
    if (!definition) throw new Error('流程定义不存在')
    const node = definition.nodes.find((n) => n.id === instance.currentNodeId)
    if (!node) throw new Error('当前节点不存在')
    return node
  }

  /**
   * 发送审批通知
   */
  private async sendApprovalNotification(
    instance: WorkflowInstance,
    node: WorkflowNode,
    specificUserId?: string,
  ): Promise<void> {
    const notification = this._context?.serviceRegistry.get<any>('notification')
    if (!notification) return

    const approverIds = specificUserId ? [specificUserId] : instance.currentApproverIds || []

    await notification.send({
      type: 'approval',
      category: 'info',
      title: `待审批: ${instance.title}`,
      content: `您有一条待审批事项: ${instance.title}`,
      receiverIds: approverIds,
      channels: ['in_app', 'dingtalk'],
      businessType: instance.businessType,
      businessId: instance.businessId,
      workflowInstanceId: instance.id,
    })
  }

  /**
   * 发送审批结果通知
   */
  private async sendResultNotification(
    instance: WorkflowInstance,
    action: ApprovalAction,
  ): Promise<void> {
    const notification = this._context?.serviceRegistry.get<any>('notification')
    if (!notification) return

    const resultText = action === ApprovalAction.APPROVE ? '已通过' : '已拒绝'

    await notification.send({
      type: 'approval',
      category: action === ApprovalAction.APPROVE ? 'success' : 'warning',
      title: `审批结果: ${instance.title}`,
      content: `您的审批申请 "${instance.title}" ${resultText}`,
      receiverIds: [instance.initiatorId],
      channels: ['in_app', 'dingtalk'],
      businessType: instance.businessType,
      businessId: instance.businessId,
      workflowInstanceId: instance.id,
    })
  }

  /**
   * 映射钉钉结果
   */
  private mapDingTalkResult(result: DingTalkResult): ApprovalAction {
    switch (result) {
      case DingTalkResult.AGREE:
        return ApprovalAction.APPROVE
      case DingTalkResult.REFUSE:
        return ApprovalAction.REJECT
      case DingTalkResult.REDIRECT:
        return ApprovalAction.TRANSFER
      default:
        return ApprovalAction.APPROVE
    }
  }

  /**
   * 构建钉钉表单数据
   */
  private buildDingTalkFormData(instance: WorkflowInstance, definition: WorkflowDefinition): any[] {
    const formData = instance.formData || {}
    return [
      { name: '审批标题', value: instance.title },
      { name: '审批内容', value: instance.content || '' },
      { name: '业务类型', value: instance.businessType },
      { name: '业务ID', value: instance.businessId },
      // 其他表单字段根据具体业务扩展
    ]
  }

  /**
   * 根据钉钉实例ID查找系统实例
   */
  private findInstanceByDingTalkId(dingtalkInstanceId: string): WorkflowInstance | undefined {
    for (const instance of this.instances.values()) {
      if (instance.dingtalkInstanceId === dingtalkInstanceId) {
        return instance
      }
    }
    return undefined
  }

  /**
   * 获取用户名称
   */
  private async getUserName(userId: string): Promise<string> {
    const user = this._context?.serviceRegistry.get<any>('user')
    if (user) {
      const userInfo = await user.findById(userId)
      return userInfo?.name || userId
    }
    return userId
  }

  /**
   * 获取钉钉用户ID
   */
  private async getDingTalkUserId(systemUserId: string): Promise<string> {
    const dingtalk = this._context?.serviceRegistry.get<any>('dingtalk')
    if (dingtalk) {
      return await dingtalk.getDingTalkUserId(systemUserId)
    }
    return systemUserId
  }

  /**
   * 获取系统用户ID
   */
  private async getSystemUserId(dingtalkUserId: string): Promise<string> {
    const dingtalk = this._context?.serviceRegistry.get<any>('dingtalk')
    if (dingtalk) {
      return await dingtalk.getSystemUserId(dingtalkUserId)
    }
    return dingtalkUserId
  }

  /**
   * 根据角色获取用户列表
   */
  private getUsersByRole(roleId: string): string[] {
    // TODO: 从角色服务获取用户列表
    return []
  }

  /**
   * 获取部门主管
   */
  private getDeptHead(userId: string): string[] {
    // TODO: 从用户服务获取部门主管
    return []
  }

  /**
   * 创建默认审批流程模板
   */
  private async createDefaultTemplates(): Promise<void> {
    // TODO: 创建常用的审批流程模板
    this.logger?.info('默认审批流程模板已创建')
  }

  /**
   * 启动超时检查
   */
  private startTimeoutChecker(): void {
    // TODO: 定时检查审批超时
    this.logger?.info('超时检查已启动')
  }

  /**
   * 停止超时检查
   */
  private stopTimeoutChecker(): void {
    // TODO: 停止定时检查
    this.logger?.info('超时检查已停止')
  }

  // ============================================
  // 扩展点实现
  // ============================================

  getRoutes(): ModuleRoute[] {
    return [
      // 流程定义管理
      {
        path: '/api/v1/workflow/definitions',
        method: HttpMethod.GET,
        handler: 'definition.list',
        permission: 'workflow:definition:view',
        description: '获取流程定义列表',
      },
      {
        path: '/api/v1/workflow/definitions',
        method: HttpMethod.POST,
        handler: 'definition.create',
        permission: 'workflow:definition:create',
        description: '创建流程定义',
      },
      {
        path: '/api/v1/workflow/definitions/:id',
        method: HttpMethod.GET,
        handler: 'definition.get',
        permission: 'workflow:definition:view',
        description: '获取流程定义详情',
      },
      {
        path: '/api/v1/workflow/definitions/:id',
        method: HttpMethod.PUT,
        handler: 'definition.update',
        permission: 'workflow:definition:update',
        description: '更新流程定义',
      },
      {
        path: '/api/v1/workflow/definitions/:id',
        method: HttpMethod.DELETE,
        handler: 'definition.delete',
        permission: 'workflow:definition:delete',
        description: '删除流程定义',
      },
      {
        path: '/api/v1/workflow/definitions/:id/activate',
        method: HttpMethod.POST,
        handler: 'definition.activate',
        permission: 'workflow:definition:update',
        description: '激活流程定义',
      },
      {
        path: '/api/v1/workflow/definitions/:id/deactivate',
        method: HttpMethod.POST,
        handler: 'definition.deactivate',
        permission: 'workflow:definition:update',
        description: '停用流程定义',
      },

      // 流程实例管理
      {
        path: '/api/v1/workflow/instances',
        method: HttpMethod.POST,
        handler: 'instance.start',
        permission: 'workflow:instance:start',
        description: '启动流程',
      },
      {
        path: '/api/v1/workflow/instances/pending',
        method: HttpMethod.GET,
        handler: 'instance.pending',
        permission: 'workflow:instance:view',
        description: '获取我的待审批',
      },
      {
        path: '/api/v1/workflow/instances/initiated',
        method: HttpMethod.GET,
        handler: 'instance.initiated',
        permission: 'workflow:instance:view',
        description: '获取我发起的流程',
      },
      {
        path: '/api/v1/workflow/instances/:id',
        method: HttpMethod.GET,
        handler: 'instance.get',
        permission: 'workflow:instance:view',
        description: '获取流程实例详情',
      },
      {
        path: '/api/v1/workflow/instances/:id/history',
        method: HttpMethod.GET,
        handler: 'instance.history',
        permission: 'workflow:instance:view',
        description: '获取审批历史',
      },

      // 审批操作
      {
        path: '/api/v1/workflow/instances/:id/approve',
        method: HttpMethod.POST,
        handler: 'instance.approve',
        permission: 'workflow:instance:approve',
        description: '审批同意',
      },
      {
        path: '/api/v1/workflow/instances/:id/reject',
        method: HttpMethod.POST,
        handler: 'instance.reject',
        permission: 'workflow:instance:approve',
        description: '审批拒绝',
      },
      {
        path: '/api/v1/workflow/instances/:id/transfer',
        method: HttpMethod.POST,
        handler: 'instance.transfer',
        permission: 'workflow:instance:approve',
        description: '审批转交',
      },
      {
        path: '/api/v1/workflow/instances/:id/cancel',
        method: HttpMethod.POST,
        handler: 'instance.cancel',
        permission: 'workflow:instance:cancel',
        description: '撤销流程',
      },

      // 钉钉集成
      {
        path: '/api/v1/workflow/dingtalk/sync/:id',
        method: HttpMethod.POST,
        handler: 'dingtalk.sync',
        permission: 'workflow:dingtalk:sync',
        description: '同步到钉钉',
      },
      {
        path: '/api/v1/workflow/dingtalk/callback',
        method: HttpMethod.POST,
        handler: 'dingtalk.callback',
        permission: 'workflow:dingtalk:sync',
        description: '钉钉审批回调',
      },
    ]
  }

  getPermissions(): ModulePermission[] {
    return [
      {
        id: 'workflow:definition:view',
        name: '查看流程定义',
        type: PermissionType.RESOURCE,
        resource: 'workflow-definition',
        action: 'view',
      },
      {
        id: 'workflow:definition:create',
        name: '创建流程定义',
        type: PermissionType.RESOURCE,
        resource: 'workflow-definition',
        action: 'create',
      },
      {
        id: 'workflow:definition:update',
        name: '编辑流程定义',
        type: PermissionType.RESOURCE,
        resource: 'workflow-definition',
        action: 'edit',
      },
      {
        id: 'workflow:definition:delete',
        name: '删除流程定义',
        type: PermissionType.RESOURCE,
        resource: 'workflow-definition',
        action: 'delete',
      },
      {
        id: 'workflow:instance:view',
        name: '查看流程实例',
        type: PermissionType.RESOURCE,
        resource: 'workflow-instance',
        action: 'view',
      },
      {
        id: 'workflow:instance:start',
        name: '发起流程',
        type: PermissionType.ACTION,
        resource: 'workflow-instance',
        action: 'start',
      },
      {
        id: 'workflow:instance:approve',
        name: '审批操作',
        type: PermissionType.ACTION,
        resource: 'workflow-instance',
        action: 'approve',
      },
      {
        id: 'workflow:instance:cancel',
        name: '撤销流程',
        type: PermissionType.ACTION,
        resource: 'workflow-instance',
        action: 'cancel',
      },
      {
        id: 'workflow:dingtalk:sync',
        name: '钉钉审批同步',
        type: PermissionType.ACTION,
        resource: 'workflow-dingtalk',
        action: 'sync',
      },
      {
        id: 'workflow:admin',
        name: '流程管理员',
        type: PermissionType.ADMIN,
        resource: 'workflow',
        action: 'admin',
      },
    ]
  }

  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'workflow',
        title: '审批流程',
        path: '/workflow',
        icon: 'audit',
        order: 5,
        children: [
          {
            id: 'workflow-definition',
            title: '流程定义',
            path: '/workflow/definitions',
            icon: 'branches',
            permissions: ['workflow:definition:view'],
            order: 1,
          },
          {
            id: 'workflow-pending',
            title: '待审批',
            path: '/workflow/pending',
            icon: 'clock-circle',
            permissions: ['workflow:instance:approve'],
            order: 2,
          },
          {
            id: 'workflow-initiated',
            title: '我发起的',
            path: '/workflow/initiated',
            icon: 'send',
            permissions: ['workflow:instance:view'],
            order: 3,
          },
          {
            id: 'workflow-approved',
            title: '已审批',
            path: '/workflow/approved',
            icon: 'check-circle',
            permissions: ['workflow:instance:view'],
            order: 4,
          },
        ],
      },
    ]
  }

  getEvents(): ModuleEvent[] {
    return [
      {
        name: 'workflow.definition.created',
        type: EventType.BUSINESS_DATA,
        description: '流程定义创建事件',
      },
      {
        name: 'workflow.definition.updated',
        type: EventType.BUSINESS_DATA,
        description: '流程定义更新事件',
      },
      {
        name: 'workflow.definition.activated',
        type: EventType.BUSINESS_DATA,
        description: '流程定义激活事件',
      },
      {
        name: 'workflow.instance.started',
        type: EventType.BUSINESS_DATA,
        description: '流程实例启动事件',
      },
      {
        name: 'workflow.instance.approved',
        type: EventType.BUSINESS_DATA,
        description: '审批同意事件',
      },
      {
        name: 'workflow.instance.rejected',
        type: EventType.BUSINESS_DATA,
        description: '审批拒绝事件',
      },
      {
        name: 'workflow.instance.finished',
        type: EventType.BUSINESS_DATA,
        description: '流程完成事件',
      },
      {
        name: 'workflow.dingtalk.callback',
        type: EventType.EXTERNAL,
        description: '钉钉审批回调事件',
      },
      {
        name: 'workflow.module.started',
        type: EventType.MODULE_LIFECYCLE,
        description: 'Workflow模块启动',
      },
      {
        name: 'workflow.module.stopped',
        type: EventType.MODULE_LIFECYCLE,
        description: 'Workflow模块停止',
      },
    ]
  }
}

// ============================================
// 模块导出
// ============================================

export { WORKFLOW_MODULE_MANIFEST as WORKFLOW_MANIFEST }
