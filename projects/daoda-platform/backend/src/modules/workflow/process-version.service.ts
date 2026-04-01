/**
 * 流程版本管理服务
 * 流程定义版本控制、发布管理、版本回退
 */
import { Injectable } from '@nestjs/common'

// 版本状态
export enum VersionStatus {
  DRAFT = 'DRAFT', // 草稿
  TESTING = 'TESTING', // 测试中
  PUBLISHED = 'PUBLISHED', // 已发布
  DEPRECATED = 'DEPRECATED', // 已废弃
  ARCHIVED = 'ARCHIVED', // 已归档
}

// 变更类型
export enum ChangeType {
  CREATED = 'CREATED', // 创建
  MODIFIED = 'MODIFIED', // 修改
  NODE_ADDED = 'NODE_ADDED', // 新增节点
  NODE_DELETED = 'NODE_DELETED', // 删除节点
  NODE_MODIFIED = 'NODE_MODIFIED', // 修改节点
  CONDITION_CHANGED = 'CONDITION_CHANGED', // 条件变更
  ROUTING_CHANGED = 'ROUTING_CHANGED', // 路由变更
  PUBLISHED = 'PUBLISHED', // 发布
  DEPRECATED = 'DEPRECATED', // 废弃
}

// 流程定义接口
export interface ProcessDefinition {
  id: string
  name: string
  code: string
  category: string // 分类（采购、请假、合同等）
  description?: string
  status: VersionStatus
  currentVersion: string // 当前版本号
  publishedVersion?: string // 已发布版本号
  owner?: string
  ownerName?: string
  createdAt: Date
  updatedAt: Date
}

// 流程版本接口
export interface ProcessVersion {
  id: string
  definitionId: string
  definitionName: string
  versionNumber: string // 版本号 (v1.0, v1.1, v2.0)
  majorVersion: number
  minorVersion: number
  status: VersionStatus
  nodes: VersionNode[] // 版本节点定义
  changelog: VersionChange[] // 变更记录
  publishedAt?: Date
  deprecatedAt?: Date
  creator?: string
  creatorName?: string
  approver?: string
  approverName?: string
  approvedAt?: Date
  isDefault?: boolean // 是否默认版本
  instanceCount?: number // 实例数量
  createdAt: Date
}

// 版本节点定义
export interface VersionNode {
  id: string
  nodeId: string
  nodeName: string
  nodeType: string
  assigneeType?: string // 指派类型（角色、部门、人员）
  assigneeValue?: string
  conditions?: any[] // 条件配置
  timeoutMinutes?: number
  position?: { x: number; y: number } // 节点位置
  connections?: string[] // 连接节点
}

// 版本变更记录
export interface VersionChange {
  id: string
  versionId: string
  changeType: ChangeType
  description: string
  details?: string // 详细变更内容
  changedBy?: string
  changedByName?: string
  changedAt: Date
  previousValue?: any
  newValue?: any
}

// 版本发布请求
export interface PublishRequest {
  definitionId: string
  versionId: string
  publisher?: string
  publisherName?: string
  notes?: string
  scheduleAt?: Date // 定时发布
}

// 版本对比结果
export interface VersionCompare {
  definitionId: string
  version1: string
  version2: string
  nodeChanges: {
    nodeId: string
    nodeName: string
    changeType: 'ADDED' | 'DELETED' | 'MODIFIED'
    details?: string
  }[]
  conditionChanges: any[]
  routingChanges: any[]
  summary: string
}

