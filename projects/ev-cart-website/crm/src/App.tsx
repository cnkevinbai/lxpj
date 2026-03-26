import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import Login from './pages/Login'

// 官网路由 -WebsiteLayout（公开访问）
const WebsiteLayout = lazy(() => import('./layouts/WebsiteLayout'))

// 门户路由 - PortalLayout（需登录）
const PortalLayout = lazy(() => import('./layouts/PortalLayout'))
const ProtectedRoute = lazy(() => import('./layouts/ProtectedRoute'))

// 页面组件
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const Reports = lazy(() => import('./pages/Reports'))
const MessageCenter = lazy(() => import('./pages/MessageCenter'))
const WorkflowApproval = lazy(() => import('./pages/workflow/WorkflowApproval'))

// 官网页面组件
const OfficialWebsite = lazy(() => import('./pages/website/OfficialWebsite'))
const ProductCenter = lazy(() => import('./pages/website/ProductCenter'))
const ProductDetail = lazy(() => import('./pages/website/ProductDetail'))
const ProductCompare = lazy(() => import('./pages/website/ProductCompare'))
const Solutions = lazy(() => import('./pages/website/Solutions'))
const DealerFranchise = lazy(() => import('./pages/website/DealerFranchise'))
const ServiceSupport = lazy(() => import('./pages/website/ServiceSupport'))
const AboutUs = lazy(() => import('./pages/website/AboutUs'))
const ContactUs = lazy(() => import('./pages/website/ContactUs'))

// 门户子模块路由（按需加载）- 使用占位组件
const CRMModule = lazy(() => import('./pages/Dashboard'))
const ERPModule = lazy(() => import('./pages/Dashboard'))
const FinanceModule = lazy(() => import('./pages/Dashboard'))
const AfterSalesModule = lazy(() => import('./pages/Dashboard'))
const HRModule = lazy(() => import('./pages/Dashboard'))
const CMSModule = lazy(() => import('./pages/Dashboard'))
const ReportsModule = lazy(() => import('./pages/Dashboard'))
const ApprovalModule = lazy(() => import('./pages/Dashboard'))

// 简单的加载占位组件
const LoadingFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: 48,
          height: 48,
          border: '4px solid #f0f0f0',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }}
      />
      <p style={{ color: '#666', fontSize: 16 }}>加载中...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

// 鉴权路由包裹组件
const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    <ProtectedRoute>{children}</ProtectedRoute>
  </Suspense>
)

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Suspense fallback={<LoadingFallback />}>
        <BrowserRouter>
          <Routes>
            {/* 登录页 */}
            <Route path="/login" element={<Login />} />
            
            {/* 403 禁止访问 */}
            <Route path="/403" element={<div style={{textAlign:'center',padding:'100px'}}>403 禁止访问</div>} />
            
            {/* 404 未找到 */}
            <Route path="/404" element={<div style={{textAlign:'center',padding:'100px'}}>404 未找到</div>} />
            
            {/* 重定向到 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
            
            {/* 官网路由 -WebsiteLayout（公开访问） */}
            <Route path="/" element={<WebsiteLayout />}>
              <Route index element={<OfficialWebsite />} />
              <Route path="products" element={<ProductCenter />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="products/compare" element={<ProductCompare />} />
              <Route path="solutions" element={<Solutions />} />
              <Route path="dealer" element={<DealerFranchise />} />
              <Route path="service" element={<ServiceSupport />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="contact" element={<ContactUs />} />
            </Route>

            {/* 门户路由 - PortalLayout（需登录） */}
            <Route
              path="/portal/*"
              element={
                <AuthenticatedRoute>
                  <PortalLayout />
                </AuthenticatedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="crm/*" element={<CRMModule />} />
              <Route path="erp/*" element={<ERPModule />} />
              <Route path="finance/*" element={<FinanceModule />} />
              <Route path="after-sales/*" element={<AfterSalesModule />} />
              <Route path="hr/*" element={<HRModule />} />
              <Route path="cms/*" element={<CMSModule />} />
              <Route path="messages" element={<MessageCenter />} />
              <Route path="approval/*" element={<ApprovalModule />} />
              <Route path="reports/*" element={<ReportsModule />} />
              <Route path="settings/*" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ConfigProvider>
  )
}

export default App
