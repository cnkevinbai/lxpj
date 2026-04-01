/**
 * 项目管理服务
 * 项目创建、进度跟踪、任务管理、资源分配
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ProjectType {
  INTERNAL = 'INTERNAL',
  CLIENT = 'CLIENT',
  R_D = 'R_D',
  MAINTENANCE = 'MAINTENANCE',
}

// 项目接口
export interface Project {
  id: string
  name: string
  code: string
  type: ProjectType
  status: ProjectStatus
  description?: string
  clientId?: string
  clientName?: string
  ownerId: string
  ownerName: string
  teamMembers: string[]
  startDate: Date
  endDate?: Date
  estimatedEndDate?: Date
  progress: number
  budget?: number
  spentBudget?: number
  priority: TaskPriority
  tasks: Task[]
  milestones: Milestone[]
  risks: Risk[]
  createdAt: Date
  updatedAt: Date
}

// 任务接口
export interface Task {
  id: string
  projectId: string
  name: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  assigneeName?: string
  startDate?: Date
  dueDate?: Date
  completedDate?: Date
  estimatedHours?: number
  actualHours?: number
  dependencies: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// 里程碑接口
export interface Milestone {
  id: string
  projectId: string
  name: string
  description?: string
  dueDate: Date
  completed?: boolean
  completedDate?: Date
  tasks: string[]
}

// 风险接口
export interface Risk {
  id: string
  projectId: string
  description: string
  probability: 'LOW' | 'MEDIUM' | 'HIGH'
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  severity: number
  mitigation?: string
  status: 'OPEN' | 'MITIGATING' | 'RESOLVED' | 'ACCEPTED'
  owner?: string
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class ProjectManagementService {
  private projects: Map<string, Project> = new Map()
  private tasks: Map<string, Task> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化模拟项目数据
    const mockProjects: Project[] = [
      {
        id: 'PRJ-001',
        name: '道达智能车辆管理平台开发',
        code: 'IOV-PLATFORM',
        type: ProjectType.R_D,
        status: ProjectStatus.IN_PROGRESS,
        description: '智能车辆管理平台核心系统开发',
        ownerId: 'U-001',
        ownerName: '张三',
        teamMembers: ['U-001', 'U-002', 'U-003', 'U-004', 'U-005'],
        startDate: new Date('2026-01-01'),
        estimatedEndDate: new Date('2026-06-30'),
        progress: 75,
        budget: 500000,
        spentBudget: 350000,
        priority: TaskPriority.HIGH,
        tasks: [],
        milestones: [
          {
            id: 'MS-001',
            projectId: 'PRJ-001',
            name: '需求分析完成',
            dueDate: new Date('2026-01-15'),
            completed: true,
            completedDate: new Date('2026-01-14'),
            tasks: [],
          },
          {
            id: 'MS-002',
            projectId: 'PRJ-001',
            name: '架构设计完成',
            dueDate: new Date('2026-02-01'),
            completed: true,
            completedDate: new Date('2026-01-30'),
            tasks: [],
          },
          {
            id: 'MS-003',
            projectId: 'PRJ-001',
            name: '核心模块开发完成',
            dueDate: new Date('2026-04-01'),
            completed: false,
            tasks: [],
          },
          {
            id: 'MS-004',
            projectId: 'PRJ-001',
            name: '系统测试完成',
            dueDate: new Date('2026-05-15'),
            completed: false,
            tasks: [],
          },
          {
            id: 'MS-005',
            projectId: 'PRJ-001',
            name: '上线发布',
            dueDate: new Date('2026-06-30'),
            completed: false,
            tasks: [],
          },
        ],
        risks: [
          {
            id: 'RSK-001',
            projectId: 'PRJ-001',
            description: '核心技术人员离职风险',
            probability: 'LOW',
            impact: 'HIGH',
            severity: 6,
            mitigation: '建立知识文档库，培养后备人员',
            status: 'MITIGATING',
            owner: '张三',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 'PRJ-002',
        name: '客户CRM系统定制开发',
        code: 'CRM-CUSTOM',
        type: ProjectType.CLIENT,
        status: ProjectStatus.IN_PROGRESS,
        description: '为ABC公司定制CRM系统',
        clientId: 'C-001',
        clientName: 'ABC科技公司',
        ownerId: 'U-002',
        ownerName: '李四',
        teamMembers: ['U-002', 'U-003', 'U-006'],
        startDate: new Date('2026-02-01'),
        estimatedEndDate: new Date('2026-05-01'),
        progress: 50,
        budget: 200000,
        spentBudget: 100000,
        priority: TaskPriority.HIGH,
        tasks: [],
        milestones: [
          {
            id: 'MS-006',
            projectId: 'PRJ-002',
            name: '需求确认',
            dueDate: new Date('2026-02-15'),
            completed: true,
            completedDate: new Date('2026-02-14'),
            tasks: [],
          },
          {
            id: 'MS-007',
            projectId: 'PRJ-002',
            name: '原型设计完成',
            dueDate: new Date('2026-03-01'),
            completed: true,
            completedDate: new Date('2026-02-28'),
            tasks: [],
          },
          {
            id: 'MS-008',
            projectId: 'PRJ-002',
            name: '开发完成',
            dueDate: new Date('2026-04-15'),
            completed: false,
            tasks: [],
          },
          {
            id: 'MS-009',
            projectId: 'PRJ-002',
            name: '交付验收',
            dueDate: new Date('2026-05-01'),
            completed: false,
            tasks: [],
          },
        ],
        risks: [],
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date(),
      },
      {
        id: 'PRJ-003',
        name: '系统运维优化项目',
        code: 'OPS-OPT',
        type: ProjectType.MAINTENANCE,
        status: ProjectStatus.PLANNING,
        description: '系统性能优化和运维流程改进',
        ownerId: 'U-004',
        ownerName: '王五',
        teamMembers: ['U-004', 'U-007'],
        startDate: new Date('2026-04-01'),
        estimatedEndDate: new Date('2026-06-01'),
        progress: 0,
        budget: 50000,
        spentBudget: 0,
        priority: TaskPriority.MEDIUM,
        tasks: [],
        milestones: [],
        risks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'PRJ-004',
        name: '内部OA系统升级',
        code: 'OA-UPGRADE',
        type: ProjectType.INTERNAL,
        status: ProjectStatus.COMPLETED,
        description: 'OA系统功能升级和界面优化',
        ownerId: 'U-005',
        ownerName: '赵六',
        teamMembers: ['U-005', 'U-008'],
        startDate: new Date('2025-10-01'),
        endDate: new Date('2026-01-15'),
        progress: 100,
        budget: 80000,
        spentBudget: 75000,
        priority: TaskPriority.MEDIUM,
        tasks: [],
        milestones: [],
        risks: [],
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2026-01-15'),
      },
      {
        id: 'PRJ-005',
        name: '移动端App开发',
        code: 'APP-DEV',
        type: ProjectType.R_D,
        status: ProjectStatus.ON_HOLD,
        description: '公司移动端App开发项目',
        ownerId: 'U-006',
        ownerName: '钱七',
        teamMembers: ['U-006', 'U-009'],
        startDate: new Date('2026-01-15'),
        progress: 20,
        budget: 150000,
        spentBudget: 30000,
        priority: TaskPriority.MEDIUM,
        tasks: [],
        milestones: [],
        risks: [
          {
            id: 'RSK-002',
            projectId: 'PRJ-005',
            description: '需求变更频繁',
            probability: 'HIGH',
            impact: 'MEDIUM',
            severity: 8,
            mitigation: '建立需求变更评审流程',
            status: 'OPEN',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date('2026-01-15'),
        updatedAt: new Date(),
      },
    ]

    mockProjects.forEach((project) => {
      this.projects.set(project.id, project)
    })

    // 初始化任务数据
    const mockTasks: Task[] = [
      {
        id: 'TK-001',
        projectId: 'PRJ-001',
        name: '完成用户模块开发',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        assigneeId: 'U-001',
        assigneeName: '张三',
        dueDate: new Date('2026-02-15'),
        completedDate: new Date('2026-02-14'),
        estimatedHours: 80,
        actualHours: 75,
        dependencies: [],
        tags: ['核心', '用户'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'TK-002',
        projectId: 'PRJ-001',
        name: '完成车辆接入模块',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        assigneeId: 'U-002',
        assigneeName: '李四',
        dueDate: new Date('2026-03-15'),
        estimatedHours: 100,
        actualHours: 60,
        dependencies: ['TK-001'],
        tags: ['核心', '车辆'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'TK-003',
        projectId: 'PRJ-001',
        name: '完成监控模块开发',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assigneeId: 'U-003',
        assigneeName: '王五',
        dueDate: new Date('2026-04-01'),
        estimatedHours: 120,
        dependencies: ['TK-002'],
        tags: ['核心', '监控'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'TK-004',
        projectId: 'PRJ-001',
        name: '前端页面开发',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        assigneeId: 'U-004',
        assigneeName: '赵六',
        dueDate: new Date('2026-03-20'),
        estimatedHours: 60,
        actualHours: 40,
        dependencies: [],
        tags: ['前端'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'TK-005',
        projectId: 'PRJ-001',
        name: '系统测试',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assigneeId: 'U-005',
        assigneeName: '钱七',
        dueDate: new Date('2026-05-01'),
        estimatedHours: 80,
        dependencies: ['TK-002', 'TK-003', 'TK-004'],
        tags: ['测试'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'TK-006',
        projectId: 'PRJ-002',
        name: '完成客户管理功能',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        assigneeId: 'U-002',
        assigneeName: '李四',
        completedDate: new Date('2026-03-01'),
        estimatedHours: 50,
        actualHours: 45,
        dependencies: [],
        tags: ['CRM'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'TK-007',
        projectId: 'PRJ-002',
        name: '完成报表模块',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        assigneeId: 'U-003',
        assigneeName: '王五',
        dueDate: new Date('2026-04-01'),
        estimatedHours: 40,
        actualHours: 20,
        dependencies: ['TK-006'],
        tags: ['报表'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'TK-008',
        projectId: 'PRJ-002',
        name: '客户培训准备',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        assigneeId: 'U-006',
        assigneeName: '孙八',
        dueDate: new Date('2026-04-20'),
        estimatedHours: 20,
        dependencies: ['TK-007'],
        tags: ['培训'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockTasks.forEach((task) => {
      this.tasks.set(task.id, task)
    })
  }

  // 获取项目列表
  async getProjects(query?: {
    status?: ProjectStatus
    type?: ProjectType
    ownerId?: string
    clientId?: string
  }): Promise<Project[]> {
    let projects = Array.from(this.projects.values())

    if (query) {
      if (query.status) {
        projects = projects.filter((p) => p.status === query.status)
      }
      if (query.type) {
        projects = projects.filter((p) => p.type === query.type)
      }
      if (query.ownerId) {
        projects = projects.filter((p) => p.ownerId === query.ownerId)
      }
      if (query.clientId) {
        projects = projects.filter((p) => p.clientId === query.clientId)
      }
    }

    return projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // 获取项目详情
  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null
  }

  // 获取项目任务
  async getProjectTasks(
    projectId: string,
    query?: {
      status?: TaskStatus
      assigneeId?: string
      priority?: TaskPriority
    },
  ): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values()).filter((t) => t.projectId === projectId)

    if (query) {
      if (query.status) {
        tasks = tasks.filter((t) => t.status === query.status)
      }
      if (query.assigneeId) {
        tasks = tasks.filter((t) => t.assigneeId === query.assigneeId)
      }
      if (query.priority) {
        tasks = tasks.filter((t) => t.priority === query.priority)
      }
    }

    return tasks
  }

  // 获取项目里程碑
  async getProjectMilestones(projectId: string): Promise<Milestone[]> {
    const project = this.projects.get(projectId)
    return project?.milestones || []
  }

  // 获取项目风险
  async getProjectRisks(projectId: string): Promise<Risk[]> {
    const project = this.projects.get(projectId)
    return project?.risks || []
  }

  // 获取任务详情
  async getTask(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null
  }

  // 获取项目统计
  async getProjectStats(): Promise<{
    totalProjects: number
    activeProjects: number
    completedProjects: number
    onHoldProjects: number
    totalBudget: number
    spentBudget: number
    avgProgress: number
  }> {
    const projects = Array.from(this.projects.values())

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === ProjectStatus.IN_PROGRESS).length,
      completedProjects: projects.filter((p) => p.status === ProjectStatus.COMPLETED).length,
      onHoldProjects: projects.filter((p) => p.status === ProjectStatus.ON_HOLD).length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      spentBudget: projects.reduce((sum, p) => sum + (p.spentBudget || 0), 0),
      avgProgress:
        projects.length > 0
          ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length
          : 0,
    }
  }

  // 获取任务统计
  async getTaskStats(projectId?: string): Promise<{
    totalTasks: number
    todoTasks: number
    inProgressTasks: number
    doneTasks: number
    blockedTasks: number
    overdueTasks: number
  }> {
    let tasks = Array.from(this.tasks.values())
    if (projectId) {
      tasks = tasks.filter((t) => t.projectId === projectId)
    }

    const now = new Date()
    const overdueTasks = tasks.filter(
      (t) => t.dueDate && t.dueDate < now && t.status !== TaskStatus.DONE,
    )

    return {
      totalTasks: tasks.length,
      todoTasks: tasks.filter((t) => t.status === TaskStatus.TODO).length,
      inProgressTasks: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      doneTasks: tasks.filter((t) => t.status === TaskStatus.DONE).length,
      blockedTasks: tasks.filter((t) => t.status === TaskStatus.BLOCKED).length,
      overdueTasks: overdueTasks.length,
    }
  }

  // 获取资源分配情况
  async getResourceAllocation(): Promise<
    {
      userId: string
      userName: string
      assignedTasks: number
      totalHours: number
      projects: string[]
    }[]
  > {
    const tasks = Array.from(this.tasks.values())
    const userMap = new Map<string, any>()

    tasks.forEach((task) => {
      if (task.assigneeId && task.assigneeName) {
        if (!userMap.has(task.assigneeId)) {
          userMap.set(task.assigneeId, {
            userId: task.assigneeId,
            userName: task.assigneeName,
            assignedTasks: 0,
            totalHours: 0,
            projects: new Set<string>(),
          })
        }
        const user = userMap.get(task.assigneeId)
        user.assignedTasks++
        user.totalHours += task.estimatedHours || 0
        user.projects.add(task.projectId)
      }
    })

    return Array.from(userMap.values()).map((u) => ({
      ...u,
      projects: Array.from(u.projects),
    }))
  }
}