@Injectable()
export class ProcessVersionService {
  private definitions: Map<string, ProcessDefinition> = new Map()
  private versions: Map<string, ProcessVersion> = new Map()
  private changes: Map<string, VersionChange[]> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化流程定义
    const mockDefinitions: ProcessDefinition[] = [
      {
        id: 'PD-001',
        name: '采购审批流程',
        code: 'PURCHASE-APPROVAL',
        category: '采购管理',
        description: '用于公司采购事项审批的标准流程',
        status: VersionStatus.PUBLISHED,
        currentVersion: 'v2.1',
        publishedVersion: 'v2.1',
        owner: 'U-001',
        ownerName: '张三',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'PD-002',
        name: '请假审批流程',
        code: 'LEAVE-APPROVAL',
        category: '人事管理',
        description: '员工请假申请审批流程',
        status: VersionStatus.PUBLISHED,
        currentVersion: 'v1.2',
        publishedVersion: 'v1.2',
        owner: 'U-002',
        ownerName: '李四',
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date(),
      },
      {
        id: 'PD-003',
        name: '合同审批流程',
        code: 'CONTRACT-APPROVAL',
        category: '合同管理',
        description: '合同签订审批流程',
        status: VersionStatus.TESTING,
        currentVersion: 'v1.1-beta',
        publishedVersion: 'v1.0',
        owner: 'U-003',
        ownerName: '王五',
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date(),
      },
      {
        id: 'PD-004',
        name: '报销审批流程',
        code: 'EXPENSE-APPROVAL',
        category: '财务管理',
        description: '员工报销申请审批流程',
        status: VersionStatus.PUBLISHED,
        currentVersion: 'v1.3',
        publishedVersion: 'v1.3',
        owner: 'U-004',
        ownerName: '赵六',
        createdAt: new Date('2026-02-15'),
        updatedAt: new Date(),
      },
      {
        id: 'PD-005',
        name: '项目立项流程',
        code: 'PROJECT-INIT',
        category: '项目管理',
        description: '新项目立项审批流程',
        status: VersionStatus.DRAFT,
        currentVersion: 'v0.1-draft',
        owner: 'U-005',
        ownerName: '钱七',
        createdAt: new Date('2026-03-01'),
        updatedAt: new Date(),
      },
    ]

    mockDefinitions.forEach((def) => {
      this.definitions.set(def.id, def)
    })

