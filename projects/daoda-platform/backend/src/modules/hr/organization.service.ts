/**
 * 组织架构服务
 * 组织设计、部门管理、职位体系
 */
import { Injectable } from '@nestjs/common'

// 组织类型枚举
export enum OrgType {
  COMPANY = 'COMPANY', // 公司
  DEPARTMENT = 'DEPARTMENT', // 部门
  TEAM = 'TEAM', // 团队/小组
  POSITION = 'POSITION', // 职位
}

// 组织状态枚举
export enum OrgStatus {
  ACTIVE = 'ACTIVE', // 正常
  INACTIVE = 'INACTIVE', // 停用
  ARCHIVED = 'ARCHIVED', // 已归档
}

// 组织节点接口
export interface OrgNode {
  id: string
  name: string
  code: string
  type: OrgType
  parentId?: string
  parentName?: string
  level: number
  path: string
  status: OrgStatus
  description?: string
  managerId?: string
  managerName?: string
  employeeCount?: number
  children?: OrgNode[]
  createdAt: Date
  updatedAt: Date
}

// 组织统计接口
export interface OrgStats {
  totalDepartments: number
  totalTeams: number
  totalPositions: number
  totalEmployees: number
  avgTeamSize: number
  maxDepth: number
}

@Injectable()
export class OrganizationService {
  private organizations: Map<string, OrgNode> = new Map()
  private treeCache: OrgNode[] | null = null

  constructor() {
    this.initDefaultOrg()
  }

