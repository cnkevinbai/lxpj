import type { MenuProps } from 'antd'

// 简化的菜单项类型（不包含 JSX）
export interface MenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  children?: MenuItem[]
}

// 门户系统菜单配置（按 10 大系统组织）
export const portalMenuConfig: MenuItem[] = [
  {
    key: '/portal/crm',
    label: 'CRM 客户管理',
    children: [
      { key: '/portal/crm/customers', label: '客户管理' },
      { key: '/portal/crm/sales', label: '销售管理' },
      { key: '/portal/crm/opportunities', label: '商机管理' },
      { key: '/portal/crm/contacts', label: '联系人管理' },
    ],
  },
  {
    key: '/portal/erp',
    label: 'ERP 供应链',
    children: [
      { key: '/portal/erp/purchase', label: '采购管理' },
      { key: '/portal/erp/production', label: '生产管理' },
      { key: '/portal/erp/inventory', label: '库存管理' },
      { key: '/portal/erp/supply-chain', label: '供应链管理' },
    ],
  },
  {
    key: '/portal/finance',
    label: '财务会计',
    children: [
      { key: '/portal/finance/accounting', label: '财务核算' },
      { key: '/portal/finance/cost', label: '成本管理' },
      { key: '/portal/finance/assets', label: '资产管理' },
      { key: '/portal/finance/budget', label: '预算管理' },
    ],
  },
  {
    key: '/portal/after-sales',
    label: '售后服务',
    children: [
      { key: '/portal/after-sales/tickets', label: '服务工单' },
      { key: '/portal/after-sales/process', label: '服务流程' },
      { key: '/portal/after-sales/reviews', label: '客户评价' },
      { key: '/portal/after-sales/knowledge', label: '知识库' },
    ],
  },
  {
    key: '/portal/hr',
    label: '人力资源',
    children: [
      { key: '/portal/hr/employees', label: '人事管理' },
      { key: '/portal/hr/recruitment', label: '招聘管理' },
      { key: '/portal/hr/attendance', label: '考勤管理' },
      { key: '/portal/hr/training', label: '培训管理' },
    ],
  },
  {
    key: '/portal/cms',
    label: '内容管理',
    children: [
      { key: '/portal/cms/content', label: '内容管理' },
      { key: '/portal/cms/website', label: '官网管理' },
      { key: '/portal/cms/media', label: '媒体库' },
    ],
  },
  {
    key: '/portal/messages',
    label: '消息中心',
    children: [
      { key: '/portal/messages/all', label: '全部消息' },
      { key: '/portal/messages/notifications', label: '系统通知' },
      { key: '/portal/messages/announcements', label: '公告管理' },
    ],
  },
  {
    key: '/portal/approval',
    label: '审批流程',
    children: [
      { key: '/portal/approval/my', label: '我的审批' },
      { key: '/portal/approval/pending', label: '待审批' },
      { key: '/portal/approval/history', label: '审批记录' },
      { key: '/portal/approval/templates', label: '流程模板' },
    ],
  },
  {
    key: '/portal/reports',
    label: '数据报表',
    children: [
      { key: '/portal/reports/dashboards', label: '数据看板' },
      { key: '/portal/reports/analytics', label: '数据分析' },
      { key: '/portal/reports/export', label: '数据导出' },
      { key: '/portal/reports/automated', label: '自动报表' },
    ],
  },
  {
    key: '/portal/settings',
    label: '系统设置',
    children: [
      { key: '/portal/settings/general', label: '系统设置' },
      { key: '/portal/settings/users', label: '用户管理' },
      { key: '/portal/settings/permissions', label: '权限管理' },
      { key: '/portal/settings/logs', label: '操作日志' },
    ],
  },
]

export interface PortalApplication {
  name: string
  icon: React.ReactNode
  color: string
  desc: string
  status: 'running' | 'stopped' | 'maintenance'
  path: string
}

export interface PortalApplicationCategory {
  category: string
  apps: PortalApplication[]
}

// 门户快速访问应用配置
export const portalApplications: PortalApplicationCategory[] = [
  {
    category: '业务系统',
    apps: [
      {
        name: 'CRM 客户管理',
        icon: null! as React.ReactNode, // 这里占位，实际在 PortalLayout 中使用
        color: '#1890ff',
        desc: '客户关系管理与销售自动化',
        status: 'running',
        path: '/portal/crm/customers',
      },
    ],
  },
]

// 顶部导航菜单（官网）
export const websiteMenuConfig: MenuItem[] = [
  { key: '/', label: '首页' },
  { key: '/products', label: '产品中心' },
  { key: '/solutions', label: '解决方案' },
  { key: '/dealer', label: '经销商' },
  { key: '/service', label: '服务' },
  { key: '/about', label: '关于我们' },
]

// 用户菜单（登录后）
export const userMenuConfig: MenuItem[] = [
  { key: 'profile', label: '个人中心' },
  { key: 'logout', label: '退出登录' },
]