    // 初始化流程版本
    const mockVersions: ProcessVersion[] = [
      // 采购审批流程版本
      {
        id: 'PV-001',
        definitionId: 'PD-001',
        definitionName: '采购审批流程',
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: VersionStatus.ARCHIVED,
        nodes: [
          {
            id: 'VN-001',
            nodeId: 'N-START',
            nodeName: '开始',
            nodeType: 'START',
            position: { x: 100, y: 50 },
            connections: ['N-001'],
          },
          {
            id: 'VN-002',
            nodeId: 'N-001',
            nodeName: '提交申请',
            nodeType: 'FORM',
            position: { x: 200, y: 100 },
            connections: ['N-002'],
          },
          {
            id: 'VN-003',
            nodeId: 'N-002',
            nodeName: '部门经理审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '部门经理',
            position: { x: 300, y: 150 },
            connections: ['N-003'],
          },
          {
            id: 'VN-004',
            nodeId: 'N-003',
            nodeName: '财务审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '财务经理',
            position: { x: 400, y: 200 },
            connections: ['N-END'],
          },
          {
            id: 'VN-005',
            nodeId: 'N-END',
            nodeName: '结束',
            nodeType: 'END',
            position: { x: 500, y: 250 },
          },
        ],
        changelog: [],
        instanceCount: 50,
        createdAt: new Date('2026-01-01'),
        deprecatedAt: new Date('2026-02-01'),
      },
      {
        id: 'PV-002',
        definitionId: 'PD-001',
        definitionName: '采购审批流程',
        versionNumber: 'v2.0',
        majorVersion: 2,
        minorVersion: 0,
        status: VersionStatus.DEPRECATED,
        nodes: [
          {
            id: 'VN-006',
            nodeId: 'N-START',
            nodeName: '开始',
            nodeType: 'START',
            connections: ['N-001'],
          },
          {
            id: 'VN-007',
            nodeId: 'N-001',
            nodeName: '提交申请',
            nodeType: 'FORM',
            connections: ['N-002'],
          },
          {
            id: 'VN-008',
            nodeId: 'N-002',
            nodeName: '部门经理审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '部门经理',
            connections: ['N-COND'],
          },
          {
            id: 'VN-009',
            nodeId: 'N-COND',
            nodeName: '金额判断',
            nodeType: 'CONDITION',
            conditions: [{ field: 'amount', operator: '>', value: 50000 }],
            connections: ['N-003', 'N-004'],
          },
          {
            id: 'VN-010',
            nodeId: 'N-003',
            nodeName: '财务审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '财务经理',
            connections: ['N-005'],
          },
          {
            id: 'VN-011',
            nodeId: 'N-004',
            nodeName: '总经理审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '总经理',
            connections: ['N-005'],
          },
          { id: 'VN-012', nodeId: 'N-005', nodeName: '结束', nodeType: 'END' },
        ],
        changelog: [],
        instanceCount: 100,
        createdAt: new Date('2026-02-01'),
        deprecatedAt: new Date('2026-03-15'),
      },
      {
        id: 'PV-003',
        definitionId: 'PD-001',
        definitionName: '采购审批流程',
        versionNumber: 'v2.1',
        majorVersion: 2,
        minorVersion: 1,
        status: VersionStatus.PUBLISHED,
        nodes: [
          {
            id: 'VN-013',
            nodeId: 'N-START',
            nodeName: '开始',
            nodeType: 'START',
            connections: ['N-001'],
          },
          {
            id: 'VN-014',
            nodeId: 'N-001',
            nodeName: '提交申请',
            nodeType: 'FORM',
            connections: ['N-002'],
          },
          {
            id: 'VN-015',
            nodeId: 'N-002',
            nodeName: '部门经理审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '部门经理',
            timeoutMinutes: 120,
            connections: ['N-COND'],
          },
          {
            id: 'VN-016',
            nodeId: 'N-COND',
            nodeName: '金额判断',
            nodeType: 'CONDITION',
            conditions: [
              { field: 'amount', operator: '>', value: 50000 },
              { field: 'amount', operator: '>', value: 100000 },
            ],
            connections: ['N-003', 'N-004', 'N-006'],
          },
          {
            id: 'VN-017',
            nodeId: 'N-003',
            nodeName: '财务审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '财务经理',
            timeoutMinutes: 180,
            connections: ['N-005'],
          },
          {
            id: 'VN-018',
            nodeId: 'N-004',
            nodeName: '总经理审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '总经理',
            timeoutMinutes: 240,
            connections: ['N-005'],
          },
          {
            id: 'VN-019',
            nodeId: 'N-006',
            nodeName: '董事会审批',
            nodeType: 'APPROVAL',
            assigneeType: 'ROLE',
            assigneeValue: '董事会',
            connections: ['N-005'],
          },
          { id: 'VN-020', nodeId: 'N-005', nodeName: '结束', nodeType: 'END' },
        ],
        changelog: [],
        isDefault: true,
        instanceCount: 35,
        publishedAt: new Date('2026-03-15'),
        createdAt: new Date('2026-03-10'),
      },

      // 请假审批流程版本
      {
        id: 'PV-004',
        definitionId: 'PD-002',
        definitionName: '请假审批流程',
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: VersionStatus.ARCHIVED,
        nodes: [],
        changelog: [],
        instanceCount: 80,
        createdAt: new Date('2026-01-15'),
      },
      {
        id: 'PV-005',
        definitionId: 'PD-002',
        definitionName: '请假审批流程',
        versionNumber: 'v1.1',
        majorVersion: 1,
        minorVersion: 1,
        status: VersionStatus.DEPRECATED,
        nodes: [],
        changelog: [],
        instanceCount: 120,
        createdAt: new Date('2026-02-15'),
      },
      {
        id: 'PV-006',
        definitionId: 'PD-002',
        definitionName: '请假审批流程',
        versionNumber: 'v1.2',
        majorVersion: 1,
        minorVersion: 2,
        status: VersionStatus.PUBLISHED,
        nodes: [],
        changelog: [],
        isDefault: true,
        instanceCount: 50,
        publishedAt: new Date('2026-03-01'),
        createdAt: new Date('2026-02-28'),
      },

      // 合同审批流程版本
      {
        id: 'PV-007',
        definitionId: 'PD-003',
        definitionName: '合同审批流程',
        versionNumber: 'v1.0',
        majorVersion: 1,
        minorVersion: 0,
        status: VersionStatus.PUBLISHED,
        nodes: [],
        changelog: [],
        instanceCount: 20,
        publishedAt: new Date('2026-02-15'),
        createdAt: new Date('2026-02-01'),
      },
      {
        id: 'PV-008',
        definitionId: 'PD-003',
        definitionName: '合同审批流程',
        versionNumber: 'v1.1-beta',
        majorVersion: 1,
        minorVersion: 1,
        status: VersionStatus.TESTING,
        nodes: [],
        changelog: [],
        instanceCount: 5,
        createdAt: new Date('2026-03-01'),
      },

      // 报销审批流程版本
      {
        id: 'PV-009',
        definitionId: 'PD-004',
        definitionName: '报销审批流程',
        versionNumber: 'v1.3',
        majorVersion: 1,
        minorVersion: 3,
        status: VersionStatus.PUBLISHED,
        nodes: [],
        changelog: [],
        isDefault: true,
        instanceCount: 200,
        publishedAt: new Date('2026-03-20'),
        createdAt: new Date('2026-03-15'),
      },

      // 项目立项流程版本
      {
        id: 'PV-010',
        definitionId: 'PD-005',
        definitionName: '项目立项流程',
        versionNumber: 'v0.1-draft',
        majorVersion: 0,
        minorVersion: 1,
        status: VersionStatus.DRAFT,
        nodes: [],
        changelog: [],
        createdAt: new Date('2026-03-01'),
      },
    ]

