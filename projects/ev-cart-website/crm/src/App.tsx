import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Layout from './layout/Layout'

// 经销商管理页面
import Dealers from './pages/dealers/Dealers'
import DealerDetail from './pages/dealers/DealerDetail'
import DealerAssessment from './pages/dealers/DealerAssessment'
import DealerRebate from './pages/dealers/DealerRebate'
import DealerLevel from './pages/dealers/DealerLevel'
import DealerAnalytics from './pages/dealers/DealerAnalytics'
import CreateDealer from './pages/dealers/CreateDealer'
import EditDealer from './pages/dealers/EditDealer'

// 招聘管理页面
import Jobs from './pages/jobs/Jobs'
import CreateJob from './pages/jobs/CreateJob'
import JobDetail from './pages/jobs/JobDetail'
import Resumes from './pages/jobs/Resumes'
import Interviews from './pages/jobs/Interviews'
import RecruitmentAnalytics from './pages/jobs/RecruitmentAnalytics'

// 其他现有页面
import Dashboard from './pages/Dashboard'
import Customers from './pages/customers/Customers'
import Orders from './pages/orders/Orders'
import Products from './pages/products/Products'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import MessageCenter from './pages/MessageCenter'
import Finance from './pages/Finance'
import Inventory from './pages/Inventory'

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          {/* 登录页面 */}
          <Route path="/login" element={<Login />} />
          
          {/* 主布局路由 */}
          <Route path="/" element={<Layout />}>
            {/* 默认跳转 */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* 仪表盘 */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* 客户管理 */}
            <Route path="customers" element={<Customers />} />
            
            {/* 订单管理 */}
            <Route path="orders" element={<Orders />} />
            
            {/* 产品管理 */}
            <Route path="products" element={<Products />} />
            
            {/* 经销商管理 */}
            <Route path="dealers" element={<Dealers />} />
            <Route path="dealers/create" element={<CreateDealer />} />
            <Route path="dealers/:id" element={<DealerDetail />} />
            <Route path="dealers/:id/edit" element={<EditDealer />} />
            <Route path="dealers/:id/assessments" element={<DealerAssessment />} />
            <Route path="dealers/:id/rebates" element={<DealerRebate />} />
            <Route path="dealers/:id/levels" element={<DealerLevel />} />
            <Route path="dealers/analytics" element={<DealerAnalytics />} />
            
            {/* 招聘管理 */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="jobs/:id/edit" element={<EditDealer />} />
            <Route path="resumes" element={<Resumes />} />
            <Route path="interviews" element={<Interviews />} />
            <Route path="recruitment/analytics" element={<RecruitmentAnalytics />} />
            
            {/* 系统设置 */}
            <Route path="settings" element={<Settings />} />
            
            {/* 报表中心 */}
            <Route path="reports" element={<Reports />} />
            
            {/* 消息中心 */}
            <Route path="messages" element={<MessageCenter />} />
            
            {/* 财务管理 */}
            <Route path="finance" element={<Finance />} />
            
            {/* 库存管理 */}
            <Route path="inventory" element={<Inventory />} />
            
            {/* 404 重定向 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
