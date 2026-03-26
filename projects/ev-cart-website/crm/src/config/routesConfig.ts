// 路由配置简化版
// 由于路由懒加载需要每个组件导出 ReactComponent，这里仅导出路由配置对象
// 实际使用时需要在 App.tsx 中导入并处理

export const websiteRoutes = [
  { path: '/', component: 'OfficialWebsite' },
  { path: '/products', component: 'ProductCenter' },
  { path: '/products/:id', component: 'ProductDetail' },
  { path: '/products/compare', component: 'ProductCompare' },
  { path: '/solutions', component: 'Solutions' },
  { path: '/dealer', component: 'DealerFranchise' },
  { path: '/service', component: 'ServiceSupport' },
  { path: '/about', component: 'AboutUs' },
  { path: '/contact', component: 'ContactUs' },
]

export const portalRoutes = [
  { path: 'dashboard', component: 'Dashboard' },
  { path: 'crm/*', children: [
    { path: 'customers', component: 'CustomerList' },
    { path: 'sales', component: 'SalesManagement' },
    { path: 'opportunities', component: 'Opportunities' },
    { path: 'contacts', component: 'Contacts' },
  ]},
  { path: 'erp/*', children: [
    { path: 'purchase', component: 'Purchase' },
    { path: 'production', component: 'Production' },
    { path: 'inventory', component: 'Inventory' },
  ]},
  { path: 'finance/*', children: [
    { path: 'accounting', component: 'Accounting' },
    { path: 'cost', component: 'Cost' },
    { path: 'assets', component: 'Assets' },
  ]},
  { path: 'after-sales/*', children: [
    { path: 'tickets', component: 'Tickets' },
    { path: 'process', component: 'Process' },
    { path: 'reviews', component: 'Reviews' },
  ]},
  { path: 'hr/*', children: [
    { path: 'employees', component: 'Employees' },
    { path: 'recruitment', component: 'Recruitment' },
    { path: 'attendance', component: 'Attendance' },
  ]},
  { path: 'cms/*', children: [
    { path: 'content', component: 'Content' },
    { path: 'website', component: 'Website' },
  ]},
  { path: 'messages', component: 'MessageCenter' },
  { path: 'approval/*', children: [
    { path: 'my', component: 'MyApprovals' },
    { path: 'pending', component: 'PendingApprovals' },
    { path: 'history', component: 'ApprovalHistory' },
    { path: 'templates', component: 'ApprovalTemplates' },
  ]},
  { path: 'reports/*', children: [
    { path: 'dashboards', component: 'Dashboards' },
    { path: 'analytics', component: 'Analytics' },
  ]},
  { path: 'settings/*', children: [
    { path: 'general', component: 'General' },
    { path: 'users', component: 'Users' },
    { path: 'permissions', component: 'Permissions' },
  ]},
]
