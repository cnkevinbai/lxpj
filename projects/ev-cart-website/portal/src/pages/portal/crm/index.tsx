import { Routes, Route } from 'react-router-dom'
import Customers from './Customers'

// CRM 模块占位组件
const CRMPlaceholder = () => (
  <div style={{ padding: '24px' }}>
    <h1>CRM 系统</h1>
    <p>客户管理、商机管理、订单管理等功能模块</p>
  </div>
)

const CRMModule = () => {
  return (
    <Routes>
      <Route index element={<CRMPlaceholder />} />
      <Route path="customers" element={<Customers />} />
      <Route path="opportunities" element={<CRMPlaceholder />} />
      <Route path="orders" element={<CRMPlaceholder />} />
    </Routes>
  )
}

export default CRMModule
