import { SettingOutlined } from '@ant-design/icons'
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
  
  // CRM - 客户关系管理
  { 
    key: '/crm', 
    label: '客户管理', 
    module: 'crm',
    children: [
      { key: '/crm/customers', label: '客户列表', path: '/crm/customers' },
      { key: '/crm/leads', label: '线索管理', path: '/crm/leads' },
      { key: '/crm/opportunities', label: '商机管理', path: '/crm/opportunities' },
      { key: '/crm/orders', label: '订单管理', path: '/crm/orders' },
      { key: '/crm/quotations', label: '报价管理', path: '/crm/quotations' },
    ]
  },
  
  // ERP - 企业资源计划
  { 
    key: '/erp', 
    label: '运营管理', 
    module: 'erp',
    children: [
      { key: '/erp/purchase', label: '采购管理', path: '/erp/purchase' },
      { key: '/erp/inventory', label: '库存管理', path: '/erp/inventory' },
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