    mockVersions.forEach((ver) => {
      this.versions.set(ver.id, ver)
    })

    // 初始化变更记录
    const mockChanges: VersionChange[] = [
      {
        id: 'VC-001',
        versionId: 'PV-002',
        changeType: ChangeType.NODE_ADDED,
        description: '新增金额判断条件节点',
        changedBy: 'U-001',
        changedByName: '张三',
        changedAt: new Date('2026-02-01'),
      },
      {
        id: 'VC-002',
        versionId: 'PV-002',
        changeType: ChangeType.NODE_ADDED,
        description: '新增总经理审批节点',
        changedBy: 'U-001',
        changedByName: '张三',
        changedAt: new Date('2026-02-01'),
      },
      {
        id: 'VC-003',
        versionId: 'PV-003',
        changeType: ChangeType.NODE_ADDED,
        description: '新增董事会审批节点（金额>10万）',
        changedBy: 'U-001',
        changedByName: '张三',
        changedAt: new Date('2026-03-10'),
      },
      {
        id: 'VC-004',
        versionId: 'PV-003',
        changeType: ChangeType.NODE_MODIFIED,
        description: '为审批节点添加超时设置',
        details: '部门经理审批120分钟，财务审批180分钟，总经理审批240分钟',
        changedBy: 'U-001',
        changedByName: '张三',
        changedAt: new Date('2026-03-10'),
      },
      {
        id: 'VC-005',
        versionId: 'PV-003',
        changeType: ChangeType.PUBLISHED,
        description: '版本发布',
        changedBy: 'U-002',
        changedByName: '李四',
        changedAt: new Date('2026-03-15'),
      },
      {
        id: 'VC-006',
        versionId: 'PV-006',
        changeType: ChangeType.CONDITION_CHANGED,
        description: '调整请假天数判断条件',
        details: '增加7天以上需要总经理审批的条件',
        changedBy: 'U-002',
        changedByName: '李四',
        changedAt: new Date('2026-02-28'),
      },
      {
        id: 'VC-007',
        versionId: 'PV-008',
        changeType: ChangeType.MODIFIED,
        description: '新增法务审核节点',
        changedBy: 'U-003',
        changedByName: '王五',
        changedAt: new Date('2026-03-01'),
      },
    ]

