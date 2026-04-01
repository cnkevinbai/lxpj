/**
 * 服务调度服务
 * 工程师排班、任务分配、工作量平衡、技能匹配
 */
import { Injectable } from '@nestjs/common'

// 调度状态
export enum ScheduleStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  BUSY = 'BUSY',
  OFF_DUTY = 'OFF_DUTY',
  ON_LEAVE = 'ON_LEAVE',
}

// 服务类型
export enum ServiceType {
  INSTALLATION = 'INSTALLATION',
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  INSPECTION = 'INSPECTION',
  TRAINING = 'TRAINING',
  CONSULTATION = 'CONSULTATION',
}

// 优先级
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// 工程师接口
export interface Engineer {
  id: string
  name: string
  department: string
  skills: string[]
  certifications: string[]
  status: ScheduleStatus
  currentLocation?: { lat: number; lng: number; address: string }
  currentTaskId?: string
  currentTask?: string
  workingHours: { start: string; end: string }
  assignedTasksCount: number
  completedTasksToday: number
  rating: number
  specializations: string[]
}

// 服务任务接口
export interface ServiceTask {
  id: string
  type: ServiceType
  priority: Priority
  title: string
  description?: string
  customerId: string
  customerName: string
  customerPhone?: string
  location: { lat: number; lng: number; address: string }
  requiredSkills: string[]
  estimatedDuration: number // 分钟
  scheduledDate?: Date
  scheduledTime?: string
  assignedEngineerId?: string
  assignedEngineerName?: string
  status: 'PENDING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
}

// 排班记录
export interface ScheduleRecord {
  id: string
  engineerId: string
  engineerName: string
  date: Date
  shift: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'FULL_DAY'
  startTime: string
  endTime: string
  status: ScheduleStatus
  tasksCount: number
  totalHours: number
}

// 调度建议
export interface ScheduleSuggestion {
  taskId: string
  taskTitle: string
  suggestedEngineers: {
    engineerId: string
    engineerName: string
    matchScore: number
    reason: string
    estimatedTravelTime: number
    currentLoad: number
  }[]
}

@Injectable()
export class ServiceDispatchService {
  private engineers: Map<string, Engineer> = new Map()
  private serviceTasks: Map<string, ServiceTask> = new Map()
  private scheduleRecords: Map<string, ScheduleRecord> = new Map()

  constructor() {
    this.initDefaultData()
  }

