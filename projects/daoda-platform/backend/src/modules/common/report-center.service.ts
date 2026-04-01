/**
 * 报表中心服务
 * 整合各模块数据分析、可视化仪表盘、报表生成、报表导出
 */
import { Injectable } from '@nestjs/common'

// ========== 导出枚举类型 ==========

export enum ReportType {
  CRM_SUMMARY = 'CRM_SUMMARY', // CRM汇总报表
  CRM_CUSTOMER = 'CRM_CUSTOMER', // 客户分析报表
  CRM_SALES = 'CRM_SALES', // 销售业绩报表
  CRM_PIPELINE = 'CRM_PIPELINE', // 销售漏斗报表
  ERP_SUMMARY = 'ERP_SUMMARY', // ERP汇总报表
  ERP_INVENTORY = 'ERP_INVENTORY', // 库存分析报表
  ERP_PRODUCTION = 'ERP_PRODUCTION', // 生产报表
  ERP_PURCHASE = 'ERP_PURCHASE', // 采购报表
  FINANCE_SUMMARY = 'FINANCE_SUMMARY', // 财务汇总报表
  FINANCE_INCOME = 'FINANCE_INCOME', // 收入报表
  FINANCE_EXPENSE = 'FINANCE_EXPENSE', // 支出报表
  FINANCE_PROFIT = 'FINANCE_PROFIT', // 利润报表
  HR_SUMMARY = 'HR_SUMMARY', // HR汇总报表
  HR_ATTENDANCE = 'HR_ATTENDANCE', // 考勤报表
  HR_SALARY = 'HR_SALARY', // 薪资报表
  SERVICE_SUMMARY = 'SERVICE_SUMMARY', // 服务汇总报表
  SERVICE_TICKET = 'SERVICE_TICKET', // 工单报表
  SERVICE_SLA = 'SERVICE_SLA', // SLA报表
  CMS_SUMMARY = 'CMS_SUMMARY', // CMS汇总报表
  CMS_CONTENT = 'CMS_CONTENT', // 内容报表
  CMS_VISITOR = 'CMS_VISITOR', //访客报表
  WORKFLOW_SUMMARY = 'WORKFLOW_SUMMARY', // 流程汇总报表
  WORKFLOW_PROCESS = 'WORKFLOW_PROCESS', // 流程执行报表
  SYSTEM_SUMMARY = 'SYSTEM_SUMMARY', // 系统汇总报表
  SYSTEM_USER = 'SYSTEM_USER', // 用户报表
  SYSTEM_LOG = 'SYSTEM_LOG', // 日志报表
  CUSTOM = 'CUSTOM', // 自定义报表
}

export enum ReportPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SCHEDULED = 'SCHEDULED',
}

export enum ChartType {
  LINE = 'LINE', // 报线图
  BAR = 'BAR', // 柱状图
  PIE = 'PIE', // 饼图
  AREA = 'AREA', // 面积图
  TABLE = 'TABLE', // 表格
  CARD = 'CARD', // 卡片
  GAUGE = 'GAUGE', // 仪表盘
  MAP = 'MAP', // 地图
  SCATTER = 'SCATTER', // 散点图
  RADAR = 'RADAR', // 雷达图
  TREEMAP = 'TREEMAP', // 树图
  HEATMAP = 'HEATMAP', // 热力图
}

export enum ExportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
  IMAGE = 'IMAGE',
}

// 报表模板接口
export interface ReportTemplate {
  id: string
  name: string
  reportType: ReportType
  description: string
  category: string
  charts: ChartConfig[]
  dataSource: string[]
  defaultPeriod: ReportPeriod
  isSystem: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// 图表配置接口
export interface ChartConfig {
  id: string
  title: string
  chartType: ChartType
  dataSource: string
  queryConfig: {
    metrics: string[]
    dimensions?: string[]
    filters?: any
    sort?: any
    limit?: number
  }
  displayConfig: {
    width?: number
    height?: number
    colors?: string[]
    showLegend?: boolean
    showGrid?: boolean
    xAxisLabel?: string
    yAxisLabel?: string
  }
  position: { x: number; y: number; w: number; h: number }
}

// 报表实例接口
export interface ReportInstance {
  id: string
  templateId: string
  name: string
  reportType: ReportType
  period: ReportPeriod
  startDate: Date
  endDate: Date
  status: ReportStatus
  data: any
  charts: any[]
  summary: string
  generatedBy: string
  generatedAt: Date
  createdAt: Date
  downloadUrl?: string
}

// 报表订阅接口
export interface ReportSubscription {
  id: string
  templateId: string
  name: string
  period: ReportPeriod
  recipients: string[]
  channels: ('EMAIL' | 'DINGTALK' | 'FEISHU')[]
  scheduleTime: string
  enabled: boolean
  createdBy: string
  createdAt: Date
  lastSentAt?: Date
  nextSentAt?: Date
}

// 仪表盘接口
export interface Dashboard {
  id: string
  name: string
  description: string
  layout: 'GRID' | 'FREE'
  widgets: DashboardWidget[]
  isDefault: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// 仪表盘组件接口
export interface DashboardWidget {
  id: string
  type: 'CHART' | 'CARD' | 'TABLE' | 'TEXT' | 'IMAGE' | 'KPI'
  title: string
  config: any
  dataSource?: string
  refreshInterval?: number
  position: { x: number; y: number; w: number; h: number }
}

// KPI指标接口
export interface KPIMetric {
  id: string
  name: string
  module: string
  value: number
  target?: number
  unit: string
  trend: 'UP' | 'DOWN' | 'STABLE'
  trendValue: number
  status: 'GOOD' | 'WARNING' | 'BAD'
  updatedAt: Date
}

@Injectable()
export class ReportCenterService {
  // 报表模板存储
  private templates: Map<string, ReportTemplate> = new Map()

  // 报表实例存储
  private reports: Map<string, ReportInstance> = new Map()

  // 报表订阅存储
  private subscriptions: Map<string, ReportSubscription> = new Map()

  // 仪表盘存储
  private dashboards: Map<string, Dashboard> = new Map()

  // KPI指标存储
  private kpiMetrics: Map<string, KPIMetric> = new Map()

  constructor() {
    this.initDefaultTemplates()
    this.initDefaultDashboards()
    this.initKPIMetrics()
    this.initSampleReports()
    this.initSampleSubscriptions()
  }

