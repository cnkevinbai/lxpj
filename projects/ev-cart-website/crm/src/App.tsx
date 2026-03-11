import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Login from './pages/Login'
import CRMLayout from './components/layout/CRMLayout'
import Dashboard from './pages/Dashboard'
import CustomerList from './pages/Customers'
import LeadList from './pages/Leads'
import Opportunities from './pages/Opportunities'
import Orders from './pages/Orders'
import ProductList from './pages/Products'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Settings from './pages/Settings'
import Integration from './pages/Integration'
import Dealers from './pages/Dealers'
import Jobs from './pages/Jobs'
import Export from './pages/Export'
import LeadCreate from './pages/LeadCreate'
import CustomerCreate from './pages/CustomerCreate'
import MobileDashboard from './pages/MobileDashboard'
import Solutions from './pages/Solutions'
import Cases from './pages/Cases'

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          {/* 公开路由 */}
          <Route path="/login" element={<Login />} />
          
          {/* 受保护路由 */}
          <Route
            path="/"
            element={
              <CRMLayout />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="leads" element={<LeadList />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<ProductList />} />
            <Route path="dealers" element={<Dealers />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="export" element={<Export />} />
            <Route path="leads/create" element={<LeadCreate />} />
            <Route path="customers/create" element={<CustomerCreate />} />
            <Route path="mobile" element={<MobileDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="settings" element={<Settings />} />
            <Route path="integration" element={<Integration />} />
          </Route>

          {/* 官网路由 */}
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/cases" element={<Cases />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
