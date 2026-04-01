/**
 * 门户路由配置
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { Spin } from 'antd'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CRM from './pages/crm/CRM'
import ERP from './pages/erp/ERP'
import Finance from './pages/finance/Finance'
import Service from './pages/service/Service'
import HR from './pages/hr/HR'
import Message from './pages/message/Message'
import Settings from './pages/settings/Settings'
import NotFound from './pages/NotFound'
import { useModuleStore } from './stores/moduleStore'

// 懒加载 Workflow 页面
const WorkflowPending = lazy(() => import('./pages/workflow/PendingApproval'))
const WorkflowInitiated = lazy(() => import('./pages/workflow/WorkflowInitiated'))
const WorkflowApproved = lazy(() => import('./pages/workflow/WorkflowApproved'))
const WorkflowDefinitions = lazy(() => import('./pages/workflow/WorkflowDefinitionList'))

// 懒加载 Notification 页面
const NotificationCenter = lazy(() => import('./pages/notification/NotificationCenter'))
const NotificationTemplates = lazy(() => import('./pages/notification/NotificationTemplates'))
const NotificationPreferences = lazy(() => import('./pages/notification/NotificationPreference'))

// 懒加载包装器
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    }>
      {children}
    </Suspense>
  )
}

// 懒加载保护路由
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  // 获取已启用的模块
  const enabledModules = useModuleStore(state => state.enabledModules)
  const fetchModules = useModuleStore(state => state.fetchModules)

  // 应用启动时加载模块配置
  useEffect(() => {
    fetchModules()
  }, [fetchModules])

  // 路由定义（支持模块过滤）
  const allRoutes = [
    { path: '/dashboard', element: <Dashboard />, module: null },
    // Workflow 路由
    { path: '/workflow/pending', element: <LazyWrapper><WorkflowPending /></LazyWrapper>, module: 'workflow' },
    { path: '/workflow/initiated', element: <LazyWrapper><WorkflowInitiated /></LazyWrapper>, module: 'workflow' },
    { path: '/workflow/approved', element: <LazyWrapper><WorkflowApproved /></LazyWrapper>, module: 'workflow' },
    { path: '/workflow/definitions', element: <LazyWrapper><WorkflowDefinitions /></LazyWrapper>, module: 'workflow' },
    // Notification 路由
    { path: '/notification/center', element: <LazyWrapper><NotificationCenter /></LazyWrapper>, module: 'notification' },
    { path: '/notification/templates', element: <LazyWrapper><NotificationTemplates /></LazyWrapper>, module: 'notification' },
    { path: '/notification/preferences', element: <LazyWrapper><NotificationPreferences /></LazyWrapper>, module: 'notification' },
    // 其他模块路由
    { path: '/crm/*', element: <CRM />, module: 'crm' },
    { path: '/erp/*', element: <ERP />, module: 'erp' },
    { path: '/finance/*', element: <Finance />, module: 'finance' },
    { path: '/service/*', element: <Service />, module: 'service' },
    { path: '/hr/*', element: <HR />, module: 'hr' },
    { path: '/message', element: <Message />, module: null },
    { path: '/settings/*', element: <Settings />, module: 'settings' },
  ]

  // 过滤路由：公共路由（module 为空）或已启用的模块
  const filteredRoutes = allRoutes.filter(route => {
    if (!route.module) return true // 公共路由
    return enabledModules.includes(route.module)
  })

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        {filteredRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}