  // 初始化默认报表模板
  private initDefaultTemplates() {
    const defaultTemplates: ReportTemplate[] = [
      // CRM报表模板
      {
        id: 'TPL-CRM-001',
        name: 'CRM业务汇总报表',
        reportType: ReportType.CRM_SUMMARY,
        description: 'CRM模块核心业务指标汇总',
        category: 'CRM',
        charts: [
          {
            id: 'C-001',
            title: '客户数量趋势',
            chartType: ChartType.LINE,
            dataSource: 'crm_customer',
            queryConfig: {
              metrics: ['count'],
              dimensions: ['month'],
              filters: { status: 'ACTIVE' },
            },
            displayConfig: { showLegend: true },
            position: { x: 0, y: 0, w: 6, h: 3 },
          },
          {
            id: 'C-002',
            title: '线索转化率',
            chartType: ChartType.PIE,
            dataSource: 'crm_lead',
            queryConfig: { metrics: ['conversionRate'], dimensions: ['stage'] },
            displayConfig: { colors: ['#1890ff', '#52c41a', '#faad14'] },
            position: { x: 6, y: 0, w: 3, h: 3 },
          },
          {
            id: 'C-003',
            title: '销售业绩排行',
            chartType: ChartType.BAR,
            dataSource: 'crm_opportunity',
            queryConfig: {
              metrics: ['amount'],
              dimensions: ['owner'],
              sort: { amount: -1 },
              limit: 10,
            },
            displayConfig: { showGrid: true },
            position: { x: 9, y: 0, w: 3, h: 3 },
          },
          {
            id: 'C-004',
            title: '销售漏斗',
            chartType: ChartType.BAR,
            dataSource: 'crm_pipeline',
            queryConfig: { metrics: ['count', 'amount'], dimensions: ['stage'] },
            displayConfig: { colors: ['#1890ff'] },
            position: { x: 0, y: 3, w: 6, h: 3 },
          },
          {
            id: 'C-005',
            title: '客户分布',
            chartType: ChartType.TABLE,
            dataSource: 'crm_customer',
            queryConfig: { metrics: ['count', 'amount'], dimensions: ['region', 'industry'] },
            displayConfig: {},
            position: { x: 6, y: 3, w: 6, h: 3 },
          },
        ],
        dataSource: ['crm_customer', 'crm_lead', 'crm_opportunity', 'crm_pipeline'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'TPL-CRM-002',
        name: '销售业绩报表',
        reportType: ReportType.CRM_SALES,
        description: '销售人员业绩统计分析',
        category: 'CRM',
        charts: [
          {
            id: 'C-001',
            title: '本月业绩',
            chartType: ChartType.CARD,
            dataSource: 'crm_opportunity',
            queryConfig: { metrics: ['totalAmount'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-002',
            title: '业绩趋势',
            chartType: ChartType.AREA,
            dataSource: 'crm_opportunity',
            queryConfig: { metrics: ['amount'], dimensions: ['month'] },
            displayConfig: { colors: ['#1890ff'] },
            position: { x: 3, y: 0, w: 6, h: 2 },
          },
          {
            id: 'C-003',
            title: '销售人员排行',
            chartType: ChartType.BAR,
            dataSource: 'crm_sales',
            queryConfig: {
              metrics: ['amount', 'dealCount'],
              dimensions: ['salesName'],
              sort: { amount: -1 },
            },
            displayConfig: {},
            position: { x: 9, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-004',
            title: '成交客户分析',
            chartType: ChartType.PIE,
            dataSource: 'crm_customer',
            queryConfig: { metrics: ['count'], dimensions: ['industry'] },
            displayConfig: {},
            position: { x: 0, y: 2, w: 4, h: 3 },
          },
          {
            id: 'C-005',
            title: '销售明细',
            chartType: ChartType.TABLE,
            dataSource: 'crm_opportunity',
            queryConfig: {
              metrics: ['name', 'customer', 'amount', 'stage', 'owner'],
              filters: { status: 'CLOSED_WON' },
            },
            displayConfig: {},
            position: { x: 4, y: 2, w: 8, h: 3 },
          },
        ],
        dataSource: ['crm_opportunity', 'crm_sales', 'crm_customer'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      // ERP报表模板
      {
        id: 'TPL-ERP-001',
        name: 'ERP业务汇总报表',
        reportType: ReportType.ERP_SUMMARY,
        description: 'ERP模块核心业务指标汇总',
        category: 'ERP',
        charts: [
          {
            id: 'C-001',
            title: '库存概况',
            chartType: ChartType.CARD,
            dataSource: 'erp_inventory',
            queryConfig: { metrics: ['totalItems', 'totalValue', 'lowStockCount'] },
            displayConfig: {},
            position: { x: 0, y: 0, w: 4, h: 2 },
          },
          {
            id: 'C-002',
            title: '库存周转率',
            chartType: ChartType.GAUGE,
            dataSource: 'erp_inventory',
            queryConfig: { metrics: ['turnoverRate'] },
            displayConfig: { colors: ['#52c41a'] },
            position: { x: 4, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-003',
            title: '库存分布',
            chartType: ChartType.PIE,
            dataSource: 'erp_inventory',
            queryConfig: { metrics: ['value'], dimensions: ['category'] },
            displayConfig: {},
            position: { x: 7, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-004',
            title: '采购趋势',
            chartType: ChartType.LINE,
            dataSource: 'erp_purchase',
            queryConfig: { metrics: ['amount'], dimensions: ['month'] },
            displayConfig: { showLegend: true },
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'C-005',
            title: '生产计划完成率',
            chartType: ChartType.BAR,
            dataSource: 'erp_production',
            queryConfig: { metrics: ['completionRate'], dimensions: ['productLine'] },
            displayConfig: {},
            position: { x: 6, y: 2, w: 4, h: 3 },
          },
          {
            id: 'C-006',
            title: '物料需求',
            chartType: ChartType.TABLE,
            dataSource: 'erp_material',
            queryConfig: { metrics: ['name', 'required', 'available', 'gap'] },
            displayConfig: {},
            position: { x: 10, y: 2, w: 2, h: 3 },
          },
        ],
        dataSource: ['erp_inventory', 'erp_purchase', 'erp_production', 'erp_material'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      // 财务报表模板
      {
        id: 'TPL-FIN-001',
        name: '财务汇总报表',
        reportType: ReportType.FINANCE_SUMMARY,
        description: '财务模块核心指标汇总',
        category: 'Finance',
        charts: [
          {
            id: 'C-001',
            title: '本月收入',
            chartType: ChartType.CARD,
            dataSource: 'finance_income',
            queryConfig: { metrics: ['totalAmount'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-002',
            title: '本月支出',
            chartType: ChartType.CARD,
            dataSource: 'finance_expense',
            queryConfig: { metrics: ['totalAmount'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 3, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-003',
            title: '本月利润',
            chartType: ChartType.CARD,
            dataSource: 'finance_profit',
            queryConfig: { metrics: ['netProfit'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 6, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-004',
            title: '利润率',
            chartType: ChartType.GAUGE,
            dataSource: 'finance_profit',
            queryConfig: { metrics: ['profitRate'] },
            displayConfig: {},
            position: { x: 9, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-005',
            title: '收入趋势',
            chartType: ChartType.AREA,
            dataSource: 'finance_income',
            queryConfig: { metrics: ['amount'], dimensions: ['month'] },
            displayConfig: { colors: ['#52c41a'] },
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'C-006',
            title: '支出分布',
            chartType: ChartType.PIE,
            dataSource: 'finance_expense',
            queryConfig: { metrics: ['amount'], dimensions: ['category'] },
            displayConfig: {},
            position: { x: 6, y: 2, w: 4, h: 3 },
          },
          {
            id: 'C-007',
            title: '应收账款',
            chartType: ChartType.TABLE,
            dataSource: 'finance_receivable',
            queryConfig: { metrics: ['customer', 'amount', 'dueDate', 'status'] },
            displayConfig: {},
            position: { x: 10, y: 2, w: 2, h: 3 },
          },
        ],
        dataSource: [
          'finance_income',
          'finance_expense',
          'finance_profit',
          'finance_receivable',
          'finance_payable',
        ],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      // HR报表模板
      {
        id: 'TPL-HR-001',
        name: 'HR人力资源报表',
        reportType: ReportType.HR_SUMMARY,
        description: 'HR模块核心指标汇总',
        category: 'HR',
        charts: [
          {
            id: 'C-001',
            title: '员工总数',
            chartType: ChartType.CARD,
            dataSource: 'hr_employee',
            queryConfig: { metrics: ['totalCount'] },
            displayConfig: {},
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-002',
            title: '本月入职',
            chartType: ChartType.CARD,
            dataSource: 'hr_employee',
            queryConfig: { metrics: ['newHires'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 3, y: 0, w: 2, h: 2 },
          },
          {
            id: 'C-003',
            title: '本月离职',
            chartType: ChartType.CARD,
            dataSource: 'hr_employee',
            queryConfig: { metrics: ['resignations'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 5, y: 0, w: 2, h: 2 },
          },
          {
            id: 'C-004',
            title: '部门分布',
            chartType: ChartType.PIE,
            dataSource: 'hr_employee',
            queryConfig: { metrics: ['count'], dimensions: ['department'] },
            displayConfig: {},
            position: { x: 7, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-005',
            title: '考勤统计',
            chartType: ChartType.BAR,
            dataSource: 'hr_attendance',
            queryConfig: {
              metrics: ['attendanceRate', 'lateCount', 'absentCount'],
              dimensions: ['department'],
            },
            displayConfig: {},
            position: { x: 10, y: 0, w: 2, h: 2 },
          },
          {
            id: 'C-006',
            title: '人员趋势',
            chartType: ChartType.LINE,
            dataSource: 'hr_employee',
            queryConfig: { metrics: ['count'], dimensions: ['month'] },
            displayConfig: { showLegend: true },
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'C-007',
            title: '薪资分布',
            chartType: ChartType.BAR,
            dataSource: 'hr_salary',
            queryConfig: { metrics: ['avgSalary'], dimensions: ['level'] },
            displayConfig: {},
            position: { x: 6, y: 2, w: 6, h: 3 },
          },
        ],
        dataSource: ['hr_employee', 'hr_attendance', 'hr_salary'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      // 服务报表模板
      {
        id: 'TPL-SVC-001',
        name: '售后服务报表',
        reportType: ReportType.SERVICE_SUMMARY,
        description: '服务模块核心指标汇总',
        category: 'Service',
        charts: [
          {
            id: 'C-001',
            title: '工单总数',
            chartType: ChartType.CARD,
            dataSource: 'service_ticket',
            queryConfig: { metrics: ['totalCount'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-002',
            title: '完成率',
            chartType: ChartType.GAUGE,
            dataSource: 'service_ticket',
            queryConfig: { metrics: ['completionRate'] },
            displayConfig: {},
            position: { x: 3, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-003',
            title: 'SLA达标率',
            chartType: ChartType.GAUGE,
            dataSource: 'service_sla',
            queryConfig: { metrics: ['slaRate'] },
            displayConfig: {},
            position: { x: 6, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-004',
            title: '满意度',
            chartType: ChartType.GAUGE,
            dataSource: 'service_feedback',
            queryConfig: { metrics: ['satisfactionRate'] },
            displayConfig: {},
            position: { x: 9, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-005',
            title: '工单趋势',
            chartType: ChartType.LINE,
            dataSource: 'service_ticket',
            queryConfig: { metrics: ['count'], dimensions: ['day'] },
            displayConfig: { showLegend: true },
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'C-006',
            title: '工单类型分布',
            chartType: ChartType.PIE,
            dataSource: 'service_ticket',
            queryConfig: { metrics: ['count'], dimensions: ['type'] },
            displayConfig: {},
            position: { x: 6, y: 2, w: 3, h: 3 },
          },
          {
            id: 'C-007',
            title: '工程师工作量',
            chartType: ChartType.BAR,
            dataSource: 'service_engineer',
            queryConfig: { metrics: ['ticketCount', 'avgTime'], dimensions: ['name'] },
            displayConfig: {},
            position: { x: 9, y: 2, w: 3, h: 3 },
          },
        ],
        dataSource: ['service_ticket', 'service_sla', 'service_feedback', 'service_engineer'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      // CMS报表模板
      {
        id: 'TPL-CMS-001',
        name: 'CMS内容运营报表',
        reportType: ReportType.CMS_SUMMARY,
        description: 'CMS模块核心指标汇总',
        category: 'CMS',
        charts: [
          {
            id: 'C-001',
            title: '内容总数',
            chartType: ChartType.CARD,
            dataSource: 'cms_content',
            queryConfig: { metrics: ['totalCount'] },
            displayConfig: {},
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-002',
            title: '本月新增',
            chartType: ChartType.CARD,
            dataSource: 'cms_content',
            queryConfig: { metrics: ['newCount'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 3, y: 0, w: 2, h: 2 },
          },
          {
            id: 'C-003',
            title: '发布成功率',
            chartType: ChartType.GAUGE,
            dataSource: 'cms_publish',
            queryConfig: { metrics: ['successRate'] },
            displayConfig: {},
            position: { x: 5, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-004',
            title: '访问量',
            chartType: ChartType.CARD,
            dataSource: 'cms_visitor',
            queryConfig: { metrics: ['pv', 'uv'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 8, y: 0, w: 4, h: 2 },
          },
          {
            id: 'C-005',
            title: '访问趋势',
            chartType: ChartType.AREA,
            dataSource: 'cms_visitor',
            queryConfig: { metrics: ['pv', 'uv'], dimensions: ['day'] },
            displayConfig: { showLegend: true },
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'C-006',
            title: '内容类型分布',
            chartType: ChartType.PIE,
            dataSource: 'cms_content',
            queryConfig: { metrics: ['count'], dimensions: ['type'] },
            displayConfig: {},
            position: { x: 6, y: 2, w: 3, h: 3 },
          },
          {
            id: 'C-007',
            title: '热门内容',
            chartType: ChartType.TABLE,
            dataSource: 'cms_content',
            queryConfig: {
              metrics: ['title', 'views', 'likes', 'comments'],
              sort: { views: -1 },
              limit: 10,
            },
            displayConfig: {},
            position: { x: 9, y: 2, w: 3, h: 3 },
          },
        ],
        dataSource: ['cms_content', 'cms_publish', 'cms_visitor'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      // Workflow报表模板
      {
        id: 'TPL-WF-001',
        name: '流程执行报表',
        reportType: ReportType.WORKFLOW_SUMMARY,
        description: 'Workflow模块核心指标汇总',
        category: 'Workflow',
        charts: [
          {
            id: 'C-001',
            title: '流程实例总数',
            chartType: ChartType.CARD,
            dataSource: 'workflow_instance',
            queryConfig: { metrics: ['totalCount'] },
            displayConfig: {},
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-002',
            title: '完成率',
            chartType: ChartType.GAUGE,
            dataSource: 'workflow_instance',
            queryConfig: { metrics: ['completionRate'] },
            displayConfig: {},
            position: { x: 3, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-003',
            title: '平均耗时',
            chartType: ChartType.CARD,
            dataSource: 'workflow_instance',
            queryConfig: { metrics: ['avgDuration'] },
            displayConfig: {},
            position: { x: 6, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-004',
            title: '超时率',
            chartType: ChartType.GAUGE,
            dataSource: 'workflow_instance',
            queryConfig: { metrics: ['timeoutRate'] },
            displayConfig: {},
            position: { x: 9, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-005',
            title: '流程执行趋势',
            chartType: ChartType.LINE,
            dataSource: 'workflow_instance',
            queryConfig: { metrics: ['count'], dimensions: ['day'] },
            displayConfig: { showLegend: true },
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'C-006',
            title: '流程类型分布',
            chartType: ChartType.PIE,
            dataSource: 'workflow_instance',
            queryConfig: { metrics: ['count'], dimensions: ['type'] },
            displayConfig: {},
            position: { x: 6, y: 2, w: 3, h: 3 },
          },
          {
            id: 'C-007',
            title: '瓶颈节点',
            chartType: ChartType.BAR,
            dataSource: 'workflow_node',
            queryConfig: {
              metrics: ['avgTime'],
              dimensions: ['nodeName'],
              sort: { avgTime: -1 },
              limit: 10,
            },
            displayConfig: {},
            position: { x: 9, y: 2, w: 3, h: 3 },
          },
        ],
        dataSource: ['workflow_instance', 'workflow_node'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      // 系统报表模板
      {
        id: 'TPL-SYS-001',
        name: '系统运营报表',
        reportType: ReportType.SYSTEM_SUMMARY,
        description: '系统核心指标汇总',
        category: 'System',
        charts: [
          {
            id: 'C-001',
            title: '用户总数',
            chartType: ChartType.CARD,
            dataSource: 'system_user',
            queryConfig: { metrics: ['totalCount'] },
            displayConfig: {},
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-002',
            title: '活跃用户',
            chartType: ChartType.CARD,
            dataSource: 'system_user',
            queryConfig: { metrics: ['activeCount'], filters: { period: 'week' } },
            displayConfig: {},
            position: { x: 3, y: 0, w: 2, h: 2 },
          },
          {
            id: 'C-003',
            title: '在线用户',
            chartType: ChartType.CARD,
            dataSource: 'system_user',
            queryConfig: { metrics: ['onlineCount'] },
            displayConfig: {},
            position: { x: 5, y: 0, w: 2, h: 2 },
          },
          {
            id: 'C-004',
            title: '登录成功率',
            chartType: ChartType.GAUGE,
            dataSource: 'system_log',
            queryConfig: { metrics: ['loginSuccessRate'] },
            displayConfig: {},
            position: { x: 7, y: 0, w: 3, h: 2 },
          },
          {
            id: 'C-005',
            title: 'API调用量',
            chartType: ChartType.CARD,
            dataSource: 'system_api',
            queryConfig: { metrics: ['callCount'], filters: { month: 'current' } },
            displayConfig: {},
            position: { x: 10, y: 0, w: 2, h: 2 },
          },
          {
            id: 'C-006',
            title: '用户增长趋势',
            chartType: ChartType.AREA,
            dataSource: 'system_user',
            queryConfig: { metrics: ['count'], dimensions: ['month'] },
            displayConfig: { showLegend: true },
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'C-007',
            title: '模块使用率',
            chartType: ChartType.BAR,
            dataSource: 'system_usage',
            queryConfig: { metrics: ['visitCount'], dimensions: ['module'] },
            displayConfig: {},
            position: { x: 6, y: 2, w: 6, h: 3 },
          },
        ],
        dataSource: ['system_user', 'system_log', 'system_api', 'system_usage'],
        defaultPeriod: ReportPeriod.MONTHLY,
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]

    defaultTemplates.forEach((t) => this.templates.set(t.id, t))
  }

  // 初始化默认仪表盘
  private initDefaultDashboards() {
    const defaultDashboards: Dashboard[] = [
      {
        id: 'DB-001',
        name: '企业运营总览',
        description: '全模块核心指标一览',
        layout: 'GRID',
        widgets: [
          {
            id: 'W-001',
            type: 'KPI',
            title: 'CRM核心指标',
            config: { metrics: ['customers', 'leads', 'opportunities', 'sales'] },
            dataSource: 'kpi_crm',
            position: { x: 0, y: 0, w: 4, h: 2 },
          },
          {
            id: 'W-002',
            type: 'KPI',
            title: 'ERP核心指标',
            config: { metrics: ['inventory', 'purchase', 'production'] },
            dataSource: 'kpi_erp',
            position: { x: 4, y: 0, w: 4, h: 2 },
          },
          {
            id: 'W-003',
            type: 'KPI',
            title: '财务核心指标',
            config: { metrics: ['income', 'expense', 'profit'] },
            dataSource: 'kpi_finance',
            position: { x: 8, y: 0, w: 4, h: 2 },
          },
          {
            id: 'W-004',
            type: 'CHART',
            title: '本月业绩趋势',
            config: { chartType: 'LINE', metrics: ['sales'], dimensions: ['day'] },
            dataSource: 'crm_sales',
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'W-005',
            type: 'CHART',
            title: '库存周转',
            config: { chartType: 'GAUGE', metrics: ['turnoverRate'] },
            dataSource: 'erp_inventory',
            position: { x: 6, y: 2, w: 3, h: 3 },
          },
          {
            id: 'W-006',
            type: 'CHART',
            title: '利润趋势',
            config: { chartType: 'AREA', metrics: ['profit'], dimensions: ['month'] },
            dataSource: 'finance_profit',
            position: { x: 9, y: 2, w: 3, h: 3 },
          },
          {
            id: 'W-007',
            type: 'CHART',
            title: '工单统计',
            config: { chartType: 'PIE', metrics: ['count'], dimensions: ['status'] },
            dataSource: 'service_ticket',
            position: { x: 0, y: 5, w: 3, h: 3 },
          },
          {
            id: 'W-008',
            type: 'CHART',
            title: '员工分布',
            config: { chartType: 'BAR', metrics: ['count'], dimensions: ['department'] },
            dataSource: 'hr_employee',
            position: { x: 3, y: 5, w: 3, h: 3 },
          },
          {
            id: 'W-009',
            type: 'CHART',
            title: '内容发布',
            config: { chartType: 'LINE', metrics: ['count'], dimensions: ['day'] },
            dataSource: 'cms_content',
            position: { x: 6, y: 5, w: 3, h: 3 },
          },
          {
            id: 'W-010',
            type: 'CHART',
            title: '流程执行',
            config: { chartType: 'BAR', metrics: ['count'], dimensions: ['type'] },
            dataSource: 'workflow_instance',
            position: { x: 9, y: 5, w: 3, h: 3 },
          },
          {
            id: 'W-011',
            type: 'TABLE',
            title: '待办事项',
            config: { columns: ['module', 'item', 'priority', 'dueDate'] },
            dataSource: 'system_todo',
            position: { x: 0, y: 8, w: 12, h: 2 },
          },
        ],
        isDefault: true,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
      {
        id: 'DB-002',
        name: '销售业绩仪表盘',
        description: 'CRM销售核心指标',
        layout: 'GRID',
        widgets: [
          {
            id: 'W-001',
            type: 'KPI',
            title: '本月业绩',
            config: { value: 500000, target: 600000, unit: '元' },
            position: { x: 0, y: 0, w: 3, h: 2 },
          },
          {
            id: 'W-002',
            type: 'KPI',
            title: '成交客户',
            config: { value: 25, target: 30, unit: '家' },
            position: { x: 3, y: 0, w: 3, h: 2 },
          },
          {
            id: 'W-003',
            type: 'KPI',
            title: '转化率',
            config: { value: 18.5, target: 20, unit: '%' },
            position: { x: 6, y: 0, w: 3, h: 2 },
          },
          {
            id: 'W-004',
            type: 'KPI',
            title: '平均成交周期',
            config: { value: 15, unit: '天' },
            position: { x: 9, y: 0, w: 3, h: 2 },
          },
          {
            id: 'W-005',
            type: 'CHART',
            title: '业绩趋势',
            config: { chartType: 'AREA' },
            dataSource: 'crm_sales_trend',
            position: { x: 0, y: 2, w: 6, h: 3 },
          },
          {
            id: 'W-006',
            type: 'CHART',
            title: '销售漏斗',
            config: { chartType: 'BAR' },
            dataSource: 'crm_pipeline',
            position: { x: 6, y: 2, w: 6, h: 3 },
          },
          {
            id: 'W-007',
            type: 'TABLE',
            title: '销售人员排行',
            config: { columns: ['name', 'amount', 'dealCount', 'conversionRate'] },
            dataSource: 'crm_sales_rank',
            position: { x: 0, y: 5, w: 12, h: 3 },
          },
        ],
        isDefault: false,
        createdBy: 'system',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]

    defaultDashboards.forEach((d) => this.dashboards.set(d.id, d))
  }

  // 初始化KPI指标
  private initKPIMetrics() {
    const kpis: KPIMetric[] = [
      // CRM KPI
      {
        id: 'KPI-CRM-001',
        name: '活跃客户数',
        module: 'CRM',
        value: 156,
        target: 200,
        unit: '家',
        trend: 'UP',
        trendValue: 12,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-CRM-002',
        name: '本月销售额',
        module: 'CRM',
        value: 580000,
        target: 600000,
        unit: '元',
        trend: 'UP',
        trendValue: 8.5,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-CRM-003',
        name: '线索转化率',
        module: 'CRM',
        value: 18.5,
        target: 20,
        unit: '%',
        trend: 'UP',
        trendValue: 2.3,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-CRM-004',
        name: '成交客户数',
        module: 'CRM',
        value: 25,
        target: 30,
        unit: '家',
        trend: 'UP',
        trendValue: 5,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      // ERP KPI
      {
        id: 'KPI-ERP-001',
        name: '库存周转率',
        module: 'ERP',
        value: 4.2,
        target: 5,
        unit: '次/月',
        trend: 'UP',
        trendValue: 0.3,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-ERP-002',
        name: '库存总值',
        module: 'ERP',
        value: 1200000,
        unit: '元',
        trend: 'STABLE',
        trendValue: 0,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-ERP-003',
        name: '采购完成率',
        module: 'ERP',
        value: 92,
        target: 95,
        unit: '%',
        trend: 'UP',
        trendValue: 3,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      // Finance KPI
      {
        id: 'KPI-FIN-001',
        name: '本月收入',
        module: 'Finance',
        value: 680000,
        target: 700000,
        unit: '元',
        trend: 'UP',
        trendValue: 5.2,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-FIN-002',
        name: '本月支出',
        module: 'Finance',
        value: 320000,
        unit: '元',
        trend: 'DOWN',
        trendValue: -8.5,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-FIN-003',
        name: '净利润',
        module: 'Finance',
        value: 360000,
        target: 300000,
        unit: '元',
        trend: 'UP',
        trendValue: 12,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-FIN-004',
        name: '利润率',
        module: 'Finance',
        value: 52.9,
        target: 45,
        unit: '%',
        trend: 'UP',
        trendValue: 5.2,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      // HR KPI
      {
        id: 'KPI-HR-001',
        name: '员工总数',
        module: 'HR',
        value: 125,
        unit: '人',
        trend: 'UP',
        trendValue: 3,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-HR-002',
        name: '考勤达标率',
        module: 'HR',
        value: 96.5,
        target: 95,
        unit: '%',
        trend: 'UP',
        trendValue: 1.5,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-HR-003',
        name: '本月离职率',
        module: 'HR',
        value: 2.4,
        target: 5,
        unit: '%',
        trend: 'DOWN',
        trendValue: -0.8,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      // Service KPI
      {
        id: 'KPI-SVC-001',
        name: '工单完成率',
        module: 'Service',
        value: 94.5,
        target: 95,
        unit: '%',
        trend: 'UP',
        trendValue: 2,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-SVC-002',
        name: 'SLA达标率',
        module: 'Service',
        value: 92,
        target: 95,
        unit: '%',
        trend: 'UP',
        trendValue: 3,
        status: 'WARNING',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-SVC-003',
        name: '客户满意度',
        module: 'Service',
        value: 4.8,
        target: 4.5,
        unit: '分',
        trend: 'UP',
        trendValue: 0.2,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      // CMS KPI
      {
        id: 'KPI-CMS-001',
        name: '内容总数',
        module: 'CMS',
        value: 234,
        unit: '篇',
        trend: 'UP',
        trendValue: 15,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-CMS-002',
        name: '本月访问量',
        module: 'CMS',
        value: 125000,
        unit: 'PV',
        trend: 'UP',
        trendValue: 18,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-CMS-003',
        name: '独立访客',
        module: 'CMS',
        value: 8500,
        unit: 'UV',
        trend: 'UP',
        trendValue: 12,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      // Workflow KPI
      {
        id: 'KPI-WF-001',
        name: '流程完成率',
        module: 'Workflow',
        value: 98.5,
        target: 95,
        unit: '%',
        trend: 'UP',
        trendValue: 1.5,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-WF-002',
        name: '平均耗时',
        module: 'Workflow',
        value: 2.5,
        target: 3,
        unit: '小时',
        trend: 'DOWN',
        trendValue: -0.3,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      // System KPI
      {
        id: 'KPI-SYS-001',
        name: '用户总数',
        module: 'System',
        value: 125,
        unit: '人',
        trend: 'UP',
        trendValue: 5,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-SYS-002',
        name: '活跃用户',
        module: 'System',
        value: 98,
        unit: '人',
        trend: 'UP',
        trendValue: 8,
        status: 'GOOD',
        updatedAt: new Date(),
      },
      {
        id: 'KPI-SYS-003',
        name: 'API调用量',
        module: 'System',
        value: 52000,
        unit: '次/日',
        trend: 'UP',
        trendValue: 15,
        status: 'GOOD',
        updatedAt: new Date(),
      },
    ]

    kpis.forEach((k) => this.kpiMetrics.set(k.id, k))
  }

  // 初始化示例报表
  private initSampleReports() {
    const sampleReports: ReportInstance[] = [
      {
        id: 'RPT-001',
        templateId: 'TPL-CRM-001',
        name: 'CRM业务汇总报表-2026年3月',
        reportType: ReportType.CRM_SUMMARY,
        period: ReportPeriod.MONTHLY,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-31'),
        status: ReportStatus.COMPLETED,
        data: { customers: 156, leads: 89, opportunities: 45, sales: 580000 },
        charts: [],
        summary: '本月CRM业务整体良好，客户数增长12%，销售额达成率97%，线索转化率提升至18.5%',
        generatedBy: 'system',
        generatedAt: new Date('2026-03-31 06:00'),
        createdAt: new Date('2026-03-31 06:00'),
        downloadUrl: '/reports/RPT-001.pdf',
      },
      {
        id: 'RPT-002',
        templateId: 'TPL-FIN-001',
        name: '财务汇总报表-2026年3月',
        reportType: ReportType.FINANCE_SUMMARY,
        period: ReportPeriod.MONTHLY,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-31'),
        status: ReportStatus.COMPLETED,
        data: { income: 680000, expense: 320000, profit: 360000, profitRate: 52.9 },
        charts: [],
        summary: '本月财务状况良好，净利润36万元，利润率52.9%，超出预期目标',
        generatedBy: 'system',
        generatedAt: new Date('2026-03-31 06:00'),
        createdAt: new Date('2026-03-31 06:00'),
        downloadUrl: '/reports/RPT-002.pdf',
      },
      {
        id: 'RPT-003',
        templateId: 'TPL-ERP-001',
        name: 'ERP业务汇总报表-2026年3月',
        reportType: ReportType.ERP_SUMMARY,
        period: ReportPeriod.MONTHLY,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-31'),
        status: ReportStatus.COMPLETED,
        data: { inventoryValue: 1200000, turnoverRate: 4.2, purchaseRate: 92 },
        charts: [],
        summary: '库存周转率4.2次/月，需优化库存结构提升周转效率',
        generatedBy: 'system',
        generatedAt: new Date('2026-03-31 06:00'),
        createdAt: new Date('2026-03-31 06:00'),
        downloadUrl: '/reports/RPT-003.pdf',
      },
      {
        id: 'RPT-004',
        templateId: 'TPL-SVC-001',
        name: '售后服务报表-2026年3月',
        reportType: ReportType.SERVICE_SUMMARY,
        period: ReportPeriod.MONTHLY,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-31'),
        status: ReportStatus.COMPLETED,
        data: { tickets: 68, completionRate: 94.5, slaRate: 92, satisfaction: 4.8 },
        charts: [],
        summary: '本月工单完成率94.5%，SLA达标率92%，客户满意度4.8分',
        generatedBy: 'system',
        generatedAt: new Date('2026-03-31 06:00'),
        createdAt: new Date('2026-03-31 06:00'),
        downloadUrl: '/reports/RPT-004.pdf',
      },
      {
        id: 'RPT-005',
        templateId: 'TPL-SYS-001',
        name: '系统运营报表-2026年3月',
        reportType: ReportType.SYSTEM_SUMMARY,
        period: ReportPeriod.MONTHLY,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-31'),
        status: ReportStatus.COMPLETED,
        data: { users: 125, activeUsers: 98, apiCalls: 52000 },
        charts: [],
        summary: '系统运行稳定，活跃用户78%，API日均调用52000次',
        generatedBy: 'system',
        generatedAt: new Date('2026-03-31 06:00'),
        createdAt: new Date('2026-03-31 06:00'),
        downloadUrl: '/reports/RPT-005.pdf',
      },
    ]

    sampleReports.forEach((r) => this.reports.set(r.id, r))
  }

  // 初始化示例订阅
  private initSampleSubscriptions() {
    const sampleSubs: ReportSubscription[] = [
      {
        id: 'SUB-001',
        templateId: 'TPL-CRM-001',
        name: 'CRM日报订阅',
        period: ReportPeriod.DAILY,
        recipients: ['sales@daoda.com', 'manager@daoda.com'],
        channels: ['EMAIL', 'DINGTALK'],
        scheduleTime: '08:00',
        enabled: true,
        createdBy: 'U-001',
        createdAt: new Date('2026-01-01'),
        lastSentAt: new Date('2026-03-30 08:00'),
        nextSentAt: new Date('2026-03-31 08:00'),
      },
      {
        id: 'SUB-002',
        templateId: 'TPL-FIN-001',
        name: '财务周报订阅',
        period: ReportPeriod.WEEKLY,
        recipients: ['finance@daoda.com', 'ceo@daoda.com'],
        channels: ['EMAIL'],
        scheduleTime: '09:00',
        enabled: true,
        createdBy: 'U-002',
        createdAt: new Date('2026-01-01'),
        lastSentAt: new Date('2026-03-24 09:00'),
        nextSentAt: new Date('2026-03-31 09:00'),
      },
      {
        id: 'SUB-003',
        templateId: 'TPL-ERP-001',
        name: 'ERP月报订阅',
        period: ReportPeriod.MONTHLY,
        recipients: ['operation@daoda.com'],
        channels: ['EMAIL', 'FEISHU'],
        scheduleTime: '10:00',
        enabled: true,
        createdBy: 'U-003',
        createdAt: new Date('2026-01-01'),
        lastSentAt: new Date('2026-02-28 10:00'),
        nextSentAt: new Date('2026-03-31 10:00'),
      },
    ]

    sampleSubs.forEach((s) => this.subscriptions.set(s.id, s))
  }

  // ========== 报表模板管理 ==========

  async getTemplates(params?: { category?: string; reportType?: ReportType }) {
    let templates = Array.from(this.templates.values())
    if (params?.category) templates = templates.filter((t) => t.category === params.category)
    if (params?.reportType) templates = templates.filter((t) => t.reportType === params.reportType)
    return templates
  }

  async getTemplate(id: string) {
    return this.templates.get(id)
  }

  async createTemplate(template: ReportTemplate) {
    template.id = `TPL-${Date.now()}`
    template.createdAt = new Date()
    template.updatedAt = new Date()
    template.isSystem = false
    this.templates.set(template.id, template)
    return template
  }

  async updateTemplate(id: string, updates: Partial<ReportTemplate>) {
    const template = this.templates.get(id)
    if (!template) return null
    if (template.isSystem) throw new Error('系统模板不可修改')
    Object.assign(template, updates, { updatedAt: new Date() })
    this.templates.set(id, template)
    return template
  }

  async deleteTemplate(id: string) {
    const template = this.templates.get(id)
    if (!template) return false
    if (template.isSystem) throw new Error('系统模板不可删除')
    return this.templates.delete(id)
  }

  // ========== 报表生成 ==========

  async generateReport(params: {
    templateId: string
    name?: string
    period: ReportPeriod
    startDate: Date
    endDate: Date
    generatedBy: string
  }) {
    const template = this.templates.get(params.templateId)
    if (!template) throw new Error('模板不存在')

    const report: ReportInstance = {
      id: `RPT-${Date.now()}`,
      templateId: params.templateId,
      name: params.name || `${template.name}-${dayjs(params.startDate).format('YYYY-MM')}`,
      reportType: template.reportType,
      period: params.period,
      startDate: params.startDate,
      endDate: params.endDate,
      status: ReportStatus.GENERATING,
      data: {},
      charts: [],
      summary: '',
      generatedBy: params.generatedBy,
      generatedAt: new Date(),
      createdAt: new Date(),
    }

    this.reports.set(report.id, report)

    // 模拟数据生成（实际应从各模块获取）
    const mockData = this.getMockReportData(template.reportType)
    report.data = mockData
    report.charts = template.charts.map((c) => ({
      ...c,
      data: this.getMockChartData(c),
    }))
    report.summary = this.generateReportSummary(template.reportType, mockData)
    report.status = ReportStatus.COMPLETED
    report.downloadUrl = `/reports/${report.id}.pdf`

    this.reports.set(report.id, report)
    return report
  }

  private getMockReportData(type: ReportType): any {
    const mockDataMap: Partial<Record<ReportType, any>> = {
      [ReportType.CRM_SUMMARY]: {
        customers: 156,
        leads: 89,
        opportunities: 45,
        sales: 580000,
        conversionRate: 18.5,
      },
      [ReportType.CRM_SALES]: {
        totalAmount: 580000,
        dealCount: 25,
        avgAmount: 23200,
        topSales: '张三',
      },
      [ReportType.ERP_SUMMARY]: {
        inventoryValue: 1200000,
        turnoverRate: 4.2,
        purchaseAmount: 350000,
        productionRate: 92,
      },
      [ReportType.FINANCE_SUMMARY]: {
        income: 680000,
        expense: 320000,
        profit: 360000,
        profitRate: 52.9,
      },
      [ReportType.HR_SUMMARY]: {
        employees: 125,
        newHires: 3,
        resignations: 1,
        attendanceRate: 96.5,
      },
      [ReportType.SERVICE_SUMMARY]: {
        tickets: 68,
        completionRate: 94.5,
        slaRate: 92,
        satisfaction: 4.8,
      },
      [ReportType.CMS_SUMMARY]: { contents: 234, newContent: 15, pv: 125000, uv: 8500 },
      [ReportType.WORKFLOW_SUMMARY]: {
        instances: 520,
        completionRate: 98.5,
        avgDuration: 2.5,
        timeoutRate: 1.5,
      },
      [ReportType.SYSTEM_SUMMARY]: {
        users: 125,
        activeUsers: 98,
        apiCalls: 52000,
        loginSuccessRate: 99.2,
      },
    }
    return mockDataMap[type] || {}
  }

  private getMockChartData(chart: ChartConfig): any {
    // 生成模拟图表数据
    const metrics = chart.queryConfig.metrics
    const dimensions = chart.queryConfig.dimensions

    if (chart.chartType === ChartType.CARD) {
      return { value: Math.floor(Math.random() * 1000) + 100 }
    }

    if (chart.chartType === ChartType.GAUGE) {
      return { value: Math.floor(Math.random() * 100) }
    }

    if (chart.chartType === ChartType.LINE || chart.chartType === ChartType.AREA) {
      return Array.from({ length: 30 }, (_, i) => ({
        date: dayjs()
          .subtract(30 - i, 'day')
          .format('MM-DD'),
        value: Math.floor(Math.random() * 100) + 50,
      }))
    }

    if (chart.chartType === ChartType.BAR) {
      return Array.from({ length: 5 }, (_, i) => ({
        name: `类别${i + 1}`,
        value: Math.floor(Math.random() * 200) + 50,
      }))
    }

    if (chart.chartType === ChartType.PIE) {
      return Array.from({ length: 5 }, (_, i) => ({
        name: `类型${i + 1}`,
        value: Math.floor(Math.random() * 100) + 20,
      }))
    }

    if (chart.chartType === ChartType.TABLE) {
      return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `项目${i + 1}`,
        value: Math.floor(Math.random() * 1000),
        status: Math.random() > 0.5 ? '完成' : '进行中',
      }))
    }

    return []
  }

  private generateReportSummary(type: ReportType, data: any): string {
    const summaryMap: Partial<Record<ReportType, string>> = {
      [ReportType.CRM_SUMMARY]: `本月CRM业务整体良好，客户数${data.customers}家，销售额${data.sales}元，转化率${data.conversionRate}%`,
      [ReportType.FINANCE_SUMMARY]: `本月财务状况良好，收入${data.income}元，支出${data.expense}元，净利润${data.profit}元`,
      [ReportType.ERP_SUMMARY]: `库存总值${data.inventoryValue}元，周转率${data.turnoverRate}次/月，采购完成率${data.productionRate}%`,
      [ReportType.HR_SUMMARY]: `员工总数${data.employees}人，本月入职${data.newHires}人，离职${data.resignations}人`,
      [ReportType.SERVICE_SUMMARY]: `工单总数${data.tickets}，完成率${data.completionRate}%，客户满意度${data.satisfaction}分`,
      [ReportType.CMS_SUMMARY]: `内容总数${data.contents}篇，本月新增${data.newContent}篇，访问量${data.pv}PV`,
      [ReportType.WORKFLOW_SUMMARY]: `流程实例${data.instances}个，完成率${data.completionRate}%，平均耗时${data.avgDuration}小时`,
      [ReportType.SYSTEM_SUMMARY]: `用户总数${data.users}人，活跃用户${data.activeUsers}人，API调用量${data.apiCalls}次`,
    }
    return summaryMap[type] || '报表生成完成'
  }

  // ========== 报表实例管理 ==========

  async getReports(params?: {
    templateId?: string
    reportType?: ReportType
    status?: ReportStatus
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    let reports = Array.from(this.reports.values())
    if (params?.templateId) reports = reports.filter((r) => r.templateId === params.templateId)
    if (params?.reportType) reports = reports.filter((r) => r.reportType === params.reportType)
    if (params?.status) reports = reports.filter((r) => r.status === params.status)
    if (params?.startDate) reports = reports.filter((r) => r.startDate >= params.startDate!)
    if (params?.endDate) reports = reports.filter((r) => r.endDate <= params.endDate!)

    reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const total = reports.length
    const list = reports.slice((page - 1) * pageSize, page * pageSize)

    return { list, total, page, pageSize }
  }

  async getReport(id: string) {
    return this.reports.get(id)
  }

  async deleteReport(id: string) {
    return this.reports.delete(id)
  }

  async exportReport(id: string, format: ExportFormat) {
    const report = this.reports.get(id)
    if (!report) throw new Error('报表不存在')
    if (report.status !== ReportStatus.COMPLETED) throw new Error('报表未完成')

    return {
      format,
      fileName: `${report.name}.${format.toLowerCase()}`,
      downloadUrl: `/exports/${id}.${format.toLowerCase()}`,
      generatedAt: new Date(),
    }
  }

  // ========== 报表订阅管理 ==========

  async getSubscriptions() {
    return Array.from(this.subscriptions.values())
  }

  async createSubscription(sub: ReportSubscription) {
    sub.id = `SUB-${Date.now()}`
    sub.createdAt = new Date()
    this.subscriptions.set(sub.id, sub)
    return sub
  }

  async updateSubscription(id: string, updates: Partial<ReportSubscription>) {
    const sub = this.subscriptions.get(id)
    if (!sub) return null
    Object.assign(sub, updates)
    this.subscriptions.set(id, sub)
    return sub
  }

  async deleteSubscription(id: string) {
    return this.subscriptions.delete(id)
  }

  async toggleSubscription(id: string, enabled: boolean) {
    const sub = this.subscriptions.get(id)
    if (!sub) return null
    sub.enabled = enabled
    this.subscriptions.set(id, sub)
    return sub
  }

  // ========== 仪表盘管理 ==========

  async getDashboards() {
    return Array.from(this.dashboards.values())
  }

  async getDashboard(id: string) {
    return this.dashboards.get(id)
  }

  async getDefaultDashboard() {
    return Array.from(this.dashboards.values()).find((d) => d.isDefault)
  }

  async createDashboard(dashboard: Dashboard) {
    dashboard.id = `DB-${Date.now()}`
    dashboard.createdAt = new Date()
    dashboard.updatedAt = new Date()
    dashboard.isDefault = false
    this.dashboards.set(dashboard.id, dashboard)
    return dashboard
  }

  async updateDashboard(id: string, updates: Partial<Dashboard>) {
    const dashboard = this.dashboards.get(id)
    if (!dashboard) return null
    Object.assign(dashboard, updates, { updatedAt: new Date() })
    this.dashboards.set(id, dashboard)
    return dashboard
  }

  async deleteDashboard(id: string) {
    const dashboard = this.dashboards.get(id)
    if (!dashboard) return false
    if (dashboard.isDefault) throw new Error('默认仪表盘不可删除')
    return this.dashboards.delete(id)
  }

  async setDefaultDashboard(id: string) {
    // 取消其他默认
    Array.from(this.dashboards.values()).forEach((d) => {
      if (d.isDefault) {
        d.isDefault = false
        this.dashboards.set(d.id, d)
      }
    })
    // 设置新默认
    const dashboard = this.dashboards.get(id)
    if (!dashboard) return null
    dashboard.isDefault = true
    this.dashboards.set(id, dashboard)
    return dashboard
  }

  // ========== KPI指标 ==========

  async getKPIMetrics(params?: { module?: string }) {
    let metrics = Array.from(this.kpiMetrics.values())
    if (params?.module) metrics = metrics.filter((m) => m.module === params.module)
    return metrics
  }

  async refreshKPIs() {
    // 模拟刷新KPI数据
    Array.from(this.kpiMetrics.values()).forEach((kpi) => {
      // 随机波动
      const delta = (Math.random() - 0.5) * 10
      kpi.value = Math.max(0, kpi.value + delta)
      kpi.updatedAt = new Date()

      // 更新趋势
      if (delta > 2) {
        kpi.trend = 'UP'
        kpi.trendValue = delta
      } else if (delta < -2) {
        kpi.trend = 'DOWN'
        kpi.trendValue = Math.abs(delta)
      } else {
        kpi.trend = 'STABLE'
        kpi.trendValue = 0
      }

      // 更新状态
      if (kpi.target) {
        const rate = kpi.value / kpi.target
        kpi.status = rate >= 1 ? 'GOOD' : rate >= 0.8 ? 'WARNING' : 'BAD'
      }

      this.kpiMetrics.set(kpi.id, kpi)
    })

    return Array.from(this.kpiMetrics.values())
  }

  // ========== 数据统计 ==========

  async getStats() {
    return {
      templateCount: this.templates.size,
      reportCount: this.reports.size,
      subscriptionCount: this.subscriptions.size,
      dashboardCount: this.dashboards.size,
      kpiCount: this.kpiMetrics.size,
      completedReports: Array.from(this.reports.values()).filter(
        (r) => r.status === ReportStatus.COMPLETED,
      ).length,
      generatingReports: Array.from(this.reports.values()).filter(
        (r) => r.status === ReportStatus.GENERATING,
      ).length,
    }
  }
}

// 日期处理工具
const dayjs = require('dayjs')