  private initDefaultData() {
    // 初始化工程师数据
    const mockEngineers: Engineer[] = [
      {
        id: 'ENG-001',
        name: '张工',
        department: '售后服务部',
        skills: ['设备安装', '系统调试', '故障排查', '网络配置'],
        certifications: ['高级工程师', '安全认证'],
        status: ScheduleStatus.BUSY,
        currentLocation: { lat: 30.5, lng: 104.1, address: '成都市高新区' },
        currentTaskId: 'ST-001',
        currentTask: '设备安装调试',
        workingHours: { start: '08:00', end: '18:00' },
        assignedTasksCount: 2,
        completedTasksToday: 3,
        rating: 4.8,
        specializations: ['智能设备', '网络系统'],
      },
      {
        id: 'ENG-002',
        name: '李工',
        department: '售后服务部',
        skills: ['维修保养', '故障排查', '零部件更换', '系统升级'],
        certifications: ['中级工程师'],
        status: ScheduleStatus.AVAILABLE,
        currentLocation: { lat: 30.6, lng: 104.2, address: '成都市武侯区' },
        workingHours: { start: '08:00', end: '18:00' },
        assignedTasksCount: 0,
        completedTasksToday: 2,
        rating: 4.5,
        specializations: ['维修', '保养'],
      },
      {
        id: 'ENG-003',
        name: '王工',
        department: '售后服务部',
        skills: ['培训指导', '技术咨询', '系统演示', '文档编写'],
        certifications: ['培训师认证'],
        status: ScheduleStatus.AVAILABLE,
        currentLocation: { lat: 30.4, lng: 104.0, address: '成都市金牛区' },
        workingHours: { start: '09:00', end: '17:00' },
        assignedTasksCount: 1,
        completedTasksToday: 1,
        rating: 4.6,
        specializations: ['培训', '咨询'],
      },
      {
        id: 'ENG-004',
        name: '赵工',
        department: '售后服务部',
        skills: ['设备安装', '现场勘察', '方案设计', '项目协调'],
        certifications: ['项目经理认证'],
        status: ScheduleStatus.ASSIGNED,
        currentLocation: { lat: 30.7, lng: 104.3, address: '成都市锦江区' },
        currentTaskId: 'ST-002',
        currentTask: '现场勘察',
        workingHours: { start: '08:30', end: '17:30' },
        assignedTasksCount: 1,
        completedTasksToday: 0,
        rating: 4.7,
        specializations: ['项目管理', '方案设计'],
      },
      {
        id: 'ENG-005',
        name: '孙工',
        department: '售后服务部',
        skills: ['巡检检查', '数据采集', '报告编写', '风险评估'],
        certifications: ['安全检查员'],
        status: ScheduleStatus.OFF_DUTY,
        workingHours: { start: '08:00', end: '18:00' },
        assignedTasksCount: 0,
        completedTasksToday: 4,
        rating: 4.4,
        specializations: ['巡检', '评估'],
      },
      {
        id: 'ENG-006',
        name: '周工',
        department: '售后服务部',
        skills: ['紧急维修', '远程支持', '故障诊断', '应急响应'],
        certifications: ['高级工程师', '应急响应认证'],
        status: ScheduleStatus.AVAILABLE,
        currentLocation: { lat: 30.8, lng: 104.4, address: '成都市成华区' },
        workingHours: { start: '08:00', end: '20:00' },
        assignedTasksCount: 0,
        completedTasksToday: 2,
        rating: 4.9,
        specializations: ['紧急响应', '远程支持'],
      },
    ]

    mockEngineers.forEach((eng) => {
      this.engineers.set(eng.id, eng)
    })

    // 初始化服务任务
    const mockTasks: ServiceTask[] = [
      {
        id: 'ST-001',
        type: ServiceType.INSTALLATION,
        priority: Priority.HIGH,
        title: '智能设备安装调试',
        description: '为新客户安装智能车辆管理终端设备',
        customerId: 'C-001',
        customerName: 'ABC物流公司',
        customerPhone: '13800138001',
        location: { lat: 30.5, lng: 104.1, address: '成都市高新区天府大道100号' },
        requiredSkills: ['设备安装', '系统调试'],
        estimatedDuration: 180,
        scheduledDate: new Date(),
        scheduledTime: '10:00',
        assignedEngineerId: 'ENG-001',
        assignedEngineerName: '张工',
        status: 'IN_PROGRESS',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ST-002',
        type: ServiceType.INSPECTION,
        priority: Priority.MEDIUM,
        title: '现场勘察评估',
        description: '为新项目进行现场勘察和技术评估',
        customerId: 'C-002',
        customerName: 'XYZ运输公司',
        location: { lat: 30.6, lng: 104.2, address: '成都市武侯区人民南路50号' },
        requiredSkills: ['现场勘察', '方案设计'],
        estimatedDuration: 120,
        scheduledDate: new Date(),
        scheduledTime: '14:00',
        assignedEngineerId: 'ENG-004',
        assignedEngineerName: '赵工',
        status: 'SCHEDULED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ST-003',
        type: ServiceType.REPAIR,
        priority: Priority.URGENT,
        title: '紧急故障修复',
        description: '客户设备紧急故障，需要立即响应',
        customerId: 'C-003',
        customerName: 'DEF快递公司',
        customerPhone: '13900139001',
        location: { lat: 30.4, lng: 104.0, address: '成都市金牛区一环路20号' },
        requiredSkills: ['紧急维修', '故障诊断'],
        estimatedDuration: 60,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ST-004',
        type: ServiceType.TRAINING,
        priority: Priority.LOW,
        title: '系统使用培训',
        description: '为新客户进行系统操作培训',
        customerId: 'C-004',
        customerName: 'GHI公司',
        location: { lat: 30.7, lng: 104.3, address: '成都市锦江区东大街30号' },
        requiredSkills: ['培训指导', '系统演示'],
        estimatedDuration: 90,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ST-005',
        type: ServiceType.MAINTENANCE,
        priority: Priority.MEDIUM,
        title: '定期维护保养',
        description: '按计划进行设备定期维护',
        customerId: 'C-005',
        customerName: 'JKL公司',
        location: { lat: 30.8, lng: 104.4, address: '成都市成华区建设路40号' },
        requiredSkills: ['维修保养'],
        estimatedDuration: 60,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockTasks.forEach((task) => {
      this.serviceTasks.set(task.id, task)
    })

    // 初始化排班记录
    const mockRecords: ScheduleRecord[] = [
      {
        id: 'SR-001',
        engineerId: 'ENG-001',
        engineerName: '张工',
        date: new Date(),
        shift: 'FULL_DAY',
        startTime: '08:00',
        endTime: '18:00',
        status: ScheduleStatus.BUSY,
        tasksCount: 3,
        totalHours: 10,
      },
      {
        id: 'SR-002',
        engineerId: 'ENG-002',
        engineerName: '李工',
        date: new Date(),
        shift: 'FULL_DAY',
        startTime: '08:00',
        endTime: '18:00',
        status: ScheduleStatus.AVAILABLE,
        tasksCount: 0,
        totalHours: 10,
      },
      {
        id: 'SR-003',
        engineerId: 'ENG-003',
        engineerName: '王工',
        date: new Date(),
        shift: 'MORNING',
        startTime: '09:00',
        endTime: '12:00',
        status: ScheduleStatus.ASSIGNED,
        tasksCount: 1,
        totalHours: 3,
      },
      {
        id: 'SR-004',
        engineerId: 'ENG-004',
        engineerName: '赵工',
        date: new Date(),
        shift: 'AFTERNOON',
        startTime: '14:00',
        endTime: '17:30',
        status: ScheduleStatus.ASSIGNED,
        tasksCount: 1,
        totalHours: 3.5,
      },
      {
        id: 'SR-005',
        engineerId: 'ENG-005',
        engineerName: '孙工',
        date: new Date(),
        shift: 'MORNING',
        startTime: '08:00',
        endTime: '12:00',
        status: ScheduleStatus.OFF_DUTY,
        tasksCount: 4,
        totalHours: 4,
      },
      {
        id: 'SR-006',
        engineerId: 'ENG-006',
        engineerName: '周工',
        date: new Date(),
        shift: 'FULL_DAY',
        startTime: '08:00',
        endTime: '20:00',
        status: ScheduleStatus.AVAILABLE,
        tasksCount: 0,
        totalHours: 12,
      },
    ]

    mockRecords.forEach((record) => {
      this.scheduleRecords.set(record.id, record)
    })
  }

  // 获取工程师列表
  async getEngineers(query?: {
    status?: ScheduleStatus
    department?: string
    skill?: string
  }): Promise<Engineer[]> {
    let engineers = Array.from(this.engineers.values())

    if (query) {
      if (query.status) {
        engineers = engineers.filter((e) => e.status === query.status)
      }
      if (query.department) {
        engineers = engineers.filter((e) => e.department === query.department)
      }
      if (query.skill) {
        engineers = engineers.filter((e) => e.skills.includes(query.skill!))
      }
    }

    return engineers
  }

  // 获取工程师详情
  async getEngineer(id: string): Promise<Engineer | null> {
    return this.engineers.get(id) || null
  }

  // 获取服务任务列表
  async getServiceTasks(query?: {
    status?: string
    type?: ServiceType
    priority?: Priority
    engineerId?: string
  }): Promise<ServiceTask[]> {
    let tasks = Array.from(this.serviceTasks.values())

    if (query) {
      if (query.status) {
        tasks = tasks.filter((t) => t.status === query.status)
      }
      if (query.type) {
        tasks = tasks.filter((t) => t.type === query.type)
      }
      if (query.priority) {
        tasks = tasks.filter((t) => t.priority === query.priority)
      }
      if (query.engineerId) {
        tasks = tasks.filter((t) => t.assignedEngineerId === query.engineerId)
      }
    }

    return tasks.sort((a, b) => {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  // 获取服务任务详情
  async getServiceTask(id: string): Promise<ServiceTask | null> {
    return this.serviceTasks.get(id) || null
  }

  // 获取排班记录
  async getScheduleRecords(query?: {
    engineerId?: string
    date?: Date
    status?: ScheduleStatus
  }): Promise<ScheduleRecord[]> {
    let records = Array.from(this.scheduleRecords.values())

    if (query) {
      if (query.engineerId) {
        records = records.filter((r) => r.engineerId === query.engineerId)
      }
      if (query.date) {
        records = records.filter((r) => r.date.toDateString() === query.date!.toDateString())
      }
      if (query.status) {
        records = records.filter((r) => r.status === query.status)
      }
    }

    return records
  }

  // 获取调度建议
  async getScheduleSuggestions(taskId: string): Promise<ScheduleSuggestion | null> {
    const task = this.serviceTasks.get(taskId)
    if (!task) return null

    const availableEngineers = Array.from(this.engineers.values()).filter(
      (e) => e.status === ScheduleStatus.AVAILABLE || e.status === ScheduleStatus.ASSIGNED,
    )

    // 计算匹配分数
    const suggestions = availableEngineers.map((eng) => {
      // 技能匹配度
      const skillMatch = task.requiredSkills.filter((s) => eng.skills.includes(s)).length
      const skillScore = (skillMatch / task.requiredSkills.length) * 40

      // 工作量平衡
      const loadScore = 30 - eng.assignedTasksCount * 5

      // 评分权重
      const ratingScore = (eng.rating - 4) * 10

      // 位置距离（模拟）
      const travelTime = Math.abs(eng.currentLocation?.lat || 0 - task.location.lat) * 10
      const distanceScore = 20 - travelTime

      const matchScore = Math.max(
        0,
        Math.min(100, skillScore + loadScore + ratingScore + distanceScore),
      )

      let reason = ''
      if (skillMatch === task.requiredSkills.length) {
        reason = '技能完全匹配'
      } else if (eng.assignedTasksCount === 0) {
        reason = '当前空闲'
      } else if (eng.rating >= 4.8) {
        reason = '高评分工程师'
      } else {
        reason = '综合匹配'
      }

      return {
        engineerId: eng.id,
        engineerName: eng.name,
        matchScore,
        reason,
        estimatedTravelTime: travelTime,
        currentLoad: eng.assignedTasksCount,
      }
    })

    return {
      taskId,
      taskTitle: task.title,
      suggestedEngineers: suggestions.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3),
    }
  }

  // 获取调度统计
  async getDispatchStats(): Promise<{
    totalEngineers: number
    availableEngineers: number
    busyEngineers: number
    pendingTasks: number
    scheduledTasks: number
    inProgressTasks: number
    urgentTasks: number
    avgTasksPerEngineer: number
  }> {
    const engineers = Array.from(this.engineers.values())
    const tasks = Array.from(this.serviceTasks.values())

    return {
      totalEngineers: engineers.length,
      availableEngineers: engineers.filter((e) => e.status === ScheduleStatus.AVAILABLE).length,
      busyEngineers: engineers.filter((e) => e.status === ScheduleStatus.BUSY).length,
      pendingTasks: tasks.filter((t) => t.status === 'PENDING').length,
      scheduledTasks: tasks.filter((t) => t.status === 'SCHEDULED').length,
      inProgressTasks: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      urgentTasks: tasks.filter((t) => t.priority === Priority.URGENT).length,
      avgTasksPerEngineer:
        engineers.reduce((sum, e) => sum + e.assignedTasksCount, 0) / engineers.length,
    }
  }

  // 获取工作量平衡报告
  async getWorkloadBalance(): Promise<{
    overloaded: Engineer[]
    underloaded: Engineer[]
    balanced: Engineer[]
    recommendations: string[]
  }> {
    const engineers = Array.from(this.engineers.values())

    const overloaded = engineers.filter((e) => e.assignedTasksCount >= 3)
    const underloaded = engineers.filter(
      (e) => e.assignedTasksCount === 0 && e.status === ScheduleStatus.AVAILABLE,
    )
    const balanced = engineers.filter((e) => e.assignedTasksCount >= 1 && e.assignedTasksCount <= 2)

    const recommendations = [
      '张工当前任务较多，建议将部分任务分配给李工',
      '周工具备紧急响应能力，建议优先分配紧急任务',
      '王工适合培训任务，建议分配系统培训类任务',
      '孙工当前休息，明日可安排巡检任务',
    ]

    return {
      overloaded,
      underloaded,
      balanced,
      recommendations,
    }
  }
}