  // 初始化默认组织架构
  private initDefaultOrg() {
    // 公司根节点
    const company: OrgNode = {
      id: 'ORG-001',
      name: '道达智能科技有限公司',
      code: 'DAOD',
      type: OrgType.COMPANY,
      level: 0,
      path: '/DAOD',
      status: OrgStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.organizations.set(company.id, company)

    // 部门节点
    const departments = [
      { id: 'ORG-002', name: '研发部', code: 'DEV', parentId: 'ORG-001', managerId: 'EMP-001' },
      { id: 'ORG-003', name: '销售部', code: 'SALES', parentId: 'ORG-001', managerId: 'EMP-002' },
      { id: 'ORG-004', name: '市场部', code: 'MKT', parentId: 'ORG-001' },
      { id: 'ORG-005', name: '财务部', code: 'FIN', parentId: 'ORG-001', managerId: 'EMP-003' },
      { id: 'ORG-006', name: '人力资源部', code: 'HR', parentId: 'ORG-001', managerId: 'EMP-004' },
      { id: 'ORG-007', name: '运营部', code: 'OPS', parentId: 'ORG-001' },
      { id: 'ORG-008', name: '售后服务部', code: 'SVC', parentId: 'ORG-001' },
    ]

    departments.forEach((d) => {
      const node: OrgNode = {
        id: d.id,
        name: d.name,
        code: d.code,
        type: OrgType.DEPARTMENT,
        parentId: d.parentId,
        parentName: company.name,
        level: 1,
        path: `${company.path}/${d.code}`,
        status: OrgStatus.ACTIVE,
        managerId: d.managerId,
        employeeCount: Math.floor(Math.random() * 30) + 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.organizations.set(node.id, node)
    })

    // 团队节点 (研发部下属)
    const teams = [
      { id: 'ORG-009', name: '前端开发组', code: 'FE', parentId: 'ORG-002' },
      { id: 'ORG-010', name: '后端开发组', code: 'BE', parentId: 'ORG-002' },
      { id: 'ORG-011', name: '测试组', code: 'QA', parentId: 'ORG-002' },
      { id: 'ORG-012', name: '架构组', code: 'ARCH', parentId: 'ORG-002' },
      { id: 'ORG-013', name: '华北销售组', code: 'NORTH', parentId: 'ORG-003' },
      { id: 'ORG-014', name: '华南销售组', code: 'SOUTH', parentId: 'ORG-003' },
    ]

    teams.forEach((t) => {
      const parent = this.organizations.get(t.parentId!)
      const node: OrgNode = {
        id: t.id,
        name: t.name,
        code: t.code,
        type: OrgType.TEAM,
        parentId: t.parentId,
        parentName: parent?.name,
        level: 2,
        path: `${parent?.path}/${t.code}`,
        status: OrgStatus.ACTIVE,
        employeeCount: Math.floor(Math.random() * 10) + 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.organizations.set(node.id, node)
    })

    // 职位节点
    const positions = [
      { id: 'ORG-015', name: '前端工程师', code: 'FE-ENG', parentId: 'ORG-009', level: 'P4' },
      { id: 'ORG-016', name: '高级前端工程师', code: 'FE-SENG', parentId: 'ORG-009', level: 'P5' },
      { id: 'ORG-017', name: '前端架构师', code: 'FE-ARCH', parentId: 'ORG-009', level: 'P6' },
      { id: 'ORG-018', name: '后端工程师', code: 'BE-ENG', parentId: 'ORG-010', level: 'P4' },
      { id: 'ORG-019', name: '高级后端工程师', code: 'BE-SENG', parentId: 'ORG-010', level: 'P5' },
      { id: 'ORG-020', name: '销售代表', code: 'SALES-REP', parentId: 'ORG-013', level: 'S3' },
      { id: 'ORG-021', name: '销售经理', code: 'SALES-MGR', parentId: 'ORG-003', level: 'S5' },
    ]

    positions.forEach((p) => {
      const parent = this.organizations.get(p.parentId!)
      const node: OrgNode = {
        id: p.id,
        name: p.name,
        code: p.code,
        type: OrgType.POSITION,
        parentId: p.parentId,
        parentName: parent?.name,
        level: 3,
        path: `${parent?.path}/${p.code}`,
        status: OrgStatus.ACTIVE,
        description: `职位级别: ${p.level}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.organizations.set(node.id, node)
    })
  }

  // 获取组织树
  async getOrgTree(parentId?: string): Promise<OrgNode[]> {
    const nodes = Array.from(this.organizations.values())

    if (!parentId) {
      // 返回完整树
      return this.buildTree(nodes, null)
    }

    // 返回指定父节点的子树
    const parentNode = this.organizations.get(parentId)
    if (!parentNode) return []

    return this.buildTree(nodes, parentId)
  }

  // 构建树结构
  private buildTree(nodes: OrgNode[], parentId: string | null): OrgNode[] {
    const children = nodes.filter((n) => n.parentId === parentId)

    return children.map((node) => ({
      ...node,
      children: this.buildTree(nodes, node.id),
    }))
  }

  // 获取单个组织节点
  async getById(id: string): Promise<OrgNode | null> {
    return this.organizations.get(id) || null
  }

  // 获取组织列表(扁平)
  async getList(type?: OrgType, status?: OrgStatus): Promise<OrgNode[]> {
    let nodes = Array.from(this.organizations.values())

    if (type) {
      nodes = nodes.filter((n) => n.type === type)
    }
    if (status) {
      nodes = nodes.filter((n) => n.status === status)
    }

    return nodes.sort((a, b) => a.path.localeCompare(b.path))
  }

  // 创建组织节点
  async create(data: Partial<OrgNode>): Promise<OrgNode> {
    const id = `ORG-${Date.now().toString(36).toUpperCase()}`

    // 计算层级和路径
    let level = 0
    let path = `/${data.code}`
    let parentName = undefined

    if (data.parentId) {
      const parent = this.organizations.get(data.parentId)
      if (parent) {
        level = parent.level + 1
        path = `${parent.path}/${data.code}`
        parentName = parent.name
      }
    }

    const node: OrgNode = {
      id,
      name: data.name || '',
      code: data.code || '',
      type: data.type || OrgType.DEPARTMENT,
      parentId: data.parentId,
      parentName,
      level,
      path,
      status: data.status || OrgStatus.ACTIVE,
      description: data.description,
      managerId: data.managerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.organizations.set(id, node)
    this.treeCache = null // 清除缓存

    return node
  }

  // 更新组织节点
  async update(id: string, data: Partial<OrgNode>): Promise<OrgNode | null> {
    const node = this.organizations.get(id)
    if (!node) return null

    const updated = {
      ...node,
      ...data,
      updatedAt: new Date(),
    }

    // 如果更改了父节点，需要重新计算层级和路径
    if (data.parentId && data.parentId !== node.parentId) {
      const parent = this.organizations.get(data.parentId)
      if (parent) {
        updated.level = parent.level + 1
        updated.path = `${parent.path}/${node.code}`
        updated.parentName = parent.name
      }
    }

    this.organizations.set(id, updated)
    this.treeCache = null

    return updated
  }

  // 删除组织节点(检查是否有子节点)
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const node = this.organizations.get(id)
    if (!node) {
      return { success: false, message: '组织不存在' }
    }

    // 检查是否有子节点
    const children = Array.from(this.organizations.values()).filter((n) => n.parentId === id)

    if (children.length > 0) {
      return {
        success: false,
        message: `该组织下有 ${children.length} 个子组织，请先删除子组织`,
      }
    }

    // 检查是否有员工
    if (node.employeeCount && node.employeeCount > 0) {
      return {
        success: false,
        message: `该组织下有 ${node.employeeCount} 名员工，请先转移员工`,
      }
    }

    this.organizations.delete(id)
    this.treeCache = null

    return { success: true, message: '删除成功' }
  }

  // 移动组织节点
  async move(id: string, newParentId: string): Promise<OrgNode | null> {
    const node = this.organizations.get(id)
    const newParent = this.organizations.get(newParentId)

    if (!node || !newParent) return null

    // 不能移动到自己的子节点下
    if (newParent.path.startsWith(node.path)) {
      return null
    }

    return this.update(id, { parentId: newParentId })
  }

  // 获取组织统计
  async getStats(): Promise<OrgStats> {
    const nodes = Array.from(this.organizations.values())

    const departments = nodes.filter((n) => n.type === OrgType.DEPARTMENT)
    const teams = nodes.filter((n) => n.type === OrgType.TEAM)
    const positions = nodes.filter((n) => n.type === OrgType.POSITION)

    const totalEmployees = nodes.reduce((sum, n) => sum + (n.employeeCount || 0), 0)
    const avgTeamSize = teams.length > 0 ? totalEmployees / teams.length : 0

    return {
      totalDepartments: departments.length,
      totalTeams: teams.length,
      totalPositions: positions.length,
      totalEmployees,
      avgTeamSize: Math.round(avgTeamSize),
      maxDepth: Math.max(...nodes.map((n) => n.level)),
    }
  }

  // 获取组织员工列表
  async getEmployees(orgId: string): Promise<any[]> {
    // 模拟返回员工列表
    const org = this.organizations.get(orgId)
    if (!org) return []

    const count = org.employeeCount || 0
    return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
      id: `EMP-${orgId}-${i}`,
      name: `员工${i + 1}`,
      orgId,
      orgName: org.name,
      position: org.type === OrgType.POSITION ? org.name : undefined,
    }))
  }

  // 设置组织负责人
  async setManager(orgId: string, managerId: string): Promise<OrgNode | null> {
    return this.update(orgId, { managerId })
  }

  // 批量获取组织信息
  async getByIds(ids: string[]): Promise<OrgNode[]> {
    return ids.map((id) => this.organizations.get(id)).filter(Boolean) as OrgNode[]
  }

  // 搜索组织
  async search(keyword: string): Promise<OrgNode[]> {
    const nodes = Array.from(this.organizations.values())
    const lowerKeyword = keyword.toLowerCase()

    return nodes.filter(
      (n) =>
        n.name.toLowerCase().includes(lowerKeyword) || n.code.toLowerCase().includes(lowerKeyword),
    )
  }
}
