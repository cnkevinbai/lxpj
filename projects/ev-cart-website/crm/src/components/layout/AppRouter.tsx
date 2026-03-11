import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * 应用路由
 * 根据用户部门自动呈现内贸/外贸界面
 */
const AppRouter: React.FC = () => {
  const { user } = useAuth()

  // 根据用户部门确定业务类型
  const businessType = user?.department === 'foreign' ? 'foreign' : 'domestic'

  // 定义路由
  const routes = [
    // 公共路由
    {
      path: '/crm/login',
      element: <Login />,
    },
    {
      path: '/crm/*',
      element: <Layout />,
      children: [
        // 根据部门自动重定向
        {
          index: true,
          element: <Navigate to={businessType === 'foreign' ? '/crm/foreign-dashboard' : '/crm/dashboard'} replace />,
        },
        
        // 内贸路由
        ...(businessType === 'domestic' ? [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'customers', element: <Customers /> },
          { path: 'leads', element: <Leads /> },
          { path: 'orders', element: <Orders /> },
        ] : []),

        // 外贸路由
        ...(businessType === 'foreign' ? [
          { path: 'foreign-dashboard', element: <ForeignDashboard /> },
          { path: 'foreign-customers', element: <ForeignCustomers /> },
          { path: 'foreign-leads', element: <ForeignLeads /> },
          { path: 'foreign-inquiries', element: <ForeignInquiries /> },
          { path: 'foreign-orders', element: <ForeignOrders /> },
        ] : []),

        // 通用路由
        { path: 'performance', element: <Performance /> },
        { path: 'settings', element: <Settings /> },
      ],
    },
  ]

  return useRoutes(routes)
}

export default AppRouter
