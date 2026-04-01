/**
 * HR 模块定义
 * 热插拔模块 - 聚合员工管理、考勤管理、薪资管理
 *
 * 企业人力资源核心模块，支持钉钉第三方系统集成
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
} from '../../core/module/interfaces'
import { HttpMethod, ModuleRoute } from '../../core/module/interfaces/module-route.interface'
import {
  ModulePermission,
  PermissionType,
} from '../../core/module/interfaces/module-permission.interface'
import { ModuleEvent, EventType } from '../../core/module/interfaces/module-event.interface'

// ============================================
// 模块清单定义
// ============================================

export const HR_MODULE_MANIFEST: ModuleManifest = {
  // 基本信息
  id: '@daoda/hr',
  name: '人力资源管理',
  version: '1.0.0',
  description: 'HR管理模块，包含员工管理、考勤管理、薪资管理，支持钉钉系统集成',

  // 分类
  category: 'business',
  tags: ['hr', 'employee', 'attendance', 'salary', 'dingtalk', 'integration'],

  // 依赖
  dependencies: [
    { id: '@daoda/auth', version: '>=1.0.0' },
    { id: '@daoda/user', version: '>=1.0.0' },
  ],

  // 权限声明
  permissions: [
    'hr:employee:view',
    'hr:employee:create',
    'hr:employee:update',
    'hr:employee:delete',
    'hr:attendance:view',
    'hr:attendance:create',
    'hr:attendance:update',
    'hr:attendance:export',
    'hr:salary:view',
    'hr:salary:create',
    'hr:salary:update',
    'hr:salary:approve',
    'hr:salary:pay',
    'hr:dingtalk:sync',
    'hr:report:view',
  ],

  // 热更新配置
  hotUpdate: {
    enabled: true,
    strategy: HotUpdateStrategy.RESTART,
  },

  // 技术信息
  routePrefix: '/api/v1/hr',
  tablePrefix: 'hr_',
}

// ============================================
// 钉钉集成配置接口
// ============================================

/**
 * 钉钉集成配置
 */
interface DingTalkConfig {
  /** 企业CorpId */
  corpId: string
  /** AppKey */
  appKey: string
  /** AppSecret */
  appSecret: string
  /** 是否启用考勤同步 */
  enableAttendanceSync: boolean
  /** 是否启用员工同步 */
  enableEmployeeSync: boolean
  /** 同步频率（分钟） */
  syncIntervalMinutes: number
  /** 最后同步时间 */
  lastSyncTime?: Date
}

/**
 * 钉钉考勤记录
 */
interface DingTalkAttendanceRecord {
  /** 钉钉用户ID */
  dingTalkUserId: string
  /** 员工姓名 */
  userName: string
  /** 考勤日期 */
  workDate: string
  /** 上班打卡时间 */
  checkInTime?: string
  /** 下班打卡时间 */
  checkOutTime?: string
  /** 打卡结果 */
  timeResult: string // Normal, Early, Late, SeriousLate, Absenteeism
  /** 打卡位置 */
  locationResult?: string
  /** 来源ID */
  sourceId?: string
}

/**
 * 钉钉员工信息
 */
interface DingTalkEmployee {
  /** 钉钉用户ID */
  dingTalkUserId: string
  /** 姓名 */
  name: string
  /** 手机号 */
  mobile: string
  /** 部门ID列表 */
  deptIdList: number[]
  /** 职位 */
  position?: string
  /** 邮箱 */
  email?: string
  /** 入职时间 */
  hiredDate?: string
  /** 工号 */
  jobNumber?: string
  /** 头像URL */
  avatar?: string
  /** 状态 */
  status: number // 1-已激活 2-已禁用 4-未激活 5-退出企业
}

// ============================================
// HR 模块实现
// ============================================

/**
 * HR 聚合模块
 * 人力资源核心 - 员工/考勤/薪资 + 钉钉集成
 */
export class HrModule extends BaseModule {
  // 模块清单
  readonly manifest = HR_MODULE_MANIFEST

  // 钉钉配置缓存
  private dingTalkConfig: DingTalkConfig | null = null

  // 钉钉AccessToken缓存
  private dingTalkAccessToken: string | null = null
  private dingTalkTokenExpireTime: number = 0

  // ============================================
  // 生命周期钩子
  // ============================================

  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    await super.onInstall(context)

    this.logger?.info('HR模块安装开始...')

    // 检查数据库表
    const prisma = context.serviceRegistry.get<any>('prisma')
    if (prisma) {
      try {
        await prisma.employee.findFirst()
        await prisma.attendance.findFirst()
        await prisma.salary.findFirst()
        this.logger?.info('HR数据表验证成功')
      } catch (error) {
        this.logger?.warn('HR数据表可能不存在，需要初始化')
      }
    }

