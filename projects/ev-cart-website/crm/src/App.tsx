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

// 占位页面
const Placeholder = ({ title }: { title: string }) => (
  <div>
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-500">开发中...</p>
  </div>
)

// 受保护路由
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

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
              <ProtectedRoute>
                <CRMLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="leads" element={<LeadList />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<ProductList />} />
            <Route path="dealers" element={<Placeholder title="经销商管理" />} />
            <Route path="jobs" element={<Placeholder title="招聘管理" />} />
            <Route path="settings" element={<Placeholder title="系统设置" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