    mockChanges.forEach((change) => {
      const versionChanges = this.changes.get(change.versionId) || []
      versionChanges.push(change)
      this.changes.set(change.versionId, versionChanges)
    })
  }

  // 获取流程定义列表
  async getProcessDefinitions(query?: {
    category?: string
    status?: VersionStatus
  }): Promise<ProcessDefinition[]> {
    let definitions = Array.from(this.definitions.values())

    if (query) {
      if (query.category) {
        definitions = definitions.filter((d) => d.category === query.category)
      }
      if (query.status) {
        definitions = definitions.filter((d) => d.status === query.status)
      }
    }

    return definitions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // 获取流程定义详情
  async getProcessDefinition(id: string): Promise<ProcessDefinition | null> {
    return this.definitions.get(id) || null
  }

  // 获取流程版本列表
  async getProcessVersions(definitionId?: string): Promise<ProcessVersion[]> {
    let versions = Array.from(this.versions.values())
    if (definitionId) {
      versions = versions.filter((v) => v.definitionId === definitionId)
    }
    return versions.sort((a, b) => {
      // 按版本号排序（高版本在前）
      if (a.majorVersion !== b.majorVersion) {
        return b.majorVersion - a.majorVersion
      }
      return b.minorVersion - a.minorVersion
    })
  }

  // 获取流程版本详情
  async getProcessVersion(id: string): Promise<ProcessVersion | null> {
    return this.versions.get(id) || null
  }

  // 获取版本变更记录
  async getVersionChanges(versionId: string): Promise<VersionChange[]> {
    return this.changes.get(versionId) || []
  }

  // 获取发布版本（当前生效版本）
  async getPublishedVersion(definitionId: string): Promise<ProcessVersion | null> {
    const versions = Array.from(this.versions.values()).filter(
      (v) => v.definitionId === definitionId && v.status === VersionStatus.PUBLISHED,
    )
    return versions.find((v) => v.isDefault) || versions[0] || null
  }

  // 版本对比
  async compareVersions(versionId1: string, versionId2: string): Promise<VersionCompare | null> {
    const v1 = this.versions.get(versionId1)
    const v2 = this.versions.get(versionId2)

    if (!v1 || !v2) return null

    const nodeChanges: any[] = []
    const v1Nodes = v1.nodes || []
    const v2Nodes = v2.nodes || []

    // 找出新增节点
    for (const n2 of v2Nodes) {
      if (!v1Nodes.find((n1) => n1.nodeId === n2.nodeId)) {
        nodeChanges.push({ nodeId: n2.nodeId, nodeName: n2.nodeName, changeType: 'ADDED' })
      }
    }

    // 找出删除节点
    for (const n1 of v1Nodes) {
      if (!v2Nodes.find((n2) => n2.nodeId === n1.nodeId)) {
        nodeChanges.push({ nodeId: n1.nodeId, nodeName: n1.nodeName, changeType: 'DELETED' })
      }
    }

    // 找出修改节点
    for (const n2 of v2Nodes) {
      const n1 = v1Nodes.find((n) => n.nodeId === n2.nodeId)
      if (n1 && (n1.nodeName !== n2.nodeName || n1.timeoutMinutes !== n2.timeoutMinutes)) {
        nodeChanges.push({
          nodeId: n2.nodeId,
          nodeName: n2.nodeName,
          changeType: 'MODIFIED',
          details: `节点配置变更`,
        })
      }
    }

    const summary = `${v1.versionNumber} 到 ${v2.versionNumber}: 新增 ${nodeChanges.filter((c) => c.changeType === 'ADDED').length} 节点, 删除 ${nodeChanges.filter((c) => c.changeType === 'DELETED').length} 节点, 修改 ${nodeChanges.filter((c) => c.changeType === 'MODIFIED').length} 节点`

    return {
      definitionId: v1.definitionId,
      version1: v1.versionNumber,
      version2: v2.versionNumber,
      nodeChanges,
      conditionChanges: [],
      routingChanges: [],
      summary,
    }
  }

  // 发布版本
  async publishVersion(request: PublishRequest): Promise<ProcessVersion | null> {
    const version = this.versions.get(request.versionId)
    const definition = this.definitions.get(request.definitionId)

    if (!version || !definition) return null

    // 将当前发布版本标记为废弃
    const currentPublished = await this.getPublishedVersion(request.definitionId)
    if (currentPublished) {
      currentPublished.status = VersionStatus.DEPRECATED
      currentPublished.deprecatedAt = new Date()
      currentPublished.isDefault = false
    }

    // 发布新版本
    version.status = VersionStatus.PUBLISHED
    version.publishedAt = request.scheduleAt || new Date()
    version.isDefault = true

    // 更新定义
    definition.publishedVersion = version.versionNumber
    definition.currentVersion = version.versionNumber
    definition.status = VersionStatus.PUBLISHED
    definition.updatedAt = new Date()

    // 记录变更
    const change: VersionChange = {
      id: `VC-${Date.now()}`,
      versionId: version.id,
      changeType: ChangeType.PUBLISHED,
      description: `版本发布: ${request.notes || ''}`,
      changedBy: request.publisher,
      changedByName: request.publisherName,
      changedAt: new Date(),
    }
    const versionChanges = this.changes.get(version.id) || []
    versionChanges.push(change)
    this.changes.set(version.id, versionChanges)

    return version
  }

  // 回退版本
  async rollbackVersion(
    definitionId: string,
    targetVersionId: string,
  ): Promise<ProcessVersion | null> {
    const targetVersion = this.versions.get(targetVersionId)
    const definition = this.definitions.get(definitionId)

    if (!targetVersion || !definition || targetVersion.status !== VersionStatus.PUBLISHED)
      return null

    // 将当前版本标记为废弃
    const currentPublished = await this.getPublishedVersion(definitionId)
    if (currentPublished) {
      currentPublished.status = VersionStatus.DEPRECATED
      currentPublished.deprecatedAt = new Date()
      currentPublished.isDefault = false
    }

    // 设置目标版本为默认
    targetVersion.isDefault = true

    // 更新定义
    definition.publishedVersion = targetVersion.versionNumber
    definition.currentVersion = targetVersion.versionNumber
    definition.updatedAt = new Date()

    return targetVersion
  }

  // 获取版本统计
  async getVersionStats(): Promise<{
    totalDefinitions: number
    publishedDefinitions: number
    totalVersions: number
    publishedVersions: number
    draftVersions: number
    testingVersions: number
    avgVersionsPerDefinition: number
  }> {
    const definitions = Array.from(this.definitions.values())
    const versions = Array.from(this.versions.values())

    return {
      totalDefinitions: definitions.length,
      publishedDefinitions: definitions.filter((d) => d.status === VersionStatus.PUBLISHED).length,
      totalVersions: versions.length,
      publishedVersions: versions.filter((v) => v.status === VersionStatus.PUBLISHED).length,
      draftVersions: versions.filter((v) => v.status === VersionStatus.DRAFT).length,
      testingVersions: versions.filter((v) => v.status === VersionStatus.TESTING).length,
      avgVersionsPerDefinition: versions.length / definitions.length,
    }
  }

  // 获取流程分类列表
  async getCategories(): Promise<string[]> {
    const definitions = Array.from(this.definitions.values())
    return [...new Set(definitions.map((d) => d.category))]
  }
}
