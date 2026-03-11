import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { AuthProvider, useAuth } from './hooks/useAuth'
import SideMenu from './components/layout/SideMenu'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ForeignDashboard from './pages/ForeignDashboard'
import MobileDashboard from './pages/MobileDashboard'
import ForeignMobileDashboard from './pages/ForeignMobileDashboard'
import LeadCreate from './pages/LeadCreate'
import CustomerCreate from './pages/CustomerCreate'
import FollowUpLog from './pages/FollowUpLog'
import SalesPerformance from './pages/SalesPerformance'
import PermissionPanel from './pages/PermissionPanel'

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>
  }

  if (!user) {
    return <Navigate to="/crm/login" replace />
  }

  return <>{children}</>
}

// 主布局组件
function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
        <SideMenu collapsed={collapsed} />
      </div>

      {/* 主内容区 */}
      <div className={`flex-1 overflow-auto ${collapsed ? 'ml-0' : ''}`}>
        {/* 顶部导航 */}
        <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {collapsed ? '☰' : '✕'}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">欢迎，{useAuth().user?.username}</span>
          </div>
        </div>

        {/* 页面内容 */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  const businessType = user?.department === 'foreign' ? 'foreign' : 'domestic'

  return (
    <Routes>
      {/* 登录页面 */}
      <Route path="/crm/login" element={<Login />} />

      {/* 受保护的路由 */}
      <Route
        path="/crm/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* 默认重定向 */}
                <Route
                  index
                  element={
                    <Navigate
                      to={businessType === 'foreign' ? '/crm/foreign-dashboard' : '/crm/dashboard'}
                      replace
                    />
                  }
                />

                {/* 内贸路由 */}
                {businessType === 'domestic' && (
                  <>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="mobile" element={<MobileDashboard />} />
                    <Route path="leads/create" element={<LeadCreate />} />
                    <Route path="customers/create" element={<CustomerCreate />} />
                  </>
                )}

                {/* 外贸路由 */}
                {businessType === 'foreign' && (
                  <>
                    <Route path="foreign-dashboard" element={<ForeignDashboard />} />
                    <Route path="foreign-mobile" element={<ForeignMobileDashboard />} />
                  </>
                )}

                {/* 通用路由 */}
                <Route path="follow-up/:targetType/:targetId" element={<FollowUpLog />} />
                <Route path="performance" element={<SalesPerformance />} />
                <Route path="permissions" element={<PermissionPanel />} />
                <Route path="recommendations" element={<SmartRecommendations />} />
                <Route path="data-viz" element={<DataVisualization />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 默认重定向到登录 */}
      <Route path="/" element={<Navigate to="/crm/login" replace />} />
      <Route path="*" element={<Navigate to="/crm/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