    // 设置默认配置
    await context.config.setModuleConfigs(this.manifest.id, {
      // 员工配置
      employee: {
        sequencePrefix: 'EMP',
        autoNumber: true,
        defaultDepartment: 'default',
        avatarStorage: 'local',
      },
      // 考勤配置
      attendance: {
        workStartTime: '09:00',
        workEndTime: '18:00',
        lunchBreakStart: '12:00',
        lunchBreakEnd: '13:00',
        flexibleMinutes: 15,
        overtimeThresholdMinutes: 60,
        absentThresholdDays: 3,
      },
      // 薪资配置
      salary: {
        paymentDay: 15, // 每月15日发薪
        taxCalculationMethod: 'china_2024',
        socialInsuranceEnabled: true,
        housingFundEnabled: true,
        approvalThreshold: 50000,
      },
      // 钉钉集成配置（默认未启用）
      dingtalk: {
        enabled: false,
        corpId: '',
        appKey: '',
        appSecret: '',
        enableAttendanceSync: true,
        enableEmployeeSync: true,
        syncIntervalMinutes: 30,
      },
    })

    this.logger?.info('HR模块安装完成')
  }

  /**
   * 初始化钩子
   */
  async onInit(): Promise<void> {
    await super.onInit()

    this.logger?.info('HR模块初始化...')

    // 注册内部服务
    this._context?.serviceRegistry.register(this.manifest.id, 'employee', {
      service: 'employee',
      methods: ['create', 'update', 'delete', 'getByDepartment', 'importFromDingTalk', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'attendance', {
      service: 'attendance',
      methods: ['create', 'update', 'syncFromDingTalk', 'calculateMonthly', 'export', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'salary', {
      service: 'salary',
      methods: ['create', 'calculate', 'approve', 'pay', 'generateMonthly', 'getStats'],
    })

    this._context?.serviceRegistry.register(this.manifest.id, 'dingtalk', {
      service: 'dingtalk',
      methods: [
        'getAccessToken',
        'syncEmployees',
        'syncAttendance',
        'syncDepartments',
        'getAttendanceList',
        'getUserList',
        'getDepartmentList',
      ],
    })

    // 加载钉钉配置
    await this.loadDingTalkConfig()

    // 如果钉钉集成启用，启动定时同步
    if (this.dingTalkConfig && this.dingTalkConfig.corpId) {
      this.logger?.info('钉钉集成已配置，准备启动同步')
    }

    this.logger?.info('HR模块服务注册完成')
  }

  /**
   * 启动钩子
   */
  async onStart(): Promise<void> {
    await super.onStart()

    this.logger?.info('HR模块启动...')

    // 发送启动事件
    this.eventBus?.emit('hr.started', {
      moduleId: this.manifest.id,
      version: this.manifest.version,
      timestamp: new Date().toISOString(),
    })

    // 检查今日考勤异常
    await this.checkTodayAttendanceAbnormal()

    // 检查薪资审批提醒
    await this.checkSalaryApprovalReminder()

    this.logger?.info('HR模块已启动')
  }

  /**
   * 停止钩子
   */
  async onStop(): Promise<void> {
    await super.onStop()

    this.logger?.info('HR模块停止...')

    // 发送停止事件
    this.eventBus?.emit('hr.stopped', {
      moduleId: this.manifest.id,
      timestamp: new Date().toISOString(),
    })

    this.logger?.info('HR模块已停止')
  }

  /**
   * 卸载钩子
   */
  async onUninstall(): Promise<void> {
    await super.onUninstall()

    this.logger?.info('HR模块卸载...')

    // 清理服务注册
    this._context?.serviceRegistry.unregister(this.manifest.id, 'employee')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'attendance')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'salary')
    this._context?.serviceRegistry.unregister(this.manifest.id, 'dingtalk')

    this.logger?.info('HR模块已卸载')
  }

  /**
   * 健康检查
   */
  async onHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    details: any
    timestamp: number
  }> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')

    const checks = {
      database: false,
      employeeService: false,
      attendanceService: false,
      salaryService: false,
      dingTalkIntegration: false,
    }

    try {
      // 检查数据库连接
      if (prisma) {
        await prisma.$queryRaw`SELECT 1`
        checks.database = true
      }

      // 检查服务注册
      checks.employeeService = this._context?.serviceRegistry.get('employee') !== undefined
      checks.attendanceService = this._context?.serviceRegistry.get('attendance') !== undefined
      checks.salaryService = this._context?.serviceRegistry.get('salary') !== undefined

      // 检查钉钉集成状态
      if (this.dingTalkConfig && this.dingTalkConfig.corpId) {
        try {
          const token = await this.getDingTalkAccessToken()
          checks.dingTalkIntegration = !!token
        } catch {
          checks.dingTalkIntegration = false
        }
      } else {
        checks.dingTalkIntegration = true // 未配置也算正常
      }
    } catch (error) {
      this.logger?.error('HR健康检查失败', error)
    }

    const healthyCount = Object.values(checks).filter(Boolean).length
    const status: 'healthy' | 'degraded' | 'unhealthy' =
      healthyCount === 5 ? 'healthy' : healthyCount >= 3 ? 'degraded' : 'unhealthy'

    return {
      status,
      details: {
        checks,
        healthyCount,
        totalCount: 5,
        dingTalkEnabled: !!this.dingTalkConfig?.corpId,
      },
      timestamp: Date.now(),
    }
  }

  // ============================================
  // 扩展点注册
  // ============================================

  /**
   * 获取路由定义
   */
  getRoutes(): ModuleRoute[] {
    return [
      // ===== 员工管理 API =====
      {
        path: '/employee',
        method: HttpMethod.GET,
        handler: 'employee.list',
        description: '员工列表查询',
        permission: 'hr:employee:view',
      },
      {
        path: '/employee/:id',
        method: HttpMethod.GET,
        handler: 'employee.detail',
        description: '员工详情',
        permission: 'hr:employee:view',
      },
      {
        path: '/employee',
        method: HttpMethod.POST,
        handler: 'employee.create',
        description: '创建员工',
        permission: 'hr:employee:create',
      },
      {
        path: '/employee/:id',
        method: HttpMethod.PUT,
        handler: 'employee.update',
        description: '更新员工信息',
        permission: 'hr:employee:update',
      },
      {
        path: '/employee/:id',
        method: HttpMethod.DELETE,
        handler: 'employee.delete',
        description: '删除员工',
        permission: 'hr:employee:delete',
      },
      {
        path: '/employee/by-department/:deptId',
        method: HttpMethod.GET,
        handler: 'employee.byDepartment',
        description: '部门员工列表',
        permission: 'hr:employee:view',
      },
      {
        path: '/employee/stats',
        method: HttpMethod.GET,
        handler: 'employee.stats',
        description: '员工统计',
        permission: 'hr:employee:view',
      },

      // ===== 钉钉员工导入 API =====
      {
        path: '/employee/import/dingtalk',
        method: HttpMethod.POST,
        handler: 'employee.importDingTalk',
        description: '从钉钉导入员工',
        permission: 'hr:dingtalk:sync',
      },
      {
        path: '/employee/sync/dingtalk',
        method: HttpMethod.POST,
        handler: 'employee.syncDingTalk',
        description: '同步钉钉员工数据',
        permission: 'hr:dingtalk:sync',
      },

      // ===== 考勤管理 API =====
      {
        path: '/attendance',
        method: HttpMethod.GET,
        handler: 'attendance.list',
        description: '考勤记录列表',
        permission: 'hr:attendance:view',
      },
      {
        path: '/attendance/:id',
        method: HttpMethod.GET,
        handler: 'attendance.detail',
        description: '考勤记录详情',
        permission: 'hr:attendance:view',
      },
      {
        path: '/attendance',
        method: HttpMethod.POST,
        handler: 'attendance.create',
        description: '创建考勤记录',
        permission: 'hr:attendance:create',
      },
      {
        path: '/attendance/:id',
        method: HttpMethod.PUT,
        handler: 'attendance.update',
        description: '更新考勤记录',
        permission: 'hr:attendance:update',
      },
      {
        path: '/attendance/monthly',
        method: HttpMethod.GET,
        handler: 'attendance.monthly',
        description: '月度考勤汇总',
        permission: 'hr:attendance:view',
      },
      {
        path: '/attendance/abnormal',
        method: HttpMethod.GET,
        handler: 'attendance.abnormal',
        description: '考勤异常记录',
        permission: 'hr:attendance:view',
      },
      {
        path: '/attendance/export',
        method: HttpMethod.GET,
        handler: 'attendance.export',
        description: '导出考勤报表',
        permission: 'hr:attendance:export',
      },
      {
        path: '/attendance/by-employee/:empId',
        method: HttpMethod.GET,
        handler: 'attendance.byEmployee',
        description: '员工考勤记录',
        permission: 'hr:attendance:view',
      },

      // ===== 钉钉考勤同步 API =====
      {
        path: '/attendance/sync/dingtalk',
        method: HttpMethod.POST,
        handler: 'attendance.syncDingTalk',
        description: '同步钉钉考勤数据',
        permission: 'hr:dingtalk:sync',
      },
      {
        path: '/attendance/sync/dingtalk/status',
        method: HttpMethod.GET,
        handler: 'attendance.syncStatus',
        description: '钉钉同步状态',
        permission: 'hr:dingtalk:sync',
      },

      // ===== 薪资管理 API =====
      {
        path: '/salary',
        method: HttpMethod.GET,
        handler: 'salary.list',
        description: '薪资记录列表',
        permission: 'hr:salary:view',
      },
      {
        path: '/salary/:id',
        method: HttpMethod.GET,
        handler: 'salary.detail',
        description: '薪资记录详情',
        permission: 'hr:salary:view',
      },
      {
        path: '/salary',
        method: HttpMethod.POST,
        handler: 'salary.create',
        description: '创建薪资记录',
        permission: 'hr:salary:create',
      },
      {
        path: '/salary/:id',
        method: HttpMethod.PUT,
        handler: 'salary.update',
        description: '更新薪资记录',
        permission: 'hr:salary:update',
      },
      {
        path: '/salary/:id/approve',
        method: HttpMethod.POST,
        handler: 'salary.approve',
        description: '审批薪资',
        permission: 'hr:salary:approve',
      },
      {
        path: '/salary/:id/pay',
        method: HttpMethod.POST,
        handler: 'salary.pay',
        description: '发放薪资',
        permission: 'hr:salary:pay',
      },
      {
        path: '/salary/generate',
        method: HttpMethod.POST,
        handler: 'salary.generate',
        description: '生成月度薪资',
        permission: 'hr:salary:create',
      },
      {
        path: '/salary/monthly',
        method: HttpMethod.GET,
        handler: 'salary.monthly',
        description: '月度薪资汇总',
        permission: 'hr:salary:view',
      },
      {
        path: '/salary/by-employee/:empId',
        method: HttpMethod.GET,
        handler: 'salary.byEmployee',
        description: '员工薪资记录',
        permission: 'hr:salary:view',
      },
      {
        path: '/salary/stats',
        method: HttpMethod.GET,
        handler: 'salary.stats',
        description: '薪资统计',
        permission: 'hr:salary:view',
      },

      // ===== 钉钉集成配置 API =====
      {
        path: '/dingtalk/config',
        method: HttpMethod.GET,
        handler: 'dingtalk.getConfig',
        description: '获取钉钉配置',
        permission: 'hr:dingtalk:sync',
      },
      {
        path: '/dingtalk/config',
        method: HttpMethod.PUT,
        handler: 'dingtalk.updateConfig',
        description: '更新钉钉配置',
        permission: 'hr:dingtalk:sync',
      },
      {
        path: '/dingtalk/test',
        method: HttpMethod.POST,
        handler: 'dingtalk.testConnection',
        description: '测试钉钉连接',
        permission: 'hr:dingtalk:sync',
      },
      {
        path: '/dingtalk/sync/all',
        method: HttpMethod.POST,
        handler: 'dingtalk.syncAll',
        description: '全量同步钉钉数据',
        permission: 'hr:dingtalk:sync',
      },
      {
        path: '/dingtalk/departments',
        method: HttpMethod.GET,
        handler: 'dingtalk.getDepartments',
        description: '获取钉钉部门列表',
        permission: 'hr:dingtalk:sync',
      },

      // ===== HR 报表 API =====
      {
        path: '/report/summary',
        method: HttpMethod.GET,
        handler: 'report.summary',
        description: 'HR汇总报表',
        permission: 'hr:report:view',
      },
      {
        path: '/report/attendance',
        method: HttpMethod.GET,
        handler: 'report.attendance',
        description: '考勤分析报表',
        permission: 'hr:report:view',
      },
      {
        path: '/report/salary',
        method: HttpMethod.GET,
        handler: 'report.salary',
        description: '薪资分析报表',
        permission: 'hr:report:view',
      },
    ]
  }

  /**
   * 获取权限定义
   */
  getPermissions(): ModulePermission[] {
    // 员工权限
    const employeePermissions: ModulePermission[] = [
      {
        id: 'hr:employee:view',
        name: '查看员工',
        type: PermissionType.RESOURCE,
        description: '查看员工基本信息',
      },
      {
        id: 'hr:employee:create',
        name: '创建员工',
        type: PermissionType.ACTION,
        description: '创建新员工档案',
      },
      {
        id: 'hr:employee:update',
        name: '更新员工',
        type: PermissionType.ACTION,
        description: '更新员工信息',
      },
      {
        id: 'hr:employee:delete',
        name: '删除员工',
        type: PermissionType.ADMIN,
        description: '删除员工档案',
      },
    ]

    // 考勤权限
    const attendancePermissions: ModulePermission[] = [
      {
        id: 'hr:attendance:view',
        name: '查看考勤',
        type: PermissionType.RESOURCE,
        description: '查看考勤记录',
      },
      {
        id: 'hr:attendance:create',
        name: '创建考勤',
        type: PermissionType.ACTION,
        description: '创建考勤记录',
      },
      {
        id: 'hr:attendance:update',
        name: '更新考勤',
        type: PermissionType.ACTION,
        description: '更新考勤记录',
      },
      {
        id: 'hr:attendance:export',
        name: '导出考勤',
        type: PermissionType.ACTION,
        description: '导出考勤报表',
      },
    ]

    // 薪资权限
    const salaryPermissions: ModulePermission[] = [
      {
        id: 'hr:salary:view',
        name: '查看薪资',
        type: PermissionType.DATA,
        description: '查看薪资信息（敏感数据）',
      },
      {
        id: 'hr:salary:create',
        name: '创建薪资',
        type: PermissionType.ACTION,
        description: '创建薪资记录',
      },
      {
        id: 'hr:salary:update',
        name: '更新薪资',
        type: PermissionType.ACTION,
        description: '更新薪资记录',
      },
      {
        id: 'hr:salary:approve',
        name: '审批薪资',
        type: PermissionType.ADMIN,
        description: '审批薪资发放',
      },
      {
        id: 'hr:salary:pay',
        name: '发放薪资',
        type: PermissionType.ADMIN,
        description: '执行薪资发放',
      },
    ]

    // 钉钉集成权限
    const dingTalkPermissions: ModulePermission[] = [
      {
        id: 'hr:dingtalk:sync',
        name: '钉钉同步',
        type: PermissionType.ADMIN,
        description: '同步钉钉员工和考勤数据',
      },
    ]

    // 报表权限
    const reportPermissions: ModulePermission[] = [
      {
        id: 'hr:report:view',
        name: '查看HR报表',
        type: PermissionType.RESOURCE,
        description: '查看HR汇总和分析报表',
      },
    ]

    return [
      ...employeePermissions,
      ...attendancePermissions,
      ...salaryPermissions,
      ...dingTalkPermissions,
      ...reportPermissions,
    ] as ModulePermission[]
  }

  /**
   * 获取菜单定义
   */
  getMenus(): ModuleMenuItem[] {
    return [
      {
        id: 'hr',
        title: '人力资源',
        path: '/hr',
        icon: 'users',
        order: 6,
        children: [
          // 员工管理
          {
            id: 'hr-employee',
            title: '员工管理',
            path: '/hr/employee',
            icon: 'user',
            permissions: ['hr:employee:view'],
            order: 1,
            children: [
              {
                id: 'hr-employee-list',
                title: '员工列表',
                path: '/hr/employee/list',
                icon: 'list',
                permissions: ['hr:employee:view'],
                order: 1,
              },
              {
                id: 'hr-employee-stats',
                title: '员工统计',
                path: '/hr/employee/stats',
                icon: 'chart',
                permissions: ['hr:employee:view'],
                order: 2,
              },
            ],
          },
          // 考勤管理
          {
            id: 'hr-attendance',
            title: '考勤管理',
            path: '/hr/attendance',
            icon: 'calendar',
            permissions: ['hr:attendance:view'],
            order: 2,
            children: [
              {
                id: 'hr-attendance-list',
                title: '考勤记录',
                path: '/hr/attendance/list',
                icon: 'list',
                permissions: ['hr:attendance:view'],
                order: 1,
              },
              {
                id: 'hr-attendance-monthly',
                title: '月度汇总',
                path: '/hr/attendance/monthly',
                icon: 'calendar-month',
                permissions: ['hr:attendance:view'],
                order: 2,
              },
              {
                id: 'hr-attendance-abnormal',
                title: '异常记录',
                path: '/hr/attendance/abnormal',
                icon: 'alert',
                permissions: ['hr:attendance:view'],
                order: 3,
              },
            ],
          },
          // 薪资管理
          {
            id: 'hr-salary',
            title: '薪资管理',
            path: '/hr/salary',
            icon: 'money',
            permissions: ['hr:salary:view'],
            order: 3,
            children: [
              {
                id: 'hr-salary-list',
                title: '薪资列表',
                path: '/hr/salary/list',
                icon: 'list',
                permissions: ['hr:salary:view'],
                order: 1,
              },
              {
                id: 'hr-salary-monthly',
                title: '月度薪资',
                path: '/hr/salary/monthly',
                icon: 'calendar-month',
                permissions: ['hr:salary:view'],
                order: 2,
              },
              {
                id: 'hr-salary-stats',
                title: '薪资统计',
                path: '/hr/salary/stats',
                icon: 'chart',
                permissions: ['hr:salary:view'],
                order: 3,
              },
            ],
          },
          // 钉钉集成
          {
            id: 'hr-dingtalk',
            title: '钉钉集成',
            path: '/hr/dingtalk',
            icon: 'link',
            permissions: ['hr:dingtalk:sync'],
            order: 4,
            children: [
              {
                id: 'hr-dingtalk-config',
                title: '集成配置',
                path: '/hr/dingtalk/config',
                icon: 'settings',
                permissions: ['hr:dingtalk:sync'],
                order: 1,
              },
              {
                id: 'hr-dingtalk-sync',
                title: '数据同步',
                path: '/hr/dingtalk/sync',
                icon: 'sync',
                permissions: ['hr:dingtalk:sync'],
                order: 2,
              },
              {
                id: 'hr-dingtalk-status',
                title: '同步状态',
                path: '/hr/dingtalk/status',
                icon: 'info',
                permissions: ['hr:dingtalk:sync'],
                order: 3,
              },
            ],
          },
          // HR报表
          {
            id: 'hr-report',
            title: 'HR报表',
            path: '/hr/report',
            icon: 'chart-bar',
            permissions: ['hr:report:view'],
            order: 5,
            children: [
              {
                id: 'hr-report-summary',
                title: 'HR汇总',
                path: '/hr/report/summary',
                icon: 'dashboard',
                permissions: ['hr:report:view'],
                order: 1,
              },
              {
                id: 'hr-report-attendance',
                title: '考勤分析',
                path: '/hr/report/attendance',
                icon: 'line-chart',
                permissions: ['hr:report:view'],
                order: 2,
              },
              {
                id: 'hr-report-salary',
                title: '薪资分析',
                path: '/hr/report/salary',
                icon: 'bar-chart',
                permissions: ['hr:report:view'],
                order: 3,
              },
            ],
          },
        ],
      },
    ]
  }

  /**
   * 获取事件定义
   */
  getEvents(): ModuleEvent[] {
    return [
      // 员工事件
      {
        name: 'hr.employee.created',
        type: EventType.BUSINESS_DATA,
        description: '员工创建',
      },
      {
        name: 'hr.employee.updated',
        type: EventType.USER_ACTION,
        description: '员工信息更新',
      },
      {
        name: 'hr.employee.deleted',
        type: EventType.USER_ACTION,
        description: '员工删除',
      },
      {
        name: 'hr.employee.imported',
        type: EventType.USER_ACTION,
        description: '从钉钉导入员工',
      },

      // 考勤事件
      {
        name: 'hr.attendance.created',
        type: EventType.BUSINESS_DATA,
        description: '考勤记录创建',
      },
      {
        name: 'hr.attendance.abnormal',
        type: EventType.SYSTEM,
        description: '考勤异常检测',
      },
      {
        name: 'hr.attendance.synced',
        type: EventType.EXTERNAL,
        description: '钉钉考勤同步完成',
      },

      // 薪资事件
      {
        name: 'hr.salary.generated',
        type: EventType.SYSTEM,
        description: '月度薪资生成',
      },
      {
        name: 'hr.salary.approved',
        type: EventType.USER_ACTION,
        description: '薪资审批通过',
      },
      {
        name: 'hr.salary.paid',
        type: EventType.USER_ACTION,
        description: '薪资发放完成',
      },

      // 钉钉集成事件
      {
        name: 'hr.dingtalk.connected',
        type: EventType.EXTERNAL,
        description: '钉钉连接成功',
      },
      {
        name: 'hr.dingtalk.sync_failed',
        type: EventType.EXTERNAL,
        description: '钉钉同步失败',
      },
    ]
  }

  // ============================================
  // 钉钉集成核心方法
  // ============================================

  /**
   * 加载钉钉配置
   */
  private async loadDingTalkConfig(): Promise<void> {
    if (!this._context?.config) return

    try {
      const moduleConfigs = await this._context.config.getModuleConfigs(this.manifest.id)

      if (moduleConfigs && moduleConfigs.dingtalk) {
        this.dingTalkConfig = moduleConfigs.dingtalk as DingTalkConfig
        this.logger?.info('钉钉配置加载成功')
      }
    } catch (error) {
      this.logger?.warn('钉钉配置未找到或加载失败', error)
    }
  }

  /**
   * 获取钉钉 AccessToken
   * 自动刷新过期 Token
   */
  private async getDingTalkAccessToken(): Promise<string | null> {
    if (!this.dingTalkConfig || !this.dingTalkConfig.appKey || !this.dingTalkConfig.appSecret) {
      return null
    }

    // 检查 Token 是否过期（提前5分钟刷新）
    const now = Date.now()
    if (this.dingTalkAccessToken && this.dingTalkTokenExpireTime > now + 5 * 60 * 1000) {
      return this.dingTalkAccessToken
    }

    try {
      // 调用钉钉 API 获取 Token
      // https://oapi.dingtalk.com/gettoken?appkey=xxx&appsecret=xxx
      const response = await fetch(
        `https://oapi.dingtalk.com/gettoken?appkey=${this.dingTalkConfig.appKey}&appsecret=${this.dingTalkConfig.appSecret}`,
        { method: 'GET' },
      )

      const data = (await response.json()) as any

      if (data.errcode === 0) {
        this.dingTalkAccessToken = data.access_token
        this.dingTalkTokenExpireTime = now + data.expires_in * 1000

        this.logger?.info('钉钉 AccessToken 获取成功')
        return this.dingTalkAccessToken
      } else {
        this.logger?.error('钉钉 AccessToken 获取失败', data.errmsg)

        // 发送失败事件
        this.eventBus?.emit('hr.dingtalk.sync_failed', {
          error: data.errmsg,
          errcode: data.errcode,
          timestamp: new Date().toISOString(),
        })

        return null
      }
    } catch (error) {
      this.logger?.error('钉钉 API 调用失败', error)
      return null
    }
  }

  /**
   * 从钉钉同步员工数据
   */
  async syncEmployeesFromDingTalk(): Promise<{ success: number; failed: number; total: number }> {
    const accessToken = await this.getDingTalkAccessToken()
    if (!accessToken) {
      throw new Error('钉钉 AccessToken 获取失败')
    }

    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) {
      throw new Error('数据库连接不可用')
    }

    const result = { success: 0, failed: 0, total: 0 }

    try {
      // 1. 获取部门列表
      const deptResponse = await fetch(
        `https://oapi.dingtalk.com/department/list?access_token=${accessToken}`,
        { method: 'GET' },
      )
      const deptData = (await deptResponse.json()) as any

      if (deptData.errcode !== 0) {
        throw new Error(deptData.errmsg)
      }

      const departments = deptData.department as any[]

      // 2. 遍历部门获取员工
      for (const dept of departments) {
        const userResponse = await fetch(
          `https://oapi.dingtalk.com/user/listbydepartment?access_token=${accessToken}&dept_id=${dept.id}`,
          { method: 'GET' },
        )
        const userData = (await userResponse.json()) as any

        if (userData.errcode !== 0) continue

        const users = userData.userlist as DingTalkEmployee[]
        result.total += users.length

        // 3. 导入/更新员工
        for (const dingTalkUser of users) {
          try {
            // 查找是否已存在（通过钉钉UserId或手机号）
            const existingEmployee = await prisma.employee.findFirst({
              where: {
                OR: [
                  { dingTalkUserId: dingTalkUser.dingTalkUserId },
                  { mobile: dingTalkUser.mobile },
                ],
              },
            })

            const employeeData = {
              name: dingTalkUser.name,
              mobile: dingTalkUser.mobile,
              email: dingTalkUser.email || null,
              dingTalkUserId: dingTalkUser.dingTalkUserId,
              dingTalkDeptId: dingTalkUser.deptIdList[0] || 1,
              position: dingTalkUser.position || null,
              jobNumber: dingTalkUser.jobNumber || null,
              avatar: dingTalkUser.avatar || null,
              hireDate: dingTalkUser.hiredDate ? new Date(dingTalkUser.hiredDate) : null,
              status: dingTalkUser.status === 1 ? 'active' : 'inactive',
              source: 'dingtalk',
              lastSyncTime: new Date(),
            }

            if (existingEmployee) {
              // 更新
              await prisma.employee.update({
                where: { id: existingEmployee.id },
                data: employeeData,
              })
            } else {
              // 创建
              await prisma.employee.create({
                data: employeeData,
              })
            }

            result.success++
          } catch (error) {
            this.logger?.error(`员工导入失败: ${dingTalkUser.name}`, error)
            result.failed++
          }
        }
      }

      // 发送导入完成事件
      this.eventBus?.emit('hr.employee.imported', {
        source: 'dingtalk',
        success: result.success,
        failed: result.failed,
        total: result.total,
        timestamp: new Date().toISOString(),
      })

      // 更新同步时间
      if (this._context?.config) {
        await this._context.config.setModuleConfigs(this.manifest.id, {
          dingtalk: { lastSyncTime: new Date() },
        })
      }

      this.logger?.info(`钉钉员工同步完成: 成功 ${result.success}, 失败 ${result.failed}`)

      return result
    } catch (error) {
      this.logger?.error('钉钉员工同步失败', error)
      throw error
    }
  }

  /**
   * 从钉钉同步考勤数据
   */
  async syncAttendanceFromDingTalk(
    workDate?: string,
  ): Promise<{ success: number; failed: number; total: number }> {
    const accessToken = await this.getDingTalkAccessToken()
    if (!accessToken) {
      throw new Error('钉钉 AccessToken 获取失败')
    }

    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) {
      throw new Error('数据库连接不可用')
    }

    // 默认同步今日数据
    const targetDate = workDate || new Date().toISOString().split('T')[0]

    const result = { success: 0, failed: 0, total: 0 }

    try {
      // 获取所有钉钉员工
      const employees = await prisma.employee.findMany({
        where: { dingTalkUserId: { not: null } },
      })

      if (employees.length === 0) {
        this.logger?.warn('未找到钉钉员工，请先同步员工数据')
        return result
      }

      // 获取钉钉考勤数据
      // https://oapi.dingtalk.com/attendance/list
      const attendanceResponse = await fetch(
        `https://oapi.dingtalk.com/attendance/list?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workDateFrom: `${targetDate} 00:00:00`,
            workDateTo: `${targetDate} 23:59:59`,
            userIdList: employees.map((e: any) => e.dingTalkUserId),
            offset: 0,
            limit: 100,
          }),
        },
      )

      const attendanceData = (await attendanceResponse.json()) as any

      if (attendanceData.errcode !== 0) {
        throw new Error(attendanceData.errmsg)
      }

      const records = attendanceData.recordresult as DingTalkAttendanceRecord[]
      result.total = records.length

      // 导入考勤记录
      for (const record of records) {
        try {
          const employee = employees.find((e: any) => e.dingTalkUserId === record.dingTalkUserId)
          if (!employee) continue

          // 检查是否已存在
          const existingAttendance = await prisma.attendance.findFirst({
            where: {
              employeeId: employee.id,
              date: new Date(record.workDate),
            },
          })

          const attendanceRecordData = {
            employeeId: employee.id,
            date: new Date(record.workDate),
            checkInTime: record.checkInTime ? new Date(record.checkInTime) : null,
            checkOutTime: record.checkOutTime ? new Date(record.checkOutTime) : null,
            status: this.mapDingTalkTimeResult(record.timeResult),
            source: 'dingtalk',
            sourceId: record.sourceId || null,
            locationResult: record.locationResult || null,
            syncedAt: new Date(),
          }

          if (existingAttendance) {
            await prisma.attendance.update({
              where: { id: existingAttendance.id },
              data: attendanceRecordData,
            })
          } else {
            await prisma.attendance.create({
              data: attendanceRecordData,
            })
          }

          result.success++
        } catch (error) {
          this.logger?.error(`考勤导入失败: ${record.userName}`, error)
          result.failed++
        }
      }

      // 发送同步完成事件
      this.eventBus?.emit('hr.attendance.synced', {
        source: 'dingtalk',
        workDate: targetDate,
        success: result.success,
        failed: result.failed,
        total: result.total,
        timestamp: new Date().toISOString(),
      })

      this.logger?.info(`钉钉考勤同步完成: 成功 ${result.success}, 失败 ${result.failed}`)

      return result
    } catch (error) {
      this.logger?.error('钉钉考勤同步失败', error)

      this.eventBus?.emit('hr.dingtalk.sync_failed', {
        type: 'attendance',
        workDate: targetDate,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  }

  /**
   * 映射钉钉打卡结果到系统状态
   */
  private mapDingTalkTimeResult(timeResult: string): string {
    const mapping: Record<string, string> = {
      Normal: 'normal',
      Early: 'early_leave',
      Late: 'late_arrival',
      SeriousLate: 'serious_late',
      Absenteeism: 'absent',
      NotSigned: 'no_check',
    }
    return mapping[timeResult] || 'unknown'
  }

  // ============================================
  // 私有检测方法
  // ============================================

  /**
   * 检查今日考勤异常
   */
  private async checkTodayAttendanceAbnormal(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 查找异常考勤
      const abnormalAttendances = await prisma.attendance.findMany({
        where: {
          date: today,
          status: { in: ['late_arrival', 'serious_late', 'absent', 'no_check'] },
        },
        include: { employee: true },
      })

      if (abnormalAttendances.length > 0) {
        this.logger?.warn(`发现 ${abnormalAttendances.length} 条今日考勤异常`)

        for (const attendance of abnormalAttendances) {
          this.eventBus?.emit('hr.attendance.abnormal', {
            attendanceId: attendance.id,
            employeeId: attendance.employeeId,
            employeeName: attendance.employee?.name,
            date: attendance.date,
            status: attendance.status,
            checkInTime: attendance.checkInTime,
            checkOutTime: attendance.checkOutTime,
            timestamp: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      this.logger?.error('考勤异常检查失败', error)
    }
  }

  /**
   * 检查薪资审批提醒
   */
  private async checkSalaryApprovalReminder(): Promise<void> {
    const prisma = this._context?.serviceRegistry.get<any>('prisma')
    if (!prisma) return

    try {
      // 查找待审批的薪资
      const pendingSalaries = await prisma.salary.findMany({
        where: { status: 'pending_approval' },
        include: { employee: true },
      })

      if (pendingSalaries.length > 0) {
        this.logger?.info(`发现 ${pendingSalaries.length} 条待审批薪资`)
      }
    } catch (error) {
      this.logger?.error('薪资审批检查失败', error)
    }
  }
}
