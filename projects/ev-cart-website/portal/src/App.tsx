import { Routes, Route, Navigate } from 'react-router-dom'

// 官网页面
import Home from './pages/website/Home'
import Solutions from './pages/website/Solutions'
import About from './pages/website/About'
import Contact from './pages/website/Contact'

// 认证页面
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// 内部系统页面
import Dashboard from './pages/portal/Dashboard'
import CRM from './pages/portal/crm/CRM'
import ERP from './pages/portal/erp/ERP'
import Finance from './pages/portal/finance/Finance'
import HR from './pages/portal/hr/HR'
import CMS from './pages/portal/cms/CMS'
import MessageCenter from './pages/portal/message/MessageCenter'
import ForeignTrade from './pages/portal/foreign/ForeignTrade'
import AfterSales from './pages/portal/aftersales/AfterSales'

function App() {
  return (
    <Routes>
      {/* 官网路由 */}
      <Route path="/" element={<Home />} />
      <Route path="/solutions" element={<Solutions />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* 认证路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 内部系统路由 */}
      <Route path="/portal" element={<Dashboard />} />
      <Route path="/portal/crm" element={<CRM />} />
      <Route path="/portal/erp" element={<ERP />} />
      <Route path="/portal/finance" element={<Finance />} />

      {/* 404 重定向 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
