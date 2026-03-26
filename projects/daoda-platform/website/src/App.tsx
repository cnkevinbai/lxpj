/**
 * 官网路由配置
 */
import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Solutions from './pages/Solutions'
import SolutionDetail from './pages/SolutionDetail'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import CRM from './pages/CRM'
import ERP from './pages/ERP'
import Cases from './pages/Cases'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      {/* 首页独立布局（深色主题） */}
      <Route index element={<Home />} />
      
      {/* 登录页独立布局 */}
      <Route path="login" element={<Login />} />
      
      {/* CRM客户管理独立布局 */}
      <Route path="portal/crm" element={<CRM />} />
      
      {/* ERP库存管理独立布局 */}
      <Route path="erp/dashboard" element={<ERP />} />
      
      {/* 成功案例中心独立布局 */}
      <Route path="cases" element={<Cases />} />
      
      {/* 新闻中心独立布局 */}
      <Route path="news" element={<News />} />
      <Route path="news/:id" element={<NewsDetail />} />
      
      {/* 其他页面使用标准布局 */}
      <Route path="/" element={<Layout />}>
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="solutions/:id" element={<SolutionDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}