import { SettingOutlined, CheckSquareOutlined, BellOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

export interface MenuDataType {
  key: string
  label: string
  icon?: React.ReactNode
  path?: string
  module?: string
  children?: MenuDataType[]
}

// 内部数据结构 - 根据实际业务模块配置
const menuData: MenuDataType[] = [
  { key: '/dashboard', label: '工作台', path: '/dashboard' },
  
  // Workflow - 审批流程
  { 
    key: '/workflow', 
    label: '审批流程', 
    module: 'workflow',
    icon: <CheckSquareOutlined />,
    children: [
      { key: '/workflow/pending', label: '我的待审批', path: '/workflow/pending' },
      { key: '/workflow/initiated', label: '我发起的', path: '/workflow/initiated' },
      { key: '/workflow/approved', label: '已审批', path: '/workflow/approved' },
      { key: '/workflow/definitions', label: '流程定义', path: '/workflow/definitions' },
    ]
  },
  
  // Notification - 消息通知
  { 
    key: '/notification', 
    label: '消息中心', 
    module: 'notification',
    icon: <BellOutlined />,
    children: [
      { key: '/notification/center', label: '消息列表', path: '/notification/center' },
      { key: '/notification/templates', label: '消息模板', path: '/notification/templates' },
      { key: '/notification/preferences', label: '偏好设置', path: '/notification/preferences' },
    ]
  },
  
  // CRM - 客户关系管理
  { 
    key: '/crm', 
    label: '客户管理', 
    module: 'crm',
    children: [
      { key: '/crm/customers', label: '客户列表', path: '/crm/customers' },
      { key: '/crm/pool', label: '客户公海池', path: '/crm/pool' },
      { key: '/crm/follow-ups', label: '跟进记录', path: '/crm/follow-ups' },
      { key: '/crm/leads', label: '线索管理', path: '/crm/leads' },
      { key: '/crm/lead-scoring', label: '线索评分', path: '/crm/lead-scoring' },
      { key: '/crm/opportunities', label: '商机管理', path: '/crm/opportunities' },
      { key: '/crm/funnel', label: '销售漏斗', path: '/crm/funnel' },
      { key: '/crm/orders', label: '订单管理', path: '/crm/orders' },
      { key: '/crm/quotations', label: '报价管理', path: '/crm/quotations' },
      { key: '/crm/prediction', label: '销售预测', path: '/crm/prediction' },
      { key: '/crm/performance', label: '业绩分析', path: '/crm/performance' },
    ]
  },
  
  // ERP - 企业资源计划
  { 
    key: '/erp', 
    label: '运营管理', 
    module: 'erp',
    children: [
      { key: '/erp/purchase', label: '采购管理', path: '/erp/purchase' },
      { key: '/erp/suppliers', label: '供应商管理', path: '/erp/suppliers' },
      { key: '/erp/inventory', label: '库存管理', path: '/erp/inventory' },
      { key: '/erp/inventory-warning', label: '库存预警', path: '/erp/inventory-warning' },
      { key: '/erp/inventory-transfer', label: '库存调拨', path: '/erp/inventory-transfer' },
      { key: '/erp/inventory-check', label: '库存盘点', path: '/erp/inventory-check' },
      { key: '/erp/quality-inspection', label: '质检管理', path: '/erp/quality-inspection' },
      { key: '/erp/production', label: '生产管理', path: '/erp/production' },
      { key: '/erp/products', label: '产品管理', path: '/erp/products' },
      { key: '/erp/bom', label: '物料清单', path: '/erp/bom' },
      { key: '/erp/production-plans', label: '生产计划', path: '/erp/production-plans' },
    ]
  },
  
  // Finance - 财务管理
  { 
    key: '/finance', 
    label: '财务管理', 
    module: 'finance',
    children: [
      { key: '/finance/overview', label: '财务概览', path: '/finance/overview' },
      { key: '/finance/receivables', label: '应收管理', path: '/finance/receivables' },
      { key: '/finance/payables', label: '应付管理', path: '/finance/payables' },
      { key: '/finance/invoices', label: '发票管理', path: '/finance/invoices' },
      { key: '/finance/reports', label: '财务报表', path: '/finance/reports' },
      { key: '/finance/cost', label: '成本核算', path: '/finance/cost' },
    ]
  },
  
  // Finance - 财务管理
  { 
    key: '/finance', 
    label: '财务管理', 
    module: 'finance',
    children: [
      { key: '/finance/overview', label: '财务概览', path: '/finance/overview' },
      { key: '/finance/receivables', label: '应收管理', path: '/finance/receivables' },
      { key: '/finance/payables', label: '应付管理', path: '/finance/payables' },
      { key: '/finance/invoices', label: '发票管理', path: '/finance/invoices' },
      { key: '/finance/reports', label: '财务报表', path: '/finance/reports' },
    ]
  },
  
  // Service - 售后服务
  { 
    key: '/service', 
    label: '售后服务', 
    module: 'service',
    children: [
      { key: '/service/tickets', label: '工单管理', path: '/service/tickets' },
      { key: '/service/contracts', label: '合同管理', path: '/service/contracts' },
      { key: '/service/parts', label: '配件管理', path: '/service/parts' },
    ]
  },
  
  // HR - 人事管理
  { 
    key: '/hr', 
    label: '人事管理', 
    module: 'hr',
    children: [
      { key: '/hr/employees', label: '员工管理', path: '/hr/employees' },
      { key: '/hr/attendance', label: '考勤管理', path: '/hr/attendance' },
      { key: '/hr/leave-approval', label: '请假审批', path: '/hr/leave-approval' },
      { key: '/hr/salary', label: '薪资管理', path: '/hr/salary' },
    ]
  },
  
  // Settings - 系统设置
  { 
    key: '/settings', 
    label: '系统设置', 
    module: 'settings', 
    icon: <SettingOutlined />,
    children: [
      { key: '/settings/users', label: '用户管理', path: '/settings/users' },
      { key: '/settings/roles', label: '角色管理', path: '/settings/roles' },
      { key: '/settings/tenants', label: '租户管理', path: '/settings/tenants' },
      { key: '/settings/menus', label: '菜单管理', path: '/settings/menus' },
      { key: '/settings/modules', label: '模块管理', path: '/settings/modules' },
      { key: '/settings/api-keys', label: 'API密钥', path: '/settings/api-keys' },
      { key: '/settings/webhooks', label: 'Webhook', path: '/settings/webhooks' },
      { key: '/settings/logs', label: '系统日志', path: '/settings/logs' },
      { key: '/settings/system', label: '系统配置', path: '/settings/system' },
    ]
  },
]

// 转换为 Ant Design Menu 兼容格式
function toMenuItems(items: MenuDataType[]): MenuItem[] {
  return items.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    children: item.children ? toMenuItems(item.children) : undefined,
  }))
}

// 导出兼容 Ant Design 的菜单项
export const menuItems: MenuItem[] = toMenuItems(menuData)

// 过滤菜单并返回兼容格式
export function filterMenuByModules(items: MenuDataType[], enabledModules: string[]): MenuItem[] {
  const filtered = items
    .filter(item => !item.module || enabledModules.includes(item.module))
    .map(item => ({
      ...item,
      children: item.children ? filterMenuByModules(item.children, enabledModules) : undefined,
    }))
  return toMenuItems(filtered as MenuDataType[])
}

// 导出原始数据供其他用途
export { menuData }